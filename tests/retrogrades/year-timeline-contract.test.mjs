import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const editableFields = [
  "timeline_heading_prefix",
  "timeline_tip_1_title",
  "timeline_tip_1_description",
  "timeline_tip_2_title",
  "timeline_tip_2_description",
  "timeline_tip_3_title",
  "timeline_tip_3_description",
];

test("Year timeline matches the reference structure without changing shared defaults", async () => {
  const component = await read(
    "src/components/retrogrades/sections/RetrogradesYearTimeline.astro",
  );
  const styles = await read(
    "src/styles/retrogrades/sections/year-timeline.css",
  );

  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(component, /data-screen-label="Retrogrades · 2026"/);
  assert.match(component, /months\.map/);
  assert.match(component, /rows\.map/);
  assert.match(component, /role="img"/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(styles, /inline-size: min\(100%, 62\.5rem\)/);
  assert.match(styles, /padding: 1\.625rem 1\.625rem 1\.125rem/);
  assert.match(styles, /flex: 0 0 6rem/);
  assert.match(styles, /block-size: 1\.625rem/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-card-grid\s*\{/);
});

test("Year, localized months, planet labels, glyphs and bar geometry come from provider-normalized runtime data", async () => {
  const data = await read("src/server/aggregator/retrogrades-api.ts");
  const page = await read("src/pages/retrogrades.astro");

  assert.match(data, /normalizeRetrogradeResult/);
  assert.match(data, /Intl\.DateTimeFormat/);
  assert.match(data, /percentAt/);
  assert.match(data, /retrogrades:stations:/);
  assert.match(data, /event_types: \["direction_change"\]/);
  assert.match(page, /getRetrogrades/);
  assert.match(page, /import EmptyState/);
  assert.doesNotMatch(page, /getPreparedRetrogradeTimeline/);
  assert.match(page, /<RetrogradesYearTimeline/);
  assert.doesNotMatch(page, /Retrogrades across 2026|Review, don't launch/);
});

test("Year timeline guidance is localized and registered for inline editing", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getRetrogradesDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getRetrogradesDefaults(locale);
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.deepEqual(getBuilderFieldTarget(field, "retrogrades"), {
        collection: "site_retrogrades",
        entry: "retrogrades",
      });
    }
  }
});

test("Year timeline has a forward migration for each editable field", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0048_retrogrades_intro_content.sql"));
  sqlite.exec(
    await read("migrations/0055_retrogrades_year_timeline_content.sql"),
  );

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
