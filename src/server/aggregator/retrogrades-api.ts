import {
  activeLocaleCodes,
  type SupportedLocale,
} from "../../data/localization-contract.ts";
import type {
  PreparedRetrogradeStatus,
  PreparedRetrogradeTimelineRow,
} from "../../data/retrogrades/results.ts";
import {
  astrologyRecord,
  postAstrologyEngine,
  type AstrologyFetcher,
  type AstrologyRecord,
} from "./astrology-engine-api.ts";
import { buildSkyPayload, normalizeSkyPositions } from "./sky-api.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

export const retrogradesFeature = "sidera.retrogrades";
const stationsEndpoint = "/v1/transits/events";
const positionsEndpoint = "/v1/western/birth-chart/data";
const supported = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;
type PlanetId = (typeof supported)[number];
const presentation: Record<PlanetId, { glyph: string; color: string }> = {
  mercury: { glyph: "☿", color: "#6c6254" },
  venus: { glyph: "♀", color: "#8c5a6a" },
  mars: { glyph: "♂", color: "#9c4f38" },
  jupiter: { glyph: "♃", color: "#b07a3c" },
  saturn: { glyph: "♄", color: "#2f4a41" },
  uranus: { glyph: "♅", color: "#426b68" },
  neptune: { glyph: "♆", color: "#4a5a6b" },
  pluto: { glyph: "♇", color: "#6b5346" },
};
type Station = {
  planet: PlanetId;
  kind: "retrograde" | "direct";
  date: string;
  degree?: number;
  sign?: string;
  shadowStart?: string;
  shadowEnd?: string;
};

const arrayFrom = (response: AstrologyRecord) => {
  const direct = [response.changes, response.events, response.timeline].find(
    Array.isArray,
  );
  if (Array.isArray(direct)) return direct.filter(astrologyRecord);
  if (astrologyRecord(response.data)) {
    const nested = [
      response.data.changes,
      response.data.events,
      response.data.timeline,
    ].find(Array.isArray);
    if (Array.isArray(nested)) return nested.filter(astrologyRecord);
  }
  return [];
};
const dateOnly = (value: unknown) => {
  const text = safeString(value);
  const match = text.match(/^\d{4}-\d{2}-\d{2}/);
  return match?.[0] || "";
};
const numberValue = (value: unknown) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
};
export const normalizeRetrogradeStations = (
  response: AstrologyRecord,
): Station[] =>
  arrayFrom(response)
    .flatMap((item) => {
      const metadata = astrologyRecord(item.metadata) ? item.metadata : {};
      const position = astrologyRecord(item.position) ? item.position : {};
      const planet = safeString(
        item.planet || item.transiting_planet || metadata.planet,
      ).toLowerCase() as PlanetId;
      if (!supported.includes(planet)) return [];
      const direction = safeString(
        item.change ||
          item.direction ||
          metadata.to_state ||
          metadata.to ||
          metadata.direction ||
          item.event_subtype,
      ).toLowerCase();
      const kind: Station["kind"] | null = direction.includes("retro")
        ? "retrograde"
        : direction.includes("direct")
          ? "direct"
          : null;
      const date = dateOnly(
        item.moment_local ||
          item.date ||
          item.datetime ||
          metadata.moment_local ||
          metadata.exact_moment_local,
      );
      if (!kind || !date) return [];
      const longitude = numberValue(position.longitude);
      const sign =
        safeString(item.sign || metadata.sign || metadata.to_sign) ||
        (longitude === undefined
          ? ""
          : [
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
            ][Math.floor((((longitude % 360) + 360) % 360) / 30)]);
      return [
        {
          planet,
          kind,
          date,
          degree:
            numberValue(item.degree ?? metadata.degree) ??
            (longitude === undefined
              ? undefined
              : ((longitude % 30) + 30) % 30),
          sign,
          shadowStart: dateOnly(item.shadow_start || metadata.shadow_start),
          shadowEnd: dateOnly(item.shadow_end || metadata.shadow_end),
        },
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));

const percentAt = (iso: string, year: number) => {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return Math.max(
    0,
    Math.min(
      100,
      ((new Date(`${iso}T00:00:00Z`).getTime() - start) / (end - start)) * 100,
    ),
  );
};
const formatDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

export const normalizeRetrogradeResult = ({
  response,
  positionsResponse,
  year,
  locale,
  today,
}: {
  response: AstrologyRecord;
  positionsResponse: AstrologyRecord;
  year: number;
  locale: SupportedLocale;
  today: string;
}) => {
  const stations = normalizeRetrogradeStations(response);
  const positions = normalizeSkyPositions(positionsResponse);
  const months = Array.from({ length: 12 }, (_, month) => ({
    short: new Intl.DateTimeFormat(locale, {
      month: "narrow",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month, 1))),
    full: new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month, 1))),
  }));
  const rows: PreparedRetrogradeTimelineRow[] = supported.map((id) => {
    const planetStations = stations.filter((station) => station.planet === id);
    const name = `${id[0].toUpperCase()}${id.slice(1)}`;
    const carryIn =
      planetStations[0]?.kind === "direct"
        ? [
            {
              left: 0,
              width: Math.max(0.8, percentAt(planetStations[0].date, year)),
              label: `${name}: ${formatDate(`${year}-01-01`, locale)}–${formatDate(planetStations[0].date, locale)} ${year}`,
            },
          ]
        : [];
    const segments = [
      ...carryIn,
      ...planetStations.flatMap((station, index) => {
        if (station.kind !== "retrograde") return [];
        const direct = planetStations
          .slice(index + 1)
          .find((candidate) => candidate.kind === "direct");
        const endDate = direct?.date || `${year}-12-31`;
        const left = percentAt(station.date, year);
        const width = Math.max(0.8, percentAt(endDate, year) - left);
        return [
          {
            left,
            width,
            label: `${name}: ${formatDate(station.date, locale)}–${formatDate(endDate, locale)} ${year}`,
          },
        ];
      }),
    ];
    return { id, name, ...presentation[id], segments };
  });
  const current: PreparedRetrogradeStatus[] = positions.flatMap((position) => {
    const id = position.id as PlanetId;
    if (!supported.includes(id) || !position.motionText) return [];
    const planetStations = stations.filter((station) => station.planet === id);
    const start = [...planetStations]
      .reverse()
      .find(
        (station) => station.kind === "retrograde" && station.date <= today,
      );
    const end = planetStations.find(
      (station) => station.kind === "direct" && station.date >= today,
    );
    const periodStart = start?.date || (end ? `${year}-01-01` : "");
    const periodEnd = end?.date || (start ? `${year}-12-31` : "");
    const shadowDate = end?.shadowEnd || start?.shadowStart;
    return [
      {
        id,
        glyph: presentation[id].glyph,
        position: `${position.degreeText} ${position.signName}`,
        period:
          periodStart && periodEnd
            ? `${formatDate(periodStart, locale)} – ${formatDate(periodEnd, locale)}`
            : "Dates unavailable",
        shadowKind: end?.shadowEnd
          ? "to"
          : start?.shadowStart
            ? "from"
            : "none",
        shadowDate: shadowDate ? formatDate(shadowDate, locale) : undefined,
      } satisfies PreparedRetrogradeStatus,
    ];
  });
  return { current, timeline: { year, months, rows }, stations };
};

