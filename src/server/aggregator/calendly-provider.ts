import { resolveSecretBinding } from "./runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "./runtime.ts";

const eventTypePattern =
  /^https:\/\/api\.calendly\.com\/event_types\/[A-Za-z0-9_-]+$/;
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
const hmacHex = async (key: string, value: string) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(
    await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      new TextEncoder().encode(value),
    ),
  );
};
const equal = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
};
const providerFetch = (env: RuntimeEnv, fetcher?: typeof fetch) =>
  fetcher ||
  (typeof env.fetch === "function" ? (env.fetch as typeof fetch) : fetch);

const tokenFor = async (env: RuntimeEnv) =>
  resolveSecretBinding(env, "CALENDLY_API_TOKEN");

export const validateCalendlyEventType = async ({
  env,
  eventTypeUri,
  durationMinutes,
  fetcher,
}: {
  env: RuntimeEnv;
  eventTypeUri: string;
  durationMinutes: number;
  fetcher?: typeof fetch;
}) => {
  const token = await tokenFor(env);
  if (!token)
    return {
      ok: false as const,
      status: 503,
      reason: "missing-provider" as const,
      message: "Calendly is not configured.",
      missingSecretNames: ["CALENDLY_API_TOKEN"],
    };
  if (!eventTypePattern.test(eventTypeUri))
    return {
      ok: false as const,
      status: 400,
      reason: "invalid-event-type" as const,
      message: "Calendly event type URI is invalid.",
      missingSecretNames: [],
    };
  const response = await providerFetch(env, fetcher)(eventTypeUri, {
    headers: { accept: "application/json", authorization: `Bearer ${token}` },
  });
  const resource = object(
    object(await response.json().catch(() => ({}))).resource,
  );
  if (!response.ok)
    return {
      ok: false as const,
      status: 502,
      reason: "provider-error" as const,
      message: "Calendly event type could not be verified.",
      missingSecretNames: [],
    };
  if (
    resource.active !== true ||
    Number(resource.duration) !== durationMinutes
  ) {
    return {
      ok: false as const,
      status: 409,
      reason: "duration-mismatch" as const,
      message: "Calendly event type is inactive or has the wrong duration.",
      missingSecretNames: [],
    };
  }
  return {
    ok: true as const,
    eventTypeUri: safeString(resource.uri) || eventTypeUri,
  };
};

export const listCalendlyAvailability = async ({
  env,
  eventTypeUri,
  startAt,
  endAt,
  fetcher,
}: {
  env: RuntimeEnv;
  eventTypeUri: string;
  startAt: string;
  endAt: string;
  fetcher?: typeof fetch;
}) => {
  const token = await tokenFor(env);
  if (!token)
    return {
      ok: false as const,
      status: 503,
      reason: "missing-provider" as const,
      message: "Calendly is not configured.",
      missingSecretNames: ["CALENDLY_API_TOKEN"],
      slots: [],
    };
  if (!eventTypePattern.test(eventTypeUri))
    return {
      ok: false as const,
      status: 400,
      reason: "invalid-event-type" as const,
      message: "Calendly event type URI is invalid.",
      missingSecretNames: [],
      slots: [],
    };
  const url = new URL("https://api.calendly.com/event_type_available_times");
  url.searchParams.set("event_type", eventTypeUri);
  url.searchParams.set("start_time", startAt);
  url.searchParams.set("end_time", endAt);
  const response = await providerFetch(env, fetcher)(url, {
    headers: { accept: "application/json", authorization: `Bearer ${token}` },
  });
  const payload = object(await response.json().catch(() => ({})));
  if (!response.ok)
    return {
      ok: false as const,
      status: 502,
      reason: "provider-error" as const,
      message: "Calendly availability could not be loaded.",
      missingSecretNames: [],
      slots: [],
    };
  const collection = Array.isArray(payload.collection)
    ? payload.collection
    : [];
  return {
    ok: true as const,
    slots: collection
      .map((value) => {
        const start = new Date(safeString(object(value).start_time));
        return Number.isFinite(start.getTime())
          ? { startAt: start.toISOString() }
          : null;
      })
      .filter(Boolean) as Array<{ startAt: string }>,
  };
};

export const createCalendlyInvitee = async ({
  env,
  eventTypeUri,
  startAt,
  name,
  email,
  timezone,
  trackingId,
  fetcher,
}: {
  env: RuntimeEnv;
  eventTypeUri: string;
  startAt: string;
  name: string;
  email: string;
  timezone: string;
  trackingId: string;
  fetcher?: typeof fetch;
}) => {
  const token = await tokenFor(env);
  if (!token)
    return {
      ok: false as const,
      status: 503,
      reason: "missing-provider" as const,
      message: "Calendly is not configured.",
      missingSecretNames: ["CALENDLY_API_TOKEN"],
    };
  const response = await providerFetch(env, fetcher)(
    "https://api.calendly.com/invitees",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventTypeUri,
        start_time: startAt,
        invitee: { name, email, timezone },
        tracking: { utm_content: trackingId },
      }),
    },
  );
  const payload = object(await response.json().catch(() => ({})));
  if (!response.ok)
    return {
      ok: false as const,
      status: 502,
      reason: "provider-error" as const,
      message: "Calendly could not create the appointment.",
      missingSecretNames: [],
    };
  const resource = object(payload.resource || payload);
  const event = object(resource.event || resource.scheduled_event);
  const location = object(event.location || resource.location);
  const inviteeUri = safeString(resource.uri);
  return {
    ok: true as const,
    result: {
      inviteeUri,
      eventUri:
        safeString(event.uri) ||
        (inviteeUri.includes("/invitees/")
          ? inviteeUri.slice(0, inviteeUri.indexOf("/invitees/"))
          : ""),
      startAt: safeString(event.start_time) || startAt,
      endAt: safeString(event.end_time),
      cancelUrl: safeString(resource.cancel_url),
      rescheduleUrl: safeString(resource.reschedule_url),
      meetingUrl: safeString(location.join_url) || safeString(location.url),
    },
  };
};

export const verifyCalendlySignature = async ({
  body,
  signatureHeader,
  signingKey,
  nowSeconds = Math.floor(Date.now() / 1000),
}: {
  body: string;
  signatureHeader: string;
  signingKey: string;
  nowSeconds?: number;
}) => {
  const timestamp = Number(signatureHeader.match(/t=([^,]+)/)?.[1]);
  const signature = signatureHeader.match(/v1=([^,]+)/)?.[1] || "";
  if (
    !signingKey ||
    !signature ||
    !Number.isFinite(timestamp) ||
    Math.abs(nowSeconds - timestamp) > 300
  )
    return false;
  return equal(await hmacHex(signingKey, `${timestamp}.${body}`), signature);
};

export const sha256Hex = async (value: string) =>
  toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
