import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const emptyFields = [
  "account_saved_charts_empty_title",
  "account_saved_charts_empty_description",
  "account_saved_charts_empty_action_label",
  "account_people_empty_title",
  "account_people_empty_description",
  "account_people_empty_action_label",
  "account_orders_empty_title",
  "account_orders_empty_description",
  "account_orders_empty_action_label",
  "account_sessions_empty_title",
  "account_sessions_empty_description",
  "account_sessions_empty_action_label",
  "account_overview_sky_empty_title",
  "account_overview_sky_empty_description",
  "account_overview_sky_empty_action_label",
  "account_overview_session_empty_title",
  "account_overview_session_empty_description",
  "account_overview_session_empty_action_label",
];

test("all visible Account collections reuse the approved panel EmptyState when empty", async () => {
  const [emptyState, savedCharts, people, orders, collectionPage] =
    await Promise.all([
      read("src/components/account/shared/AccountCollectionEmptyState.astro"),
      read("src/components/account/sections/AccountSavedCharts.astro"),
      read("src/components/account/sections/AccountPeople.astro"),
      read("src/components/account/sections/AccountOrders.astro"),
      read("src/pages/account/[collection].astro"),
    ]);

  assert.match(
    emptyState,
    /import EmptyState from "\.\.\/\.\.\/shared\/EmptyState\.astro"/,
  );
  assert.match(emptyState, /variant="panel"/);
  assert.match(emptyState, /actionHref=\{props\.actionHref\}/);
  assert.doesNotMatch(emptyState, /import Button|<Button/);
  for (const source of [savedCharts, people, orders]) {
    assert.match(source, /AccountCollectionEmptyState/);
    assert.match(source, /\.length \? \(/);
  }
  assert.match(collectionPage, /items\.length === 0/);
  assert.match(collectionPage, /<AccountCollectionEmptyState/);
});

test("Account empty actions use real localized creation destinations", async () => {
  const [account, collectionPage] = await Promise.all([
    read("src/pages/account.astro"),
    read("src/pages/account/[collection].astro"),
  ]);

  assert.match(
    account,
    /emptyActionHref=\{localizePath\("\/birth-chart", locale\)\}/,
  );
  assert.match(account, /emptyActionHref=\{localizePath\("\/shop", locale\)\}/);
  assert.match(
    collectionPage,
    /localizePath\(collection === "charts" \|\| collection === "people" \? "\/birth-chart" : "\/shop", locale\)/,
  );
  assert.doesNotMatch(account + collectionPage, /emptyActionHref=\{?"#"/);
});

test("Account empty copy is localized, editable, and physically migrated", async () => {
  const [
    { activeLocaleCodes },
    { getAccountDefaults },
    { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets },
  ] = await Promise.all([
    import("../../src/data/localization-contract.ts"),
    import("../../src/data/public-copy.ts"),
    import("../../src/builder/registry.ts"),
  ]);
  const primaryConfigured = new Set(
    getBuilderEntryConfig("site_account", "account")?.editableFields.map(
      (field) => field.slug,
    ) ?? [],
  );
  const configured = new Set(
    getBuilderEntryConfig(
      "site_account_empty_states",
      "empty-states",
    )?.editableFields.map((field) => field.slug) ?? [],
  );

  assert.deepEqual(getBuilderPageTargets("account"), [
    { collection: "site_account", entry: "account" },
    { collection: "site_account_empty_states", entry: "empty-states" },
    { collection: "site_account_wallet", entry: "wallet" },
  ]);

  for (const locale of activeLocaleCodes) {
    const defaults = getAccountDefaults(locale);
    for (const field of emptyFields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
      assert.equal(configured.has(field), true, `${field} is not editable`);
      assert.equal(
        primaryConfigured.has(field),
        false,
        `${field} should not expand the capped Account table`,
      );
      assert.deepEqual(getBuilderFieldTarget(field, "account"), {
        collection: "site_account_empty_states",
        entry: "empty-states",
      });
    }
  }

  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    await read("migrations/0073_account_shell_navigation_content.sql"),
  );
  sqlite.exec(await read("migrations/0082_account_overview_content.sql"));
  sqlite.exec(
    await read("migrations/0120_account_empty_collection_content.sql"),
  );
  sqlite.exec(
    await read("migrations/0121_account_overview_runtime_states.sql"),
  );
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_account_empty_states)")
      .all()
      .map((column) => column.name),
  );
  for (const field of emptyFields)
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  assert.ok(columns.size < 100);
  sqlite.close();
});
