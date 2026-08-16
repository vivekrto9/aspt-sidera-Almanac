import type { APIRoute } from "astro";
import { listAstrologyChatSessions } from "../../../server/aggregator/astrology-chat.ts";
import { requireCustomerSession } from "../../../server/aggregator/customer-auth.ts";
import { getRuntimeEnv } from "../../../server/generated-site/request.ts";
import { jsonResponse } from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.astro-chat.sessions";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  const result = await listAstrologyChatSessions({
    env,
    accountId: auth.session.account.id,
    page: Number(context.url.searchParams.get("page") || 1),
    pageSize: Number(context.url.searchParams.get("pageSize") || 10),
  });
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "ai-chat",
    message: "Sessions loaded.",
    data: result,
  });
};
