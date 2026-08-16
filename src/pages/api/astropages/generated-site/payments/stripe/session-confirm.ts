import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../../../server/aggregator/customer-auth.ts";
import {
  readStripeCheckoutSession,
  verifyStripeSessionPayment,
} from "../../../../../../server/aggregator/payments/stripe.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import {
  getSessionEntitlement,
  getSessionPaymentAttempt,
  markSessionPaymentPaid,
} from "../../../../../../server/aggregator/session-entitlements.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.session-payment-confirm";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const entitlementId = safeString(parsed.body.entitlementId);
  const attemptId = safeString(parsed.body.attemptId);
  const sessionId = safeString(parsed.body.sessionId);
  if (!entitlementId || !attemptId || !sessionId) {
    return errorResponse(
      feature,
      "Entitlement, attempt, and Stripe session details are required.",
    );
  }
  const [entitlement, attempt] = await Promise.all([
    getSessionEntitlement(env, entitlementId, auth.session.account.id),
    getSessionPaymentAttempt(env, attemptId),
  ]);
  if (
    !entitlement ||
    !attempt ||
    attempt.accountId !== auth.session.account.id ||
    attempt.payableId !== entitlement.id
  ) {
    return errorResponse(feature, "Session purchase was not found.", 404);
  }

  try {
    const stripeSession = await readStripeCheckoutSession({ env, sessionId });
    const verification = verifyStripeSessionPayment({
      payable: entitlement,
      attemptId,
      session: stripeSession,
    });
    if (!verification.ok) {
      return errorResponse(feature, verification.message, 409);
    }
    const paid = await markSessionPaymentPaid({
      env,
      entitlementId,
      attemptId,
      sessionId,
      paymentIntentId: safeString(stripeSession.payment_intent) || sessionId,
      eventId: `browser:${sessionId}`,
      eventStatus: "browser_verified",
      siteOrigin: new URL(context.request.url).origin,
    });
    if (!paid.ok) return errorResponse(feature, paid.message, 409);
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature,
      capabilityKey: "checkout-and-payments",
      message: "Stripe payment verified.",
      data: { entitlement: paid.entitlement },
    });
  } catch (error) {
    return errorResponse(
      feature,
      error instanceof Error
        ? error.message
        : "Stripe payment verification failed.",
      502,
    );
  }
};
