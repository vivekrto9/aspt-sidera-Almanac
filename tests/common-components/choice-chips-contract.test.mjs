import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ChoiceChips.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/choice-chips.css",
  import.meta.url,
);

test("ChoiceChips supports native single and multiple selection", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ChoiceMode = "single" \| "multiple"/);
  assert.match(source, /inputType = mode === "single" \? "radio" : "checkbox"/);
  assert.match(source, /mode === "single" \? value === option\.value : values\.includes/);
  assert.match(source, /type=\{inputType\}/);
  assert.match(source, /name=\{name\}/);
  assert.match(source, /value=\{option\.value\}/);
  assert.match(source, /checked=\{checked\}/);
  assert.match(source, /form=\{form\}/);
  assert.doesNotMatch(source, /<script/);
});

test("ChoiceChips keeps the option group accessible and localizable", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<fieldset/);
  assert.match(source, /id=\{id\}/);
  assert.match(source, /<legend/);
  assert.match(source, /label: string/);
  assert.match(source, /options: ChoiceOption\[\]/);
  assert.match(source, /\{\.\.\.option\.editAttributes\}/);
  assert.match(source, /aria-describedby=\{describedBy\}/);
  assert.match(source, /aria-invalid=/);
  assert.match(source, /aria-required=/);
  assert.match(source, /role=\{errorText \? "alert" : undefined\}/);
  assert.match(source, /hideLabel\?: boolean/);
  assert.match(source, /labelEditAttributes\?: Record<string, string>/);
});

test("ChoiceChips exposes only reference-backed visual variants", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ChoiceShape = "pill" \| "rounded"/);
  assert.match(source, /type ChoiceSize = "compact" \| "standard"/);
  assert.match(source, /type ChoiceTone = "default" \| "inverse"/);
  assert.match(source, /`sidera-choice-chips--\$\{shape\}`/);
  assert.match(source, /`sidera-choice-chips--\$\{size\}`/);
  assert.match(source, /`sidera-choice-chips--tone-\$\{tone\}`/);
});

test("ChoiceChips styles checked, focus, disabled, mobile, and contrast states", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /\.sidera-choice-chips__input:checked \+ \.sidera-choice-chips__chip/);
  assert.match(styles, /\.sidera-choice-chips__input:focus-visible \+ \.sidera-choice-chips__chip/);
  assert.match(styles, /\.sidera-choice-chips__input:disabled \+ \.sidera-choice-chips__chip/);
  assert.match(styles, /\.sidera-choice-chips--rounded/);
  assert.match(styles, /\.sidera-choice-chips--compact/);
  assert.match(styles, /\.sidera-choice-chips--tone-inverse/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /--choice-chip-min-height: 2\.75rem/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
