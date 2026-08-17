import type { APIRoute } from "astro";
import { sendAstrologyChatMessage } from "../../../server/aggregator/astrology-chat.ts";
import { requireCustomerCsrf } from "../../../server/aggregator/customer-auth.ts";
import { safeString } from "../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../server/generated-site/request.ts";
import {
  blockedProviderResponse,
  errorResponse,
  jsonResponse,
} from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.astro-chat.send-message";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await sendAstrologyChatMessage({
    env,
    accountId: auth.session.account.id,
    sessionId: safeString(parsed.body.sessionId),
    message: parsed.body.message,
    requestKey: context.request.headers.get("x-idempotency-key"),
  });
  if (!result.ok) {
    if ("reason" in result && result.reason === "missing-provider") {
      return blockedProviderResponse({
        feature,
        capabilityKey: "ai-chat",
        missingSecretNames:
          "missingSecretNames" in result &&
          Array.isArray(result.missingSecretNames)
            ? result.missingSecretNames.filter(
                (name): name is string => typeof name === "string",
              )
            : [],
        message: result.message,
        status: result.status,
      });
    }
    if ("code" in result && result.code === "INSUFFICIENT_WALLET_BALANCE") {
      return jsonResponse(
        {
          status: "error",
          state: "error",
          feature,
          capabilityKey: "ai-chat",
          message: result.message,
          data: {
            code: result.code,
            balanceCents: result.balanceCents,
            requiredCents: result.requiredCents,
            shortfallCents: result.shortfallCents,
          },
        },
        { status: 402 },
      );
    }
    if (
      "reason" in result &&
      (result.reason === "provider-error" || result.reason === "provider-timeout")
    ) {
      return jsonResponse(
        {
          status: "error",
          state: "error",
          feature,
          message: result.message,
          data: {
            reason: result.reason,
            providerStatusCode:
              "providerStatusCode" in result
                ? result.providerStatusCode
                : undefined,
            providerErrorPhase:
              "providerErrorPhase" in result
                ? result.providerErrorPhase
                : undefined,
            providerErrorCode:
              "providerErrorCode" in result
                ? result.providerErrorCode
                : undefined,
            providerErrorName:
              "providerErrorName" in result
                ? result.providerErrorName
                : undefined,
          },
        },
        { status: result.status },
      );
    }
    return errorResponse(feature, result.message, result.status);
  }
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: result.replay ? "Existing reply restored." : "Reply received.",
    data: {
      answer: result.answer,
      free: result.free,
      costCents: result.costCents,
      balanceAfterCents: result.balanceAfterCents,
    },
  });
};
