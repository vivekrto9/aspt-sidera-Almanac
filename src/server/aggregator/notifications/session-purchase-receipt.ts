import { AP_TABLES as tables } from "../db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "../runtime.ts";
import { sendManagedEmailTemplate } from "./email-template-store.ts";

type SessionReceipt = {
  id: string;
  accountId: string;
  astrologerSlug: string;
  sessionType: "chat" | "written";
  durationMinutes: number | null;
  amountCents: number;
  currency: string;
};

export const sendSessionPurchaseReceipt = async ({
  env,
  entitlement,
  siteOrigin,
  fetch,
}: {
  env: RuntimeEnv;
  entitlement: SessionReceipt;
  siteOrigin: string;
  fetch?: typeof globalThis.fetch;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      skipped: true as const,
      message: "Receipt storage is unavailable.",
    };
  try {
    const [customer, astrologer] = await Promise.all([
      env.DB.prepare(
        `SELECT email, display_name FROM ${tables.customerAccounts} WHERE id = ? LIMIT 1`,
      )
        .bind(entitlement.accountId)
        .first?.() as
        | Promise<{ email?: string; display_name?: string } | null>
        | undefined,
      env.DB.prepare("SELECT name FROM ap_astrologers WHERE slug = ? LIMIT 1")
        .bind(entitlement.astrologerSlug)
        .first?.() as Promise<{ name?: string } | null> | undefined,
    ]);
    if (!customer?.email)
      return {
        ok: false as const,
        skipped: true as const,
        message: "Receipt recipient was not found.",
      };
    const eventType = "session.payment_paid";
    const now = nowIso();
    const existing = (await env.DB.prepare(
      `SELECT status FROM ${tables.sessionEntitlementNotifications} WHERE entitlement_id = ? AND event_type = ? LIMIT 1`,
    )
      .bind(entitlement.id, eventType)
      .first?.()) as { status?: string } | null | undefined;
    if (existing?.status === "sent" || existing?.status === "sending")
      return { ok: true as const, skipped: true as const };
    const claim = existing
      ? await env.DB.prepare(
          `UPDATE ${tables.sessionEntitlementNotifications} SET status = 'sending', last_error = NULL, updated_at = ? WHERE entitlement_id = ? AND event_type = ? AND status = 'failed'`,
        )
          .bind(now, entitlement.id, eventType)
          .run?.()
      : await env.DB.prepare(
          `INSERT INTO ${tables.sessionEntitlementNotifications} (id, entitlement_id, event_type, status, created_at, updated_at) VALUES (?, ?, ?, 'sending', ?, ?) ON CONFLICT(entitlement_id, event_type) DO NOTHING`,
        )
          .bind(createId("snot"), entitlement.id, eventType, now, now)
          .run?.();
    const resultMeta = claim as
      | { meta?: { changes?: number }; changes?: number }
      | undefined;
    if (Number(resultMeta?.meta?.changes ?? resultMeta?.changes ?? 0) === 0)
      return { ok: true as const, skipped: true as const };
    const sessionDescription =
      entitlement.sessionType === "written"
        ? "a written astrology question"
        : `a ${entitlement.durationMinutes}-minute astrology chat`;
    const sessionTotal = new Intl.NumberFormat("en", {
      style: "currency",
      currency: entitlement.currency,
    }).format(entitlement.amountCents / 100);
    let delivery: Awaited<ReturnType<typeof sendManagedEmailTemplate>>;
    try {
      delivery = await sendManagedEmailTemplate({
        env,
        key: "session_payment_paid_customer_en",
        recipient: String(customer.email),
        payload: {
          customerName: safeString(customer.display_name) || "Sidera customer",
          sessionDescription,
          astrologerName:
            safeString(astrologer?.name) || entitlement.astrologerSlug,
          sessionTotal,
          sessionsUrl: `${safeString(siteOrigin).replace(/\/$/, "")}/account`,
          supportFooter: "For support, reply to this email.",
        },
        tags: ["session_payment_paid", entitlement.id],
        fetch,
      });
    } catch (error) {
      delivery = {
        ok: false as const,
        message:
          error instanceof Error ? error.message : "Receipt delivery failed.",
      };
    }
    const completedAt = nowIso();
    if (delivery.ok) {
      await env.DB.prepare(
        `UPDATE ${tables.sessionEntitlementNotifications} SET status = 'sent', provider_message_id = ?, last_error = NULL, sent_at = ?, updated_at = ? WHERE entitlement_id = ? AND event_type = ?`,
      )
        .bind(
          delivery.providerMessageId,
          completedAt,
          completedAt,
          entitlement.id,
          eventType,
        )
        .run?.();
    } else {
      await env.DB.prepare(
        `UPDATE ${tables.sessionEntitlementNotifications} SET status = 'failed', last_error = ?, updated_at = ? WHERE entitlement_id = ? AND event_type = ?`,
      )
        .bind(
          delivery.message.slice(0, 500),
          completedAt,
          entitlement.id,
          eventType,
        )
        .run?.();
    }
    return delivery;
  } catch (error) {
    return {
      ok: false as const,
      skipped: true as const,
      message:
        error instanceof Error ? error.message : "Session receipt was skipped.",
    };
  }
};
