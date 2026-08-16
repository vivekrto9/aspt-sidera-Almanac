import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/MediaThumbnail.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/media-thumbnail.css",
  import.meta.url,
);

test("MediaThumbnail renders real, custom, and fallback media through one API", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /src\?: string/);
  assert.match(source, /alt: string/);
  assert.match(
    source,
    /fallbackLabelEditAttributes\?: Record<string, string>/,
  );
  assert.match(source, /const isFallback = !src && !hasMediaSlot/);
  assert.match(source, /src \? \(/);
  assert.match(source, /hasMediaSlot \? \(/);
});

test("MediaThumbnail shows the label pill only for fallback media", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /isFallback && "sidera-media-thumbnail--fallback"/);
  assert.match(source, /alt \? \(/);
  assert.match(source, /sidera-media-thumbnail__fallback-label/);
  assert.match(source, /title=\{alt\}/);
  assert.match(source, /\{\.\.\.fallbackLabelEditAttributes\}/);
  assert.match(source, />\s*\{alt\}\s*<\/span>/);
  assert.match(source, /alt=\{decorative \? "" : alt\}/);
});

test("MediaThumbnail styles a responsive theme-token fallback and label pill", async () => {
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(styles, /background-image: var\(--image-fallback-pattern\)/);
  assert.match(styles, /background-size: var\(--image-fallback-pattern-size\)/);
  assert.match(styles, /border-radius: 999px/);
  assert.match(styles, /align-items: end/);
  assert.match(styles, /text-overflow: ellipsis/);
  assert.match(styles, /white-space: nowrap/);
  assert.match(styles, /\.sidera-media-thumbnail--compact/);
  assert.match(styles, /inline-size: 100%/);
  assert.match(styles, /block-size: 100%/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
