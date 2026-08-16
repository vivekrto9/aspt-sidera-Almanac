import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/about/sections/AboutPageIntro.astro",
  import.meta.url,
);
const componentStylesPath = new URL(
  "../../src/styles/about/sections/about-page-intro.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/about.astro", import.meta.url);
const pageStylesPath = new URL(
  "../../src/styles/about/about.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0065_about_page_intro_content.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("About Page intro matches the dedicated reference through PageIntro", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(componentStylesPath, "utf8");

  assert.match(
    component,
    /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/,
  );
  assert.match(component, /id="about-page-intro"/);
  assert.match(component, /alignment="center"/);
  assert.match(component, /density="standard"/);
  assert.match(component, /\{\.\.\.titleLeadEditAttributes\}/);
  assert.match(
    component,
    /<em \{\.\.\.titleEmphasisEditAttributes\}>\{titleEmphasis\}<\/em>/,
  );
  assert.match(
    component,
    /descriptionEditAttributes=\{descriptionEditAttributes\}/,
  );
  assert.match(styles, /max-inline-size: 45rem/);
  assert.match(styles, /padding: 5rem 2\.125rem 2\.5rem/);
  assert.match(styles, /background: var\(--color-surface\)/);
  assert.doesNotMatch(styles, /\.sidera-page-intro__/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("About route preserves the approved intro and shared chrome", async () => {
  const page = await readFile(pagePath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(page, /loadPublicPageContent\(Astro, "about"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<AboutPageIntro/);
  assert.match(page, /<Footer/);
  assert.match(page, /\["footer_link_about", "\/about"\]/);
  assert.match(page, /AboutStoryStatement/);
  assert.match(page, /AboutPrinciples/);
  assert.match(page, /AboutMetrics/);
  assert.match(page, /AboutTeam/);
  assert.match(pageStyles, /\.sidera-about\s*\{[\s\S]*inline-size: 100%/);
});

test("About completes the first-section Content Studio contract", async () => {
  const page = await readFile(pagePath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );

  for (const toolbarField of [
    "launcherEnabled: builder.launcherEnabled",
    "studioModeEnabled: builder.studioModeEnabled",
    "collection: builder.collection",
    "entry: builder.entry",
    "locale: builder.locale",
    "csrfToken: builder.csrfToken",
    "canPublish: builder.canPublish",
    "seo: seoContent",
    "reviewTargets",
  ]) {
    assert.match(
      page,
      new RegExp(toolbarField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.match(
    page,
    /hasSavedDraft: builderPage\.hasSavedDraft \|\| chromePage\.hasSavedDraft/,
  );

  const introFields = [
    "about_intro_eyebrow",
    "about_intro_title_lead",
    "about_intro_title_emphasis",
    "about_intro_description",
  ];
  for (const field of introFields) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  assert.deepEqual(getBuilderPageTargets("about"), [
    { collection: "site_about", entry: "about" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig("site_about", "about")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  for (const field of [...introFields, "seo_title", "seo_description"]) {
    assert.equal(fields.has(field), true, `About should register ${field}`);
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes("site_about/about"),
    true,
  );
  assert.equal(
    manifest.routes.visitorRoutes.some(
      (route) => route.method === "GET" && route.path === "/about",
    ),
    true,
  );
});

test("all active locales provide aligned About intro and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getAboutDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const englishKeys = Object.keys(getAboutDefaults("en")).sort();

  for (const locale of activeLocaleCodes) {
    const defaults = getAboutDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/about");
  }
});
