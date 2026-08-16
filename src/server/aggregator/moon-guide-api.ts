import { getSkyMoonState } from "../../data/astronomy/sky-moon.ts";
import {
  astrologyRecord,
  postAstrologyEngine,
  type AstrologyFetcher,
  type AstrologyRecord,
} from "./astrology-engine-api.ts";
import { normalizeSkyPositions } from "./sky-api.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

export const moonGuideFeature = "sidera.moon-guide";

const phasesEndpoint = "/v1/transits/lunar-phases";
const eventsEndpoint = "/v1/transits/events";
const positionsEndpoint = "/v1/western/birth-chart/data";
const synodicMonthDays = 29.530588;
const dayMs = 86_400_000;

export type MoonGuidePhase =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export type MoonGuideEventKind =
  | "new"
  | "first-quarter"
  | "full"
  | "last-quarter"
  | "sign-ingress"
  | "void-of-course"
  | "eclipse";

export type MoonGuideEvent = {
  kind: MoonGuideEventKind;
  moment: string;
  signIndex?: number;
};

export type MoonGuideMilestone = {
  kind: "new" | "first-quarter" | "full" | "last-quarter";
  moment: string;
  signIndex?: number;
};

export type MoonGuideDay = {
  iso: string;
  phase: MoonGuidePhase;
  illumination: number;
  waxing: boolean;
  ageDays: number;
  events: MoonGuideEvent[];
};

const phaseKeys: MoonGuidePhase[] = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent",
];

const phaseNames = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

const signNames = [
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
] as const;

const isLeap = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const daysInMonth = (year: number, month: number) =>
  month === 2
    ? isLeap(year)
      ? 29
      : 28
    : [4, 6, 9, 11].includes(month)
      ? 30
      : 31;
const pad = (value: number) => String(value).padStart(2, "0");
const isoDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;
const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const records = (response: AstrologyRecord, key = "events") => {
  const direct = response[key];
  if (Array.isArray(direct)) return direct.filter(astrologyRecord);
  return astrologyRecord(response.data) && Array.isArray(response.data[key])
    ? response.data[key].filter(astrologyRecord)
    : [];
};
const momentValue = (event: AstrologyRecord) =>
  safeString(
    event.event_time_utc ||
      event.event_time_local ||
      event.moment_local ||
      event.moment_utc ||
      (astrologyRecord(event.metadata) && event.metadata.exact_moment_local),
  );
const localMomentValue = (event: AstrologyRecord) =>
  safeString(
    event.event_time_local ||
      event.moment_local ||
      event.event_time_utc ||
      event.moment_utc,
  );
const phaseId = (event: AstrologyRecord) =>
  safeString(
    event.phase_id || event.phase_name || event.sub_type || event.event_subtype,
  )
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
const eventType = (event: AstrologyRecord) =>
  safeString(event.event_type).toLowerCase();
const metadata = (event: AstrologyRecord) =>
  astrologyRecord(event.metadata) ? event.metadata : {};
const signIndex = (value: unknown) => {
  const numeric = numberValue(value);
  if (numeric !== undefined) {
    const normalized = numeric >= 1 && numeric <= 12 ? numeric - 1 : numeric;
    return normalized >= 0 && normalized < 12
      ? Math.floor(normalized)
      : undefined;
  }
  const name = safeString(value).toLowerCase();
  const index = signNames.findIndex((item) => item.toLowerCase() === name);
  return index >= 0 ? index : undefined;
};

const parseMonth = (yearValue: unknown, monthValue: unknown) => {
  const year = Number(yearValue);
  const month = Number(monthValue);
  if (!Number.isInteger(year) || year < 1900 || year > 2200)
    throw new Error("Choose a valid Moon Calendar year.");
  if (!Number.isInteger(month) || month < 1 || month > 12)
    throw new Error("Choose a valid Moon Calendar month.");
  return { year, month };
};

const parseTimezone = (value: unknown) => {
  const timezoneOffset = Number(value);
  if (
    !Number.isFinite(timezoneOffset) ||
    timezoneOffset < -14 ||
    timezoneOffset > 14
  )
    throw new Error("Choose a valid timezone offset.");
  return Math.round(timezoneOffset * 4) / 4;
};

