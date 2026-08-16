import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/glossary/sections/GlossaryPageIntro.astro",
  import.meta.url,
);
const componentStylesPath = new URL(
  "../../src/styles/glossary/sections/glossary-page-intro.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/glossary.astro", import.meta.url);
const pageStylesPath = new URL(
  "../../src/styles/glossary/glossary.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0063_glossary_page_intro_content.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("Glossary Page intro matches the dedicated reference through PageIntro", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(componentStylesPath, "utf8");

  assert.match(
    component,
    /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/,
  );
  assert.match(component, /id="glossary-page-intro"/);
  assert.match(component, /alignment="center"/);
  assert.match(component, /density="standard"/);
  assert.match(component, /const titleJoiner = \/\[-‐‑–—\]\$\//);
  assert.match(component, /titleJoiner/);
  assert.match(
    component,
    /<em[\s\S]*\{\.\.\.titleEmphasisEditAttributes\}[\s\S]*>\{titleEmphasis\}<\/em/,
  );
  assert.match(component, /\{\.\.\.titleLeadEditAttributes\}/);
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

test("Glossary route preserves the approved intro and shared chrome", async () => {
  const page = await readFile(pagePath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(page, /loadPublicPageContent\(Astro, "glossary"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<GlossaryPageIntro/);
  assert.match(page, /<Footer/);
  assert.match(page, /\["footer_link_glossary", "\/glossary"\]/);
  assert.match(pageStyles, /\.sidera-glossary\s*\{[\s\S]*inline-size: 100%/);
});

test("Glossary completes the first-section Content Studio contract", async () => {
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
    "glossary_intro_eyebrow",
    "glossary_intro_title_lead",
    "glossary_intro_title_emphasis",
    "glossary_intro_description",
  ];
  for (const field of introFields) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  assert.deepEqual(getBuilderPageTargets("glossary"), [
    { collection: "site_glossary", entry: "glossary" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig(
      "site_glossary",
      "glossary",
    )?.editableFields.map((field) => field.slug),
  );
  for (const field of [...introFields, "seo_title", "seo_description"]) {
    assert.equal(fields.has(field), true, `Glossary should register ${field}`);
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes(
      "site_glossary/glossary",
    ),
    true,
  );
  assert.equal(
    manifest.routes.visitorRoutes.some(
      (route) => route.method === "GET" && route.path === "/glossary",
    ),
    true,
  );
});

test("all active locales provide aligned Glossary intro and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getGlossaryDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const englishKeys = Object.keys(getGlossaryDefaults("en")).sort();

  for (const locale of activeLocaleCodes) {
    const defaults = getGlossaryDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/glossary");
  }
});
