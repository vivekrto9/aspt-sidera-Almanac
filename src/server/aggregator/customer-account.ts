import { AP_TABLES as tables } from "./db/tables.ts";
import { getCustomerAccountById } from "./customer-auth.ts";
import { nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

export const updateCustomerAccountSettings = async ({
  env,
  accountId,
  displayName,
  phone,
  defaultLanguage,
  consentMarketing,
  houseSystem,
  zodiacSystem,
  dailyHoroscope,
}: {
  env: RuntimeEnv;
  accountId: string;
  displayName: unknown;
  phone?: unknown;
  defaultLanguage?: unknown;
  consentMarketing?: unknown;
  houseSystem?: unknown;
  zodiacSystem?: unknown;
  dailyHoroscope?: unknown;
}) => {
  const name = safeString(displayName);
  if (!name)
    return { ok: false as const, message: "Display name is required." };
  const house = safeString(houseSystem) || "placidus";
  const zodiac = safeString(zodiacSystem) || "tropical";
  if (!new Set(["placidus", "whole-sign"]).has(house))
    return { ok: false as const, message: "Choose a valid house system." };
  if (!new Set(["tropical", "sidereal"]).has(zodiac))
    return { ok: false as const, message: "Choose a valid zodiac system." };
  await env.DB?.prepare(
    `UPDATE ${tables.customerAccounts} SET display_name = ?, phone = ?, default_language = ?, consent_marketing = ?, house_system = ?, zodiac_system = ?, daily_horoscope = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(
      name.slice(0, 100),
      safeString(phone) || null,
      (safeString(defaultLanguage) || "English").slice(0, 40),
      consentMarketing === true ? 1 : 0,
      house,
      zodiac,
      dailyHoroscope === false ? 0 : 1,
      nowIso(),
      accountId,
    )
    .run?.();
  const account = await getCustomerAccountById(env, accountId);
  return account
    ? { ok: true as const, account }
    : { ok: false as const, message: "Account was not found." };
};
