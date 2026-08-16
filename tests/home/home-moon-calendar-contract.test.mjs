import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeMoonCalendar.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-moon-calendar.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const baseMigrationPath = new URL(
  "../../migrations/0018_home_birth_chart_content.sql",
  import.meta.url,
);
const transitMigrationPath = new URL(
  "../../migrations/0021_home_transit_content.sql",
  import.meta.url,
);
const synastryMigrationPath = new URL(
  "../../migrations/0022_home_synastry_content.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0025_home_moon_calendar_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_moon_calendar_eyebrow",
  "home_moon_calendar_title_accent",
  "home_moon_calendar_title_rest",
  "home_moon_calendar_current_phase_name",
  "home_moon_calendar_current_phase_meta",
  "home_moon_calendar_current_phase_description",
  "home_moon_calendar_cta",
  ...Array.from({ length: 5 }, (_, index) => [
    `home_moon_calendar_phase_${index + 1}_name`,
    `home_moon_calendar_phase_${index + 1}_date`,
  ]).flat(),
  "home_moon_calendar_next_full_label",
  "home_moon_calendar_next_full_value",
  "home_moon_calendar_next_new_label",
  "home_moon_calendar_next_new_value",
];

test("Home Moon Calendar composes the approved shared heading, button, and phase items", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(source, /import MoonPhaseItem[\s\S]*shared\/MoonPhaseItem\.astro/);
  assert.match(source, /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/);
  assert.match(source, /copy\.phases\.map/);
  assert.match(source, /tone="inverse"/);
  assert.match(source, /current=\{index === currentMilestoneIndex\}/);
  assert.match(source, /variant="secondary"/);
  assert.doesNotMatch(source, /variant="link"/);
  assert.match(source, /home-moon-calendar__moon-light/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage/);
});

test("Home Moon Calendar matches the Meridian geometry and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-dark\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 0\.9fr\) minmax\(0, 1\.1fr\)/,
  );
  assert.match(styles, /inline-size: 8\.25rem/);
  assert.match(styles, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(
    styles,
    /\.home-moon-calendar__cta[\s\S]*margin-block-start: 1rem/,
  );
  assert.match(
    styles,
    /grid-auto-flow: column[\s\S]*grid-auto-columns: minmax\(7rem, 1fr\)[\s\S]*overflow-x: auto/,
  );
  assert.doesNotMatch(styles, /\.home-moon-calendar__phase:hover/);
  assert.doesNotMatch(styles, /\.home-moon-calendar__events article:hover/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Moon Calendar with localized navigation and exact edit targeting", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeMoonCalendar from "\.\.\/components\/home\/sections\/HomeMoonCalendar\.astro"/,
  );
  assert.match(source, /<HomeMoonCalendar/);
  assert.match(source, /getCurrentMoonGuide/);
  assert.match(source, /moonCalendarPath/);
  assert.match(source, /actionHref=\{localizePath\("\/moon-calendar", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_moon_calendar_\$\{field\}`\)\)/,
  );
});

test("all active locales provide aligned Home Moon Calendar content and registry fields", async () => {
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getHomeMoonCalendarCopy } = await import(
    "../../src/data/locale/home/sections/moon-calendar.ts"
  );
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig } = await import("../../src/builder/registry.ts");
  const registeredFields = new Set(
    getBuilderEntryConfig("site_home_sections", "home")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }

  for (const locale of activeLocaleCodes) {
    const content = getHomeDefaults(locale);
    const copy = getHomeMoonCalendarCopy(locale);

    assert.equal(copy.phases.length, 5, `${locale} must have five phase markers`);
    for (const field of editableFields) {
      assert.equal(typeof content[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(content[field].trim(), "", `${locale} has empty ${field}`);
    }
    if (locale !== "en") {
      assert.notEqual(copy.currentPhaseDescription, getHomeMoonCalendarCopy("en").currentPhaseDescription);
    }
  }
});

test("Home Moon Calendar has a forward migration for every editable field", async () => {
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(await readFile(baseMigrationPath, "utf8"));
  sqlite.exec(await readFile(transitMigrationPath, "utf8"));
  sqlite.exec(await readFile(synastryMigrationPath, "utf8"));
  const migration = await readFile(migrationPath, "utf8");
  sqlite.exec(migration);
  const migratedColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_sections)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
    assert.equal(migratedColumns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
