import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../../../server/aggregator/customer-auth.ts";
import { readStripeCheckoutSession, verifyStripeWalletPayment } from "../../../../../../server/aggregator/payments/stripe.ts";
import { safeString } from "../../../../../../server/aggregator/runtime.ts";
import { getCustomerWalletSummary, getWalletPaymentAttempt, getWalletRecharge, listWalletTransactions, markWalletRechargePaid, walletRecentTransactionLimit } from "../../../../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.wallet-payment-confirm";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request); if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return errorResponse(feature, await auth.response.text(), auth.response.status);
  const parsed = await readJsonBody(context.request); if (!parsed.ok) return parsed.response;
  const rechargeId = safeString(parsed.body.rechargeId);
  const attemptId = safeString(parsed.body.attemptId);
  const sessionId = safeString(parsed.body.sessionId);
  const [recharge, attempt] = await Promise.all([getWalletRecharge(env, rechargeId, auth.session.account.id), getWalletPaymentAttempt(env, attemptId)]);
  if (!recharge || !attempt || attempt.payableId !== recharge.id || attempt.accountId !== auth.session.account.id)
    return errorResponse(feature, "Wallet recharge was not found.", 404);
  try {
    const stripeSession = await readStripeCheckoutSession({ env, sessionId });
    const verification = verifyStripeWalletPayment({ payable: recharge, attemptId, session: stripeSession });
    if (!verification.ok) return errorResponse(feature, verification.message, 409);
    const paid = await markWalletRechargePaid({ env, rechargeId, attemptId, sessionId, paymentIntentId: safeString(stripeSession.payment_intent) || sessionId, eventId: `browser:${sessionId}`, eventStatus: "browser_verified" });
    if (!paid.ok) return errorResponse(feature, paid.message, 409);
    const locale = safeString(parsed.body.locale) || "en";
    const [wallet, transactions] = await Promise.all([
      getCustomerWalletSummary(env, auth.session.account.id, locale),
      listWalletTransactions(env, auth.session.account.id, { limit: walletRecentTransactionLimit, locale }),
    ]);
    return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: "Wallet payment verified.", data: { wallet, transactions, recharge: paid.recharge } });
  } catch (error) {
    return errorResponse(feature, error instanceof Error ? error.message : "Stripe payment verification failed.", 502);
  }
};
