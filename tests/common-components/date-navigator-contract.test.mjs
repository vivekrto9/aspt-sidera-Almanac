import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/DateNavigator.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/date-navigator.css",
  import.meta.url,
);

test("DateNavigator composes the approved Button and IconButton atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /type DateNavigatorDensity = "compact" \| "standard"/);
  assert.match(source, /<nav/);
  assert.match(source, /aria-label=\{groupLabel\}/);
  assert.match(source, /aria-live="polite"/);
});

test("DateNavigator supports link, native form, and callback-style event integration", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /previousHref\?: string/);
  assert.match(source, /actionName\?: string/);
  assert.match(source, /name=\{actionName\}/);
  assert.match(source, /value=\{previousValue\}/);
  assert.match(source, /value=\{resetValue\}/);
  assert.match(source, /value=\{nextValue\}/);
  assert.match(source, /new CustomEvent\("datechange"/);
  assert.match(source, /detail: \{ action \}/);
});

test("DateNavigator exposes opt-in exact-node Content Studio hooks without changing defaults", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const hook of [
    "eyebrowEditAttributes",
    "labelEditAttributes",
    "descriptionEditAttributes",
    "resetLabelEditAttributes",
  ]) {
    assert.match(source, new RegExp(`${hook}\\?: Record<string, string>`));
    assert.match(source, new RegExp(`${hook} = \\{\\}`));
  }
  assert.match(source, /class="date-navigator__eyebrow" \{\.\.\.eyebrowEditAttributes\}/);
  assert.match(source, /aria-atomic="true" \{\.\.\.labelEditAttributes\}/);
  assert.match(source, /class="date-navigator__description" \{\.\.\.descriptionEditAttributes\}/);
  assert.match(source, /editAttributes=\{resetLabelEditAttributes\}/);
});

test("DateNavigator preserves reference sizing and responsive touch targets", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /--icon-button-size: 2\.625rem/);
  assert.match(styles, /--sidera-button-block-size: 2\.625rem/);
  assert.match(styles, /\.date-navigator--compact/);
  assert.match(styles, /--icon-button-size: 2\.5rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /--icon-button-size: 2\.75rem/);
  assert.match(styles, /--sidera-button-block-size: 2\.75rem/);
});
