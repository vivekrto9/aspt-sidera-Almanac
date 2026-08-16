import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../../src/components/shared/LegalDocumentLayout.astro",
  import.meta.url,
);
const stylesUrl = new URL(
  "../../src/styles/shared/legal-document-layout.css",
  import.meta.url,
);

test("LegalDocumentLayout composes the approved legal intro", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /import PageIntro from "\.\/PageIntro\.astro"/);
  assert.match(source, /<PageIntro/);
  assert.match(source, /density="compact"/);
  assert.match(source, /headingId=\{headingId\}/);
  assert.match(source, /breadcrumbs=\{breadcrumbs\}/);
  assert.match(source, /locale=\{locale\}/);
});

test("LegalDocumentLayout receives prepared copy and keeps legal sections semantic", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /type LegalSection =/);
  assert.match(source, /paragraphs: string\[\]/);
  assert.match(source, /aria-labelledby=\{headingId\}/);
  assert.match(source, /data-legal-document-layout/);
  assert.match(source, /class="legal-document-layout__section"/);
  assert.match(source, /aria-labelledby=\{`\$\{sectionId\}-heading`\}/);
  assert.match(source, /<footer class="legal-document-layout__contact"/);
  assert.doesNotMatch(source, /Terms of Service|Privacy Policy|hello@sidera\.co/);
});

test("LegalDocumentLayout preserves reference measure and type hierarchy", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /inline-size: min\(100%, 47\.5rem\)/);
  assert.match(styles, /padding: 0\.625rem 2\.125rem 5\.625rem/);
  assert.match(styles, /font: 400 1\.5rem \/ 1\.15 var\(--font-serif\)/);
  assert.match(styles, /font: 400 0\.90625rem \/ 1\.7 var\(--font-sans\)/);
  assert.match(styles, /margin-block-start: 2\.125rem/);
  assert.match(styles, /padding-block-start: 1\.375rem/);
});

test("LegalDocumentLayout protects responsive copy and interaction states", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /\.legal-document-layout__contact a:hover/);
  assert.match(styles, /\.legal-document-layout__contact a:focus-visible/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
