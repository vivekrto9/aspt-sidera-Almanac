import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeTransit.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-transit.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const baseMigrationPath = new URL(
  "../../migrations/0018_home_birth_chart_content.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0021_home_transit_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_transit_eyebrow",
  "home_transit_title_accent",
  "home_transit_title_rest",
  "home_transit_description",
  "home_transit_cta",
  ...Array.from({ length: 4 }, (_, index) =>
    ["date", "aspect", "note"].map(
      (part) => `home_transit_item_${index + 1}_${part}`,
    ),
  ).flat(),
];

test("Home Transit composes approved shared primitives without changing AspectRow", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(
    source,
    /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/,
  );
  assert.doesNotMatch(source, /AspectRow/);
  assert.match(source, /<ol class="home-transit__list"/);
  assert.match(source, /copy\.items\.map/);
  assert.match(source, /home-transit__unavailable/);
  assert.doesNotMatch(source, /editAttributes\(`item_\$\{index \+ 1\}_note`\)/);
});

test("Home Transit matches the Meridian two-column teaser and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 0\.9fr\) minmax\(0, 1\.1fr\)/,
  );
  assert.match(styles, /border-radius: 0\.875rem/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Transit with localized navigation and exact edit targeting", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeTransit from "\.\.\/components\/home\/sections\/HomeTransit\.astro"/,
  );
  assert.match(source, /<HomeTransit/);
  assert.match(
    source,
    /normalizeUpcomingSkyAspectEvents\(homeSky\.events\)\.slice\(0, 4\)/,
  );
  assert.match(source, /eventRangeDays: 30/);
  assert.match(source, /actionHref=\{localizePath\("\/transit", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_transit_\$\{field\}`\)\)/,
  );
});

test("all active locales provide aligned Home Transit content and registry fields", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeTransitCopy } =
    await import("../../src/data/locale/home/sections/transit.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig } =
    await import("../../src/builder/registry.ts");
  const registeredFields = new Set(
    getBuilderEntryConfig("site_home_sections", "home")?.editableFields.map(
      (field) => field.slug,
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
    const content = getHomeDefaults(locale);
    const copy = getHomeTransitCopy(locale);

    assert.equal(copy.items.length, 4);
    for (const field of editableFields) {
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
    if (locale !== "en") {
      assert.notEqual(copy.description, getHomeTransitCopy("en").description);
    }
  }
});

test("Home Transit has a forward migration for every editable field", async () => {
  const baseMigration = await readFile(baseMigrationPath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(baseMigration);
  sqlite.exec(migration);
  const migratedColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_sections)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
    assert.equal(migratedColumns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
