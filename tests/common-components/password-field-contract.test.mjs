import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL("../../src/components/shared/PasswordField.astro", import.meta.url);
const stylesUrl = new URL("../../src/styles/shared/password-field.css", import.meta.url);

const [source, styles] = await Promise.all([
  readFile(componentUrl, "utf8"),
  readFile(stylesUrl, "utf8"),
]);

test("PasswordField composes the approved field, input, and icon-button dependencies", () => {
  assert.match(source, /import FormField from "\.\/FormField\.astro"/);
  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(source, /import TextField from "\.\/TextField\.astro"/);
  assert.match(source, /type="password"/);
  assert.match(source, /controls=\{id\}/);
  assert.match(source, /pressed=\{false\}/);
});

test("PasswordField keeps prepared copy, form attributes, and validation accessible", () => {
  assert.match(source, /showLabel: string/);
  assert.match(source, /hideLabel: string/);
  assert.match(source, /autocomplete=\{autocomplete\}/);
  assert.match(source, /minlength=\{minlength\}/);
  assert.match(source, /ariaDescribedby=\{describedBy\}/);
  assert.match(source, /invalid=\{invalid \|\| Boolean\(errorText\)\}/);
  assert.match(source, /labelEditAttributes/);
});

test("PasswordField toggles only presentation while preserving native password form behavior", () => {
  assert.match(source, /const visible = input\.type === "password"/);
  assert.match(source, /input\.type = visible \? "text" : "password"/);
  assert.match(source, /toggle\.setAttribute\("aria-pressed", String\(visible\)\)/);
  assert.match(source, /toggle\.setAttribute\("aria-label", visible \? hideLabel : showLabel\)/);
  assert.doesNotMatch(source, /input\.value\s*=/);
});

test("PasswordField styles protect input space and mobile toggle targets", () => {
  assert.match(styles, /\.sidera-password-field__control\s*\{[^}]*display: grid/s);
  assert.match(styles, /padding-inline-end: 3\.5rem/);
  assert.match(styles, /\.sidera-password-field\[data-password-visible\]/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("PasswordField keeps the active visibility toggle unfilled until desktop hover", () => {
  assert.match(styles, /__toggle\[aria-pressed="true"\]/);
  assert.match(styles, /--icon-button-background:\s*transparent/);
  assert.match(styles, /--icon-button-hover-background:\s*var\(--color-surface\)/);
  assert.match(styles, /--icon-button-active-background:\s*transparent/);
});

test("PasswordField suppresses sticky hover treatment on touch input", () => {
  assert.match(styles, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(
    styles,
    /@media \(hover: none\), \(pointer: coarse\)[\s\S]*--icon-button-hover-background:\s*transparent/,
  );
});
