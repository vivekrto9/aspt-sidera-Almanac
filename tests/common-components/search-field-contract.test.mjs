import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/SearchField.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/search-field.css",
  import.meta.url,
);

test("SearchField composes the approved field and icon-button atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /import TextField from "\.\/TextField\.astro"/);
  assert.match(source, /type="search"/);
  assert.match(source, /role="search"/);
  assert.match(source, /ariaLabel: string/);
});

test("SearchField supports submit, clear, disabled, invalid, and shape variants", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"pill" \| "rounded"/);
  assert.match(source, /showSubmit\?: boolean/);
  assert.match(source, /clearable\?: boolean/);
  assert.match(source, /disabled\?: boolean/);
  assert.match(source, /invalid\?: boolean/);
  assert.match(source, /type="submit"/);
  assert.match(source, /clearButton\.addEventListener\("click"/);
  assert.match(source, /input\.dispatchEvent\(new Event\("input"/);
  assert.match(source, /input\.focus\(\)/);
});

test("SearchField styles preserve interaction, mobile, and accessibility states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-search-field:hover/);
  assert.match(source, /\.sidera-search-field:focus-within/);
  assert.match(source, /\.sidera-search-field--invalid/);
  assert.match(source, /\.sidera-search-field--disabled/);
  assert.match(source, /\.sidera-search-field__clear\[hidden\]/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
