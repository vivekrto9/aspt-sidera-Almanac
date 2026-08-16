import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/todays-sky/sections/TodaysSkyPageHeader.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/todays-sky/sections/todays-sky-page-header.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/todays-sky.astro", import.meta.url);
const registryPath = new URL(
  "../../src/builder/registry.ts",
  import.meta.url,
);

test("Today's Sky page header composes the approved shared PageIntro", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/);
  assert.match(source, /<PageIntro/);
  assert.match(source, /headingLevel|title=\{`\$\{titleAccent\}\$\{titleSuffix\}`\}/);
  assert.match(source, /<em \{\.\.\.titleAccentEditAttributes\}>/);
  assert.match(source, /\{\.\.\.titleSuffixEditAttributes\}/);
  assert.match(source, /\{\.\.\.metaPrimaryEditAttributes\}/);
  assert.match(source, /\{\.\.\.metaSecondaryEditAttributes\}/);
  assert.doesNotMatch(
    source,
    /Today's Sky|The sky|Geocentric|Tropical zodiac/,
  );
});

test("Today's Sky page header preserves the literal reference geometry", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(
    styles,
    /\.todays-sky-page-header\.sidera-page-intro\s*\{[^}]*padding: 2\.875rem 2\.125rem 0/s,
  );
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.match(styles, /min-inline-size: min\(100%, 20rem\)/);
  assert.match(styles, /font-size: 0\.84375rem/);
  assert.match(styles, /text-align: end/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /text-align: start/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("Today's Sky route mounts only the approved first section with real localized links", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /loadPublicPageContent\(Astro, "todays_sky"\)/);
  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(
    source,
    /import TodaysSkyPageHeader from "\.\.\/components\/todays-sky\/sections\/TodaysSkyPageHeader\.astro"/,
  );
  for (const path of [
    "/todays-sky",
    "/birth-chart",
    "/synastry",
    "/moon-calendar",
    "/daily-horoscope",
    "/astrologers",
    "/blog",
    "/transit",
  ]) {
    assert.match(source, new RegExp(`localizePath\\("${path}", locale\\)`));
  }
  assert.match(source, /current: true/);
  assert.match(source, /mobileUtilityActionId="your-transits"/);
  assert.match(
    source,
    /const field = `language_option_\$\{item\.code\}_label`/,
  );
  assert.match(
    source,
    /editAttributes: componentEditAttributes\(chromeEdit\(field\)\)/,
  );
  assert.doesNotMatch(source, /href: "#/);
  assert.doesNotMatch(source, /DateNavigator|ResultsShell|MoonPhaseItem|FinalCtaSection/);
});

test("Today's Sky completes the Content Studio first-section gate", async () => {
  const page = await readFile(pagePath, "utf8");
  const registry = await readFile(registryPath, "utf8");
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
  assert.match(page, /value === true \? "true" : value/);

  for (const field of [
    "page_header_eyebrow",
    "page_header_title_accent",
    "page_header_title_suffix",
    "page_header_meta_primary",
    "page_header_meta_secondary",
    "header_action_transits",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.deepEqual(getBuilderFieldTarget(field, "todays_sky"), {
      collection: "site_todays_sky",
      entry: "todays_sky",
    });
  }

  assert.match(registry, /\["site_todays_sky\/todays_sky", entries\[2\]\]/);
  assert.deepEqual(getBuilderPageTargets("todays_sky"), [
    { collection: "site_todays_sky", entry: "todays_sky" },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_todays_sky" &&
        target.entry === "todays_sky",
    ),
    true,
  );

  const config = getBuilderEntryConfig("site_todays_sky", "todays_sky");
  assert.ok(config);
  const fields = new Set(config.editableFields.map((field) => field.slug));
  for (const field of [
    "page_header_eyebrow",
    "page_header_title_accent",
    "page_header_title_suffix",
    "page_header_meta_primary",
    "page_header_meta_secondary",
    "header_action_transits",
    "seo_title",
    "seo_description",
  ]) {
    assert.equal(fields.has(field), true, `missing ${field}`);
  }
});

test("all active locales provide aligned Today's Sky header and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getTodaysSkyDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const requiredFields = [
    "page_header_eyebrow",
    "page_header_title_accent",
    "page_header_title_suffix",
    "page_header_meta_primary",
    "page_header_meta_secondary",
    "header_action_transits",
    "seo_title",
    "seo_description",
    "seo_canonical_path",
    "og_title",
    "og_description",
    "og_image_alt",
    "twitter_title",
    "twitter_description",
  ];

  for (const locale of activeLocaleCodes) {
    const defaults = getTodaysSkyDefaults(locale);
    assert.deepEqual(Object.keys(defaults), Object.keys(getTodaysSkyDefaults("en")));
    for (const field of requiredFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/todays-sky");
  }
});
