import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const detailFields = Array.from({ length: 6 }, (_, reportIndex) => {
  const reportNumber = reportIndex + 1;
  return [
    `detail_report_${reportNumber}_long_description`,
    ...Array.from({ length: 5 }, (_, chapterIndex) => {
      const chapterNumber = chapterIndex + 1;
      return [
        `detail_report_${reportNumber}_chapter_${chapterNumber}_title`,
        `detail_report_${reportNumber}_chapter_${chapterNumber}_description`,
      ];
    }).flat(),
    `detail_report_${reportNumber}_sample`,
  ];
}).flat();

const sharedFields = [
  "detail_pdf_label",
  "detail_delivery_label",
  "detail_buy_label",
  "detail_purchase_note",
  "detail_inside_label",
  "detail_sample_label",
];

test("Reports detail panel composes the approved price and action atoms", async () => {
  const component = await read(
    "src/components/reports/sections/ReportsDetailPanel.astro",
  );

  assert.match(
    component,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(
    component,
    /import PriceDisplay from "\.\.\/\.\.\/shared\/PriceDisplay\.astro"/,
  );
  assert.match(
    component,
    /import MediaThumbnail from "\.\.\/\.\.\/shared\/MediaThumbnail\.astro"/,
  );
  assert.match(component, /<PriceDisplay/);
  assert.match(component, /<Button/);
  assert.match(component, /editAttributes=\{buyLabelEditAttributes\}/);
  assert.doesNotMatch(component, /disabled=\{Boolean\(paymentOrder\)\}/);
  assert.match(component, /type=\{csrfToken && profiles\.length > 0 \? "submit"/);
  assert.match(component, /\{csrfToken && profiles\.length > 0 \? \(/);
  assert.match(component, /order\?\.status === "paid"/);
  assert.match(component, /sessionStorage\.removeItem/);
  assert.match(component, /window\.addEventListener\("pageshow", resetReportPurchaseLoading\)/);
  assert.match(component, /setActionLoading\(submit, false\)/);
  assert.match(component, /chapters\.map\(\(chapter, index\) =>/);
  assert.match(component, /String\(index \+ 1\)\.padStart\(2, "0"\)/);
  assert.doesNotMatch(component, /The Natal Blueprint|Buy & generate|\$29/);
  assert.doesNotMatch(component, /OrderSummary/);
});

test("Reports detail panel preserves the literal reference geometry", async () => {
  const styles = await read("src/styles/reports/sections/detail-panel.css");

  assert.match(
    styles,
    /\.reports-detail-panel-shell\s*\{[^}]*padding: 0\.625rem 2\.125rem 5\.625rem[^}]*background: var\(--color-surface\)/s,
  );
  assert.match(
    styles,
    /\.reports-detail-panel\s*\{[^}]*max-inline-size: 62\.5rem[^}]*grid-template-columns: minmax\(0, 0\.85fr\) minmax\(0, 1\.15fr\)[^}]*gap: 3rem/s,
  );
  assert.match(
    styles,
    /\.reports-detail-panel__purchase\s*\{[^}]*position: sticky[^}]*inset-block-start: 5\.625rem/s,
  );
  assert.match(styles, /min-block-size: 18\.75rem/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-(?:button|price-display)__/);
});

test("each report slug maps prepared commerce data to localized detail copy", async () => {
  const page = await read("src/pages/reports/[slug].astro");

  assert.match(
    page,
    /import ReportsDetailPanel from "\.\.\/\.\.\/components\/reports\/sections\/ReportsDetailPanel\.astro"/,
  );
  assert.match(page, /const reportNumber = reportIndex \+ 1/);
  assert.match(page, /const detailPrefix = `detail_report_\$\{reportNumber\}`/);
  assert.match(page, /const chapters = Array\.from\(\{ length: 5 \}/);
  assert.match(page, /glyph=\{report\.glyph\}/);
  assert.match(page, /pagesLabel=\{report\.pages\}/);
  assert.match(page, /price=\{report\.price\}/);
  assert.match(page, /coverTone=\{report\.coverTone\}/);
  assert.match(page, /coverSrc=\{report\.imageUrl\}/);
  assert.match(page, /purchaseHref=\{localizePath\("\/account", locale\)\}/);
  assert.match(page, /builderEdit\(`\$\{detailPrefix\}_long_description`\)/);
  assert.match(page, /builderEdit\(`\$\{detailPrefix\}_sample`\)/);
  assert.match(page, /seo_robots: "index,follow"/);
});

test("detail copy is aligned and routed to bounded Content Studio targets", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getReportsDefaults, getReportsDetailDefaults } =
    await import("../../src/data/public-copy.ts");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");

  const englishDetailFields = Object.keys(getReportsDetailDefaults("en"));
  assert.deepEqual(englishDetailFields, detailFields);
  for (const locale of activeLocaleCodes) {
    const primary = getReportsDefaults(locale);
    const details = getReportsDetailDefaults(locale);
    for (const field of sharedFields) {
      assert.equal(
        typeof primary[field],
        "string",
        `${locale} missing ${field}`,
      );
      assert.notEqual(primary[field].trim(), "");
    }
    assert.deepEqual(Object.keys(details), englishDetailFields);
    for (const field of detailFields) {
      assert.equal(
        typeof details[field],
        "string",
        `${locale} missing ${field}`,
      );
      assert.notEqual(details[field].trim(), "");
    }
  }

  const config = getBuilderEntryConfig("site_report_details", "details");
  assert.ok(config);
  assert.equal(config.editableFields.length, detailFields.length);
  for (const field of detailFields) {
    assert.deepEqual(getBuilderFieldTarget(field, "reports"), {
      collection: "site_report_details",
      entry: "details",
    });
  }
  assert.deepEqual(getBuilderPageTargets("reports"), [
    { collection: "site_reports", entry: "reports" },
    { collection: "site_report_details", entry: "details" },
  ]);
});

test("Reports detail fields have a fresh-safe bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0051_reports_catalog_intro_content.sql"));
  sqlite.exec(await read("migrations/0052_reports_catalog_grid_content.sql"));
  sqlite.exec(
    await read("migrations/0054_reports_detail_navigation_content.sql"),
  );
  sqlite.exec(await read("migrations/0058_reports_detail_panel_content.sql"));

  const primaryColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_reports)")
      .all()
      .map((column) => column.name),
  );
  for (const field of sharedFields) {
    assert.equal(primaryColumns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(primaryColumns.size < 100);

  const detailColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_report_details)")
      .all()
      .map((column) => column.name),
  );
  for (const field of detailFields) {
    assert.equal(detailColumns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(detailColumns.size < 100);
  sqlite.close();
});
