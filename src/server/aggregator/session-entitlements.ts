import { getAstrologerBySlug } from "./astrologer-directory.ts";
import { AP_TABLES as tables } from "./db/tables.ts";
import { linkBusinessLead, markLeadConvertedBySourceReference } from "./lead-records.ts";
import { sendSessionPurchaseReceipt } from "./notifications/session-purchase-receipt.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";
import type { StripeSessionPayable } from "./payments/stripe.ts";

type Row = Record<string, unknown>;
type RunResult =
  | { meta?: { changes?: number }; changes?: number }
  | undefined;

const first = async (
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) => {
  if (!env.DB) return null;
  const statement = env.DB.prepare(sql).bind(...values) as {
    first?: () => Promise<Row | null>;
  };
  return (await statement.first?.()) ?? null;
};

const run = async (
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) => {
  if (!env.DB) return undefined;
  return (await env.DB.prepare(sql).bind(...values).run?.()) as RunResult;
};

const changed = (result: RunResult) =>
  Number(result?.meta?.changes ?? result?.changes ?? 0) > 0;

const entitlementFromRow = (row: Row): StripeSessionPayable & {
  status: string;
  requestKey: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string;
  paidAt: string;
  expiresAt: string;
} => ({
  id: String(row.id),
  accountId: String(row.account_id),
  astrologerSlug: String(row.astrologer_slug),
  sessionType: String(row.session_type) as "chat" | "written",
  deliveryMode: String(row.delivery_mode) as "now" | "scheduled",
  durationMinutes:
    row.duration_minutes === null ? null : Number(row.duration_minutes),
  amountCents: Number(row.amount_cents),
  currency: String(row.currency || "USD"),
  status: String(row.status),
  requestKey: String(row.request_key),
  stripeCheckoutSessionId: safeString(row.stripe_checkout_session_id),
  stripePaymentIntentId: safeString(row.stripe_payment_intent_id),
  paidAt: safeString(row.paid_at),
  expiresAt: safeString(row.expires_at),
});

const attemptFromRow = (row: Row) => ({
  id: String(row.id),
  accountId: String(row.account_id),
  payableId: String(row.payable_id),
  providerOrderId: safeString(row.provider_order_id),
  providerPaymentId: safeString(row.provider_payment_id),
  checkoutUrl: safeString(row.provider_checkout_url),
  amountCents: Number(row.amount_cents),
  currency: String(row.currency),
  status: String(row.status),
});

export const getSessionEntitlement = async (
  env: RuntimeEnv,
  entitlementId: string,
  accountId?: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.sessionEntitlements}
     WHERE id = ?${accountId ? " AND account_id = ?" : ""} LIMIT 1`,
    accountId ? [entitlementId, accountId] : [entitlementId],
  );
  return row ? entitlementFromRow(row) : null;
};

export const getSessionPaymentAttempt = async (
  env: RuntimeEnv,
  attemptId: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.paymentAttempts}
     WHERE id = ? AND payable_type = 'session_entitlement' LIMIT 1`,
    [attemptId],
  );
  return row ? attemptFromRow(row) : null;
};

