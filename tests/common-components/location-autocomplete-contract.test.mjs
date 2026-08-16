import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/LocationAutocomplete.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/location-autocomplete.css",
  import.meta.url,
);

test("LocationAutocomplete composes the approved form primitives", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import FormField from "\.\/FormField\.astro"/);
  assert.match(source, /import TextField from "\.\/TextField\.astro"/);
  assert.match(source, /<FormField/);
  assert.match(source, /<TextField/);
  assert.match(source, /inputEditAttributes\?: Record<string, string>/);
  assert.match(source, /<TextField\s+\{\.\.\.inputEditAttributes\}/);
});

test("LocationAutocomplete exposes native combobox and form semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /role="combobox"/);
  assert.match(source, /aria-autocomplete="list"/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /role="option"/);
  assert.match(source, /aria-activedescendant/);
  assert.match(source, /type="hidden"/);
  assert.match(source, /sidera:location-select/);
  assert.match(source, /name=\{`\$\{name\}TimezoneOffset`\}/);
});

test("LocationAutocomplete implements API search, cancellation, and details resolution", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /places\/autocomplete/);
  assert.match(source, /places\/details/);
  assert.match(source, /new AbortController\(\)/);
  assert.match(source, /searchController\?\.abort\(\)/);
  assert.match(source, /detailsController\?\.abort\(\)/);
  assert.match(source, /sessionToken/);
  assert.match(source, /window\.setTimeout/);
  assert.match(source, /dateInput.*addEventListener\("change"/s);
  assert.match(source, /timeInput.*addEventListener\("change"/s);
});

test("LocationAutocomplete implements keyboard selection and strict selected state", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const key of ["ArrowDown", "ArrowUp", "Home", "End", "Enter", "Escape", "Tab"]) {
    assert.match(source, new RegExp(`event\\.key === "${key}"`));
  }
  assert.match(source, /aria-selected/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /Coordinates and time zone located/);
  assert.match(source, /hasSelectedLocation/);
  assert.match(source, /setCustomValidity\(copy\.choose\)/);
  assert.match(source, /timezone/);
  assert.match(source, /offset/);
});

test("LocationAutocomplete retains responsive and accessible visual states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /:hover/);
  assert.match(source, /\[data-active="true"\]/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
  assert.match(source, /text-overflow: ellipsis/);
});
