import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/EmptyState.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/empty-state.css",
  import.meta.url,
);

test("EmptyState composes the approved Button and keeps copy prepared", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /title: string/);
  assert.match(source, /description\?: string/);
  assert.match(source, /actionLabel\?: string/);
  assert.match(source, /href=\{actionHref\}/);
  assert.doesNotMatch(source, /localizePath|Astro\.currentLocale|translations/);
});

test("EmptyState preserves semantic headings, optional visuals, and native actions", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type HeadingLevel = 2 \| 3/);
  assert.match(source, /aria-labelledby=\{headingId\}/);
  assert.match(source, /Astro\.slots\.has\("visual"\)/);
  assert.match(source, /Astro\.slots\.has\("action"\)/);
  assert.match(source, /type=\{actionType\}/);
  assert.match(source, /form=\{actionForm\}/);
  assert.match(source, /aria-live=\{ariaLive === "off" \? undefined : ariaLive\}/);
});

test("EmptyState matches the literal panel and plain reference variants", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-empty-state--panel/);
  assert.match(source, /border-radius: 1\.375rem/);
  assert.match(source, /background: var\(--color-panel\)/);
  assert.match(source, /font-size: 2\.5rem/);
  assert.match(source, /font-size: 1\.625rem/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
