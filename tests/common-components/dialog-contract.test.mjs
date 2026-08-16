import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Dialog.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/dialog.css",
  import.meta.url,
);

test("Dialog composes native modal semantics and completed controls", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /<dialog/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-describedby=\{descriptionId\}/);
  assert.match(source, /method="dialog"/);
});

test("Dialog keeps visible copy prepared and actions caller-owned", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /closeLabel: string/);
  assert.match(source, /primaryLabel\?: string/);
  assert.match(source, /secondaryLabel\?: string/);
  assert.match(source, /Astro\.slots\.has\("actions"\)/);
  assert.match(source, /Astro\.slots\.has\("default"\)/);
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /descriptionEditAttributes/);
  assert.doesNotMatch(source, /Astro\.currentLocale|translations/);
});

test("Dialog implements modal opening, dismissal, and focus return", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /dialog\.showModal\(\)/);
  assert.match(source, /dialog\.addEventListener\("cancel"/);
  assert.match(source, /event\.target === dialog/);
  assert.match(source, /returnFocus\?\.focus\(\)/);
  assert.match(source, /CSS\.escape\(dialogId\)/);
  assert.match(source, /sidera:dialog-close/);
  assert.match(source, /data-dialog-close/);
  assert.match(source, /dialog\.close\("dismiss"\)/);
  assert.match(source, /window\.addEventListener\("pagehide", closeRestoredDialogs\)/);
  assert.match(source, /event\.persisted/);
});

test("Dialog can keep Content Studio above a caller-owned overlay", async () => {
  const source = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(source, /builderToolbarAbove\?: boolean/);
  assert.match(source, /data-builder-toolbar-above/);
  assert.match(source, /document\.querySelector\("\[data-builder-toolbar\]"\)/);
  assert.match(source, /dialog\.show\(\)/);
  assert.match(source, /dialog\.dataset\.modelessOverlay = "true"/);
  assert.match(styles, /data-modeless-overlay="true"/);
  assert.match(styles, /z-index: 2147483600/);
  assert.match(styles, /block-size: 100dvh/);
});

test("Dialog styles preserve Warm Modern desktop and mobile states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: min\(calc\(100% - 2rem\), 38rem\)/);
  assert.match(source, /\.sidera-dialog::backdrop/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /inset-block: auto 0/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
