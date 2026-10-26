import type { APIRoute } from "astro";
import { getCommerceOrder, getCommercePaymentAttempt, markCommercePaymentFailed, markCommercePaymentPaid } from "../../../../../../server/aggregator/commerce-orders.ts";
import { verifyRazorpayPayment, verifyRazorpayWebhookSignature } from "../../../../../../server/aggregator/payments/razorpay.ts";
import { resolveSecretBinding } from "../../../../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import { getSessionEntitlement, getSessionPaymentAttempt, markSessionPaymentFailed, markSessionPaymentPaid } from "../../../../../../server/aggregator/session-entitlements.ts";
import { getWalletPaymentAttempt, getWalletRecharge, markWalletRechargeFailed, markWalletRechargePaid } from "../../../../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv, requirePost } from "../../../../../../server/generated-site/request.ts";
import { jsonResponse } from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.payment-webhook.razorpay";
const actionableEvents = new Set([
  "payment.captured",
  "payment.failed",
  "payment_link.paid",
  "payment_link.cancelled",
  "payment_link.expired",
]);
const ack = (decision: "accepted" | "ignored" | "rejected" | "duplicate", message: string, status = 200) =>
  jsonResponse({ status: decision === "rejected" ? "error" : "ready", state: decision === "rejected" ? "error" : "ready", feature, capabilityKey: "checkout-and-payments", message, data: { provider: "razorpay", decision } }, { status });

