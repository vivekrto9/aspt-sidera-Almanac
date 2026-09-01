import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  normalizeSkyPositions,
  normalizeUpcomingSkyAspectEvents,
  getSkyForDate,
} from "../../src/server/aggregator/sky-api.ts";
import {
  normalizeRetrogradeResult,
  normalizeRetrogradeStations,
} from "../../src/server/aggregator/retrogrades-api.ts";
import {
  buildSynastryPersonPayload,
  normalizeSynastryResult,
  synastryPositionsEndpoint,
  validateSynastryInput,
} from "../../src/server/aggregator/synastry-api.ts";
import { postAstrologyEngine } from "../../src/server/aggregator/astrology-engine-api.ts";
import {
  createTransitReading,
  getTransitReading,
  normalizeTransitResult,
  timezoneOffsetForDate,
  validateTransitProfile,
} from "../../src/server/aggregator/transit-api.ts";

const names = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];
const chart = (offset = 0) => ({
  planets: names.map((name, index) => {
    const longitude = (index * 34 + offset) % 360;
    const signs = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];
    return {
      name,
      full_degree: longitude,
      norm_degree: longitude % 30,
      sign: signs[Math.floor(longitude / 30)],
      house: (index % 12) + 1,
      speed: name === "Mercury" ? -0.4 : 1,
      is_retro: name === "Mercury",
    };
  }),
  houses: Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    degree: (index * 29 + offset) % 360,
  })),
});
const env = {
  ASTROLOGY_API_BASE_URL: "https://astrology.test",
  X_ASTROLOGYAPI_KEY: "test-key",
};

test("Today’s Sky loads exact provider positions plus events with server-only AstrologyAPI key", async () => {
  const calls = [];
  const result = await getSkyForDate({
    env,
    date: "2026-08-13",
    now: "2026-08-13T00:00:00Z",
    fetcher: async (url, init) => {
      calls.push({ url, init });
      return url.endsWith("/tropical_transits/daily")
        ? Response.json({
            transit_relation: [
              {
                transit_planet: "Mercury",
                natal_planet: "Uranus",
                type: "Trine",
                date: "13-8-2026",
              },
            ],
          })
        : Response.json(chart(calls.length));
    },
  });
  assert.equal(result.positions.length, 10);
  assert.equal(result.positions[2].motionText, "Retrograde");
  assert.equal(result.events.length, 1);
  assert.deepEqual(
    calls.map((call) => call.url),
    [
      "https://astrology.test/v1/western_horoscope",
      "https://astrology.test/v1/tropical_transits/daily",
      "https://astrology.test/v1/western_horoscope",
    ],
  );
  assert.ok(
    calls.every(
      (call) => call.init.headers["x-astrologyapi-key"] === "test-key",
    ),
  );
  assert.ok(calls.every((call) => !("authorization" in call.init.headers)));
  const positionPayload = JSON.parse(calls[0].init.body);
  assert.deepEqual(positionPayload, {
    day: 13,
    month: 8,
    year: 2026,
    hour: 12,
    min: 0,
    lat: 0,
    lon: 0,
    tzone: 0,
    house_type: "placidus",
    is_asteroids: false,
  });
  assert.equal(positionPayload.birth_details, undefined);
});

test("Today’s Sky uses the current instant only for the live view", async () => {
  const payloads = [];
  const fetcher = async (url, init) => {
    payloads.push(JSON.parse(init.body));
    return url.endsWith("/tropical_transits/daily")
      ? Response.json({ transit_relation: [] })
      : Response.json(chart(payloads.length));
  };
  const result = await getSkyForDate({
    env,
    date: "2026-08-13",
    now: "2026-08-13T07:06:05Z",
    live: true,
    fetcher,
  });
  assert.deepEqual(payloads[0], {
    day: 13,
    month: 8,
    year: 2026,
    hour: 7,
    min: 6,
    lat: 0,
    lon: 0,
    tzone: 0,
    house_type: "placidus",
    is_asteroids: false,
  });
  assert.equal(result.calculatedAt, "2026-08-13T07:06:05.000Z");
  assert.deepEqual(payloads[2], {
    day: 14,
    month: 8,
    year: 2026,
    hour: 7,
    min: 6,
    lat: 0,
    lon: 0,
    tzone: 0,
    house_type: "placidus",
    is_asteroids: false,
  });
});

