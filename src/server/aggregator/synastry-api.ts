import type { PreparedSynastryResult, SynastryAspectResult, SynastryAspectTone } from "../../data/synastry/results.ts";
import { AP_TABLES } from "./db/tables.ts";
import { getCustomerSession, requireCustomerCsrf } from "./customer-auth.ts";
import { timezoneOffsetToHours } from "./birth-chart-api.ts";
import { postAstrologyEngine, type AstrologyFetcher, type AstrologyRecord } from "./astrology-engine-api.ts";
import { normalizeSkyPositions } from "./sky-api.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

export const synastryFeature = "sidera.synastry";
export const synastryReadingType = "synastry";
const positionsEndpoint = "/v1/western/birth-chart/data";
type PersonInput = { name?: unknown; year?: unknown; month?: unknown; day?: unknown; hour?: unknown; minute?: unknown; period?: unknown; timeUnknown?: unknown; location?: unknown; locationId?: unknown; latitude?: unknown; longitude?: unknown; timezone?: unknown; timezoneOffset?: unknown };
export type SynastryRequest = { locale?: unknown; personA?: PersonInput; personB?: PersonInput };
const aspectTypes = [
  { label: "Conjunction", angle: 0, glyph: "☌", tone: "conjunction" as const, color: "#b07a3c" },
  { label: "Sextile", angle: 60, glyph: "⚹", tone: "harmonious" as const, color: "#2f4a41" },
  { label: "Square", angle: 90, glyph: "□", tone: "challenging" as const, color: "#9c4f38" },
  { label: "Trine", angle: 120, glyph: "△", tone: "harmonious" as const, color: "#2f4a41" },
  { label: "Opposition", angle: 180, glyph: "☍", tone: "challenging" as const, color: "#9c4f38" },
];
const importantPlanets = new Set(["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]);
const categoryDefinitions = [
  { label: "Attraction", planets: new Set(["Sun", "Moon", "Venus", "Mars", "Pluto"]) },
  { label: "Communication", planets: new Set(["Sun", "Moon", "Mercury", "Jupiter", "Saturn"]) },
  { label: "Emotional rhythm", planets: new Set(["Sun", "Moon", "Venus", "Saturn", "Neptune"]) },
  { label: "Conflict repair", planets: new Set(["Moon", "Mercury", "Mars", "Saturn", "Uranus"]) },
  { label: "Long-term shape", planets: new Set(["Sun", "Moon", "Venus", "Jupiter", "Saturn", "Pluto"]) },
];

const numberValue = (value: unknown) => { const result = Number(value); return Number.isFinite(result) ? result : Number.NaN; };
const validatePerson = (value: PersonInput | undefined, label: string) => {
  if (!value) throw new Error(`${label} details are required.`);
  const name = safeString(value.name).slice(0, 80);
  const year = Number(value.year); const month = Number(value.month); const day = Number(value.day);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!name || year < 1900 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || date.getTime() > Date.now()) throw new Error(`Enter valid ${label.toLowerCase()} birth details.`);
  const unknown = value.timeUnknown === true || safeString(value.timeUnknown) === "true" || safeString(value.timeUnknown) === "on";
  let hour = unknown ? 12 : Number(value.hour); const min = unknown ? 0 : Number(value.minute);
  if (!unknown && safeString(value.period).toUpperCase() === "PM" && hour < 12) hour += 12;
  if (!unknown && safeString(value.period).toUpperCase() === "AM" && hour === 12) hour = 0;
  const lat = numberValue(value.latitude); const lon = numberValue(value.longitude); const tzone = timezoneOffsetToHours(value.timezoneOffset);
  const location = safeString(value.location).slice(0, 180); const locationId = safeString(value.locationId).slice(0, 180);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || !Number.isInteger(min) || min < 0 || min > 59) throw new Error(`Enter a valid ${label.toLowerCase()} birth time.`);
  if (!location || !locationId || !Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180 || !Number.isFinite(tzone)) throw new Error(`Choose a valid ${label.toLowerCase()} birth place.`);
  return { name, year, month, day, hour, min, timeUnknown: unknown, location, locationId, lat, lon, timezone: safeString(value.timezone), timezoneOffset: safeString(value.timezoneOffset), tzone };
};
export const validateSynastryInput = (body: SynastryRequest) => {
  const locale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(safeString(body.locale)) ? safeString(body.locale).toLowerCase() : "en";
  return { locale, personA: validatePerson(body.personA, "Person A"), personB: validatePerson(body.personB, "Person B") };
};
const payloadFor = (person: ReturnType<typeof validatePerson>) => ({ birth_details: { date: person.day, month: person.month, year: person.year, hour: person.hour, minute: person.min, second: 0, latitude: person.lat, longitude: person.lon, timezone_offset: person.tzone }, house_system: "placidus", zodiac_mode: "tropical" });
const distance = (a: number, b: number) => { const diff = Math.abs(a - b) % 360; return Math.min(diff, 360 - diff); };
const planetRole: Record<string, string> = {
  Sun: "identity and confidence",
  Moon: "emotional needs and instinct",
  Mercury: "thinking and communication",
  Venus: "affection and values",
  Mars: "desire and initiative",
  Jupiter: "growth and shared perspective",
  Saturn: "commitment and boundaries",
  Uranus: "freedom and change",
  Neptune: "imagination and sensitivity",
  Pluto: "intensity and transformation",
};
const meaning = (firstOwner: string, firstPlanet: string, secondOwner: string, secondPlanet: string, aspect: string, tone: SynastryAspectTone) => {
  const firstTheme = planetRole[firstPlanet] || firstPlanet.toLowerCase();
  const secondTheme = planetRole[secondPlanet] || secondPlanet.toLowerCase();
  if (tone === "harmonious") return `${firstOwner}’s ${firstTheme} supports ${secondOwner}’s ${secondTheme}. This ${aspect.toLowerCase()} is easiest to use when both people name what is already working.`;
  if (tone === "challenging") return `${firstOwner}’s ${firstTheme} presses against ${secondOwner}’s ${secondTheme}. This ${aspect.toLowerCase()} becomes more constructive with clear expectations and room to respond.`;
  return `${firstOwner}’s ${firstTheme} meets ${secondOwner}’s ${secondTheme} directly. This conjunction concentrates the theme, so its effect depends on how consciously both people handle it.`;
};
const themeFor = (first: string, second: string) => first.includes("Mercury") || second.includes("Mercury") ? "Communication" : first.includes("Venus") || second.includes("Venus") ? "Affection" : first.includes("Mars") || second.includes("Mars") ? "Attraction" : first.includes("Saturn") || second.includes("Saturn") ? "Commitment" : "Recognition";

