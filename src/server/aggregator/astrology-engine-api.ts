import { AP_TABLES as tables } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";
import {
  astrologyProviderMessage,
} from "./astrology-api-config.ts";
import {
  joinTransitEngineUrl,
  resolveTransitEngineRequestConfig,
} from "./transit-engine-config.ts";

export type AstrologyRecord = Record<string, unknown>;
export type AstrologyFetcher = typeof fetch;

const isRecord = (value: unknown): value is AstrologyRecord =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const readCached = async ({
  env,
  endpoint,
  cacheKey,
  locale,
  now,
}: {
  env: RuntimeEnv;
  endpoint: string;
  cacheKey: string;
  locale: string;
  now: string;
}) => {
  if (!env.DB) return null;
  const row = await env.DB.prepare(
    `SELECT response_json FROM ${tables.astrologyProviderCache}
     WHERE provider = 'astrologyapi_transit' AND endpoint = ? AND cache_key = ? AND locale = ?
       AND status = 'ready' AND expires_at > ? LIMIT 1`,
  ).bind(endpoint, cacheKey, locale, now).first?.() as { response_json?: unknown } | null | undefined;
  if (!row?.response_json) return null;
  try {
    const parsed = JSON.parse(safeString(row.response_json));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeCached = async ({
  env,
  endpoint,
  cacheKey,
  locale,
  payload,
  ttlSeconds,
  now,
}: {
  env: RuntimeEnv;
  endpoint: string;
  cacheKey: string;
  locale: string;
  payload: AstrologyRecord;
  ttlSeconds: number;
  now: string;
}) => {
  if (!env.DB || ttlSeconds <= 0) return;
  const expiresAt = new Date(new Date(now).getTime() + ttlSeconds * 1_000).toISOString();
  await env.DB.prepare(
    `INSERT INTO ${tables.astrologyProviderCache}
      (id, provider, endpoint, cache_key, locale, response_json, status, expires_at, created_at, updated_at)
     VALUES (?, 'astrologyapi_transit', ?, ?, ?, ?, 'ready', ?, ?, ?)
     ON CONFLICT(provider, endpoint, cache_key, locale) DO UPDATE SET
       response_json = excluded.response_json, status = 'ready',
       expires_at = excluded.expires_at, updated_at = excluded.updated_at`,
  ).bind(
    createId("cache"), endpoint, cacheKey, locale, JSON.stringify(payload), expiresAt, now, now,
  ).run?.();
};

export const postAstrologyEngine = async ({
  env,
  endpoint,
  payload,
  locale = "en",
  cacheKey,
  ttlSeconds = 0,
  fetcher = fetch,
  now = nowIso(),
  failureMessage = "Astrology provider request failed.",
}: {
  env: RuntimeEnv;
  endpoint: string;
  payload: AstrologyRecord;
  locale?: string;
  cacheKey?: string;
  ttlSeconds?: number;
  fetcher?: AstrologyFetcher;
  now?: string;
  failureMessage?: string;
}) => {
  const safeLocale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(locale) ? locale.toLowerCase() : "en";
  if (cacheKey) {
    const cached = await readCached({ env, endpoint, cacheKey, locale: safeLocale, now }).catch(() => null);
    if (cached) return { payload: cached, source: "cache" as const };
  }
  const config = await resolveTransitEngineRequestConfig(env);
  const response = await fetcher(joinTransitEngineUrl(config.baseUrl, endpoint), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept-language": safeLocale,
      authorization: config.authorization,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({})) as AstrologyRecord;
  if (!response.ok || body.status === false || body.success === false) {
    throw new Error(astrologyProviderMessage(failureMessage, body));
  }
  if (cacheKey) {
    await writeCached({ env, endpoint, cacheKey, locale: safeLocale, payload: body, ttlSeconds, now }).catch(() => undefined);
  }
  return { payload: body, source: "provider" as const };
};

export const astrologyRecord = isRecord;
