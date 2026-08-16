import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeAstrologers.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-astrologers.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0031_home_astrologers_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_astrologers_eyebrow",
  "home_astrologers_title_accent",
  "home_astrologers_title_rest",
  "home_astrologers_browse_label",
  ...Array.from({ length: 4 }, (_, index) => [
    `home_astrologers_profile_${index + 1}_name`,
    `home_astrologers_profile_${index + 1}_tradition`,
    `home_astrologers_profile_${index + 1}_availability_label`,
    `home_astrologers_profile_${index + 1}_rating`,
    `home_astrologers_profile_${index + 1}_rate`,
    `home_astrologers_profile_${index + 1}_rate_unit`,
    `home_astrologers_profile_${index + 1}_action`,
  ]).flat(),
];

test("Home Astrologers composes only approved shared directory components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import AstrologerCard[\s\S]*shared\/AstrologerCard\.astro/);
  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(source, /import CardGrid[\s\S]*shared\/CardGrid\.astro/);
  assert.match(source, /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/);
  assert.match(source, /const gridColumns = copy\.profiles\.length <= 2 \? 2 : 4/);
  assert.match(source, /columns=\{gridColumns\}/);
  assert.match(source, /tabletColumns=\{2\}/);
  assert.match(source, /mobileColumns=\{1\}/);
  assert.match(source, /variant="compact"/);
  assert.doesNotMatch(source, /<script|fetch\(|localStorage|sessionStorage/);
});

test("Home Astrologers forwards exact visible-copy edit identities", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const hook of [
    "nameEditAttributes",
    "traditionEditAttributes",
    "availabilityEditAttributes",
    "ratingEditAttributes",
    "rateEditAttributes",
    "unitEditAttributes",
    "actionEditAttributes",
  ]) {
    assert.match(source, new RegExp(`${hook}=\\{edit\\(`));
  }
  assert.match(source, /editAttributes\("browse_label"\)/);
  assert.match(source, /const showBrowseAction = copy\.profiles\.length > 2/);
  assert.match(source, /showBrowseAction \? \(/);
});

test("Home Astrologers matches the Meridian measure and responsive surface", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.25rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Astrologers with localized navigation and edit prefix", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeAstrologers from "\.\.\/components\/home\/sections\/HomeAstrologers\.astro"/,
  );
  assert.match(source, /<HomeAstrologers/);
  assert.match(source, /listAstrologers\(runtimeEnv\)\)\.slice\(0, 2\)/);
  assert.match(source, /profiles: homeAstrologers\.map/);
  assert.match(source, /name: astrologer\.name/);
  assert.match(source, /tradition: astrologer\.tradition/);
  assert.match(source, /actionHref=\{localizePath\("\/astrologers", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_astrologers_\$\{field\}`\)\)/,
  );
});

test("all active locales provide four aligned profiles in a bounded target", async () => {
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getHomeAstrologersCopy } = await import(
    "../../src/data/locale/home/sections/astrologers.ts"
  );
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_astrologers", "home");
  const registeredFields = new Set(config?.editableFields.map((field) => field.slug));

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(
    getBuilderFieldTarget("home_astrologers_profile_4_action", "home"),
    { collection: "site_home_astrologers", entry: "home" },
  );
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) =>
        target.collection === "site_home_astrologers" && target.entry === "home",
    ),
  );

  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }

  for (const locale of activeLocaleCodes) {
    const copy = getHomeAstrologersCopy(locale);
    const defaults = getHomeDefaults(locale);
    assert.equal(copy.profiles.length, 4, `${locale} must provide four profiles`);
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Home Astrologers migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  const migration = await readFile(migrationPath, "utf8");
  sqlite.exec(migration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_astrologers)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100, "bounded collection must remain under D1's column cap");

  sqlite.close();
});
