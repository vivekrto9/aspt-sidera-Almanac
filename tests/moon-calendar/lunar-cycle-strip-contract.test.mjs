import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/moon-calendar/sections/MoonCalendarLunarCycleStrip.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/moon-calendar/sections/moon-calendar-lunar-cycle-strip.css",
  import.meta.url,
);
const pagePath = new URL(
  "../../src/pages/moon-calendar.astro",
  import.meta.url,
);
const baseMigrationPath = new URL(
  "../../migrations/0045_moon_calendar_page_header.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0056_moon_calendar_lunar_cycle_strip.sql",
  import.meta.url,
);

const fields = [
  "cycle_title",
  "cycle_description",
  "cycle_phase_new",
  "cycle_phase_waxing_crescent",
  "cycle_phase_first_quarter",
  "cycle_phase_waxing_gibbous",
  "cycle_phase_full",
  "cycle_phase_waning_gibbous",
  "cycle_phase_last_quarter",
  "cycle_phase_waning_crescent",
];

test("Lunar cycle strip composes the approved shared phase and grid components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(
    source,
    /import MoonPhaseItem from "\.\.\/\.\.\/shared\/MoonPhaseItem\.astro"/,
  );
  assert.match(source, /<CardGrid[\s\S]*as="ol"/);
  assert.match(source, /phases\.map/);
  assert.match(source, /<MoonPhaseItem/);
  assert.doesNotMatch(source, /current=\{item\.phase === currentPhase\}/);
  assert.match(source, /<button[\s\S]*data-moon-phase-select=\{item\.phase\}/);
  assert.match(source, /new CustomEvent\("moon-phase-select"/);
  assert.match(source, /selectPhaseTemplate\.replace/);
  assert.match(source, /aria-pressed=\{item\.phase === currentPhase/);
  assert.match(source, /disabled=\{item\.phase === currentPhase\}/);
  assert.doesNotMatch(source, /aria-current=/);
  assert.match(source, /setAttribute\(\s*"aria-pressed"/);
  assert.match(source, /button\.disabled = selected/);
  assert.match(source, /addEventListener\("moon-day-selected"/);
});

test("Moon Calendar mounts the strip after calendar detail", async () => {
  const page = await readFile(pagePath, "utf8");

  assert.match(
    page,
    /<MoonCalendarCalendarDetail[\s\S]*\/>\s*<MoonCalendarLunarCycleStrip[\s\S]*\/>\s*<\/main>/,
  );
});

test("all active locales register ten non-empty editable cycle fields", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getMoonCalendarDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");

  for (const locale of activeLocaleCodes) {
    const defaults = getMoonCalendarDefaults(locale);
    for (const field of fields) {
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
      assert.deepEqual(getBuilderFieldTarget(field, "moon_calendar"), {
        collection: "site_moon_calendar",
        entry: "moon_calendar",
      });
    }
  }
});

test("cycle fields have an executable bounded migration", async () => {
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

test("cycle strip mirrors the reference reflow with clear native-button interaction", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /--sidera-card-grid-columns: 8 !important/);
  assert.match(styles, /@media \(max-width: 64rem\)/);
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /\.moon-calendar-cycle__phase-button:hover/);
  assert.match(styles, /\.moon-calendar-cycle__phase-button:focus-visible/);
  assert.doesNotMatch(styles, /\[aria-current="true"\]/);
  assert.match(styles, /\[aria-pressed="true"\]/);
  assert.match(styles, /\.moon-calendar-cycle__phase-button:disabled/);
});
