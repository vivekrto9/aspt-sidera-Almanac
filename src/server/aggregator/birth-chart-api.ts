import { getCustomerSession } from "./customer-auth.ts";
import {
  createCustomerUserProfile,
  listCustomerUserProfiles,
} from "./customer-profiles.ts";
import { AP_TABLES } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";
import {
  astrologyProviderMessage,
  joinAstrologyApiUrl,
  resolveAstrologyApiBaseUrl,
  resolveAstrologyApiRequestHeaders,
} from "./astrology-api-config.ts";
import type {
  BirthChartAspectResult,
  BirthChartBigThreeItem,
  BirthChartElement,
  BirthChartPlanetResult,
  PreparedBirthChartResult,
} from "../../data/birth-chart/results.ts";

export const birthChartFeature = "sidera.birth-chart";
export const birthChartReadingType = "birth_chart";
const providerName = "astrologyapi";
const providerEndpoint = "/v1/natal_chart_interpretation";

type JsonRecord = Record<string, unknown>;
type ProviderFetch = typeof fetch;

export type BirthChartRequest = {
  name?: unknown;
  birthDate?: unknown;
  birthTime?: unknown;
  timeUnknown?: unknown;
  place?: unknown;
  placeId?: unknown;
  lat?: unknown;
  lon?: unknown;
  timezone?: unknown;
  timezoneOffset?: unknown;
  houseType?: unknown;
  locale?: unknown;
};

const signGlyphs: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const planetGlyphs: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  Node: "☊", Chiron: "⚷", "Part of Fortune": "⊗",
};

const signElements: Record<string, BirthChartElement> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

const elementColors: Record<BirthChartElement, string> = {
  fire: "#9c4f38", earth: "#6c6254", air: "#b07a3c", water: "#2f4a41",
};

const aspectPresentation: Record<string, Pick<BirthChartAspectResult, "aspectGlyph" | "tone" | "color">> = {
  conjunction: { aspectGlyph: "☌", tone: "conjunction", color: "#b07a3c" },
  trine: { aspectGlyph: "△", tone: "harmonious", color: "#2f4a41" },
  sextile: { aspectGlyph: "⚹", tone: "harmonious", color: "#2f4a41" },
  opposition: { aspectGlyph: "☍", tone: "challenging", color: "#9c4f38" },
  square: { aspectGlyph: "□", tone: "challenging", color: "#9c4f38" },
};

const isObject = (value: unknown): value is JsonRecord =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const numberValue = (value: unknown) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
};

const booleanValue = (value: unknown) => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value === null || value === undefined) return false;
  return ["true", "1", "yes"].includes(safeString(value).toLowerCase());
};

const zodiacSigns = Object.keys(signGlyphs);
const signForLongitude = (value: unknown) => {
  const longitude = numberValue(value);
  if (!Number.isFinite(longitude)) return "";
  const normalized = ((longitude % 360) + 360) % 360;
  return zodiacSigns[Math.floor(normalized / 30)] || "";
};

export const timezoneOffsetToHours = (offset: unknown) => {
  if (typeof offset === "number" && Number.isFinite(offset)) return offset;
  const match = safeString(offset).match(/^(?:UTC|GMT)?([+-])(\d{1,2})(?::?(\d{2}))?$/i);
  if (!match) return Number.NaN;
  const hours = Number(match[2]);
  const minutes = Number(match[3] || "0");
  if (hours > 14 || minutes > 59) return Number.NaN;
  return (match[1] === "-" ? -1 : 1) * (hours + minutes / 60);
};

const parseDate = (value: unknown, now: Date) => {
  const text = safeString(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error("Enter a valid birth date.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (year < 1900 || parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error("Enter a valid birth date.");
  }
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (parsed.getTime() > today) throw new Error("Birth date cannot be in the future.");
  return { text, year, month, day };
};

const parseTime = (value: unknown, unknown: boolean) => {
  if (unknown) return { text: "12:00", hour: 12, min: 0, approximate: true };
  const text = safeString(value);
  const match = text.match(/^(\d{2}):(\d{2})$/);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) {
    throw new Error("Enter a valid birth time.");
  }
  return { text, hour: Number(match[1]), min: Number(match[2]), approximate: false };
};

