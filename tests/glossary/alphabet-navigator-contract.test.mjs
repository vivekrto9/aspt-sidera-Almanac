import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/glossary/sections/GlossaryAlphabetNavigator.astro",
  import.meta.url,
);
const componentStylesPath = new URL(
  "../../src/styles/glossary/sections/glossary-alphabet-navigator.css",
  import.meta.url,
);
const localePath = new URL(
  "../../src/data/locale/glossary/sections/alphabet-navigator.ts",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/glossary.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0150_glossary_search_and_copy_accuracy.sql",
  import.meta.url,
);

test("Glossary alphabet navigator matches the dedicated reference", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(componentStylesPath, "utf8");
  const locale = await readFile(localePath, "utf8");

  assert.match(
    component,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(component, /id="glossary-alphabet-navigator"/);
  assert.match(component, /href=\{`#\$\{letter\.id\}`\}/);
  assert.match(component, /variant="secondary"/);
  assert.match(component, /size="compact"/);
  assert.match(component, /shape="rounded"/);
  assert.match(component, /type="search"/);
  assert.match(component, /data-glossary-search/);
  assert.match(component, /normalizeGlossaryText/);
  assert.match(locale, /searchPlaceholder/);
  assert.match(styles, /max-inline-size: 56\.25rem/);
  assert.match(styles, /inline-size: 2\.125rem/);
  assert.match(styles, /gap: 0\.5rem/);
  assert.doesNotMatch(styles, /\.sidera-button__/);
});

test("Glossary route preserves the alphabet navigator after the approved intro", async () => {
  const page = await readFile(pagePath, "utf8");
  const introIndex = page.indexOf("<GlossaryPageIntro");
  const alphabetIndex = page.indexOf("<GlossaryAlphabetNavigator");

  assert.ok(introIndex >= 0);
  assert.ok(alphabetIndex > introIndex);
  assert.match(
    page,
    /navigationLabel=\{content\.glossary_alphabet_navigation_label\}/,
  );
  assert.match(page, /letters=\{glossaryAlphabetLetters\}/);
});

test("all locales and the migration register the alphabet navigation label", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getGlossaryDefaults } = await import("../../src/data/public-copy.ts");

  for (const field of [
    "glossary_search_label",
    "glossary_search_placeholder",
    "glossary_search_clear_label",
    "glossary_search_results_label",
    "glossary_search_empty_title",
  ]) {
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  for (const locale of activeLocaleCodes) {
    const defaults = getGlossaryDefaults(locale);
    for (const field of [
      "glossary_alphabet_navigation_label",
      "glossary_search_label",
      "glossary_search_placeholder",
      "glossary_search_clear_label",
      "glossary_search_results_label",
      "glossary_search_empty_title",
    ]) {
      assert.notEqual(defaults[field].trim(), "");
    }
  }

  const sqlite = new DatabaseSync(":memory:");
  for (const migration of [
    "0063_glossary_page_intro_content.sql",
    "0068_glossary_alphabet_navigator.sql",
    "0071_glossary_grouped_definitions.sql",
    "0150_glossary_search_and_copy_accuracy.sql",
  ]) {
    sqlite.exec(
      await readFile(
        new URL(`../../migrations/${migration}`, import.meta.url),
        "utf8",
      ),
    );
  }
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_glossary)")
      .all()
      .map((column) => column.name),
  );
  assert.equal(columns.has("glossary_search_label"), true);
  assert.equal(columns.has("glossary_search_empty_title"), true);
  sqlite.close();
});
