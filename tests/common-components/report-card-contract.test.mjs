import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ReportCard.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/report-card.css",
  import.meta.url,
);

test("ReportCard composes approved metadata, price, and action atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import MediaThumbnail from "\.\/MediaThumbnail\.astro"/);
  assert.match(source, /import PriceDisplay from "\.\/PriceDisplay\.astro"/);
  assert.match(source, /<Badge/);
  assert.match(source, /<PriceDisplay/);
  assert.match(source, /<Button/);
  assert.match(source, /<MediaThumbnail/);
});

test("ReportCard preserves the two literal reference structures", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ReportCardVariant = "compact" \| "featured"/);
  assert.match(source, /variant === "featured"/);
  assert.match(source, /class="sidera-report-card__cover"/);
  assert.match(source, /coverSrc\?: string/);
  assert.match(source, /coverAlt = title/);
  assert.match(source, /const WrapperTag = variant === "featured" \? "a" : "div"/);
  assert.match(source, /variant === "featured" && "sidera-report-card__link"/);
  assert.match(source, /variant="outline"/);
  assert.match(source, /class="sidera-report-card__text-action"/);
});

test("ReportCard keeps content prepared, localizable, and editable", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const prop of [
    "title: string",
    "description: string",
    "pagesLabel: string",
    "price: string",
    "href: string",
    "actionLabel: string",
  ]) {
    assert.match(source, new RegExp(prop));
  }
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /descriptionEditAttributes/);
  assert.match(source, /actionEditAttributes/);
  assert.match(source, /actionLabel\.replace\(\/\(\?:\\s\*→\)\+\\s\*\$\/, ""\)\.trimEnd\(\)/);
  assert.match(source, /ariaLabel \?\? `\$\{renderedActionLabel\}: \$\{title\}`/);
  assert.match(
    source,
    /<span class="sidera-report-card__text-action">\s*<span class="sidera-report-card__action-label" \{\.\.\.actionEditAttributes\}>\s*\{renderedActionLabel\}\s*<\/span>\s*<span aria-hidden="true">→<\/span>/s,
  );
  assert.doesNotMatch(
    source,
    /class="sidera-report-card__text-action" \{\.\.\.actionEditAttributes\}/,
  );
  assert.doesNotMatch(source, /localizePath|Astro\.currentLocale|translations/);
});

test("ReportCard styles match cover, card, interaction, and responsive contracts", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 1\.125rem/);
  assert.match(source, /min-block-size: 9\.375rem/);
  assert.match(source, /font-size: 2\.75rem/);
  assert.match(source, /\.sidera-report-card__thumbnail/);
  assert.match(source, /\.sidera-report-card__cover-glyph/);
  assert.match(source, /\.sidera-report-card--compact/);
  assert.match(source, /\.sidera-report-card__link:focus-visible/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
