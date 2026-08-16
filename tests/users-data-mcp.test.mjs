import assert from "node:assert/strict";
import test from "node:test";
import { executeUsersDataMcpMethod, usersDataMcpMethods } from "../src/server/aggregator/users-data-mcp.ts";

const rowsFor = (sql, values) => {
  if (sql.includes("COUNT(*)")) return [{ value: 1 }];
  if (sql.includes("FROM ap_report_orders")) return [{ order_number: "REPORT-1", report_name: "Natal Horoscope" }];
  if (sql.includes("FROM ap_product_orders")) return [{ order_number: "ORDER-1", product_name: "Tarot Deck" }];
  if (sql.includes("FROM ap_customer_accounts") && sql.includes("WHERE id = ?")) {
    return values[0] === "user-1" ? [{ id: "user-1", display_name: "Clara", email: "clara@example.com", created_at: "2026-07-01" }] : [];
  }
  if (sql.includes("FROM ap_customer_accounts")) return [{ id: "user-1", display_name: "Clara", email: "clara@example.com", created_at: "2026-07-01" }];
  return [];
};

const db = {
  prepare(sql) {
    let values = [];
    return {
      bind(...nextValues) {
        values = nextValues;
        return this;
      },
      async all() { return { results: rowsFor(sql, values) }; },
      async first() { return rowsFor(sql, values)[0] ?? null; },
    };
  },
};

test("exposes the independent Users Data methods", () => {
  assert.deepEqual(usersDataMcpMethods, ["users_schema", "users_list", "users_get", "users_related"]);
});

test("returns a dynamic schema and paginated users", async () => {
  const result = await executeUsersDataMcpMethod(db, "users_list", { page: 1, pageSize: 25, search: "Clara" });
  assert.equal(result.contract, "users-data.v1");
  assert.equal(result.method, "users_list");
  assert.equal(result.schema.entity.idField, "id");
  assert.equal(result.pagination.total, 1);
  assert.equal(result.rows[0].id, "user-1");
});

test("returns user details with template-specific related sections", async () => {
  const result = await executeUsersDataMcpMethod(db, "users_get", { userId: "user-1" });
  assert.equal(result.contract, "users-data.v1");
  assert.deepEqual(result.relatedSections.map((section) => section.key), []);
});

test("rejects unknown sort fields without interpolating them", async () => {
  const result = await executeUsersDataMcpMethod(db, "users_list", { sort: "password_hash" });
  assert.equal(result.contract, "users-data.v1");
});
