import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/about/sections/AboutPrinciples.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/about/sections/about-principles.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/about.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0069_about_principles.sql",
  import.meta.url,
);

test("About Principles composes the approved CardGrid without boxed cards", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(component, /data-screen-label="About · Principles"/);
  assert.match(component, /as="ul"/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /\{\.\.\.principle\.titleEditAttributes\}/);
  assert.match(component, /\{\.\.\.principle\.bodyEditAttributes\}/);
  assert.match(styles, /padding: 3\.75rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-panel\)/);
  assert.match(styles, /max-inline-size: 70rem/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.75rem/);
  assert.doesNotMatch(styles, /border-radius/);
  assert.doesNotMatch(styles, /box-shadow/);
});

test("About route renders three prepared principles after Story", async () => {
  const page = await readFile(pagePath, "utf8");
  const storyIndex = page.indexOf("<AboutStoryStatement");
  const principlesIndex = page.indexOf("<AboutPrinciples");

  assert.ok(storyIndex >= 0);
  assert.ok(principlesIndex > storyIndex);
  assert.match(page, /Array\.from\(\{ length: 3 \}/);
  assert.match(page, /builderEdit\(titleField\)/);
  assert.match(page, /builderEdit\(bodyField\)/);
  assert.match(page, /AboutMetrics/);
  assert.match(page, /AboutTeam/);
});

test("all Principle fields are migrated, registered, and localized", async () => {
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

  for (let itemNumber = 1; itemNumber <= 3; itemNumber += 1) {
    for (const suffix of ["title", "body"]) {
      const field = `about_principle_${itemNumber}_${suffix}`;
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
