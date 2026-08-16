import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Report catalog migration seeds the six ordered operational products", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0106_report_catalog.sql"));

  const products = sqlite
    .prepare(
      `
    SELECT slug, pages_count, price_cents, image_url, provider_endpoint_key
    FROM ap_report_products
    WHERE active = 1
    ORDER BY sort_order ASC
  `,
    )
    .all();

  assert.deepEqual(
    products.map((product) => product.slug),
    [
      "natal-blueprint",
      "year-ahead-forecast",
      "relationship-synastry",
      "solar-return-report",
      "career-vocation",
      "saturn-return-report",
    ],
  );
  for (const product of products) {
    assert.ok(product.pages_count > 0);
    assert.ok(product.price_cents > 0);
    assert.match(product.image_url, /^\/_assets\/aliases\/reports-/);
    assert.equal(product.provider_endpoint_key, null);
  }
  sqlite.close();
});

test("Report routes use the server repository and preserve Content Studio copy", async () => {
  const [repository, catalogPage, detailPage, homePage] = await Promise.all([
    read("src/server/aggregator/report-catalog.ts"),
    read("src/pages/reports.astro"),
    read("src/pages/reports/[slug].astro"),
    read("src/pages/index.astro"),
  ]);

  assert.match(repository, /FROM ap_report_products/);
  assert.match(repository, /WHERE active = 1 ORDER BY sort_order ASC/);
  assert.match(repository, /getReportProductBySlug/);
  assert.match(catalogPage, /listReportProducts\(runtimeEnv, locale\)/);
  assert.match(catalogPage, /builderEdit\(titleField\)/);
  assert.match(
    detailPage,
    /getReportProductBySlug\(runtimeEnv, slug, locale\)/,
  );
  assert.match(
    detailPage,
    /builderEdit\(`catalog_report_\$\{reportNumber\}_title`\)/,
  );
  assert.match(homePage, /homeReportProducts/);
});
