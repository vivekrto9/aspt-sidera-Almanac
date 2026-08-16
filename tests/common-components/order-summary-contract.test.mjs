import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/OrderSummary.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/order-summary.css",
  import.meta.url,
);

test("OrderSummary composes the approved commerce components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import OrderLineItem from "\.\/OrderLineItem\.astro"/);
  assert.match(source, /import SummaryRow from "\.\/SummaryRow\.astro"/);
  assert.match(source, /<OrderLineItem/);
  assert.match(source, /<SummaryRow/);
  assert.match(source, /<Button/);
});

test("OrderSummary keeps reference structures in one bounded API", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type OrderSummaryVariant = "cart" \| "checkout" \| "booking" \| "receipt"/);
  assert.match(source, /items\?: SummaryItem\[\]/);
  assert.match(source, /rows\?: SummaryEntry\[\]/);
  assert.match(source, /totalLabel: string/);
  assert.match(source, /totalValue: string/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
  assert.match(source, /totalLabelEditAttributes\?: Record<string, string>/);
  assert.match(source, /Astro\.slots\.has\("coupon"\)/);
  assert.match(source, /Astro\.slots\.has\("payment"\)/);
});

test("OrderSummary supports links, native forms, and event integration", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /href=\{actionHref\}/);
  assert.match(source, /type=\{actionType\}/);
  assert.match(source, /form=\{form\}/);
  assert.match(source, /new CustomEvent\("ordersummaryaction"/);
  assert.match(source, /detail: \{ id: root\.id \}/);
});

test("OrderSummary styles reference panels and responsive states", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /inline-size: min\(100%, 23rem\)/);
  assert.match(styles, /border-radius: 1\.375rem/);
  assert.match(styles, /\.sidera-order-summary--sticky/);
  assert.match(styles, /\.sidera-order-summary--booking \.sidera-order-summary__total/);
  assert.match(styles, /\.sidera-order-summary--tone-inverse/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /position: static/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
