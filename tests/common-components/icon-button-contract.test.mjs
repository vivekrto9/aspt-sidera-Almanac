import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/IconButton.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/icon-button.css",
  import.meta.url,
);

test("IconButton requires an accessible label and supports button and link semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /ariaLabel: string;/);
  assert.match(source, /href \? \(/);
  assert.match(source, /<a[\s\S]*aria-label=\{resolvedAriaLabel\}/);
  assert.match(source, /<button[\s\S]*aria-label=\{resolvedAriaLabel\}/);
  assert.match(source, /aria-disabled=\{isDisabled \? "true" : undefined\}/);
  assert.match(source, /disabled=\{isDisabled\}/);
  assert.match(source, /\.\.\.restAttributes/);
});

test("IconButton exposes the approved variants, sizes, shapes, and control states", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"outline" \| "solid" \| "ghost" \| "danger"/);
  assert.match(source, /"compact" \| "standard" \| "large"/);
  assert.match(source, /"rounded" \| "circle"/);
  assert.match(source, /aria-pressed=\{pressed\}/);
  assert.match(source, /aria-expanded=\{expanded\}/);
  assert.match(source, /aria-controls=\{controls\}/);
  assert.match(source, /loading\?: boolean/);
  assert.match(source, /loadingLabel\?: string/);
  assert.match(source, /LoadingIndicator/);
  assert.match(source, /data-loading=\{hasLoadingState/);
});

test("IconButton styles include interaction, disabled, mobile, and reduced-motion treatment", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.icon-button:hover/);
  assert.match(source, /\.icon-button:focus-visible/);
  assert.match(source, /\.icon-button:disabled/);
  assert.match(source, /\.icon-button\[data-loading="true"\]/);
  assert.match(source, /opacity: 0\.64/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /--icon-button-size: 2\.75rem/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
