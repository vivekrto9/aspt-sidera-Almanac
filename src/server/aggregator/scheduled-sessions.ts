import {
  createCalendlyInvitee,
  listCalendlyAvailability,
  sha256Hex,
  validateCalendlyEventType,
  verifyCalendlySignature,
} from "./calendly-provider.ts";
import { getAstrologerBySlug } from "./astrologer-directory.ts";
import { getCustomerUserProfile } from "./customer-profiles.ts";
import { AP_TABLES as tables } from "./db/tables.ts";
import { resolveSecretBinding } from "./runtime-bindings.ts";
import { getRuntimeConfigValue } from "./runtime-config.ts";
import { getSessionEntitlement } from "./session-entitlements.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

type Row = Record<string, unknown>;
type RunResult = { meta?: { changes?: number }; changes?: number } | undefined;
const first = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return null;
  return (
    (await (
      env.DB.prepare(sql).bind(...values) as {
        first?: () => Promise<Row | null>;
      }
    ).first?.()) ?? null
  );
};
const all = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return [];
  return (
    (
      await (
        env.DB.prepare(sql).bind(...values) as {
          all?: () => Promise<{ results?: Row[] }>;
        }
      ).all?.()
    )?.results ?? []
  );
};
const run = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return undefined;
  return (await env.DB.prepare(sql)
    .bind(...values)
    .run?.()) as RunResult;
};
const changed = (result: RunResult) =>
  Number(result?.meta?.changes ?? result?.changes ?? 0) > 0;
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const bookingFromRow = (row: Row) => ({
  id: String(row.id),
  accountId: String(row.account_id),
  entitlementId: String(row.entitlement_id),
  profileId: String(row.profile_id),
  astrologerSlug: String(row.astrologer_slug),
  astrologerName: safeString(row.astrologer_name),
  astrologerImage: safeString(row.astrologer_image),
  profileName: safeString(row.profile_name),
  status: String(row.status),
  durationMinutes: Number(row.duration_minutes),
  requestedStartAt: String(row.requested_start_at),
  scheduledStartAt: safeString(row.scheduled_start_at),
  scheduledEndAt: safeString(row.scheduled_end_at),
  inviteeTimezone: String(row.invitee_timezone),
  cancelUrl: safeString(row.calendly_cancel_url),
  rescheduleUrl: safeString(row.calendly_reschedule_url),
  meetingUrl: safeString(row.calendly_meeting_url),
  schedulingLastError: safeString(row.scheduling_last_error),
  updatedAt: String(row.updated_at),
});
const bookingSelect = `SELECT booking.*, astrologer.name AS astrologer_name,
  astrologer.image_url AS astrologer_image, profile.profile_name
  FROM ${tables.scheduledSessions} booking
  JOIN ap_astrologers astrologer ON astrologer.slug = booking.astrologer_slug
  JOIN ${tables.customerUserProfiles} profile ON profile.id = booking.profile_id`;

const getMapping = async (
  env: RuntimeEnv,
  astrologerSlug: string,
  durationMinutes: number,
) => {
  const row = await first(
    env,
    `SELECT event_type_uri FROM ${tables.astrologerCalendlyEventTypes}
    WHERE astrologer_slug = ? AND duration_minutes = ? AND active = 1 LIMIT 1`,
    [astrologerSlug, durationMinutes],
  );
  if (row) return row;
  if (![15, 30, 45, 60].includes(durationMinutes)) return null;
  const key = `CALENDLY_${durationMinutes}_MIN_EVENT_TYPE_URI` as
    | "CALENDLY_15_MIN_EVENT_TYPE_URI"
    | "CALENDLY_30_MIN_EVENT_TYPE_URI"
    | "CALENDLY_45_MIN_EVENT_TYPE_URI"
    | "CALENDLY_60_MIN_EVENT_TYPE_URI";
  const eventTypeUri = await getRuntimeConfigValue(env, key);
  return eventTypeUri ? { event_type_uri: eventTypeUri } : null;
};

export const listScheduledAvailability = async ({
  env,
  astrologerSlug,
  durationMinutes,
  startAt,
  days = 7,
  fetcher,
}: {
  env: RuntimeEnv;
  astrologerSlug: string;
  durationMinutes: number;
  startAt: string;
  days?: number;
  fetcher?: typeof fetch;
}) => {
  const start = new Date(startAt);
  const safeDays = Math.max(1, Math.min(31, Math.floor(days)));
  if (
    !Number.isFinite(start.getTime()) ||
    ![15, 30, 45, 60].includes(durationMinutes)
  ) {
    return {
      ok: false as const,
      status: 400,
      message: "A valid start and session duration are required.",
    };
  }
  const [astrologer, mapping] = await Promise.all([
    getAstrologerBySlug(env, astrologerSlug),
    getMapping(env, astrologerSlug, durationMinutes),
  ]);
  if (!astrologer || astrologer.availability === "offline")
    return {
      ok: false as const,
      status: 404,
      message: "Selected astrologer is unavailable.",
    };
  if (!mapping)
    return {
      ok: false as const,
      status: 503,
      reason: "missing-mapping" as const,
      message:
        "Calendly availability is not configured for this astrologer and duration.",
    };
  const eventTypeUri = safeString(mapping.event_type_uri);
  const validation = await validateCalendlyEventType({
    env,
    eventTypeUri,
    durationMinutes,
    fetcher,
  });
  if (!validation.ok) return validation;
  const result = await listCalendlyAvailability({
    env,
    eventTypeUri,
    startAt: start.toISOString(),
    endAt: new Date(start.getTime() + safeDays * 86_400_000).toISOString(),
    fetcher,
  });
  if (!result.ok) return result;
  return {
    ok: true as const,
    durationMinutes,
    slots: result.slots.map((slot) => ({
      startAt: slot.startAt,
      endAt: new Date(
        new Date(slot.startAt).getTime() + durationMinutes * 60_000,
      ).toISOString(),
    })),
  };
};

