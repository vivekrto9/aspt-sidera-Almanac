import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/DateSelector.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/date-selector.css",
  import.meta.url,
);

test("DateSelector composes the approved FormField and SelectField dependencies", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import FormField from "\.\/FormField\.astro"/);
  assert.match(source, /import SelectField, \{ type SelectFieldOption \} from "\.\/SelectField\.astro"/);
  assert.match(source, /months: readonly SelectFieldOption\[\]/);
  assert.match(source, /days: readonly SelectFieldOption\[\]/);
  assert.match(source, /years: readonly SelectFieldOption\[\]/);
  assert.match(source, /group/);
});

test("DateSelector supports localized order, labels, native form data, and validation", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type DatePart = "month" \| "day" \| "year"/);
  assert.match(source, /order\?: readonly DatePart\[\]/);
  assert.match(source, /monthLabel: string/);
  assert.match(source, /dayLabel: string/);
  assert.match(source, /yearLabel: string/);
  assert.match(source, /autocompleteSection\?: string/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /invalid=\{Boolean\(errorText\)\}/);
  assert.match(source, /selectPresentation\?: DateSelectorPresentation/);
  assert.match(source, /presentation=\{selectPresentation\}/);
});

test("DateSelector styles preserve reference proportions and mobile reflow", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-date-selector__part--month/);
  assert.match(source, /flex: 1\.4 1 0/);
  assert.match(source, /\.sidera-date-selector__part--day/);
  assert.match(source, /flex: 0\.8 1 0/);
  assert.match(source, /\.sidera-date-selector__part--year/);
  assert.match(source, /@media \(max-width: 30rem\)/);
  assert.match(source, /grid-column: 1 \/ -1/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
