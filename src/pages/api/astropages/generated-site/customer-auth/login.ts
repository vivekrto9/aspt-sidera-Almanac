import type { APIRoute } from "astro";
import { loginCustomer } from "../../../../../server/aggregator/customer-auth.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../../server/generated-site/request.ts";
import { errorResponse, jsonResponse } from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.customer-auth.login";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsedBody = await readJsonBody(context.request);
  if (!parsedBody.ok) return parsedBody.response;
  const env = await getRuntimeEnv(context);
  const result = await loginCustomer({
    env,
    request: context.request,
    email: parsedBody.body.email,
    password: parsedBody.body.password,
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);

  const response = jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-auth",
    message: "Customer session is active.",
    data: { account: result.account, csrfToken: result.csrfToken },
  });
  result.cookies.forEach((cookie) => response.headers.append("set-cookie", cookie));
  return response;
};
