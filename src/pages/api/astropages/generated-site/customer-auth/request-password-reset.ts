import type { APIRoute } from "astro";
import { requestCustomerPasswordReset } from "../../../../../server/aggregator/customer-auth.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.customer-auth.request-password-reset";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsedBody = await readJsonBody(context.request);
  if (!parsedBody.ok) return parsedBody.response;
  const result = await requestCustomerPasswordReset({
    env: await getRuntimeEnv(context),
    request: context.request,
    email: parsedBody.body.email,
    locale: parsedBody.body.locale,
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-auth",
    message: result.message,
    data: {},
  });
};
