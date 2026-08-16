import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const fields = [
  "year_ahead_eyebrow",
  "year_ahead_title",
  "year_ahead_description",
  "year_ahead_primary_label",
  "year_ahead_secondary_label",
];

test("Transit Year-ahead handoff composes the approved shared CTA", async () => {
  const [section, styles, slugPage] = await Promise.all([
    read(
      "src/components/transit/sections/TransitYearAheadHandoff.astro",
    ),
    read("src/styles/transit/sections/year-ahead-handoff.css"),
    read("src/pages/transit/[slug].astro"),
  ]);

  assert.match(
    section,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(section, /tone="dark"/);
  assert.match(section, /layout="split"/);
  assert.match(section, /surface="panel"/);
  assert.match(section, /\n  ambience\n/);
  assert.match(section, /primaryHref="\/reports"/);
  assert.match(section, /secondaryHref="\/transit"/);
  assert.match(section, /locale=\{locale\}/);
  assert.match(slugPage, /import TransitYearAheadHandoff/);
  assert.match(slugPage, /<TransitResults[\s\S]*<TransitYearAheadHandoff/);
  assert.match(styles, /--sidera-final-cta-background: var\(--color-dark\)/);
  assert.match(styles, /73\.75rem/);
  assert.doesNotMatch(
    styles,
    /\.sidera-final-cta__|\.sidera-section-heading__/,
  );
});

test("Transit Year-ahead handoff copy covers every locale and edit binding", async () => {
  const [section, copy, resultsCopy] = await Promise.all([
    read(
      "src/components/transit/sections/TransitYearAheadHandoff.astro",
    ),
    read(
      "src/data/locale/transit/sections/year-ahead-handoff.ts",
    ),
    read("src/data/locale/transit/sections/results.ts"),
  ]);

  for (const field of fields) {
    assert.match(copy, new RegExp(`\\b${field}:`), `${field} is missing`);
    assert.match(
      section,
      new RegExp(`editAttributes\\("${field}"\\)`),
      `${field} lacks its exact edit binding`,
    );
  }

  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`), `${locale} is missing`);
  }

  assert.match(
    copy,
    /satisfies Record<SupportedLocale, TransitYearAheadHandoffCopy>/,
  );
  assert.match(resultsCopy, /getTransitYearAheadHandoffCopy/);
  assert.match(resultsCopy, /\.\.\.getTransitYearAheadHandoffCopy\(locale\)/);
});

test("Transit Year-ahead handoff fields have an executable forward migration", async () => {
  const [resultsMigration, handoffMigration] = await Promise.all([
    read("migrations/0043_transit_results_content.sql"),
    read("migrations/0047_transit_year_ahead_handoff_content.sql"),
  ]);
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(resultsMigration);
  sqlite.exec(handoffMigration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_transit_results)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.match(
      handoffMigration,
      new RegExp(
        `ALTER TABLE ec_site_transit_results ADD COLUMN ${field} TEXT;`,
      ),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});

test("Transit Year-ahead fields stay exclusively in the bounded Results target", async () => {
  const { getBuilderEntryConfig, getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );
  const primary = getBuilderEntryConfig("site_transit", "transit");
  const results = getBuilderEntryConfig("site_transit_results", "results");

  for (const field of fields) {
    assert.equal(
      primary?.editableFields.some((item) => item.slug === field),
      false,
      `${field} leaked into primary Transit content`,
    );
    assert.equal(
      results?.editableFields.some((item) => item.slug === field),
      true,
      `${field} is missing from Transit Results`,
    );
    assert.deepEqual(getBuilderFieldTarget(field, "transit"), {
      collection: "site_transit_results",
      entry: "results",
    });
  }
});
