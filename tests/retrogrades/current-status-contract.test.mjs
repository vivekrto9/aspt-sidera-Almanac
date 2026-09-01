import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const editableFields = [
  "status_section_label",
  "status_badge_label",
  "status_shadow_to_label",
  "status_shadow_from_label",
  "status_mercury_title",
  "status_mercury_description",
  "status_venus_title",
  "status_venus_description",
  "status_mars_title",
  "status_mars_description",
  "status_jupiter_title",
  "status_jupiter_description",
  "status_saturn_title",
  "status_saturn_description",
  "status_uranus_title",
  "status_uranus_description",
  "status_neptune_title",
  "status_neptune_description",
  "status_pluto_title",
  "status_pluto_description",
];

test("Current status uses the approved CardGrid and Badge without shared edits", async () => {
  const component = await read(
    "src/components/retrogrades/sections/RetrogradesCurrentStatus.astro",
  );
  const styles = await read(
    "src/styles/retrogrades/sections/current-status.css",
  );

  assert.match(
    component,
    /import Badge from "\.\.\/\.\.\/shared\/Badge\.astro"/,
  );
  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /tone="accent"/);
  assert.match(component, /appearance="solid"/);
  assert.match(component, /uppercase/);
  assert.match(styles, /max-inline-size: 70rem/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.125rem/);
  assert.match(styles, /background: var\(--color-dark-strong\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-badge__/);
  assert.doesNotMatch(styles, /\.sidera-card-grid > \*/);
});

test("Current status uses provider-normalized ephemeris facts without a page fixture fallback", async () => {
  const data = await read("src/server/aggregator/retrogrades-api.ts");
  const page = await read("src/pages/retrogrades.astro");

  assert.match(data, /normalizeRetrogradeResult/);
  assert.match(data, /Intl\.DateTimeFormat/);
  assert.match(data, /retrogradePositionsEndpoint/);
  assert.match(data, /\/v1\/western_horoscope/);
  assert.doesNotMatch(data, /\/v1\/western\/birth-chart\/data/);
  assert.match(page, /getRetrogrades/);
  assert.match(page, /import EmptyState/);
  assert.doesNotMatch(page, /getPreparedRetrogradeStatuses/);
  assert.match(page, /<RetrogradesCurrentStatus/);
  assert.doesNotMatch(page, /Jun 29|Jul 23|19° Pisces|0° Aries/);
});

test("Current status copy is localized and registered for inline editing", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getRetrogradesDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");

  for (const locale of activeLocaleCodes) {
    const defaults = getRetrogradesDefaults(locale);
    for (const field of editableFields) {
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
      assert.deepEqual(getBuilderFieldTarget(field, "retrogrades"), {
        collection: "site_retrogrades",
        entry: "retrogrades",
      });
    }
  }
});

test("Current status has a forward migration for every new field", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0048_retrogrades_intro_content.sql"));
  sqlite.exec(
    await read("migrations/0053_retrogrades_current_status_content.sql"),
  );
  sqlite.exec(await read("migrations/0149_complete_retrogrades_content.sql"));

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_retrogrades)")
      .all()
      .map((column) => column.name),
  );
  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
