import type { APIRoute } from "astro";
import { getSkyForDate, skyFeature } from "../../../../server/aggregator/sky-api.ts";
import { getRuntimeEnv } from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;
export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  try {
    const sky = await getSkyForDate({
      env: await getRuntimeEnv(context),
      date: url.searchParams.get("date"),
      locale: url.searchParams.get("locale") || "en",
      live: url.searchParams.get("live") === "1",
    });
    return Response.json({ ok: true, sky });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sky data could not be loaded.";
    return errorResponse(skyFeature, message, /configured/i.test(message) ? 503 : /provider|incomplete/i.test(message) ? 502 : 400);
  }
};
export const ALL: APIRoute = async () => errorResponse(skyFeature, "Method not allowed.", 405);
