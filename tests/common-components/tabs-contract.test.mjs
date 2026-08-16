import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Tabs.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/tabs.css",
  import.meta.url,
);

test("Tabs renders a labelled tablist and associated panels", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /role="tablist"/);
  assert.match(source, /aria-label=\{label\}/);
  assert.match(source, /role="tab"/);
  assert.match(source, /aria-controls=\{panelId\}/);
  assert.match(source, /aria-selected=\{selected \? "true" : "false"\}/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /aria-labelledby=\{tabId\}/);
  assert.match(source, /Astro\.slots\.render\(`panel-\$\{tab\.id\}`\)/);
  assert.match(source, /<Fragment set:html=\{panelContent\.get\(tab\.id\) \?\? ""\} \/>/);
});

test("Tabs supports automatic and manual keyboard activation", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type TabActivation = "automatic" \| "manual"/);
  assert.match(source, /event\.key === previousKey/);
  assert.match(source, /event\.key === nextKey/);
  assert.match(source, /event\.key === "Home"/);
  assert.match(source, /event\.key === "End"/);
  assert.match(source, /if \(activation === "automatic"\) activate\(nextTab\)/);
  assert.match(source, /new CustomEvent\("sidera:tab-change"/);
});

test("Tabs has shared visual variants and responsive overflow", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(component, /type TabAppearance = "pill" \| "underline"/);
  assert.match(styles, /\.sidera-tabs--underline/);
  assert.match(styles, /\.sidera-tabs--tone-inverse/);
  assert.match(styles, /\.sidera-tabs--compact/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /inline-size: max-content/);
  assert.match(styles, /min-inline-size: 100%/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /--sidera-tabs-min-height: 2\.75rem/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
