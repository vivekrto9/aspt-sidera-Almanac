import { AP_TABLES as tables } from "./db/tables.ts";
import type { RuntimeEnv } from "./runtime.ts";

const count = async (env: RuntimeEnv, sql: string, accountId: string) => {
  if (!env.DB) return 0;
  const row = await env.DB.prepare(sql).bind(accountId).first?.() as { total?: unknown } | null | undefined;
  return Number(row?.total || 0);
};

export const getAccountOverviewStats = async (env: RuntimeEnv, accountId: string) => {
  const [charts, people, reports, sessionCredits] = await Promise.all([
    count(env, `SELECT COUNT(*) AS total FROM ${tables.chartReadings} WHERE account_id = ? AND reading_type = 'birth_chart' AND status = 'ready'`, accountId),
    count(env, `SELECT COUNT(*) AS total FROM ${tables.customerUserProfiles} WHERE account_id = ?`, accountId),
    count(env, `SELECT COUNT(*) AS total FROM ${tables.commerceOrders} WHERE account_id = ? AND order_type = 'report' AND status IN ('paid', 'generation_pending', 'ready', 'fulfilled')`, accountId),
    count(env, `SELECT COUNT(*) AS total FROM ${tables.sessionEntitlements} WHERE account_id = ? AND status = 'paid'`, accountId),
  ]);
  return [charts, people, reports, sessionCredits] as const;
};
