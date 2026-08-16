import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../server/aggregator/customer-auth.ts";
import { createStripeWalletCheckout } from "../../../server/aggregator/payments/stripe.ts";
import { resolveSecretBinding } from "../../../server/aggregator/runtime-bindings.ts";
import { safeString } from "../../../server/aggregator/runtime.ts";
import { createWalletRecharge, recordWalletCheckout } from "../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../server/generated-site/request.ts";
import { blockedProviderResponse, errorResponse, jsonResponse } from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.wallet-recharge";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request); if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return errorResponse(feature, await auth.response.text(), auth.response.status);
  const parsed = await readJsonBody(context.request); if (!parsed.ok) return parsed.response;
  const [stripeSecret, webhookSecret] = await Promise.all([
    resolveSecretBinding(env, "STRIPE_SECRET_KEY"), resolveSecretBinding(env, "STRIPE_WEBHOOK_SECRET"),
  ]);
  const missingSecretNames = [!stripeSecret ? "STRIPE_SECRET_KEY" : "", !webhookSecret ? "STRIPE_WEBHOOK_SECRET" : ""].filter(Boolean);
  if (missingSecretNames.length) return blockedProviderResponse({ feature, capabilityKey: "checkout-and-payments", missingSecretNames, message: "Stripe Checkout and its signed webhook are not configured." });
  const result = await createWalletRecharge({
    env,
    accountId: auth.session.account.id,
    amountCents: Math.round(Number(parsed.body.amount) * 100),
    offerId: safeString(parsed.body.offerId) || undefined,
    requestKey: safeString(parsed.body.requestKey),
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  const { recharge, attempt } = result;
  if (attempt.status === "requires_action" && attempt.checkoutUrl)
    return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: "Existing Stripe checkout restored.", data: { rechargeId: recharge.id, attemptId: attempt.id, checkoutUrl: attempt.checkoutUrl } });
  if (attempt.status !== "created") return errorResponse(feature, "Start a new wallet recharge.", 409);
  try {
    const checkout = await createStripeWalletCheckout({ env, payable: recharge, attemptId: attempt.id, origin: new URL(context.request.url).origin, locale: safeString(parsed.body.locale) || "en" });
    await recordWalletCheckout({ env, rechargeId: recharge.id, attemptId: attempt.id, sessionId: checkout.sessionId, checkoutUrl: checkout.checkoutUrl });
    return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: "Stripe wallet checkout is ready.", data: { rechargeId: recharge.id, attemptId: attempt.id, checkoutUrl: checkout.checkoutUrl } }, { status: result.replay ? 200 : 201 });
  } catch (error) {
    return errorResponse(feature, error instanceof Error ? error.message : "Wallet checkout request failed.", 502);
  }
};