test("upcoming sky aspects normalize, deduplicate, and sort provider events", () => {
  const events = normalizeUpcomingSkyAspectEvents([
    {
      event_type: "planetary_aspect",
      planet: "venus",
      related_planet: "Saturn",
      event_subtype: "square",
      event_time_utc: "2026-08-18T10:00:00Z",
    },
    {
      event_type: "transit_aspects",
      transiting_planet: "Mars",
      metadata: {
        related_planet: "Uranus",
        aspect: "trine",
        exact_moment_local: "2026-08-16T12:00:00+05:30",
      },
    },
    {
      planet: "venus",
      related_planet: "Saturn",
      aspect: "square",
      moment_utc: "2026-08-18T10:00:00Z",
    },
    {
      transit_planet: "Jupiter",
      natal_planet: "Moon",
      type: "sextile",
      date: "14-8-2026",
    },
    {
      event_type: "direction_change",
      planet: "Mercury",
      event_time_utc: "2026-08-17T00:00:00Z",
    },
  ]);

  assert.equal(events.length, 3);
  assert.equal(events[0].planetA, "Jupiter");
  assert.equal(events[0].planetB, "Moon");
  assert.equal(events[0].aspectId, "sextile");
  assert.equal(events[1].planetA, "Mars");
  assert.equal(events[1].planetB, "Uranus");
  assert.equal(events[1].aspectId, "trine");
  assert.equal(events[2].aspectId, "square");
});

test("home sky can request a bounded upcoming event window", async () => {
  const calls = [];
  await getSkyForDate({
    env,
    date: "2026-08-13",
    now: "2026-08-13T00:00:00Z",
    eventRangeDays: 30,
    fetcher: async (url, init) => {
      calls.push({ url, payload: JSON.parse(init.body) });
      return url.endsWith("/tropical_transits/monthly")
        ? Response.json({ transit_relation: [] })
        : Response.json(chart());
    },
  });
  const eventCall = calls.find((call) =>
    call.url.endsWith("/tropical_transits/monthly"),
  );
  assert.deepEqual(eventCall.payload, {
    day: 13,
    month: 8,
    year: 2026,
    hour: 12,
    min: 0,
    lat: 0,
    lon: 0,
    tzone: 0,
    house_type: "placidus",
    is_asteroids: false,
  });
});

test("Retrogrades normalize station changes into current cards and a year timeline", () => {
  const response = {
    changes: [
      {
        planet: "Mercury",
        change: "retrograde",
        change_type: "direction",
        date: "2026-06-29T12:00:00Z",
        position: { longitude: 106 },
      },
      {
        planet: "Mercury",
        event_type: "direction_change",
        event_subtype: "retrograde_to_direct",
        moment_local: "2026-07-23T12:00:00Z",
        metadata: { from_state: "Retrograde", to_state: "Direct" },
      },
      { planet: "Saturn", direction: "retrograde", date: "2026-07-13" },
      { planet: "Saturn", direction: "direct", date: "2026-11-28" },
      { planet: "Jupiter", direction: "direct", date: "2026-03-11" },
      { planet: "Pluto", direction: "retrograde", date: "2026-05-06" },
      { planet: "Pluto", direction: "direct", date: "2026-10-16" },
    ],
  };
  assert.equal(normalizeRetrogradeStations(response).length, 7);
  const positionsResponse = chart();
  const pluto = positionsResponse.planets.find(
    (planet) => planet.name === "Pluto",
  );
  pluto.speed = -0.02;
  pluto.is_retro = true;
  const result = normalizeRetrogradeResult({
    response,
    positionsResponse,
    year: 2026,
    locale: "en",
    today: "2026-07-15",
  });
  assert.ok(result.current.some((item) => item.id === "mercury"));
  assert.ok(result.current.some((item) => item.id === "pluto"));
  assert.equal(result.timeline.rows.length, 8);
  assert.equal(
    result.timeline.rows.find((row) => row.id === "jupiter").segments[0].left,
    0,
  );
  assert.ok(
    result.timeline.rows.find((row) => row.id === "saturn").segments.length > 0,
  );
  assert.equal(
    result.current.find((item) => item.id === "pluto").shadowDate,
    undefined,
  );
});

