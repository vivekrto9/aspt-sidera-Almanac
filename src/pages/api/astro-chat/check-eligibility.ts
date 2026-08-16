import type { APIRoute } from "astro";
import { checkAstrologyChatEligibility } from "../../../server/aggregator/astrology-chat.ts";
import { requireCustomerCsrf } from "../../../server/aggregator/customer-auth.ts";
import { safeString } from "../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.astro-chat.eligibility";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await checkAstrologyChatEligibility({
    env,
    accountId: auth.session.account.id,
    astrologerSlug: safeString(parsed.body.astrologerSlug),
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: result.canStartChat
      ? "Wallet is ready for chat."
      : "Wallet needs more balance for a paid question.",
    data: {
      eligible: true,
      canStartChat: result.canStartChat,
      walletBalance: result.walletBalance,
      walletBalanceCents: result.walletBalanceCents,
      perQuestionCost: result.perQuestionCost,
      perQuestionCostCents: result.perQuestionCostCents,
      estimatedQuestionsCount: result.estimatedQuestionsCount,
    },
  });
};
