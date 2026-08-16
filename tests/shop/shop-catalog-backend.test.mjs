import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Shop catalog migration seeds nine ordered products and media aliases", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0107_shop_catalog.sql"));
  const products = sqlite
    .prepare(
      `
    SELECT id, price_cents, category, image_url
    FROM ap_shop_products
    WHERE active = 1
    ORDER BY sort_order ASC
  `,
    )
    .all();

  assert.deepEqual(
    products.map((product) => product.id),
    [
      "natal-print",
      "tapestry",
      "almanac",
      "tarot",
      "notebook",
      "candle",
      "scarf",
      "pins",
      "pendant",
    ],
  );
  for (const product of products) {
    assert.ok(product.price_cents > 0);
    assert.match(product.category, /^(prints|books|home|jewelry)$/);
    assert.match(product.image_url, /^\/_assets\/aliases\/shop-/);
  }
  sqlite.close();
});

test("Shop routes and Home use the D1 repository while preserving CMS copy", async () => {
  const [
    repository,
    catalogPage,
    detailPage,
    homePage,
    cart,
    checkout,
    confirmation,
  ] = await Promise.all([
    read("src/server/aggregator/shop-catalog.ts"),
    read("src/pages/shop.astro"),
    read("src/pages/shop/[slug].astro"),
    read("src/pages/index.astro"),
    read("src/components/shop/sections/ShopCart.astro"),
    read("src/components/shop/sections/ShopCheckout.astro"),
    read("src/components/shop/sections/ShopOrderConfirmation.astro"),
  ]);

  assert.match(repository, /FROM ap_shop_products/);
  assert.match(repository, /WHERE active = 1 ORDER BY sort_order ASC/);
  assert.match(repository, /getShopProductBySlug/);
  assert.match(catalogPage, /listShopProducts\(runtimeEnv, locale\)/);
  assert.match(catalogPage, /content\[`shop_product_\$\{key\}_title`\]/);
  assert.match(detailPage, /getShopProductBySlug\(runtimeEnv, slug, locale\)/);
  assert.match(detailPage, /imageSrc: product\.imageUrl/);
  assert.match(homePage, /shopProductById/);
  assert.match(cart, /mediaSrc=\{product\.imageSrc\}/);
  assert.match(checkout, /mediaSrc=\{product\.imageSrc\}/);
  assert.match(confirmation, /src=\{product\.imageSrc\}/);
});
