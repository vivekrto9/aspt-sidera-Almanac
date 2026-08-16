import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/daily-horoscope/sections/DailyHoroscopeReading.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/daily-horoscope/sections/daily-horoscope-reading.css",
  import.meta.url,
);
const routePath = new URL(
  "../../src/pages/daily-horoscope/[slug].astro",
  import.meta.url,
);
const fixturesPath = new URL(
  "../../src/data/daily-horoscope/dummy-readings.ts",
  import.meta.url,
);
const pickerMigrationPath = new URL(
  "../../migrations/0049_daily_horoscope_choose_sign.sql",
  import.meta.url,
);
const readingMigrationPath = new URL(
  "../../migrations/0057_daily_horoscope_reading_content.sql",
  import.meta.url,
);

const readingFields = [
  "reading_breadcrumb_label",
  "reading_change_sign",
  "reading_sign_label",
  "reading_ruled_by_label",
  "reading_period_yesterday_label",
  "reading_period_today_label",
  "reading_period_tomorrow_label",
  "reading_period_week_label",
  "reading_period_month_label",
  "reading_theme_1_label",
  "reading_theme_1_text",
  "reading_theme_2_label",
  "reading_theme_2_text",
  "reading_theme_3_label",
  "reading_theme_3_text",
  "reading_browse_signs",
  "reading_day_glance",
  "reading_rating_1_label",
  "reading_rating_2_label",
  "reading_rating_3_label",
  "reading_rating_4_label",
  "reading_lucky_today",
  "reading_mood_label",
  "reading_number_label",
  "reading_colour_label",
  "reading_best_match_label",
  "reading_sky_behind_label",
  "reading_full_sky_label",
];

test("Daily Horoscope reading reproduces the complete reference section", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Breadcrumb from "\.\.\/\.\.\/shared\/Breadcrumb\.astro"/);
  assert.match(source, /data-screen-label="Daily Horoscope Reading"/);
  assert.match(source, /daily-horoscope-reading__sign-glyph/);
  assert.match(source, /copy\.periods\.map/);
  assert.match(source, /fixture\.headlines\[activePeriod\]/);
  assert.match(source, /themeItems\.map/);
  assert.match(source, /daily-horoscope-reading__sky-link/);
  assert.doesNotMatch(source, /fixture\.ratings|fixture\.lucky|fixture\.transits/);
  assert.match(source, /previousSign\.href/);
  assert.match(source, /nextSign\.href/);
  assert.match(source, /data-daily-horoscope-navigation="period"/);
  assert.match(source, /data-daily-horoscope-navigation="sign"/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /history\.pushState/);
  assert.match(source, /window\.scrollTo\(0, scrollPosition\)/);
  assert.match(source, /focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /data-builder-edit-mode/);
  assert.doesNotMatch(source, /FinalCtaSection|Personalize CTA|loader|spinner|setTimeout/i);
});

