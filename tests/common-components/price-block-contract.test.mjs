import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/PriceBlock.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/price-block.css",
  import.meta.url,
);

test("PriceBlock composes the approved price and badge atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import PriceDisplay from "\.\/PriceDisplay\.astro"/);
  assert.match(source, /<PriceDisplay/);
  assert.match(source, /<Badge/);
});

test("PriceBlock accepts prepared price, metadata, and accessibility copy", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /current: string/);
  assert.match(source, /original\?: string/);
  assert.match(source, /unit\?: string/);
  assert.match(source, /label\?: string/);
  assert.match(source, /supportingText\?: string/);
  assert.match(source, /badgeLabel\?: string/);
  assert.match(source, /ariaLabel\?: string/);
  assert.match(source, /originalAriaLabel\?: string/);
});

test("PriceBlock keeps layout variants bounded and responsive", async () => {
  const component = await readFile(componentPath, "utf8");
  const stylesheet = await readFile(stylesheetPath, "utf8");

  assert.match(component, /"compact" \| "standard" \| "display"/);
  assert.match(component, /"default" \| "inverse"/);
  assert.match(component, /"start" \| "center"/);
  assert.match(stylesheet, /\.sidera-price-block--inverse/);
  assert.match(stylesheet, /\.sidera-price-block--compact/);
  assert.match(stylesheet, /\.sidera-price-block--display/);
  assert.match(stylesheet, /\.sidera-price-block--center/);
  assert.match(stylesheet, /@media \(max-width: 40rem\)/);
});
