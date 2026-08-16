import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/faq/sections/FaqPageIntro.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/faq/sections/faq-page-intro.css",
  import.meta.url,
);
const pageStylesPath = new URL(
  "../../src/styles/faq/faq.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/faq.astro", import.meta.url);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("FAQ Page intro composes the approved shared PageIntro", async () => {
  const source = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(source, /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/);
  assert.match(source, /alignment="center"/);
  assert.match(source, /density="standard"/);
  assert.match(source, /class="faq-page-intro__title-line"/);
  assert.match(source, /<em \{\.\.\.titleEmphasisEditAttributes\}>/);
  assert.match(source, /\{\.\.\.titleLeadEditAttributes\}/);
  assert.match(source, /eyebrowEditAttributes=\{eyebrowEditAttributes\}/);
  assert.match(
    source,
    /descriptionEditAttributes=\{descriptionEditAttributes\}/,
  );
  assert.doesNotMatch(styles, /\.sidera-page-intro__/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
  assert.match(styles, /\.faq-page-intro__title-line/);
  assert.match(styles, /white-space: nowrap/);
  assert.match(styles, /@media \(min-width: 64\.001rem\)/);
  assert.match(styles, /inset-inline-start: 50%/);
  assert.match(styles, /transform: translateX\(-50%\)/);
  assert.match(styles, /@media \(max-width: 64rem\)/);
});

test("FAQ route preserves the approved Page intro in the complete page composition", async () => {
  const source = await readFile(pagePath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");

  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(
    source,
    /import FaqPageIntro from "\.\.\/components\/faq\/sections\/FaqPageIntro\.astro"/,
  );
  assert.match(source, /loadPublicPageContent\(Astro, "faq"\)/);
  assert.match(source, /localizePath\("\/birth-chart", locale\)/);
  assert.match(source, /localizePath\("\/synastry", locale\)/);
  assert.match(source, /localizePath\("\/blog", locale\)/);
  assert.match(
    source,
    /import FaqAccordionList from "\.\.\/components\/faq\/sections\/FaqAccordionList\.astro"/,
  );
  assert.match(source, /<FaqAccordionList/);
  assert.match(source, /<FaqContactCta/);
  assert.match(source, /<Footer/);
  assert.match(pageStyles, /\.sidera-faq\s*\{[\s\S]*inline-size: 100%/);
});

test("FAQ completes the Content Studio first-section gate", async () => {
  const page = await readFile(pagePath, "utf8");
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
  assert.match(page, /value === true \? "true" : value/);

  for (const field of [
    "faq_intro_eyebrow",
    "faq_intro_title_lead",
    "faq_intro_title_emphasis",
    "faq_intro_description",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
  assert.match(
    page,
    /const field = `language_option_\$\{item\.code\}_label`/,
  );
  assert.match(
    page,
    /editAttributes: componentEditAttributes\(chromeEdit\(field\)\)/,
  );

  assert.deepEqual(getBuilderPageTargets("faq"), [
    { collection: "site_faq", entry: "faq" },
  ]);
  const faqFields = new Set(
    getBuilderEntryConfig("site_faq", "faq")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  for (const field of [
    "faq_intro_eyebrow",
    "faq_intro_title_lead",
    "faq_intro_title_emphasis",
    "faq_intro_description",
    "seo_title",
    "seo_description",
  ]) {
    assert.equal(faqFields.has(field), true, `FAQ should register ${field}`);
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes("site_faq/faq"),
    true,
  );
});

test("all active locales provide aligned FAQ intro and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getFaqDefaults } = await import("../../src/data/public-copy.ts");
  const englishKeys = Object.keys(getFaqDefaults("en")).sort();

  for (const locale of activeLocaleCodes) {
    const defaults = getFaqDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/faq");
  }
});
