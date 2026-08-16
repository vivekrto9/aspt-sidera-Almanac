import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeSynastry.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-synastry.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const baseMigrationPath = new URL(
  "../../migrations/0018_home_birth_chart_content.sql",
  import.meta.url,
);
const transitMigrationPath = new URL(
  "../../migrations/0021_home_transit_content.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0022_home_synastry_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_synastry_eyebrow",
  "home_synastry_title_accent",
  "home_synastry_title_rest",
  "home_synastry_description",
  "home_synastry_primary_cta",
  "home_synastry_secondary_cta",
  "home_synastry_person_a_name",
  "home_synastry_person_a_detail",
  "home_synastry_person_b_name",
  "home_synastry_person_b_detail",
  "home_synastry_resonance",
];

test("Home Synastry composes approved shared heading, actions, and profile summaries", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(
    source,
    /import ProfileSummary[\s\S]*shared\/ProfileSummary\.astro/,
  );
  assert.match(
    source,
    /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/,
  );
  assert.equal((source.match(/<ProfileSummary/g) ?? []).length, 2);
  assert.match(
    source,
    /import personAImage from "\.\.\/\.\.\/\.\.\/assets\/home\/synastry-person-a\.png"/,
  );
  assert.match(
    source,
    /import personBImage from "\.\.\/\.\.\/\.\.\/assets\/home\/synastry-person-b\.png"/,
  );
  assert.match(source, /avatarSrc=\{personAImage\.src\}/);
  assert.match(source, /avatarSrc=\{personBImage\.src\}/);
  assert.match(source, /avatarAlt=\{copy\.personAName\}/);
  assert.match(source, /avatarAlt=\{copy\.personBName\}/);
  assert.equal((source.match(/<Button/g) ?? []).length, 1);
  assert.doesNotMatch(source, /copy\.secondaryCta/);
  assert.doesNotMatch(source, /editAttributes\("secondary_cta"\)/);
  assert.match(
    source,
    /nameEditAttributes=\{editAttributes\("person_a_name"\)\}/,
  );
  assert.match(
    source,
    /subtitleEditAttributes=\{editAttributes\("person_b_detail"\)\}/,
  );
});

test("Home Synastry preserves the specialized interlocking-chart visual", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /viewBox="0 0 172 172"/);
  assert.match(source, /cx="68" cy="86" r="60"/);
  assert.match(source, /cx="104" cy="86" r="60"/);
  assert.match(source, /class="home-synastry__resonance"/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage/);
});

test("Home Synastry matches Meridian geometry and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /scroll-margin-top: 5rem/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 0\.92fr\) minmax\(0, 1\.08fr\)/,
  );
  assert.match(styles, /border-radius: 1\.375rem/);
  assert.match(
    styles,
    /\.home-synastry__profile \.sidera-avatar\s*\{\s*--avatar-size: 5\.5rem;/,
  );
  assert.match(
    styles,
    /\.home-synastry__resonance\[data-builder-editing\][\s\S]*background: var\(--color-dark\)[\s\S]*color: var\(--color-on-dark\)[\s\S]*caret-color: var\(--color-on-dark\)/,
  );
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Synastry with localized navigation and exact edit targeting", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeSynastry from "\.\.\/components\/home\/sections\/HomeSynastry\.astro"/,
  );
  assert.match(source, /<HomeSynastry/);
  assert.match(source, /actionHref=\{localizePath\("\/synastry", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_synastry_\$\{field\}`\)\)/,
  );
});

test("all active locales provide aligned Home Synastry content and registry fields", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeSynastryCopy } =
    await import("../../src/data/locale/home/sections/synastry.ts");
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
    const copy = getHomeSynastryCopy(locale);

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
      assert.notEqual(copy.description, getHomeSynastryCopy("en").description);
    }
  }
});

test("Home Synastry has a forward migration for every editable field", async () => {
  const baseMigration = await readFile(baseMigrationPath, "utf8");
  const transitMigration = await readFile(transitMigrationPath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(baseMigration);
  sqlite.exec(transitMigration);
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
