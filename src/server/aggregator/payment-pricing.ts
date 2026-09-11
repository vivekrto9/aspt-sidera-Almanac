import { AP_TABLES as tables } from "./db/tables.ts";
import type { RuntimeEnv } from "./runtime.ts";
import { paymentCountryFromRequest } from "./payment-country.ts";
import { isPaymentPreference, providerForPaymentCurrency, resolvePaymentCurrency, type PaymentCurrency } from "./payment-preference.ts";

const stateKey = Symbol.for("astropages.payment.request");
type State = { request?: Request; context?: Promise<{ currency: PaymentCurrency; revision: number }> };
type ScopedEnv = RuntimeEnv & { [stateKey]?: State };
export const withPaymentRequest = <T extends RuntimeEnv>(env: T, request?: Request): T => ({ ...env, [stateKey]: { request } });
const state = (env: RuntimeEnv) => (env as ScopedEnv)[stateKey];
export const getCurrencyContext = async (env: RuntimeEnv) => {
  const load = async () => {
    if (!env.DB) return { currency: "USD" as const, revision: 0 };
    const row = (await env.DB.prepare(`SELECT value_json FROM ${tables.businessSettings} WHERE key = ?`).bind("payment_preference").first?.()) as { value_json: string } | null | undefined;
    if (!row) throw new Error("Payment currency migration is required.");
    const value = JSON.parse(row.value_json) as Record<string, unknown>;
    if (!isPaymentPreference(value.value) || !Number.isSafeInteger(value.revision)) throw new Error("Payment preference is not configured correctly.");
    const country = paymentCountryFromRequest(state(env)?.request, import.meta.env?.DEV === true);
    return { currency: resolvePaymentCurrency(value.value, country), revision: Number(value.revision) };
  };
  const scoped = state(env);
  return scoped ? scoped.context ??= load() : load();
};
export const selectIndependentPrice = async <T extends Record<string, unknown>>(env: RuntimeEnv, row: T) => {
  const context = await getCurrencyContext(env);
  return selectPriceForCurrency(row, context.currency);
};
export const selectPriceForCurrency = <T extends Record<string,unknown>>(row: T, currency: PaymentCurrency) => {
  const value = row[currency === "INR" ? "price_inr_cents" : "price_usd_cents"];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error(`${currency} pricing is not configured.`);
  return { ...row, price_cents:value, currency };
};
export const paymentProvider = async (env: RuntimeEnv) => providerForPaymentCurrency((await getCurrencyContext(env)).currency);
export const formatMoney = (minor: number, currency: string, locale = "en") => new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: minor % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(minor / 100);
export const getWalletCurrency = async (env: RuntimeEnv, accountId: string): Promise<PaymentCurrency> => {
  if (!env.DB) return (await getCurrencyContext(env)).currency;
  const wallet = (await env.DB.prepare(`SELECT currency,balance_cents,currency_locked_at FROM ${tables.wallets} WHERE account_id=? LIMIT 1`).bind(accountId).first?.()) as Record<string, unknown> | null | undefined;
  if (wallet && (wallet.currency_locked_at || Number(wallet.balance_cents) !== 0)) return wallet.currency === "INR" ? "INR" : "USD";
  const recharge = (await env.DB.prepare(`SELECT currency FROM ${tables.walletRecharges} WHERE account_id=? AND payment_state IN ('paid','pending') ORDER BY CASE payment_state WHEN 'paid' THEN 0 ELSE 1 END,created_at,id LIMIT 1`).bind(accountId).first?.()) as { currency: string } | null | undefined;
  if (recharge) return recharge.currency === "INR" ? "INR" : "USD";
  const history = (await env.DB.prepare(`SELECT currency FROM ${tables.walletTransactions} WHERE account_id=? ORDER BY created_at,id LIMIT 1`).bind(accountId).first?.()) as { currency: string } | null | undefined;
  if (history) return history.currency === "INR" ? "INR" : "USD";
  return (await getCurrencyContext(env)).currency;
};
export type WalletOffer = { id: string; amountCents: number; creditCents: number; bonusCents: number };
export type SessionPricing = { voiceAddonCents: number; videoAddonCents: number; writtenCents: number };
export const getSessionPricing = async (env: RuntimeEnv, currency?: PaymentCurrency): Promise<{ currency: PaymentCurrency } & SessionPricing> => {
  const selectedCurrency = currency ?? (await getCurrencyContext(env)).currency;
  if (!env.DB) throw new Error("Session pricing storage is unavailable.");
  const row = (await env.DB.prepare(`SELECT value_json FROM ${tables.businessSettings} WHERE key='session_pricing'`).bind().first?.()) as { value_json: string } | null | undefined;
  if (!row) throw new Error("Session currency pricing migration is required.");
  const pricing = (JSON.parse(row.value_json) as Record<string, SessionPricing>)[selectedCurrency];
  if (!pricing || ![pricing.voiceAddonCents, pricing.videoAddonCents, pricing.writtenCents].every((value) => Number.isSafeInteger(value) && value >= 0))
    throw new Error("Session pricing is invalid.");
  return { currency: selectedCurrency, ...pricing };
};
export const getWalletPricing = async (env: RuntimeEnv, accountId: string) => {
  const currency = await getWalletCurrency(env, accountId);
  if (!env.DB) throw new Error("Wallet pricing storage is unavailable.");
  const row = (await env.DB.prepare(`SELECT value_json FROM ${tables.businessSettings} WHERE key='wallet_pricing'`).bind().first?.()) as { value_json: string } | null | undefined;
  if (!row) throw new Error("Wallet currency pricing migration is required.");
  const catalog = JSON.parse(row.value_json) as Record<string,{minimumCents:number;maximumCents:number;offers:WalletOffer[]}>;
  const pricing = catalog[currency];
  if (!pricing || !Number.isSafeInteger(pricing.minimumCents) || !Number.isSafeInteger(pricing.maximumCents) || !Array.isArray(pricing.offers)) throw new Error("Wallet pricing is invalid.");
  for (const offer of pricing.offers) if (![offer.amountCents,offer.creditCents,offer.bonusCents].every(Number.isSafeInteger) || offer.amountCents<pricing.minimumCents || offer.creditCents!==offer.amountCents+offer.bonusCents) throw new Error("Wallet offer pricing is invalid.");
  return { currency, ...pricing };
};
