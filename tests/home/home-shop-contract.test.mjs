import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeShop.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-shop.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0036_home_shop_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_shop_eyebrow",
  "home_shop_title_lead",
  "home_shop_title_accent",
  "home_shop_title_rest",
  "home_shop_browse_label",
  ...Array.from({ length: 4 }, (_, index) => [
    `home_shop_item_${index + 1}_title`,
    `home_shop_item_${index + 1}_category`,
    `home_shop_item_${index + 1}_price`,
    `home_shop_item_${index + 1}_image_alt`,
  ]).flat(),
];

test("Home Shop composes the approved shared commerce components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import CardGrid[\s\S]*shared\/CardGrid\.astro/);
  assert.match(source, /import ProductCard[\s\S]*shared\/ProductCard\.astro/);
  assert.match(
    source,
    /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/,
  );
  assert.match(source, /columns=\{4\}/);
  assert.match(source, /tabletColumns=\{2\}/);
  assert.match(source, /mobileColumns=\{1\}/);
  assert.match(source, /variant="compact"/);
  assert.doesNotMatch(source, /<script|fetch\(|localStorage|sessionStorage/);
});

test("Home Shop keeps editorial copy editable and operational price dynamic", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const field of ["title", "category", "image_alt"]) {
    assert.match(
      source,
      new RegExp(`EditAttributes=\\{edit\\("${field}"\\)\\}`),
    );
  }
  assert.doesNotMatch(source, /priceEditAttributes=\{edit\("price"\)\}/);
  assert.match(source, /imageSrc=\{item\.imageSrc\}/);
  assert.match(source, /href=\{item\.href \?\? actionHref\}/);
  for (const field of [
    "eyebrow",
    "title_lead",
    "title_accent",
    "title_rest",
    "browse_label",
  ]) {
    assert.match(source, new RegExp(`editAttributes\\("${field}"\\)`));
  }
});

test("Home Shop matches the Meridian measure and responsive surface", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-panel\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.375rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Shop with localized navigation and edit prefix", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeShop from "\.\.\/components\/home\/sections\/HomeShop\.astro"/,
  );
  assert.match(source, /<HomeShop/);
  assert.match(source, /listShopProducts\(runtimeEnv, locale\)/);
  assert.match(source, /actionHref=\{localizePath\("\/shop", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_shop_\$\{field\}`\)\)/,
  );
});

test("all active locales provide four aligned products in a bounded target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeShopCopy } =
    await import("../../src/data/locale/home/sections/shop.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
  } = await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_shop", "home");
  const registeredFields = new Set(
    config?.editableFields.map((field) => field.slug),
  );

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(getBuilderFieldTarget("home_shop_item_4_price", "home"), {
    collection: "site_home_shop",
    entry: "home",
  });
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) =>
        target.collection === "site_home_shop" && target.entry === "home",
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
    const copy = getHomeShopCopy(locale);
    const defaults = getHomeDefaults(locale);
    assert.equal(copy.items.length, 4, `${locale} must provide four products`);
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

test("Home Shop migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  const migration = await readFile(migrationPath, "utf8");
  sqlite.exec(migration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_shop)")
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
