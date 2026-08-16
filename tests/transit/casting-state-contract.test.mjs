import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Transit casting composes the approved shared transit visual", async () => {
  const source = await read(
    "src/components/transit/sections/TransitCastingState.astro",
  );

  assert.match(
    source,
    /import CastingState from "\.\.\/\.\.\/shared\/CastingState\.astro"/,
  );
  assert.match(source, /visual="transit"/);
  assert.match(source, /height="viewport"/);
  assert.match(source, /headingTag="h1"/);
  assert.match(source, /data-transit-casting/);
  assert.match(source, /tabindex="-1"/);
  assert.match(source, /\n  hidden\n\/>/);
  assert.doesNotMatch(source, /\bfetch\(|fake|mock result/i);
});

test("Transit experience reveals casting while preserving selected inputs", async () => {
  const [experience, page] = await Promise.all([
    read("src/components/transit/TransitExperience.astro"),
    read("src/pages/transit.astro"),
  ]);

  assert.match(experience, /<TransitFormWizard/);
  assert.match(experience, /<TransitCastingState/);
  assert.match(experience, /addEventListener\("transitformsubmit"/);
  assert.match(experience, /experience\.dataset\.submitting = "true"/);
  assert.match(experience, /wizard\.hidden = true/);
  assert.match(experience, /casting\.hidden = false/);
  assert.match(experience, /casting\.focus\(\)/);
  assert.match(experience, /formData\.get\("profileId"\)/);
  assert.match(experience, /formData\?\.get\("transitYear"\)|formData\.get\("transitYear"\)/);
  assert.match(experience, /fetch\(experience\.dataset\.apiEndpoint/);
  assert.match(experience, /profileId, profile, date/);
  assert.match(experience, /body\.readingId/);
  assert.match(experience, /window\.location\.assign/);
  assert.doesNotMatch(experience, /window\.setTimeout|alex-rivera/i);
  assert.match(page, /<TransitExperience/);
  assert.match(
    page,
    /resultHref=\{localizePath\("\/transit", locale\)\}/,
  );
});

test("Transit casting copy is localized and exactly editable", async () => {
  const [section, copy] = await Promise.all([
    read("src/components/transit/sections/TransitCastingState.astro"),
    read("src/data/locale/transit/sections/casting-state.ts"),
  ]);

  for (const field of [
    "casting_title",
    "casting_status",
    "casting_summary",
  ]) {
    assert.match(section, new RegExp(`editAttributes\\("${field}"\\)`));
  }
  assert.match(
    copy,
    /satisfies Record<SupportedLocale, TransitCastingStateCopy>/,
  );
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Transit casting preserves responsive and reduced-motion behavior", async () => {
  const [sectionStyles, pageStyles] = await Promise.all([
    read("src/styles/transit/sections/casting-state.css"),
    read("src/styles/transit/transit.css"),
  ]);

  assert.match(sectionStyles, /\.transit-casting\[hidden\]/);
  assert.match(
    sectionStyles,
    /min-block-size: calc\(100svh - 4\.625rem\)/,
  );
  assert.match(
    sectionStyles,
    /min-block-size: calc\(100svh - 4\.25rem\)/,
  );
  assert.match(
    sectionStyles,
    /@media \(prefers-reduced-motion: no-preference\)/,
  );
  assert.match(
    pageStyles,
    /\.transit-body > \[data-transit-experience\][\s\S]*inline-size: 100%/,
  );
  assert.match(pageStyles, /overflow-x: hidden/);
});

test("Transit casting fields have an executable fresh-safe migration", async () => {
  const migration = await read(
    "migrations/0038_transit_casting_state_content.sql",
  );
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_transit)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "casting_title",
    "casting_status",
    "casting_summary",
  ]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_transit ADD COLUMN ${field} TEXT;`),
    );
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
