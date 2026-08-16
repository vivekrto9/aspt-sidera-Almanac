import { AP_TABLES as tables } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

type Row = Record<string, unknown>;
const all = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return [];
  const statement = env.DB.prepare(sql).bind(...values) as {
    all?: () => Promise<{ results?: Row[] }>;
  };
  const result = await statement.all?.();
  return result?.results ?? [];
};
const first = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return null;
  const statement = env.DB.prepare(sql).bind(...values) as {
    first?: () => Promise<Row | null>;
  };
  return (await statement.first?.()) ?? null;
};
const run = async (env: RuntimeEnv, sql: string, values: unknown[] = []) =>
  env.DB?.prepare(sql)
    .bind(...values)
    .run?.();

const columns = `id, account_id, profile_name, relation, gender, birth_date, birth_time,
  birth_place, place_id, place_lat, place_lon, place_timezone, timezone_offset,
  notes, is_default, created_at, updated_at`;
const fromRow = (row: Row) => ({
  id: String(row.id),
  accountId: String(row.account_id),
  profileName: safeString(row.profile_name),
  relation: safeString(row.relation),
  gender: safeString(row.gender),
  birthDate: safeString(row.birth_date),
  birthTime: safeString(row.birth_time),
  birthPlace: safeString(row.birth_place),
  placeId: safeString(row.place_id),
  placeLat: Number(row.place_lat),
  placeLon: Number(row.place_lon),
  placeTimezone: safeString(row.place_timezone),
  timezoneOffset: safeString(row.timezone_offset),
  notes: safeString(row.notes),
  isDefault: Number(row.is_default) === 1,
  createdAt: safeString(row.created_at),
  updatedAt: safeString(row.updated_at),
});
export type CustomerUserProfile = ReturnType<typeof fromRow>;

export const listCustomerUserProfiles = async (
  env: RuntimeEnv,
  accountId: string,
) =>
  (
    await all(
      env,
      `SELECT ${columns} FROM ${tables.customerUserProfiles} WHERE account_id = ? ORDER BY is_default DESC, updated_at DESC`,
      [accountId],
    )
  ).map(fromRow);

export const getCustomerUserProfile = async (
  env: RuntimeEnv,
  accountId: string,
  profileId: string,
) => {
  const row = await first(
    env,
    `SELECT ${columns} FROM ${tables.customerUserProfiles} WHERE account_id = ? AND id = ? LIMIT 1`,
    [accountId, profileId],
  );
  return row ? fromRow(row) : null;
};

const normalize = (profile: Record<string, unknown>) => {
  const required = [
    "profileName",
    "birthDate",
    "birthTime",
    "birthPlace",
    "placeTimezone",
  ] as const;
  if (required.some((key) => !safeString(profile[key])))
    return {
      ok: false as const,
      message: "Complete all birth profile details.",
    };
  const placeLat = Number(profile.placeLat);
  const placeLon = Number(profile.placeLon);
  if (
    !Number.isFinite(placeLat) ||
    !Number.isFinite(placeLon) ||
    placeLat < -90 ||
    placeLat > 90 ||
    placeLon < -180 ||
    placeLon > 180
  ) {
    return { ok: false as const, message: "Select a valid birth place." };
  }
  return {
    ok: true as const,
    value: {
      profileName: safeString(profile.profileName).slice(0, 100),
      relation: safeString(profile.relation).slice(0, 50) || null,
      gender: safeString(profile.gender).slice(0, 30) || null,
      birthDate: safeString(profile.birthDate),
      birthTime: safeString(profile.birthTime),
      birthPlace: safeString(profile.birthPlace).slice(0, 200),
      placeId: safeString(profile.placeId).slice(0, 200) || null,
      placeLat,
      placeLon,
      placeTimezone: safeString(profile.placeTimezone).slice(0, 100),
      timezoneOffset: safeString(profile.timezoneOffset).slice(0, 20) || null,
      notes: safeString(profile.notes).slice(0, 2000) || null,
      isDefault: profile.isDefault === true,
    },
  };
};

