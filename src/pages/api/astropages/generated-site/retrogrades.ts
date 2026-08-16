import type { APIRoute } from "astro";
import { getRetrogrades, retrogradesFeature } from "../../../../server/aggregator/retrogrades-api.ts";
import { getRuntimeEnv } from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;
export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  try {
    const retrogrades = await getRetrogrades({ env: await getRuntimeEnv(context), year: url.searchParams.get("year"), locale: (url.searchParams.get("locale") || "en") as never });
    return Response.json({ ok: true, retrogrades });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Retrograde data could not be loaded.";
    return errorResponse(retrogradesFeature, message, /configured/i.test(message) ? 503 : /provider|incomplete/i.test(message) ? 502 : 400);
  }
};
export const ALL: APIRoute = async () => errorResponse(retrogradesFeature, "Method not allowed.", 405);
