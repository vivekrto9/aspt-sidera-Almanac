import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/QuantityStepper.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/quantity-stepper.css",
  import.meta.url,
);

test("QuantityStepper composes the approved IconButton dependency", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /type QuantityStepperSize = "compact" \| "standard"/);
  assert.match(source, /role="group"/);
  assert.match(source, /ariaLabel=\{decrementLabel\}/);
  assert.match(source, /ariaLabel=\{incrementLabel\}/);
});

test("QuantityStepper supports bounded values and native form submission", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /data-min=\{safeMin\}/);
  assert.match(source, /data-max=\{safeMax\}/);
  assert.match(source, /data-step=\{safeStep\}/);
  assert.match(source, /type="hidden" name=\{name\} value=\{boundedValue\}/);
  assert.match(source, /Math\.min\(Math\.max\(nextValue, min\), max\)/);
  assert.match(source, /new CustomEvent\("quantitychange"/);
});

test("QuantityStepper styles match product and cart reference sizes", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /--quantity-control-size: 2\.375rem/);
  assert.match(source, /\.quantity-stepper--compact/);
  assert.match(source, /--quantity-control-size: 2rem/);
  assert.match(source, /border-radius: 999px/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /--quantity-control-size: 2\.75rem/);
});