const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request); if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const rawBody = await context.request.text();
  const valid = await verifyRazorpayWebhookSignature({ secret: await resolveSecretBinding(env, "RAZORPAY_WEBHOOK_SECRET"), rawBody, signature: context.request.headers.get("x-razorpay-signature") ?? "" });
  if (!valid) return ack("rejected", "Razorpay webhook signature is invalid.", 403);
  let event: Record<string, unknown>;
  try { event = JSON.parse(rawBody) as Record<string, unknown>; } catch { return ack("ignored", "Signed Razorpay payload is malformed."); }
  const eventId = safeString(context.request.headers.get("x-razorpay-event-id")) || safeString(event.event_id) || safeString(event.id);
  const eventType = safeString(event.event);
  if (!eventId || !actionableEvents.has(eventType)) return ack("ignored", "Razorpay event is not actionable.");
  const payload = object(event.payload);
  const paymentLink = object(object(payload.payment_link).entity);
  const payment = object(object(payload.payment).entity);
  const order = object(object(payload.order).entity);
  const entity = Object.keys(paymentLink).length ? paymentLink : payment;
  const notes = Object.keys(object(paymentLink.notes)).length
    ? object(paymentLink.notes)
    : Object.keys(object(payment.notes)).length
      ? object(payment.notes)
      : object(order.notes);
  const payableType = safeString(notes.payableType);
  const payableId = safeString(notes.payableId);
  const attemptId = safeString(notes.attemptId) || safeString(paymentLink.reference_id);
  const paymentLinkId = safeString(paymentLink.id);
  const razorpayOrderId = safeString(payment.order_id) || safeString(order.id);
  const providerReference = paymentLinkId || razorpayOrderId;
  const paymentId = safeString(payment.id) || safeString(entity.id) || providerReference;
  if (!payableId || !attemptId || !providerReference) return ack("ignored", "Razorpay payment metadata is incomplete.");
  const paid = eventType === "payment_link.paid" || eventType === "payment.captured";
  const matchesStoredPaymentLink = (attempt: { providerOrderId: string }) =>
    !paymentLinkId || !attempt.providerOrderId || attempt.providerOrderId === paymentLinkId;
  const providerSessionId = (attempt: { providerOrderId: string }) =>
    paymentLinkId || attempt.providerOrderId || razorpayOrderId;
  const verifiedEntity = { ...entity, notes };

  if (payableType === "commerce_order") {
    const [payable, attempt] = await Promise.all([getCommerceOrder(env, payableId), getCommercePaymentAttempt(env, attemptId)]);
    if (!payable || !attempt || attempt.provider !== "razorpay" || attempt.payableId !== payable.id || attempt.accountId !== payable.accountId || !matchesStoredPaymentLink(attempt)) return ack("ignored", "Razorpay commerce target did not match.");
    const sessionId = providerSessionId(attempt);
    if (!paid) { if (attempt.status === "paid") return ack("ignored", "A failure event cannot downgrade a paid order."); await markCommercePaymentFailed({ env, orderId: payableId, attemptId, status: eventType.endsWith("expired") ? "expired" : "failed", eventId, sessionId, provider: "razorpay" }); return ack("accepted", "Razorpay commerce failure state reconciled."); }
    const verification = verifyRazorpayPayment({ payable, attemptId, payableType, entity: verifiedEntity }); if (!verification.ok) return ack("ignored", verification.message);
    const result = await markCommercePaymentPaid({ env, orderId: payableId, attemptId, sessionId, paymentIntentId: paymentId, eventId, eventStatus: "paid", siteOrigin: new URL(context.request.url).origin });
    return result.ok ? ack("accepted", "Razorpay commerce payment reconciled.") : ack("ignored", result.message);
  }
  if (payableType === "session_entitlement") {
    const [payable, attempt] = await Promise.all([getSessionEntitlement(env, payableId), getSessionPaymentAttempt(env, attemptId)]);
    if (!payable || !attempt || attempt.provider !== "razorpay" || attempt.payableId !== payable.id || attempt.accountId !== payable.accountId || !matchesStoredPaymentLink(attempt)) return ack("ignored", "Razorpay session target did not match.");
    const sessionId = providerSessionId(attempt);
    if (!paid) { if (attempt.status === "paid") return ack("ignored", "A failure event cannot downgrade a paid session."); await markSessionPaymentFailed({ env, entitlementId: payableId, attemptId, status: eventType.endsWith("expired") ? "expired" : "failed", eventId, sessionId, provider: "razorpay" }); return ack("accepted", "Razorpay session failure state reconciled."); }
    const verification = verifyRazorpayPayment({ payable, attemptId, payableType, entity: verifiedEntity }); if (!verification.ok) return ack("ignored", verification.message);
    const result = await markSessionPaymentPaid({ env, entitlementId: payableId, attemptId, sessionId, paymentIntentId: paymentId, eventId, eventStatus: "paid", siteOrigin: new URL(context.request.url).origin });
    return result.ok ? ack(result.duplicate ? "duplicate" : "accepted", "Razorpay session payment reconciled.") : ack("ignored", result.message);
  }
  if (payableType === "wallet_recharge") {
    const [payable, attempt] = await Promise.all([getWalletRecharge(env, payableId), getWalletPaymentAttempt(env, attemptId)]);
    if (!payable || !attempt || attempt.provider !== "razorpay" || attempt.payableId !== payable.id || attempt.accountId !== payable.accountId || !matchesStoredPaymentLink(attempt)) return ack("ignored", "Razorpay wallet target did not match.");
    const sessionId = providerSessionId(attempt);
    if (!paid) { if (attempt.status === "paid") return ack("ignored", "A failure event cannot downgrade a paid wallet recharge."); await markWalletRechargeFailed({ env, rechargeId: payableId, attemptId, status: eventType.endsWith("expired") ? "expired" : "failed", eventId, sessionId, provider: "razorpay" }); return ack("accepted", "Razorpay wallet failure state reconciled."); }
    const verification = verifyRazorpayPayment({ payable, attemptId, payableType, entity: verifiedEntity }); if (!verification.ok) return ack("ignored", verification.message);
    const result = await markWalletRechargePaid({ env, rechargeId: payableId, attemptId, sessionId, paymentIntentId: paymentId, eventId, eventStatus: "paid" });
    return result.ok ? ack(result.duplicate ? "duplicate" : "accepted", "Razorpay wallet payment reconciled.") : ack("ignored", result.message);
  }
  return ack("ignored", "Razorpay event belongs to another flow.");
};