const getLatestAttempt = async (env: RuntimeEnv, entitlementId: string) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.paymentAttempts}
     WHERE payable_type = 'session_entitlement' AND payable_id = ?
     ORDER BY created_at DESC LIMIT 1`,
    [entitlementId],
  );
  return row ? attemptFromRow(row) : null;
};

const parseOffer = ({
  sessionType,
  deliveryMode,
  durationMinutes,
}: {
  sessionType: unknown;
  deliveryMode: unknown;
  durationMinutes: unknown;
}) => {
  const type = safeString(sessionType);
  const delivery = safeString(deliveryMode) || "now";
  if (type !== "chat" && type !== "written") {
    return {
      ok: false as const,
      message: "Session type must be chat or written.",
    };
  }
  if (delivery !== "now" && delivery !== "scheduled") {
    return {
      ok: false as const,
      message: "Delivery mode must be now or scheduled.",
    };
  }
  if (type === "written" && delivery !== "now") {
    return {
      ok: false as const,
      message: "Written questions do not use scheduled appointment slots.",
    };
  }
  const duration = type === "chat" ? Number(durationMinutes) : null;
  if (type === "chat" && ![15, 30, 45, 60].includes(duration ?? 0)) {
    return {
      ok: false as const,
      message: "Chat duration must be 15, 30, 45, or 60 minutes.",
    };
  }
  return {
    ok: true as const,
    sessionType: type,
    deliveryMode: delivery,
    durationMinutes: duration,
  };
};

export const createSessionPaymentTarget = async ({
  env,
  accountId,
  astrologerSlug,
  sessionType,
  deliveryMode,
  durationMinutes,
  requestKey,
}: {
  env: RuntimeEnv;
  accountId: string;
  astrologerSlug: unknown;
  sessionType: unknown;
  deliveryMode: unknown;
  durationMinutes: unknown;
  requestKey: unknown;
}) => {
  if (!env.DB) {
    return {
      ok: false as const,
      status: 500,
      message: "Session payment storage is not available.",
    };
  }
  const key = safeString(requestKey);
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(key)) {
    return {
      ok: false as const,
      status: 400,
      message: "A valid idempotency key is required.",
    };
  }
  const parsed = parseOffer({ sessionType, deliveryMode, durationMinutes });
  if (!parsed.ok) return { ...parsed, status: 400 };
  const slug = safeString(astrologerSlug);
  const astrologer = await getAstrologerBySlug(env, slug);
  if (!astrologer || astrologer.availability === "offline") {
    return {
      ok: false as const,
      status: 404,
      message: "Selected astrologer is unavailable.",
    };
  }
  const existingRow = await first(
    env,
    `SELECT * FROM ${tables.sessionEntitlements}
     WHERE account_id = ? AND request_key = ? LIMIT 1`,
    [accountId, key],
  );
  if (existingRow) {
    const entitlement = entitlementFromRow(existingRow);
    return {
      ok: true as const,
      entitlement,
      attempt: await getLatestAttempt(env, entitlement.id),
      replay: true,
    };
  }

  const rateCents = Math.round(astrologer.rate * 100);
  const amountCents = parsed.sessionType === "written"
    ? 1900
    : rateCents * (parsed.durationMinutes ?? 0);
  if (amountCents <= 0) {
    return {
      ok: false as const,
      status: 409,
      message: "Session pricing is not configured.",
    };
  }

  const now = nowIso();
  const entitlementId = createId("sent");
  const attemptId = createId("pay");
  await run(
    env,
    `INSERT INTO ${tables.sessionEntitlements} (
      id, account_id, astrologer_slug, session_type, delivery_mode,
      duration_minutes, amount_cents, currency, status, request_key,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'USD', 'pending_payment', ?, ?, ?)`,
    [
      entitlementId,
      accountId,
      slug,
      parsed.sessionType,
      parsed.deliveryMode,
      parsed.durationMinutes,
      amountCents,
      key,
      now,
      now,
    ],
  );
  await run(
    env,
    `INSERT INTO ${tables.paymentAttempts} (
      id, account_id, payable_type, payable_id, provider, amount_cents,
      currency, status, idempotency_key, created_at, updated_at
    ) VALUES (?, ?, 'session_entitlement', ?, 'stripe', ?, 'USD',
      'created', ?, ?, ?)`,
    [
      attemptId,
      accountId,
      entitlementId,
      amountCents,
      `session_entitlement:${entitlementId}:stripe:1`,
      now,
      now,
    ],
  );
  const customer = await first(env, `SELECT email, display_name FROM ${tables.customerAccounts} WHERE id = ? LIMIT 1`, [accountId]);
  if (customer) {
    await linkBusinessLead({
      env,
      submission: {
        kind: "consultation",
        source: "consultation_booking",
        formKey: "astrologer_session_checkout",
        pagePath: `/astrologers/${slug}`,
        fullName: safeString(customer.display_name),
        email: safeString(customer.email),
        customerAccountId: accountId,
        sourceReferenceType: "session_entitlement",
        sourceReferenceId: entitlementId,
        details: {
          bookingNumber: entitlementId,
          serviceSlug: slug,
          serviceName: parsed.sessionType === "written" ? "Written astrology question" : `${parsed.durationMinutes}-minute astrology chat`,
          consultationMode: parsed.deliveryMode,
          amountCents,
          currency: "USD",
        },
      },
    });
  }
  return {
    ok: true as const,
    entitlement: (await getSessionEntitlement(env, entitlementId, accountId))!,
    attempt: (await getSessionPaymentAttempt(env, attemptId))!,
    replay: false,
  };
};

export const recordSessionCheckout = async ({
  env,
  entitlementId,
  attemptId,
  sessionId,
  checkoutUrl,
}: {
  env: RuntimeEnv;
  entitlementId: string;
  attemptId: string;
  sessionId: string;
  checkoutUrl: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET provider_order_id = ?, provider_checkout_url = ?,
         status = 'requires_action', updated_at = ?
     WHERE id = ? AND payable_id = ? AND status IN ('created', 'requires_action')`,
    [sessionId, checkoutUrl, now, attemptId, entitlementId],
  );
  await run(
    env,
    `UPDATE ${tables.sessionEntitlements}
     SET stripe_checkout_session_id = ?, updated_at = ?
     WHERE id = ? AND status = 'pending_payment'`,
    [sessionId, now, entitlementId],
  );
};

