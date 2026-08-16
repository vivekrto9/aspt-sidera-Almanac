import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const gridFields = [
  "catalog_grid_aria_label",
  ...Array.from({ length: 6 }, (_, index) => {
    const reportNumber = index + 1;
    return [
      `catalog_report_${reportNumber}_title`,
      `catalog_report_${reportNumber}_description`,
      `catalog_report_${reportNumber}_action_label`,
    ];
  }).flat(),
];

test("Reports Catalog grid composes only approved shared cards", async () => {
  const component = await read(
    "src/components/reports/sections/ReportsCatalogGrid.astro",
  );

  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(
    component,
    /import ReportCard from "\.\.\/\.\.\/shared\/ReportCard\.astro"/,
  );
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /variant="featured"/);
  assert.match(component, /headingLevel=\{2\}/);
  assert.doesNotMatch(
    component,
    /The Natal Blueprint|Year Ahead Forecast|\$29/,
  );
});

test("Reports Catalog grid preserves the exact reference geometry", async () => {
  const styles = await read("src/styles/reports/sections/catalog-grid.css");

  assert.match(
    styles,
    /\.reports-catalog-grid-shell\s*\{[^}]*padding: 1\.875rem 2\.125rem 6rem[^}]*background: var\(--color-surface\)/s,
  );
  assert.match(
    styles,
    /\.reports-catalog-grid\s*\{[^}]*--sidera-card-grid-gap: 1\.5rem[^}]*max-inline-size: 70rem[^}]*margin-inline: auto/s,
  );
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-report-card__/);
  assert.doesNotMatch(styles, /\.sidera-card-grid__/);
});

test("Report catalog operational data stays prepared and bounded", async () => {
  const source = await read("src/data/reports/catalog.ts");
  const { reportCatalog } = await import("../../src/data/reports/catalog.ts");

  assert.equal(reportCatalog.length, 6);
  assert.deepEqual(
    reportCatalog.map((report) => report.slug),
    [
      "natal-blueprint",
      "year-ahead-forecast",
      "relationship-synastry",
      "solar-return-report",
      "career-vocation",
      "saturn-return-report",
    ],
  );
  for (const report of reportCatalog) {
    assert.match(report.pages, /^\d+ pages$/);
    assert.match(report.price, /^\$\d+$/);
    assert.notEqual(report.glyph.trim(), "");
  }
  assert.doesNotMatch(source, /description|long|sample|toc/);
});

test("Reports route maps six cards to localized detail destinations and exact edit fields", async () => {
  const page = await read("src/pages/reports.astro");

  assert.match(
    page,
    /import ReportsCatalogGrid from "\.\.\/components\/reports\/sections\/ReportsCatalogGrid\.astro"/,
  );
  assert.match(
    page,
    /import \{ reportCatalog \} from "\.\.\/data\/reports\/catalog\.ts"/,
  );
  assert.match(page, /listReportProducts\(runtimeEnv, locale\)/);
  assert.match(page, /const reports = catalogProducts\.flatMap\(\(report\) =>/);
  assert.match(page, /coverSrc: report\.imageUrl/);
  assert.match(
    page,
    /href: localizePath\(`\/reports\/\$\{report\.slug\}`, locale\)/,
  );
  assert.match(page, /builderEdit\(titleField\)/);
  assert.match(page, /builderEdit\(descriptionField\)/);
  assert.match(page, /builderEdit\(actionField\)/);
  assert.match(
    page,
    /<ReportsCatalogGrid\s+ariaLabel=\{content\.catalog_grid_aria_label\}\s+reports=\{reports\}/s,
  );
  assert.doesNotMatch(page, /localizePath\("\/solar-return", locale\)/);
});

test("all locales provide aligned editable Catalog grid copy", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getReportsDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");

  const englishFields = Object.keys(getReportsDefaults("en"));
  for (const locale of activeLocaleCodes) {
    const defaults = getReportsDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishFields);
    for (const field of gridFields) {
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
    }
  }

  const config = getBuilderEntryConfig("site_reports", "reports");
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of gridFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
    assert.deepEqual(getBuilderFieldTarget(field, "reports"), {
      collection: "site_reports",
      entry: "reports",
    });
  }
});

test("Reports Catalog grid fields have an executable forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0051_reports_catalog_intro_content.sql"));
  sqlite.exec(await read("migrations/0052_reports_catalog_grid_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_reports)")
      .all()
      .map((column) => column.name),
  );

  for (const field of gridFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
