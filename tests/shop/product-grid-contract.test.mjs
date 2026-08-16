import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const productIds = [
  "natal_print",
  "tapestry",
  "almanac",
  "tarot",
  "notebook",
  "candle",
  "scarf",
  "pins",
  "pendant",
];
const fields = [
  "shop_catalog_aria_label",
  "shop_personalized_label",
  "shop_view_label",
  "shop_add_label",
  ...productIds.flatMap((id) => [
    `shop_product_${id}_title`,
    `shop_product_${id}_unit`,
    `shop_product_${id}_fallback_label`,
  ]),
  ...[1, 2, 3].flatMap((index) => [
    `shop_perk_${index}_title`,
    `shop_perk_${index}_description`,
  ]),
];

test("Shop product grid composes the approved shared commerce cards", async () => {
  const component = await read(
    "src/components/shop/sections/ShopProductGrid.astro",
  );
  const page = await read("src/pages/shop.astro");
  const styles = await read("src/styles/shop/sections/product-grid.css");

  assert.match(component, /import CardGrid/);
  assert.match(component, /import ProductCard/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /href=\{`\/shop\/\$\{product\.id\}`\}/);
  assert.match(component, /imageAltEditAttributes/);
  assert.match(component, /imageSrc=\{product\.imageSrc\}/);
  assert.match(page, /<ShopProductGrid/);
  assert.match(styles, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.doesNotMatch(styles, /\.product-card__/);
});

test("Shop product identity and filtering remain runtime-prepared", async () => {
  const data = await read("src/data/shop/catalog.ts");
  assert.match(data, /export const shopCatalogProducts/);
  assert.match(
    data,
    /\{ id: "natal-print", category: "prints", price: 48, personalized: true,/,
  );
  assert.match(
    data,
    /\{ id: "pendant", category: "jewelry", price: 52, personalized: true,/,
  );
  assert.match(data, /getShopProducts/);
  assert.equal((data.match(/\{ id: "/g) ?? []).length, 9);
});

test("Shop product-grid copy is localized and routed to its bounded target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getShopCatalogDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");

  assert.deepEqual(getBuilderPageTargets("shop").slice(0, 2), [
    { collection: "site_shop", entry: "shop" },
    { collection: "site_shop_catalog", entry: "catalog" },
  ]);
  for (const locale of activeLocaleCodes) {
    const defaults = getShopCatalogDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale}:${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale}:${field}`);
      assert.deepEqual(getBuilderFieldTarget(field, "shop"), {
        collection: "site_shop_catalog",
        entry: "catalog",
      });
    }
  }
});

test("Shop product grid has a fresh standalone migration below the D1 cap", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0075_shop_product_grid_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_shop_catalog)")
      .all()
      .map((item) => item.name),
  );
  for (const field of fields) assert.equal(columns.has(field), true, field);
  assert.ok(columns.size < 100);
  sqlite.close();
});
