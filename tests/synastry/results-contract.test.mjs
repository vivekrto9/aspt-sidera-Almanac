import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Synastry Results composes approved shared results primitives", async () => {
  const source = await read(
    "src/components/synastry/sections/SynastryResults.astro",
  );

  assert.match(source, /import ResultsShell from "\.\.\/\.\.\/shared\/ResultsShell\.astro"/);
  assert.match(source, /import AspectRow from "\.\.\/\.\.\/shared\/AspectRow\.astro"/);
  assert.match(source, /chartMode="synastry"/);
  assert.match(source, /chartPlanets=\{chartPlanets\}/);
  assert.match(source, /chartAspects=\{chartAspects\}/);
  assert.match(source, /data-synastry-results/);
  assert.doesNotMatch(source, /FinalCtaSection|full report|\$39/i);
});

test("Synastry Results consumes prepared data without simulating a real result", async () => {
  const [experience, page, slugPage, types] = await Promise.all([
    read("src/components/synastry/SynastryExperience.astro"),
    read("src/pages/synastry.astro"),
    read("src/pages/synastry/[slug].astro"),
    read("src/data/synastry/results.ts"),
  ]);

  assert.match(experience, /result\?: PreparedSynastryResult/);
  assert.match(experience, /result \? \(/);
  assert.match(experience, /<SynastryResults/);
  assert.doesNotMatch(page, /result=\{|PreparedSynastryResult|mock|sample/i);
  assert.match(slugPage, /getSynastryReading/);
  assert.match(slugPage, /reading\.result/);
  assert.doesNotMatch(slugPage, /dummySynastryResult|mara-sam/);
  assert.match(slugPage, /<Header/);
  assert.match(slugPage, /<SynastryResults/);
  assert.match(slugPage, /seo_robots: "noindex,nofollow"/);
  assert.match(types, /export type PreparedSynastryResult/);
  assert.match(experience, /generated-site\/synastry/);
});

test("Synastry aspect selection synchronizes details, rows, and chart planets", async () => {
  const source = await read(
    "src/components/synastry/sections/SynastryResults.astro",
  );

  assert.match(source, /data-synastry-aspect-panel/);
  assert.match(source, /data-synastry-aspect-row/);
  assert.match(source, /row\.setAttribute\("aria-pressed", String\(selected\)\)/);
  assert.match(source, /chart-wheel__planet--selected/);
  assert.match(source, /addEventListener\("planetselect"/);
  assert.match(source, /addEventListener\("click"/);
});

test("Synastry Results static copy is localized and exactly editable", async () => {
  const [section, copy] = await Promise.all([
    read("src/components/synastry/sections/SynastryResults.astro"),
    read("src/data/locale/synastry/sections/results.ts"),
  ]);

  for (const field of [
    "results_resonance_label",
    "results_score_note",
    "results_verdict_label",
    "results_aspect_kicker",
    "results_aspect_label",
    "results_theme_label",
    "results_orb_label",
    "results_contacts_title",
    "results_conjunction_label",
    "results_harmonious_label",
    "results_challenging_label",
  ]) {
    assert.match(section, new RegExp(`editAttributes\\("${field}"\\)`));
  }
  assert.match(copy, /satisfies Record<SupportedLocale, SynastryResultsCopy>/);
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
});

test("Synastry Results stays responsive and motion-safe", async () => {
  const styles = await read("src/styles/synastry/sections/results.css");

  assert.match(styles, /@media \(max-width: 58rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Synastry Results fields have executable forward migrations", async () => {
  const [migration, scoreNoteMigration] = await Promise.all([
    read("migrations/0030_synastry_results_content.sql"),
    read("migrations/0148_synastry_score_note.sql"),
  ]);
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(migration);
  sqlite.exec(scoreNoteMigration);
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_synastry)")
      .all()
      .map((column) => column.name),
  );
  for (const field of [
    "results_resonance_label",
    "results_score_note",
    "results_chart_description",
    "results_aspect_kicker",
    "results_contacts_title",
    "results_challenging_label",
  ]) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});
