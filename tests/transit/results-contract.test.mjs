import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Transit results match the approved reference boundary", async () => {
  const [component, styles, route, setupPage] = await Promise.all([
    read("src/components/transit/sections/TransitResults.astro"),
    read("src/styles/transit/sections/results.css"),
    read("src/pages/transit/[slug].astro"),
    read("src/pages/transit.astro"),
  ]);

  assert.match(component, /import ResultsShell/);
  assert.match(component, /import DateNavigator/);
  assert.match(component, /import ChartWheel/);
  assert.match(component, /import AspectRow/);
  assert.match(component, /chartSurface="plain"/);
  assert.match(component, /slot="chart"/);
  assert.match(component, /mode="transit"/);
  assert.match(component, /planets=\{chartPlanets\}/);
  assert.match(component, /houseCusps=\{result\.houseCusps\}/);
  assert.match(component, /aspects=\{chartAspects\}/);
  assert.match(component, /data-transit-date-range/);
  assert.match(component, /data-transit-aspect-row/);
  assert.match(component, /data-transit-aspect-panel/);
  assert.match(component, /planetselect|data-planet-index/);
  assert.doesNotMatch(component, /FinalCtaSection|Year Ahead|forecast/i);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.02fr\) minmax\(0, 0\.98fr\)/);
  assert.match(styles, /::-webkit-slider-thumb/);
  assert.match(component, /todayMarkerThumbCorrection/);
  assert.match(styles, /var\(--today-thumb-correction\)/);
  assert.match(component, /transit-results__range--today/);
  assert.match(styles, /transit-results__today-marker::before/);
  assert.doesNotMatch(styles, /\.results-shell__/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(route, /getTransitReading/);
  assert.match(route, /searchParams\.get\("date"\)/);
  assert.match(route, /noindex,nofollow/);
  assert.doesNotMatch(route, /getDummyTransitResult|alex-rivera/);
  assert.doesNotMatch(component, /alex-rivera/);
  assert.match(route, /loadPublicPageContent\(Astro, "transit"\)/);
  assert.match(route, /<Header/);
  assert.match(route, /<TransitResults/);
  assert.match(setupPage, /resultHref=\{localizePath\("\/transit", locale\)\}/);
});

test("Transit results copy covers every active locale and migration column", async () => {
  const [resultsMigration, handoffMigration] = await Promise.all([
    read("migrations/0043_transit_results_content.sql"),
    read("migrations/0047_transit_year_ahead_handoff_content.sql"),
  ]);
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getTransitResultsCopy } = await import(
    "../../src/data/locale/transit/sections/results.ts"
  );
  const english = getTransitResultsCopy("en");
  const englishKeys = Object.keys(english).sort();
  for (const locale of activeLocaleCodes) {
    const localized = getTransitResultsCopy(locale);
    assert.deepEqual(Object.keys(localized).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof localized[field], "string");
      assert.notEqual(localized[field].trim(), "");
    }
  }

  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(resultsMigration);
  sqlite.exec(handoffMigration);
  const columns = new Set(
    sqlite.prepare("PRAGMA table_info(ec_site_transit_results)").all().map((column) => column.name),
  );
  for (const field of englishKeys) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});

test("Transit result copy is merged into the existing Content Studio target", async () => {
  const { getTransitDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );
  const defaults = getTransitDefaults("en");
  assert.equal(defaults.results_eyebrow, "Transit Chart");
  assert.deepEqual(getBuilderPageTargets("transit"), [
    { collection: "site_transit", entry: "transit" },
    { collection: "site_transit_results", entry: "results" },
  ]);
  const config = getBuilderEntryConfig("site_transit_results", "results");
  assert.equal(
    config?.editableFields.some((field) => field.slug === "results_active_title"),
    true,
  );
});
