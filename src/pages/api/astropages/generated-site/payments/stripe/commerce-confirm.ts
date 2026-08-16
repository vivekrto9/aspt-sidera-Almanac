import type { APIRoute } from "astro";
import {
  getCommerceOrder,
  getCommercePaymentAttempt,
  markCommercePaymentPaid,
} from "../../../../../../server/aggregator/commerce-orders.ts";
import { requireCustomerCsrf } from "../../../../../../server/aggregator/customer-auth.ts";
import {
  readStripeCheckoutSession,
  verifyStripeCommercePayment,
} from "../../../../../../server/aggregator/payments/stripe.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.commerce-payment-confirm";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const orderId = safeString(parsed.body.orderId);
  const attemptId = safeString(parsed.body.attemptId);
  const sessionId = safeString(parsed.body.sessionId);
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
    return errorResponse(feature, "Order purchase was not found.", 404);
  try {
    const stripeSession = await readStripeCheckoutSession({ env, sessionId });
    const verification = verifyStripeCommercePayment({
      payable: order,
      attemptId,
      session: stripeSession,
    });
    if (!verification.ok)
      return errorResponse(feature, verification.message, 409);
    const paid = await markCommercePaymentPaid({
      env,
      orderId,
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
      data: { order: paid.order },
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
