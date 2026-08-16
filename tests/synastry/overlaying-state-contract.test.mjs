import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Synastry overlaying state composes the approved shared casting visual", async () => {
  const source = await read(
    "src/components/synastry/sections/SynastryOverlayingState.astro",
  );

  assert.match(
    source,
    /import CastingState from "\.\.\/\.\.\/shared\/CastingState\.astro"/,
  );
  assert.match(source, /visual="synastry"/);
  assert.match(source, /height="viewport"/);
  assert.match(source, /headingTag="h1"/);
  assert.match(source, /data-synastry-overlaying/);
  assert.match(source, /tabindex="-1"/);
  assert.match(source, /\n  hidden\n\/>/);
  assert.doesNotMatch(source, /setTimeout|fake|mock result|\bfetch\(/i);
});

test("Synastry experience submits to the real API while showing the overlay", async () => {
  const [source, page] = await Promise.all([
    read("src/components/synastry/SynastryExperience.astro"),
    read("src/pages/synastry.astro"),
  ]);

  assert.match(source, /<SynastryTwoProfileSetup/);
  assert.match(source, /<SynastryOverlayingState/);
  assert.match(source, /form\.addEventListener\("submit"/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /setup\.hidden = true/);
  assert.match(source, /overlaying\.hidden = false/);
  assert.match(source, /summary\.textContent = `\$\{firstName\} × \$\{secondName\}`/);
  assert.match(source, /overlaying\.focus\(\)/);
  assert.match(source, /experience\.dataset\.submitting = "true"/);
  assert.match(source, /data-result-href=\{resultHref\}/);
  assert.match(source, /data-api-endpoint=\{apiEndpoint\}/);
  assert.match(source, /fetch\(experience\.dataset\.apiEndpoint/);
  assert.match(source, /personA: person\("person-a"\)/);
  assert.doesNotMatch(source, /relationship:\s*value\("relationship"\)/);
  assert.match(source, /body\.readingId/);
  assert.match(source, /window\.location\.assign/);
  assert.match(source, /window\.addEventListener\("pageshow", resetSynastrySubmissionState\)/);
  assert.match(source, /experience\.dataset\.submitting = "false"/);
  assert.match(source, /overlaying\.hidden = true/);
  assert.match(source, /setup\.hidden = false/);
  assert.match(page, /resultHref=\{localizePath\("\/synastry", locale\)\}/);
  assert.doesNotMatch(source, /window\.setTimeout|mara-sam/i);
});

test("Synastry overlaying copy is localized and exactly editable", async () => {
  const [section, copy] = await Promise.all([
    read("src/components/synastry/sections/SynastryOverlayingState.astro"),
    read("src/data/locale/synastry/sections/overlaying-state.ts"),
  ]);

  for (const field of ["overlaying_title", "overlaying_status"]) {
    assert.match(section, new RegExp(`editAttributes\\("${field}"\\)`));
  }
  assert.match(
    copy,
    /satisfies Record<SupportedLocale, SynastryOverlayingStateCopy>/,
  );
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Synastry overlaying state preserves header-aware responsive sizing", async () => {
  const styles = await read(
    "src/styles/synastry/sections/overlaying-state.css",
  );

  assert.match(styles, /\.synastry-overlaying\[hidden\]/);
  assert.match(styles, /min-block-size: calc\(100svh - 4\.6875rem\)/);
  assert.match(styles, /padding-block: clamp\(2rem, 4vw, 3rem\)/);
  assert.match(styles, /min-block-size: calc\(100svh - 4\.3125rem\)/);
});

test("Synastry overlaying fields have an executable forward migration", async () => {
  const migration = await read(
    "migrations/0028_synastry_overlaying_state_content.sql",
  );
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_synastry)")
      .all()
      .map((column) => column.name),
  );

  for (const field of ["overlaying_title", "overlaying_status"]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_synastry ADD COLUMN ${field} TEXT;`),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
