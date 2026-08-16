import type { APIRoute } from "astro";
import { requireCustomerSession } from "../../../../../server/aggregator/customer-auth.ts";
import { safeString } from "../../../../../server/aggregator/runtime.ts";
import { getSessionEntitlement } from "../../../../../server/aggregator/session-entitlements.ts";
import { getRuntimeEnv } from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.session-entitlement";

export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  const entitlement = await getSessionEntitlement(
    env,
    safeString(context.params.entitlementId),
    auth.session.account.id,
  );
  if (!entitlement) {
    return errorResponse(feature, "Session purchase was not found.", 404);
  }
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "checkout-and-payments",
    message: "Session purchase loaded.",
    data: { entitlement },
  });
};
