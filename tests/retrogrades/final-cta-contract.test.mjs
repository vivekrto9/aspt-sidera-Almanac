import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const editableFields = [
  "final_cta_title_accent",
  "final_cta_title_rest",
  "final_cta_action_label",
];

test("Retrogrades Final CTA composes the approved shared primitive", async () => {
  const component = await read(
    "src/components/retrogrades/sections/RetrogradesFinalCta.astro",
  );
  const styles = await read("src/styles/retrogrades/sections/final-cta.css");

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /primaryHref="\/birth-chart"/);
  assert.match(component, /primaryAppearance="text"/);
  assert.match(component, /primaryArrow="→"/);
  assert.match(component, /tone="dark"/);
  assert.match(component, /layout="centered"/);
  assert.match(component, /surface="band"/);
  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(
    styles,
    /\.retrogrades-final-cta \.sidera-section-heading__content[\s\S]*max-inline-size: none/,
  );
  assert.match(styles, /font-size: clamp\(2\.625rem, 7vw, 5\.25rem\)/);
  assert.match(styles, /border-block-end-color: rgb\(240 230 214 \/ 50%\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.doesNotMatch(styles, /\.sidera-final-cta\s*\{/);
});

test("Retrogrades Final CTA copy is localized and exactly editable", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getRetrogradesDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getRetrogradesDefaults(locale);
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.deepEqual(getBuilderFieldTarget(field, "retrogrades"), {
        collection: "site_retrogrades",
        entry: "retrogrades",
      });
    }
  }
});

test("Retrogrades route mounts the Final CTA before the shared Footer", async () => {
  const page = await read("src/pages/retrogrades.astro");
  const finalCtaIndex = page.indexOf("<RetrogradesFinalCta");
  const footerIndex = page.indexOf("<Footer");

  assert.ok(finalCtaIndex > 0);
  assert.ok(footerIndex > finalCtaIndex);
  assert.match(page, /builderEdit\(`final_cta_\$\{field\}`\)/);
});

test("Retrogrades Final CTA has a bounded forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0048_retrogrades_intro_content.sql"));
  sqlite.exec(
    await read("migrations/0059_retrogrades_final_cta_content.sql"),
  );

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_retrogrades)")
      .all()
      .map((column) => column.name),
  );
  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
