import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/SummaryRow.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/summary-row.css",
  import.meta.url,
);

test("SummaryRow exposes the bounded reference variants and tones", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"default" \| "muted" \| "discount" \| "total"/);
  assert.match(source, /type SummaryRowTone = "default" \| "inverse"/);
  assert.match(source, /label: string/);
  assert.match(source, /value: string/);
  assert.match(source, /valueAriaLabel\?: string/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
  assert.match(source, /class="summary-row__label" \{\.\.\.labelEditAttributes\}/);
});

test("SummaryRow composes PriceDisplay only for emphasized totals", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import PriceDisplay from "\.\/PriceDisplay\.astro"/);
  assert.match(source, /variant === "total"/);
  assert.match(source, /<PriceDisplay/);
  assert.match(source, /current=\{value\}/);
  assert.match(source, /tone=\{tone\}/);
  assert.match(source, /class="summary-row__value"/);
});

test("SummaryRow styles preserve hierarchy and responsive localization", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /grid-template-columns: minmax\(0, 1fr\) auto/);
  assert.match(source, /\.summary-row--muted/);
  assert.match(source, /\.summary-row--discount/);
  assert.match(source, /\.summary-row--total/);
  assert.match(source, /\.summary-row--tone-inverse/);
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /@media \(max-width: 24rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