test("Synastry validates two complete profiles and builds the native Sidera contract", () => {
  const person = {
    name: "Mara",
    year: 1992,
    month: 8,
    day: 12,
    hour: 7,
    minute: 30,
    period: "PM",
    location: "Lisbon",
    locationId: "place",
    latitude: 38.7,
    longitude: -9.1,
    timezone: "Europe/Lisbon",
    timezoneOffset: "UTC+01:00",
  };
  const input = validateSynastryInput({
    locale: "en",
    personA: person,
    personB: { ...person, name: "Sam", year: 1990 },
  });
  assert.equal("relationship" in input, false);
  assert.equal(synastryPositionsEndpoint, "/v1/western_horoscope");
  assert.deepEqual(buildSynastryPersonPayload(input.personA), {
    day: 12,
    month: 8,
    year: 1992,
    hour: 19,
    min: 30,
    lat: 38.7,
    lon: -9.1,
    tzone: 1,
    house_type: "placidus",
    is_asteroids: false,
  });
  const result = normalizeSynastryResult({
    input,
    firstResponse: chart(0),
    secondResponse: chart(4),
  });
  assert.equal(result.planets.length, 20);
  assert.ok(result.aspects.length > 0);
  assert.equal(result.categories.length, 5);
  assert.equal(
    new Set(result.categories.map((category) => category.value)).size > 1,
    true,
  );
  assert.match(result.aspects[0].interpretation, /Mara’s|Sam’s/);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.relationshipContext, "Synastry compatibility");
  assert.doesNotMatch(
    JSON.stringify(result),
    /provider_payload|provider_response/,
  );
});

test("Transit combines natal/current positions and personalized events", () => {
  const personalized = {
    timeline: [
      {
        event_type: "transit_aspects",
        transiting_planet: "Mars",
        natal_planet: "Sun",
        event_subtype: "trine",
        metadata: {
          aspect: "trine",
          orb: 1.2,
          phase: "applying",
          transit_sign: "Leo",
        },
      },
    ],
  };
  const result = normalizeTransitResult({
    profileName: "Alex",
    birthDate: "1990-01-01",
    birthPlace: "Lisbon",
    date: "2026-08-13",
    natalResponse: chart(),
    transitResponse: chart(8),
    personalizedResponse: personalized,
  });
  assert.equal(result.planets.length, 20);
  assert.equal(result.houseCusps.length, 12);
  assert.equal(result.chartRotation, 0);
  assert.equal(result.aspects[0].title, "Mars trine natal Sun");
  assert.equal(result.aspects[0].tone, "harmonious");
});