export const validateBirthChartInput = (body: BirthChartRequest, now = new Date()) => {
  const date = parseDate(body.birthDate, now);
  const timeUnknown = body.timeUnknown === true || safeString(body.timeUnknown) === "true";
  const time = parseTime(body.birthTime, timeUnknown);
  const name = safeString(body.name).slice(0, 80) || "My chart";
  const place = safeString(body.place).slice(0, 180);
  const placeId = safeString(body.placeId).slice(0, 180);
  const lat = numberValue(body.lat);
  const lon = numberValue(body.lon);
  const timezone = safeString(body.timezone).slice(0, 100);
  const timezoneOffset = safeString(body.timezoneOffset).slice(0, 20);
  const tzone = timezoneOffsetToHours(timezoneOffset);
  const requestedHouseType = safeString(body.houseType).toLowerCase() || "placidus";
  const houseType = requestedHouseType === "whole-sign"
    ? "whole_sign"
    : requestedHouseType === "equal"
      ? "equal"
      : requestedHouseType;
  const locale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(safeString(body.locale))
    ? safeString(body.locale).toLowerCase()
    : "en";
  if (!place || !placeId) throw new Error("Please choose a birth place from the suggestions.");
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new Error("Birth place latitude is invalid.");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new Error("Birth place longitude is invalid.");
  if (!timezone) throw new Error("Birth place timezone is required.");
  if (!Number.isFinite(tzone)) throw new Error("Birth place timezone offset is invalid.");
  if (!["placidus", "koch", "porphyry", "equal", "whole_sign"].includes(houseType)) {
    throw new Error("House system is invalid.");
  }
  return { name, ...date, birthDate: date.text, birthTime: time.text, timeUnknown: time.approximate, hour: time.hour, min: time.min, place, placeId, lat, lon, timezone, timezoneOffset, tzone, houseType, locale };
};

export const buildBirthChartProviderPayload = (input: ReturnType<typeof validateBirthChartInput>) => ({
  day: input.day,
  month: input.month,
  year: input.year,
  hour: input.hour,
  min: input.min,
  lat: input.lat,
  lon: input.lon,
  tzone: input.tzone,
  house_type: input.houseType,
});

const degreeText = (value: unknown) => {
  const degree = numberValue(value);
  if (!Number.isFinite(degree)) return "";
  return `${Math.round((((degree % 30) + 30) % 30) * 10) / 10}°`;
};

const ordinal = (value: number) => {
  const remainder = value % 100;
  const suffix = remainder >= 11 && remainder <= 13 ? "th" : value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th";
  return `${value}${suffix}`;
};

const providerText = (planet: JsonRecord) =>
  safeString(planet.interpretation) || safeString(planet.description) || safeString(planet.meaning);