const parseDate = (value: unknown) => {
  const date = safeString(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("Choose a valid lunar date.");
  const parsed = new Date(`${date}T12:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    throw new Error("Choose a valid lunar date.");
  return { date, parsed };
};

export const phaseIndexFromAge = (value: unknown) => {
  const age = numberValue(value);
  if (age === undefined) return undefined;
  const normalized =
    ((age % synodicMonthDays) + synodicMonthDays) % synodicMonthDays;
  return (
    Math.floor((normalized + synodicMonthDays / 16) / (synodicMonthDays / 8)) %
    8
  );
};

const phaseFromAge = (ageDays: number) => {
  const normalized =
    ((ageDays % synodicMonthDays) + synodicMonthDays) % synodicMonthDays;
  const index = phaseIndexFromAge(normalized) ?? 0;
  return {
    key: phaseKeys[index],
    name: phaseNames[index],
    illumination: Math.round(
      ((1 - Math.cos((2 * Math.PI * normalized) / synodicMonthDays)) / 2) * 100,
    ),
    ageDays: Math.round(normalized * 10) / 10,
    waxing: normalized < synodicMonthDays / 2,
  };
};

const phaseEventKind = (
  event: AstrologyRecord,
): MoonGuideMilestone["kind"] | undefined => {
  const id = phaseId(event);
  if (id.includes("new_moon")) return "new";
  if (id.includes("full_moon")) return "full";
  if (id.includes("first_quarter")) return "first-quarter";
  if (id.includes("last_quarter") || id.includes("third_quarter"))
    return "last-quarter";
  return undefined;
};

const normalizeEvent = (event: AstrologyRecord): MoonGuideEvent | undefined => {
  const type = eventType(event);
  const moment = localMomentValue(event);
  if (!moment) return undefined;
  const meta = metadata(event);
  if (type === "lunar_phase") {
    const kind = phaseEventKind(event);
    return kind ? { kind, moment } : undefined;
  }
  if (type === "eclipse") return { kind: "eclipse", moment };
  if (type === "void_of_course_start" || type === "void_of_course")
    return {
      kind: "void-of-course",
      moment,
      signIndex: signIndex(meta.ending_sign || meta.ending_sign_id),
    };
  if (
    type === "sign_ingress" &&
    safeString(event.planet).toLowerCase() === "moon"
  )
    return {
      kind: "sign-ingress",
      moment,
      signIndex: signIndex(meta.to_sign || meta.to_sign_id),
    };
  return undefined;
};

const eventDay = (event: MoonGuideEvent) => event.moment.slice(0, 10);
const dateRange = (date: Date, days: number) =>
  new Date(date.getTime() + days * dayMs).toISOString().slice(0, 10);

const lunarPhaseEvents = async ({
  env,
  startDate,
  endDate,
  timezoneOffset,
  locale,
  fetcher,
  now,
  cacheKey,
}: {
  env: RuntimeEnv;
  startDate: string;
  endDate: string;
  timezoneOffset: number;
  locale: string;
  fetcher: AstrologyFetcher;
  now?: string;
  cacheKey: string;
}) =>
  postAstrologyEngine({
    env,
    endpoint: phasesEndpoint,
    payload: {
      start_date: startDate,
      end_date: endDate,
      timezone_offset: timezoneOffset,
    },
    locale,
    cacheKey,
    ttlSeconds: 21_600,
    fetcher,
    now,
    failureMessage: "Moon phase provider request failed.",
  });

const globalMoonEvents = async ({
  env,
  startDate,
  endDate,
  timezoneOffset,
  locale,
  fetcher,
  now,
  cacheKey,
}: {
  env: RuntimeEnv;
  startDate: string;
  endDate: string;
  timezoneOffset: number;
  locale: string;
  fetcher: AstrologyFetcher;
  now?: string;
  cacheKey: string;
}) =>
  postAstrologyEngine({
    env,
    endpoint: eventsEndpoint,
    payload: {
      start_date: startDate,
      end_date: endDate,
      timezone_offset: timezoneOffset,
      zodiac_mode: "tropical",
      event_types: ["lunar_phase", "sign_ingress", "void_of_course", "eclipse"],
      max_events: 400,
    },
    locale,
    cacheKey,
    ttlSeconds: 21_600,
    fetcher,
    now,
    failureMessage: "Moon event provider request failed.",
  });

const newMoonMoments = (response: AstrologyRecord) =>
  records(response)
    .filter((event) => phaseEventKind(event) === "new")
    .map((event) => Date.parse(momentValue(event)))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);

const phaseAt = (timestamp: number, newMoons: number[]) => {
  const prior = newMoons.filter((moment) => moment <= timestamp).at(-1);
  const next = newMoons.find((moment) => moment > timestamp);
  const anchor =
    prior ?? (next === undefined ? undefined : next - synodicMonthDays * dayMs);
  return anchor === undefined
    ? undefined
    : phaseFromAge((timestamp - anchor) / dayMs);
};

export const getMoonMonthGuide = async ({
  env,
  year: yearValue,
  month: monthValue,
  timezoneOffset: timezoneValue,
  locale = "en",
  fetcher = fetch,
  now,
}: {
  env: RuntimeEnv;
  year: unknown;
  month: unknown;
  timezoneOffset: unknown;
  locale?: string;
  fetcher?: AstrologyFetcher;
  now?: string;
}) => {
  const { year, month } = parseMonth(yearValue, monthValue);
  const timezoneOffset = parseTimezone(timezoneValue);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const startDate = dateRange(first, -40);
  const lastIso = isoDate(year, month, daysInMonth(year, month));
  const phaseEnd = dateRange(new Date(`${lastIso}T12:00:00Z`), 45);
  const [phaseResult, eventResult] = await Promise.all([
    lunarPhaseEvents({
      env,
      startDate,
      endDate: phaseEnd,
      timezoneOffset,
      locale,
      fetcher,
      now,
      cacheKey: `moon:phases:${year}-${pad(month)}:${timezoneOffset}`,
    }),
    globalMoonEvents({
      env,
      startDate: isoDate(year, month, 1),
      endDate: lastIso,
      timezoneOffset,
      locale,
      fetcher,
      now,
      cacheKey: `moon:events:${year}-${pad(month)}:${timezoneOffset}`,
    }),
  ]);
  const newMoons = newMoonMoments(phaseResult.payload);
  const events = records(eventResult.payload).flatMap((event) => {
    const normalized = normalizeEvent(event);
    return normalized ? [normalized] : [];
  });
  const byDay = new Map<string, MoonGuideEvent[]>();
  events.forEach((event) =>
    byDay.set(eventDay(event), [...(byDay.get(eventDay(event)) || []), event]),
  );
  const days: MoonGuideDay[] = [];
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    const iso = isoDate(year, month, day);
    const localNoonUtc =
      Date.UTC(year, month - 1, day, 12) - timezoneOffset * 3_600_000;
    const phase = phaseAt(localNoonUtc, newMoons);
    if (!phase) continue;
    days.push({
      iso,
      phase: phase.key,
      illumination: phase.illumination,
      waxing: phase.waxing,
      ageDays: phase.ageDays,
      events: byDay.get(iso) || [],
    });
  }
  return {
    year,
    month,
    timezoneOffset,
    days,
    source:
      phaseResult.source === "cache" && eventResult.source === "cache"
        ? ("cache" as const)
        : ("provider" as const),
  };
};

const positionPayload = (date: Date, timezoneOffset: number) => ({
  birth_details: {
    date: new Date(date.getTime() + timezoneOffset * 3_600_000).getUTCDate(),
    month:
      new Date(date.getTime() + timezoneOffset * 3_600_000).getUTCMonth() + 1,
    year: new Date(
      date.getTime() + timezoneOffset * 3_600_000,
    ).getUTCFullYear(),
    hour: new Date(date.getTime() + timezoneOffset * 3_600_000).getUTCHours(),
    minute: new Date(
      date.getTime() + timezoneOffset * 3_600_000,
    ).getUTCMinutes(),
    second: 0,
    latitude: 0,
    longitude: 0,
    timezone_offset: timezoneOffset,
  },
  house_system: "placidus",
  zodiac_mode: "tropical",
});

export const getMoonDayGuide = async ({
  env,
  date: dateValue,
  timezoneOffset: timezoneValue,
  locale = "en",
  fetcher = fetch,
  now,
}: {
  env: RuntimeEnv;
  date: unknown;
  timezoneOffset: unknown;
  locale?: string;
  fetcher?: AstrologyFetcher;
  now?: string;
}) => {
  const { date, parsed } = parseDate(dateValue);
  const timezoneOffset = parseTimezone(timezoneValue);
  const localNoonUtc = new Date(parsed.getTime() - timezoneOffset * 3_600_000);
  const result = await postAstrologyEngine({
    env,
    endpoint: positionsEndpoint,
    payload: positionPayload(localNoonUtc, timezoneOffset),
    locale,
    cacheKey: `moon:day:${date}:${timezoneOffset}`,
    ttlSeconds: 21_600,
    fetcher,
    now,
    failureMessage: "Moon position provider request failed.",
  });
  const positions = normalizeSkyPositions(result.payload);
  const sun = positions.find((position) => position.id === "sun");
  const moon = positions.find((position) => position.id === "moon");
  if (!sun || !moon)
    throw new Error("Moon position provider returned incomplete data.");
  const state = getSkyMoonState(localNoonUtc, sun.longitude, moon.longitude);
  return {
    date,
    timezoneOffset,
    phase: state.phase,
    illumination: Math.round(state.illumination * 100),
    waxing: state.waxing,
    moonSignIndex: signIndex(moon.signName),
    moonDegree: Math.round((((moon.longitude % 30) + 30) % 30) * 10) / 10,
    source: result.source,
  };
};

const upcomingPhase = (
  events: AstrologyRecord[],
  kind: "new" | "full",
  nowMs: number,
) =>
  events
    .filter((event) => phaseEventKind(event) === kind)
    .map((event) => ({
      moment: localMomentValue(event),
      timestamp: Date.parse(momentValue(event)),
    }))
    .filter(
      (event) =>
        event.moment &&
        Number.isFinite(event.timestamp) &&
        event.timestamp >= nowMs,
    )
    .sort((left, right) => left.timestamp - right.timestamp)[0]?.moment;

const phaseMilestones = (
  events: AstrologyRecord[],
  nowMs: number,
): MoonGuideMilestone[] => {
  const milestones = events
    .flatMap((event) => {
      const kind = phaseEventKind(event);
      const moment = localMomentValue(event);
      const timestamp = Date.parse(momentValue(event));
      if (!kind || !moment || !Number.isFinite(timestamp)) return [];
      const meta = metadata(event);
      return [{
        kind,
        moment,
        timestamp,
        signIndex: signIndex(
          meta.moon_sign || meta.sign || meta.sign_name || event.sign,
        ),
      }];
    })
    .sort((left, right) => left.timestamp - right.timestamp);
  const latestNewIndex = milestones.findLastIndex(
    (event) => event.kind === "new" && event.timestamp <= nowMs,
  );
  const nextNewIndex = milestones.findIndex(
    (event) => event.kind === "new" && event.timestamp > nowMs,
  );
  const startIndex = latestNewIndex >= 0 ? latestNewIndex : nextNewIndex;
  return startIndex < 0
    ? []
    : milestones.slice(startIndex, startIndex + 5).map(({ timestamp: _timestamp, ...event }) => event);
};

export const getCurrentMoonGuide = async ({
  env,
  locale = "en",
  timezoneOffset = 0,
  fetcher = fetch,
  now = new Date().toISOString(),
}: {
  env: RuntimeEnv;
  locale?: string;
  timezoneOffset?: unknown;
  fetcher?: AstrologyFetcher;
  now?: string;
}) => {
  const timezone = parseTimezone(timezoneOffset);
  const current = new Date(now);
  if (Number.isNaN(current.getTime()))
    throw new Error("Choose a valid current lunar time.");
  const startDate = dateRange(current, -40);
  const endDate = dateRange(current, 60);
  const ingressEnd = dateRange(current, 7);
  const today = current.toISOString().slice(0, 10);
  const [positionResult, phaseResult, eventResult] = await Promise.all([
    postAstrologyEngine({
      env,
      endpoint: positionsEndpoint,
      payload: positionPayload(current, timezone),
      locale,
      cacheKey: `moon:current:${now.slice(0, 13)}:${timezone}`,
      ttlSeconds: 3_600,
      fetcher,
      now,
      failureMessage: "Current Moon position request failed.",
    }),
    lunarPhaseEvents({
      env,
      startDate,
      endDate,
      timezoneOffset: timezone,
      locale,
      fetcher,
      now,
      cacheKey: `moon:current-phases:${today}:${timezone}`,
    }),
    globalMoonEvents({
      env,
      startDate: today,
      endDate: ingressEnd,
      timezoneOffset: timezone,
      locale,
      fetcher,
      now,
      cacheKey: `moon:current-events:${today}:${timezone}`,
    }),
  ]);
  const positions = normalizeSkyPositions(positionResult.payload);
  const sun = positions.find((position) => position.id === "sun");
  const moon = positions.find((position) => position.id === "moon");
  if (!sun || !moon)
    throw new Error("Current Moon provider returned incomplete data.");
  const state = getSkyMoonState(current, sun.longitude, moon.longitude);
  const phases = records(phaseResult.payload);
  const nextIngress = records(eventResult.payload)
    .filter(
      (event) =>
        eventType(event) === "sign_ingress" &&
        safeString(event.planet).toLowerCase() === "moon",
    )
    .map((event) => ({
      moment: localMomentValue(event),
      timestamp: Date.parse(momentValue(event)),
      signIndex: signIndex(
        metadata(event).to_sign || metadata(event).to_sign_id,
      ),
    }))
    .filter(
      (event) =>
        event.moment &&
        Number.isFinite(event.timestamp) &&
        event.timestamp > current.getTime(),
    )
    .sort((left, right) => left.timestamp - right.timestamp)[0];
  return {
    generatedAt: now,
    timezoneOffset: timezone,
    phase: {
      key: state.phase,
      name: phaseNames[phaseKeys.indexOf(state.phase)],
      illumination: Math.round(state.illumination * 100),
      waxing: state.waxing,
      moonSign: moon.signName,
      moonSignIndex: signIndex(moon.signName),
      moonDegree: Math.round((((moon.longitude % 30) + 30) % 30) * 10) / 10,
    },
    nextNew: upcomingPhase(phases, "new", current.getTime()),
    nextFull: upcomingPhase(phases, "full", current.getTime()),
    milestones: phaseMilestones(phases, current.getTime()),
    nextIngress: nextIngress
      ? { moment: nextIngress.moment, signIndex: nextIngress.signIndex }
      : undefined,
    source:
      positionResult.source === "cache" &&
      phaseResult.source === "cache" &&
      eventResult.source === "cache"
        ? ("cache" as const)
        : ("provider" as const),
  };
};

export const normalizeCurrentMoon = ({
  metrics,
  report,
  generatedAt = new Date().toISOString(),
}: {
  metrics?: AstrologyRecord;
  report?: AstrologyRecord;
  generatedAt?: string;
}) => {
  if (!metrics && !report) throw new Error("Current Moon data is unavailable.");
  const ageDays = numberValue(metrics?.moon_age_in_days) ?? 0;
  const phase = phaseFromAge(ageDays);
  return {
    generatedAt,
    phase: {
      ...phase,
      illumination:
        numberValue(metrics?.moon_illumination) ?? phase.illumination,
      moonSign: safeString(metrics?.moon_sign),
      significance: safeString(report?.significance),
      report: safeString(report?.report),
    },
  };
};