export const createCustomerUserProfile = async ({
  env,
  accountId,
  profile,
  idempotencyKey,
}: {
  env: RuntimeEnv;
  accountId: string;
  profile: Record<string, unknown>;
  idempotencyKey?: string | null;
}) => {
  const normalized = normalize(profile);
  if (!normalized.ok) return normalized;
  const key = safeString(idempotencyKey);
  if (key && !/^[A-Za-z0-9._:-]{1,128}$/.test(key))
    return { ok: false as const, message: "Invalid profile request key." };
  if (key) {
    const replay = await first(
      env,
      `SELECT ${columns} FROM ${tables.customerUserProfiles} WHERE account_id = ? AND request_key = ?`,
      [accountId, key],
    );
    if (replay) return { ok: true as const, profile: fromRow(replay) };
  }
  const existing = await listCustomerUserProfiles(env, accountId);
  const makeDefault = normalized.value.isDefault || existing.length === 0;
  const now = nowIso();
  if (makeDefault)
    await run(
      env,
      `UPDATE ${tables.customerUserProfiles} SET is_default = 0, updated_at = ? WHERE account_id = ?`,
      [now, accountId],
    );
  const id = createId("cprof");
  const value = normalized.value;
  await run(
    env,
    `INSERT INTO ${tables.customerUserProfiles} (id, account_id, request_key, profile_name, relation, gender, birth_date, birth_time, birth_place, place_id, place_lat, place_lon, place_timezone, timezone_offset, notes, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      accountId,
      key || null,
      value.profileName,
      value.relation,
      value.gender,
      value.birthDate,
      value.birthTime,
      value.birthPlace,
      value.placeId,
      value.placeLat,
      value.placeLon,
      value.placeTimezone,
      value.timezoneOffset,
      value.notes,
      makeDefault ? 1 : 0,
      now,
      now,
    ],
  );
  return {
    ok: true as const,
    profile: await getCustomerUserProfile(env, accountId, id),
  };
};

export const updateCustomerUserProfile = async ({
  env,
  accountId,
  profileId,
  profile,
}: {
  env: RuntimeEnv;
  accountId: string;
  profileId: string;
  profile: Record<string, unknown>;
}) => {
  const existing = await getCustomerUserProfile(env, accountId, profileId);
  if (!existing) return { ok: false as const, message: "Profile not found." };
  const normalized = normalize(profile);
  if (!normalized.ok) return normalized;
  const value = normalized.value;
  const now = nowIso();
  if (value.isDefault)
    await run(
      env,
      `UPDATE ${tables.customerUserProfiles} SET is_default = 0, updated_at = ? WHERE account_id = ?`,
      [now, accountId],
    );
  await run(
    env,
    `UPDATE ${tables.customerUserProfiles} SET profile_name = ?, relation = ?, gender = ?, birth_date = ?, birth_time = ?, birth_place = ?, place_id = ?, place_lat = ?, place_lon = ?, place_timezone = ?, timezone_offset = ?, notes = ?, is_default = ?, updated_at = ? WHERE account_id = ? AND id = ?`,
    [
      value.profileName,
      value.relation,
      value.gender,
      value.birthDate,
      value.birthTime,
      value.birthPlace,
      value.placeId,
      value.placeLat,
      value.placeLon,
      value.placeTimezone,
      value.timezoneOffset,
      value.notes,
      value.isDefault || existing.isDefault ? 1 : 0,
      now,
      accountId,
      profileId,
    ],
  );
  return {
    ok: true as const,
    profile: await getCustomerUserProfile(env, accountId, profileId),
  };
};

export const deleteCustomerUserProfile = async (
  env: RuntimeEnv,
  accountId: string,
  profileId: string,
) => {
  const existing = await getCustomerUserProfile(env, accountId, profileId);
  if (!existing) return { ok: false as const, message: "Profile not found." };
  await run(
    env,
    `DELETE FROM ${tables.customerUserProfiles} WHERE account_id = ? AND id = ?`,
    [accountId, profileId],
  );
  if (existing.isDefault) {
    const replacement = await first(
      env,
      `SELECT id FROM ${tables.customerUserProfiles} WHERE account_id = ? ORDER BY updated_at DESC LIMIT 1`,
      [accountId],
    );
    if (replacement)
      await run(
        env,
        `UPDATE ${tables.customerUserProfiles} SET is_default = 1, updated_at = ? WHERE account_id = ? AND id = ?`,
        [nowIso(), accountId, String(replacement.id)],
      );
  }
  return { ok: true as const };
};
