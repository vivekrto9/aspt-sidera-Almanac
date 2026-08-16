import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const fields = [
  "personalized_cta_eyebrow",
  "personalized_cta_title_lead",
  "personalized_cta_title_accent",
  "personalized_cta_title_rest",
  "personalized_cta_description",
  "personalized_cta_primary_label",
  "personalized_cta_secondary_label",
];

test("Daily Horoscope Personalized CTA matches the reference through the approved shared primitive", async () => {
  const component = await read(
    "src/components/daily-horoscope/sections/DailyHoroscopePersonalizedCta.astro",
  );
  const styles = await read(
    "src/styles/daily-horoscope/sections/daily-horoscope-personalized-cta.css",
  );

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /primaryHref="\/birth-chart"/);
  assert.match(component, /secondaryHref="\/todays-sky"/);
  assert.match(component, /primaryArrow="→"/);
  assert.match(component, /tone="dark"/);
  assert.match(component, /layout="split"/);
  assert.match(component, /surface="panel"/);
  assert.match(component, /ambience/);
  assert.match(component, /editAttributes\("titleAccent"\)/);
  assert.match(styles, /--sidera-final-cta-background: var\(--color-dark\)/);
  assert.match(styles, /--sidera-final-cta-accent: var\(--color-primary-soft\)/);
  assert.match(styles, /inline-size: min\(100% - 4\.25rem, 73\.75rem\)/);
  assert.match(styles, /margin: 1\.625rem auto 3\.75rem/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.doesNotMatch(styles, /\.sidera-final-cta__/);
});

test("Daily Horoscope mounts the final CTA after the reading and before Footer", async () => {
  const page = await read("src/pages/daily-horoscope/[slug].astro");
  const readingIndex = page.indexOf("<DailyHoroscopeReading");
  const ctaIndex = page.indexOf("<DailyHoroscopePersonalizedCta");
  const footerIndex = page.indexOf("<Footer");

  assert.ok(readingIndex > 0);
  assert.ok(ctaIndex > readingIndex);
  assert.ok(footerIndex > ctaIndex);
  assert.match(page, /getDailyHoroscopePersonalizedCtaCopy\(locale\)/);
  assert.match(page, /builderEdit\(personalizedCtaFields\[field\]\)/);
  assert.doesNotMatch(page, /\/demo|setTimeout|spinner|loader/i);
});

test("all active locales expose seven non-empty editable CTA fields in a bounded supplemental target", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const {
    getDailyHoroscopeDefaults,
    getDailyHoroscopePersonalizedCtaDefaults,
  } = await import("../../src/data/public-copy.ts");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");

  const primary = getBuilderEntryConfig(
    "site_daily_horoscope",
    "daily_horoscope",
  );
  const supplemental = getBuilderEntryConfig(
    "site_daily_horoscope_cta",
    "cta",
  );
  assert.ok(primary);
  assert.ok(supplemental);
  assert.deepEqual(getBuilderPageTargets("daily_horoscope"), [
    { collection: "site_daily_horoscope", entry: "daily_horoscope" },
    { collection: "site_daily_horoscope_cta", entry: "cta" },
  ]);

  for (const locale of activeLocaleCodes) {
    const defaults = getDailyHoroscopeDefaults(locale);
    const ctaDefaults = getDailyHoroscopePersonalizedCtaDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.equal(ctaDefaults[field], defaults[field]);
      assert.equal(
        primary.editableFields.some((item) => item.slug === field),
        false,
        `${field} leaked into the 97-column primary collection`,
      );
      assert.equal(
        supplemental.editableFields.some((item) => item.slug === field),
        true,
        `${field} missing supplemental registration`,
      );
      assert.deepEqual(getBuilderFieldTarget(field, "daily_horoscope"), {
        collection: "site_daily_horoscope_cta",
        entry: "cta",
      });
    }
  }
});

test("Personalized CTA migration keeps both Daily Horoscope tables below the D1 column cap", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0049_daily_horoscope_choose_sign.sql"));
  sqlite.exec(await read("migrations/0057_daily_horoscope_reading_content.sql"));
  sqlite.exec(await read("migrations/0077_daily_horoscope_personalized_cta.sql"));

  const primaryColumns = sqlite
    .prepare("PRAGMA table_info(ec_site_daily_horoscope)")
    .all()
    .map((column) => column.name);
  const ctaColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_daily_horoscope_cta)")
      .all()
      .map((column) => column.name),
  );

  assert.equal(primaryColumns.length, 97);
  assert.ok(primaryColumns.length < 100);
  assert.ok(ctaColumns.size < 100);
  for (const field of fields) {
    assert.equal(ctaColumns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});

test("manifest exposes the supplemental editable CTA entry", async () => {
  const manifest = JSON.parse(await read("template.manifest.json"));
  assert.ok(
    manifest.localization.publicEditableEntries.includes(
      "site_daily_horoscope_cta/cta",
    ),
  );
});
