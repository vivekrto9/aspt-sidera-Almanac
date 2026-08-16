import type { APIRoute } from "astro";
import {
  getGooglePlacesApiKey,
  mapGooglePlaceDetails,
  normalizePlacesInput,
  normalizeSessionToken,
  placesCapabilityKey,
  placesFeature,
  placesMissingSecretNames,
} from "../../../../../server/aggregator/places/google-places.ts";
import { getRuntimeEnv } from "../../../../../server/generated-site/request.ts";
import {
  blockedProviderResponse,
  errorResponse,
  jsonResponse,
} from "../../../../../server/generated-site/responses.ts";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const url = new URL(context.request.url);
  const placeId = normalizePlacesInput(url.searchParams.get("placeId"));
  const sessionToken = normalizeSessionToken(url.searchParams.get("sessionToken"));
  const date = url.searchParams.get("date");
  const time = url.searchParams.get("time");

  if (!placeId) {
    return errorResponse(placesFeature, "Place id is required.", 400);
  }

  const apiKey = await getGooglePlacesApiKey(env);
  if (!apiKey) {
    return blockedProviderResponse({
      feature: placesFeature,
      capabilityKey: placesCapabilityKey,
      missingSecretNames: placesMissingSecretNames,
      message: "Place search is temporarily unavailable. Please try again later.",
    });
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "place_id,formatted_address,geometry",
    key: apiKey,
  });
  if (sessionToken) params.set("sessiontoken", sessionToken);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
    );
    const payload = (await response.json()) as {
      status?: string;
      result?: Record<string, unknown>;
    };

    if (!response.ok || payload.status !== "OK" || !payload.result) {
      return errorResponse(
        placesFeature,
        "Place details are temporarily unavailable.",
        502,
      );
    }

    return jsonResponse({
      status: "ready",
      state: "ready",
      feature: placesFeature,
      message: "Place details loaded.",
      data: {
        place: mapGooglePlaceDetails({
          result: payload.result,
          date,
          time,
        }),
      },
    });
  } catch {
    return errorResponse(
      placesFeature,
      "Place details are temporarily unavailable.",
      502,
    );
  }
};
