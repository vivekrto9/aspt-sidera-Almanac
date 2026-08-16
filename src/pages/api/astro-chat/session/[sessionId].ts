import type { APIRoute } from "astro";
import {
  completeAstrologyChatSession,
  deleteAstrologyChatSession,
  getAstrologyChatSessionDetail,
  renameAstrologyChatSession,
} from "../../../../server/aggregator/astrology-chat.ts";
import {
  requireCustomerCsrf,
  requireCustomerSession,
} from "../../../../server/aggregator/customer-auth.ts";
import { safeString } from "../../../../server/aggregator/runtime.ts";
import {
  getRuntimeEnv,
  readJsonBody,
} from "../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.astro-chat.session";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  const detail = await getAstrologyChatSessionDetail(
    env,
    auth.session.account.id,
    safeString(context.params.sessionId),
  );
  if (!detail) return errorResponse(feature, "Session was not found.", 404);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: "Session loaded.",
    data: detail,
  });
};

export const PATCH: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const sessionId = safeString(context.params.sessionId);
  const result = parsed.body.action === "complete"
    ? await completeAstrologyChatSession(env, auth.session.account.id, sessionId)
    : await renameAstrologyChatSession(
        env,
        auth.session.account.id,
        sessionId,
        parsed.body.sessionName,
      );
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: parsed.body.action === "complete" ? "Session completed." : "Session renamed.",
    data: "session" in result ? { session: result.session } : {},
  });
};

export const DELETE: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const result = await deleteAstrologyChatSession(
    env,
    auth.session.account.id,
    safeString(context.params.sessionId),
  );
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: "Session deleted.",
    data: {},
  });
};
