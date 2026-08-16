import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Avatar.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/avatar.css",
  import.meta.url,
);

test("Avatar exposes exactly three practical content cases", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import MediaThumbnail from "\.\/MediaThumbnail\.astro"/);
  assert.match(source, /<MediaThumbnail/);
  assert.match(source, /type AvatarFallback = "placeholder" \| "initials"/);
  assert.match(source, /const content = src \? "image" : fallback/);
  assert.match(source, /fallback === "initials"/);
  assert.match(source, /sidera-avatar__placeholder/);
  assert.match(source, /sidera-avatar__initials/);
  assert.match(source, /sidera-avatar__media/);
});

test("Avatar keeps size options and accessible image semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"compact" \| "standard" \| "large" \| "profile"/);
  assert.match(source, /"neutral" \| "accent"/);
  assert.match(source, /alt=\{decorative \? "" : \(alt \?\? name\)\}/);
  assert.match(source, /loading=\{loading\}/);
  assert.match(source, /decoding=\{decoding\}/);
});

test("Avatar derives deterministic accessible initials", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /\.split\(\/\\s\+\/\)/);
  assert.match(source, /\.slice\(0, 2\)/);
  assert.match(source, /\.toLocaleUpperCase\(\)/);
  assert.match(source, /role=\{!src && !decorative \? "img" : undefined\}/);
  assert.match(source, /aria-label=\{!src && !decorative \? \(ariaLabel \?\? name\) : undefined\}/);
});

test("Avatar styles preserve circular media, reference sizes, and mobile behavior", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /border-radius: 50%/);
  assert.match(source, /\.sidera-avatar__media/);
  assert.match(source, /\.sidera-media-thumbnail__custom/);
  assert.match(source, /\.sidera-avatar--compact/);
  assert.match(source, /\.sidera-avatar--large/);
  assert.match(source, /\.sidera-avatar--profile/);
  assert.match(source, /\.sidera-avatar--accent/);
  assert.match(source, /\.sidera-avatar--initials/);
  assert.match(source, /\.sidera-avatar__placeholder/);
  assert.match(source, /@media \(max-width: 40rem\)/);
});
