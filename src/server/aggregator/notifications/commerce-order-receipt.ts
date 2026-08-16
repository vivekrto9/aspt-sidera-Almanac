import { AP_TABLES as tables } from "../db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "../runtime.ts";
import { sendManagedEmailTemplate } from "./email-template-store.ts";

type ReceiptOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  currency: string;
  lines: Array<{ productName: string; quantity: number }>;
};

export const sendCommerceOrderReceipt = async ({
  env,
  order,
  siteOrigin,
  fetch,
}: {
  env: RuntimeEnv;
  order: ReceiptOrder;
  siteOrigin: string;
  fetch?: typeof globalThis.fetch;
}) => {
  if (!env.DB) return { ok: false as const, skipped: true as const, message: "Receipt storage is unavailable." };
  const eventType = "commerce.order_paid";
  const now = nowIso();
  const existing = await env.DB.prepare(`SELECT status FROM ${tables.commerceOrderNotifications} WHERE order_id = ? AND event_type = ? LIMIT 1`).bind(order.id, eventType).first?.() as { status?: string } | null | undefined;
  if (existing?.status === "sent" || existing?.status === "sending") {
    return { ok: true as const, skipped: true as const };
  }
  let claim: unknown;
  if (existing) {
    claim = await env.DB.prepare(`UPDATE ${tables.commerceOrderNotifications} SET status = 'sending', last_error = NULL, updated_at = ? WHERE order_id = ? AND event_type = ? AND status = 'failed'`).bind(now, order.id, eventType).run?.();
  } else {
    claim = await env.DB.prepare(`INSERT INTO ${tables.commerceOrderNotifications} (id, order_id, event_type, status, created_at, updated_at) VALUES (?, ?, ?, 'sending', ?, ?) ON CONFLICT(order_id, event_type) DO NOTHING`).bind(createId("cnot"), order.id, eventType, now, now).run?.();
  }
  const claimResult = claim as { meta?: { changes?: number }; changes?: number } | undefined;
  if (Number(claimResult?.meta?.changes ?? claimResult?.changes ?? 0) === 0) {
    return { ok: true as const, skipped: true as const };
  }
  const accountUrl = `${safeString(siteOrigin).replace(/\/$/, "")}/account#orders`;
  const orderTotal = new Intl.NumberFormat("en", { style: "currency", currency: order.currency }).format(order.totalCents / 100);
  const orderItems = order.lines.map((line) => `${line.productName} × ${line.quantity}`).join(", ");
  let result: Awaited<ReturnType<typeof sendManagedEmailTemplate>>;
  try {
    result = await sendManagedEmailTemplate({
      env,
      key: "commerce_order_paid_customer_en",
      recipient: order.customerEmail,
      payload: {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        orderTotal,
        orderItems,
        accountUrl,
        supportFooter: "For support, reply to this email.",
      },
      tags: ["commerce_order_paid", order.orderNumber],
      fetch,
    });
  } catch (error) {
    result = { ok: false as const, message: error instanceof Error ? error.message : "Receipt delivery failed." };
  }
  const completedAt = nowIso();
  if (result.ok) {
    await env.DB.prepare(`UPDATE ${tables.commerceOrderNotifications} SET status = 'sent', provider_message_id = ?, last_error = NULL, sent_at = ?, updated_at = ? WHERE order_id = ? AND event_type = ?`).bind(result.providerMessageId, completedAt, completedAt, order.id, eventType).run?.();
    return result;
  }
  await env.DB.prepare(`UPDATE ${tables.commerceOrderNotifications} SET status = 'failed', last_error = ?, updated_at = ? WHERE order_id = ? AND event_type = ?`).bind(result.message.slice(0, 500), completedAt, order.id, eventType).run?.();
  return result;
};
