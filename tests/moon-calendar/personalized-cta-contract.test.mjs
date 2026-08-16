import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const fields = [
  "personalized_cta_eyebrow",
  "personalized_cta_title_prefix",
  "personalized_cta_title_accent",
  "personalized_cta_title_suffix",
  "personalized_cta_description",
  "personalized_cta_primary_label",
  "personalized_cta_secondary_label",
];

test("Moon Calendar Personalized CTA composes the approved shared primitive", async () => {
  const component = await read(
    "src/components/moon-calendar/sections/MoonCalendarPersonalizedCta.astro",
  );
  const styles = await read(
    "src/styles/moon-calendar/sections/moon-calendar-personalized-cta.css",
  );

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /primaryHref="\/birth-chart"/);
  assert.match(component, /secondaryHref="\/todays-sky"/);
  assert.match(component, /primaryArrow="→"/);
  assert.match(component, /tone="dark"/);
  assert.match(component, /layout="split"/);
  assert.match(component, /surface="panel"/);
  assert.match(component, /ambience/);
  assert.match(styles, /--sidera-final-cta-background: var\(--color-dark\)/);
  assert.match(styles, /inline-size: min\(100% - 4\.25rem, 73\.75rem\)/);
  assert.match(styles, /padding: 2\.625rem 2\.5rem/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.doesNotMatch(styles, /\.sidera-final-cta\s*\{/);
});

test("Moon Calendar mounts the CTA after the cycle strip and before Footer", async () => {
  const page = await read("src/pages/moon-calendar.astro");
  const cycleIndex = page.indexOf("<MoonCalendarLunarCycleStrip");
  const ctaIndex = page.indexOf("<MoonCalendarPersonalizedCta");
  const footerIndex = page.indexOf("<Footer");

  assert.ok(cycleIndex > 0);
  assert.ok(ctaIndex > cycleIndex);
  assert.ok(footerIndex > ctaIndex);
  assert.match(
    page,
    /editAttributes=\{\(field\) =>[\s\S]*builderEdit\([\s\S]*`personalized_cta_\$\{field\.replace/,
  );
});

test("all active locales register seven non-empty editable CTA fields", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getMoonCalendarDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getMoonCalendarDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.deepEqual(getBuilderFieldTarget(field, "moon_calendar"), {
        collection: "site_moon_calendar",
        entry: "moon_calendar",
      });
    }
  }
});

test("Personalized CTA fields have a bounded forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0045_moon_calendar_page_header.sql"));
  sqlite.exec(await read("migrations/0062_moon_calendar_personalized_cta.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_moon_calendar)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
