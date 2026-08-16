import assert from "node:assert/strict";
import test from "node:test";

import {
  mapCoordinatesToTimezone,
  mapGooglePlaceDetails,
  mapGooglePlacePrediction,
  normalizePlacesInput,
} from "../../src/server/aggregator/places/google-places.ts";
import { GET as autocompleteGET } from "../../src/pages/api/astropages/generated-site/places/autocomplete.ts";
import { GET as detailsGET } from "../../src/pages/api/astropages/generated-site/places/details.ts";
import { GET as timezoneGET } from "../../src/pages/api/astropages/generated-site/places/timezone.ts";
import { platformGooglePlacesSecretBinding } from "../../src/server/aggregator/runtime-bindings.ts";

const context = (url, env = {}) => ({
  request: new Request(url),
  locals: { runtime: { env } },
});

test("places adapter normalizes provider predictions and resolves timezones", () => {
  assert.equal(normalizePlacesInput(`  ${"a".repeat(140)}  `).length, 120);
  assert.deepEqual(
    mapGooglePlacePrediction({
      place_id: "city-id",
      description: "Mumbai, Maharashtra, India",
      structured_formatting: {
        main_text: "Mumbai",
        secondary_text: "Maharashtra, India",
      },
    }),
    {
      placeId: "city-id",
      description: "Mumbai, Maharashtra, India",
      mainText: "Mumbai",
      secondaryText: "Maharashtra, India",
    },
  );

  const timezone = mapCoordinatesToTimezone({
    lat: 19.076,
    lon: 72.8777,
    date: "2026-07-28",
    time: "12:00",
  });
  assert.equal(timezone.timezone, "Asia/Kolkata");
  assert.equal(timezone.offset, "UTC+05:30");
  assert.throws(() =>
    mapCoordinatesToTimezone({
      lat: 91,
      lon: 0,
      date: null,
      time: null,
    }),
  );
});

test("places endpoints validate short input and missing provider configuration", async () => {
  const shortResponse = await autocompleteGET(
    context("https://example.com/api/places/autocomplete?input=a"),
  );
  assert.equal(shortResponse.status, 400);

  const blockedResponse = await autocompleteGET(
    context("https://example.com/api/places/autocomplete?input=Mumbai"),
  );
  const blockedPayload = await blockedResponse.json();
  assert.equal(blockedPayload.status, "blocked-provider");
  assert.ok(blockedPayload.missingSecretNames.includes(platformGooglePlacesSecretBinding));
});

test("autocomplete and details APIs keep the provider key server-side", async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls = [];
  globalThis.fetch = async (request) => {
    const url = String(request);
    requestedUrls.push(url);
    if (url.includes("/autocomplete/")) {
      return new Response(
        JSON.stringify({
          status: "OK",
          predictions: [
            {
              place_id: "mumbai-id",
              description: "Mumbai, Maharashtra, India",
              structured_formatting: {
                main_text: "Mumbai",
                secondary_text: "Maharashtra, India",
              },
            },
          ],
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        status: "OK",
        result: {
          place_id: "mumbai-id",
          formatted_address: "Mumbai, Maharashtra, India",
          geometry: { location: { lat: 19.076, lng: 72.8777 } },
        },
      }),
      { status: 200 },
    );
  };

  try {
    const env = { [platformGooglePlacesSecretBinding]: "server-only-key" };
    const autocompleteResponse = await autocompleteGET(
      context(
        "https://example.com/api/places/autocomplete?input=Mumbai&language=en&sessionToken=session-1",
        env,
      ),
    );
    const autocompletePayload = await autocompleteResponse.json();
    assert.equal(autocompletePayload.status, "ready");
    assert.equal(autocompletePayload.data.predictions[0].placeId, "mumbai-id");
    assert.doesNotMatch(JSON.stringify(autocompletePayload), /server-only-key/);

    const detailsResponse = await detailsGET(
      context(
        "https://example.com/api/places/details?placeId=mumbai-id&date=2026-07-28&time=12%3A00&sessionToken=session-1",
        env,
      ),
    );
    const detailsPayload = await detailsResponse.json();
    assert.equal(detailsPayload.status, "ready");
    assert.deepEqual(detailsPayload.data.place, {
      placeId: "mumbai-id",
      formattedAddress: "Mumbai, Maharashtra, India",
      lat: 19.076,
      lon: 72.8777,
      timezone: "Asia/Kolkata",
      offset: "UTC+05:30",
    });
    assert.doesNotMatch(JSON.stringify(detailsPayload), /server-only-key/);
    assert.ok(requestedUrls.every((url) => url.includes("key=server-only-key")));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("timezone endpoint supports coordinates from alternate place providers", async () => {
  const response = await timezoneGET(
    context(
      "https://example.com/api/places/timezone?lat=38.7223&lon=-9.1393&date=2026-07-28&time=12%3A00",
    ),
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, "ready");
  assert.equal(payload.data.timezone, "Europe/Lisbon");
  assert.match(payload.data.offset, /^UTC[+-]\d{2}:\d{2}$/);

  const missingResponse = await timezoneGET(
    context("https://example.com/api/places/timezone"),
  );
  assert.equal(missingResponse.status, 422);
});

test("place details mapping rejects provider payloads without coordinates", () => {
  assert.throws(() =>
    mapGooglePlaceDetails({
      result: {
        place_id: "missing-geometry",
        formatted_address: "Unknown",
      },
      date: null,
      time: null,
    }),
  );
});
