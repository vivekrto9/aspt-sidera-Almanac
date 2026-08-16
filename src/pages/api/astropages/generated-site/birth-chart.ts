import type { APIRoute } from "astro";
import {
  birthChartFeature,
  createBirthChartReading,
  getBirthChartReading,
} from "../../../../server/aggregator/birth-chart-api.ts";
import {
  getRuntimeEnv,
  readJsonBody,
  requirePost,
} from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const readingId = new URL(context.request.url).searchParams.get("readingId") || "";
  const env = await getRuntimeEnv(context);
  const result = await getBirthChartReading({ env, request: context.request, readingId });
  if (!result) return errorResponse(birthChartFeature, "Saved chart was not found.", 404);
  return Response.json({ ok: true, ...result });
};

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  try {
    const env = await getRuntimeEnv(context);
    const result = await createBirthChartReading({
      env,
      request: context.request,
      body: parsed.body,
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Birth chart could not be generated.";
    const status = /not configured|storage/i.test(message) ? 503 : /provider|incomplete/i.test(message) ? 502 : 400;
    return errorResponse(birthChartFeature, message, status);
  }
};

export const ALL: APIRoute = async () =>
  errorResponse(birthChartFeature, "Method not allowed.", 405);
