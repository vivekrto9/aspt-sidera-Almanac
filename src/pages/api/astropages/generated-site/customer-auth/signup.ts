import type { APIRoute } from "astro";
import { signupCustomer } from "../../../../../server/aggregator/customer-auth.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.customer-auth.signup";

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsedBody = await readJsonBody(context.request);
  if (!parsedBody.ok) return parsedBody.response;
  const result = await signupCustomer({
    env: await getRuntimeEnv(context),
    request: context.request,
    displayName: parsedBody.body.name ?? parsedBody.body.displayName,
    email: parsedBody.body.email,
    phone: parsedBody.body.phone,
    password: parsedBody.body.password,
    acceptedTerms: parsedBody.body.acceptedTerms,
    consentMarketing: parsedBody.body.consentMarketing,
  });
  if (!result.ok) return errorResponse(feature, result.message, 400);
  const response = jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "customer-auth",
    message: "Customer account created.",
    data: { account: result.account, csrfToken: result.csrfToken },
  });
  result.cookies.forEach((cookie) =>
    response.headers.append("set-cookie", cookie),
  );
  return response;
};
