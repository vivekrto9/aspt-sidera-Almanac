import { getRuntimeConfigValue } from "./runtime-config.ts";
import { resolveSecretBinding } from "./runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

export const transitEngineRuntimeNames = {
  baseUrl: "TRANSIT_CALC_BASE_URL",
  userId: "ASTROLOGYAPI_USER_ID",
  password: "ASTROLOGYAPI_PASSWORD",
} as const;

const processValue = (name: string) =>
  typeof process === "undefined" ? "" : safeString(process.env?.[name]);

const resolveTransitEngineBaseUrl = async (env: RuntimeEnv) => {
  const configured =
    (await getRuntimeConfigValue(env, transitEngineRuntimeNames.baseUrl)) ||
    processValue(transitEngineRuntimeNames.baseUrl);
  const value = safeString(configured).replace(/\/+$/, "");
  if (!value) throw new Error("Transit Engine base URL is not configured.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Transit Engine base URL is invalid.");
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Transit Engine base URL must use HTTPS.");
  }
  return value;
};

const resolveCredential = async (
  env: RuntimeEnv,
  name: typeof transitEngineRuntimeNames.userId | typeof transitEngineRuntimeNames.password,
) =>
  (await resolveSecretBinding(env, name)) || processValue(name);

export const resolveTransitEngineRequestConfig = async (env: RuntimeEnv) => {
  const [baseUrl, userId, password] = await Promise.all([
    resolveTransitEngineBaseUrl(env),
    resolveCredential(env, transitEngineRuntimeNames.userId),
    resolveCredential(env, transitEngineRuntimeNames.password),
  ]);
  if (!userId || !password) {
    throw new Error("Transit Engine credentials are not configured.");
  }
  return {
    baseUrl,
    authorization: ["Basic", btoa(`${userId}:${password}`)].join(" "),
  };
};

export const joinTransitEngineUrl = (baseUrl: string, endpoint: string) =>
  `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
