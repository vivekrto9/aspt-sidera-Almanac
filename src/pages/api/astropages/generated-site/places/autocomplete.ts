import type { APIRoute } from "astro";
import {
  getGooglePlacesApiKey,
  mapGooglePlacePrediction,
  normalizePlacesInput,
  normalizePlacesLanguage,
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

const readyResponse = (predictions: Array<Record<string, unknown>>) =>
  jsonResponse({
    status: "ready",
    state: "ready",
    feature: placesFeature,
    message: "Place suggestions loaded.",
    data: { predictions },
  });

export const GET: APIRoute = async (context) => {
  const env = await getRuntimeEnv(context);
  const url = new URL(context.request.url);
  const input = normalizePlacesInput(url.searchParams.get("input"));
  const sessionToken = normalizeSessionToken(url.searchParams.get("sessionToken"));
  const language = normalizePlacesLanguage(url.searchParams.get("language"));

  if (input.length < 2) {
    return errorResponse(
      placesFeature,
      "Enter at least 2 characters to search places.",
      400,
    );
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
    input,
    key: apiKey,
    language,
    types: "(cities)",
  });
  if (sessionToken) params.set("sessiontoken", sessionToken);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
    );
    const payload = (await response.json()) as {
      status?: string;
      predictions?: Array<Record<string, unknown>>;
    };

    if (
      response.ok &&
      (!payload.status || payload.status === "OK" || payload.status === "ZERO_RESULTS")
    ) {
      return readyResponse(
        (payload.predictions ?? [])
          .map(mapGooglePlacePrediction)
          .filter((prediction) => prediction.placeId && prediction.description),
      );
    }
  } catch {
    return errorResponse(
      placesFeature,
      "Place suggestions are temporarily unavailable.",
      502,
    );
  }

  return errorResponse(
    placesFeature,
    "Place suggestions are temporarily unavailable.",
    502,
  );
};
