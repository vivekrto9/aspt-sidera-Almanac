import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ArticleCard.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/article-card.css",
  import.meta.url,
);

test("ArticleCard uses one semantic whole-card link and approved metadata", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import MediaThumbnail from "\.\/MediaThumbnail\.astro"/);
  assert.match(source, /<MediaThumbnail/);
  assert.match(source, /<article class=\{classes\}>/);
  assert.match(source, /class="sidera-article-card__link"/);
  assert.match(source, /href=\{href\}/);
  assert.match(source, /aria-label=\{ariaLabel \?\? title\}/);
  assert.doesNotMatch(source, /<Button|onClick|client:/);
});

test("ArticleCard exposes only the three literal reference variants", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ArticleCardVariant = "standard" \| "featured" \| "compact"/);
  assert.match(source, /Astro\.slots\.has\("cover"\)/);
  assert.match(source, /coverSrc\?: string/);
  assert.match(source, /coverAlt = title/);
  assert.match(source, /excerpt \?/);
  assert.match(source, /author \|\| readTime/);
  assert.match(source, /author && readTime/);
});

test("ArticleCard keeps editorial content prepared and localizable", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const prop of ["title: string", "eyebrow: string", "href: string"]) {
    assert.match(source, new RegExp(prop));
  }
  assert.match(source, /eyebrowEditAttributes/);
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /excerptEditAttributes/);
  assert.doesNotMatch(source, /localizePath|Astro\.currentLocale|translations/);
});

test("ArticleCard styles preserve reference geometry and accessible states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: 100%/);
  assert.match(source, /min-block-size: 12\.5rem/);
  assert.match(source, /grid-template-columns: 1\.05fr 0\.95fr/);
  assert.match(source, /min-block-size: 8rem/);
  assert.match(source, /\.sidera-article-card__thumbnail/);
  assert.match(source, /\.sidera-article-card__cover-glyph/);
  assert.match(source, /\.sidera-article-card__link:focus-visible/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
