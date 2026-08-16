import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../../src/components/shared/ResultsShell.astro",
  import.meta.url,
);
const stylesUrl = new URL(
  "../../src/styles/shared/results-shell.css",
  import.meta.url,
);

test("ResultsShell composes orientation dependencies and keeps chart data prepared", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /import Breadcrumb from "\.\/Breadcrumb\.astro"/);
  assert.match(source, /import ChartWheel from "\.\/ChartWheel\.astro"/);
  assert.match(source, /import SectionHeading from "\.\/SectionHeading\.astro"/);
  assert.match(source, /chartPlanets\?: ChartPlanet\[\]/);
  assert.match(source, /chartAspects\?: ChartAspect\[\]/);
  assert.match(source, /<ChartWheel/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage/);
});

test("ResultsShell exposes prepared context and caller-owned result regions", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /summaryItems\?: SummaryItem\[\]/);
  assert.match(source, /notice\?: string/);
  assert.match(source, /<slot name="title">\{title\}<\/slot>/);
  assert.match(source, /<slot name="summary" \/>/);
  assert.match(source, /<slot name="orientation" \/>/);
  assert.match(source, /<slot name="chart" \/>/);
  assert.match(source, /<slot name="inspector" \/>/);
  assert.match(source, /<slot name="actions" \/>/);
  assert.match(source, /<slot \/>/);
  assert.doesNotMatch(source, /Planet positions|Active transits|The verdict|Big Three/);
});

test("ResultsShell preserves labelled landmarks and bounded layout variants", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /aria-labelledby=\{headingId\}/);
  assert.match(source, /headingId=\{headingId\}/);
  assert.match(source, /aria-label=\{`\$\{title\} details`\}/);
  assert.match(source, /layout\?: "split" \| "stacked"/);
  assert.match(source, /chartSurface\?: "plain" \| "panel"/);
  assert.match(source, /hasInspector \? layout : "stacked"/);
});

test("ResultsShell matches result geometry and responsive safeguards", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /inline-size: min\(100% - 4\.25rem, 73\.75rem\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.05fr\) minmax\(18rem, 0\.95fr\)/);
  assert.match(styles, /border-radius: 1\.375rem/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
