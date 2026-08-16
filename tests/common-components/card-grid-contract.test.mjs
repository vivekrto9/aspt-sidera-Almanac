import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/CardGrid.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/card-grid.css",
  import.meta.url,
);

test("CardGrid exposes only bounded layout controls", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type CardGridElement = "div" \| "ul" \| "ol"/);
  assert.match(source, /type CardGridColumns = 2 \| 3 \| 4/);
  assert.match(source, /type CardGridTabletColumns = 1 \| 2 \| 3/);
  assert.match(source, /type CardGridMobileColumns = 1 \| 2/);
  assert.match(source, /type CardGridGap = "compact" \| "default" \| "loose"/);
  assert.match(source, /type CardGridAlignment = "start" \| "stretch"/);
});

test("CardGrid preserves caller semantics and prepared accessible names", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /as: Element = "div"/);
  assert.match(source, /ariaLabel\?: string/);
  assert.match(source, /ariaLabelledby\?: string/);
  assert.match(source, /attributes\?: Record<string, unknown>/);
  assert.match(source, /<Element/);
  assert.match(source, /<slot \/>/);
  assert.doesNotMatch(source, /<script/);
});

test("CardGrid owns reflow without styling unrelated card designs", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(
    styles,
    /grid-template-columns: repeat\s*\(\s*var\(--sidera-card-grid-columns\),\s*minmax\(0, 1fr\)/,
  );
  assert.match(styles, /> \* \{\s*min-inline-size: 0/);
  assert.match(styles, /\.sidera-card-grid:is\(ul, ol\)/);
  assert.match(styles, /@media \(max-width: 64rem\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /var\(--sidera-card-grid-mobile-columns\)/);
  assert.doesNotMatch(styles, /background:|border:|border-radius:|box-shadow:/);
});