export const getScheduledSession = async (
  env: RuntimeEnv,
  accountId: string,
  bookingId: string,
) => {
  const row = await first(
    env,
    `${bookingSelect} WHERE booking.account_id = ? AND booking.id = ? LIMIT 1`,
    [accountId, bookingId],
  );
  return row ? bookingFromRow(row) : null;
};

export const listScheduledSessions = async (
  env: RuntimeEnv,
  accountId: string,
) =>
  (
    await all(
      env,
      `${bookingSelect} WHERE booking.account_id = ? ORDER BY booking.updated_at DESC`,
      [accountId],
    )
  ).map(bookingFromRow);

export const createScheduledSession = async ({
  env,
  accountId,
  customerName,
  customerEmail,
  entitlementId,
  profileId,
  astrologerSlug,
  startAt,
  timezone,
  fetcher,
}: {
  env: RuntimeEnv;
  accountId: string;
  customerName: string;
  customerEmail: string;
  entitlementId: string;
  profileId: string;
  astrologerSlug: string;
  startAt: string;
  timezone: string;
  fetcher?: typeof fetch;
}) => {
  const existing = await first(
    env,
    `SELECT id FROM ${tables.scheduledSessions} WHERE account_id = ? AND entitlement_id = ? LIMIT 1`,
    [accountId, entitlementId],
  );
  if (existing)
    return {
      ok: true as const,
      replay: true,
      booking: await getScheduledSession(env, accountId, String(existing.id)),
    };
  const [entitlement, profile] = await Promise.all([
    getSessionEntitlement(env, entitlementId, accountId),
    getCustomerUserProfile(env, accountId, profileId),
  ]);
  if (
    !entitlement ||
    entitlement.status !== "paid" ||
    entitlement.sessionType !== "chat" ||
    entitlement.deliveryMode !== "scheduled"
  )
    return {
      ok: false as const,
      status: 409,
      message: "A paid unused scheduled-chat entitlement is required.",
    };
  if (!profile)
    return {
      ok: false as const,
      status: 404,
      message: "Birth profile was not found.",
    };
  const mapping = await getMapping(
    env,
    astrologerSlug,
    entitlement.durationMinutes || 0,
  );
  if (entitlement.astrologerSlug !== astrologerSlug || !mapping)
    return {
      ok: false as const,
      status: 409,
      message:
        "Paid session and Calendly mapping do not match this astrologer.",
    };
  const requested = new Date(startAt);
  if (
    !Number.isFinite(requested.getTime()) ||
    requested.getTime() <= Date.now() ||
    !safeString(timezone)
  )
    return {
      ok: false as const,
      status: 400,
      message: "A future Calendly time and timezone are required.",
    };
  const availability = await listScheduledAvailability({
    env,
    astrologerSlug,
    durationMinutes: entitlement.durationMinutes || 0,
    startAt: requested.toISOString(),
    days: 1,
    fetcher,
  });
  if (!availability.ok) return availability;
  if (
    !availability.slots.some((slot) => slot.startAt === requested.toISOString())
  )
    return {
      ok: false as const,
      status: 409,
      message: "That Calendly time is no longer available.",
    };
  const now = nowIso();
  const bookingId = createId("sched");
  const reserved = await run(
    env,
    `UPDATE ${tables.sessionEntitlements} SET status = 'reserved', reserved_at = ?, updated_at = ? WHERE id = ? AND account_id = ? AND status = 'paid'`,
    [now, now, entitlementId, accountId],
  );
  if (!changed(reserved))
    return {
      ok: false as const,
      status: 409,
      message: "Paid session has already been used.",
    };
  await run(
    env,
    `INSERT INTO ${tables.scheduledSessions} (
    id, account_id, entitlement_id, profile_id, astrologer_slug, status,
    duration_minutes, event_type_uri, requested_start_at, invitee_timezone,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, 'scheduling', ?, ?, ?, ?, ?, ?)`,
    [
      bookingId,
      accountId,
      entitlementId,
      profileId,
      astrologerSlug,
      entitlement.durationMinutes,
      safeString(mapping.event_type_uri),
      requested.toISOString(),
      safeString(timezone),
      now,
      now,
    ],
  );
  const provider = await createCalendlyInvitee({
    env,
    eventTypeUri: safeString(mapping.event_type_uri),
    startAt: requested.toISOString(),
    name: customerName || profile.profileName,
    email: customerEmail,
    timezone: safeString(timezone),
    trackingId: bookingId,
    fetcher,
  });
  if (!provider.ok) {
    await run(
      env,
      `UPDATE ${tables.scheduledSessions} SET status = 'action_required', scheduling_last_error = ?, updated_at = ? WHERE id = ?`,
      [provider.message, nowIso(), bookingId],
    );
    return {
      ok: true as const,
      replay: false,
      actionRequired: true,
      booking: await getScheduledSession(env, accountId, bookingId),
    };
  }
  const result = provider.result;
  const endAt =
    result.endAt ||
    new Date(
      requested.getTime() + (entitlement.durationMinutes || 0) * 60_000,
    ).toISOString();
  await run(
    env,
    `UPDATE ${tables.scheduledSessions} SET status = 'scheduled', scheduled_start_at = ?, scheduled_end_at = ?, calendly_event_uri = ?, calendly_invitee_uri = ?, calendly_cancel_url = ?, calendly_reschedule_url = ?, calendly_meeting_url = ?, scheduling_last_error = NULL, updated_at = ? WHERE id = ?`,
    [
      result.startAt,
      endAt,
      result.eventUri || null,
      result.inviteeUri || null,
      result.cancelUrl || null,
      result.rescheduleUrl || null,
      result.meetingUrl || null,
      nowIso(),
      bookingId,
    ],
  );
  return {
    ok: true as const,
    replay: false,
    actionRequired: false,
    booking: await getScheduledSession(env, accountId, bookingId),
  };
};

