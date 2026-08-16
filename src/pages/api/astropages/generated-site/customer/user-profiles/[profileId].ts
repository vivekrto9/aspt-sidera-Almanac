import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../../../../server/aggregator/customer-auth.ts";
import {
  deleteCustomerUserProfile,
  updateCustomerUserProfile,
} from "../../../../../../server/aggregator/customer-profiles.ts";
import {
  getRuntimeEnv,
  readJsonBody,
} from "../../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../../server/generated-site/responses.ts";
const feature = "sidera-almanac.customer.user-profile";
export const PATCH: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await updateCustomerUserProfile({
    env,
    accountId: auth.session.account.id,
    profileId: String(context.params.profileId ?? ""),
    profile: parsed.body,
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-profile",
    message: "Profile updated.",
    data: { profile: result.profile },
  });
};
export const DELETE: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const result = await deleteCustomerUserProfile(
    env,
    auth.session.account.id,
    String(context.params.profileId ?? ""),
  );
  if (!result.ok) return errorResponse(feature, result.message, 404);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-profile",
    message: "Profile deleted.",
    data: {},
  });
};
