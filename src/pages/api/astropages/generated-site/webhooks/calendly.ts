import type { APIRoute } from "astro";
import { handleCalendlyWebhook } from "../../../../../server/aggregator/scheduled-sessions.ts";
import {
  getRuntimeEnv,
  requirePost,
} from "../../../../../server/generated-site/request.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.calendly-webhook";
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const env = await getRuntimeEnv(context);
  const result = await handleCalendlyWebhook({
    env,
    body: await context.request.text(),
    signatureHeader:
      context.request.headers.get("calendly-webhook-signature") || "",
  });
  if (!result.ok) return errorResponse(feature, result.message, result.status);
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "western-calendly",
    message: result.message,
  });
};
