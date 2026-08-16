import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/OrderLineItem.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/order-line-item.css",
  import.meta.url,
);

test("OrderLineItem composes the approved commerce dependencies", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import MediaThumbnail from "\.\/MediaThumbnail\.astro"/);
  assert.match(source, /import PriceDisplay from "\.\/PriceDisplay\.astro"/);
  assert.match(source, /import QuantityStepper from "\.\/QuantityStepper\.astro"/);
  assert.match(source, /<PriceDisplay/);
  assert.match(source, /<QuantityStepper/);
  assert.match(source, /<MediaThumbnail/);
});

test("OrderLineItem keeps editable, summary, and history rows in one API", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type OrderLineItemVariant = "editable" \| "summary" \| "history"/);
  assert.match(source, /variant === "editable"/);
  assert.match(source, /variant === "summary"/);
  assert.match(source, /variant === "history"/);
  assert.match(source, /statusLabel\?: string/);
  assert.match(source, /dateLabel\?: string/);
  assert.match(source, /quantity\?: number/);
});

test("OrderLineItem supports native forms and callback-style removal", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type=\{removeName \? "submit" : "button"\}/);
  assert.match(source, /name=\{removeName\}/);
  assert.match(source, /value=\{removeValue \?\? id\}/);
  assert.match(source, /form=\{form\}/);
  assert.match(source, /new CustomEvent\("orderitemremove"/);
  assert.match(source, /detail: \{ id: root\.dataset\.itemId \}/);
});

test("OrderLineItem styles match literal row sizes and mobile reflow", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /grid-template-columns: 6rem minmax\(0, 1fr\) auto/);
  assert.match(styles, /inline-size: 6rem/);
  assert.match(styles, /grid-template-columns: 4\.125rem minmax\(0, 1fr\) auto/);
  assert.match(styles, /inline-size: 4\.125rem/);
  assert.match(styles, /block-size: 4\.125rem/);
  assert.match(styles, /grid-template-columns: 4\.625rem minmax\(0, 1fr\) auto auto/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /grid-template-columns: 4\.5rem minmax\(0, 1fr\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
