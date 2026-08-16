import type { APIRoute } from "astro";
import {
  getCommerceOrder,
  getCommercePaymentAttempt,
  recordCommerceCheckout,
} from "../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerCsrf } from "../../../../server/aggregator/customer-auth.ts";
import { createStripeCommerceCheckout } from "../../../../server/aggregator/payments/stripe.ts";
import { resolveSecretBinding } from "../../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../server/generated-site/request.ts";
import {
  blockedProviderResponse,
  errorResponse,
  jsonResponse,
} from "../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.commerce-checkout";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const [stripeSecret, webhookSecret] = await Promise.all([
    resolveSecretBinding(env, "STRIPE_SECRET_KEY"),
    resolveSecretBinding(env, "STRIPE_WEBHOOK_SECRET"),
  ]);
  const missingSecretNames = [
    !stripeSecret ? "STRIPE_SECRET_KEY" : "",
    !webhookSecret ? "STRIPE_WEBHOOK_SECRET" : "",
  ].filter(Boolean);
  if (missingSecretNames.length)
    return blockedProviderResponse({
      feature,
      capabilityKey: "checkout-and-payments",
      missingSecretNames,
      message: "Stripe Checkout and its signed webhook are not configured.",
    });
  const orderId = safeString(parsed.body.orderId);
  const attemptId = safeString(parsed.body.attemptId);
  const [order, attempt] = await Promise.all([
    getCommerceOrder(env, orderId, auth.session.account.id),
    getCommercePaymentAttempt(env, attemptId),
  ]);
  if (
    !order ||
    !attempt ||
    attempt.payableId !== order.id ||
    attempt.accountId !== auth.session.account.id
  )
    return errorResponse(feature, "Order checkout was not found.", 404);
  if (order.status !== "pending_payment")
    return errorResponse(
      feature,
      "This order is no longer awaiting payment.",
      409,
    );
  if (attempt.status === "requires_action" && attempt.checkoutUrl) {
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: "Existing Stripe checkout restored.",
      data: {
        provider: "stripe",
        orderId,
        attemptId,
        checkoutUrl: attempt.checkoutUrl,
      },
    });
  }
  if (attempt.status !== "created")
    return errorResponse(feature, "Start a new order checkout.", 409);
  try {
    const checkout = await createStripeCommerceCheckout({
      env,
      payable: order,
      attemptId,
      origin: new URL(context.request.url).origin,
      locale: safeString(parsed.body.locale) || "en",
    });
    await recordCommerceCheckout({
      env,
      orderId,
      attemptId,
      sessionId: checkout.sessionId,
      checkoutUrl: checkout.checkoutUrl,
    });
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: "Stripe checkout is ready.",
      data: {
        provider: "stripe",
        orderId,
        attemptId,
        checkoutUrl: checkout.checkoutUrl,
      },
    });
  } catch (error) {
    return errorResponse(
      feature,
      error instanceof Error
        ? error.message
        : "Checkout provider request failed.",
      502,
    );
  }
};
