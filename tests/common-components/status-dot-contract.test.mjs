import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/StatusDot.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/status-dot.css",
  import.meta.url,
);

test("StatusDot always renders visible status text alongside its decorative mark", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /label: string/);
  assert.match(source, /sidera-status-dot__mark" aria-hidden="true"/);
  assert.match(source, /sidera-status-dot__label/);
  assert.match(source, /\{label\}/);
});

test("StatusDot exposes bounded semantic tones, contrast, size, and live-region support", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"neutral" \| "success" \| "warning" \| "accent" \| "danger"/);
  assert.match(source, /"default" \| "inverse"/);
  assert.match(source, /"compact" \| "standard"/);
  assert.match(source, /aria-live=\{ariaLive\}/);
  assert.match(source, /editAttributes\?: Record<string, string>/);
});

test("StatusDot styles cover reference tones, responsive text, and forced colors", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-status-dot--success/);
  assert.match(source, /\.sidera-status-dot--warning/);
  assert.match(source, /\.sidera-status-dot--accent/);
  assert.match(source, /\.sidera-status-dot--danger/);
  assert.match(source, /\.sidera-status-dot--inverse/);
  assert.match(source, /\.sidera-status-dot--compact/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
