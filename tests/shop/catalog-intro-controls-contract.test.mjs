import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const fields = [
  "catalog_eyebrow",
  "catalog_title_lead",
  "catalog_title_accent",
  "catalog_title_rest",
  "catalog_description",
  "catalog_filter_label",
  "catalog_category_all",
  "catalog_category_prints",
  "catalog_category_books",
  "catalog_category_home",
  "catalog_category_jewelry",
  "catalog_pieces_suffix",
  "catalog_nav_shop_label",
  "catalog_cart_label",
];

test("Shop catalog intro composes approved shared UI and excludes products", async () => {
  const component = await read(
    "src/components/shop/sections/ShopCatalogIntroControls.astro",
  );
  const styles = await read(
    "src/styles/shop/sections/catalog-intro-controls.css",
  );
  const page = await read("src/pages/shop.astro");
  assert.match(component, /import ChoiceChips/);
  assert.match(component, /import PageIntro/);
  assert.match(component, /data-shop-filter-form/);
  assert.match(
    component,
    /<strong>\{resultCount\}<\/strong>\s*<span \{\.\.\.editAttributes\("catalog_pieces_suffix"\)\}>\{piecesSuffix\}<\/span>/,
  );
  assert.doesNotMatch(
    component,
    /editAttributes\([^)]*\)[^>]*>\{resultCount\}/,
  );
  assert.match(
    styles,
    /input:checked\s*\+\s*\[data-builder-edit\]\[data-builder-hovered\][^{]*\{[^}]*background: var\(--choice-chip-checked-background\)[^}]*color: var\(--choice-chip-checked-color\)/s,
  );
  assert.match(
    styles,
    /\.shop-catalog-intro-controls__count\s*\{[^}]*display: inline-flex[^}]*gap: 0\.5rem/s,
  );
  assert.match(page, /<Header/);
  assert.match(page, /<Footer/);
  assert.match(page, /<ShopCatalogIntroControls/);
  assert.doesNotMatch(
    page,
    /ProductCard|CardGrid|OrderSummary|QuantityStepper/,
  );
});

test("Shop filtering is runtime-prepared and localized", async () => {
  const data = await read("src/data/shop/catalog.ts");
  const page = await read("src/pages/shop.astro");
  assert.match(data, /getShopResultCount/);
  assert.match(data, /"prints"[\s\S]*"books"[\s\S]*"home"[\s\S]*"jewelry"/);
  assert.match(page, /Astro\.url\.searchParams\.get\("category"\)/);
  assert.match(page, /listShopProducts\(runtimeEnv, locale\)/);
  assert.match(page, /resultCount=\{activeProducts\.length\}/);

  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getShopDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");
  for (const locale of activeLocaleCodes) {
    const defaults = getShopDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string");
      assert.notEqual(defaults[field].trim(), "");
      assert.deepEqual(getBuilderFieldTarget(field, "shop"), {
        collection: "site_shop",
        entry: "shop",
      });
    }
  }
});

test("Shop catalog collection has a fresh bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0061_shop_catalog_intro_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_shop)")
      .all()
      .map((item) => item.name),
  );
  for (const field of fields) assert.equal(columns.has(field), true, field);
  assert.ok(columns.size < 100);
  sqlite.close();
});
