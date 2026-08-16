import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Today's Sky composes the approved MoonPhaseItem and AspectRow", async () => {
  const [component, route] = await Promise.all([
    read("src/components/todays-sky/sections/TodaysSkyMoonAspects.astro"),
    read("src/pages/todays-sky.astro"),
  ]);

  assert.match(component, /import AspectRow from "\.\.\/\.\.\/shared\/AspectRow\.astro"/);
  assert.match(component, /import MoonPhaseItem from "\.\.\/\.\.\/shared\/MoonPhaseItem\.astro"/);
  assert.match(component, /<MoonPhaseItem/);
  assert.match(component, /<AspectRow/);
  assert.match(component, /appearance="sky"/);
  assert.doesNotMatch(component, /firstGlyph=\{positions\[item\.from\]/);
  assert.match(route, /<TodaysSkyMoonAspects/);
});

test("Moon phase and aspect list require provider-normalized state without synthetic fallbacks", async () => {
  const [component, route, moonData, aspectData] = await Promise.all([
    read("src/components/todays-sky/sections/TodaysSkyMoonAspects.astro"),
    read("src/pages/todays-sky.astro"),
    read("src/data/astronomy/sky-moon.ts"),
    read("src/data/astronomy/sky-aspects.ts"),
  ]);

  assert.match(component, /positions: SkyBodyPosition\[\]/);
  assert.match(component, /aspects: SkyAspectDetail\[\]/);
  assert.match(component, /moon: SkyMoonState/);
  assert.match(component, /const aspectRows = aspects\.slice\(0, 7\)/);
  assert.doesNotMatch(component, /getSkyMoonState|getSkyAspectDetails|getSkyBodyPositions/);
  assert.doesNotMatch(component, /const fallback|suppliedMoon|suppliedAspects/);
  assert.match(route, /aspects=\{providerSky\.aspects\}/);
  assert.match(route, /moon=\{providerSky\.moon\}/);
  assert.match(moonData, /illumination/);
  assert.match(moonData, /nextFull/);
  assert.match(moonData, /nextNew/);
  assert.match(aspectData, /applying: nextMatch < match\.orb/);
});

test("Moon and aspects copy covers all locales and editable fields", async () => {
  const [copy, publicCopy, route] = await Promise.all([
    read("src/data/locale/todays-sky/sections/moon-and-aspects.ts"),
    read("src/data/public-copy.ts"),
    read("src/pages/todays-sky.astro"),
  ]);

  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\n  ${locale}: \\{`));
  }
  assert.match(copy, /skyMoonPhases\.flatMap/);
  assert.match(copy, /skyAspectKinds\.flatMap/);
  assert.match(publicCopy, /\.\.\.getTodaysSkyMoonAspectsFields\(locale\)/);
  assert.match(route, /Object\.keys\(getTodaysSkyMoonAspectsFields\(locale\)\)/);
  assert.match(route, /componentEditAttributes\(builderEdit\(field\)\)/);
});

test("Moon and aspects fields have an executable forward migration", async () => {
  const [copy, migration] = await Promise.all([
    read("src/data/locale/todays-sky/sections/moon-and-aspects.ts"),
    read("migrations/0024_todays_sky_moon_aspects_content.sql"),
  ]);

  const fieldMatches = [
    ...copy.matchAll(/^\s+(sky_(?:moon|aspect)[a-z0-9_]*):/gm),
  ].map((match) => match[1]);
  for (const field of new Set(fieldMatches)) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_todays_sky ADD COLUMN ${field} TEXT;`),
    );
  }
  assert.match(migration, /sky_moon_phase_waning_crescent_meaning/);
  assert.match(migration, /sky_aspect_opposition_note/);
});

test("Moon and aspects layout preserves reference geometry and containment", async () => {
  const styles = await read(
    "src/styles/todays-sky/sections/todays-sky-moon-aspects.css",
  );

  assert.match(styles, /inline-size: min\(100%, 1180px\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 0\.86fr\) minmax\(0, 1\.14fr\)/);
  assert.match(styles, /background: var\(--color-dark-strong\)/);
  assert.match(styles, /background: var\(--color-panel\)/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
