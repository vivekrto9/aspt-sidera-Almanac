import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Account Orders matches the four-row reference using the shared order component", () => {
  const section = read("src/components/account/sections/AccountOrders.astro");
  const list = read("src/components/account/shared/AccountOrdersList.astro");
  const data = read("src/data/account/orders.ts");
  const page = read("src/pages/account.astro");
  assert.match(section, /id="orders"/);
  assert.match(section, /props\.orders\.length \? props\.viewAllLabel : undefined/);
  assert.match(section, /orders\.slice\(0, 4\)/);
  assert.match(list, /<OrderLineItem/);
  assert.match(list, /variant="history"/);
  for (const title of [
    "Year Ahead Forecast",
    "Lunar Phase Candle",
    "The Natal Blueprint",
    "Natal Chart Print",
  ])
    assert.match(data, new RegExp(title));
  assert.match(page, /<AccountOrders/);
});

test("Purchase history reuses collection View all and ten-item pagination", () => {
  const section = read("src/components/account/sections/AccountOrders.astro");
  const route = read("src/pages/account/[collection].astro");
  const styles = read("src/styles/account/sections/account-orders.css");
  assert.match(section, /account_collection_view_all_label/);
  assert.match(
    route,
    /collection === "orders" \? 10 : 8/,
  );
  assert.match(route, /<AccountOrdersList/);
  assert.match(styles, /border-radius: 1rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Account Orders copy and migration cover seven locales", () => {
  const locale = read("src/data/locale/account/sections/orders.ts");
  const defaults = read("src/data/public-copy.ts");
  const migration = read("migrations/0102_account_orders_content.sql");
  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"])
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  for (const field of [
    "account_orders_eyebrow",
    "account_orders_title",
    "account_orders_delivered_label",
    "account_orders_shipped_label",
  ]) {
    assert.match(defaults, new RegExp(field));
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }
});
