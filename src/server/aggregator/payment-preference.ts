import { AP_TABLES } from "./db/tables.ts";
import type { RuntimeEnv } from "./runtime.ts";

export type PaymentPreference = "USD" | "INR" | "AUTO";
export type PaymentCurrency = "USD" | "INR";
export const paymentPreferences = ["USD", "INR", "AUTO"] as const;
export const paymentPreferenceKey = "payment_preference";

export class PaymentPreferenceError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
export const isPaymentPreference = (value: unknown): value is PaymentPreference =>
  typeof value === "string" && paymentPreferences.includes(value as PaymentPreference);
export const resolvePaymentCurrency = (preference: PaymentPreference, country?: unknown): PaymentCurrency =>
  preference === "AUTO" ? (typeof country === "string" && country.toUpperCase() === "IN" ? "INR" : "USD") : preference;
export const providerForPaymentCurrency = (currency: PaymentCurrency) => currency === "INR" ? "razorpay" as const : "stripe" as const;

type Row = { value_json: string; updated_at: string };
const parse = (row: Row | null) => {
  if (!row) throw new PaymentPreferenceError(503, "PAYMENT_SETTINGS_UNAVAILABLE", "Apply the payment currency migration before using payments.");
  let value: Record<string, unknown> | undefined;
  try { value = JSON.parse(row.value_json); } catch { /* fail below */ }
  if (!value || value.schemaVersion !== 1 || !isPaymentPreference(value.value) || !Number.isSafeInteger(value.revision) || Number(value.revision) < 1)
    throw new PaymentPreferenceError(503, "PAYMENT_SETTINGS_UNAVAILABLE", "Stored payment preference is invalid.");
  return { payment_preference: value.value, revision: Number(value.revision), updatedAt: row.updated_at };
};
export const readPaymentPreference = async (env: RuntimeEnv) => {
  if (!env.DB) throw new PaymentPreferenceError(503, "PAYMENT_SETTINGS_UNAVAILABLE", "Payment settings storage is unavailable.");
  return parse((await env.DB.prepare(`SELECT value_json, updated_at FROM ${AP_TABLES.businessSettings} WHERE key = ? LIMIT 1`).bind(paymentPreferenceKey).first?.()) as Row | null ?? null);
};
export const updatePaymentPreference = async (env: RuntimeEnv, input: unknown) => {
  const body = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  if (Object.keys(body).some((key) => !["payment_preference", "expectedRevision"].includes(key)) || !isPaymentPreference(body.payment_preference) || !Number.isSafeInteger(body.expectedRevision) || Number(body.expectedRevision) < 1)
    throw new PaymentPreferenceError(400, "PAYMENT_INVALID_INPUT", "Use USD, INR or AUTO and a valid expectedRevision; other fields are not supported.");
  const current = await readPaymentPreference(env);
  if (current.revision !== body.expectedRevision) throw new PaymentPreferenceError(409, "PAYMENT_REVISION_CONFLICT", "Reload the current preference before saving.");
  const value = JSON.stringify({ value: body.payment_preference, schemaVersion: 1, revision: current.revision + 1 });
  const row = (await env.DB!.prepare(`UPDATE ${AP_TABLES.businessSettings} SET value_json = ?, updated_at = ? WHERE key = ? AND json_extract(value_json, '$.revision') = ? RETURNING value_json, updated_at`).bind(value, new Date().toISOString(), paymentPreferenceKey, current.revision).first?.()) as Row | null | undefined;
  if (!row) throw new PaymentPreferenceError(409, "PAYMENT_REVISION_CONFLICT", "Reload the current preference before saving.");
  return parse(row);
};
