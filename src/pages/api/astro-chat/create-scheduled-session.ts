import type { APIRoute } from "astro";
import { requireCustomerCsrf } from "../../../server/aggregator/customer-auth.ts";
import { createScheduledSession } from "../../../server/aggregator/scheduled-sessions.ts";
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

const feature = "sidera-almanac.calendly-create-session";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await createScheduledSession({
    env,
    accountId: auth.session.account.id,
    customerName: auth.session.account.displayName,
    customerEmail: auth.session.account.email,
    entitlementId: safeString(parsed.body.entitlementId),
    profileId: safeString(parsed.body.profileId),
    astrologerSlug: safeString(parsed.body.astrologerSlug),
    startAt: safeString(parsed.body.startAt),
    timezone: safeString(parsed.body.timezone),
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "western-calendly",
    message: result.actionRequired
      ? "Payment is confirmed; scheduling needs assistance."
      : "Appointment scheduled.",
    data: {
      booking: result.booking,
      actionRequired: result.actionRequired ?? false,
    },
  });
};
