import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("FAQ accordion list composes the approved shared Accordion", async () => {
  const [component, sharedAccordion, styles, page] = await Promise.all([
    read("src/components/faq/sections/FaqAccordionList.astro"),
    read("src/components/shared/Accordion.astro"),
    read("src/styles/faq/sections/faq-accordion-list.css"),
    read("src/pages/faq.astro"),
  ]);

  assert.match(
    component,
    /import Accordion from "\.\.\/\.\.\/shared\/Accordion\.astro"/,
  );
  assert.match(component, /name="faq-questions"/);
  assert.match(component, /open=\{index === 0\}/);
  assert.match(component, /categoryEditAttributes=\{item\.categoryEditAttributes\}/);
  assert.match(component, /questionEditAttributes=\{item\.questionEditAttributes\}/);
  assert.match(component, /<p \{\.\.\.item\.answerEditAttributes\}>/);
  assert.match(sharedAccordion, /categoryEditAttributes\?: Record<string, string>/);
  assert.match(sharedAccordion, /questionEditAttributes\?: Record<string, string>/);
  assert.match(sharedAccordion, /\{\.\.\.categoryEditAttributes\}/);
  assert.match(sharedAccordion, /\{\.\.\.questionEditAttributes\}/);
  assert.match(styles, /inline-size: min\(100%, 47\.5rem\)/);
  assert.match(styles, /gap: 0\.75rem/);
  assert.doesNotMatch(styles, /\.sidera-accordion__/);
  assert.match(page, /<FaqAccordionList/);
  assert.match(page, /<FaqContactCta/);
  assert.match(page, /<Footer/);
});

test("all active locales provide eight aligned editable FAQ items", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getFaqDefaults } = await import("../../src/data/public-copy.ts");

  for (const locale of activeLocaleCodes) {
    const defaults = getFaqDefaults(locale);
    for (let item = 1; item <= 8; item += 1) {
      for (const field of ["category", "question", "answer"]) {
        const key = `faq_item_${item}_${field}`;
        assert.equal(typeof defaults[key], "string", `${locale} is missing ${key}`);
        assert.notEqual(defaults[key].trim(), "", `${locale} has empty ${key}`);
      }
    }
  }
});

test("FAQ accordion Content Studio fields have a fresh-safe migration", async () => {
  const migration = await read("migrations/0012_faq_accordion_content.sql");
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(migration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_faq)")
      .all()
      .map((column) => column.name),
  );

  for (let item = 1; item <= 8; item += 1) {
    for (const field of ["category", "question", "answer"]) {
      assert.equal(
        columns.has(`faq_item_${item}_${field}`),
        true,
        `faq_item_${item}_${field} was not migrated`,
      );
    }
  }

  sqlite.close();
});

test("FAQ registers exact edit bindings for every accordion field", async () => {
  const page = await read("src/pages/faq.astro");
  const { getBuilderEntryConfig } = await import("../../src/builder/registry.ts");
  const fields = new Set(
    getBuilderEntryConfig("site_faq", "faq")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  assert.match(page, /const categoryField = `faq_item_\$\{itemNumber\}_category`/);
  assert.match(page, /const questionField = `faq_item_\$\{itemNumber\}_question`/);
  assert.match(page, /const answerField = `faq_item_\$\{itemNumber\}_answer`/);

  for (let item = 1; item <= 8; item += 1) {
    for (const field of ["category", "question", "answer"]) {
      assert.equal(fields.has(`faq_item_${item}_${field}`), true);
    }
  }
});
