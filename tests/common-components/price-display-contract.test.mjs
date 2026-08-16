import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/PriceDisplay.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/price-display.css",
  import.meta.url,
);

test("PriceDisplay accepts prepared current, original, and unit text", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /current: string;/);
  assert.match(source, /original\?: string;/);
  assert.match(source, /unit\?: string;/);
  assert.match(source, /sidera-price-display__current/);
  assert.match(source, /<del class="sidera-price-display__original"/);
  assert.match(source, /sidera-price-display__unit/);
});

test("PriceDisplay exposes bounded reference sizes, tones, and accessible labels", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"compact" \| "standard" \| "large" \| "display"/);
  assert.match(source, /"default" \| "inverse"/);
  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /aria-label=\{originalAriaLabel\}/);
});

test("PriceDisplay styles preserve reference hierarchy and mobile scaling", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /align-items: baseline/);
  assert.match(source, /font-family: var\(--font-serif\)/);
  assert.match(source, /font-family: var\(--font-sans\)/);
  assert.match(source, /white-space: nowrap/);
  assert.match(source, /\.sidera-price-display--inverse/);
  assert.match(source, /\.sidera-price-display--compact/);
  assert.match(source, /\.sidera-price-display--large/);
  assert.match(source, /\.sidera-price-display--display/);
  assert.match(source, /@media \(max-width: 40rem\)/);
});