export const getRetrogrades = async ({
  env,
  year,
  locale = "en",
  fetcher = fetch,
  now = new Date().toISOString(),
}: {
  env: RuntimeEnv;
  year: unknown;
  locale?: SupportedLocale;
  fetcher?: AstrologyFetcher;
  now?: string;
}) => {
  const numericYear = Number(year);
  const currentYear = new Date(now).getUTCFullYear();
  if (
    !Number.isInteger(numericYear) ||
    numericYear < currentYear - 1 ||
    numericYear > currentYear + 2
  )
    throw new Error("Retrograde year is outside the supported range.");
  const today = now.slice(0, 10);
  const safeLocale: SupportedLocale = activeLocaleCodes.includes(locale)
    ? locale
    : "en";
  const [changes, positions] = await Promise.all([
    postAstrologyEngine({
      env,
      endpoint: stationsEndpoint,
      payload: {
        start_date: `${numericYear}-01-01`,
        end_date: `${numericYear}-12-31`,
        timezone_offset: 0,
        zodiac_mode: "tropical",
        event_types: ["direction_change"],
        max_events: 200,
      },
      locale: safeLocale,
      cacheKey: `retrogrades:stations:${numericYear}`,
      ttlSeconds: 21_600,
      fetcher,
      now,
      failureMessage: "Retrograde provider request failed.",
    }),
    postAstrologyEngine({
      env,
      endpoint: positionsEndpoint,
      payload: buildSkyPayload(new Date(now)),
      locale: safeLocale,
      cacheKey: `retrogrades:positions:${today}`,
      ttlSeconds: 3_600,
      fetcher,
      now,
      failureMessage: "Retrograde position provider request failed.",
    }),
  ]);
  return {
    ...normalizeRetrogradeResult({
      response: changes.payload,
      positionsResponse: positions.payload,
      year: numericYear,
      locale: safeLocale,
      today,
    }),
    source:
      changes.source === "cache" && positions.source === "cache"
        ? ("cache" as const)
        : ("provider" as const),
  };
};
