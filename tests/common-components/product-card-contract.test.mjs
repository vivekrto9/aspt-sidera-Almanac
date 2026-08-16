import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ProductCard.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/product-card.css",
  import.meta.url,
);

test("ProductCard composes the completed commerce atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /import MediaThumbnail from "\.\/MediaThumbnail\.astro"/);
  assert.match(source, /import PriceDisplay from "\.\/PriceDisplay\.astro"/);
  assert.match(source, /<Badge/);
  assert.match(source, /<Button/);
  assert.match(source, /<IconButton/);
  assert.match(source, /<PriceDisplay/);
});

test("ProductCard keeps Home and catalog treatments in one bounded API", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ProductCardVariant = "compact" \| "catalog"/);
  assert.match(source, /variant === "compact"/);
  assert.match(source, /personalizationLabel\?: string/);
  assert.match(source, /imageAlt = title/);
  assert.match(source, /<MediaThumbnail/);
  assert.match(source, /alt=\{imageAlt\}/);
  assert.doesNotMatch(source, /mediaLabel|product-card__media-label/);
  assert.match(source, /titleEditAttributes\?: Record<string, string>/);
  assert.match(source, /metaEditAttributes\?: Record<string, string>/);
  assert.match(source, /imageAltEditAttributes\?: Record<string, string>/);
  assert.match(source, /priceEditAttributes\?: Record<string, string>/);
  assert.match(
    source,
    /fallbackLabelEditAttributes=\{imageAltEditAttributes\}/,
  );
  assert.match(source, /\{\.\.\.priceEditAttributes\}/);
});

test("ProductCard preserves localized links and quick-add integration", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /localizePath\(href, locale\)/);
  assert.match(source, /name=\{addName\}/);
  assert.match(source, /value=\{productId\}/);
  assert.match(source, /disabled=\{addDisabled\}/);
  assert.match(source, /new CustomEvent\("productadd"/);
  assert.match(source, /detail: \{ productId \}/);
});

test("ProductCard styles preserve image hierarchy and responsive interaction", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /\.product-card:hover/);
  assert.match(styles, /transform: translateY\(-0\.25rem\)/);
  assert.match(styles, /\.product-card--compact \.product-card__media/);
  assert.match(styles, /block-size: 13\.125rem/);
  assert.match(styles, /\.product-card__thumbnail/);
  assert.doesNotMatch(styles, /\.product-card__media-label/);
  assert.match(styles, /\.product-card__compact-link:focus-visible/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