test("Daily Horoscope reading lives on a real guarded slug route", async () => {
  const route = await readFile(routePath, "utf8");

  assert.match(route, /Astro\.params\.slug/);
  assert.match(route, /getDailyHoroscopeFixture\(slug\)/);
  assert.match(
    route,
    /Astro\.redirect\(localizePath\("\/daily-horoscope", locale\), 302\)/,
  );
  assert.match(route, /seo_robots: "noindex,nofollow"/);
  assert.match(route, /<DailyHoroscopeReading/);
  assert.match(route, /import Header from .*shared\/Header\.astro/);
  assert.match(route, /import Footer from .*shared\/Footer\.astro/);
  assert.match(route, /<Header/);
  assert.match(route, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.match(route, /localizePath\(`\/daily-horoscope\/\$\{slug\}\?period=/);
  assert.match(route, /\.filter\(\(period\) => \["today", "week", "month"\]\.includes\(period\.id\)\)/);
  assert.doesNotMatch(route, /\/demo|setTimeout|castingDelay|loader/i);
});

test("Daily Horoscope registers only editable static reading copy", async () => {
  const route = await readFile(routePath, "utf8");
  const component = await readFile(componentPath, "utf8");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
  } = await import("../../src/builder/registry.ts");
  const { getDailyHoroscopeDefaults } = await import(
    "../../src/data/public-copy.ts"
  );

  const defaults = getDailyHoroscopeDefaults("en");
  const config = getBuilderEntryConfig(
    "site_daily_horoscope",
    "daily_horoscope",
  );
  assert.ok(config);
  const registered = new Set(config.editableFields.map((field) => field.slug));

  for (const field of readingFields) {
    assert.equal(typeof defaults[field], "string", `${field} missing default`);
    assert.equal(registered.has(field), true, `${field} missing registry field`);
    assert.deepEqual(getBuilderFieldTarget(field, "daily_horoscope"), {
      collection: "site_daily_horoscope",
      entry: "daily_horoscope",
    });
  }

  assert.match(route, /builderEdit\(field\)/);
  assert.match(route, /content\[`reading_period_\$\{period\.id\}_label`\]/);
  assert.match(route, /content\[`reading_theme_\$\{index \+ 1\}_label`\]/);
  assert.match(route, /content\[`reading_rating_\$\{index \+ 1\}_label`\]/);
  assert.match(component, /editAttributes\("reading_breadcrumb_label"\)/);
  assert.match(component, /editAttributes\("reading_change_sign"\)/);
  assert.match(component, /editAttributes\("reading_sign_label"\)/);
  assert.match(component, /editAttributes\("reading_ruled_by_label"\)/);
  assert.match(
    component,
    /editAttributes\(`reading_period_\$\{period\.id\}_label`\)/,
  );
  assert.match(
    component,
    /editAttributes\(`reading_theme_\$\{index \+ 1\}_label`\)/,
  );
  assert.doesNotMatch(component, /reading_rating_|reading_lucky_|reading_best_match/);

  for (const runtimeField of [
    "reading_headline",
    "reading_ruler",
    "reading_keyword",
    "reading_ratings",
    "reading_lucky_value",
    "reading_transit_title",
  ]) {
    assert.equal(runtimeField in defaults, false);
    assert.equal(registered.has(runtimeField), false);
  }
});

test("Daily Horoscope reading static fields have a forward migration", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(pickerMigrationPath, "utf8"));
  sqlite.exec(await readFile(readingMigrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_daily_horoscope)")
      .all()
      .map((column) => column.name),
  );

  for (const field of readingFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});

test("Daily Horoscope keeps deterministic page-owned presentation metadata", async () => {
  const source = await readFile(fixturesPath, "utf8");
  const { dailyHoroscopeFixtures, getDailyHoroscopeFixture } = await import(
    "../../src/data/daily-horoscope/dummy-readings.ts"
  );

  assert.match(source, /DailyHoroscopePeriodId/);
  assert.equal(dailyHoroscopeFixtures.length, 12);
  assert.deepEqual(
    dailyHoroscopeFixtures.map((fixture) => fixture.slug),
    [
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ],
  );
  assert.equal(getDailyHoroscopeFixture("aries")?.slug, "aries");
  assert.equal(getDailyHoroscopeFixture("not-a-sign"), undefined);
  for (const fixture of dailyHoroscopeFixtures) {
    assert.deepEqual(Object.keys(fixture.headlines), [
      "yesterday",
      "today",
      "tomorrow",
      "week",
      "month",
    ]);
    assert.equal(fixture.ratings.length, 4);
    assert.equal(fixture.transits.length, 2);
  }
});

test("Daily Horoscope reading copy is aligned for every active locale", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getDailyHoroscopeReadingCopy } = await import(
    "../../src/data/locale/daily-horoscope/sections/reading.ts"
  );
  const english = getDailyHoroscopeReadingCopy("en");

  for (const locale of activeLocaleCodes) {
    const copy = getDailyHoroscopeReadingCopy(locale);
    assert.deepEqual(Object.keys(copy), Object.keys(english));
    assert.equal(copy.periods.length, 5);
    assert.deepEqual(
      copy.periods.map((period) => period.id),
      ["yesterday", "today", "tomorrow", "week", "month"],
    );
    assert.equal(copy.themeLabels.length, 3);
    assert.equal(copy.ratingLabels.length, 4);
  }
});

test("Daily Horoscope reading matches reference geometry and mobile containment", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(styles, /inline-size: 5rem/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /background: var\(--color-dark\)/);
  assert.match(styles, /background: var\(--color-dark\)/);
  assert.match(styles, /@media \(max-width: 56rem\)/);
  assert.match(styles, /@media \(max-width: 44rem\)/);
  assert.match(styles, /@media \(max-width: 28rem\)/);
  assert.match(styles, /font-size: 1\.6875rem/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-(?:breadcrumb|badge|header|footer)__/);
});
