import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/TextArea.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/text-area.css",
  import.meta.url,
);

test("TextArea supports native form attributes and controlled initial content", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<textarea/);
  assert.match(source, /rows=\{rows\}/);
  assert.match(source, /minlength=\{minlength\}/);
  assert.match(source, /maxlength=\{maxlength\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /readonly=\{readOnly\}/);
  assert.match(source, />\{value\}<\/textarea>/);
});

test("TextArea exposes approved tones, sizes, and accessible validation state", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"default" \| "inverse"/);
  assert.match(source, /"compact" \| "standard"/);
  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
  assert.match(source, /aria-invalid=\{invalid \? "true" : undefined\}/);
});

test("TextArea styles match reference states and responsive behavior", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /min-block-size: 5\.5rem/);
  assert.match(source, /resize: vertical/);
  assert.match(source, /border-radius: 0\.75rem/);
  assert.match(source, /\.sidera-text-area:hover/);
  assert.match(source, /\.sidera-text-area:focus-visible/);
  assert.match(source, /\.sidera-text-area\[aria-invalid="true"\]/);
  assert.match(source, /\.sidera-text-area\[readonly\]/);
  assert.match(source, /\.sidera-text-area:disabled/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
