import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/AspectRow.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/aspect-row.css",
  import.meta.url,
);

test("AspectRow preserves one structure for static, link, and button rows", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /const Root = href \? "a" : interactive \? "button" : "div"/);
  assert.match(source, /aria-pressed=\{interactive && !href \? selected : undefined\}/);
  assert.match(source, /aria-current=\{href && selected \? "true" : undefined\}/);
  assert.match(source, /disabled=\{interactive && !href \? disabled : undefined\}/);
});

test("AspectRow exposes aspect identity, phase badge, and interpretation contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /firstLabel: string/);
  assert.match(source, /secondLabel: string/);
  assert.match(source, /aspectGlyph: string/);
  assert.match(source, /orb: string/);
  assert.match(source, /<Badge tone=\{phaseTone\}/);
  assert.match(source, /Astro\.slots\.has\("interpretation"\)/);
  assert.match(source, /<slot name="interpretation" \/>/);
  assert.match(source, /aspectLabelEditAttributes/);
  assert.match(source, /phaseLabelEditAttributes/);
  assert.match(source, /interpretationEditAttributes/);
  assert.match(source, /type AspectAppearance = "default" \| "sky"/);
  assert.match(source, /appearance === "sky"/);
});

test("AspectRow styles cover tone, interaction, and mobile localization", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-aspect-row--conjunction/);
  assert.match(source, /\.sidera-aspect-row--harmonious/);
  assert.match(source, /\.sidera-aspect-row--challenging/);
  assert.match(source, /:hover/);
  assert.match(source, /:focus-visible/);
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /\.sidera-aspect-row--sky/);
  assert.match(source, /border-block-start: 0/);
});
