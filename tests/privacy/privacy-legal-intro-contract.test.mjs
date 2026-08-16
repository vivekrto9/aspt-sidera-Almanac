import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";

const pagePath = new URL("../../src/pages/privacy.astro", import.meta.url);
const componentPath = new URL(
  "../../src/components/privacy/sections/PrivacyLegalDocument.astro",
  import.meta.url,
);
const registryPath = new URL("../../src/builder/registry.ts", import.meta.url);
const pageStylesPath = new URL(
  "../../src/styles/privacy/privacy.css",
  import.meta.url,
);
const componentStylesPath = new URL(
  "../../src/styles/privacy/sections/privacy-legal-document.css",
  import.meta.url,
);

test("Privacy composes the complete approved legal document and Footer", async () => {
  const [page, component] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(componentPath, "utf8"),
  ]);

  assert.match(page, /import PrivacyLegalDocument/);
  assert.match(page, /import Footer from "\.\.\/components\/shared\/Footer\.astro"/);
  assert.match(page, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(page, /<PrivacyLegalDocument/);
  assert.match(page, /<Footer/);
  assert.match(page, /Array\.from\(\{ length: 10 \}/);
  assert.match(page, /contactText=\{content\.privacy_contact_text\}/);
  assert.match(component, /import LegalDocumentLayout/);
  assert.match(component, /sections=\{sections\.map/);
  assert.match(component, /contactPrefix=\{contactText\}/);
  assert.match(component, /class="privacy-legal-document"/);
});

test("Privacy route localizes real header destinations", async () => {
  const page = await readFile(pagePath, "utf8");

  for (const destination of [
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
    assert.match(
      page,
      new RegExp(`"${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
    );
  }
  assert.match(page, /localizePath\("\/birth-chart", locale\)/);
  assert.doesNotMatch(page, /href:\s*"#"/);
});

test("Privacy completes the Content Studio first-section gate", async () => {
  const [page, registry] = await Promise.all([
    readFile(pagePath, "utf8"),
    readFile(registryPath, "utf8"),
  ]);
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
    "privacy_legal_eyebrow",
    "privacy_title",
    "privacy_updated_label",
    "privacy_contact_text",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
  assert.match(page, /const titleField = `privacy_section_\$\{itemNumber\}_title`/);
  assert.match(page, /const bodyField = `privacy_section_\$\{itemNumber\}_body`/);
  assert.match(page, /builderEdit\(titleField\)/);
  assert.match(page, /builderEdit\(bodyField\)/);
  assert.match(page, /value === true \? "true" : value/);
  assert.match(page, /const field = `language_option_\$\{item\.code\}_label`/);
  assert.match(
    registry,
    /site_privacy[\s\S]*getPrivacyDefaults|privacy[\s\S]*site_privacy/,
  );
  assert.deepEqual(getBuilderPageTargets("privacy"), [
    { collection: "site_privacy", entry: "privacy" },
  ]);

  const privacyConfig = getBuilderEntryConfig("site_privacy", "privacy");
  assert.ok(privacyConfig);
  const fields = new Set(
    privacyConfig.editableFields.map((field) => field.slug),
  );
  for (const field of [
    "privacy_legal_eyebrow",
    "privacy_title",
    "privacy_updated_label",
    "privacy_section_1_title",
    "privacy_section_1_body",
    "privacy_section_10_title",
    "privacy_section_10_body",
    "privacy_contact_text",
    "seo_title",
    "seo_description",
  ]) {
    assert.equal(fields.has(field), true, `Privacy should register ${field}`);
  }
});

test("all seven locales provide aligned Privacy intro and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getPrivacyDefaults } = await import("../../src/data/public-copy.ts");
  const requiredFields = [
    "privacy_legal_eyebrow",
    "privacy_title",
    "privacy_updated_label",
    "seo_title",
    "seo_description",
    "seo_canonical_path",
    "og_title",
    "twitter_title",
  ];

  assert.equal(activeLocaleCodes.length, 7);
  for (const locale of activeLocaleCodes) {
    const defaults = getPrivacyDefaults(locale);
    for (const field of requiredFields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} should provide ${field}`,
      );
      assert.notEqual(defaults[field].trim(), "");
    }
    assert.equal(defaults.seo_canonical_path, "/privacy");
  }

  assert.equal(getPrivacyDefaults("en").privacy_title, "Privacy Policy");
  assert.equal(
    getPrivacyDefaults("de").privacy_title,
    "Datenschutzerklärung",
  );
  assert.equal(
    getPrivacyDefaults("en").privacy_section_1_body,
    "This policy explains what we collect, why, and the control you have. We collect as little as possible and never sell your data.",
  );
  assert.equal(
    getPrivacyDefaults("en").privacy_contact_text,
    "Questions? Reach us at hello@sidera.co.",
  );
});

test("Privacy document preserves the legal reference surface responsively", async () => {
  const [pageStyles, componentStyles] = await Promise.all([
    readFile(pageStylesPath, "utf8"),
    readFile(componentStylesPath, "utf8"),
  ]);

  assert.match(pageStyles, /background: var\(--color-surface\)/);
  assert.match(pageStyles, /inline-size: 100%/);
  assert.match(componentStyles, /min-block-size: calc\(100svh - 4\.75rem\)/);
  assert.match(componentStyles, /@supports \(min-block-size: 100dvh\)/);
  assert.doesNotMatch(componentStyles, /\.legal-document-layout__/);
  assert.doesNotMatch(pageStyles, /\.sidera-header__/);
});

test("Privacy migrations materialize the complete bounded collection", async () => {
  const [introMigration, documentMigration] = await Promise.all([
    readFile(
      new URL(
        "../../migrations/0020_privacy_legal_intro_content.sql",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../../migrations/0023_privacy_document_and_contact.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(introMigration);
  sqlite.exec(documentMigration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_privacy)")
      .all()
      .map((column) => column.name),
  );
  for (const field of [
    "privacy_legal_eyebrow",
    "privacy_title",
    "privacy_updated_label",
    "privacy_section_1_title",
    "privacy_section_1_body",
    "privacy_section_10_title",
    "privacy_section_10_body",
    "privacy_contact_text",
    "seo_title",
    "seo_description",
  ]) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});
