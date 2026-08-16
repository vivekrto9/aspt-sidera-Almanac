import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/daily-horoscope/sections/DailyHoroscopeSignPicker.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/daily-horoscope/sections/daily-horoscope-sign-picker.css",
  import.meta.url,
);
const pageStylesPath = new URL(
  "../../src/styles/daily-horoscope/daily-horoscope.css",
  import.meta.url,
);
const pagePath = new URL(
  "../../src/pages/daily-horoscope.astro",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0049_daily_horoscope_choose_sign.sql",
  import.meta.url,
);

const pickerFields = [
  "picker_eyebrow",
  "picker_title_accent",
  "picker_title_rest",
  "picker_description",
  "picker_helper_prefix",
  "picker_helper_cta",
  ...Array.from({ length: 12 }, (_, index) => [
    `picker_sign_${index + 1}_name`,
    `picker_sign_${index + 1}_dates`,
    `picker_sign_${index + 1}_element`,
  ]).flat(),
];

const seoFields = [
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

const editableFields = [...pickerFields, ...seoFields];

test("Daily Horoscope Choose sign composes only approved shared primitives", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/,
  );
  assert.match(
    source,
    /import ZodiacSignItem from "\.\.\/\.\.\/shared\/ZodiacSignItem\.astro"/,
  );
  assert.match(source, /<PageIntro/);
  assert.match(source, /signs\.map/);
  assert.match(source, /<ZodiacSignItem/);
  assert.match(source, /size="standard"/);
  assert.match(source, /href=\{sign\.href\}/);
  assert.doesNotMatch(source, /selected=\{sign\.selected\}/);
  assert.match(source, /aria-labelledby="daily-horoscope-sign-picker-title"/);
  assert.match(source, /helperHref/);
  assert.doesNotMatch(
    source,
    /DateNavigator|Badge|Tabs|FinalCtaSection|Footer|daily reading/i,
  );
});

test("Daily Horoscope Choose sign matches the literal reference geometry", async () => {
  const styles = await readFile(stylesPath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(
    pageStyles,
    /\.daily-horoscope-page\s*\{[^}]*inline-size: 100%[^}]*margin: 0/s,
  );
  assert.match(styles, /padding-block-end: 6rem/);
  assert.match(styles, /padding: 3\.75rem 2\.125rem 0/);
  assert.match(styles, /inline-size: min\(calc\(100% - 4\.25rem\), 70rem\)/);
  assert.match(styles, /max-inline-size: 31\.25rem/);
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /gap: 0\.875rem/);
  assert.match(styles, /margin: 2\.875rem 0 0/);
  assert.doesNotMatch(styles, /--sidera-section-heading-accent/);
  assert.match(
    styles,
    /\.daily-horoscope-sign-picker \.daily-horoscope-sign-picker__sign:hover\s*\{\s*border-color: rgba\(var\(--color-primary-rgb\), 0\.45\)/,
  );
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("Daily Horoscope route owns stable localized sign selection", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /loadPublicPageContent\(Astro, "daily_horoscope"\)/);
  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(source, /<DailyHoroscopeSignPicker/);
  assert.match(
    source,
    /localizePath\(`\/daily-horoscope\/\$\{sign\.slug\}`, locale\)/,
  );
  assert.doesNotMatch(source, /selectedSign|selected: selectedSign/);
  assert.match(source, /helperHref=\{localizePath\("\/birth-chart", locale\)\}/);
  assert.match(source, /current: true/);
  assert.match(source, /mobileUtilityActionId="sign-in"/);
  assert.match(source, /import Footer from "\.\.\/components\/shared\/Footer\.astro"/);
  assert.match(source, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.doesNotMatch(source, /DailyHoroscopeReading|FinalCtaSection/);
});

test("Daily Horoscope completes the Content Studio first-section contract", async () => {
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
    assert.deepEqual(getBuilderFieldTarget(field, "daily_horoscope"), {
      collection: "site_daily_horoscope",
      entry: "daily_horoscope",
    });
  }
  assert.deepEqual(getBuilderPageTargets("daily_horoscope"), [
    { collection: "site_daily_horoscope", entry: "daily_horoscope" },
    { collection: "site_daily_horoscope_cta", entry: "cta" },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_daily_horoscope" &&
        target.entry === "daily_horoscope",
    ),
    true,
  );

  const config = getBuilderEntryConfig(
    "site_daily_horoscope",
    "daily_horoscope",
  );
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }
});

test("all active locales provide twelve aligned Daily Horoscope signs", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getDailyHoroscopeChooseSignCopy } = await import(
    "../../src/data/locale/daily-horoscope/sections/choose-sign.ts"
  );
  const { getDailyHoroscopeDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const englishFields = Object.keys(getDailyHoroscopeDefaults("en"));

  for (const locale of activeLocaleCodes) {
    const copy = getDailyHoroscopeChooseSignCopy(locale);
    const defaults = getDailyHoroscopeDefaults(locale);

    assert.equal(copy.signs.length, 12, `${locale} must provide twelve signs`);
    assert.deepEqual(Object.keys(defaults), englishFields);
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/daily-horoscope");
  }
});

test("Daily Horoscope fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_daily_horoscope)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
