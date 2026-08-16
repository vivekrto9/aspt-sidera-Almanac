import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getHoroscopePrediction,
  normalizeHoroscopeResponse,
  normalizePeriod,
  normalizeSign,
} from "../../src/server/aggregator/horoscope-api.ts";

const makeDb = () => {
  const writes = [];
  return {
    writes,
    prepare(sql) {
      return {
        bind(...values) { this.values = values; return this; },
        async first() { return null; },
        async run() { writes.push({ sql, values: this.values }); return {}; },
      };
    },
  };
};

test("horoscope validates supported signs and provider periods", () => {
  assert.equal(normalizeSign("Aries"), "aries");
  assert.equal(normalizeSign("ophiuchus"), null);
  assert.equal(normalizePeriod("weekly"), "weekly");
  assert.equal(normalizePeriod("tomorrow"), null);
});

test("horoscope normalizes daily and weekly provider payloads", () => {
  assert.deepEqual(normalizeHoroscopeResponse("daily", { prediction: { personal_life: "Open the conversation.", profession: "Choose one priority.", emotions: "Let the answer arrive." } }), {
    headline: "Let the answer arrive.",
    sections: ["Open the conversation.", "Choose one priority."],
  });
  assert.deepEqual(normalizeHoroscopeResponse("weekly", { prediction: ["First movement", "Second movement"] }).sections, ["Second movement"]);
  assert.throws(() => normalizeHoroscopeResponse("monthly", {}), /incomplete/);
});

test("horoscope calls AstrologyAPI and stores a bounded locale cache", async () => {
  const db = makeDb();
  const requests = [];
  const result = await getHoroscopePrediction({
    env: { DB: db, X_ASTROLOGYAPI_KEY: "key", ASTROLOGY_API_BASE_URL: "https://astrology.test/v1", ASTROPAGES_PROJECT_ID: `horoscope-${Date.now()}` },
    sign: "aries",
    period: "daily",
    locale: "en",
    now: "2026-08-12T00:00:00.000Z",
    fetcher: async (url, init) => { requests.push({ url, init }); return Response.json({ prediction: { personal_life: "Real provider reading", profession: "Provider work reading" } }); },
  });
  assert.equal(result.source, "provider");
  assert.equal(result.headline, "Real provider reading");
  assert.equal(requests[0].url, "https://astrology.test/v1/sun_sign_prediction/daily/aries");
  assert.equal(db.writes.length, 1);
  assert.match(db.writes[0].sql, /ON CONFLICT/);
});

test("daily horoscope page consumes provider data without making dynamic text editable", async () => {
  const page = await readFile(new URL("../../src/pages/daily-horoscope/[slug].astro", import.meta.url), "utf8");
  const component = await readFile(new URL("../../src/components/daily-horoscope/sections/DailyHoroscopeReading.astro", import.meta.url), "utf8");
  assert.match(page, /getHoroscopePrediction/);
  assert.match(page, /activePeriod === "today"/);
  assert.doesNotMatch(page, /providerPeriod && !builder\.launcherEnabled/);
  assert.match(page, /providerSource=\{providerReading\?\.source\}/);
  assert.match(component, /data-horoscope-source=\{providerSource \?\? "editorial-fallback"\}/);
  assert.match(component, /providerSections \? providerSections\[index\] : copy\.themeTexts\[index\]/);
});
