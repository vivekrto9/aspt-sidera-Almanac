import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBirthChartProviderPayload,
  createBirthChartReading,
  getBirthChartReading,
  normalizeBirthChartResult,
  timezoneOffsetToHours,
  validateBirthChartInput,
} from "../../src/server/aggregator/birth-chart-api.ts";

const inputBody = {
  name: "Ajeet",
  birthDate: "1990-05-10",
  birthTime: "19:55",
  place: "Pune, Maharashtra, India",
  placeId: "google-place-id",
  lat: 18.5204,
  lon: 73.8567,
  timezone: "Asia/Kolkata",
  timezoneOffset: "UTC+05:30",
  houseType: "placidus",
  locale: "en",
};

const providerResponse = {
  planets: [
    { name: "Sun", norm_degree: 16.1, full_degree: 76.1, sign: "Gemini", house: 7, is_retro: "false", speed: 1.01 },
    { name: "Moon", norm_degree: 4.3, full_degree: 124.3, sign: "Leo", house: 9, is_retro: false },
    { name: "Mercury", norm_degree: 22, full_degree: 52, sign: "Taurus", house: 6, is_retro: "true", speed: -0.2 },
  ],
  houses: Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    sign: index === 0 ? "Sagittarius" : "Capricorn",
    degree: [252.25, 281, 312, 342, 11, 42, 72, 101, 132, 162, 191, 222][index],
  })),
  ascendant: "Sagittarius",
  aspects: [{ aspecting_planet: "Sun", aspected_planet: "Moon", type: "Trine", orb: 1.2 }],
};

const makeDb = () => {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      const call = { sql, values: [], ran: false };
      calls.push(call);
      return {
        bind(...values) {
          call.values = values;
          return this;
        },
        async all() {
          return { results: [] };
        },
        async first() {
          return null;
        },
        async run() {
          call.ran = true;
          return { meta: { changes: 1 } };
        },
      };
    },
  };
};

test("birth chart input validation owns date, place, timezone, and house normalization", () => {
  assert.equal(timezoneOffsetToHours("UTC+05:30"), 5.5);
  const input = validateBirthChartInput({ ...inputBody, houseType: "whole-sign" }, new Date("2026-08-12T00:00:00Z"));
  assert.equal(input.houseType, "whole_sign");
  const equalHouseInput = validateBirthChartInput({ ...inputBody, houseType: "equal" }, new Date("2026-08-12T00:00:00Z"));
  assert.equal(equalHouseInput.houseType, "equal");
  assert.equal(buildBirthChartProviderPayload(equalHouseInput).house_type, "equal");
  assert.notEqual(buildBirthChartProviderPayload(equalHouseInput).house_type, "equal_house");
  assert.equal(input.day, 10);
  assert.throws(
    () => validateBirthChartInput({ ...inputBody, birthDate: "2027-01-01" }, new Date("2026-08-12T00:00:00Z")),
    /future/,
  );
  assert.throws(
    () => validateBirthChartInput({ ...inputBody, placeId: "" }, new Date("2026-08-12T00:00:00Z")),
    /suggestions/,
  );
});

test("birth chart provider payload and response normalize into the existing Sidera result model", () => {
  const input = validateBirthChartInput(inputBody, new Date("2026-08-12T00:00:00Z"));
  const payload = buildBirthChartProviderPayload(input);
  assert.deepEqual(
    { day: payload.day, month: payload.month, year: payload.year, tzone: payload.tzone, house: payload.house_type },
    { day: 10, month: 5, year: 1990, tzone: 5.5, house: "placidus" },
  );
  const chart = normalizeBirthChartResult({ input, response: providerResponse });
  assert.equal(chart.chartName, "Ajeet");
  assert.deepEqual(chart.bigThree.map((item) => item.sign), ["Gemini", "Leo", "Sagittarius"]);
  assert.equal(chart.planets[2].retrograde, true);
  assert.equal(chart.planets[0].retrograde, false);
  assert.equal(chart.houseCusps.length, 12);
  assert.equal(chart.houseCusps[1], 281);
  assert.equal(chart.aspects[0].tone, "harmonious");
});

test("saved birth charts rehydrate provider facts and current locale on read", async () => {
  const input = validateBirthChartInput(inputBody, new Date("2026-08-12T00:00:00Z"));
  const staleChart = normalizeBirthChartResult({ input, response: providerResponse });
  staleChart.planets[0].retrograde = true;
  delete staleChart.houseCusps;
  const row = {
    id: "chart_saved",
    account_id: "",
    profile_id: "",
    input_json: JSON.stringify(input),
    result_json: JSON.stringify(staleChart),
    provider_response_json: JSON.stringify(providerResponse),
    generated_at: "2026-08-12T00:00:00.000Z",
  };
  const reading = await getBirthChartReading({
    env: {
      DB: {
        prepare() {
          return {
            bind() { return this; },
            async first() { return row; },
          };
        },
      },
    },
    request: new Request("https://sidera.test/birth-chart/chart_saved?locale=fr"),
    readingId: "chart_saved",
    locale: "fr",
  });

  assert.equal(reading.chart.planets[0].retrograde, false);
  assert.equal(reading.chart.houseCusps.length, 12);
  assert.match(reading.chart.birthSummary, /10 mai 1990/);
});

test("birth chart creation calls only the interpretation endpoint and stores a stable reading", async () => {
  const db = makeDb();
  const requests = [];
  const result = await createBirthChartReading({
    env: {
      DB: db,
      X_ASTROLOGYAPI_KEY: "test-key",
      ASTROLOGY_API_BASE_URL: "https://astrology.test/v1",
      ASTROPAGES_PROJECT_ID: `birth-chart-${Date.now()}`,
    },
    request: new Request("https://sidera.test/api/astropages/generated-site/birth-chart", { method: "POST" }),
    body: inputBody,
    now: "2026-08-12T00:00:00.000Z",
    fetcher: async (url, init) => {
      requests.push({ url, init });
      return Response.json(providerResponse);
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.savedToAccount, false);
  assert.deepEqual(requests.map((request) => request.url), ["https://astrology.test/v1/natal_chart_interpretation"]);
  assert.equal(requests[0].init.headers["x-astrologyapi-key"], "test-key");
  const inserts = db.calls.filter((call) => call.ran && /INSERT INTO ap_chart_readings/.test(call.sql));
  assert.equal(inserts.length, 1);
  assert.doesNotMatch(JSON.stringify(result.chart), /provider_response|provider_payload/);
});

test("birth chart UI submits the real API and result route loads persisted readings", async () => {
  const experience = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../../src/components/birth-chart/BirthChartExperience.astro", import.meta.url), "utf8"));
  const resultPage = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../../src/pages/birth-chart/[slug].astro", import.meta.url), "utf8"));
  assert.match(experience, /generated-site\/birth-chart/);
  assert.match(experience, /body\.readingId/);
  assert.doesNotMatch(experience, /castingDelayMs|alex-rivera/);
  assert.match(resultPage, /getBirthChartReading/);
  assert.doesNotMatch(resultPage, /dummyBirthChartResult|alex-rivera/);
});
