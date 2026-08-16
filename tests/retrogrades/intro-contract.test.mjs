import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const editableFields = [
  "intro_eyebrow",
  "intro_title_lead",
  "intro_title_accent",
  "intro_title_suffix",
  "intro_description",
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

test("Retrogrades intro composes the approved centered PageIntro", async () => {
  const component = await read(
    "src/components/retrogrades/sections/RetrogradesIntro.astro",
  );

  assert.match(
    component,
    /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/,
  );
  assert.match(component, /<PageIntro/);
  assert.match(component, /alignment="center"/);
  assert.match(component, /density="standard"/);
  assert.match(component, /headingMeasure="full"/);
  assert.match(component, /class="retrogrades-intro"/);
  assert.match(component, /const fullTitle =/);
  assert.match(component, /<span \{\.\.\.titleLeadEditAttributes\}>/);
  assert.match(component, /<em\s+\{\.\.\.titleAccentEditAttributes\}>/);
  assert.match(component, /\{\.\.\.titleSuffixEditAttributes\}/);
  assert.match(component, /descriptionEditAttributes=\{descriptionEditAttributes\}/);
  assert.doesNotMatch(
    component,
    /What's retrograde|Tool · Retrogrades|A planet in retrograde/,
  );
});

test("Retrogrades intro preserves the approved widened measure and restraint", async () => {
  const styles = await read("src/styles/retrogrades/sections/intro.css");
  const pageStyles = await read("src/styles/retrogrades/retrogrades.css");

  assert.match(
    pageStyles,
    /\.retrogrades-page\s*\{[^}]*inline-size: 100%[^}]*max-inline-size: none[^}]*margin: 0[^}]*padding: 0/s,
  );
  assert.match(
    styles,
    /\.retrogrades-intro-shell\s*\{[^}]*padding: 4\.75rem 2\.125rem 1\.25rem[^}]*background: var\(--color-surface\)/s,
  );
  assert.match(
    styles,
    /\.retrogrades-intro\.sidera-page-intro\s*\{[^}]*max-inline-size: 54\.6875rem[^}]*margin-inline: auto[^}]*padding: 0[^}]*background: transparent/s,
  );
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
  assert.doesNotMatch(styles, /\.sidera-page-intro__/);
});

test("Retrogrades route mounts only the first approved section with real navigation", async () => {
  const page = await read("src/pages/retrogrades.astro");

  assert.match(page, /loadPublicPageContent\(Astro, "retrogrades"\)/);
  assert.match(
    page,
    /import Header from "\.\.\/components\/shared\/Header\.astro"/,
  );
  assert.match(
    page,
    /import RetrogradesIntro from "\.\.\/components\/retrogrades\/sections\/RetrogradesIntro\.astro"/,
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
  assert.match(
    page,
    /import Footer from "\.\.\/components\/shared\/Footer\.astro"/,
  );
  assert.match(page, /const footerGroups = \[/);
  assert.match(page, /const footerLegalLinks = \[/);
  assert.match(page, /<Footer/);
  assert.match(page, /groups=\{footerGroups\}/);
  assert.match(page, /legalLinks=\{footerLegalLinks\}/);
  assert.match(page, /chromeEdit\("footer_brand_name"\)/);
  assert.doesNotMatch(
    page,
    /StatusDot|PlanetPositionRow|CardGrid|FinalCtaSection/,
  );
});

test("Retrogrades completes the Content Studio first-section gate", async () => {
  const page = await read("src/pages/retrogrades.astro");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
    getBuilderReleaseTargets,
  } = await import("../../src/builder/registry.ts");

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

  for (const field of editableFields) {
    assert.deepEqual(getBuilderFieldTarget(field, "retrogrades"), {
      collection: "site_retrogrades",
      entry: "retrogrades",
    });
  }
  assert.deepEqual(getBuilderPageTargets("retrogrades"), [
    { collection: "site_retrogrades", entry: "retrogrades" },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_retrogrades" &&
        target.entry === "retrogrades",
    ),
    true,
  );

  const config = getBuilderEntryConfig("site_retrogrades", "retrogrades");
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }
});

test("all active locales provide aligned Retrogrades intro and SEO", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getRetrogradesDefaults } = await import(
    "../../src/data/public-copy.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getRetrogradesDefaults(locale);
    assert.deepEqual(
      Object.keys(defaults),
      Object.keys(getRetrogradesDefaults("en")),
    );
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/retrogrades");
  }
});

test("Retrogrades intro fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0048_retrogrades_intro_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_retrogrades)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
