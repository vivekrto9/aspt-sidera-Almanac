import type { APIRoute } from "astro";
import { createSynastryReading, getSynastryReading, synastryFeature } from "../../../../server/aggregator/synastry-api.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;
export const GET: APIRoute = async (context) => {
  const readingId = new URL(context.request.url).searchParams.get("readingId") || "";
  const reading = await getSynastryReading({ env: await getRuntimeEnv(context), request: context.request, readingId });
  return reading ? Response.json({ ok: true, ...reading }) : errorResponse(synastryFeature, "Synastry reading was not found.", 404);
};
export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request); if (methodError) return methodError;
  const parsed = await readJsonBody(context.request); if (!parsed.ok) return parsed.response;
  try { return Response.json(await createSynastryReading({ env: await getRuntimeEnv(context), request: context.request, body: parsed.body })); }
  catch (error) { const message = error instanceof Error ? error.message : "Synastry could not be generated."; return errorResponse(synastryFeature, message, /configured|storage/i.test(message) ? 503 : /provider|incomplete|no usable/i.test(message) ? 502 : /verified/i.test(message) ? 403 : 400); }
};
export const ALL: APIRoute = async () => errorResponse(synastryFeature, "Method not allowed.", 405);
