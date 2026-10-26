import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../../server/aggregator/customer-auth.ts";
import { getCommerceOrder, getCommercePaymentAttempt } from "../../../../../server/aggregator/commerce-orders.ts";
import { safeString } from "../../../../../server/aggregator/runtime.ts";
import { getSessionEntitlement, getSessionPaymentAttempt } from "../../../../../server/aggregator/session-entitlements.ts";
import { getWalletPaymentAttempt, getWalletRecharge } from "../../../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-warm-modern.payment-status";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request); if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request); if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request); if (!parsed.ok) return parsed.response;
  const payableType = safeString(parsed.body.payableType), payableId = safeString(parsed.body.payableId), attemptId = safeString(parsed.body.attemptId);
  let payable: { id: string; accountId: string; status?: string; paymentState?: string } | null = null;
  let attempt: { payableId: string; accountId: string; provider: string; status: string } | null = null;
  if (payableType === "commerce_order") [payable, attempt] = await Promise.all([getCommerceOrder(env, payableId, auth.session.account.id), getCommercePaymentAttempt(env, attemptId)]);
  else if (payableType === "session_entitlement") [payable, attempt] = await Promise.all([getSessionEntitlement(env, payableId, auth.session.account.id), getSessionPaymentAttempt(env, attemptId)]);
  else if (payableType === "wallet_recharge") [payable, attempt] = await Promise.all([getWalletRecharge(env, payableId, auth.session.account.id), getWalletPaymentAttempt(env, attemptId)]);
  else return errorResponse(feature, "Payment type is invalid.", 400);
  if (!payable || !attempt || attempt.payableId !== payable.id || attempt.accountId !== auth.session.account.id) return errorResponse(feature, "Payment was not found.", 404);
  const paid = attempt.status === "paid" && (payable.status === "paid" || payable.paymentState === "paid");
  return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: paid ? "Payment is confirmed." : "Payment is awaiting an authoritative webhook.", data: { paid, provider: attempt.provider, paymentStatus: attempt.status } }, { status: paid ? 200 : 202 });
};
