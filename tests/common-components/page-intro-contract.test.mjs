import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/PageIntro.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/page-intro.css",
  import.meta.url,
);

test("PageIntro composes completed heading and breadcrumb components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Breadcrumb from "\.\/Breadcrumb\.astro"/);
  assert.match(source, /import SectionHeading from "\.\/SectionHeading\.astro"/);
  assert.match(source, /<Breadcrumb/);
  assert.match(source, /<SectionHeading/);
  assert.match(source, /headingLevel: 1 as const/);
  assert.match(source, /<SectionHeading \{\.\.\.headingProps\} \/>/);
});

test("PageIntro exposes only reference-backed layout states", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type PageIntroAlignment = "left" \| "center"/);
  assert.match(source, /type PageIntroDensity = "standard" \| "compact"/);
  assert.match(source, /type PageIntroTone = "default" \| "inverse"/);
  assert.match(
    source,
    /type PageIntroHeadingMeasure = "default" \| "full"/,
  );
  assert.match(source, /headingMeasure = "default"/);
  assert.match(source, /measure: headingMeasure/);
  assert.match(source, /size: density === "standard"/);
  assert.match(source, /aria-labelledby=\{headingId\}/);
});

test("PageIntro keeps copy, localization, metadata, and rich slots prepared", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /breadcrumbs\?: BreadcrumbItem\[\]/);
  assert.match(source, /locale\?: SupportedLocale/);
  assert.match(source, /Astro\.slots\.has\("title"\)/);
  assert.match(source, /Astro\.slots\.has\("action"\)/);
  assert.match(source, /metaEditAttributes/);
  assert.doesNotMatch(source, /Astro\.currentLocale|translations/);
});

test("PageIntro styles preserve reference widths and responsive states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: min\(100%, 70rem\)/);
  assert.match(source, /inline-size: min\(100%, 47\.5rem\)/);
  assert.match(source, /\.sidera-page-intro--inverse/);
  assert.match(source, /\.sidera-page-intro--center/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
