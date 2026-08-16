import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/terms/sections/TermsLegalDocument.astro",
  import.meta.url,
);
const componentStylesPath = new URL(
  "../../src/styles/terms/sections/legal-document.css",
  import.meta.url,
);
const pageStylesPath = new URL(
  "../../src/styles/terms/terms.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/terms.astro", import.meta.url);
const registryPath = new URL("../../src/builder/registry.ts", import.meta.url);

test("Terms page composes the complete approved shared legal surface", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import LegalDocumentLayout from "\.\.\/\.\.\/shared\/LegalDocumentLayout\.astro"/,
  );
  assert.match(source, /<LegalDocumentLayout/);
  assert.match(source, /sections=\{sections\.map/);
  assert.match(source, /paragraphs: \[section\.body\]/);
  assert.match(source, /headingEditAttributes: section\.titleEditAttributes/);
  assert.match(source, /paragraphEditAttributes: \[section\.bodyEditAttributes \?\? \{\}\]/);
  assert.match(source, /contactPrefix=\{contactText\}/);
  assert.match(source, /contactEditAttributes=\{contactEditAttributes\}/);
  assert.match(source, /eyebrowEditAttributes=\{eyebrowEditAttributes\}/);
  assert.match(source, /titleEditAttributes=\{titleEditAttributes\}/);
  assert.match(source, /updatedEditAttributes=\{updatedEditAttributes\}/);
  assert.match(source, /data-terms-legal-document/);
});

