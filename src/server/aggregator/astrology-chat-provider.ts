import { getRuntimeConfigValue } from "./runtime-config.ts";
import { resolveSecretBinding } from "./runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";
import type { CustomerUserProfile } from "./customer-profiles.ts";

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
  return (
    safeString(body.answer) ||
    safeString(body.message) ||
    safeString(result.answer) ||
    safeString(result.message) ||
    safeString(response.answer) ||
    safeString(response.message)
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
  const [apiKey, configuredBaseUrl] = await Promise.all([
    resolveSecretBinding(env, "X_ASTROLOGYAPI_KEY"),
    getRuntimeConfigValue(env, "ASTROLOGYAPI_CHAT_BASE_URL"),
  ]);
  if (!apiKey || !configuredBaseUrl) {
    return {
      ok: false as const,
      reason: "missing-provider" as const,
      message: "Astrology chat provider is not configured.",
      missingSecretNames: !apiKey ? ["X_ASTROLOGYAPI_KEY"] : [],
    };
  }
  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredBaseUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
      throw new Error("invalid protocol");
    }
  } catch {
    return {
      ok: false as const,
      reason: "invalid-provider" as const,
      message: "Astrology chat provider URL is invalid.",
    };
  }
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
    const body = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const answer =
      body.status === true || body.success === true ? providerAnswer(body) : "";
    if (!response.ok || !answer) {
      return {
        ok: false as const,
        reason: "provider-error" as const,
        message: "The astrologer could not reply right now. Please try again.",
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
    };
  } finally {
    clearTimeout(timeout);
  }
};
