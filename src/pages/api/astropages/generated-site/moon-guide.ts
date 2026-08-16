import type { APIRoute } from "astro";
import {
  getCurrentMoonGuide,
  getMoonDayGuide,
  getMoonMonthGuide,
  moonGuideFeature,
} from "../../../../server/aggregator/moon-guide-api.ts";
import { getRuntimeEnv } from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const params = new URL(context.request.url).searchParams;
    const locale = params.get("locale") || "en";
    const timezoneOffset = params.get("timezoneOffset") || "0";
    const scope = params.get("scope") || "current";
    const env = await getRuntimeEnv(context);
    const data =
      scope === "month"
        ? await getMoonMonthGuide({
            env,
            locale,
            timezoneOffset,
            year: params.get("year"),
            month: params.get("month"),
          })
        : scope === "day"
          ? await getMoonDayGuide({
              env,
              locale,
              timezoneOffset,
              date: params.get("date"),
            })
          : await getCurrentMoonGuide({ env, locale, timezoneOffset });
    return Response.json({ ok: true, [scope]: data });
  } catch (error) {
    return errorResponse(
      moonGuideFeature,
      error instanceof Error ? error.message : "Moon provider request failed.",
      502,
    );
  }
};

export const ALL: APIRoute = async () =>
  errorResponse(moonGuideFeature, "Method not allowed.", 405);
