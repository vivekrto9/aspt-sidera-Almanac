import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Reports detail navigation composes the approved exact-node Button", async () => {
  const component = await read(
    "src/components/reports/sections/ReportsDetailNavigation.astro",
  );

  assert.match(
    component,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(component, /data-screen-label="Reports · Detail"/);
  assert.match(component, /<nav[\s\S]+aria-label=\{backLabel\}/);
  assert.match(component, /href=\{backHref\}/);
  assert.match(component, /variant="link"/);
  assert.match(component, /editAttributes=\{backLabelEditAttributes\}/);
  assert.match(component, /<span slot="leading-icon">←<\/span>/);
  assert.doesNotMatch(
    component,
    /backLabelEditAttributes[\s\S]*<span slot="leading-icon"[^]*backLabelEditAttributes/s,
  );
});

test("Reports detail navigation preserves the literal reference measure", async () => {
  const styles = await read(
    "src/styles/reports/sections/detail-navigation.css",
  );

  assert.match(
    styles,
    /\.reports-detail-navigation-shell\s*\{[^}]*padding: 2\.125rem 2\.125rem 1\.25rem[^}]*background: var\(--color-surface\)/s,
  );
  assert.match(
    styles,
    /\.reports-detail-navigation\s*\{[^}]*max-inline-size: 62\.5rem[^}]*margin-inline: auto/s,
  );
  assert.match(styles, /gap: 0\.4375rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-button__/);
});

test("all six report slugs resolve to the detail navigation shell", async () => {
  const page = await read("src/pages/reports/[slug].astro");
  const { reportCatalog } = await import("../../src/data/reports/catalog.ts");

  assert.equal(reportCatalog.length, 6);
  assert.match(
    page,
    /reportCatalog\.findIndex\(\(report\) => report\.slug === slug\)/,
  );
  assert.match(
    page,
    /return Astro\.redirect\(localizePath\("\/reports", locale\)\)/,
  );
  assert.match(page, /loadPublicPageContent\(Astro, "reports"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<ReportsDetailNavigation/);
  assert.match(page, /backHref=\{localizePath\("\/reports", locale\)\}/);
  assert.match(page, /backLabel=\{content\.detail_back_label\}/);
  assert.match(page, /builderEdit\("detail_back_label"\)/);
  assert.match(page, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.doesNotMatch(
    page,
    /ReportsDetailPurchase|PriceDisplay|OrderSummary|Buy &amp; generate/,
  );
});

test("detail navigation copy is localized, registered, and migrated", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getReportsDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");

  for (const locale of activeLocaleCodes) {
    const value = getReportsDefaults(locale).detail_back_label;
    assert.equal(typeof value, "string");
    assert.notEqual(value.trim(), "");
  }

  const config = getBuilderEntryConfig("site_reports", "reports");
  assert.ok(config);
  assert.equal(
    config.editableFields.some((field) => field.slug === "detail_back_label"),
    true,
  );
  assert.deepEqual(getBuilderFieldTarget("detail_back_label", "reports"), {
    collection: "site_reports",
    entry: "reports",
  });

  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0051_reports_catalog_intro_content.sql"));
  sqlite.exec(await read("migrations/0052_reports_catalog_grid_content.sql"));
  sqlite.exec(
    await read("migrations/0054_reports_detail_navigation_content.sql"),
  );
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_reports)")
      .all()
      .map((column) => column.name),
  );
  assert.equal(columns.has("detail_back_label"), true);
  sqlite.close();
});
