import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/SelectField.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/select-field.css",
  import.meta.url,
);

test("SelectField keeps native select semantics and dynamic options", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<select/);
  assert.match(source, /options\?: readonly SelectFieldOption\[\]/);
  assert.match(source, /options\.map/);
  assert.match(source, /selected=\{selectedValue === String\(option\.value\)\}/);
  assert.match(source, /: <slot \/>/);
});

test("SelectField exposes form, accessibility, validation, and density contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"standard" \| "compact"/);
  assert.match(source, /autocomplete=\{autocomplete\}/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /disabled=\{disabled\}/);
  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /aria-describedby=\{ariaDescribedby\}/);
  assert.match(source, /aria-invalid=\{invalid \? "true" : undefined\}/);
});

test("SelectField offers an anchored popover without changing the native default", async () => {
  const [component, styles] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(stylesheetPath, "utf8"),
  ]);

  assert.match(component, /type SelectFieldPresentation = "native" \| "popover"/);
  assert.match(component, /presentation = "native"/);
  assert.match(component, /data-select-popover/);
  assert.match(component, /role="listbox"/);
  assert.match(component, /data-select-native/);
  assert.match(component, /nativeSelect\.dispatchEvent\(new Event\("change"/);
  assert.match(
    component,
    /nativeSelect\.addEventListener\("change", synchronizeSelection\)/,
  );
  assert.match(component, /event\.key === "ArrowDown"/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(component, /chooseOption\(activeOption\)/);
  assert.match(styles, /\.sidera-select-popover__menu/);
  assert.match(styles, /inset-block-start: calc\(100% \+ 0\.375rem\)/);
  assert.match(styles, /z-index: 80/);
  assert.match(styles, /max-block-size: min\(16rem, 50svh\)/);
});

test("SelectField supports opt-in Content Studio attributes on visible popover options", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /editAttributes\?: Record<string, string>/);
  assert.match(source, /<span \{\.\.\.option\.editAttributes\}>\{option\.label\}<\/span>/);
});

test("SelectField styles cover reference fidelity and required interaction states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 0\.6875rem/);
  assert.match(source, /\.sidera-select-field--compact/);
  assert.match(source, /\.sidera-select-field:hover/);
  assert.match(source, /\.sidera-select-field:focus-visible/);
  assert.match(source, /\.sidera-select-field\[aria-invalid="true"\]/);
  assert.match(source, /\.sidera-select-field:disabled/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
