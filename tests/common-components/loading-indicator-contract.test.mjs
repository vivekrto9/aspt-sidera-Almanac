import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/LoadingIndicator.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/loading-indicator.css",
  import.meta.url,
);

test("LoadingIndicator exposes an explicit accessible status label", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /label: string/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live=\{ariaLive\}/);
  assert.match(source, /aria-atomic="true"/);
  assert.match(source, /sidera-loading-indicator__mark" aria-hidden="true"/);
  assert.match(source, /sidera-loading-indicator__label/);
  assert.match(source, /\{label\}/);
});

test("LoadingIndicator keeps variants bounded to shared async-state needs", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"compact" \| "standard" \| "large"/);
  assert.match(source, /"default" \| "accent" \| "inverse"/);
  assert.match(source, /"inline" \| "stacked"/);
  assert.match(source, /editAttributes\?: Record<string, string>/);
});

test("LoadingIndicator includes responsive, reduced-motion, and forced-color treatments", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /@keyframes sidera-loading-indicator-spin/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /animation: none/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
