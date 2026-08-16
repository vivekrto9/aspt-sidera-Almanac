import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/MoonPhaseItem.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/moon-phase-item.css",
  import.meta.url,
);

test("MoonPhaseItem supports exactly the eight canonical lunar phases", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const phase of [
    "new",
    "waxing-crescent",
    "first-quarter",
    "waxing-gibbous",
    "full",
    "waning-gibbous",
    "last-quarter",
    "waning-crescent",
  ]) {
    assert.match(source, new RegExp(`"${phase}"`));
  }

  assert.match(source, /function moonPath/);
  assert.match(source, /phaseData\[phase\]/);
});

test("MoonPhaseItem keeps the moon visual decorative beside visible prepared copy", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /name: string/);
  assert.match(source, /date\?: string/);
  assert.match(source, /detail\?: string/);
  assert.match(source, /focusable="false"/);
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /sidera-moon-phase-item__name/);
  assert.match(source, /sidera-moon-phase-item__date/);
  assert.match(source, /sidera-moon-phase-item__detail/);
});

test("MoonPhaseItem provides bounded layouts, tones, current state, and responsive styles", async () => {
  const component = await readFile(componentPath, "utf8");
  const stylesheet = await readFile(stylesheetPath, "utf8");

  assert.match(component, /"compact" \| "list"/);
  assert.match(component, /"default" \| "inverse"/);
  assert.match(component, /aria-current=\{current \? "true" : undefined\}/);
  assert.match(component, /import Badge from "\.\/Badge\.astro"/);
  assert.match(stylesheet, /\.sidera-moon-phase-item--current/);
  assert.match(stylesheet, /\.sidera-moon-phase-item--inverse/);
  assert.match(stylesheet, /\.sidera-moon-phase-item--compact/);
  assert.match(stylesheet, /\.sidera-moon-phase-item--list/);
  assert.match(stylesheet, /@media \(max-width: 40rem\)/);
  assert.match(stylesheet, /@media \(forced-colors: active\)/);
});