const scoreAspect = (tone: SynastryAspectTone) => tone === "harmonious" ? 88 : tone === "conjunction" ? 76 : 54;
const categoryScore = (aspects: SynastryAspectResult[], planets: PreparedSynastryResult["planets"], relevantPlanets: Set<string>) => {
  const contacts = aspects.map((aspect) => {
    const firstPlanet = planets[aspect.firstIndex]?.name.split("’s ").at(-1) || "";
    const secondPlanet = planets[aspect.secondIndex]?.name.split("’s ").at(-1) || "";
    const relevance = Number(relevantPlanets.has(firstPlanet)) + Number(relevantPlanets.has(secondPlanet));
    const orb = Number.parseFloat(aspect.orb);
    const exactness = Math.max(0.25, 1 - orb / 8);
    return { aspect, relevance, weight: relevance * exactness };
  }).filter((contact) => contact.relevance > 0);
  const selected = contacts.length ? contacts : aspects.slice(0, 5).map((aspect) => ({ aspect, relevance: 1, weight: 1 }));
  const weight = selected.reduce((sum, contact) => sum + contact.weight, 0);
  if (!weight) return 50;
  return Math.max(35, Math.min(95, Math.round(selected.reduce((sum, contact) => sum + scoreAspect(contact.aspect.tone) * contact.weight, 0) / weight)));
};