export const normalizeBirthChartResult = ({
  input,
  response,
}: {
  input: ReturnType<typeof validateBirthChartInput>;
  response: JsonRecord;
}): PreparedBirthChartResult => {
  const rawPlanets = (Array.isArray(response.planets) ? response.planets : []).filter(isObject);
  const planets: BirthChartPlanetResult[] = rawPlanets
    .map((planet) => {
      const name = safeString(planet.name);
      const signName = safeString(planet.sign);
      const longitude = numberValue(planet.full_degree);
      const house = Number(planet.house);
      if (!name || !signName || !Number.isFinite(longitude)) return null;
      const element = signElements[signName] || "earth";
      const degree = degreeText(planet.norm_degree ?? longitude);
      const houseText = Number.isFinite(house) && house > 0 ? `House ${house}` : "House unavailable";
      const positionLabel = `${degree} ${signName}${Number.isFinite(house) && house > 0 ? ` · ${ordinal(house)} house` : ""}`;
      const interpretation = providerText(planet) || `${name} is positioned in ${signName}${Number.isFinite(house) && house > 0 ? ` in the ${ordinal(house)} house` : ""}.`;
      return {
        name,
        glyph: planetGlyphs[name] || "•",
        longitude,
        label: `${name} at ${positionLabel}`,
        color: elementColors[element],
        signName,
        signGlyph: signGlyphs[signName] || "",
        degreeText: degree,
        houseText,
        elementName: element[0].toUpperCase() + element.slice(1),
        positionLabel,
        interpretation,
        retrograde:
          booleanValue(planet.is_retro) ||
          (Number.isFinite(numberValue(planet.speed)) && numberValue(planet.speed) < 0),
      } satisfies BirthChartPlanetResult;
    })
    .filter((planet): planet is NonNullable<typeof planet> => planet !== null);

  if (planets.length < 2) throw new Error("Birth chart provider returned incomplete planet data.");
  const sun = planets.find((planet) => planet.name === "Sun");
  const moon = planets.find((planet) => planet.name === "Moon");
  const houses = (Array.isArray(response.houses) ? response.houses : []).filter(isObject);
  const orderedHouses = houses
    .map((house) => ({ house: Number(house.house), degree: numberValue(house.degree), sign: safeString(house.sign) }))
    .filter((house) => Number.isInteger(house.house) && house.house >= 1 && house.house <= 12 && Number.isFinite(house.degree))
    .sort((left, right) => left.house - right.house);
  const houseCusps = orderedHouses.length === 12 && orderedHouses.every((house, index) => house.house === index + 1)
    ? orderedHouses.map((house) => ((house.degree % 360) + 360) % 360)
    : [];
  const firstHouse = houses.find((house) => Number(house.house) === 1);
  const ascendantLabel = safeString(response.ascendant);
  const risingSign = signGlyphs[ascendantLabel]
    ? ascendantLabel
    : signForLongitude(response.ascendant) || safeString(firstHouse?.sign);
  const bigThree: BirthChartBigThreeItem[] = [
    ...(sun ? [{ role: "sun" as const, glyph: "☉", sign: sun.signName, element: signElements[sun.signName] || "earth" }] : []),
    ...(moon ? [{ role: "moon" as const, glyph: "☽", sign: moon.signName, element: signElements[moon.signName] || "water" }] : []),
    ...(risingSign ? [{ role: "rising" as const, glyph: "↑", sign: risingSign, element: signElements[risingSign] || "air" }] : []),
  ];

  const indexByName = new Map(planets.map((planet, index) => [planet.name.toLowerCase(), index]));
  const aspects = (Array.isArray(response.aspects) ? response.aspects : [])
    .filter(isObject)
    .map((aspect) => {
      const firstIndex = indexByName.get(safeString(aspect.aspecting_planet).toLowerCase());
      const secondIndex = indexByName.get(safeString(aspect.aspected_planet).toLowerCase());
      const aspectLabel = safeString(aspect.type).toLowerCase();
      const presentation = aspectPresentation[aspectLabel];
      if (firstIndex === undefined || secondIndex === undefined || !presentation) return null;
      const orb = numberValue(aspect.orb);
      return {
        firstIndex,
        secondIndex,
        aspectLabel,
        orb: Number.isFinite(orb) ? `${Math.round(orb * 10) / 10}°` : "",
        weight: 1,
        ...presentation,
      } satisfies BirthChartAspectResult;
    })
    .filter((aspect): aspect is NonNullable<typeof aspect> => aspect !== null);

  const birthDate = new Intl.DateTimeFormat(input.locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${input.birthDate}T00:00:00Z`));
  return {
    chartName: input.name,
    birthSummary: input.timeUnknown ? `${birthDate} · Birth time unknown · Noon chart` : `${birthDate} · ${input.birthTime}`,
    birthPlace: input.place,
    houseSystem: `${input.houseType.replace(/_/g, " ")} houses${input.timeUnknown ? " · approximate" : ""}`,
    unknownTime: input.timeUnknown || undefined,
    chartTitle: `${input.name}’s natal chart`,
    chartDescription: input.timeUnknown
      ? "A noon natal chart: planets and signs remain accurate while the rising sign and houses are approximate."
      : "A tropical natal chart calculated from the supplied birth date, time, and place.",
    chartRotation: houseCusps[0] ?? (Number.isFinite(numberValue(firstHouse?.degree)) ? numberValue(firstHouse?.degree) : 0),
    houseCusps,
    bigThree,
    planets,
    aspects,
  };
};

const postProvider = async (env: RuntimeEnv, payload: JsonRecord, fetcher: ProviderFetch) => {
  const [authHeaders, baseUrl] = await Promise.all([
    resolveAstrologyApiRequestHeaders(env),
    resolveAstrologyApiBaseUrl(env),
  ]);
  const response = await fetcher(joinAstrologyApiUrl(baseUrl, providerEndpoint), {
    method: "POST",
    headers: { "content-type": "application/json", ...authHeaders },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({})) as JsonRecord;
  if (!response.ok || body.status === false) {
    throw new Error(astrologyProviderMessage("Birth chart provider request failed.", body));
  }
  return body;
};

const findOrCreateProfile = async ({
  env,
  accountId,
  input,
}: {
  env: RuntimeEnv;
  accountId: string;
  input: ReturnType<typeof validateBirthChartInput>;
}) => {
  const profiles = await listCustomerUserProfiles(env, accountId);
  const existing = profiles.find((profile) =>
    profile.profileName === input.name &&
    profile.birthDate === input.birthDate &&
    profile.birthTime === input.birthTime &&
    profile.birthPlace === input.place
  );
  if (existing) return existing.id;
  const created = await createCustomerUserProfile({
    env,
    accountId,
    profile: {
      profileName: input.name,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      birthPlace: input.place,
      placeId: input.placeId,
      placeLat: input.lat,
      placeLon: input.lon,
      placeTimezone: input.timezone,
      timezoneOffset: input.timezoneOffset,
    },
  });
  if (!created.ok || !created.profile) throw new Error("Birth profile could not be saved.");
  return created.profile.id;
};

export const createBirthChartReading = async ({
  env,
  request,
  body,
  fetcher = fetch,
  now = nowIso(),
}: {
  env: RuntimeEnv;
  request: Request;
  body: BirthChartRequest;
  fetcher?: ProviderFetch;
  now?: string;
}) => {
  if (!env.DB) throw new Error("Chart storage is not ready yet.");
  const input = validateBirthChartInput(body, new Date(now));
  const payload = buildBirthChartProviderPayload(input);
  const providerResponse = await postProvider(env, payload, fetcher);
  const chart = normalizeBirthChartResult({ input, response: providerResponse });
  const session = await getCustomerSession(env, request).catch(() => null);
  const accountId = session?.account.id || null;
  const profileId = accountId ? await findOrCreateProfile({ env, accountId, input }) : null;
  const readingId = createId("chart");
  const summary = chart.bigThree.map((item) => `${item.role}: ${item.sign}`).join(" · ");
  await env.DB.prepare(
    `INSERT INTO ${AP_TABLES.chartReadings} (id, account_id, profile_id, reading_type, provider, locale, status, title, summary, input_json, result_json, provider_payload_json, provider_response_json, generated_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'ready', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    readingId, accountId, profileId, birthChartReadingType, providerName, input.locale,
    chart.chartTitle, summary, JSON.stringify(input), JSON.stringify(chart),
    JSON.stringify(payload), JSON.stringify(providerResponse), now, now, now,
  ).run?.();
  return { ok: true as const, readingId, profileId, savedToAccount: Boolean(accountId), chart };
};

const parseResult = (value: unknown): PreparedBirthChartResult | null => {
  try {
    const parsed = JSON.parse(safeString(value));
    return isObject(parsed) ? parsed as PreparedBirthChartResult : null;
  } catch {
    return null;
  }
};

const parseRecord = (value: unknown): JsonRecord | null => {
  try {
    const parsed = JSON.parse(safeString(value));
    return isObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const parseStoredChart = (row: Record<string, unknown>, locale?: string) => {
  const input = parseRecord(row.input_json);
  const providerResponse = parseRecord(row.provider_response_json);
  if (input && providerResponse) {
    try {
      const requestedLocale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(safeString(locale))
        ? safeString(locale).toLowerCase()
        : safeString(input.locale) || "en";
      return normalizeBirthChartResult({
        input: {
          ...input,
          locale: requestedLocale,
        } as ReturnType<typeof validateBirthChartInput>,
        response: providerResponse,
      });
    } catch {
      // Preserve access to older readings if their archived provider payload is incomplete.
    }
  }
  return parseResult(row.result_json);
};

export const getBirthChartReading = async ({
  env,
  request,
  readingId,
  locale,
}: {
  env: RuntimeEnv;
  request: Request;
  readingId: string;
  locale?: string;
}) => {
  const id = safeString(readingId);
  if (!id || id.length > 100 || !env.DB) return null;
  const row = await env.DB.prepare(
    `SELECT id, account_id, profile_id, input_json, result_json, provider_response_json, generated_at FROM ${AP_TABLES.chartReadings}
     WHERE id = ? AND reading_type = ? AND status = 'ready' LIMIT 1`,
  ).bind(id, birthChartReadingType).first?.() as Record<string, unknown> | null | undefined;
  if (!row) return null;
  const ownerId = safeString(row.account_id);
  if (ownerId) {
    const session = await getCustomerSession(env, request).catch(() => null);
    if (session?.account.id !== ownerId) return null;
  }
  const chart = parseStoredChart(row, locale);
  return chart ? { readingId: id, profileId: safeString(row.profile_id), chart } : null;
};

export const listBirthChartReadings = async ({
  env,
  accountId,
  page = 1,
  pageSize = 8,
}: {
  env: RuntimeEnv;
  accountId: string;
  page?: number;
  pageSize?: number;
}) => {
  if (!env.DB) return { items: [], pagination: { page: 1, pageSize, totalItems: 0, totalPages: 1 } };
  const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM ${AP_TABLES.chartReadings} WHERE account_id = ? AND reading_type = ? AND status = 'ready'`,
  ).bind(accountId, birthChartReadingType).first?.() as { total?: unknown } | null | undefined;
  const totalItems = Number(totalRow?.total || 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(totalPages, Math.max(1, Math.floor(page)));
  const rows = await env.DB.prepare(
    `SELECT id, profile_id, title, summary, input_json, result_json, provider_response_json, generated_at, updated_at FROM ${AP_TABLES.chartReadings}
     WHERE account_id = ? AND reading_type = ? AND status = 'ready'
     ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`,
  ).bind(accountId, birthChartReadingType, safePageSize, (safePage - 1) * safePageSize).all?.();
  return {
    items: (rows?.results || []).flatMap((row: Record<string, unknown>) => {
      const chart = parseStoredChart(row);
      return chart ? [{ id: safeString(row.id), profileId: safeString(row.profile_id), generatedAt: safeString(row.generated_at), chart }] : [];
    }),
    pagination: { page: safePage, pageSize: safePageSize, totalItems, totalPages },
  };
};
