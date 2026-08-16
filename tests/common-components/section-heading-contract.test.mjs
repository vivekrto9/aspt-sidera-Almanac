import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/SectionHeading.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/shared/section-heading.css",
  import.meta.url,
);

test("SectionHeading provides semantic, localized heading content", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type HeadingLevel = 1 \| 2 \| 3/);
  assert.match(source, /const HeadingTag = `h\$\{headingLevel\}`/);
  assert.match(source, /<header id=\{id\}/);
  assert.match(source, /<HeadingTag/);
  assert.match(source, /\{eyebrow\}/);
  assert.match(source, /\{description\}/);
  assert.match(source, /Astro\.slots\.has\("title"\)/);
  assert.match(source, /eyebrowEditAttributes/);
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /descriptionEditAttributes/);
});

test("SectionHeading keeps variants bounded to reference-backed layouts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type HeadingAlignment = "left" \| "center" \| "right"/);
  assert.match(source, /type HeadingTone = "default" \| "inverse"/);
  assert.match(source, /type HeadingSize = "section" \| "page"/);
  assert.match(source, /type HeadingMeasure = "default" \| "full"/);
  assert.match(source, /measure = "default"/);
  assert.match(source, /sidera-section-heading--\$\{alignment\}/);
  assert.match(source, /sidera-section-heading--\$\{tone\}/);
  assert.match(source, /sidera-section-heading--\$\{size\}/);
  assert.match(source, /sidera-section-heading--measure-\$\{measure\}/);
});

test("SectionHeading composes the shared Button for optional actions", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /Astro\.slots\.has\("action"\)/);
  assert.match(source, /actionLabel && actionHref/);
  assert.match(source, /<Button/);
  assert.match(source, /variant="link"/);
  assert.match(source, /href=\{actionHref\}/);
  assert.match(source, /ariaLabel=\{actionAriaLabel\}/);
  assert.match(source, /actionEditAttributes/);
});

test("SectionHeading preserves Warm Modern hierarchy and responsive states", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /var\(--color-text\)/);
  assert.match(styles, /--sidera-section-heading-accent: var\(--color-primary\)/);
  assert.match(styles, /var\(--color-surface-soft\)/);
  assert.match(styles, /var\(--color-primary-soft\)/);
  assert.match(styles, /font: 600 0\.75rem/);
  assert.match(styles, /letter-spacing: 0\.18em/);
  assert.match(styles, /clamp\(2\.125rem, 4\.6vw, 3\.625rem\)/);
  assert.match(styles, /clamp\(2\.5rem, 5\.4vw, 4\.25rem\)/);
  assert.match(
    styles,
    /max-inline-size: 46rem/,
  );
  assert.match(
    styles,
    /\.sidera-section-heading--measure-full \.sidera-section-heading__content\s*\{[^}]*inline-size: 100%[^}]*max-inline-size: none/s,
  );
  assert.match(
    styles,
    /\.sidera-section-heading--measure-full \.sidera-section-heading__title\s*\{[^}]*max-inline-size: none/s,
  );
  assert.match(styles, /text-wrap: balance/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