test("Transit result date navigation recalculates from the stored manual chart", async () => {
  const embeddedProfile = {
    profileName: "Mara",
    birthDate: "1992-08-12",
    birthTime: "19:30",
    birthPlace: "Lisbon",
    placeLat: 38.7,
    placeLon: -9.1,
    placeTimezone: "Europe/Lisbon",
    timezoneOffset: "UTC+01:00",
    updatedAt: "manual",
  };
  const stored = normalizeTransitResult({
    profileName: "Mara",
    birthDate: embeddedProfile.birthDate,
    birthPlace: embeddedProfile.birthPlace,
    date: "2026-08-13",
    natalResponse: chart(),
    transitResponse: chart(8),
    personalizedResponse: {
      timeline: [
        {
          event_type: "transit_aspects",
          transiting_planet: "Mars",
          natal_planet: "Sun",
          event_subtype: "trine",
          metadata: { aspect: "trine", orb: 1.2, phase: "applying" },
        },
      ],
    },
  });
  stored.slug = "transit_test";
  const row = {
    account_id: null,
    profile_id: null,
    input_json: JSON.stringify({
      profile: embeddedProfile,
      date: stored.dateIso,
    }),
    result_json: JSON.stringify(stored),
    provider_response_json: "{}",
  };
  const DB = {
    prepare: (sql) => ({
      bind: () => ({
        first: async () =>
          sql.includes("FROM ap_chart_readings") ? row : null,
        run: async () => ({ success: true }),
      }),
    }),
  };
  const refreshed = await getTransitReading({
    env: { ...env, DB },
    request: new Request(
      "https://sidera.test/transit/transit_test?date=2026-08-14",
    ),
    readingId: "transit_test",
    date: "2026-08-14",
    now: "2026-08-13T00:00:00Z",
    fetcher: async (url) =>
      url.endsWith("/v1/transits/personalized")
        ? Response.json({
            timeline: [
              {
                event_type: "transit_aspects",
                transiting_planet: "Mars",
                natal_planet: "Sun",
                event_subtype: "trine",
                metadata: { aspect: "trine", orb: 0.8, phase: "separating" },
              },
            ],
          })
        : Response.json(chart(4)),
  });
  assert.equal(refreshed.result.dateIso, "2026-08-14");
  assert.equal(refreshed.result.slug, "transit_test");
  assert.equal(refreshed.result.aspects[0].phase, "separating");
});

test("Transit derives the target-date timezone offset so daylight saving changes are respected", () => {
  assert.equal(
    timezoneOffsetForDate({
      timezone: "America/New_York",
      date: new Date("2026-01-15T12:00:00Z"),
      fallback: "UTC-05:00",
    }),
    -5,
  );
  assert.equal(
    timezoneOffsetForDate({
      timezone: "America/New_York",
      date: new Date("2026-07-15T12:00:00Z"),
      fallback: "UTC-05:00",
    }),
    -4,
  );
  assert.equal(
    timezoneOffsetForDate({
      timezone: "Invalid/Timezone",
      date: new Date("2026-07-15T12:00:00Z"),
      fallback: "UTC+05:30",
    }),
    5.5,
  );
});

test("Transit accepts valid manual birth details without requiring a saved account profile", () => {
  const profile = validateTransitProfile({
    name: "Mara",
    year: 1992,
    month: 8,
    day: 12,
    hour: 7,
    minute: 30,
    period: "PM",
    location: "Lisbon",
    locationId: "place",
    latitude: 38.7,
    longitude: -9.1,
    timezone: "Europe/Lisbon",
    timezoneOffset: "UTC+01:00",
  });
  assert.equal(profile.profileName, "Mara");
  assert.equal(profile.birthTime, "19:30");
});

test("Transit persists a guest manual reading as a public unowned result", async () => {
  const statements = [];
  const DB = {
    prepare: (sql) => ({
      bind: (...values) => ({
        first: async () => null,
        run: async () => {
          statements.push({ sql, values });
          return { success: true };
        },
      }),
    }),
  };
  const profile = {
    name: "Mara",
    year: 1992,
    month: 8,
    day: 12,
    hour: 7,
    minute: 30,
    period: "PM",
    location: "Lisbon",
    locationId: "place",
    latitude: 38.7,
    longitude: -9.1,
    timezone: "Europe/Lisbon",
    timezoneOffset: "UTC+01:00",
  };
  const result = await createTransitReading({
    env: { ...env, DB },
    request: new Request(
      "https://sidera.test/api/astropages/generated-site/transit",
      { method: "POST" },
    ),
    profile,
    date: "2026-08-13",
    now: "2026-08-13T00:00:00Z",
    fetcher: async (url) =>
      url.endsWith("/v1/transits/personalized")
        ? Response.json({
            timeline: [
              {
                event_type: "transit_aspects",
                transiting_planet: "Mars",
                natal_planet: "Sun",
                event_subtype: "trine",
                metadata: { aspect: "trine", orb: 1.2, phase: "applying" },
              },
            ],
          })
        : Response.json(chart()),
  });
  assert.equal(result.ok, true);
  const insert = statements.find((statement) =>
    statement.sql.includes("INSERT INTO ap_chart_readings"),
  );
  assert.equal(insert.values[1], null);
  assert.equal(insert.values[2], null);
});

