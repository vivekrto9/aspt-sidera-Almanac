import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Today's Sky handoff composes the approved dark split CTA and Footer", async () => {
  const [component, route] = await Promise.all([
    read(
      "src/components/todays-sky/sections/TodaysSkyPersonalizedHandoff.astro",
    ),
    read("src/pages/todays-sky.astro"),
  ]);

  assert.match(
    component,
    /import FinalCtaSection from "\.\.\/\.\.\/shared\/FinalCtaSection\.astro"/,
  );
  assert.match(component, /tone="dark"/);
  assert.match(component, /layout="split"/);
  assert.match(component, /surface="panel"/);
  assert.match(component, /primaryHref="\/transit"/);
  assert.match(component, /secondaryHref="\/birth-chart"/);
  assert.match(component, /primaryArrow="→"/);
  assert.match(route, /<TodaysSkyPersonalizedHandoff/);
  assert.match(route, /<Footer/);
});

test("Today's Sky handoff copy covers every locale and exact visible field", async () => {
  const [component, copy, publicCopy, route] = await Promise.all([
    read(
      "src/components/todays-sky/sections/TodaysSkyPersonalizedHandoff.astro",
    ),
    read(
      "src/data/locale/todays-sky/sections/personalized-handoff.ts",
    ),
    read("src/data/public-copy.ts"),
    read("src/pages/todays-sky.astro"),
  ]);

  const fields = [
    "sky_handoff_eyebrow",
    "sky_handoff_title_prefix",
    "sky_handoff_title_accent",
    "sky_handoff_title_suffix",
    "sky_handoff_description",
    "sky_handoff_primary_label",
    "sky_handoff_secondary_label",
  ];
  for (const field of fields) {
    assert.match(component, new RegExp(`editAttributes\\("${field}"\\)`));
    assert.match(
      route,
      new RegExp(`${field}:\\s*content\\.${field}`),
      `${field} must render Builder-resolved content instead of source-only locale copy`,
    );
  }
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\n  ${locale}: \\{`));
  }
  assert.match(
    copy,
    /satisfies Record<SupportedLocale, TodaysSkyPersonalizedHandoffCopy>/,
  );
  assert.match(
    publicCopy,
    /const handoff = getTodaysSkyPersonalizedHandoffCopy\(locale\)/,
  );
  assert.match(publicCopy, /\.\.\.handoff/);
});

test("Today's Sky handoff keeps reference geometry page-scoped and responsive", async () => {
  const styles = await read(
    "src/styles/todays-sky/sections/todays-sky-personalized-handoff.css",
  );

  assert.match(styles, /--sidera-final-cta-background: var\(--color-dark\)/);
  assert.match(styles, /inline-size: min\(100% - 4\.25rem, 73\.75rem\)/);
  assert.match(styles, /padding: 2\.625rem 2\.5rem/);
  assert.match(styles, /max-inline-size: 35rem/);
  assert.match(styles, /@media \(max-width: 42rem\)/);
  assert.match(styles, /inline-size: min\(100% - 2rem, 73\.75rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Today's Sky handoff fields have a forward migration", async () => {
  const migration = await read(
    "migrations/0041_todays_sky_personalized_handoff.sql",
  );

  for (const field of [
    "sky_handoff_eyebrow",
    "sky_handoff_title_prefix",
    "sky_handoff_title_accent",
    "sky_handoff_title_suffix",
    "sky_handoff_description",
    "sky_handoff_primary_label",
    "sky_handoff_secondary_label",
  ]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_todays_sky ADD COLUMN ${field} TEXT;`),
    );
  }
});
