import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const stylesRoot = new URL("../src/styles/", import.meta.url);

const visitorStyles = (directory = stylesRoot) => {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "builder") continue;

    const path = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) {
      files.push(...visitorStyles(path));
    } else if (entry.name.endsWith(".css")) {
      files.push({
        path: relative(stylesRoot.pathname, path.pathname),
        source: readFileSync(path, "utf8"),
      });
    }
  }

  return files;
};

test("Meridian loads and declares one canonical visitor typography pair", () => {
  const layout = read("src/layouts/BaseLayout.astro");
  const base = read("src/styles/base.css");

  assert.match(layout, /family=DM\+Serif\+Display:ital@0;1/);
  assert.match(layout, /family=Karla:wght@400;500;600;700/);
  assert.match(base, /--font-sans: "Karla", ui-sans-serif/);
  assert.match(base, /--font-serif: "DM Serif Display", Georgia/);
  assert.match(base, /body \{[\s\S]*font-family: var\(--font-sans\)/);
  assert.match(base, /h1 \{[\s\S]*font-family: var\(--font-serif\)/);
});

test("visitor styles do not reintroduce another text family or undefined aliases", () => {
  for (const { path, source } of visitorStyles()) {
    assert.doesNotMatch(
      source,
      /Instrument Serif|(?:^|[^A-Za-z])Inter\s*,|var\(--font-(?:display|body)\)/m,
      `${path} bypasses the Meridian typography contract`,
    );
  }
});

test("symbol-only typography exceptions remain isolated from visitor text", () => {
  assert.match(
    read("src/styles/shared/rating-stars.css"),
    /\.sidera-rating-stars \{[\s\S]*font-family: Georgia/,
  );
  assert.match(
    read("src/styles/shared/aspect-row.css"),
    /\.sidera-aspect-row__planet-glyph \{[\s\S]*font-family: Georgia/,
  );
  assert.match(
    read("src/styles/shared/zodiac-sign-item.css"),
    /\.sidera-zodiac-sign__glyph \{[\s\S]*font: 400 2\.25rem \/ 1 Georgia/,
  );
});
