import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../../../server/aggregator/customer-auth.ts";
import { readStripeCheckoutSession, verifyStripeWalletPayment } from "../../../../../../server/aggregator/payments/stripe.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import { getWalletPaymentAttempt, getWalletRecharge, recordWalletBrowserVerification } from "../../../../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.wallet-payment-confirm";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return errorResponse(feature, await auth.response.text(), auth.response.status);
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const rechargeId = safeString(parsed.body.rechargeId);
  const attemptId = safeString(parsed.body.attemptId);
  const sessionId = safeString(parsed.body.sessionId);
  const [recharge, attempt] = await Promise.all([
    getWalletRecharge(env, rechargeId, auth.session.account.id),
    getWalletPaymentAttempt(env, attemptId),
  ]);
  if (!recharge || !attempt || attempt.payableId !== recharge.id || attempt.accountId !== auth.session.account.id)
    return errorResponse(feature, "Wallet recharge was not found.", 404);
  try {
    const stripeSession = await readStripeCheckoutSession({ env, sessionId });
    const verification = verifyStripeWalletPayment({ payable: recharge, attemptId, session: stripeSession });
    if (!verification.ok) return errorResponse(feature, verification.message, 409);
    const verified = await recordWalletBrowserVerification({
      env,
      rechargeId,
      attemptId,
      sessionId,
      paymentIntentId: safeString(stripeSession.payment_intent) || sessionId,
    });
    if (!verified.ok) return errorResponse(feature, verified.message, 409);
    return jsonResponse(
      {
        status: "ready",
        state: "ready",
        feature,
        capabilityKey: "checkout-and-payments",
        message: "Wallet payment verified in browser. Waiting for webhook confirmation.",
        data: {
          authoritativeState: "waiting-for-webhook",
          paymentReference: verified.paymentReference,
          rechargeId,
          attemptId,
          sessionId,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    return errorResponse(feature, error instanceof Error ? error.message : "Stripe payment verification failed.", 502);
  }
};
