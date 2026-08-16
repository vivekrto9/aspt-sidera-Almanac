import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ZodiacSignItem.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/shared/zodiac-sign-item.css",
  import.meta.url,
);

test("ZodiacSignItem uses native link and button semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /href \? \(/);
  assert.match(source, /<a/);
  assert.match(source, /<button/);
  assert.match(source, /type=\{type\}/);
  assert.match(source, /aria-current=\{selected \? "page" : undefined\}/);
  assert.match(source, /aria-pressed=\{selected\}/);
  assert.match(source, /aria-disabled=\{disabled \? "true" : undefined\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.doesNotMatch(source, /<script/);
});

test("ZodiacSignItem keeps content prepared and localizable", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /sign: string/);
  assert.match(source, /glyph: string/);
  assert.match(source, /dates\?: string/);
  assert.match(source, /element\?: string/);
  assert.match(source, /const textGlyph =/);
  assert.match(source, /\\uFE0E/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /signEditAttributes/);
  assert.match(source, /datesEditAttributes/);
  assert.match(source, /elementEditAttributes/);
});

test("ZodiacSignItem exposes only reference-backed variants", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ZodiacSignSize = "compact" \| "standard"/);
  assert.match(
    source,
    /type ZodiacElementTone = "fire" \| "earth" \| "air" \| "water"/,
  );
  assert.match(source, /sidera-zodiac-sign--\$\{size\}/);
  assert.match(source, /sidera-zodiac-sign--\$\{elementTone\}/);
  assert.match(source, /selected && "sidera-zodiac-sign--selected"/);
});

test("ZodiacSignItem styles selection and accessible interaction states", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /var\(--color-primary\)/);
  assert.match(styles, /var\(--color-muted\)/);
  assert.match(styles, /var\(--color-primary-soft\)/);
  assert.match(styles, /var\(--color-dark\)/);
  assert.match(styles, /\.sidera-zodiac-sign--selected/);
  assert.match(styles, /max-inline-size: 17rem/);
  assert.match(styles, /max-inline-size: 8rem/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\[aria-disabled="true"\]/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
