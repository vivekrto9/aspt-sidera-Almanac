import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/FinalCtaSection.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/final-cta-section.css",
  import.meta.url,
);

test("FinalCtaSection composes the approved heading and action components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import SectionHeading from "\.\/SectionHeading\.astro"/);
  assert.match(source, /headingLevel: 2 as const/);
  assert.match(source, /<Button/);
  assert.match(source, /aria-labelledby=\{headingId\}/);
});

test("FinalCtaSection exposes only reference-backed layout treatments", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type FinalCtaTone = "dark" \| "light"/);
  assert.match(source, /type FinalCtaLayout = "centered" \| "split"/);
  assert.match(source, /type FinalCtaSurface = "band" \| "panel"/);
  assert.match(source, /type FinalCtaActionAppearance = "button" \| "text"/);
  assert.match(source, /type FinalCtaDensity = "standard" \| "compact"/);
  assert.match(source, /density = "standard"/);
  assert.match(source, /`sidera-final-cta--\$\{density\}`/);
  assert.match(source, /Astro\.slots\.has\("visual"\)/);
});

test("FinalCtaSection keeps links, copy, and rich titles prepared", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /localizePath\(primaryHref, locale\)/);
  assert.match(source, /localizePath\(secondaryHref, locale\)/);
  assert.match(source, /Astro\.slots\.has\("title"\)/);
  assert.match(source, /primaryArrow\?: string/);
  assert.match(source, /sidera-final-cta__arrow/);
  assert.match(
    source,
    /<Fragment slot="trailing-icon">[\s\S]*sidera-final-cta__arrow/,
  );
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /primaryEditAttributes/);
  assert.doesNotMatch(source, /Astro\.currentLocale|translations/);
});

test("FinalCtaSection preserves reference scale and responsive accessibility", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /font-size: clamp\(3\.25rem, 9vw, 7\.5rem\)/);
  assert.match(source, /inline-size: 100%/);
  assert.match(source, /\.sidera-final-cta--panel/);
  assert.match(source, /\.sidera-final-cta--with-visual/);
  assert.match(source, /:not\(\.sidera-final-cta--with-visual\)/);
  assert.match(source, /@media \(max-width: 42rem\)/);
  assert.match(
    source,
    /\.sidera-final-cta--compact\.sidera-final-cta--centered[\s\S]*font-size: 1\.625rem/,
  );
  assert.match(
    source,
    /\.sidera-final-cta--compact \.sidera-final-cta__inner[\s\S]*padding: 2\.125rem/,
  );
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /\.sidera-final-cta__primary--text:hover \.sidera-button__label/);
  assert.match(source, /transform: translateX\(0\.25rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
