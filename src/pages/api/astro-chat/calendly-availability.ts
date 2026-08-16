import type { APIRoute } from "astro";
import { listScheduledAvailability } from "../../../server/aggregator/scheduled-sessions.ts";
import { safeString } from "../../../server/aggregator/runtime.ts";
import { getRuntimeEnv } from "../../../server/generated-site/request.ts";
import {
  blockedProviderResponse,
  errorResponse,
  jsonResponse,
} from "../../../server/generated-site/responses.ts";

const feature = "sidera-almanac.calendly-availability";
export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const result = await listScheduledAvailability({
    env,
    astrologerSlug: safeString(context.url.searchParams.get("astrologerSlug")),
    durationMinutes: Number(context.url.searchParams.get("durationMinutes")),
    startAt: safeString(context.url.searchParams.get("startAt")),
    days: Number(context.url.searchParams.get("days") || 7),
  });
  if (!result.ok) {
    if ("missingSecretNames" in result && result.missingSecretNames.length) {
      return blockedProviderResponse({
        feature,
        capabilityKey: "western-calendly",
        missingSecretNames: result.missingSecretNames,
        message: result.message,
        status: result.status,
      });
    }
    return errorResponse(feature, result.message, result.status);
  }
  return jsonResponse({
    status: "ready",
    state: "ready",
    feature,
    capabilityKey: "western-calendly",
    message: "Calendly availability loaded.",
    data: { slots: result.slots, durationMinutes: result.durationMinutes },
  });
};
