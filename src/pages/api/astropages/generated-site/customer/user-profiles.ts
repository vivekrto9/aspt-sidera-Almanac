import type { APIRoute } from "astro";
import {
  requireCustomerCsrf,
  requireCustomerSession,
} from "../../../../../server/aggregator/customer-auth.ts";
import {
  createCustomerUserProfile,
  listCustomerUserProfiles,
} from "../../../../../server/aggregator/customer-profiles.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";
const feature = "sidera-almanac.customer.user-profiles";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerSession(env, context.request);
  if (!auth.ok) return auth.response;
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-profile",
    message: "Profiles loaded.",
    data: {
      profiles: await listCustomerUserProfiles(env, auth.session.account.id),
    },
  });
};
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await createCustomerUserProfile({
    env,
    accountId: auth.session.account.id,
    profile: parsed.body,
    idempotencyKey: context.request.headers.get("x-idempotency-key"),
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-profile",
    message: "Profile saved.",
    data: { profile: result.profile },
  });
};
