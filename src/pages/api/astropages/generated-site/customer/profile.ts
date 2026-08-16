import type { APIRoute } from "astro";
import { updateCustomerAccountSettings } from "../../../../../server/aggregator/customer-account.ts";
import { requireCustomerCsrf } from "../../../../../server/aggregator/customer-auth.ts";
import {
  getRuntimeEnv,
  readJsonBody,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";
const feature = "sidera-almanac.customer.profile";
export const PATCH: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const auth = await requireCustomerCsrf(env, context.request);
  if (!auth.ok) return auth.response;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const result = await updateCustomerAccountSettings({
    env,
    accountId: auth.session.account.id,
    displayName: parsed.body.displayName,
    phone: parsed.body.phone,
    defaultLanguage: parsed.body.defaultLanguage,
    consentMarketing: parsed.body.consentMarketing,
    houseSystem: parsed.body.houseSystem,
    zodiacSystem: parsed.body.zodiacSystem,
    dailyHoroscope: parsed.body.dailyHoroscope,
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-auth",
    message: "Account settings updated.",
    data: { account: result.account },
  });
};
