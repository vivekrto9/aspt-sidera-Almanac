import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const editableFields = [
  "catalog_intro_eyebrow",
  "catalog_intro_title_accent",
  "catalog_intro_title_suffix",
  "catalog_intro_description",
  "seo_title",
  "seo_description",
  "seo_canonical_path",
  "seo_robots",
  "og_title",
  "og_description",
  "og_image",
  "og_image_alt",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
];

test("Reports catalog intro composes the approved centered PageIntro", async () => {
  const component = await read(
    "src/components/reports/sections/ReportsCatalogIntro.astro",
  );

  assert.match(
    component,
    /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/,
  );
  assert.match(component, /<PageIntro/);
  assert.match(component, /alignment="center"/);
  assert.match(component, /density="standard"/);
  assert.match(component, /class="reports-catalog-intro"/);
  assert.match(component, /<em \{\.\.\.titleAccentEditAttributes\}>/);
  assert.match(component, /\{\.\.\.titleSuffixEditAttributes\}/);
  assert.match(component, /descriptionEditAttributes=\{descriptionEditAttributes\}/);
  assert.doesNotMatch(
    component,
    /In-depth|written reports|Hand-structured interpretations/,
  );
});

test("Reports intro preserves the exact reference measure and restraint", async () => {
  const styles = await read("src/styles/reports/sections/catalog-intro.css");
  const pageStyles = await read("src/styles/reports/reports.css");

  assert.match(
    pageStyles,
    /\.reports-page\s*\{[^}]*inline-size: 100%[^}]*max-inline-size: none[^}]*margin: 0[^}]*padding: 0/s,
  );
  assert.match(
    styles,
    /\.reports-catalog-intro-shell\s*\{[^}]*padding: 4\.75rem 2\.125rem 1\.875rem[^}]*background: var\(--color-surface\)/s,
  );
  assert.match(
    styles,
    /\.reports-catalog-intro\.sidera-page-intro\s*\{[^}]*max-inline-size: 42\.5rem[^}]*margin-inline: auto[^}]*padding: 0[^}]*background: transparent/s,
  );
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
  assert.doesNotMatch(styles, /\.sidera-page-intro__/);
});

test("Reports route retains Catalog intro with real localized navigation", async () => {
  const page = await read("src/pages/reports.astro");

  assert.match(page, /loadPublicPageContent\(Astro, "reports"\)/);
  assert.match(
    page,
    /import Header from "\.\.\/components\/shared\/Header\.astro"/,
  );
  assert.match(
    page,
    /import Footer from "\.\.\/components\/shared\/Footer\.astro"/,
  );
  assert.match(
    page,
    /import ReportsCatalogIntro from "\.\.\/components\/reports\/sections\/ReportsCatalogIntro\.astro"/,
  );
  for (const path of [
    "/",
    "/todays-sky",
    "/birth-chart",
    "/synastry",
    "/moon-calendar",
    "/daily-horoscope",
    "/astrologers",
    "/blog",
    "/login",
  ]) {
    assert.match(page, new RegExp(`localizePath\\("${path}", locale\\)`));
  }
  assert.match(page, /mobileUtilityActionId="sign-in"/);
  assert.match(
    page,
    /const field = `language_option_\$\{item\.code\}_label`/,
  );
  assert.match(page, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.doesNotMatch(page, /PriceDisplay|OrderSummary/);
});

test("Reports completes the Content Studio Catalog intro gate", async () => {
  const page = await read("src/pages/reports.astro");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
    getBuilderReleaseTargets,
  } = await import("../../src/builder/registry.ts");

  for (const field of editableFields) {
    assert.deepEqual(getBuilderFieldTarget(field, "reports"), {
      collection: "site_reports",
      entry: "reports",
    });
  }
  assert.deepEqual(getBuilderPageTargets("reports"), [
    { collection: "site_reports", entry: "reports" },
    { collection: "site_report_details", entry: "details" },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_reports" && target.entry === "reports",
    ),
    true,
  );
  assert.match(
    page,
    /hasSavedDraft: builderPage\.hasSavedDraft \|\| chromePage\.hasSavedDraft/,
  );
  assert.match(page, /reviewTargets/);

  const config = getBuilderEntryConfig("site_reports", "reports");
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }
});

test("all active locales provide aligned Reports intro and SEO", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getReportsDefaults } = await import(
    "../../src/data/public-copy.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getReportsDefaults(locale);
    assert.deepEqual(Object.keys(defaults), Object.keys(getReportsDefaults("en")));
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/reports");
  }
});

test("Reports Catalog intro fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0051_reports_catalog_intro_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_reports)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
