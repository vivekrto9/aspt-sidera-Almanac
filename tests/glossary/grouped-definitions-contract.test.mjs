import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/glossary/sections/GlossaryDefinitions.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/glossary/sections/glossary-definitions.css",
  import.meta.url,
);
const localePath = new URL(
  "../../src/data/locale/glossary/sections/definitions.ts",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/glossary.astro", import.meta.url);
const pageStylesPath = new URL(
  "../../src/styles/glossary/glossary.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0071_glossary_grouped_definitions.sql",
  import.meta.url,
);

test("Glossary definitions preserve the reference structure and shared heading", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");
  const locale =
    await import("../../src/data/locale/glossary/sections/definitions.ts");

  assert.match(
    component,
    /import SectionHeading from "\.\.\/\.\.\/shared\/SectionHeading\.astro"/,
  );
  assert.match(component, /id=\{group\.id\}/);
  assert.match(component, /headingLevel=\{2\}/);
  assert.match(component, /measure="full"/);
  assert.match(component, /\{\.\.\.term\.nameEditAttributes\}/);
  assert.match(component, /\{\.\.\.term\.definitionEditAttributes\}/);
  assert.equal(locale.glossaryTermKeys.length, 22);
  const { getGlossaryDefinitionsCopy } = locale;
  const germanTerms = Object.values(getGlossaryDefinitionsCopy("de"));
  const germanGroups = locale.groupLocalizedGlossaryTerms(germanTerms, "de");
  assert.equal(
    germanGroups.find((group) => group.letter === "K").terms[0].name,
    "Konjunktion",
  );
  assert.equal(
    germanGroups.find((group) => group.letter === "W").terms[0].name,
    "Würde",
  );
  assert.match(styles, /max-inline-size: 51\.25rem/);
  assert.match(styles, /gap: 2\.125rem/);
  assert.match(styles, /--sidera-section-heading-title-size: 2\.125rem/);
  assert.doesNotMatch(styles, /\.sidera-section-heading__/);
});

test("Glossary route completes the ordered page and binds every term", async () => {
  const page = await readFile(pagePath, "utf8");
  const pageStyles = await readFile(pageStylesPath, "utf8");
  const alphabetIndex = page.indexOf("<GlossaryAlphabetNavigator");
  const definitionsIndex = page.indexOf("<GlossaryDefinitions");

  assert.ok(alphabetIndex >= 0);
  assert.ok(definitionsIndex > alphabetIndex);
  assert.match(page, /groupLocalizedGlossaryTerms/);
  assert.match(page, /builderEdit\(nameField\)/);
  assert.match(page, /builderEdit\(definitionField\)/);
  assert.match(pageStyles, /html\s*\{[\s\S]*scroll-behavior: smooth/);
  assert.match(
    pageStyles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*scroll-behavior: auto/,
  );
});

test("all term fields are localized, registered, and physically migrated", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const localeSource = await readFile(localePath, "utf8");
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getGlossaryDefaults } = await import("../../src/data/public-copy.ts");
  const { glossaryTermKeys } =
    await import("../../src/data/locale/glossary/sections/definitions.ts");

  const keys = glossaryTermKeys;
  assert.equal(keys.length, 22);
  assert.match(localeSource, /satisfies Record<[\s\S]*SupportedLocale/);

  for (const locale of activeLocaleCodes) {
    const defaults = getGlossaryDefaults(locale);
    for (const key of keys) {
      for (const suffix of ["name", "definition"]) {
        const field = `glossary_term_${key}_${suffix}`;
        assert.equal(typeof defaults[field], "string");
        assert.notEqual(defaults[field].trim(), "");
        assert.match(migration, new RegExp(`${field} TEXT`));
      }
    }
  }
});
