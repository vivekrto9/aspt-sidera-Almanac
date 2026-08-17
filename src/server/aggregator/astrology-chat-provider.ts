import { getRuntimeConfigValue } from "./runtime-config.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";
import {
  astrologyProviderMessage,
  resolveAstrologyApiKey,
} from "./astrology-api-config.ts";
import type { CustomerUserProfile } from "./customer-profiles.ts";

const defaultChatBaseUrl = ["https://json-chat", "astrologyapi", "com"].join(".");
const legacyChatHostname = "api.astrologyapi.com";
const normalizeConfiguredBaseUrl = (value: unknown) =>
  safeString(value).replace(/\/+$/, "");

const isLegacyChatBaseUrl = (parsed: URL) => {
  const host = parsed.hostname.toLowerCase();
  return host === legacyChatHostname || host.endsWith(`.${legacyChatHostname}`);
};

const resolveChatBaseUrl = async (env: RuntimeEnv) => {
  const configured = normalizeConfiguredBaseUrl(
    await getRuntimeConfigValue(env, "ASTROLOGYAPI_CHAT_BASE_URL"),
  );
  if (!configured) return defaultChatBaseUrl;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return defaultChatBaseUrl;
    }
    if (isLegacyChatBaseUrl(parsed)) {
      return defaultChatBaseUrl;
    }
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return defaultChatBaseUrl;
  }
};
const parseTimezoneHours = (offset: string) => {
  const match = safeString(offset)
    .toUpperCase()
    .match(/^(?:UTC)?([+-])(\d{2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  if (hours > 14 || minutes > 59) return null;
  return (match[1] === "-" ? -1 : 1) * (hours + minutes / 60);
};

const providerData = (profile: CustomerUserProfile) => {
  const date = profile.birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const time = profile.birthTime.match(/^(\d{2}):(\d{2})/);
  const timezone = parseTimezoneHours(profile.timezoneOffset);
  if (
    !date ||
    !time ||
    timezone === null ||
    !Number.isFinite(profile.placeLat) ||
    !Number.isFinite(profile.placeLon)
  ) {
    return null;
  }
  return {
    language: "en",
    name: profile.profileName,
    day: Number(date[3]),
    month: Number(date[2]),
    year: Number(date[1]),
    hour: Number(time[1]),
    min: Number(time[2]),
    minute: Number(time[2]),
    place: profile.birthPlace,
    lat: String(profile.placeLat),
    lon: String(profile.placeLon),
    tzone: String(timezone),
    country: profile.birthPlace.split(",").at(-1)?.trim() || "",
  };
};

const westernProfileLine = (
  label: string,
  profile: CustomerUserProfile,
) => {
  const data = providerData(profile);
  if (!data) return "";
  return `${label}: ${profile.profileName || "Person"}; birth date ${profile.birthDate}; birth time ${profile.birthTime}; birth place ${profile.birthPlace}; latitude ${data.lat}; longitude ${data.lon}; timezone UTC${Number(data.tzone) >= 0 ? "+" : ""}${data.tzone}.`;
};

const parseObject = (value: unknown) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const providerAnswer = (body: Record<string, unknown>) => {
  const result = parseObject(body.result);
  const response = parseObject(body.response);
  const data = parseObject(body.data);
  return (
    safeString(body.answer) ||
    safeString(body.message) ||
    safeString(body.response) ||
    safeString(data.answer) ||
    safeString(data.message) ||
    safeString(result.answer) ||
    safeString(result.message) ||
    safeString(response.answer) ||
    safeString(response.message) ||
    safeString(response.response) ||
    safeString(data.response) ||
    safeString(data.output) ||
    safeString(data.text)
  );
};

const parseProviderFlag = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "ok" ||
      normalized === "success"
    );
  }
  return false;
};

const providerTransportDetails = (error: unknown) => {
  const errorObject = parseObject(error);
  const cause = parseObject(errorObject.cause);
  const code = safeString(cause.code) || safeString(errorObject.code);
  const name = safeString(errorObject.name);
  return {
    providerErrorCode: code || undefined,
    providerErrorName: name || undefined,
  };
};

