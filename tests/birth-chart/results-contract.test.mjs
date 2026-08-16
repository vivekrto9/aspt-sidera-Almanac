import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/birth-chart/sections/BirthChartResults.astro",
  import.meta.url,
);
const experiencePath = new URL(
  "../../src/components/birth-chart/BirthChartExperience.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/birth-chart/sections/results.css",
  import.meta.url,
);
const copyPath = new URL(
  "../../src/data/locale/birth-chart/sections/results.ts",
  import.meta.url,
);
const registryPath = new URL("../../src/builder/registry.ts", import.meta.url);
const pagePath = new URL("../../src/pages/birth-chart.astro", import.meta.url);
const resultPagePath = new URL(
  "../../src/pages/birth-chart/[slug].astro",
  import.meta.url,
);
const dummyResultsPath = new URL(
  "../../src/data/birth-chart/dummy-results.ts",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0026_birth_chart_results_content.sql",
  import.meta.url,
);

const fields = [
  "results_eyebrow",
  "results_unknown_time_notice",
  "results_sun_role",
  "results_sun_blurb",
  "results_moon_role",
  "results_moon_blurb",
  "results_rising_role",
  "results_rising_blurb",
  "results_reading_kicker",
  "results_sign_label",
  "results_house_label",
  "results_element_label",
  "results_positions_title",
  "results_zodiac_label",
  "results_body_header",
  "results_sign_header",
  "results_degree_header",
  "results_house_header",
  "results_aspects_title",
  "results_found_label",
  "results_conjunction_label",
  "results_harmonious_label",
  "results_challenging_label",
];

test("Birth Chart Results composes only approved prepared-data components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import ResultsShell from "\.\.\/\.\.\/shared\/ResultsShell\.astro"/);
  assert.match(source, /import PlanetPositionRow from "\.\.\/\.\.\/shared\/PlanetPositionRow\.astro"/);
  assert.match(source, /import AspectRow from "\.\.\/\.\.\/shared\/AspectRow\.astro"/);
  assert.match(source, /result: PreparedBirthChartResult/);
  assert.match(source, /chartInteractive/);
  assert.match(source, /data-result-planet-panel/);
  assert.match(source, /data-result-planet-row/);
  assert.doesNotMatch(source, /\bfetch\(|setTimeout|Math\.random|mock/i);
});

test("Birth Chart Results uses persisted provider readings on the dedicated slug route", async () => {
  const [experience, page, resultPage] = await Promise.all([
    readFile(experiencePath, "utf8"),
    readFile(pagePath, "utf8"),
    readFile(resultPagePath, "utf8"),
  ]);

  assert.match(experience, /result\?: PreparedBirthChartResult/);
  assert.match(experience, /resultHref\?: string/);
  assert.match(experience, /result \? \(/);
  assert.match(
    experience,
    /<BirthChartResults[\s\S]*copy=\{copy\}[\s\S]*locale=\{locale\}[\s\S]*result=\{result\}/,
  );
  assert.doesNotMatch(page, /dummyBirthChartResult|result=\{/);
  assert.match(page, /resultHref=\{localizePath\("\/birth-chart", locale\)\}/);
  assert.match(experience, /generated-site\/birth-chart/);
  assert.match(experience, /body\.readingId/);
  assert.match(resultPage, /getBirthChartReading/);
  assert.match(resultPage, /result=\{preparedResult\}/);
  assert.match(resultPage, /Astro\.redirect\(localizePath\("\/birth-chart", locale\)/);
  assert.doesNotMatch(resultPage, /dummyUnknownTimeBirthChartResult|alex-rivera/);
});

test("Birth Chart Results exposes exact and approximate time states", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /notice=\{result\.unknownTime \? copy\.results_unknown_time_notice : undefined\}/,
  );
  assert.match(
    source,
    /data-time-accuracy=\{result\.unknownTime \? "approximate" : "exact"\}/,
  );
});

test("Birth Chart Results copy is localized and exactly editable", async () => {
  const [component, copy, registry] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(copyPath, "utf8"),
    readFile(registryPath, "utf8"),
  ]);

  for (const field of fields) {
    assert.match(copy, new RegExp(`\\b${field}:`), `${field} is missing from locale copy`);
    assert.match(
      component,
      new RegExp(`(?:editAttributes\\("|(?:label|blurb)Field: ")${field}`),
      `${field} lacks an exact edit binding`,
    );
  }
  assert.match(registry, /getBirthChartResultsCopy/);
  assert.match(registry, /site_birth_chart_results/);
  assert.match(
    registry,
    /site_birth_chart_results"?, entry: "results"/,
  );
  assert.match(
    registry,
    /supplementalPageTargets|birthChartResultsFields/,
  );
  assert.match(copy, /satisfies Record<SupportedLocale, BirthChartResultsCopy>/);
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Birth Chart Results preserves responsive and accessible interaction states", async () => {
  const [component, styles] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(stylesPath, "utf8"),
  ]);

  assert.match(component, /aria-live="polite"/);
  assert.match(component, /addEventListener\("planetselect"/);
  assert.match(component, /setAttribute\("aria-pressed"/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 64rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
});

test("Birth Chart Results fields have an executable forward migration", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_birth_chart_results)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.match(
      migration,
      new RegExp(
        `ALTER TABLE ec_site_birth_chart_results ADD COLUMN ${field} TEXT;`,
      ),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
