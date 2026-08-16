import type { APIRoute } from "astro";
import {
  getHoroscopePrediction,
  horoscopeFeature,
  normalizePeriod,
  normalizeSign,
} from "../../../../server/aggregator/horoscope-api.ts";
import { getRuntimeEnv, readJsonBody, requirePost } from "../../../../server/generated-site/request.ts";
import { errorResponse } from "../../../../server/generated-site/responses.ts";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const methodError = requirePost(context.request);
  if (methodError) return methodError;
  const parsed = await readJsonBody(context.request);
  if (!parsed.ok) return parsed.response;
  const sign = normalizeSign(parsed.body.sign);
  const period = normalizePeriod(parsed.body.period);
  if (!sign || !period) return errorResponse(horoscopeFeature, "Unsupported horoscope request.", 400);
  try {
    const reading = await getHoroscopePrediction({ env: await getRuntimeEnv(context), sign, period, locale: String(parsed.body.locale || "en") });
    return Response.json({ ok: true, sign, period, reading });
  } catch (error) {
    return errorResponse(horoscopeFeature, error instanceof Error ? error.message : "Horoscope provider request failed.", 502);
  }
};

export const ALL: APIRoute = async () => errorResponse(horoscopeFeature, "Method not allowed.", 405);
