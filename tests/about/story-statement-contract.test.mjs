import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/about/sections/AboutStoryStatement.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/about/sections/about-story-statement.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/about.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0067_about_story_statement.sql",
  import.meta.url,
);

test("About Story statement preserves the reference composition", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(component, /data-screen-label="About · Story"/);
  assert.match(
    component,
    /<p class="about-story-statement__copy" \{\.\.\.statementEditAttributes\}>/,
  );
  assert.match(styles, /padding: 3\.125rem 2\.125rem/);
  assert.match(styles, /max-inline-size: 51\.25rem/);
  assert.match(styles, /clamp\(1\.375rem, 2\.4vw, 1\.75rem\)/);
  assert.match(styles, /font:[\s\S]*var\(--font-serif\)/);
  assert.match(styles, /text-align: center/);
  assert.doesNotMatch(styles, /\.sidera-page-intro__/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("About route renders Story immediately after the approved intro", async () => {
  const page = await readFile(pagePath, "utf8");
  const introIndex = page.indexOf("<AboutPageIntro");
  const storyIndex = page.indexOf("<AboutStoryStatement");

  assert.ok(introIndex >= 0);
  assert.ok(storyIndex > introIndex);
  assert.match(page, /statement=\{content\.about_story_statement\}/);
  assert.match(page, /builderEdit\("about_story_statement"\)/);
  assert.match(page, /AboutPrinciples/);
  assert.match(page, /AboutMetrics/);
  assert.match(page, /AboutTeam/);
});

test("About Story is registered, migrated, and localized", async () => {
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

  assert.match(
    migration,
    /ALTER TABLE ec_site_about ADD COLUMN about_story_statement TEXT/,
  );

  const fields = new Set(
    getBuilderEntryConfig("site_about", "about")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  assert.equal(fields.has("about_story_statement"), true);

  for (const locale of activeLocaleCodes) {
    const statement = getAboutDefaults(locale).about_story_statement;
    assert.equal(typeof statement, "string");
    assert.notEqual(statement.trim(), "");
  }
});