export const handleCalendlyWebhook = async ({
  env,
  body,
  signatureHeader,
}: {
  env: RuntimeEnv;
  body: string;
  signatureHeader: string;
}) => {
  const signingKey = await resolveSecretBinding(
    env,
    "CALENDLY_WEBHOOK_SIGNING_KEY",
  );
  if (!signingKey)
    return {
      ok: false as const,
      status: 503,
      message: "Calendly webhook signing key is not configured.",
    };
  if (!(await verifyCalendlySignature({ body, signatureHeader, signingKey })))
    return {
      ok: false as const,
      status: 403,
      message: "Invalid Calendly webhook signature.",
    };
  let parsed: Row;
  try {
    parsed = JSON.parse(body) as Row;
  } catch {
    return {
      ok: false as const,
      status: 400,
      message: "Calendly webhook payload is invalid.",
    };
  }
  const eventType = safeString(parsed.event);
  const payload = object(parsed.payload);
  const scheduled = object(payload.scheduled_event);
  const location = object(scheduled.location);
  const trackingId = safeString(object(payload.tracking).utm_content);
  const eventUri = safeString(scheduled.uri);
  const inviteeUri = safeString(payload.uri);
  const booking = trackingId
    ? await first(
        env,
        `SELECT * FROM ${tables.scheduledSessions} WHERE id = ? LIMIT 1`,
        [trackingId],
      )
    : await first(
        env,
        `SELECT * FROM ${tables.scheduledSessions} WHERE calendly_event_uri = ? OR calendly_invitee_uri = ? LIMIT 1`,
        [eventUri, inviteeUri],
      );
  const eventKey = await sha256Hex(body);
  const inserted = await run(
    env,
    `INSERT OR IGNORE INTO ${tables.calendlyEvents} (id, scheduled_session_id, provider_event_key, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      createId("calevt"),
      booking?.id || null,
      eventKey,
      eventType || "unknown",
      body,
      nowIso(),
    ],
  );
  if (
    !changed(inserted) ||
    !booking ||
    !["invitee.created", "invitee.canceled"].includes(eventType)
  )
    return {
      ok: true as const,
      status: 200,
      message: "Calendly webhook ignored or already processed.",
    };
  const cancelled =
    eventType === "invitee.canceled" && payload.rescheduled !== true;
  await run(
    env,
    `UPDATE ${tables.scheduledSessions} SET status = ?, scheduled_start_at = COALESCE(?, scheduled_start_at), scheduled_end_at = COALESCE(?, scheduled_end_at), calendly_event_uri = COALESCE(?, calendly_event_uri), calendly_invitee_uri = COALESCE(?, calendly_invitee_uri), calendly_cancel_url = COALESCE(?, calendly_cancel_url), calendly_reschedule_url = COALESCE(?, calendly_reschedule_url), calendly_meeting_url = COALESCE(?, calendly_meeting_url), updated_at = ? WHERE id = ?`,
    [
      cancelled ? "cancelled" : "scheduled",
      safeString(scheduled.start_time) || null,
      safeString(scheduled.end_time) || null,
      eventUri || null,
      inviteeUri || null,
      safeString(payload.cancel_url) || null,
      safeString(payload.reschedule_url) || null,
      safeString(location.join_url) || safeString(location.url) || null,
      nowIso(),
      booking.id,
    ],
  );
  return {
    ok: true as const,
    status: 200,
    message: "Calendly webhook processed.",
  };
};
