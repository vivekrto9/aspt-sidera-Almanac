import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeFinalCta.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-final-cta.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0042_home_final_cta_content.sql",
  import.meta.url,
);
const editableFields = [
  "home_final_cta_title_accent",
  "home_final_cta_title_rest",
  "home_final_cta_action_label",
];

test("Home Final CTA composes the approved shared closing section", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import FinalCtaSection[\s\S]*shared\/FinalCtaSection\.astro/);
  assert.match(source, /primaryAppearance="text"/);
  assert.match(source, /primaryArrow="→"/);
  assert.match(source, /tone="dark"/);
  assert.match(source, /layout="centered"/);
  assert.match(source, /surface="band"/);
  assert.match(source, /ambience/);
  assert.doesNotMatch(source, /<script|fetch\(|localStorage|sessionStorage/);
});

test("Home Final CTA forwards exact visible-copy edit identities", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const field of ["title_accent", "title_rest", "action_label"]) {
    assert.match(source, new RegExp(`editAttributes\\("${field}"\\)`));
  }
});

test("Home Final CTA preserves the Meridian full-bleed reference", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /--sidera-final-cta-background: var\(--color-dark\)/);
  assert.match(styles, /padding: 7\.5rem 2\.125rem/);
  assert.match(styles, /max-inline-size: 75rem/);
  assert.match(styles, /font-size: clamp\(3\.25rem, 9vw, 7\.5rem\)/);
  assert.match(styles, /margin-block-start: 2\.125rem/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Final CTA with localized chart navigation", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeFinalCta from "\.\.\/components\/home\/sections\/HomeFinalCta\.astro"/,
  );
  assert.match(source, /<HomeFinalCta/);
  assert.match(source, /actionHref=\{localizePath\("\/birth-chart", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_final_cta_\$\{field\}`\)\)/,
  );
});

test("all active locales provide a bounded editable Final CTA target", async () => {
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getHomeFinalCtaCopy } = await import(
    "../../src/data/locale/home/sections/final-cta.ts"
  );
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_final_cta", "home");
  const registeredFields = new Set(config?.editableFields.map((field) => field.slug));

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(
    getBuilderFieldTarget("home_final_cta_action_label", "home"),
    { collection: "site_home_final_cta", entry: "home" },
  );
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) =>
        target.collection === "site_home_final_cta" && target.entry === "home",
    ),
  );

  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }

  for (const locale of activeLocaleCodes) {
    const copy = getHomeFinalCtaCopy(locale);
    const defaults = getHomeDefaults(locale);
    for (const value of Object.values(copy)) {
      assert.notEqual(value.trim(), "", `${locale} has empty Final CTA copy`);
    }
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Home Final CTA migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_final_cta)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
