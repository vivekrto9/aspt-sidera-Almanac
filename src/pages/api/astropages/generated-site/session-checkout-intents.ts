import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../server/aggregator/customer-auth.ts";
import { createStripeSessionCheckout } from "../../../../server/aggregator/payments/stripe.ts";
import { resolveSecretBinding } from "../../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../../server/aggregator/runtime.ts";
import {
  createSessionPaymentTarget,
  recordSessionCheckout,
} from "../../../../server/aggregator/session-entitlements.ts";
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

const feature = "sidera-almanac.session-checkout";

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
  if (missingSecretNames.length > 0) {
    return blockedProviderResponse({
      feature,
      capabilityKey: "checkout-and-payments",
      missingSecretNames,
      message: "Stripe Checkout and its signed webhook are not configured.",
    });
  }

  const result = await createSessionPaymentTarget({
    env,
    accountId: auth.session.account.id,
    astrologerSlug: parsed.body.astrologerSlug,
    sessionType: parsed.body.sessionType,
    deliveryMode: parsed.body.deliveryMode,
    durationMinutes: parsed.body.durationMinutes,
    requestKey: context.request.headers.get("x-idempotency-key"),
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  if (
    result.entitlement.status === "paid" ||
    result.entitlement.status === "reserved" ||
    result.entitlement.status === "consumed"
  ) {
    return errorResponse(feature, "This session purchase is already paid.", 409);
  }
  if (
    result.replay &&
    result.attempt?.status === "requires_action" &&
    result.attempt.checkoutUrl
  ) {
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: "Existing Stripe checkout restored.",
      data: {
        provider: "stripe",
        entitlementId: result.entitlement.id,
        attemptId: result.attempt.id,
        checkoutUrl: result.attempt.checkoutUrl,
      },
    });
  }
  if (!result.attempt || result.attempt.status !== "created") {
    return errorResponse(
      feature,
      "This checkout request can no longer be reused. Start a new checkout.",
      409,
    );
  }

  try {
    const checkout = await createStripeSessionCheckout({
      env,
      payable: result.entitlement,
      attemptId: result.attempt.id,
      origin: new URL(context.request.url).origin,
      locale: safeString(parsed.body.locale) || "en",
    });
    await recordSessionCheckout({
      env,
      entitlementId: result.entitlement.id,
      attemptId: result.attempt.id,
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
        entitlementId: result.entitlement.id,
        attemptId: result.attempt.id,
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
