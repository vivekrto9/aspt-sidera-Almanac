import type { APIRoute } from "astro";
import { resetCustomerPassword } from "../../../../../server/aggregator/customer-auth.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.customer-auth.reset-password";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsedBody = await readJsonBody(context.request);
  if (!parsedBody.ok) return parsedBody.response;
  const result = await resetCustomerPassword({
    env: await getRuntimeEnv(context),
    token: parsedBody.body.token,
    password: parsedBody.body.password,
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
