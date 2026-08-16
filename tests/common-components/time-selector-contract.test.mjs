import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/TimeSelector.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/time-selector.css",
  import.meta.url,
);

test("TimeSelector composes the approved field dependencies", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Checkbox from "\.\/Checkbox\.astro"/);
  assert.match(source, /import FormField from "\.\/FormField\.astro"/);
  assert.match(source, /import SelectField, \{ type SelectFieldOption \} from "\.\/SelectField\.astro"/);
  assert.match(source, /hours: readonly SelectFieldOption\[\]/);
  assert.match(source, /minutes: readonly SelectFieldOption\[\]/);
  assert.match(source, /periods: readonly SelectFieldOption\[\]/);
});

test("all birth-time consumers share exact minute options from 00 through 59", async () => {
  const { birthMinuteOptions } = await import("../../src/data/time-options.ts");
  assert.equal(birthMinuteOptions.length, 60);
  assert.deepEqual(birthMinuteOptions.slice(0, 3), [
    { value: "00", label: "00" },
    { value: "01", label: "01" },
    { value: "02", label: "02" },
  ]);
  assert.deepEqual(birthMinuteOptions.at(-1), { value: "59", label: "59" });

  const consumers = await Promise.all([
    readFile(
      new URL(
        "../../src/components/birth-chart/sections/BirthChartFormWizard.astro",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../../src/components/home/sections/HomeBirthChart.astro",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../../src/components/synastry/sections/SynastryTwoProfileSetup.astro",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  for (const consumer of consumers) {
    assert.match(consumer, /import \{ birthMinuteOptions \}/);
    assert.match(consumer, /const minutes = birthMinuteOptions/);
    assert.doesNotMatch(consumer, /index \* 5/);
  }
});

test("TimeSelector preserves localized labels and native form contracts", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /hourLabel: string/);
  assert.match(source, /minuteLabel: string/);
  assert.match(source, /periodLabel: string/);
  assert.match(source, /unknownLabel: string/);
  assert.match(source, /required=\{required\}/);
  assert.match(source, /invalid=\{Boolean\(errorText\)\}/);
  assert.match(source, /density=\{density\}/);
  assert.match(source, /selectPresentation\?: TimeSelectorPresentation/);
  assert.match(source, /presentation=\{selectPresentation\}/);
  assert.match(source, /role="radiogroup"/);
  assert.match(source, /type="radio"/);
  assert.match(source, /name=\{periodName\}/);
  assert.match(source, /"sidera-select-field"/);
  assert.match(source, /aria-invalid=\{errorText \? "true" : undefined\}/);
});

test("TimeSelector anchors the period menu and synchronizes unknown-time state", async () => {
  const [component, styles] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(stylesheetPath, "utf8"),
  ]);

  assert.match(component, /data-time-selector/);
  assert.match(component, /data-time-part/);
  assert.match(component, /data-time-period/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "ArrowDown"/);
  assert.match(component, /event\.key === "ArrowUp"/);
  assert.match(component, /nextInput\.dispatchEvent\(new Event\("change"/);
  assert.match(component, /unknownControl\.addEventListener\("change", synchronizeUnknownState\)/);
  assert.match(component, /field\.disabled = unknownControl\.checked \|\| initiallyDisabled\[index\]/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /inset-block-start: calc\(100% \+ 0\.375rem\)/);
  assert.match(styles, /z-index: 30/);
  assert.match(styles, /inline-size: 1px/);
  assert.match(styles, /clip-path: inset\(50%\)/);
  assert.match(component, /data-time-period-selected/);
  assert.match(component, /candidateOption\.dataset\.timePeriodSelected/);
  assert.match(styles, /\[data-time-period-selected="true"\]::after/);
  assert.match(styles, /content: "✓"/);
  assert.doesNotMatch(styles, /accent-color/);
  assert.doesNotMatch(styles, /--select-field-hover-border/);
  assert.doesNotMatch(styles, /background-image: url/);
  assert.match(styles, /\[data-time-unknown="true"\]/);
  assert.match(styles, /@media \(max-width: 24rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});
