import type { PreparedTransitResult, TransitAspect, TransitPlanet } from "../../data/transit/results.ts";
import type { SupportedLocale } from "../../data/localization-contract.ts";
import { AP_TABLES } from "./db/tables.ts";
import { getCustomerSession, requireCustomerCsrf } from "./customer-auth.ts";
import { getCustomerUserProfile } from "./customer-profiles.ts";
import { timezoneOffsetToHours } from "./birth-chart-api.ts";
import { astrologyRecord, postAstrologyEngine, type AstrologyFetcher, type AstrologyRecord } from "./astrology-engine-api.ts";
import { normalizeSkyPositions } from "./sky-api.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

export const transitFeature = "sidera.transit";
export const transitReadingType = "transit";
const positionsEndpoint = "/v1/western/birth-chart/data";
const personalizedEndpoint = "/v1/transits/personalized";
const presentation = { conjunction: { glyph: "☌", tone: "conjunction" as const, color: "#b07a3c", angle: 0 }, sextile: { glyph: "⚹", tone: "harmonious" as const, color: "#2f4a41", angle: 60 }, square: { glyph: "□", tone: "challenging" as const, color: "#9c4f38", angle: 90 }, trine: { glyph: "△", tone: "harmonious" as const, color: "#2f4a41", angle: 120 }, opposition: { glyph: "☍", tone: "challenging" as const, color: "#9c4f38", angle: 180 } };
const colors = ["#9c4f38", "#2f4a41", "#b07a3c", "#9c4f38", "#9c4f38", "#b07a3c", "#6c6254", "#2f4a41", "#2f4a41", "#6c6254"];
const dateOnly = (value: unknown) => safeString(value).match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "";
const validateDate = (value: unknown, now: string) => { const text = dateOnly(value); const parsed = new Date(`${text}T12:00:00Z`); const year = parsed.getUTCFullYear(); const current = new Date(now).getUTCFullYear(); if (!text || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text || year < current - 20 || year > current + 20) throw new Error("Choose a valid transit date."); return { text, parsed }; };
type TransitProfileInput = { name?: unknown; year?: unknown; month?: unknown; day?: unknown; hour?: unknown; minute?: unknown; period?: unknown; timeUnknown?: unknown; location?: unknown; locationId?: unknown; latitude?: unknown; longitude?: unknown; timezone?: unknown; timezoneOffset?: unknown };
const numberValue = (value: unknown) => { const result = Number(value); return Number.isFinite(result) ? result : Number.NaN; };
export const validateTransitProfile = (value: TransitProfileInput | undefined) => {
  if (!value) throw new Error("Birth details are required.");
  const profileName = safeString(value.name).slice(0, 80); const year = Number(value.year); const month = Number(value.month); const day = Number(value.day); const date = new Date(Date.UTC(year, month - 1, day));
  if (!profileName || year < 1900 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || date.getTime() > Date.now()) throw new Error("Enter valid birth details.");
  const unknown = value.timeUnknown === true || safeString(value.timeUnknown) === "true" || safeString(value.timeUnknown) === "on"; let hour = unknown ? 12 : Number(value.hour); const minute = unknown ? 0 : Number(value.minute);
  if (!unknown && safeString(value.period).toUpperCase() === "PM" && hour < 12) hour += 12;
  if (!unknown && safeString(value.period).toUpperCase() === "AM" && hour === 12) hour = 0;
  const placeLat = numberValue(value.latitude); const placeLon = numberValue(value.longitude); const timezoneOffset = safeString(value.timezoneOffset); const offset = timezoneOffsetToHours(timezoneOffset); const birthPlace = safeString(value.location).slice(0, 180); const placeId = safeString(value.locationId).slice(0, 180); const placeTimezone = safeString(value.timezone).slice(0, 100);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || !Number.isInteger(minute) || minute < 0 || minute > 59) throw new Error("Enter a valid birth time.");
  if (!birthPlace || !placeId || !placeTimezone || !Number.isFinite(placeLat) || placeLat < -90 || placeLat > 90 || !Number.isFinite(placeLon) || placeLon < -180 || placeLon > 180 || !Number.isFinite(offset)) throw new Error("Choose a valid birth place.");
  return { profileName, birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, birthTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`, birthPlace, placeId, placeLat, placeLon, placeTimezone, timezoneOffset, updatedAt: "manual" };
};
export const timezoneOffsetForDate = ({
  timezone,
  date,
  fallback,
}: {
  timezone: string;
  date: Date;
  fallback?: unknown;
}) => {
  try {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
    if (name === "GMT" || name === "UTC") return 0;
    const derived = timezoneOffsetToHours(name);
    if (Number.isFinite(derived)) return derived;
  } catch {
    // The saved offset remains a safe fallback for legacy profiles with an invalid IANA zone.
  }
  return timezoneOffsetToHours(fallback);
};
type TransitProfile = { profileName: string; birthDate: string; birthTime: string; birthPlace: string; placeLat: number; placeLon: number; placeTimezone: string; timezoneOffset: string; updatedAt: string };
const profilePayload = (profile: TransitProfile | null) => {
  if (!profile) throw new Error("Saved chart was not found.");
  const date = new Date(`${profile.birthDate}T12:00:00Z`); const [hour, min] = profile.birthTime.split(":").map(Number); const storedOffset = timezoneOffsetToHours(profile.timezoneOffset); const tzone = Number.isFinite(storedOffset) ? storedOffset : timezoneOffsetForDate({ timezone: profile.placeTimezone, date, fallback: profile.timezoneOffset });
  if (Number.isNaN(date.getTime()) || !Number.isFinite(hour) || !Number.isFinite(min) || !Number.isFinite(tzone)) throw new Error("Saved chart has incomplete birth details.");
  return { date: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear(), hour, minute: min, second: 0, latitude: profile.placeLat, longitude: profile.placeLon, timezone_offset: tzone };
};
const currentPayload = (date: Date, profile: TransitProfile) => {
  const tzone = timezoneOffsetForDate({ timezone: profile.placeTimezone, date, fallback: profile.timezoneOffset });
  if (!Number.isFinite(tzone)) throw new Error("Saved chart has incomplete timezone details.");
  return { date: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear(), hour: 12, minute: 0, second: 0, latitude: profile.placeLat, longitude: profile.placeLon, timezone_offset: tzone };
};
const arrays = (response: AstrologyRecord) => { const direct = [response.timeline, response.events].find(Array.isArray); if (Array.isArray(direct)) return direct.filter(astrologyRecord); if (astrologyRecord(response.data)) { const nested = [response.data.timeline, response.data.events].find(Array.isArray); if (Array.isArray(nested)) return nested.filter(astrologyRecord); } return []; };
const distance = (a: number, b: number) => { const diff = Math.abs(a - b) % 360; return Math.min(diff, 360 - diff); };
const houseCuspsFromResponse = (response: AstrologyRecord) => {
  const body = astrologyRecord(response.data) ? response.data : response;
  const houses = (Array.isArray(body.houses) ? body.houses : [])
    .filter(astrologyRecord)
    .map((house) => ({ house: Number(house.house), degree: Number(house.degree) }))
    .filter((house) => Number.isInteger(house.house) && Number.isFinite(house.degree))
    .sort((first, second) => first.house - second.house);
  return houses.length === 12 && houses.every((house, index) => house.house === index + 1)
    ? houses.map((house) => ((house.degree % 360) + 360) % 360)
    : [];
};
const aspectFromEvent = (event: AstrologyRecord, transitNames: Map<string, number>, natalNames: Map<string, number>, planets: TransitPlanet[], viewedDate: string): TransitAspect | null => {
  if (safeString(event.event_type) !== "transit_aspects") return null;
  const meta = astrologyRecord(event.metadata) ? event.metadata : {}; const transitName = safeString(event.transiting_planet || event.planet); const natalName = safeString(event.natal_planet || event.related_planet); const name = safeString(meta.aspect || event.event_subtype).toLowerCase() as keyof typeof presentation; const view = presentation[name]; const transitIndex = transitNames.get(transitName.toLowerCase()); const natalIndex = natalNames.get(natalName.toLowerCase());
  if (!view || transitIndex === undefined || natalIndex === undefined) return null;
  const orbNumber = Number(meta.orb ?? event.orb);
  const orb = Number.isFinite(orbNumber) ? `${Math.round(Math.abs(orbNumber) * 10) / 10}°` : "";
  const phase = safeString(meta.phase || event.phase).toLowerCase();
  const exactMoment = new Date(safeString(meta.exact_moment_local || event.moment_local));
  const referenceMoment = new Date(`${viewedDate}T12:00:00Z`);
  const applying = phase
    ? phase !== "separating"
    : Number.isFinite(exactMoment.getTime())
      ? referenceMoment.getTime() <= exactMoment.getTime()
      : true;
  const transitPosition = planets[transitIndex]?.position || safeString(meta.transit_sign);
  const natalPosition = planets[natalIndex]?.position;
  const transitHouse = Number(meta.transit_natal_house ?? event.transit_natal_house);
  const factualNote = `${transitName} forms a ${name} to your natal ${natalName}${Number.isInteger(transitHouse) ? ` through house ${transitHouse}` : ""}.`;
  return { transitIndex, natalIndex, aspectLabel: name, aspectGlyph: view.glyph, title: `${transitName} ${name} natal ${natalName}`, status: `${applying ? "Applying" : "Separating"}${orb ? ` · orb ${orb}` : ""}`, interpretation: safeString(event.interpretation || meta.interpretation) || factualNote, positionLabel: [transitPosition, natalPosition ? `natal ${natalPosition}` : ""].filter(Boolean).join(" · "), orb, phase: applying ? "applying" : "separating", phaseLabel: applying ? "applying" : "separating", tone: view.tone, color: view.color };
};

export const normalizeTransitResult = ({ profileName, birthDate, birthPlace, date, natalResponse, transitResponse, personalizedResponse }: { profileName: string; birthDate: string; birthPlace: string; date: string; natalResponse: AstrologyRecord; transitResponse: AstrologyRecord; personalizedResponse: AstrologyRecord }): PreparedTransitResult => {
  const natal = normalizeSkyPositions(natalResponse); const moving = normalizeSkyPositions(transitResponse);
  const planets: TransitPlanet[] = [...natal.map((planet, index) => ({ name: planet.planetName, glyph: planet.planetGlyph, longitude: planet.longitude, label: `Natal ${planet.planetName} · ${planet.degreeText} ${planet.signName}`, position: `${planet.degreeText} ${planet.signName}`, color: colors[index] || "#6c6254", ring: "inner" as const, retrograde: Boolean(planet.motionText) })), ...moving.map((planet) => ({ name: planet.planetName, glyph: planet.planetGlyph, longitude: planet.longitude, label: `Transiting ${planet.planetName} · ${planet.degreeText} ${planet.signName}`, position: `${planet.degreeText} ${planet.signName}`, color: "#5b382c", ring: "outer" as const, retrograde: Boolean(planet.motionText) }))];
  const natalNames = new Map(natal.map((planet, index) => [planet.planetName.toLowerCase(), index])); const transitNames = new Map(moving.map((planet, index) => [planet.planetName.toLowerCase(), natal.length + index]));
  let aspects = arrays(personalizedResponse).map((event) => aspectFromEvent(event, transitNames, natalNames, planets, date)).filter((aspect): aspect is TransitAspect => Boolean(aspect));
  if (!aspects.length) moving.forEach((transit, movingIndex) => natal.forEach((birth, natalIndex) => { const separation = distance(transit.longitude, birth.longitude); const definition = Object.entries(presentation).map(([name, value]) => ({ name, ...value, orb: Math.abs(separation - value.angle) })).filter((item) => item.orb <= (item.angle === 0 ? 8 : 6)).sort((a, b) => a.orb - b.orb)[0]; if (!definition) return; const applying = true; aspects.push({ transitIndex: natal.length + movingIndex, natalIndex, aspectLabel: definition.name, aspectGlyph: definition.glyph, title: `${transit.planetName} ${definition.name} natal ${birth.planetName}`, status: `Applying · orb ${definition.orb.toFixed(1)}°`, interpretation: `Transiting ${transit.planetName} ${definition.name}s your natal ${birth.planetName}, bringing this connection into focus.`, positionLabel: `${transit.degreeText} ${transit.signName} · ${birth.degreeText} ${birth.signName}`, orb: `${definition.orb.toFixed(1)}°`, phase: applying ? "applying" : "separating", phaseLabel: applying ? "applying" : "separating", tone: definition.tone, color: definition.color }); }));
  aspects = aspects.sort((a, b) => Number.parseFloat(a.orb) - Number.parseFloat(b.orb));
  if (!aspects.length) throw new Error("Transit provider returned no usable aspects.");
  const houseCusps = houseCuspsFromResponse(natalResponse);
  return { slug: "", chartName: profileName, birthSummary: birthDate, birthPlace, dateIso: date, chartRotation: houseCusps[0] ?? 0, houseCusps, planets, aspects: aspects.slice(0, 24), totalAspectCount: aspects.length };
};

const calculateTransitResult = async ({ env, profile, profileKey, date, locale, fetcher, now }: { env: RuntimeEnv; profile: TransitProfile; profileKey: string; date: { text: string; parsed: Date }; locale: SupportedLocale; fetcher: AstrologyFetcher; now: string }) => {
  const birthDetails = profilePayload(profile);
  const targetDetails = currentPayload(date.parsed, profile);
  const personalizedPayload = { birth_details: birthDetails, start_date: date.text, end_date: date.text, zodiac_mode: "tropical", house_system: "placidus" };
  const [natal, moving, personalized] = await Promise.all([
    postAstrologyEngine({ env, endpoint: positionsEndpoint, payload: { birth_details: birthDetails, zodiac_mode: "tropical", house_system: "placidus" }, locale, cacheKey: `transit:natal:${profileKey}:${profile.updatedAt}`, ttlSeconds: 86_400, fetcher, now, failureMessage: "Transit natal chart provider request failed." }),
    postAstrologyEngine({ env, endpoint: positionsEndpoint, payload: { birth_details: targetDetails, zodiac_mode: "tropical", house_system: "placidus" }, locale, cacheKey: `transit:positions:${profileKey}:${date.text}`, ttlSeconds: 3_600, fetcher, now, failureMessage: "Transit position provider request failed." }),
    postAstrologyEngine({ env, endpoint: personalizedEndpoint, payload: personalizedPayload, locale, cacheKey: `transit:personalized:${profileKey}:${date.text}`, ttlSeconds: 3_600, fetcher, now, failureMessage: "Personalized transit provider request failed." }),
  ]);
  return {
    result: normalizeTransitResult({ profileName: profile.profileName, birthDate: profile.birthDate, birthPlace: profile.birthPlace, date: date.text, natalResponse: natal.payload, transitResponse: moving.payload, personalizedResponse: personalized.payload }),
    personalizedPayload,
    providerResponse: { natal: natal.payload, moving: moving.payload, personalized: personalized.payload },
  };
};

export const createTransitReading = async ({ env, request, profileId, profile: profileInput, date, locale = "en", fetcher = fetch, now = nowIso() }: { env: RuntimeEnv; request: Request; profileId?: unknown; profile?: TransitProfileInput; date: unknown; locale?: SupportedLocale; fetcher?: AstrologyFetcher; now?: string }) => {
  if (!env.DB) throw new Error("Transit storage is not ready yet.");
  const session = await getCustomerSession(env, request).catch(() => null);
  if (session) { const csrf = await requireCustomerCsrf(env, request); if (!csrf.ok) throw new Error("Transit request could not be verified."); }
  const id = safeString(profileId);
  if (id && !session) throw new Error("Sign in to use a saved profile.");
  const profile = id && session ? await getCustomerUserProfile(env, session.account.id, id) : validateTransitProfile(profileInput);
  if (!profile) throw new Error("Saved chart was not found.");
  const selected = validateDate(date, now);
  const profileKey = id || `${profile.birthDate}:${profile.birthTime}:${profile.placeLat}:${profile.placeLon}`;
  const calculated = await calculateTransitResult({ env, profile, profileKey, date: selected, locale, fetcher, now });
  const result = calculated.result;
  const readingId = createId("transit"); result.slug = readingId;
  await env.DB.prepare(`INSERT INTO ${AP_TABLES.chartReadings} (id, account_id, profile_id, reading_type, provider, locale, status, title, summary, input_json, result_json, provider_payload_json, provider_response_json, generated_at, created_at, updated_at) VALUES (?, ?, ?, ?, 'astrologyapi', ?, 'ready', ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(readingId, session?.account.id || null, id || null, transitReadingType, locale, `${profile.profileName} transits`, selected.text, JSON.stringify({ profileId: id || null, profile: id ? undefined : profile, date: selected.text }), JSON.stringify(result), JSON.stringify(calculated.personalizedPayload), JSON.stringify(calculated.providerResponse), now, now, now).run?.();
  return { ok: true as const, readingId, result };
};
const parseResult = (value: unknown) => { try { const parsed = JSON.parse(safeString(value)); return parsed && typeof parsed === "object" ? parsed as PreparedTransitResult : null; } catch { return null; } };
const parseRecord = (value: unknown) => { try { const parsed = JSON.parse(safeString(value)); return astrologyRecord(parsed) ? parsed : null; } catch { return null; } };
export const getTransitReading = async ({ env, request, readingId, date, locale = "en", fetcher = fetch, now = nowIso() }: { env: RuntimeEnv; request: Request; readingId: string; date?: unknown; locale?: SupportedLocale; fetcher?: AstrologyFetcher; now?: string }) => {
  if (!env.DB || !/^[A-Za-z0-9_-]{1,100}$/.test(readingId)) return null;
  const row = await env.DB.prepare(`SELECT account_id, profile_id, input_json, result_json, provider_response_json FROM ${AP_TABLES.chartReadings} WHERE id = ? AND reading_type = ? AND status = 'ready' LIMIT 1`).bind(readingId, transitReadingType).first?.() as Record<string, unknown> | null | undefined;
  if (!row) return null;
  const owner = safeString(row.account_id);
  const session = owner ? await getCustomerSession(env, request).catch(() => null) : null;
  if (owner && session?.account.id !== owner) return null;
  const stored = parseResult(row.result_json);
  if (!stored) return null;
  const requestedDate = dateOnly(date);
  if (requestedDate && requestedDate !== stored.dateIso) {
    let selected: ReturnType<typeof validateDate>;
    try { selected = validateDate(requestedDate, now); } catch { return null; }
    const input = parseRecord(row.input_json);
    const profileId = safeString(row.profile_id || input?.profileId);
    const embeddedProfile = astrologyRecord(input?.profile) ? input.profile as unknown as TransitProfile : null;
    const profile = profileId && session
      ? await getCustomerUserProfile(env, session.account.id, profileId)
      : embeddedProfile;
    if (!profile) return null;
    const profileKey = profileId || `${profile.birthDate}:${profile.birthTime}:${profile.placeLat}:${profile.placeLon}`;
    const calculated = await calculateTransitResult({ env, profile, profileKey, date: selected, locale, fetcher, now });
    calculated.result.slug = readingId;
    return { readingId, result: calculated.result };
  }
  const archived = parseRecord(row.provider_response_json);
  if (astrologyRecord(archived?.natal) && astrologyRecord(archived?.moving) && astrologyRecord(archived?.personalized)) {
    try {
      const refreshed = normalizeTransitResult({ profileName: stored.chartName, birthDate: stored.birthSummary, birthPlace: stored.birthPlace, date: stored.dateIso, natalResponse: archived.natal, transitResponse: archived.moving, personalizedResponse: archived.personalized });
      refreshed.slug = readingId;
      return { readingId, result: refreshed };
    } catch {
      // Preserve access to legacy readings when their archived provider payload is incomplete.
    }
  }
  return { readingId, result: { ...stored, slug: readingId, houseCusps: stored.houseCusps || [] } };
};
