import type { APIRoute } from "astro";
import {
  verifyStripeCommercePayment,
  verifyStripeWalletPayment,
  verifyStripeSessionPayment,
  verifyStripeWebhookSignature,
} from "../../../../../../server/aggregator/payments/stripe.ts";
import {
  getCommerceOrder,
  getCommercePaymentAttempt,
  markCommercePaymentFailed,
  markCommercePaymentPaid,
} from "../../../../../../server/aggregator/commerce-orders.ts";
import { resolveSecretBinding } from "../../../../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import {
  getSessionEntitlement,
  getSessionPaymentAttempt,
  markSessionPaymentFailed,
  markSessionPaymentPaid,
} from "../../../../../../server/aggregator/session-entitlements.ts";
import {
  getWalletPaymentAttempt,
  getWalletRecharge,
  markWalletRechargeFailed,
  markWalletRechargePaid,
} from "../../../../../../server/aggregator/wallet-store.ts";
import {
  getRuntimeEnv,
  requirePost,
} from "../../../../../../server/generated-site/request.ts";
import { jsonResponse } from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.payment-webhook.stripe";
const actionableEvents = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.expired",
  "checkout.session.async_payment_failed",
]);

const acknowledgement = (
  decision: "accepted" | "ignored" | "rejected" | "duplicate",
  message: string,
  status = 200,
) =>
  jsonResponse(
    {
      status: decision === "rejected" ? "error" : "ready",
      state: decision === "rejected" ? "error" : "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message,
      data: { provider: "stripe", decision },
    },
    { status },
  );

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const rawBody = await context.request.text();
  const valid = await verifyStripeWebhookSignature({
    secret: await resolveSecretBinding(env, "STRIPE_WEBHOOK_SECRET"),
    rawBody,
    signatureHeader: context.request.headers.get("stripe-signature") ?? "",
  });
  if (!valid) {
    return acknowledgement(
      "rejected",
      "Stripe webhook signature is invalid.",
      403,
    );
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return acknowledgement("ignored", "Signed Stripe payload is malformed.");
  }
  const eventId = safeString(event.id);
  const eventType = safeString(event.type);
  if (!eventId || !actionableEvents.has(eventType)) {
    return acknowledgement("ignored", "Stripe event is not actionable.");
  }
  const session =
    ((event.data as Record<string, unknown> | undefined)?.object as
      | Record<string, unknown>
      | undefined) ?? {};
  const metadata =
    session.metadata &&
    typeof session.metadata === "object" &&
    !Array.isArray(session.metadata)
      ? (session.metadata as Record<string, unknown>)
      : {};
  const payableType = safeString(metadata.payableType);
  if (payableType === "wallet_recharge") {
    const rechargeId = safeString(metadata.payableId) || safeString(session.client_reference_id);
    const attemptId = safeString(metadata.attemptId);
    const sessionId = safeString(session.id);
    const [recharge, attempt] = await Promise.all([
      getWalletRecharge(env, rechargeId),
      getWalletPaymentAttempt(env, attemptId),
    ]);
    if (!recharge || !attempt || attempt.payableId !== recharge.id || attempt.accountId !== recharge.accountId || (attempt.providerOrderId && attempt.providerOrderId !== sessionId))
      return acknowledgement("ignored", "Stripe wallet target did not match.");
    const isPaid = eventType === "checkout.session.completed" || eventType === "checkout.session.async_payment_succeeded";
    if (isPaid) {
      const verification = verifyStripeWalletPayment({ payable: recharge, attemptId, session });
      if (!verification.ok) return acknowledgement("ignored", verification.message);
      const result = await markWalletRechargePaid({
        env, rechargeId, attemptId, sessionId,
        paymentIntentId: safeString(session.payment_intent) || sessionId,
        eventId, eventStatus: "paid",
      });
      if (!result.ok) return acknowledgement("ignored", result.message);
      return acknowledgement(result.duplicate ? "duplicate" : "accepted", result.duplicate ? "Stripe wallet event was already reconciled." : "Stripe wallet payment reconciled.");
    }
    if (attempt.status === "paid") return acknowledgement("ignored", "A failure event cannot downgrade a paid wallet recharge.");
    await markWalletRechargeFailed({ env, rechargeId, attemptId, status: eventType === "checkout.session.expired" ? "expired" : "failed", eventId, sessionId });
    return acknowledgement("accepted", "Stripe wallet failure state reconciled.");
  }
  if (payableType === "commerce_order") {
    const orderId =
      safeString(metadata.payableId) || safeString(session.client_reference_id);
    const attemptId = safeString(metadata.attemptId);
    const sessionId = safeString(session.id);
    const [order, attempt] = await Promise.all([
      getCommerceOrder(env, orderId),
      getCommercePaymentAttempt(env, attemptId),
    ]);
    if (
      !order ||
      !attempt ||
      attempt.payableId !== order.id ||
      attempt.accountId !== order.accountId ||
      (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
    ) {
      return acknowledgement(
        "ignored",
        "Stripe commerce target did not match.",
      );
    }
    const isPaid =
      eventType === "checkout.session.completed" ||
      eventType === "checkout.session.async_payment_succeeded";
    if (isPaid) {
      const verification = verifyStripeCommercePayment({
        payable: order,
        attemptId,
        session,
      });
      if (!verification.ok)
        return acknowledgement("ignored", verification.message);
      const result = await markCommercePaymentPaid({
        env,
        orderId,
        attemptId,
        sessionId,
        paymentIntentId: safeString(session.payment_intent) || sessionId,
        eventId,
        eventStatus: "paid",
        siteOrigin: new URL(context.request.url).origin,
      });
      if (!result.ok) return acknowledgement("ignored", result.message);
      return acknowledgement("accepted", "Stripe commerce payment reconciled.");
    }
    if (attempt.status === "paid")
      return acknowledgement(
        "ignored",
        "A failure event cannot downgrade a paid order.",
      );
    await markCommercePaymentFailed({
      env,
      orderId,
      attemptId,
      status: eventType === "checkout.session.expired" ? "expired" : "failed",
      eventId,
      sessionId,
    });
    return acknowledgement(
      "accepted",
      "Stripe commerce failure state reconciled.",
    );
  }
  if (payableType !== "session_entitlement") {
    return acknowledgement("ignored", "Stripe event belongs to another flow.");
  }
  const entitlementId =
    safeString(metadata.payableId) || safeString(session.client_reference_id);
  const attemptId = safeString(metadata.attemptId);
  const sessionId = safeString(session.id);
  const [entitlement, attempt] = await Promise.all([
    getSessionEntitlement(env, entitlementId),
    getSessionPaymentAttempt(env, attemptId),
  ]);
  if (
    !entitlement ||
    !attempt ||
    attempt.payableId !== entitlement.id ||
    attempt.accountId !== entitlement.accountId ||
    (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
  ) {
    return acknowledgement("ignored", "Stripe payment target did not match.");
  }

  const isPaid =
    eventType === "checkout.session.completed" ||
    eventType === "checkout.session.async_payment_succeeded";
  if (isPaid) {
    const verification = verifyStripeSessionPayment({
      payable: entitlement,
      attemptId,
      session,
    });
    if (!verification.ok) {
      return acknowledgement("ignored", verification.message);
    }
    const result = await markSessionPaymentPaid({
      env,
      entitlementId,
      attemptId,
      sessionId,
      paymentIntentId: safeString(session.payment_intent) || sessionId,
      eventId,
      eventStatus: "paid",
      siteOrigin: new URL(context.request.url).origin,
    });
    if (!result.ok) return acknowledgement("ignored", result.message);
    return acknowledgement(
      result.duplicate ? "duplicate" : "accepted",
      result.duplicate
        ? "Stripe event was already reconciled."
        : "Stripe payment reconciled.",
    );
  }

  if (attempt.status === "paid") {
    return acknowledgement(
      "ignored",
      "A failure event cannot downgrade a paid session.",
    );
  }
  await markSessionPaymentFailed({
    env,
    entitlementId,
    attemptId,
    status: eventType === "checkout.session.expired" ? "expired" : "failed",
    eventId,
    sessionId,
  });
  return acknowledgement("accepted", "Stripe failure state reconciled.");
};
