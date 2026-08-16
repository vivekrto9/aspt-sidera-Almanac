import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Badge.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/badge.css",
  import.meta.url,
);

test("Badge exposes one structure with semantic tones and appearances", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type BadgeTone = "neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "inverse"/);
  assert.match(source, /type BadgeAppearance = "soft" \| "solid"/);
  assert.match(source, /`sidera-badge--\$\{tone\}`/);
  assert.match(source, /`sidera-badge--\$\{appearance\}`/);
  assert.match(source, /<slot \/>/);
});

test("Badge supports optional decoration and accessible dynamic copy", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /Astro\.slots\.has\("icon"\)/);
  assert.match(source, /<slot name="icon" \/>/);
  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /\.\.\.badgeAttributes/);
});

test("Badge styles cover reference variants and responsive localization", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 999px/);
  assert.match(source, /\.sidera-badge--accent/);
  assert.match(source, /\.sidera-badge--inverse/);
  assert.match(source, /\.sidera-badge--solid/);
  assert.match(source, /max-inline-size: 100%/);
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /@media \(max-width: 40rem\)/);
});