export const markSessionPaymentFailed = async ({
  env,
  entitlementId,
  attemptId,
  status = "failed",
  eventId,
  sessionId = "",
}: {
  env: RuntimeEnv;
  entitlementId: string;
  attemptId: string;
  status?: "failed" | "expired" | "cancelled";
  eventId?: string;
  sessionId?: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET status = ?, updated_at = ?
     WHERE id = ? AND payable_id = ? AND status <> 'paid'`,
    [status, now, attemptId, entitlementId],
  );
  await run(
    env,
    `UPDATE ${tables.sessionEntitlements}
     SET status = ?, updated_at = ?
     WHERE id = ? AND status = 'pending_payment'`,
    [status === "expired" ? "expired" : "cancelled", now, entitlementId],
  );
  if (eventId) {
    await run(
      env,
      `INSERT INTO ${tables.paymentEvents} (
        id, payable_type, payable_id, provider, provider_event_id,
        status, payload_json, created_at
      ) VALUES (?, 'session_entitlement', ?, 'stripe', ?, ?, ?, ?)
      ON CONFLICT(provider, provider_event_id) DO NOTHING`,
      [
        createId("pevt"),
        entitlementId,
        eventId,
        status === "expired" ? "expired" : "failed",
        JSON.stringify({ sessionId }),
        now,
      ],
    );
  }
};

export const markSessionPaymentPaid = async ({
  env,
  entitlementId,
  attemptId,
  sessionId,
  paymentIntentId,
  eventId,
  eventStatus,
  siteOrigin = "",
  sendReceipt = sendSessionPurchaseReceipt,
}: {
  env: RuntimeEnv;
  entitlementId: string;
  attemptId: string;
  sessionId: string;
  paymentIntentId: string;
  eventId: string;
  eventStatus: "paid" | "browser_verified";
  siteOrigin?: string;
  sendReceipt?: typeof sendSessionPurchaseReceipt;
}) => {
  const entitlement = await getSessionEntitlement(env, entitlementId);
  const attempt = await getSessionPaymentAttempt(env, attemptId);
  if (
    !entitlement ||
    !attempt ||
    attempt.payableId !== entitlement.id ||
    attempt.amountCents !== entitlement.amountCents ||
    attempt.currency.toUpperCase() !== entitlement.currency.toUpperCase() ||
    (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
  ) {
    return { ok: false as const, message: "Payment attempt does not match." };
  }
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET provider_order_id = ?, provider_payment_id = ?, status = 'paid',
         updated_at = ?
     WHERE id = ? AND payable_id = ?`,
    [sessionId, paymentIntentId || sessionId, now, attemptId, entitlementId],
  );
  await run(
    env,
    `UPDATE ${tables.sessionEntitlements}
     SET stripe_checkout_session_id = ?, stripe_payment_intent_id = ?,
         status = CASE WHEN status = 'pending_payment' THEN 'paid' ELSE status END,
         paid_at = COALESCE(paid_at, ?), updated_at = ?
     WHERE id = ?`,
    [sessionId, paymentIntentId || sessionId, now, now, entitlementId],
  );
  const eventResult = await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (
      id, payable_type, payable_id, provider, provider_event_id,
      status, payload_json, created_at
    ) VALUES (?, 'session_entitlement', ?, 'stripe', ?, ?, ?, ?)
    ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      entitlementId,
      eventId,
      eventStatus,
      JSON.stringify({ sessionId }),
      now,
    ],
  );
  const paidEntitlement = await getSessionEntitlement(env, entitlementId);
  await markLeadConvertedBySourceReference({ env, sourceReferenceType: "session_entitlement", sourceReferenceId: entitlementId, conversionReference: entitlementId });
  if (paidEntitlement) await sendReceipt({ env, entitlement: paidEntitlement, siteOrigin });
  return {
    ok: true as const,
    duplicate: !changed(eventResult),
    entitlement: paidEntitlement,
  };
};
