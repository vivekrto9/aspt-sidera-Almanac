import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/CastingState.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/casting-state.css",
  import.meta.url,
);

test("CastingState composes the approved loading status atom", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import LoadingIndicator from "\.\/LoadingIndicator\.astro"/);
  assert.match(source, /<LoadingIndicator/);
  assert.match(source, /label=\{statusLabel\}/);
  assert.match(source, /aria-busy="true"/);
});

test("CastingState keeps tool differences in one bounded visual API", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type CastingVisual = "single" \| "transit" \| "synastry"/);
  assert.match(source, /Astro\.slots\.has\("visual"\)/);
  assert.match(source, /<slot name="visual" \/>/);
  assert.match(source, /visual === "synastry"/);
  assert.match(source, /visual === "transit"/);
  assert.match(source, /summary \? \([\s\S]*<p/);
});

test("CastingState exposes optional exact-node Content Studio bindings", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /titleEditAttributes\?: Record<string, string>/);
  assert.match(source, /statusEditAttributes\?: Record<string, string>/);
  assert.match(source, /summaryEditAttributes\?: Record<string, string>/);
  assert.match(source, /sidera-casting-state__title" \{\.\.\.titleEditAttributes\}/);
  assert.match(source, /editAttributes=\{statusEditAttributes\}/);
  assert.match(source, /sidera-casting-state__summary" \{\.\.\.summaryEditAttributes\}/);
});

test("CastingState styles preserve responsive, reduced-motion, and contrast behavior", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-casting-state--viewport/);
  assert.match(source, /\.sidera-casting-state--embedded/);
  assert.match(
    source,
    /\.sidera-casting-state__visual\s*\{[^}]*inline-size: min\(100%, 28\.125rem\)/s,
  );
  assert.match(
    source,
    /\.sidera-casting-state--single \.sidera-casting-state__visual,[\s\S]*inline-size: min\(100%, 20\.625rem\)/,
  );
  assert.match(
    source,
    /@media \(max-width: 40rem\)[\s\S]*inline-size: min\(100%, 30rem\)[\s\S]*inline-size: min\(100%, 23rem\)/,
  );
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
