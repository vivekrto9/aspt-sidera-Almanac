import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const fields = [
  "report_eyebrow",
  "report_title",
  "report_description",
  "report_primary_label",
  "report_secondary_label",
];

test("Natal report handoff composes the approved reference treatment", async () => {
  const [section, results, slugPage] = await Promise.all([
    read(
      "src/components/birth-chart/sections/BirthChartNatalReportHandoff.astro",
    ),
    read("src/components/birth-chart/sections/BirthChartResults.astro"),
    read("src/pages/birth-chart/[slug].astro"),
  ]);

  assert.match(
    section,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(section, /tone="dark"/);
  assert.match(section, /layout="split"/);
  assert.match(section, /surface="panel"/);
  assert.match(section, /\n  ambience\n/);
  assert.match(section, /primaryHref="\/reports"/);
  assert.match(section, /secondaryHref="\/birth-chart"/);
  assert.match(section, /locale=\{locale\}/);
  assert.match(results, /<BirthChartNatalReportHandoff/);
  assert.match(results, /locale=\{locale\}/);
  assert.match(slugPage, /locale=\{locale\}/);
  assert.match(
    slugPage,
    /import Header from "\.\.\/\.\.\/components\/shared\/Header\.astro"/,
  );
  assert.match(
    slugPage,
    /import Footer from "\.\.\/\.\.\/components\/shared\/Footer\.astro"/,
  );
  assert.match(slugPage, /<Header[\s\S]*navigation=\{navigation\}/);
  assert.match(slugPage, /<Footer[\s\S]*groups=\{footerGroups\}/);
  assert.match(slugPage, /chromeEdit\("footer_brand_name"\)/);
  assert.doesNotMatch(section, /\bfetch\(|Math\.random|setTimeout/);
});

test("Natal report handoff copy is localized and exactly editable", async () => {
  const [section, copy, resultsCopy, registry] = await Promise.all([
    read(
      "src/components/birth-chart/sections/BirthChartNatalReportHandoff.astro",
    ),
    read(
      "src/data/locale/birth-chart/sections/natal-report-handoff.ts",
    ),
    read("src/data/locale/birth-chart/sections/results.ts"),
    read("src/builder/registry.ts"),
  ]);

  for (const field of fields) {
    assert.match(copy, new RegExp(`\\b${field}:`), `${field} is missing`);
    assert.match(
      section,
      new RegExp(`editAttributes\\("${field}"\\)`),
      `${field} lacks an exact edit binding`,
    );
  }

  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`), `${locale} is missing`);
    assert.match(
      resultsCopy,
      new RegExp(`getBirthChartNatalReportHandoffCopy\\("${locale}"\\)`),
    );
  }

  assert.match(
    copy,
    /satisfies Record<SupportedLocale, BirthChartNatalReportHandoffCopy>/,
  );
  assert.match(resultsCopy, /BirthChartNatalReportHandoffCopy/);
  assert.match(registry, /getBirthChartResultsCopy/);
  assert.match(registry, /site_birth_chart_results/);
});

test("Natal report handoff fields have an executable forward migration", async () => {
  const [resultsMigration, handoffMigration] = await Promise.all([
    read("migrations/0026_birth_chart_results_content.sql"),
    read("migrations/0032_birth_chart_natal_report_handoff_content.sql"),
  ]);
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(resultsMigration);
  sqlite.exec(handoffMigration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_birth_chart_results)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.match(
      handoffMigration,
      new RegExp(
        `ALTER TABLE ec_site_birth_chart_results ADD COLUMN ${field} TEXT;`,
      ),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
