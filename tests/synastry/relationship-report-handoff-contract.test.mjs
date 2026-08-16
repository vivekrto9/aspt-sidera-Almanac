import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Synastry report handoff composes the approved light split CTA", async () => {
  const [component, route] = await Promise.all([
    read(
      "src/components/synastry/sections/SynastryRelationshipReportHandoff.astro",
    ),
    read("src/pages/synastry/[slug].astro"),
  ]);

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /tone="light"/);
  assert.match(component, /layout="split"/);
  assert.match(component, /surface="panel"/);
  assert.match(component, /density="compact"/);
  assert.match(component, /primaryHref="\/reports"/);
  assert.match(component, /secondaryHref="\/synastry"/);
  assert.match(route, /<SynastryRelationshipReportHandoff/);
});

test("Synastry report handoff copy is localized and exactly editable", async () => {
  const [component, copy] = await Promise.all([
    read(
      "src/components/synastry/sections/SynastryRelationshipReportHandoff.astro",
    ),
    read(
      "src/data/locale/synastry/sections/relationship-report-handoff.ts",
    ),
  ]);

  for (const field of [
    "report_eyebrow",
    "report_title",
    "report_description",
    "report_primary_label",
    "report_secondary_label",
  ]) {
    assert.match(component, new RegExp(`editAttributes\\("${field}"\\)`));
  }
  assert.match(
    copy,
    /satisfies Record<SupportedLocale, SynastryRelationshipReportHandoffCopy>/,
  );
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Synastry report handoff keeps page-owned geometry scoped to its root", async () => {
  const styles = await read(
    "src/styles/synastry/sections/relationship-report-handoff.css",
  );

  assert.match(styles, /inline-size: min\(100% - 4\.25rem, 73\.75rem\)/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(
    styles,
    /\.synastry-relationship-report\.sidera-final-cta--split:not\([\s\S]*?\.sidera-final-cta__actions \{[\s\S]*?inline-size: min\(100%, 26rem\);[\s\S]*?margin-block-start: 0;/,
  );
  assert.match(
    styles,
    /\.synastry-relationship-report\.sidera-final-cta--compact[\s\S]*?\.sidera-button \{[\s\S]*?inline-size: 100%;/,
  );
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Synastry report handoff fields have an executable forward migration", async () => {
  const migration = await read(
    "migrations/0035_synastry_relationship_report_handoff_content.sql",
  );
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_synastry)")
      .all()
      .map((column) => column.name),
  );
  for (const field of [
    "report_eyebrow",
    "report_title",
    "report_description",
    "report_primary_label",
    "report_secondary_label",
  ]) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});