export const normalizeSynastryResult = ({ input, firstResponse, secondResponse }: { input: ReturnType<typeof validateSynastryInput>; firstResponse: AstrologyRecord; secondResponse: AstrologyRecord }): PreparedSynastryResult => {
  const first = normalizeSkyPositions(firstResponse).filter((planet) => importantPlanets.has(planet.planetName));
  const second = normalizeSkyPositions(secondResponse).filter((planet) => importantPlanets.has(planet.planetName));
  const planets = [...first.map((planet) => ({ name: `${input.personA.name}’s ${planet.planetName}`, glyph: planet.planetGlyph, longitude: planet.longitude, label: `${input.personA.name}’s ${planet.planetName} in ${planet.signName}`, color: "#9c4f38", ring: "inner" as const })), ...second.map((planet) => ({ name: `${input.personB.name}’s ${planet.planetName}`, glyph: planet.planetGlyph, longitude: planet.longitude, label: `${input.personB.name}’s ${planet.planetName} in ${planet.signName}`, color: "#2f4a41", ring: "outer" as const }))];
  const aspects: SynastryAspectResult[] = [];
  first.forEach((a, firstIndex) => second.forEach((b, secondIndex) => {
    const separation = distance(a.longitude, b.longitude);
    const definition = aspectTypes.map((type) => ({ ...type, orb: Math.abs(separation - type.angle) })).filter((type) => type.orb <= (type.angle === 0 ? 8 : 6)).sort((aType, bType) => aType.orb - bType.orb)[0];
    if (!definition) return;
    aspects.push({ firstIndex, secondIndex: first.length + secondIndex, aspectLabel: definition.label, aspectGlyph: definition.glyph, orb: `${Math.round(definition.orb * 10) / 10}°`, tone: definition.tone, color: definition.color, weight: Math.max(1, 2.5 - definition.orb / 4), dashed: definition.tone === "challenging", title: `${a.planetName} ${definition.label.toLowerCase()} ${b.planetName}`, subtitle: themeFor(a.planetName, b.planetName), interpretation: meaning(input.personA.name, a.planetName, input.personB.name, b.planetName, definition.label, definition.tone), type: definition.label, theme: themeFor(a.planetName, b.planetName) });
  }));
  aspects.sort((a, b) => Number.parseFloat(a.orb) - Number.parseFloat(b.orb));
  if (!aspects.length) throw new Error("Synastry provider returned no usable cross-chart aspects.");
  const categories = categoryDefinitions.map(({ label, planets: relevantPlanets }) => ({ label, value: categoryScore(aspects, planets, relevantPlanets) }));
  const score = Math.round(categories.reduce((sum, category) => sum + category.value, 0) / categories.length);
  const attraction = aspects.find((item) => item.tone !== "challenging") || aspects[0];
  const care = aspects.find((item) => item.tone === "challenging" && item !== attraction) || aspects.find((item) => item !== attraction) || aspects[0];
  const longArc = aspects.find((item) => item !== attraction && item !== care && /Saturn|Jupiter|Pluto/.test(item.title)) || aspects.find((item) => item !== attraction && item !== care) || aspects[0];
  const leading = [attraction, care, longArc];
  return { relationshipContext: "Synastry compatibility", personA: { name: input.personA.name, summary: `${input.personA.name} — ${first.find((planet) => planet.id === "sun")?.signName || "Birth chart"}` }, personB: { name: input.personB.name, summary: `${input.personB.name} — ${second.find((planet) => planet.id === "sun")?.signName || "Birth chart"}` }, score, verdict: score >= 82 ? "A naturally resonant connection with strong room for mutual growth." : score >= 68 ? "A compelling connection that deepens through curiosity and conscious repair." : "A dynamic connection whose contrasts can become strengths with clear communication.", categories, chartRotation: 0, planets, aspects: aspects.slice(0, 24), narratives: leading.map((item, index) => ({ tag: index === 0 ? "What flows" : index === 1 ? "What asks for care" : "The long arc", title: item.title, body: item.interpretation, tone: index === 0 ? "terracotta" : index === 1 ? "forest" : "parchment" })) };
};