const hasProviderSuccess = (body: Record<string, unknown>) => {
  const result = parseObject(body.result);
  const response = parseObject(body.response);
  const data = parseObject(body.data);
  return (
    parseProviderFlag(body.status) ||
    parseProviderFlag(body.success) ||
    parseProviderFlag(result.status) ||
    parseProviderFlag(result.success) ||
    parseProviderFlag(response.status) ||
    parseProviderFlag(response.success) ||
    parseProviderFlag(data.status) ||
    parseProviderFlag(data.success)
  );
};

export const callAstrologyChatProvider = async ({
  env,
  profile,
  partnerProfile,
  sessionId,
  message,
  fetcher = fetch,
}: {
  env: RuntimeEnv;
  profile: CustomerUserProfile;
  partnerProfile?: CustomerUserProfile | null;
  sessionId: string;
  message: string;
  fetcher?: typeof fetch;
}) => {
  let apiKey = "";
  try {
    apiKey = await resolveAstrologyApiKey(env);
  } catch {
    apiKey = "";
  }
  if (!apiKey) {
    return {
      ok: false as const,
      reason: "missing-provider" as const,
      message: "Astrology chat provider is not configured.",
      missingSecretNames: ["X_ASTROLOGYAPI_KEY"],
    };
  }
  const resolvedChatBaseUrl = await resolveChatBaseUrl(env);
  const baseUrl = new URL(resolvedChatBaseUrl);
  const data = providerData(profile);
  if (!data) {
    return {
      ok: false as const,
      reason: "invalid-profile" as const,
      message: "Birth profile needs a valid date, time, place, and timezone.",
    };
  }
  const partnerLine = partnerProfile
    ? westernProfileLine("Profile B", partnerProfile)
    : "";
  if (partnerProfile && !partnerLine) {
    return {
      ok: false as const,
      reason: "invalid-profile" as const,
      message: "Both birth profiles need a valid date, time, place, and timezone.",
    };
  }
  const providerQuestion = partnerProfile
    ? [
        "Use Western astrology, the tropical zodiac, and synastry to answer using both saved birth profiles.",
        westernProfileLine("Profile A", profile),
        partnerLine,
        "Do not ask for birth details and do not use Vedic matching principles.",
        `Customer question: ${message}`,
      ].join("\n")
    : message;
  const endpoint = baseUrl.pathname.endsWith("/api/chat")
    ? baseUrl.toString()
    : new URL(
        `${baseUrl.pathname.replace(/\/+$/, "")}/api/chat`,
        baseUrl,
      ).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  let providerErrorPhase = "request";
  try {
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: {
        "accept-language": "en",
        "content-type": "application/json",
        "x-astrologyapi-key": apiKey,
      },
      body: JSON.stringify({
        pd: data,
        ap: "DEFAULT",
        sid: partnerProfile ? `${sessionId}-western-match` : sessionId,
        ac: "WESTERN",
        q: providerQuestion,
        ep: "STANDARD",
      }),
      signal: controller.signal,
    });
    providerErrorPhase = "response-json";
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    providerErrorPhase = "response-parse";
    const answer = providerAnswer(body);
    const providerStatus = hasProviderSuccess(body);
    const providerStatusCode = response.status;
    const providerMessage = astrologyProviderMessage(
      "The astrologer could not reply right now. Please try again.",
      {
        ...body,
        status: providerStatus ? true : response.status,
        message:
          safeString(body.message) ||
          safeString(body.error) ||
          safeString(parseObject(body.data).message),
      },
    );
    if (!response.ok || (!providerStatus && !answer)) {
      return {
        ok: false as const,
        reason: "provider-error" as const,
        message:
          providerMessage ||
          "The astrologer could not reply right now. Please try again.",
        providerStatusCode,
      };
    }
    return {
      ok: true as const,
      answer: answer.slice(0, 12_000),
      providerStatusCode: response.status,
    };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "AbortError";
    return {
      ok: false as const,
      reason: timedOut ? ("provider-timeout" as const) : ("provider-error" as const),
      message: timedOut
        ? "The astrologer is taking longer than usual. Please try again."
        : "The astrologer could not reply right now. Please try again.",
      providerErrorPhase,
      ...providerTransportDetails(error),
    };
  } finally {
    clearTimeout(timeout);
  }
};
