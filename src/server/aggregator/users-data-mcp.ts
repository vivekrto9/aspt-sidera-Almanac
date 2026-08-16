import type { AnalyticsQueryDb } from "./analytics-query.ts";
import usersDataManifest from "../../../astropages/users-data.manifest.json" with { type: "json" };

export const usersDataMcpMethods = [
  "users_schema",
  "users_list",
  "users_get",
  "users_related",
] as const;

export type UsersDataMcpMethod = (typeof usersDataMcpMethods)[number];

export class UsersDataMcpMethodError extends Error {
  readonly code: string;

  constructor(message: string, code = "INVALID_USERS_DATA_ARGUMENTS") {
    super(message);
    this.code = code;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const optionalString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const allRows = async (db: AnalyticsQueryDb, sql: string, values: unknown[] = []) =>
  (await db.prepare(sql).bind(...values).all?.<Record<string, unknown>>())?.results ?? [];

const firstRow = async (db: AnalyticsQueryDb, sql: string, values: unknown[] = []) =>
  await db.prepare(sql).bind(...values).first?.<Record<string, unknown>>() ?? null;

const listColumns = [
  "id",
  "display_name",
  "email",
  "created_at",
  "updated_at",
] as const;

const searchableColumns = ["display_name", "email"] as const;
const sortableColumns = new Set(["display_name", "email", "created_at", "updated_at"]);

type RelatedSectionDef = {
  key: string;
  title: string;
  columns: unknown[];
};

const relatedSectionsDef: RelatedSectionDef[] = usersDataManifest.relatedSections as unknown as RelatedSectionDef[];

const schema = () => ({
  contract: "users-data.v1" as const,
  method: "users_schema" as const,
  schemaRevision: usersDataManifest.schemaRevision,
  entity: usersDataManifest.entity,
  columns: usersDataManifest.columns,
  detailFields: usersDataManifest.detailFields,
  defaultSort: usersDataManifest.defaultSort,
  relatedSections: usersDataManifest.relatedSections,
});

const listUsers = async (db: AnalyticsQueryDb, rawArguments: unknown) => {
  const input = isRecord(rawArguments) ? rawArguments : {};
  const page = typeof input.page === "number" && Number.isInteger(input.page)
    ? Math.max(1, input.page)
    : 1;
  const pageSize = typeof input.pageSize === "number" && Number.isInteger(input.pageSize)
    ? Math.min(100, Math.max(1, input.pageSize))
    : 25;
  const search = optionalString(input.search)?.slice(0, 200) ?? "";
  const requestedSort = optionalString(input.sort);
  const sort = requestedSort && sortableColumns.has(requestedSort)
    ? requestedSort
    : usersDataManifest.defaultSort.field;
  const direction = input.direction === "asc" ? "ASC" : "DESC";
  const where = search
    ? `WHERE ${searchableColumns.map((column) => `${column} LIKE ?`).join(" OR ")}`
    : "";
  const searchValues = search ? searchableColumns.map(() => `%${search}%`) : [];
  const offset = (page - 1) * pageSize;
  const [count, rows] = await Promise.all([
    firstRow(db, `SELECT COUNT(*) AS value FROM ap_customer_accounts ${where}`, searchValues),
    allRows(
      db,
      `SELECT ${listColumns.join(", ")} FROM ap_customer_accounts ${where} ORDER BY ${sort} ${direction} LIMIT ? OFFSET ?`,
      [...searchValues, pageSize, offset],
    ),
  ]);
  const total = Number(count?.value ?? 0);
  return {
    contract: "users-data.v1" as const,
    method: "users_list" as const,
    schema: schema(),
    rows,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
};

const relatedRows = async (db: AnalyticsQueryDb, userId: string, sectionKey: string) => {
  if (sectionKey === "report_orders") {
    return allRows(
      db,
      "SELECT order_number, report_name, ROUND(amount_cents / 100.0, 2) AS total_amount, currency, payment_state, generation_status, created_at FROM ap_report_orders WHERE lower(customer_email) = lower((SELECT email FROM ap_customer_accounts WHERE id = ?)) ORDER BY created_at DESC LIMIT 100",
      [userId],
    );
  }
  if (sectionKey === "shop_orders") {
    return allRows(
      db,
      "SELECT order_number, product_name, ROUND(amount_cents / 100.0, 2) AS total_amount, currency, payment_state, fulfillment_status, created_at FROM ap_product_orders WHERE lower(customer_email) = lower((SELECT email FROM ap_customer_accounts WHERE id = ?)) ORDER BY created_at DESC LIMIT 100",
      [userId],
    );
  }
  throw new UsersDataMcpMethodError(`Unsupported related section ${sectionKey}`);
};

const getUser = async (db: AnalyticsQueryDb, rawArguments: unknown) => {
  if (!isRecord(rawArguments)) throw new UsersDataMcpMethodError("User arguments are required");
  const userId = optionalString(rawArguments.userId);
  if (!userId) throw new UsersDataMcpMethodError("userId is required");
  const user = await firstRow(
    db,
    `SELECT ${listColumns.join(", ")} FROM ap_customer_accounts WHERE id = ? LIMIT 1`,
    [userId],
  );
  if (!user) throw new UsersDataMcpMethodError("User not found", "USER_NOT_FOUND");
  const relatedSections = await Promise.all(relatedSectionsDef.map(async (section) => ({
    key: section.key,
    title: section.title,
    columns: section.columns,
    rows: await relatedRows(db, userId, section.key),
  })));
  return {
    contract: "users-data.v1" as const,
    method: "users_get" as const,
    schema: schema(),
    userId,
    user,
    relatedSections,
  };
};

const getRelated = async (db: AnalyticsQueryDb, rawArguments: unknown) => {
  if (!isRecord(rawArguments)) throw new UsersDataMcpMethodError("Related-record arguments are required");
  const userId = optionalString(rawArguments.userId);
  const sectionKey = optionalString(rawArguments.sectionKey);
  if (!userId || !sectionKey) throw new UsersDataMcpMethodError("userId and sectionKey are required");
  const section = relatedSectionsDef.find((candidate) => candidate.key === sectionKey);
  if (!section) throw new UsersDataMcpMethodError(`Unsupported related section ${sectionKey}`);
  return {
    contract: "users-data.v1" as const,
    method: "users_related" as const,
    userId,
    section: {
      key: section.key,
      title: section.title,
      columns: section.columns,
      rows: await relatedRows(db, userId, sectionKey),
    },
  };
};

export const executeUsersDataMcpMethod = async (
  db: AnalyticsQueryDb | undefined,
  method: UsersDataMcpMethod,
  rawArguments: unknown,
) => {
  if (!db) throw new UsersDataMcpMethodError("D1 is unavailable", "USERS_DATA_UNAVAILABLE");
  if (method === "users_schema") return schema();
  if (method === "users_list") return listUsers(db, rawArguments);
  if (method === "users_get") return getUser(db, rawArguments);
  return getRelated(db, rawArguments);
};
