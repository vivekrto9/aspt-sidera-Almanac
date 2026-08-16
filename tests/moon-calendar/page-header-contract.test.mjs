import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/moon-calendar/sections/MoonCalendarPageHeader.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/moon-calendar/sections/moon-calendar-page-header.css",
  import.meta.url,
);
const pageStylesPath = new URL(
  "../../src/styles/moon-calendar/moon-calendar.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/moon-calendar.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0045_moon_calendar_page_header.sql",
  import.meta.url,
);

const editableFields = [
  "page_header_eyebrow",
  "page_header_title_accent",
  "page_header_title_suffix",
  "page_header_meta_primary",
  "page_header_meta_secondary",
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

test("Moon Calendar page header composes the approved shared PageIntro", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/);
  assert.match(source, /<PageIntro/);
  assert.match(source, /const visibleTitleSuffix = titleSuffix\.trimStart\(\)/);
  assert.match(
    source,
    /title=\{`\$\{titleAccent\} \$\{visibleTitleSuffix\}`\}/,
  );
  assert.match(source, /\{titleAccent\}<\/em>\{" "\}<span/);
  assert.match(source, /<em \{\.\.\.titleAccentEditAttributes\}>/);
  assert.match(source, /\{\.\.\.titleSuffixEditAttributes\}/);
  assert.match(source, /\{\.\.\.metaPrimaryEditAttributes\}/);
  assert.match(source, /\{\.\.\.metaSecondaryEditAttributes\}/);
  assert.doesNotMatch(source, /Moon Calendar|Follow|lunar cycle/);
});

test("Moon Calendar page header preserves the literal reference geometry", async () => {
  const styles = await readFile(stylesPath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(
    pageStyles,
    /\.moon-calendar-page\s*\{[^}]*inline-size: 100%[^}]*margin: 0/s,
  );
  assert.match(
    styles,
    /\.moon-calendar-page-header\.sidera-page-intro\s*\{[^}]*inline-size: min\(100%, 73\.75rem\)[^}]*margin-inline: auto[^}]*padding: 2\.875rem 2\.125rem 0/s,
  );
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.match(
    styles,
    /\.moon-calendar-page-header h1\s*\{[^}]*font-size: clamp\(2\.125rem, 4\.6vw, 3\.625rem\)/s,
  );
  assert.match(styles, /letter-spacing: -0\.015em/);
  assert.match(styles, /min-inline-size: min\(100%, 20rem\)/);
  assert.match(styles, /font-size: 0\.84375rem/);
  assert.match(styles, /text-align: end/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /text-align: start/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("Moon Calendar route keeps Page header with localized navigation", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /loadPublicPageContent\(Astro, "moon_calendar"\)/);
  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(
    source,
    /import MoonCalendarPageHeader from "\.\.\/components\/moon-calendar\/sections\/MoonCalendarPageHeader\.astro"/,
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
    assert.match(source, new RegExp(`localizePath\\("${path}", locale\\)`));
  }
  assert.match(source, /current: true/);
  assert.match(source, /mobileUtilityActionId="sign-in"/);
  assert.match(
    source,
    /const field = `language_option_\$\{item\.code\}_label`/,
  );
  assert.doesNotMatch(
    source,
    /MoonPhaseItem|CardGrid|FinalCtaSection/,
  );
});

test("Moon Calendar completes the Content Studio first-section gate", async () => {
  const page = await readFile(pagePath, "utf8");
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
    assert.deepEqual(getBuilderFieldTarget(field, "moon_calendar"), {
      collection: "site_moon_calendar",
      entry: "moon_calendar",
    });
  }
  assert.deepEqual(getBuilderPageTargets("moon_calendar"), [
    { collection: "site_moon_calendar", entry: "moon_calendar" },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_moon_calendar" &&
        target.entry === "moon_calendar",
    ),
    true,
  );

  const config = getBuilderEntryConfig(
    "site_moon_calendar",
    "moon_calendar",
  );
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }
});

test("all active locales provide aligned Moon Calendar header and SEO", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getMoonCalendarDefaults } = await import(
    "../../src/data/public-copy.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getMoonCalendarDefaults(locale);
    assert.deepEqual(
      Object.keys(defaults),
      Object.keys(getMoonCalendarDefaults("en")),
    );
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/moon-calendar");
  }
});

test("Moon Calendar header fields have an executable forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_moon_calendar)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
