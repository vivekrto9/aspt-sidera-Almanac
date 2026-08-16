import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/about/sections/AboutMetrics.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/about/sections/about-metrics.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/about.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0076_about_metrics.sql",
  import.meta.url,
);

test("About Metrics matches the four-column dark reference band", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(component, /data-screen-label="About · Metrics"/);
  assert.match(component, /columns=\{4\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{2\}/);
  assert.match(component, /ariaLabel=\{ariaLabel\}/);
  assert.match(component, /\{\.\.\.metric\.valueEditAttributes\}/);
  assert.match(component, /\{\.\.\.metric\.labelEditAttributes\}/);
  assert.match(styles, /padding: 4\.5rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-dark-strong\)/);
  assert.match(styles, /max-inline-size: 70rem/);
  assert.match(styles, /clamp\(2\.5rem, 5vw, 3\.75rem\)/);
  assert.doesNotMatch(styles, /border-radius/);
  assert.doesNotMatch(styles, /box-shadow/);
});

test("About route renders four prepared metrics after Principles", async () => {
  const page = await readFile(pagePath, "utf8");
  const principlesIndex = page.indexOf("<AboutPrinciples");
  const metricsIndex = page.indexOf("<AboutMetrics");

  assert.ok(principlesIndex >= 0);
  assert.ok(metricsIndex > principlesIndex);
  assert.match(page, /Array\.from\(\{ length: 4 \}/);
  assert.match(page, /builderEdit\(valueField\)/);
  assert.match(page, /builderEdit\(labelField\)/);
  assert.match(page, /content\.about_metrics_aria_label/);
  assert.match(page, /AboutTeam/);
});

test("all About metric fields are migrated, registered, and localized", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getAboutDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderEntryConfig } = await import(
    "../../src/builder/registry.ts"
  );
  const fields = new Set(
    getBuilderEntryConfig("site_about", "about")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  for (const field of ["about_metrics_aria_label"]) {
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
    assert.equal(fields.has(field), true);
  }

  for (let itemNumber = 1; itemNumber <= 4; itemNumber += 1) {
    for (const suffix of ["value", "label"]) {
      const field = `about_metric_${itemNumber}_${suffix}`;
      assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
      assert.equal(fields.has(field), true);
      for (const locale of activeLocaleCodes) {
        const value = getAboutDefaults(locale)[field];
        assert.equal(typeof value, "string");
        assert.notEqual(value.trim(), "");
      }
    }
  }
});
