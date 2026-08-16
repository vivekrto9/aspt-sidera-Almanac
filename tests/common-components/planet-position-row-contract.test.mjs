import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/PlanetPositionRow.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/planet-position-row.css",
  import.meta.url,
);

test("PlanetPositionRow composes prepared planetary data with the approved Badge atom", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /planetName: string/);
  assert.match(source, /planetGlyph: string/);
  assert.match(source, /signName: string/);
  assert.match(source, /degreeText: string/);
  assert.match(source, /houseText\?: string/);
  assert.match(source, /motionText\?: string/);
  assert.match(source, /<Badge/);
});

test("PlanetPositionRow supports read-only and native selectable row semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /const Root = interactive \? "button" : "div"/);
  assert.match(source, /type=\{interactive \? "button" : undefined\}/);
  assert.match(source, /disabled=\{interactive \? disabled : undefined\}/);
  assert.match(source, /aria-pressed=\{interactive \? selected : undefined\}/);
  assert.match(source, /"compact" \| "standard"/);
  assert.match(source, /"default" \| "inverse"/);
});

test("PlanetPositionRow styles cover selection, interaction, responsive data, and accessibility", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-planet-position-row--selected/);
  assert.match(source, /\.sidera-planet-position-row--interactive:hover/);
  assert.match(source, /\.sidera-planet-position-row--interactive:focus-visible/);
  assert.match(source, /\.sidera-planet-position-row--interactive:disabled/);
  assert.match(source, /font-variant-numeric: tabular-nums/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
