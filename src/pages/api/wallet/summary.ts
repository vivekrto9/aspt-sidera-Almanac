import type { APIRoute } from "astro";
import { getCustomerSession } from "../../../server/aggregator/customer-auth.ts";
import { getCustomerWalletSummary, listWalletTransactions, walletOffers, walletRecentTransactionLimit } from "../../../server/aggregator/wallet-store.ts";
import { getRuntimeEnv } from "../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.wallet-summary";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const session = await getCustomerSession(env, context.request);
  if (!session) return errorResponse(feature, "Sign in to view your wallet.", 401);
  const locale = new URL(context.request.url).searchParams.get("locale") || "en";
  const [wallet, transactions] = await Promise.all([
    getCustomerWalletSummary(env, session.account.id, locale),
    listWalletTransactions(env, session.account.id, { limit: walletRecentTransactionLimit, locale }),
  ]);
  return jsonResponse({ status: "ready", state: "ready", feature, capabilityKey: "checkout-and-payments", message: "Wallet loaded.", data: { wallet, transactions, offers: walletOffers } });
};
