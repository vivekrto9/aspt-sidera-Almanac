import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeReports.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-reports.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0033_home_reports_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_reports_eyebrow",
  "home_reports_title_accent",
  "home_reports_title_rest",
  "home_reports_browse_label",
  ...Array.from({ length: 3 }, (_, index) => [
    `home_reports_report_${index + 1}_title`,
    `home_reports_report_${index + 1}_description`,
    `home_reports_report_${index + 1}_pages`,
    `home_reports_report_${index + 1}_price`,
    `home_reports_report_${index + 1}_action`,
  ]).flat(),
];

test("Home Reports composes the approved shared report components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(source, /import CardGrid[\s\S]*shared\/CardGrid\.astro/);
  assert.match(source, /import ReportCard[\s\S]*shared\/ReportCard\.astro/);
  assert.match(
    source,
    /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/,
  );
  assert.match(source, /columns=\{3\}/);
  assert.match(source, /tabletColumns=\{2\}/);
  assert.match(source, /mobileColumns=\{1\}/);
  assert.match(source, /variant="compact"/);
  assert.doesNotMatch(source, /<script|fetch\(|localStorage|sessionStorage/);
});

test("Home Reports keeps editorial copy editable and operational values dynamic", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const field of ["title", "description", "action"]) {
    assert.match(
      source,
      new RegExp(`EditAttributes=\\{edit\\("${field}"\\)\\}`),
    );
  }
  assert.doesNotMatch(source, /pagesEditAttributes=\{edit\("pages"\)\}/);
  assert.doesNotMatch(source, /priceEditAttributes=\{edit\("price"\)\}/);
  assert.match(source, /href=\{report\.href \?\? actionHref\}/);
  assert.match(source, /editAttributes\("browse_label"\)/);
  assert.match(source, /editAttributes\("eyebrow"\)/);
  assert.match(source, /editAttributes\("title_accent"\)/);
  assert.match(source, /editAttributes\("title_rest"\)/);
});

test("Home Reports matches the Meridian measure and responsive surface", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-bg\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.5rem/);
  assert.match(styles, /margin-block-start: 2\.25rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Reports with localized navigation and edit prefix", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeReports from "\.\.\/components\/home\/sections\/HomeReports\.astro"/,
  );
  assert.match(source, /<HomeReports/);
  assert.match(source, /listReportProducts\(runtimeEnv, locale\)/);
  assert.match(source, /actionHref=\{localizePath\("\/reports", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_reports_\$\{field\}`\)\)/,
  );
});

test("all active locales provide three aligned reports in a bounded target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeReportsCopy } =
    await import("../../src/data/locale/home/sections/reports.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_reports", "home");
  const registeredFields = new Set(
    config?.editableFields.map((field) => field.slug),
  );

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(
    getBuilderFieldTarget("home_reports_report_3_action", "home"),
    { collection: "site_home_reports", entry: "home" },
  );
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) =>
        target.collection === "site_home_reports" && target.entry === "home",
    ),
  );

  for (const field of editableFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
  }

  for (const locale of activeLocaleCodes) {
    const copy = getHomeReportsCopy(locale);
    const defaults = getHomeDefaults(locale);
    assert.equal(
      copy.reports.length,
      3,
      `${locale} must provide three reports`,
    );
    for (const field of editableFields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
  }
});

test("Home Reports migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  const migration = await readFile(migrationPath, "utf8");
  sqlite.exec(migration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_reports)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(
    columns.size < 100,
    "bounded collection must remain under D1's column cap",
  );

  sqlite.close();
});
