import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Today's Sky composes the approved wheel and position-row contracts", async () => {
  const [component, page] = await Promise.all([
    read(
      "src/components/todays-sky/sections/TodaysSkyWheelReadingPositions.astro",
    ),
    read("src/pages/todays-sky.astro"),
  ]);

  assert.match(component, /import ChartWheel from/);
  assert.match(component, /import PlanetPositionRow from/);
  assert.match(component, /<ChartWheel/);
  assert.match(component, /interactive=\{true\}/);
  assert.match(component, /showHouses=\{false\}/);
  assert.match(component, /positions\.map\(\(position, index\) =>/);
  assert.match(component, /<PlanetPositionRow/);
  assert.match(page, /<TodaysSkyWheelReadingPositions/);
  assert.ok(
    page.indexOf("<TodaysSkyWheelReadingPositions") >
      page.indexOf("<TodaysSkyDateScrubber"),
  );
});

test("wheel, reading, and list stay synchronized with provider positions", async () => {
  const component = await read(
    "src/components/todays-sky/sections/TodaysSkyWheelReadingPositions.astro",
  );

  assert.match(component, /addEventListener\("planetselect"/);
  assert.match(component, /syncSelection\(detail\.index\)/);
  assert.match(component, /row\.addEventListener\("click"/);
  assert.match(component, /data-initial-positions=\{JSON\.stringify\(positions\)\}/);
  assert.match(component, /JSON\.parse\(root\.dataset\.initialPositions/);
  assert.match(component, /syncAspectLines/);
  assert.match(component, /positions: SkyBodyPosition\[\]/);
  assert.doesNotMatch(component, /getSkyBodyPositions\(|syncPositions/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /<span data-reading-glyph>/);
});

test("wheel static copy is localized, editable, and physically migrated", async () => {
  const [page, migration] = await Promise.all([
    read("src/pages/todays-sky.astro"),
    read("migrations/0019_todays_sky_wheel_content.sql"),
  ]);
  const { activeLocales } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getTodaysSkyWheelCopy } = await import(
    "../../src/data/locale/todays-sky/sections/wheel-reading-positions.ts"
  );
  const { getTodaysSkyDefaults } = await import("../../src/data/public-copy.ts");

  for (const { code } of activeLocales) {
    const copy = getTodaysSkyWheelCopy(code);
    assert.ok(Object.values(copy).every((value) => value.trim().length > 0));
    const defaults = getTodaysSkyDefaults(code);
    assert.equal(defaults.sky_wheel_caption, copy.wheelCaption);
    assert.equal(defaults.sky_positions_title, copy.positionsTitle);
    assert.equal(defaults.sky_positions_count, copy.positionsCount);
  }

  for (const field of [
    "sky_wheel_caption",
    "sky_positions_title",
    "sky_positions_count",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_todays_sky ADD COLUMN ${field} TEXT`),
    );
  }
});

test("wheel section preserves reference grid and mobile containment", async () => {
  const styles = await read(
    "src/styles/todays-sky/sections/todays-sky-wheel-reading-positions.css",
  );

  assert.match(styles, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 1\.02fr\) minmax\(0, 0\.98fr\)/,
  );
  assert.match(styles, /gap: 1\.5rem/);
  assert.match(styles, /background: var\(--color-dark\)/);
  assert.match(styles, /transform: translateY\(0\.1em\)/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("position rows keep desktop values in stable shared columns", async () => {
  const styles = await read(
    "src/styles/todays-sky/sections/todays-sky-wheel-reading-positions.css",
  );

  assert.match(styles, /@media \(min-width: 40\.0625rem\)/);
  assert.match(
    styles,
    /\.todays-sky-wheel__position\s*\{[\s\S]*?grid-template-columns:[\s\S]*?3\.25rem 6\.25rem;/,
  );
  assert.match(
    styles,
    /\.todays-sky-wheel__position \.sidera-planet-position-row__degree\s*\{[\s\S]*?justify-self: end;/,
  );
  assert.match(
    styles,
    /\.todays-sky-wheel__position \.sidera-planet-position-row__motion\s*\{[\s\S]*?inline-size: 100%;[\s\S]*?text-align: end;/,
  );
});
