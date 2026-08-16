import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/RatingStars.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/rating-stars.css",
  import.meta.url,
);

test("RatingStars keeps read-only and interactive modes in one component", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /interactive\?: boolean/);
  assert.match(source, /role="img"/);
  assert.match(source, /role="radiogroup"/);
  assert.match(source, /type="radio"/);
  assert.match(source, /checked=\{roundedValue === star\}/);
});

test("RatingStars exposes native form and localized accessibility contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /name=\{name\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /form=\{form\}/);
  assert.match(source, /valueLabels\?\: readonly string\[\]/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
});

test("RatingStars styles interactive states and mobile touch targets", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /min-inline-size: 2\.75rem/);
  assert.match(source, /min-block-size: 2\.75rem/);
  assert.match(source, /:hover/);
  assert.match(source, /:focus-within/);
  assert.match(source, /input:checked/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