test("Transit rejects unauthenticated access to a saved profile before calling the provider", async () => {
  let providerCalls = 0;
  await assert.rejects(
    createTransitReading({
      env: {
        ...env,
        DB: {
          prepare: () => {
            throw new Error(
              "DB should not be queried without a session cookie",
            );
          },
        },
      },
      request: new Request(
        "https://sidera.test/api/astropages/generated-site/transit",
        { method: "POST" },
      ),
      profileId: "profile_1",
      date: "2026-08-13",
      now: "2026-08-13T00:00:00Z",
      fetcher: async () => {
        providerCalls += 1;
        return Response.json(chart());
      },
    }),
    /Sign in to use a saved profile/,
  );
  assert.equal(providerCalls, 0);
});

test("Provider cache failures remain non-fatal and never move AstrologyAPI credentials client-side", async () => {
  const result = await postAstrologyEngine({
    env: {
      ...env,
      DB: {
        prepare: () => {
          throw new Error("cache unavailable");
        },
      },
    },
    endpoint: "/v1/western/birth-chart/data",
    payload: { birth_details: {} },
    cacheKey: "safe-cache-test",
    ttlSeconds: 60,
    fetcher: async (_url, init) => {
      assert.equal(init.headers["x-astrologyapi-key"], "test-key");
      assert.equal(init.headers.authorization, undefined);
      return Response.json(chart());
    },
  });
  assert.equal(result.source, "provider");
});

test("all four public/private pages use the new APIs rather than result fixtures", async () => {
  const files = await Promise.all(
    [
      "../../src/pages/todays-sky.astro",
      "../../src/pages/retrogrades.astro",
      "../../src/components/transit/TransitExperience.astro",
      "../../src/pages/transit/[slug].astro",
      "../../src/components/synastry/SynastryExperience.astro",
      "../../src/pages/synastry/[slug].astro",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  assert.match(files[0], /getSkyForDate/);
  assert.match(files[0], /import EmptyState/);
  assert.doesNotMatch(
    files[0],
    /getSkyBodyPositions|getSkyAspectDetails|getSkyMoonState/,
  );
  assert.match(files[1], /getRetrogrades/);
  assert.match(files[1], /import EmptyState/);
  assert.doesNotMatch(
    files[1],
    /getPreparedRetrogradeStatuses|getPreparedRetrogradeTimeline/,
  );
  assert.match(files[2], /generated-site\/transit/);
  assert.match(files[3], /getTransitReading/);
  assert.doesNotMatch(files[3], /getDummyTransitResult|alex-rivera/);
  assert.match(files[4], /generated-site\/synastry/);
  assert.match(files[5], /getSynastryReading/);
  assert.doesNotMatch(files[5], /dummySynastryResult|mara-sam/);
});

test("authenticated Synastry and Transit mutations carry Sidera customer CSRF protection", async () => {
  const [synastryUi, synastryServer, transitUi, transitServer] =
    await Promise.all([
      readFile(
        new URL(
          "../../src/components/synastry/SynastryExperience.astro",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../../src/server/aggregator/synastry-api.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL(
          "../../src/components/transit/TransitExperience.astro",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../../src/server/aggregator/transit-api.ts", import.meta.url),
        "utf8",
      ),
    ]);
  assert.match(synastryUi, /x-astropages-customer-csrf/);
  assert.match(synastryServer, /requireCustomerCsrf/);
  assert.match(transitUi, /x-astropages-customer-csrf/);
  assert.match(transitServer, /requireCustomerCsrf/);
});
