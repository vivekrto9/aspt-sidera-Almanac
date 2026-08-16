import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sectionPath = new URL(
  "../../src/components/birth-chart/sections/BirthChartCastingState.astro",
  import.meta.url,
);
const experiencePath = new URL(
  "../../src/components/birth-chart/BirthChartExperience.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/birth-chart/sections/casting-state.css",
  import.meta.url,
);
const pageStylesheetPath = new URL(
  "../../src/styles/birth-chart/birth-chart.css",
  import.meta.url,
);
const copyPath = new URL(
  "../../src/data/locale/birth-chart/sections/casting-state.ts",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0013_birth_chart_casting_content.sql",
  import.meta.url,
);

test("Birth Chart casting section composes the approved shared state", async () => {
  const source = await readFile(sectionPath, "utf8");

  assert.match(
    source,
    /import CastingState from "\.\.\/\.\.\/shared\/CastingState\.astro"/,
  );
  assert.match(source, /visual="single"/);
  assert.match(source, /height="viewport"/);
  assert.match(source, /headingTag="h1"/);
  assert.match(source, /data-birth-chart-casting/);
  assert.match(source, /tabindex="-1"/);
  assert.match(source, /\n  hidden\n\/>/);
  assert.doesNotMatch(source, /\bfetch\(|fake|mock result/i);
});

test("Birth Chart experience shows casting before its prepared result handoff", async () => {
  const source = await readFile(experiencePath, "utf8");

  assert.match(source, /<BirthChartFormWizard/);
  assert.match(source, /<BirthChartCastingState/);
  assert.match(source, /addEventListener\("birthchartsubmit"/);
  assert.match(source, /wizard\.hidden = true/);
  assert.match(source, /casting\.hidden = false/);
  assert.match(source, /casting\.focus\(\)/);
  assert.match(source, /experience\.dataset\.submitting = "true"/);
  assert.match(source, /fetch\(experience\.dataset\.apiEndpoint/);
  assert.match(source, /timeUnknown: formData\.has\("timeUnknown"\)/);
  assert.match(source, /body\.readingId/);
  assert.match(source, /window\.location\.assign\(/);
  assert.match(source, /data-result-href=\{resultHref\}/);
  assert.match(source, /data-api-endpoint=\{apiEndpoint\}/);
  assert.doesNotMatch(source, /success|castingDelayMs/i);
  assert.match(source, /result\?: PreparedBirthChartResult/);
});

test("Birth Chart casting copy is localized and exactly editable", async () => {
  const [section, copy] = await Promise.all([
    readFile(sectionPath, "utf8"),
    readFile(copyPath, "utf8"),
  ]);

  for (const field of [
    "casting_title",
    "casting_status",
    "casting_summary",
  ]) {
    assert.match(section, new RegExp(`editAttributes\\("${field}"\\)`));
  }
  assert.match(
    copy,
    /satisfies Record<SupportedLocale, BirthChartCastingStateCopy>/,
  );
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Birth Chart casting preserves responsive and reduced-motion behavior", async () => {
  const [source, pageStyles] = await Promise.all([
    readFile(stylesheetPath, "utf8"),
    readFile(pageStylesheetPath, "utf8"),
  ]);

  assert.match(source, /\.birth-chart-casting\[hidden\]/);
  assert.match(source, /min-block-size: calc\(100svh - 4\.625rem\)/);
  assert.match(source, /min-block-size: calc\(100svh - 4\.25rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(
    pageStyles,
    /\.birth-chart-body > \[data-birth-chart-experience\][\s\S]*width: 100%/,
  );
  assert.match(pageStyles, /overflow-x: hidden/);
});

test("Birth Chart casting fields have an executable forward migration", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_birth_chart)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "casting_title",
    "casting_status",
    "casting_summary",
  ]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_birth_chart ADD COLUMN ${field} TEXT;`),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
