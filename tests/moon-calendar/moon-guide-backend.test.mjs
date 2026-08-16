import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getCurrentMoonGuide,
  getMoonDayGuide,
  getMoonMonthGuide,
  phaseIndexFromAge,
} from "../../src/server/aggregator/moon-guide-api.ts";

const env = {
  ASTROLOGYAPI_USER_ID: "test-user",
  ASTROLOGYAPI_PASSWORD: "test-password",
  TRANSIT_CALC_BASE_URL: "https://astrology.test",
};
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
const chart = () => ({
  planets: names.map((name, index) => {
    const longitude = name === "Sun" ? 120 : name === "Moon" ? 210 : index * 30;
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
      speed: 1,
    };
  }),
});
const phaseEvents = {
  events: [
    {
      event_type: "lunar_phase",
      phase_id: "new_moon",
      event_time_utc: "2026-07-29T12:00:00Z",
      event_time_local: "2026-07-29T17:30:00+05:30",
    },
    {
      event_type: "lunar_phase",
      phase_id: "full_moon",
      event_time_utc: "2026-08-12T12:00:00Z",
      event_time_local: "2026-08-12T17:30:00+05:30",
    },
    {
      event_type: "lunar_phase",
      phase_id: "new_moon",
      event_time_utc: "2026-08-28T12:00:00Z",
      event_time_local: "2026-08-28T17:30:00+05:30",
    },
    {
      event_type: "lunar_phase",
      phase_id: "full_moon",
      event_time_utc: "2026-09-11T12:00:00Z",
      event_time_local: "2026-09-11T17:30:00+05:30",
    },
    {
      event_type: "lunar_phase",
      phase_id: "new_moon",
      event_time_utc: "2026-09-27T12:00:00Z",
      event_time_local: "2026-09-27T17:30:00+05:30",
    },
  ],
};
const moonEvents = {
  events: [
    {
      event_type: "sign_ingress",
      planet: "Moon",
      event_time_utc: "2026-08-14T04:00:00Z",
      event_time_local: "2026-08-14T09:30:00+05:30",
      metadata: { to_sign: "Scorpio" },
    },
    {
      event_type: "void_of_course_start",
      planet: "Moon",
      event_time_utc: "2026-08-15T04:00:00Z",
      event_time_local: "2026-08-15T09:30:00+05:30",
      metadata: { ending_sign: "Scorpio" },
    },
  ],
};

const provider = (calls) => async (url, init) => {
  calls.push({ url, init });
  if (url.endsWith("/v1/western/birth-chart/data"))
    return Response.json(chart());
  if (url.endsWith("/v1/transits/lunar-phases"))
    return Response.json(phaseEvents);
  return Response.json(moonEvents);
};

test("Moon guide retains deterministic phase-age normalization", () => {
  assert.equal(phaseIndexFromAge(0), 0);
  assert.equal(phaseIndexFromAge(14.8), 4);
});

test("current Moon guide uses server-only Transit Engine positions, phases, and ingress", async () => {
  const calls = [];
  const current = await getCurrentMoonGuide({
    env,
    locale: "en",
    timezoneOffset: 5.5,
    now: "2026-08-14T00:00:00Z",
    fetcher: provider(calls),
  });
  assert.equal(current.phase.moonSign, "Scorpio");
  assert.equal(current.phase.moonDegree, 0);
  assert.equal(current.nextFull, "2026-09-11T17:30:00+05:30");
  assert.equal(current.nextNew, "2026-08-28T17:30:00+05:30");
  assert.equal(current.milestones.length, 5);
  assert.deepEqual(
    current.milestones.map((milestone) => milestone.kind),
    ["new", "full", "new", "full", "new"],
  );
  assert.equal(current.nextIngress.signIndex, 7);
  assert.deepEqual(calls.map((call) => call.url).sort(), [
    "https://astrology.test/v1/transits/events",
    "https://astrology.test/v1/transits/lunar-phases",
    "https://astrology.test/v1/western/birth-chart/data",
  ]);
  assert.ok(
    calls.every(
      (call) =>
        call.init.headers.authorization ===
        `Basic ${btoa("test-user:test-password")}`,
    ),
  );
});

test("month and selected-day guides expose provider-backed phases, events, sign, and degree", async () => {
  const monthCalls = [];
  const month = await getMoonMonthGuide({
    env,
    year: 2026,
    month: 8,
    timezoneOffset: 5.5,
    now: "2026-08-14T00:00:00Z",
    fetcher: provider(monthCalls),
  });
  assert.equal(month.days.length, 31);
  assert.equal(
    month.days.find((day) => day.iso === "2026-08-14").events[0].kind,
    "sign-ingress",
  );
  assert.equal(
    month.days.find((day) => day.iso === "2026-08-15").events[0].kind,
    "void-of-course",
  );

  const day = await getMoonDayGuide({
    env,
    date: "2026-08-14",
    timezoneOffset: 5.5,
    now: "2026-08-14T00:00:00Z",
    fetcher: provider([]),
  });
  assert.equal(day.moonSignIndex, 7);
  assert.equal(day.moonDegree, 0);
  assert.equal(typeof day.illumination, "number");
});

test("Moon Calendar hydrates dynamic data without making provider copy editable", async () => {
  const page = await readFile(
    new URL("../../src/pages/moon-calendar.astro", import.meta.url),
    "utf8",
  );
  const banner = await readFile(
    new URL(
      "../../src/components/moon-calendar/sections/MoonCalendarTonightBanner.astro",
      import.meta.url,
    ),
    "utf8",
  );
  const calendar = await readFile(
    new URL(
      "../../src/components/moon-calendar/sections/MoonCalendarCalendarDetail.astro",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(page, /getCurrentMoonGuide/);
  assert.match(page, /\.catch\(\(\) => null\)/);
  assert.doesNotMatch(page, /builder\.launcherEnabled\s*\?\s*null/);
  assert.match(page, /formatMoonMoment\(providerMoon\?\.nextFull\)/);
  assert.match(page, /formatMoonCountdown\(providerMoon\?\.nextNew\)/);
  assert.match(banner, /data-moon-calendar-tonight/);
  assert.match(banner, /scope", "current"/);
  assert.match(calendar, /scope", "month"/);
  assert.match(calendar, /scope", "day"/);
  assert.match(calendar, /timezoneOffset/);
});