export const createSynastryReading = async ({ env, request, body, fetcher = fetch, now = nowIso() }: { env: RuntimeEnv; request: Request; body: SynastryRequest; fetcher?: AstrologyFetcher; now?: string }) => {
  if (!env.DB) throw new Error("Synastry storage is not ready yet.");
  const input = validateSynastryInput(body);
  const session = await getCustomerSession(env, request).catch(() => null);
  if (session) {
    const csrf = await requireCustomerCsrf(env, request);
    if (!csrf.ok) throw new Error("Synastry request could not be verified.");
  }
  const [first, second] = await Promise.all([
    postAstrologyEngine({ env, endpoint: positionsEndpoint, payload: payloadFor(input.personA), locale: input.locale, fetcher, now, failureMessage: "Synastry chart provider request failed." }),
    postAstrologyEngine({ env, endpoint: positionsEndpoint, payload: payloadFor(input.personB), locale: input.locale, fetcher, now, failureMessage: "Synastry chart provider request failed." }),
  ]);
  const result = normalizeSynastryResult({ input, firstResponse: first.payload, secondResponse: second.payload });
  const readingId = createId("syn");
  await env.DB.prepare(`INSERT INTO ${AP_TABLES.chartReadings} (id, account_id, profile_id, reading_type, provider, locale, status, title, summary, input_json, result_json, provider_payload_json, provider_response_json, generated_at, created_at, updated_at) VALUES (?, ?, NULL, ?, 'astrologyapi', ?, 'ready', ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(readingId, session?.account.id || null, synastryReadingType, input.locale, `${input.personA.name} & ${input.personB.name}`, result.verdict, JSON.stringify(input), JSON.stringify(result), JSON.stringify([payloadFor(input.personA), payloadFor(input.personB)]), JSON.stringify([first.payload, second.payload]), now, now, now).run?.();
  return { ok: true as const, readingId, savedToAccount: Boolean(session), result };
};
const parseResult = (value: unknown) => { try { const parsed = JSON.parse(safeString(value)); return parsed && typeof parsed === "object" ? parsed as PreparedSynastryResult : null; } catch { return null; } };
const parseRecord = (value: unknown) => { try { const parsed = JSON.parse(safeString(value)); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null; } catch { return null; } };
const parseResponsePair = (value: unknown) => { try { const parsed = JSON.parse(safeString(value)); return Array.isArray(parsed) && parsed.length >= 2 && parsed.every((item) => item && typeof item === "object" && !Array.isArray(item)) ? parsed as [AstrologyRecord, AstrologyRecord] : null; } catch { return null; } };
export const getSynastryReading = async ({ env, request, readingId }: { env: RuntimeEnv; request: Request; readingId: string }) => {
  if (!env.DB || !/^[A-Za-z0-9_-]{1,100}$/.test(readingId)) return null;
  const row = await env.DB.prepare(`SELECT account_id, input_json, result_json, provider_response_json FROM ${AP_TABLES.chartReadings} WHERE id = ? AND reading_type = ? AND status = 'ready' LIMIT 1`).bind(readingId, synastryReadingType).first?.() as Record<string, unknown> | null | undefined;
  if (!row) return null;
  const owner = safeString(row.account_id);
  if (owner) { const session = await getCustomerSession(env, request).catch(() => null); if (session?.account.id !== owner) return null; }
  let result: PreparedSynastryResult | null = null;
  const input = parseRecord(row.input_json);
  const responses = parseResponsePair(row.provider_response_json);
  if (input && responses) {
    try {
      result = normalizeSynastryResult({ input: input as ReturnType<typeof validateSynastryInput>, firstResponse: responses[0], secondResponse: responses[1] });
    } catch {
      // Keep older saved readings available if archived provider data is incomplete.
    }
  }
  result ||= parseResult(row.result_json);
  return result ? { readingId, result } : null;
};
