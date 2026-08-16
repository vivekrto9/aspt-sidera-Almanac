import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ChartWheel.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/chart-wheel.css",
  import.meta.url,
);

test("ChartWheel exposes one normalized API for all reference modes", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"decorative" \| "natal" \| "transit" \| "synastry"/);
  assert.match(source, /type PlanetRing = "inner" \| "outer"/);
  assert.match(source, /longitude: number/);
  assert.match(source, /planets\?: Planet\[\]/);
  assert.match(source, /aspects\?: Aspect\[\]/);
  assert.match(source, /houseCusps\?: number\[\]/);
  assert.match(source, /const normalizedHouseCusps =/);
  assert.match(source, /const midpoint =/);
  assert.match(source, /const toPoint = \(longitude: number, radius: number\)/);
});

test("ChartWheel SVG is labeled and supports optional keyboard planet selection", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /viewBox="0 0 500 500"/);
  assert.match(source, /role="img"/);
  assert.match(source, /aria-label=\{title\}/);
  assert.match(source, /<title>\{title\}<\/title>/);
  assert.match(source, /role=\{interactive \? "button" : undefined\}/);
  assert.match(source, /event\.key !== "Enter" && event\.key !== " "/);
  assert.match(source, /new CustomEvent\("planetselect"/);
  assert.match(source, /<text x="250" y="250" dy="0\.1em">/);
});

test("ChartWheel styles preserve responsive geometry and accessibility states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.chart-wheel--compact/);
  assert.match(source, /\.chart-wheel--large/);
  assert.match(source, /\.chart-wheel--inverse/);
  assert.match(source, /--chart-disc-outer: var\(--color-panel\)/);
  assert.match(source, /--chart-color-fire: var\(--color-primary\)/);
  assert.match(source, /--aspect-color/);
  assert.match(source, /\.chart-wheel__planet:focus-visible circle/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
