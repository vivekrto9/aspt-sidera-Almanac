import type { APIRoute } from "astro";
import {
  mapCoordinatesToTimezone,
  placesFeature,
} from "../../../../../server/aggregator/places/google-places.ts";
import {
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");
  const lat = latParam === null || latParam.trim() === "" ? Number.NaN : Number(latParam);
  const lon = lonParam === null || lonParam.trim() === "" ? Number.NaN : Number(lonParam);
  const date = url.searchParams.get("date");
  const time = url.searchParams.get("time");

  try {
    return jsonResponse({
      status: "ready",
      state: "ready",
      feature: placesFeature,
      message: "Timezone loaded.",
      data: mapCoordinatesToTimezone({ lat, lon, date, time }),
    });
  } catch {
    return errorResponse(
      placesFeature,
      "Timezone could not be resolved for this place.",
      422,
    );
  }
};
