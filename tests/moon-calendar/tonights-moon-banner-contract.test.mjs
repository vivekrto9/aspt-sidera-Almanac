import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/moon-calendar/sections/MoonCalendarTonightBanner.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/moon-calendar/sections/moon-calendar-tonight-banner.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/moon-calendar.astro", import.meta.url);
const baseMigrationPath = new URL(
  "../../migrations/0045_moon_calendar_page_header.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0046_moon_calendar_tonight_banner.sql",
  import.meta.url,
);

const fields = [
  "tonight_eyebrow",
  "tonight_phase_name",
  "tonight_phase_detail",
  "tonight_meaning",
  "tonight_next_full_label",
  "tonight_next_full_date",
  "tonight_next_full_countdown",
  "tonight_next_new_label",
  "tonight_next_new_date",
  "tonight_next_new_countdown",
];

test("Tonight's Moon banner preserves the literal reference structure", async () => {
  const source = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(source, /viewBox="0 0 150 150"/);
  assert.match(source, /illumination = 0/);
  assert.match(source, /const illuminationRatio = Math\.max/);
  assert.match(source, /moon-calendar-tonight__identity/);
  assert.match(source, /moon-calendar-tonight__meaning/);
  assert.match(source, /moon-calendar-tonight__events/);
  assert.equal(
    (source.match(/class="moon-calendar-tonight__event"/g) ?? []).length,
    2,
  );

  assert.match(styles, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(styles, /padding: 1\.5rem 2\.125rem 0/);
  assert.match(styles, /border-radius: 1\.375rem/);
  assert.match(styles, /padding: 2rem 2\.125rem/);
  assert.match(styles, /grid-template-columns: auto minmax\(15rem, 1fr\) auto/);
  assert.match(styles, /gap: 2\.25rem/);
  assert.match(styles, /inline-size: 8\.25rem/);
  assert.match(styles, /border-inline-start: 1px solid/);
});

test("Tonight's Moon banner edits labels while keeping live astronomy read-only", async () => {
  const source = await readFile(componentPath, "utf8");
  const page = await readFile(pagePath, "utf8");

  for (const field of [
    "tonight_eyebrow",
    "tonight_next_full_label",
    "tonight_next_new_label",
  ]) {
    const propName = field
      .replace(/^tonight_/, "")
      .split("_")
      .map((part, index) =>
        index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`,
      )
      .join("");
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.match(
      source,
      new RegExp(`${propName}EditAttributes`),
      `missing edit attributes for ${field}`,
    );
  }
  for (const field of [
    "tonight_phase_name",
    "tonight_phase_detail",
    "tonight_meaning",
    "tonight_next_full_date",
    "tonight_next_full_countdown",
    "tonight_next_new_date",
    "tonight_next_new_countdown",
  ]) {
    assert.doesNotMatch(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
  assert.match(page, /phaseNameEditAttributes=\{\{\}\}/);
  assert.match(page, /nextFullDateEditAttributes=\{\{\}\}/);
});

test("Moon Calendar route mounts Tonight's Moon immediately after Page header", async () => {
  const page = await readFile(pagePath, "utf8");

  assert.match(
    page,
    /import MoonCalendarTonightBanner from "\.\.\/components\/moon-calendar\/sections\/MoonCalendarTonightBanner\.astro"/,
  );
  assert.match(
    page,
    /<MoonCalendarPageHeader[\s\S]*\/>\s*<MoonCalendarTonightBanner[\s\S]*\/>/,
  );
  assert.doesNotMatch(page, /CardGrid|FinalCtaSection/);
});

test("all active locales provide aligned Tonight's Moon copy", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getMoonCalendarDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const english = getMoonCalendarDefaults("en");

  for (const locale of activeLocaleCodes) {
    const defaults = getMoonCalendarDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.equal(
        Object.hasOwn(english, field),
        true,
        `English defaults missing ${field}`,
      );
    }
  }
});

test("Tonight's Moon fields stay in the bounded Moon Calendar target", async () => {
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");

  for (const field of fields) {
    assert.deepEqual(getBuilderFieldTarget(field, "moon_calendar"), {
      collection: "site_moon_calendar",
      entry: "moon_calendar",
    });
  }
  assert.deepEqual(getBuilderPageTargets("moon_calendar"), [
    { collection: "site_moon_calendar", entry: "moon_calendar" },
  ]);
  const config = getBuilderEntryConfig(
    "site_moon_calendar",
    "moon_calendar",
  );
  assert.ok(config);
  assert.ok(config.editableFields.length < 100);
});

test("Tonight's Moon fields have an executable forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(baseMigrationPath, "utf8"));
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_moon_calendar)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});

test("Tonight's Moon remains responsive without false hover affordances", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /@media \(max-width: 64rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(max-width: 25rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /:hover/);
  assert.doesNotMatch(styles, /\.sidera-moon-phase-item__/);
});
