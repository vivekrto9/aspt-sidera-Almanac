import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Accordion.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/accordion.css",
  import.meta.url,
);

test("Accordion uses native disclosure semantics without custom scripting", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<details class=\{classes\} open=\{open\} name=\{name\} id=\{id\}>/);
  assert.match(source, /<summary class="sidera-accordion__summary">/);
  assert.match(source, /<slot \/>/);
  assert.doesNotMatch(source, /<script>/);
  assert.doesNotMatch(source, /<button/);
});

test("Accordion supports category, initial state, and native exclusive groups", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /question: string/);
  assert.match(source, /category\?: string/);
  assert.match(source, /open\?: boolean/);
  assert.match(source, /name\?: string/);
  assert.match(source, /aria-hidden="true">\+<\/span>/);
});

test("Accordion styles preserve reference treatment and accessible states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 0\.875rem/);
  assert.match(source, /background: var\(--color-panel\)/);
  assert.match(source, /\.sidera-accordion__summary:focus-visible/);
  assert.match(source, /\.sidera-accordion\[open\] \.sidera-accordion__indicator/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
