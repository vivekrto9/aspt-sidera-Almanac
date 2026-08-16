import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeDailyHoroscope.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-daily-horoscope.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0029_home_daily_horoscope_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_horoscope_eyebrow",
  "home_horoscope_title_accent",
  "home_horoscope_title_rest",
  "home_horoscope_prompt",
  ...Array.from({ length: 12 }, (_, index) => [
    `home_horoscope_sign_${index + 1}_name`,
    `home_horoscope_sign_${index + 1}_dates`,
    `home_horoscope_sign_${index + 1}_element`,
    `home_horoscope_sign_${index + 1}_reading`,
    `home_horoscope_sign_${index + 1}_cta`,
  ]).flat(),
];

test("Home Daily Horoscope composes approved shared heading, sign, and action components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(
    source,
    /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/,
  );
  assert.match(
    source,
    /import ZodiacSignItem[\s\S]*shared\/ZodiacSignItem\.astro/,
  );
  assert.match(source, /copy\.signs\.map/);
  assert.match(source, /size="compact"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /<time datetime=\{dateIso\}>/);
  assert.doesNotMatch(
    source,
    /editAttributes=\{editAttributes\("sign_1_cta"\)\}/,
  );
  assert.match(source, /data-reading-cta[\s\S]*editAttributes\("sign_1_cta"\)/);
  assert.match(source, /fetch\(horoscopeApiHref/);
  assert.match(source, /period: "daily"/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /editAttributes\("sign_1_reading"\)/);
});

test("Home Daily Horoscope owns accessible sign selection and synchronized reading state", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /data-home-daily-horoscope/);
  assert.match(source, /const selectSign = \(index\)/);
  assert.match(source, /setAttribute\("aria-pressed", String\(selected\)\)/);
  assert.match(
    source,
    /classList\.toggle\("sidera-zodiac-sign--selected", selected\)/,
  );
  assert.match(
    source,
    /forecast\.textContent = sign\.reading \|\| horoscopeUnavailableDescription/,
  );
  assert.match(
    source,
    /selectedIndex === index && requestSequence === sequence/,
  );
  assert.match(
    source,
    /ctaLink\.setAttribute\("href", sign\.href \|\| horoscopeActionHref\)/,
  );
  assert.match(source, /const transitionReading = \(update\)/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /transitionReading\(\(\) => \{/);
  assert.match(source, /applyEditIdentity\(node, identities\[key\]\)/);
});

test("Home Daily Horoscope matches reference geometry and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.15fr\) minmax\(20rem, 0\.85fr\)/);
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /font: 400 1\.125rem \/ 1\.55 var\(--font-serif\)/);
  assert.match(styles, /font-size: 1rem/);
  assert.match(styles, /opacity 160ms ease/);
  assert.match(styles, /transform 200ms ease/);
  assert.match(styles, /min-block-size: 3\.1em/);
  assert.match(styles, /background: var\(--color-text\)/);
  assert.match(styles, /border-radius: 1\.25rem/);
  assert.match(styles, /@media \(max-width: 58rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Daily Horoscope with a localized destination and exact edit prefix", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeDailyHoroscope from "\.\.\/components\/home\/sections\/HomeDailyHoroscope\.astro"/,
  );
  assert.match(source, /<HomeDailyHoroscope/);
  assert.match(
    source,
    /actionHref=\{localizePath\("\/daily-horoscope", locale\)\}/,
  );
  assert.match(source, /getHoroscopePrediction\(\{/);
  assert.match(source, /sign: "aries"/);
  assert.match(
    source,
    /apiHref="\/api\/astropages\/generated-site\/horoscope"/,
  );
  assert.match(
    source,
    /href: localizePath\(`\/daily-horoscope\/\$\{sign\.id\}`, locale\)/,
  );
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_horoscope_\$\{field\}`\)\)/,
  );
});

test("all active locales provide aligned Daily Horoscope content in a bounded target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeDailyHoroscopeCopy } =
    await import("../../src/data/locale/home/sections/daily-horoscope.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_horoscope", "home");
  const registeredFields = new Set(
    config?.editableFields.map((field) => field.slug),
  );

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(
    getBuilderFieldTarget("home_horoscope_sign_12_reading", "home"),
    { collection: "site_home_horoscope", entry: "home" },
  );
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) =>
        target.collection === "site_home_horoscope" && target.entry === "home",
    ),
  );

  for (const field of editableFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
  }

  for (const locale of activeLocaleCodes) {
    const copy = getHomeDailyHoroscopeCopy(locale);
    const defaults = getHomeDefaults(locale);
    assert.equal(copy.signs.length, 12, `${locale} must provide twelve signs`);
    for (const field of editableFields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
  }
});

test("Home Daily Horoscope migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  const migration = await readFile(migrationPath, "utf8");
  sqlite.exec(migration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_horoscope)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(
    columns.size < 100,
    "bounded collection must remain under D1's column cap",
  );

  sqlite.close();
});