test("Terms route mounts the complete document and shared footer with real localized navigation", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(source, /import Footer from "\.\.\/components\/shared\/Footer\.astro"/);
  assert.match(
    source,
    /import TermsLegalDocument from "\.\.\/components\/terms\/sections\/TermsLegalDocument\.astro"/,
  );
  assert.match(source, /loadPublicPageContent\(Astro, "terms"\)/);
  for (const destination of [
    "/todays-sky",
    "/birth-chart",
    "/synastry",
    "/moon-calendar",
    "/daily-horoscope",
    "/astrologers",
    "/blog",
    "/login",
  ]) {
    assert.match(
      source,
      new RegExp(
        `localizePath\\("${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}", locale\\)`,
      ),
    );
  }
  for (const destination of [
    "/transit",
    "/retrogrades",
    "/reports",
    "/glossary",
    "/faq",
    "/about",
    "/account",
    "/shop",
    "/privacy",
    "/terms",
  ]) {
    assert.match(source, new RegExp(`"${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }
  assert.match(source, /href: localizePath\(path, locale\)/);
  assert.match(source, /const termsSections = Array\.from\(\{ length: 10 \}/);
  assert.match(source, /<TermsLegalDocument/);
  assert.match(source, /sections=\{termsSections\}/);
  assert.match(source, /contactText=\{content\.terms_contact_text\}/);
  assert.match(source, /<Footer/);
  assert.match(source, /groups=\{footerGroups\}/);
  assert.match(source, /legalLinks=\{footerLegalLinks\}/);
});

test("Terms completes the Content Studio first-section gate", async () => {
  const page = await readFile(pagePath, "utf8");
  const registry = await readFile(registryPath, "utf8");
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );

  for (const toolbarField of [
    "launcherEnabled: builder.launcherEnabled",
    "studioModeEnabled: builder.studioModeEnabled",
    "collection: builder.collection",
    "entry: builder.entry",
    "locale: builder.locale",
    "csrfToken: builder.csrfToken",
    "canPublish: builder.canPublish",
    "seo: seoContent",
    "reviewTargets",
  ]) {
    assert.match(
      page,
      new RegExp(toolbarField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.match(
    page,
    /hasSavedDraft: builderPage\.hasSavedDraft \|\| chromePage\.hasSavedDraft/,
  );
  for (const field of [
    "terms_legal_eyebrow",
    "terms_title",
    "terms_updated_label",
    "terms_contact_text",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
  assert.match(page, /builderEdit\(titleField\)/);
  assert.match(page, /builderEdit\(bodyField\)/);
  assert.match(page, /value === true \? "true" : value/);
  assert.match(page, /const field = `language_option_\$\{item\.code\}_label`/);
  assert.match(page, /editAttributes: componentEditAttributes\(chromeEdit\(field\)\)/);
  assert.match(registry, /\["site_pages\/terms", entries\[3\]\]/);
  assert.deepEqual(getBuilderPageTargets("terms"), [
    { collection: "site_pages", entry: "terms" },
  ]);

  const termsConfig = getBuilderEntryConfig("site_pages", "terms");
  assert.ok(termsConfig);
  const fields = new Set(termsConfig.editableFields.map((field) => field.slug));
  for (const field of [
    "terms_legal_eyebrow",
    "terms_title",
    "terms_updated_label",
    "terms_section_1_title",
    "terms_section_1_body",
    "terms_section_10_title",
    "terms_section_10_body",
    "terms_contact_text",
    "seo_title",
    "seo_description",
  ]) {
    assert.equal(fields.has(field), true, `Terms should register ${field}`);
  }
});

test("all active locales provide aligned complete Terms and shared footer defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getTermsDefaults } = await import("../../src/data/public-copy.ts");
  const requiredFields = [
    "terms_legal_eyebrow",
    "terms_title",
    "terms_updated_label",
    ...Array.from({ length: 10 }, (_, index) => [
      `terms_section_${index + 1}_title`,
      `terms_section_${index + 1}_body`,
    ]).flat(),
    "terms_contact_text",
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

  assert.deepEqual(activeLocaleCodes, ["en", "es", "fr", "pt", "ru", "it", "de"]);
  for (const locale of activeLocaleCodes) {
    const defaults = getTermsDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), Object.keys(getTermsDefaults("en")).sort());
    for (const field of requiredFields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/terms");
  }

  const { getChromeDefaults } = await import("../../src/data/public-copy.ts");
  const footerFields = [
    "footer_brand_name",
    "footer_about",
    "footer_navigation_label",
    "footer_legal_navigation_label",
    "footer_group_charts",
    "footer_link_birth_chart",
    "footer_link_terms",
    "footer_copyright",
  ];
  for (const locale of activeLocaleCodes) {
    const defaults = getChromeDefaults(locale);
    for (const field of footerFields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Terms styles retain the legal reference surface without reaching into shared internals", async () => {
  const componentStyles = await readFile(componentStylesPath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(componentStyles, /min-block-size: calc\(100svh - 4\.75rem\)/);
  assert.match(componentStyles, /@supports \(min-block-size: 100dvh\)/);
  assert.match(pageStyles, /background: var\(--color-surface\)/);
  assert.match(pageStyles, /inline-size: 100%/);
  assert.doesNotMatch(componentStyles, /\.legal-document-layout__/);
  assert.doesNotMatch(pageStyles, /\.sidera-header__/);
});

test("final Terms and shared footer fields have an executable forward migration", async () => {
  const [homeMigration, parallelMigration, termsMigration] = await Promise.all([
    readFile(new URL("../../migrations/0009_home_today_sky_content.sql", import.meta.url), "utf8"),
    readFile(
      new URL("../../migrations/0010_content_studio_parallel_page_fields.sql", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../../migrations/0014_terms_document_and_footer_content.sql", import.meta.url),
      "utf8",
    ),
  ]);
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(homeMigration);
  sqlite.exec(parallelMigration);
  sqlite.exec(termsMigration);

  const pageColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_pages)")
      .all()
      .map((column) => column.name),
  );
  const chromeColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_chrome)")
      .all()
      .map((column) => column.name),
  );

  for (let index = 1; index <= 10; index += 1) {
    assert.equal(pageColumns.has(`terms_section_${index}_title`), true);
    assert.equal(pageColumns.has(`terms_section_${index}_body`), true);
  }
  assert.equal(pageColumns.has("terms_contact_text"), true);
  for (const field of [
    "footer_navigation_label",
    "footer_group_charts",
    "footer_link_birth_chart",
    "footer_link_terms",
    "footer_copyright",
  ]) {
    assert.equal(chromeColumns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});
