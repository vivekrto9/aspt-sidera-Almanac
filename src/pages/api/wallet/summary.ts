import type { APIRoute } from "astro";
import { getCustomerSession } from "../../../server/aggregator/customer-auth.ts";
import { getCustomerWalletSummary, listWalletTransactions, walletRecentTransactionLimit } from "../../../server/aggregator/wallet-store.ts";
import { getWalletPricing } from "../../../server/aggregator/payment-pricing.ts";
import { getRuntimeEnv } from "../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.wallet-summary";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const session = await getCustomerSession(env, context.request);
  if (!session) return errorResponse(feature, "Sign in to view your wallet.", 401);
  const locale = new URL(context.request.url).searchParams.get("locale") || "en";
  const [wallet, transactions, pricing] = await Promise.all([
    getCustomerWalletSummary(env, session.account.id, locale),
    listWalletTransactions(env, session.account.id, { limit: walletRecentTransactionLimit, locale }),
    getWalletPricing(env, session.account.id),
  ]);
  return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: "Wallet loaded.", data: { wallet, transactions, offers: pricing.offers, minimumCents: pricing.minimumCents, currency: pricing.currency } });
};
