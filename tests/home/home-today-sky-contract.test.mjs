import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeTodaySky.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-today-sky.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0009_home_today_sky_content.sql",
  import.meta.url,
);

test("Home Today's Sky composes shared heading and action with reference-matched position cards", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(
    source,
    /import SectionHeading from "\.\.\/\.\.\/shared\/SectionHeading\.astro"/,
  );
  assert.match(
    source,
    /import EmptyState from "\.\.\/\.\.\/shared\/EmptyState\.astro"/,
  );
  assert.match(source, /<SectionHeading/);
  assert.match(source, /<Button[\s\S]*href=\{ctaHref\}/);
  assert.match(source, /<span slot="trailing-icon">→<\/span>/);
  assert.match(source, /class="home-today-sky__position-header"/);
  assert.match(source, /class="home-today-sky__position-glyph"/);
  assert.match(source, /class="home-today-sky__position-motion"/);
  assert.match(source, /class="home-today-sky__position-name"/);
  assert.match(source, /class="home-today-sky__position-value"/);
  assert.match(source, /positions\.length \? \(/);
  assert.doesNotMatch(source, /PlanetPositionRow/);
});

test("Home Today's Sky keeps copy, prepared positions, and exact edit bindings caller-owned", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const prop of [
    "eyebrow: string",
    "titleAccent: string",
    "titleRest: string",
    "dateLabel: string",
    "metadata: string",
    "ctaLabel: string",
    "positions: HomeTodaySkyPosition[]",
  ]) {
    assert.match(
      source,
      new RegExp(prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }

  assert.match(source, /\{\.\.\.titleAccentEditAttributes\}/);
  assert.match(source, /\{\.\.\.titleRestEditAttributes\}/);
  assert.match(source, /\{\.\.\.metadataEditAttributes\}/);
  assert.match(source, /editAttributes=\{ctaEditAttributes\}/);
  assert.doesNotMatch(source, /The sky|Geocentric|Open today's sky|9° Cancer/);
});

test("Home Today's Sky preserves Meridian rhythm and responsive containment", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 5\.5rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(
    styles,
    /\.home-today-sky__inner\s*\{[^}]*border-radius: 1\.5rem[^}]*background: var\(--color-panel\)/s,
  );
  assert.match(
    styles,
    /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/,
  );
  assert.match(styles, /@media \(max-width: 70rem\)/);
  assert.match(styles, /min-block-size: 7\.5rem/);
  assert.match(styles, /font: 400 1\.625rem \/ 1 Georgia/);
  assert.match(styles, /@media \(max-width: 46rem\)/);
  assert.match(styles, /@media \(max-width: 22rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
  assert.doesNotMatch(styles, /\.sidera-planet-position-row__/);
  assert.doesNotMatch(styles, /\.sidera-button/);
});

test("Home route mounts Today's Sky with localized navigation and Content Studio fields", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeTodaySky from "\.\.\/components\/home\/sections\/HomeTodaySky\.astro"/,
  );
  assert.match(source, /const todaySkyCopy = getHomeTodaySkyCopy\(locale\)/);
  assert.match(source, /getSkyForDate\(/);
  assert.match(source, /live: true/);
  assert.match(
    source,
    /new Intl\.DateTimeFormat\(localeMeta\?\.hreflang \?\? "en"/,
  );
  assert.match(source, /ctaHref=\{localizePath\("\/todays-sky", locale\)\}/);
  assert.match(source, /positions=\{homeTodaySkyPositions\}/);
  assert.doesNotMatch(source, /positions=\{todaySkyCopy\.positions\}/);

  for (const field of [
    "today_sky_eyebrow",
    "today_sky_title_accent",
    "today_sky_title_rest",
    "today_sky_metadata",
    "today_sky_cta",
  ]) {
    assert.match(source, new RegExp(`builderEdit\\("${field}"\\)`));
  }
});

test("all active locales provide aligned Today's Sky defaults and position labels", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeTodaySkyCopy } =
    await import("../../src/data/locale/home/sections/todays-sky.ts");
  const { getBuilderEntryConfig } =
    await import("../../src/builder/registry.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const requiredFields = [
    "today_sky_eyebrow",
    "today_sky_title_accent",
    "today_sky_title_rest",
    "today_sky_metadata",
    "today_sky_cta",
  ];
  const registeredFields = new Set(
    getBuilderEntryConfig("site_pages", "home")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  for (const field of requiredFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
  }

  for (const locale of activeLocaleCodes) {
    const content = getHomeDefaults(locale);
    const sky = getHomeTodaySkyCopy(locale);

    for (const field of requiredFields) {
      assert.equal(
        typeof content[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        content[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
    assert.equal(Object.keys(sky.planetNames).length, 7);
    for (const label of Object.values(sky.planetNames)) {
      assert.notEqual(label.trim(), "");
    }
    assert.notEqual(sky.motions.waxing.trim(), "");
    assert.notEqual(sky.motions.waning.trim(), "");
    assert.notEqual(sky.motions.retrograde.trim(), "");
  }
});

test("Home Today's Sky has an explicit deployed D1 migration for every editable field", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const migratedColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_pages)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "today_sky_eyebrow",
    "today_sky_title_accent",
    "today_sky_title_rest",
    "today_sky_metadata",
    "today_sky_cta",
  ]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_pages ADD COLUMN ${field} TEXT;`),
    );
    assert.equal(migratedColumns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});

test("Home Today's Sky accepts punctuation edits without requiring the original comma", async () => {
  const { validateBuilderChanges } =
    await import("../../src/builder/content.ts");
  const editedTitle = " right now.";
  const result = validateBuilderChanges("site_pages", "home", "en", {
    today_sky_title_rest: editedTitle,
  });

  assert.equal(result?.ok, true);
  if (result?.ok) {
    assert.equal(result.changes.today_sky_title_rest, editedTitle);
  }
});
