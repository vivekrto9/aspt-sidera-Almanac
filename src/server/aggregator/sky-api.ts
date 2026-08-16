import type {
  SkyBodyId,
  SkyBodyPosition,
} from "../../data/astronomy/sky-strip-positions.ts";
import { getSkyAspectDetails } from "../../data/astronomy/sky-aspects.ts";
import { getSkyMoonState } from "../../data/astronomy/sky-moon.ts";
import {
  postAstrologyEngine,
  astrologyRecord,
  type AstrologyFetcher,
  type AstrologyRecord,
} from "./astrology-engine-api.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

export const skyFeature = "sidera.todays-sky";
const positionsEndpoint = "/v1/western/birth-chart/data";
const globalEventsEndpoint = "/v1/transits/events";
const bodyIds: SkyBodyId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];
const glyphs: Record<SkyBodyId, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
};
const signGlyphs: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};
const elements: Record<string, SkyBodyPosition["elementId"]> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};
const majorAspectIds = [
  "conjunction",
  "sextile",
  "square",
  "trine",
  "opposition",
] as const;

export type SkyAspectEventId = (typeof majorAspectIds)[number];
export type UpcomingSkyAspectEvent = {
  id: string;
  moment: string;
  planetA: string;
  planetB: string;
  aspectId: SkyAspectEventId;
  interpretation?: string;
};

const numberValue = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
};
const title = (value: string) =>
  value ? `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}` : value;
const validDate = (value: unknown, referenceDate = new Date()) => {
  const date = safeString(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("Choose a valid sky date.");
  const parsed = new Date(`${date}T12:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    throw new Error("Choose a valid sky date.");
  const offset = Math.round(
    (parsed.getTime() - referenceDate.getTime()) / 86_400_000,
  );
  if (offset < -31 || offset > 121)
    throw new Error("Sky date is outside the supported range.");
  return { date, parsed };
};

const requestDate = (value?: string) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime()))
    throw new Error("Choose a valid sky time.");
  return parsed;
};

const cacheMoment = (date: Date) => {
  const bucket = new Date(date);
  bucket.setUTCMinutes(Math.floor(bucket.getUTCMinutes() / 5) * 5, 0, 0);
  return bucket.toISOString().slice(0, 16);
};

export const buildSkyPayload = (date: Date) => ({
  birth_details: {
    date: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    latitude: 0,
    longitude: 0,
    timezone_offset: 0,
  },
  house_system: "placidus",
  zodiac_mode: "tropical",
});

const rawPlanets = (response: AstrologyRecord) => {
  if (Array.isArray(response.planets))
    return response.planets.filter(astrologyRecord);
  if (astrologyRecord(response.data) && Array.isArray(response.data.planets))
    return response.data.planets.filter(astrologyRecord);
  return [];
};

export const normalizeSkyPositions = (
  response: AstrologyRecord,
): SkyBodyPosition[] => {
  const byId = new Map(
    rawPlanets(response).map((planet) => [
      safeString(planet.name).toLowerCase(),
      planet,
    ]),
  );
  const positions = bodyIds.flatMap((id) => {
    const planet = byId.get(id);
    if (!planet) return [];
    const longitude = numberValue(planet.full_degree ?? planet.longitude);
    const signName = title(safeString(planet.sign));
    if (!Number.isFinite(longitude) || !signName) return [];
    const withinSign = numberValue(planet.norm_degree);
    const degree = Number.isFinite(withinSign)
      ? withinSign
      : ((longitude % 30) + 30) % 30;
    const speed = numberValue(planet.speed);
    const retrograde =
      planet.is_retro === true || (Number.isFinite(speed) && speed < 0);
    const elementId = elements[signName] || "earth";
    return [
      {
        id,
        planetName: title(safeString(planet.name)) || title(id),
        planetGlyph: glyphs[id],
        signName,
        signGlyph: signGlyphs[signName] || "",
        degreeText: `${Math.round(degree * 10) / 10}°`,
        longitude: ((longitude % 360) + 360) % 360,
        element: title(elementId),
        elementId,
        speedText: Number.isFinite(speed)
          ? `${Math.abs(Math.round(speed * 100) / 100)}°/day`
          : retrograde
            ? "Retrograde"
            : "Direct",
        motionText: retrograde ? "Retrograde" : undefined,
      } satisfies SkyBodyPosition,
    ];
  });
  if (positions.length < 10)
    throw new Error("Sky provider returned incomplete planet positions.");
  return positions;
};

const eventsArray = (response: AstrologyRecord) =>
  (Array.isArray(response.events)
    ? response.events
    : astrologyRecord(response.data) && Array.isArray(response.data.events)
      ? response.data.events
      : []
  ).filter(astrologyRecord);

const eventMetadata = (event: AstrologyRecord) =>
  astrologyRecord(event.metadata) ? event.metadata : {};
const eventString = (
  event: AstrologyRecord,
  metadata: AstrologyRecord,
  keys: string[],
) => {
  for (const key of keys) {
    const value = safeString(event[key] ?? metadata[key]);
    if (value) return value;
  }
  return "";
};
const normalizedAspectId = (value: string): SkyAspectEventId | undefined => {
  const normalized = value
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
  if (normalized.includes("conjunct")) return "conjunction";
  if (normalized.includes("sextile")) return "sextile";
  if (normalized.includes("square")) return "square";
  if (normalized.includes("trine")) return "trine";
  if (normalized.includes("opposit")) return "opposition";
  return undefined;
};

export const normalizeUpcomingSkyAspectEvents = (
  events: AstrologyRecord[],
): UpcomingSkyAspectEvent[] => {
  const seen = new Set<string>();
  return events
    .flatMap((event) => {
      const metadata = eventMetadata(event);
      const aspectId = normalizedAspectId(
        eventString(event, metadata, [
          "aspect",
          "aspect_type",
          "event_subtype",
          "sub_type",
        ]),
      );
      const planetA = eventString(event, metadata, [
        "transiting_planet",
        "planet",
        "planet_1",
        "planet1",
        "body_1",
        "body1",
        "object_1",
        "from_planet",
      ]);
      const planetB = eventString(event, metadata, [
        "related_planet",
        "aspecting_planet",
        "planet_2",
        "planet2",
        "body_2",
        "body2",
        "object_2",
        "to_planet",
      ]);
      const moment = eventString(event, metadata, [
        "event_time_local",
        "event_time_utc",
        "moment_local",
        "moment_utc",
        "event_time",
        "event_date",
        "exact_at",
        "exact_moment_local",
        "date",
      ]);
      const parsedMoment = Date.parse(
        moment.length === 10 ? `${moment}T12:00:00Z` : moment,
      );
      if (
        !aspectId ||
        !planetA ||
        !planetB ||
        planetA.toLowerCase() === planetB.toLowerCase() ||
        !Number.isFinite(parsedMoment)
      )
        return [];
      const isoMoment = new Date(parsedMoment).toISOString();
      const key = `${isoMoment.slice(0, 16)}:${planetA.toLowerCase()}:${aspectId}:${planetB.toLowerCase()}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [
        {
          id: key,
          moment: isoMoment,
          planetA: title(planetA),
          planetB: title(planetB),
          aspectId,
          interpretation:
            eventString(event, metadata, [
              "interpretation",
              "meaning",
              "description",
            ]) || undefined,
        } satisfies UpcomingSkyAspectEvent,
      ];
    })
    .sort((left, right) => Date.parse(left.moment) - Date.parse(right.moment));
};

