import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/RatingSummary.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/rating-summary.css",
  import.meta.url,
);

test("RatingSummary composes the approved read-only RatingStars atom", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import RatingStars from "\.\/RatingStars\.astro"/);
  assert.match(source, /value: number/);
  assert.match(source, /ratingText: string/);
  assert.match(source, /<RatingStars/);
  assert.doesNotMatch(source, /interactive=/);
});

test("RatingSummary accepts prepared accessible copy and optional metadata", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /ariaLabel: string/);
  assert.match(source, /role="group" aria-label=\{ariaLabel\}/);
  assert.match(source, /countText\?: string/);
  assert.match(source, /label\?: string/);
  assert.match(source, /ratingEditAttributes\?: Record<string, string>/);
  assert.match(source, /countEditAttributes\?: Record<string, string>/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
});

test("RatingSummary styles cover bounded size, tone, wrapping, and contrast variants", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-rating-summary--compact/);
  assert.match(source, /\.sidera-rating-summary--inverse/);
  assert.match(source, /flex-wrap: wrap/);
  assert.match(source, /font-variant-numeric: tabular-nums/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
