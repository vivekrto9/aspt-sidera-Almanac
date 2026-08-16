import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Button.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/button.css",
  import.meta.url,
);

test("Button keeps native button and anchor semantics in one component", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ButtonType = "button" \| "submit" \| "reset"/);
  assert.match(source, /href \? \(/);
  assert.match(source, /<a/);
  assert.match(source, /href=\{isDisabled \? undefined : href\}/);
  assert.match(source, /aria-disabled=\{isDisabled \? "true" : undefined\}/);
  assert.match(source, /tabindex=\{isDisabled \? -1 : undefined\}/);
  assert.match(source, /<button/);
  assert.match(source, /type=\{type\}/);
  assert.match(source, /disabled=\{isDisabled\}/);
  assert.match(source, /name=\{name\}/);
  assert.match(source, /value=\{value\}/);
  assert.match(source, /form=\{form\}/);
  assert.match(source, /\.\.\.restAttributes/);
});

test("Button exposes the bounded reference variants, sizes, shapes, and icon positions", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /"primary" \| "secondary" \| "outline" \| "ghost" \| "link" \| "danger"/,
  );
  assert.match(source, /type ButtonSize = "compact" \| "standard" \| "large"/);
  assert.match(source, /type ButtonShape = "pill" \| "rounded"/);
  assert.match(source, /fullWidth\?: boolean/);
  assert.match(source, /Astro\.slots\.has\("leading-icon"\)/);
  assert.match(source, /Astro\.slots\.has\("trailing-icon"\)/);
  assert.match(source, /slot name="leading-icon"/);
  assert.match(source, /slot name="trailing-icon"/);
  assert.match(source, /editAttributes\?: Record<string, string>/);
  assert.match(source, /loading\?: boolean/);
  assert.match(source, /loadingLabel\?: string/);
  assert.match(
    source,
    /import LoadingIndicator from "\.\/LoadingIndicator\.astro"/,
  );
  assert.match(source, /data-loading=\{hasLoadingState/);
  assert.match(source, /disabled=\{isDisabled\}/);
});

test("Button styles preserve reference states and mobile accessibility", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /\.sidera-button:hover/);
  assert.match(styles, /\.sidera-button:active:not\(:disabled\)/);
  assert.match(styles, /\.sidera-button:focus-visible/);
  assert.match(styles, /\.sidera-button:disabled/);
  assert.match(styles, /\.sidera-button\[aria-disabled="true"\]/);
  assert.match(styles, /\.sidera-button\[data-loading="true"\]/);
  assert.match(styles, /opacity: 0\.64/);
  assert.match(styles, /pointer-events: none/);
  assert.match(styles, /\.sidera-button__loading-indicator/);
  assert.match(styles, /\.sidera-button--secondary/);
  assert.match(styles, /\.sidera-button--outline/);
  assert.match(styles, /\.sidera-button--ghost/);
  assert.match(styles, /\.sidera-button--link/);
  assert.match(styles, /\.sidera-button--danger/);
  assert.match(styles, /\.sidera-button--full-width/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /min-block-size: max\(2\.75rem/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
