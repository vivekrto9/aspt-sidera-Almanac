import tzlookup from "tz-lookup";
import {
  platformGooglePlacesSecretBinding,
  resolveSecretBinding,
} from "../runtime-bindings.ts";

type RuntimeEnv = Record<string, unknown>;

export const placesFeature = "astropages.platform-places";
export const placesCapabilityKey = "capability-content-seo-localization";
export const placesMissingSecretNames = [
  platformGooglePlacesSecretBinding,
  "GOOGLE_PLACES_API_KEY",
];

export const normalizePlacesInput = (value: string | null) =>
  String(value ?? "").trim().slice(0, 120);

export const normalizeSessionToken = (value: string | null) =>
  String(value ?? "").trim().slice(0, 128);

export const normalizePlacesLanguage = (value: string | null) =>
  normalizePlacesInput(value).slice(0, 16) || "en";

export const getGooglePlacesApiKey = async (env: RuntimeEnv) =>
  resolveSecretBinding(env, platformGooglePlacesSecretBinding);

const getTimezoneInstant = (date: string | null, time: string | null) => {
  if (!date) return new Date();
  const normalizedTime = /^(\d{2}):(\d{2})$/.test(time ?? "") ? time : "00:00";
  const instant = new Date(`${date}T${normalizedTime}:00Z`);
  return Number.isNaN(instant.getTime()) ? new Date() : instant;
};

const getTimezoneOffset = (timezone: string, instant: Date) => {
  try {
    const offsetName = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value;

    if (offsetName) {
      return offsetName === "GMT" ? "UTC+00:00" : offsetName.replace("GMT", "UTC");
    }
  } catch {
    // Some local runtimes reject longOffset for otherwise valid IANA zones.
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const localAsUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour") % 24,
    value("minute"),
    value("second"),
  );
  const offsetMinutes = Math.round((localAsUtc - instant.getTime()) / 60_000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, "0");
  const minutes = String(absoluteMinutes % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
};

export const mapCoordinatesToTimezone = ({
  lat,
  lon,
  date,
  time,
}: {
  lat: number;
  lon: number;
  date: string | null;
  time: string | null;
}) => {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    throw new Error("Coordinates are invalid.");
  }

  const timezone = tzlookup(lat, lon);
  return {
    timezone,
    offset: getTimezoneOffset(timezone, getTimezoneInstant(date, time)),
  };
};

const pickText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const mapGooglePlacePrediction = (prediction: Record<string, unknown>) => {
  const formatting =
    prediction.structured_formatting &&
    typeof prediction.structured_formatting === "object"
      ? (prediction.structured_formatting as Record<string, unknown>)
      : {};

  return {
    placeId: pickText(prediction.place_id),
    description: pickText(prediction.description),
    mainText: pickText(formatting.main_text),
    secondaryText: pickText(formatting.secondary_text),
  };
};

export const mapGooglePlaceDetails = ({
  result,
  date,
  time,
}: {
  result: Record<string, unknown>;
  date: string | null;
  time: string | null;
}) => {
  const geometry =
    result.geometry && typeof result.geometry === "object"
      ? (result.geometry as Record<string, unknown>)
      : {};
  const location =
    geometry.location && typeof geometry.location === "object"
      ? (geometry.location as Record<string, unknown>)
      : {};
  const lat = Number(location.lat);
  const lon = Number(location.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Place details did not include coordinates.");
  }

  const { timezone, offset } = mapCoordinatesToTimezone({ lat, lon, date, time });
  return {
    placeId: pickText(result.place_id),
    formattedAddress: pickText(result.formatted_address),
    lat,
    lon,
    timezone,
    offset,
  };
};
