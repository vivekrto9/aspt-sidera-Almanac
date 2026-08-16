import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Footer.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/footer.css",
  import.meta.url,
);

test("Footer composes BrandLogo and receives prepared navigation data", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import BrandLogo from "\.\/BrandLogo\.astro"/);
  assert.match(source, /groups\?: readonly FooterLinkGroup\[\]/);
  assert.match(source, /links\?: readonly FooterLink\[\]/);
  assert.match(source, /legalLinks\?: readonly FooterLink\[\]/);
  assert.match(source, /brandHref: string/);
  assert.match(source, /copyrightText: string/);
});

test("Footer exposes the reference-backed full and compact structures", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type FooterVariant = "full" \| "compact"/);
  assert.match(source, /variant === "compact"/);
  assert.match(source, /class="sidera-footer__full-inner"/);
  assert.match(source, /class="sidera-footer__compact-inner"/);
  assert.match(source, /class="sidera-footer__bottom"/);
  assert.match(source, /tone="inverse"/);
});

test("Footer preserves reference proportions and responsive navigation", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(source, /grid-template-columns: 1\.6fr repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(source, /padding: 4\.5rem 2\.125rem 2\.5rem/);
  assert.match(source, /@media \(max-width: 42rem\)/);
  assert.match(source, /repeat\(\s*auto-fit,\s*minmax\(min\(8\.5rem, 100%\), 1fr\)\s*\)/);
  assert.match(source, /min-block-size: 2\.75rem/);
  assert.match(source, /\.sidera-footer__compact-nav \{\s*grid-column: 1;\s*grid-row: auto;\s*inline-size: 100%/);
  assert.match(source, /flex-direction: row/);
  assert.match(source, /flex-wrap: wrap/);
  assert.match(source, /gap: 0\.25rem 1\.25rem/);
  assert.match(source, /@media \(forced-colors: active\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
});
