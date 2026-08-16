import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("FAQ contact CTA composes the approved compact FinalCtaSection", async () => {
  const [component, page, styles] = await Promise.all([
    read("src/components/faq/sections/FaqContactCta.astro"),
    read("src/pages/faq.astro"),
    read("src/styles/faq/sections/faq-contact-cta.css"),
  ]);

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /tone="dark"/);
  assert.match(component, /layout="centered"/);
  assert.match(component, /surface="panel"/);
  assert.match(component, /density="compact"/);
  assert.match(component, /primaryEditAttributes=\{actionEditAttributes\}/);
  assert.match(page, /<FaqContactCta/);
  assert.match(page, /actionHref=\{localizePath\("\/astrologers", locale\)\}/);
  assert.match(page, /builderEdit\("faq_contact_title"\)/);
  assert.match(page, /builderEdit\("faq_contact_description"\)/);
  assert.match(page, /builderEdit\("faq_contact_action"\)/);
  assert.match(page, /<Footer/);
  assert.match(styles, /inline-size: min\(100%, 47\.5rem\)/);
  assert.doesNotMatch(styles, /\.sidera-final-cta__/);
});

test("FAQ contact CTA defaults are aligned across active locales", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getFaqDefaults } = await import("../../src/data/public-copy.ts");

  for (const locale of activeLocaleCodes) {
    const defaults = getFaqDefaults(locale);
    for (const field of [
      "faq_contact_title",
      "faq_contact_description",
      "faq_contact_action",
    ]) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("FAQ contact CTA fields have a fresh-safe migration", async () => {
  const migration = await read("migrations/0019_faq_contact_cta_content.sql");
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_faq)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "faq_contact_title",
    "faq_contact_description",
    "faq_contact_action",
  ]) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