export const getSkyForDate = async ({
  env,
  date,
  locale = "en",
  fetcher = fetch,
  now,
  live = false,
  eventRangeDays = 1,
}: {
  env: RuntimeEnv;
  date: unknown;
  locale?: string;
  fetcher?: AstrologyFetcher;
  now?: string;
  live?: boolean;
  eventRangeDays?: number;
}) => {
  const currentMoment = requestDate(now);
  const selected = validDate(date, currentMoment);
  const safeEventRangeDays = Number.isInteger(eventRangeDays)
    ? Math.min(30, Math.max(1, eventRangeDays))
    : 1;
  const selectedMoment = live ? currentMoment : selected.parsed;
  const followingMoment = new Date(selectedMoment.getTime() + 86_400_000);
  const end = new Date(
    selected.parsed.getTime() + safeEventRangeDays * 86_400_000,
  )
    .toISOString()
    .slice(0, 10);
  const positionKey = live
    ? `sky:positions:${cacheMoment(selectedMoment)}`
    : `sky:positions:${selected.date}`;
  const followingKey = live
    ? `sky:positions:${cacheMoment(followingMoment)}`
    : `sky:positions:${end}`;
  const positionTtl = live ? 300 : 3_600;
  const [positionResult, eventResult] = await Promise.all([
    postAstrologyEngine({
      env,
      endpoint: positionsEndpoint,
      payload: buildSkyPayload(selectedMoment),
      locale,
      cacheKey: positionKey,
      ttlSeconds: positionTtl,
      fetcher,
      now,
      failureMessage: "Sky position provider request failed.",
    }),
    postAstrologyEngine({
      env,
      endpoint: globalEventsEndpoint,
      payload: {
        start_date: selected.date,
        end_date: end,
        timezone_offset: 0,
        zodiac_mode: "tropical",
        max_events: 200,
      },
      locale,
      cacheKey: `sky:events:${selected.date}:${end}`,
      ttlSeconds: 3_600,
      fetcher,
      now,
      failureMessage: "Sky event provider request failed.",
    }),
  ]);
  const positions = normalizeSkyPositions(positionResult.payload);
  const tomorrowResponse = await postAstrologyEngine({
    env,
    endpoint: positionsEndpoint,
    payload: buildSkyPayload(followingMoment),
    locale,
    cacheKey: followingKey,
    ttlSeconds: positionTtl,
    fetcher,
    now,
    failureMessage: "Sky position provider request failed.",
  });
  const tomorrow = normalizeSkyPositions(tomorrowResponse.payload);
  const moon = getSkyMoonState(
    selectedMoment,
    positions[0].longitude,
    positions[1].longitude,
  );
  return {
    date: selected.date,
    calculatedAt: selectedMoment.toISOString(),
    positions,
    aspects: getSkyAspectDetails(positions, tomorrow),
    moon,
    events: eventsArray(eventResult.payload),
    source:
      positionResult.source === "cache" && eventResult.source === "cache"
        ? ("cache" as const)
        : ("provider" as const),
  };
};
