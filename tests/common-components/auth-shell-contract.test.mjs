import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/AuthShell.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/auth-shell.css",
  import.meta.url,
);

test("AuthShell composes minimal navigation and a caller-owned form panel", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import BrandLogo from "\.\/BrandLogo\.astro"/);
  assert.match(source, /sidera-auth-shell__nav/);
  assert.match(source, /sidera-auth-shell__back/);
  assert.match(source, /aria-label=\{formLabel\}/);
  assert.match(source, /<slot \/>/);
});

test("AuthShell keeps each authentication mode caller-owned", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.doesNotMatch(source, /AuthMode|data-auth-mode|signup|forgot-password|reset-password/);
  assert.doesNotMatch(source, /sidera-auth-shell__modes/);
  assert.doesNotMatch(source, /Astro\.slots\.has\("social"\)/);
  assert.doesNotMatch(source, /Astro\.currentLocale|translations/);
});

test("AuthShell prepares localized chrome and editable supporting copy", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /localizePath\(brandHref, locale\)/);
  assert.match(source, /localizePath\(backHref, locale\)/);
  assert.match(source, /panelKicker: string/);
  assert.match(source, /perks\?: AuthShellPerk\[\]/);
  assert.match(source, /brandEditAttributes/);
  assert.match(source, /descriptionEditAttributes/);
});

test("AuthShell preserves the contained split and compact mobile flow", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: min\(100%, 67\.5rem\)/);
  assert.match(source, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(source, /min-block-size: 41\.25rem/);
  assert.match(source, /@media \(max-width: 51\.25rem\)/);
  assert.match(source, /@media \(max-width: 35rem\)/);
  assert.match(source, /\.sidera-auth-shell__description,[\s\S]*display: none/);
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
