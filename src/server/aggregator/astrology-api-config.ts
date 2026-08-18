import { getRuntimeConfigValue } from "./runtime-config.ts";
import { resolveSecretBinding } from "./runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

export const astrologyApiRuntimeNames = {
  apiKey: "X_ASTROLOGYAPI_KEY",
  jsonBaseUrl: "ASTROLOGY_API_BASE_URL",
  chatBaseUrl: "ASTROLOGYAPI_CHAT_BASE_URL",
  userId: "ASTROLOGYAPI_USER_ID",
  password: "ASTROLOGYAPI_PASSWORD",
} as const;

const processValue = (name: string) =>
  typeof process === "undefined" ? "" : safeString(process.env?.[name]);

const resolveOptionalSecret = async (env: RuntimeEnv, name: string) =>
  (await resolveSecretBinding(env, name)) || processValue(name);

export const resolveAstrologyApiKey = async (env: RuntimeEnv) => {
  const key =
    (await resolveSecretBinding(env, astrologyApiRuntimeNames.apiKey)) ||
    processValue(astrologyApiRuntimeNames.apiKey);
  if (!key) throw new Error("AstrologyAPI token is not configured.");
  return key;
};

export const resolveAstrologyApiBaseUrl = async (env: RuntimeEnv) => {
  const configured =
    (await getRuntimeConfigValue(env, astrologyApiRuntimeNames.jsonBaseUrl)) ||
    processValue(astrologyApiRuntimeNames.jsonBaseUrl);
  const value = safeString(configured).replace(/\/+$/, "");
  if (!value) throw new Error("ASTROLOGY_API_BASE_URL is not configured.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("ASTROLOGY_API_BASE_URL is invalid.");
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("ASTROLOGY_API_BASE_URL must use HTTPS.");
  }
  return value;
};

export const resolveAstrologyApiRequestHeaders = async (
  env: RuntimeEnv,
): Promise<Record<string, string>> => {
  const [userId, password] = await Promise.all([
    resolveOptionalSecret(env, astrologyApiRuntimeNames.userId),
    resolveOptionalSecret(env, astrologyApiRuntimeNames.password),
  ]);
  if (userId && password) {
    return { authorization: `Basic ${btoa(`${userId}:${password}`)}` };
  }
  return { "x-astrologyapi-key": await resolveAstrologyApiKey(env) };
};

export const resolveAstrologyJsonRequestConfig = async (env: RuntimeEnv) => ({
  baseUrl: await resolveAstrologyApiBaseUrl(env),
  headers: await resolveAstrologyApiRequestHeaders(env),
});

export const joinAstrologyApiUrl = (baseUrl: string, endpoint: string) => {
  const base = baseUrl.replace(/\/+$/, "");
  const path = `/${endpoint.replace(/^\/+/, "")}`;
  return base.endsWith("/v1") && path.startsWith("/v1/")
    ? `${base}${path.slice(3)}`
    : `${base}${path}`;
};

export const astrologyProviderMessage = (fallback: string, payload: unknown) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return fallback;
  const body = payload as Record<string, unknown>;
  const message = safeString(body.message) || safeString(body.msg) || safeString(body.error);
  if (!message || /token|authorization|credential|secret|worker\.js|typeerror/i.test(message)) {
    return fallback;
  }
  return message.replace(/\s+/g, " ").slice(0, 240);
};
