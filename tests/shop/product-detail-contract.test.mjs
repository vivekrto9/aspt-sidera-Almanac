import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Shop product detail lives on the real slug route and composes approved shared UI", async () => {
  const route = await read("src/pages/shop/[slug].astro");
  const section = await read(
    "src/components/shop/sections/ShopProductDetail.astro",
  );
  const styles = await read("src/styles/shop/sections/product-detail.css");

  assert.match(route, /getShopProductBySlug\(runtimeEnv, slug, locale\)/);
  assert.match(route, /listShopProducts\(runtimeEnv, locale\)/);
  assert.match(route, /Astro\.redirect\(localizePath\("\/shop"/);
  assert.match(route, /<Header/);
  assert.match(route, /<ShopProductDetail/);
  assert.match(route, /<Footer/);
  assert.match(section, /import Breadcrumb/);
  assert.match(section, /import MediaThumbnail/);
  assert.match(section, /import QuantityStepper/);
  assert.match(section, /import ProductCard/);
  assert.match(section, /data-product-variants/);
  assert.match(section, /quantitychange/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1fr\)/,
  );
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.doesNotMatch(styles, /\.product-card__/);
});

test("Every catalog product resolves complete prepared detail data", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { shopCatalogProducts } =
    await import("../../src/data/shop/catalog.ts");
  const { getShopProductDescriptionDefaults, getShopProductDetailDefaults } =
    await import("../../src/data/public-copy.ts");

  assert.equal(shopCatalogProducts.length, 9);
  for (const locale of activeLocaleCodes) {
    const ui = getShopProductDetailDefaults(locale);
    const descriptions = getShopProductDescriptionDefaults(locale);
    for (const product of shopCatalogProducts) {
      const key = product.id.replaceAll("-", "_");
      for (const suffix of [
        "description",
        "ship_note",
        "include_1",
        "include_2",
        "include_3",
        "include_4",
      ]) {
        assert.equal(
          typeof descriptions[`shop_detail_${key}_${suffix}`],
          "string",
        );
        assert.notEqual(
          descriptions[`shop_detail_${key}_${suffix}`].trim(),
          "",
        );
      }
      if (product.variant) {
        assert.notEqual(ui[`shop_detail_${key}_variant_label`].trim(), "");
        for (let index = 1; index <= product.variant.optionCount; index += 1) {
          assert.notEqual(
            ui[`shop_detail_${key}_variant_option_${index}`].trim(),
            "",
          );
        }
      }
    }
  }
});

test("Product detail fields retain their bounded Content Studio targets", async () => {
  const { getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const targets = getBuilderPageTargets("shop");

  assert.ok(
    targets.some(
      (target) =>
        target.collection === "site_shop_product_descriptions" &&
        target.entry === "descriptions",
    ),
  );
  assert.deepEqual(
    getBuilderFieldTarget("shop_detail_natal_print_variant_label", "shop"),
    { collection: "site_shop_product_detail", entry: "detail" },
  );
  assert.deepEqual(
    getBuilderFieldTarget("shop_detail_natal_print_description", "shop"),
    { collection: "site_shop_product_descriptions", entry: "descriptions" },
  );
});

test("Product detail migration creates both collections below the column cap", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0081_shop_product_detail_content.sql"));
  for (const table of [
    "ec_site_shop_product_detail",
    "ec_site_shop_product_descriptions",
  ]) {
    const columns = sqlite.prepare(`PRAGMA table_info(${table})`).all();
    assert.ok(columns.length > 15);
    assert.ok(columns.length < 100);
  }
  sqlite.close();
});
