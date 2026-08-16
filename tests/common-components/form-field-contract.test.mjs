import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL("../../src/components/shared/FormField.astro", import.meta.url);
const stylesUrl = new URL("../../src/styles/shared/form-field.css", import.meta.url);

const [source, styles] = await Promise.all([
  readFile(componentUrl, "utf8"),
  readFile(stylesUrl, "utf8"),
]);

test("FormField associates a single label or a semantic group legend", () => {
  assert.match(source, /const Root = group \? "fieldset" : "div"/);
  assert.match(source, /const LabelElement = group \? "legend" : "label"/);
  assert.match(source, /for=\{!group \? controlId : undefined\}/);
  assert.match(source, /aria-describedby=\{group \? describedBy : undefined\}/);
  assert.match(source, /<slot \/>/);
});

test("FormField owns required, optional, help, and stable error presentation", () => {
  assert.match(source, /sidera-form-field__required/);
  assert.match(source, /sidera-form-field__optional/);
  assert.match(source, /const helpId = fieldId \? `\$\{fieldId\}-help` : undefined/);
  assert.match(source, /const errorId = fieldId \? `\$\{fieldId\}-error` : undefined/);
  assert.match(source, /role=\{errorText \? "alert" : undefined\}/);
  assert.match(source, /aria-live="polite"/);
  assert.match(styles, /\.sidera-form-field__error\s*\{[^}]*min-block-size:/s);
});

test("FormField keeps generated label decoration outside the editable content node", () => {
  const labelOpening = source.match(/<LabelElement[\s\S]*?>/)?.[0] ?? "";

  assert.doesNotMatch(labelOpening, /\{\.\.\.labelEditAttributes\}/);
  assert.match(source, /<span \{\.\.\.labelEditAttributes\}>\{label\}<\/span>/);
  assert.match(
    source,
    /<span \{\.\.\.labelEditAttributes\}>\{label\}<\/span>[\s\S]*sidera-form-field__required[\s\S]*sidera-form-field__optional/,
  );
});

test("FormField supports reference-led hidden labels, inverse tone, and responsive copy", () => {
  assert.match(source, /labelHidden/);
  assert.match(source, /`sidera-form-field--\$\{tone\}`/);
  assert.match(source, /labelEditAttributes/);
  assert.match(source, /helpEditAttributes/);
  assert.match(source, /errorEditAttributes/);
  assert.match(styles, /\.sidera-form-field--label-hidden/);
  assert.match(styles, /\.sidera-form-field--inverse/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
});
