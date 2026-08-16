import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/about/sections/AboutTeam.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/about/sections/about-team.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/about.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0080_about_team.sql",
  import.meta.url,
);

test("About Team composes the approved shared identity components", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(
    component,
    /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/,
  );
  assert.match(
    component,
    /import ProfileSummary from "\.\.\/\.\.\/shared\/ProfileSummary\.astro"/,
  );
  assert.match(
    component,
    /import SectionHeading from "\.\.\/\.\.\/shared\/SectionHeading\.astro"/,
  );
  assert.match(component, /data-screen-label="About · Team"/);
  assert.match(component, /columns=\{4\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{2\}/);
  assert.match(component, /avatarFallback="placeholder"/);
  assert.doesNotMatch(component, /avatarInitials/);
  assert.match(component, /\{\.\.\.titleAccentEditAttributes\}/);
  assert.match(component, /\{\.\.\.titleRestEditAttributes\}/);
  assert.match(styles, /padding: 4\.5rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.match(styles, /--avatar-size: 6rem/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(styles, /box-shadow/);
});

test("About route renders four prepared team profiles after Metrics", async () => {
  const page = await readFile(pagePath, "utf8");
  const metricsIndex = page.indexOf("<AboutMetrics");
  const teamIndex = page.indexOf("<AboutTeam");

  assert.ok(metricsIndex >= 0);
  assert.ok(teamIndex > metricsIndex);
  assert.match(page, /Array\.from\(\{ length: 4 \}/);
  assert.match(page, /builderEdit\(nameField\)/);
  assert.match(page, /builderEdit\(roleField\)/);
  assert.match(page, /content\.about_team_title_accent/);
  assert.match(page, /content\.about_team_title_rest/);
  assert.match(page, /content\.about_team_aria_label/);
});

test("all About Team fields are migrated, registered, and localized", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getAboutDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig } = await import(
    "../../src/builder/registry.ts"
  );
  const fields = new Set(
    getBuilderEntryConfig("site_about", "about")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  const fixedFields = [
    "about_team_title_accent",
    "about_team_title_rest",
    "about_team_aria_label",
  ];

  for (const field of fixedFields) {
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
    assert.equal(fields.has(field), true);
  }

  for (let itemNumber = 1; itemNumber <= 4; itemNumber += 1) {
    for (const suffix of ["name", "role"]) {
      const field = `about_team_member_${itemNumber}_${suffix}`;
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
