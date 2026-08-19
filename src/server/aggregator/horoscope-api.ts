import { AP_TABLES as tables } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";
import {
  astrologyProviderMessage,
  joinAstrologyApiUrl,
  resolveAstrologyJsonRequestConfig,
} from "./astrology-api-config.ts";

export const horoscopeFeature = "sidera.horoscope";
export const horoscopePeriods = ["daily", "weekly", "monthly"] as const;
export const zodiacNames = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"] as const;
export type HoroscopePeriod = typeof horoscopePeriods[number];
export type ZodiacName = typeof zodiacNames[number];
type Row = Record<string, unknown>;

export const normalizeSign = (value: unknown) => {
  const sign = safeString(value).toLowerCase();
  return zodiacNames.includes(sign as ZodiacName) ? sign as ZodiacName : null;
};

export const normalizePeriod = (value: unknown) => {
  const period = safeString(value).toLowerCase();
  return horoscopePeriods.includes(period as HoroscopePeriod) ? period as HoroscopePeriod : null;
};

const endpointFor = (period: HoroscopePeriod, sign: ZodiacName) =>
  period === "daily" ? `/v1/sun_sign_prediction/daily/${sign}` : `/v1/horoscope_prediction/${period}/${sign}`;

export const normalizeHoroscopeResponse = (period: HoroscopePeriod, payload: Row) => {
  if (period === "daily") {
    const body = payload.prediction && typeof payload.prediction === "object" && !Array.isArray(payload.prediction) ? payload.prediction as Row : payload;
    const sections = [body.personal_life, body.profession, body.health]
      .map(safeString)
      .filter(Boolean);
    const headline = [body.emotions, body.luck, body.personal_life]
      .map(safeString)
      .find(Boolean);
    if (!headline || !sections.length) throw new Error("Horoscope provider returned an incomplete reading.");
    return { headline, sections };
  }
  const sections = Array.isArray(payload.prediction) ? payload.prediction.map(safeString).filter(Boolean) : [];
  if (!sections.length) throw new Error("Horoscope provider returned an incomplete reading.");
  return { headline: sections[0], sections: sections.slice(1, 4) };
};

export const getHoroscopePrediction = async ({ env, sign, period, locale = "en", fetcher = fetch, now = nowIso() }: { env: RuntimeEnv; sign: ZodiacName; period: HoroscopePeriod; locale?: string; fetcher?: typeof fetch; now?: string }) => {
  const endpoint = endpointFor(period, sign);
  const cacheKey = `${period}:${sign}`;
  if (env.DB) {
    const cached = await env.DB.prepare(`SELECT response_json FROM ${tables.astrologyProviderCache} WHERE provider = 'astrologyapi' AND endpoint = ? AND cache_key = ? AND locale = ? AND status = 'ready' AND expires_at > ? LIMIT 1`).bind(endpoint, cacheKey, locale, now).first?.() as { response_json?: unknown } | null | undefined;
    if (cached?.response_json) {
      try { return { ...normalizeHoroscopeResponse(period, JSON.parse(safeString(cached.response_json))), source: "cache" as const }; } catch { /* refresh invalid cache */ }
    }
  }
  const config = await resolveAstrologyJsonRequestConfig(env);
  const response = await fetcher(joinAstrologyApiUrl(config.baseUrl, endpoint), {
    method: "POST",
    headers: { "content-type": "application/json", "accept-language": locale, "x-astrologyapi-key": config.apiKey },
    body: JSON.stringify({ timezone: 0 }),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json().catch(() => ({})) as Row;
  if (!response.ok || payload.status === false) throw new Error(astrologyProviderMessage("Horoscope provider request failed.", payload));
  const reading = normalizeHoroscopeResponse(period, payload);
  if (env.DB) {
    const ttl = period === "daily" ? 6 : period === "weekly" ? 12 : 24;
    const expiresAt = new Date(new Date(now).getTime() + ttl * 3_600_000).toISOString();
    await env.DB.prepare(`INSERT INTO ${tables.astrologyProviderCache} (id, provider, endpoint, cache_key, locale, response_json, status, expires_at, created_at, updated_at) VALUES (?, 'astrologyapi', ?, ?, ?, ?, 'ready', ?, ?, ?) ON CONFLICT(provider, endpoint, cache_key, locale) DO UPDATE SET response_json = excluded.response_json, status = 'ready', expires_at = excluded.expires_at, updated_at = excluded.updated_at`).bind(createId("cache"), endpoint, cacheKey, locale, JSON.stringify(payload), expiresAt, now, now).run?.();
  }
  return { ...reading, source: "provider" as const };
};
