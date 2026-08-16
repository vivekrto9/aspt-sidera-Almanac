import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Radio.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/radio.css",
  import.meta.url,
);

test("Radio keeps native group semantics and the label as the complete hit target", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /name: string/);
  assert.match(source, /<label class=\{classes\}>/);
  assert.match(source, /<input[\s\S]*type="radio"/);
  assert.match(source, /name=\{name\}/);
  assert.match(source, /checked=\{checked\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
});

test("Radio exposes supporting copy, edit attributes, and validation contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /description\?: string/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
  assert.match(source, /descriptionEditAttributes\?: Record<string, string>/);
  assert.match(source, /aria-invalid=\{invalid \? "true" : undefined\}/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
});

test("Radio styles cover interaction, disabled, mobile, and accessibility states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-radio:hover/);
  assert.match(source, /\.sidera-radio__control:focus-visible/);
  assert.match(source, /\.sidera-radio__control:checked/);
  assert.match(source, /\.sidera-radio--invalid/);
  assert.match(source, /:has\(\.sidera-radio__control:disabled\)/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
