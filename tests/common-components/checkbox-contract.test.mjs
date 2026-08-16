import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Checkbox.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/checkbox.css",
  import.meta.url,
);

test("Checkbox keeps native input semantics and the label as the complete hit target", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<label class=\{classes\}>/);
  assert.match(source, /<input[\s\S]*type="checkbox"/);
  assert.match(source, /checked=\{checked\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /<span class="sidera-checkbox__label"/);
});

test("Checkbox exposes description, editable-copy, and validation contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /description\?: string/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
  assert.match(source, /descriptionEditAttributes\?: Record<string, string>/);
  assert.match(source, /aria-invalid=\{invalid \? "true" : undefined\}/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
});

test("Checkbox exposes a reusable semantic switch variant", async () => {
  const [component, styles] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(stylesheetPath, "utf8"),
  ]);
  assert.match(component, /variant\?: "checkbox" \| "switch"/);
  assert.match(component, /role=\{variant === "switch" \? "switch" : undefined\}/);
  assert.match(styles, /\.sidera-checkbox--switch/);
  assert.match(styles, /inline-size: 2\.75rem/);
  assert.match(styles, /block-size: 1\.625rem/);
  assert.match(styles, /sidera-checkbox--switch \.sidera-checkbox__control::after[\s\S]*position: absolute/);
  assert.match(styles, /translateX\(1\.125rem\)/);
});

test("Checkbox styles include interaction, disabled, mobile, and accessibility states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-checkbox:hover/);
  assert.match(source, /\.sidera-checkbox__control:focus-visible/);
  assert.match(source, /\.sidera-checkbox__control:checked/);
  assert.match(source, /\.sidera-checkbox--invalid/);
  assert.match(source, /:has\(\.sidera-checkbox__control:disabled\)/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
