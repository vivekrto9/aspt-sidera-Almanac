import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/TextField.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/text-field.css",
  import.meta.url,
);

test("TextField supports the approved input types and native form attributes", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"text" \| "email" \| "password" \| "tel" \| "search"/);
  assert.match(source, /autocomplete=\{autocomplete\}/);
  assert.match(source, /inputmode=\{inputmode\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /readonly=\{readOnly\}/);
});

test("TextField exposes accessible labeling, description, and validation state", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
  assert.match(source, /aria-invalid=\{invalid \? "true" : undefined\}/);
});

test("TextField styles cover reference fidelity and required interaction states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 0\.6875rem/);
  assert.match(source, /\.sidera-text-field:hover/);
  assert.match(source, /\.sidera-text-field:focus-visible/);
  assert.match(source, /\.sidera-text-field\[aria-invalid="true"\]/);
  assert.match(source, /\.sidera-text-field\[readonly\]/);
  assert.match(source, /\.sidera-text-field:disabled/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
