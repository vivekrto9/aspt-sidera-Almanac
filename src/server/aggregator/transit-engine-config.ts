import {
  joinAstrologyApiUrl,
  resolveAstrologyJsonRequestConfig,
} from "./astrology-api-config.ts";
import type { RuntimeEnv } from "./runtime.ts";

export const transitEngineRuntimeNames = {
  baseUrl: "ASTROLOGY_API_BASE_URL",
  apiKey: "X_ASTROLOGYAPI_KEY",
} as const;

export const resolveTransitEngineRequestConfig = async (env: RuntimeEnv) => {
  const { baseUrl, apiKey } = await resolveAstrologyJsonRequestConfig(env);
  return { baseUrl, apiKey };
};

export const joinTransitEngineUrl = (baseUrl: string, endpoint: string) =>
  joinAstrologyApiUrl(baseUrl, endpoint);
