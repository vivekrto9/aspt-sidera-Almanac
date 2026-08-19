import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Transit chart/date form composes approved shared controls", async () => {
  const [component, page, styles] = await Promise.all([
    read("src/components/transit/sections/TransitFormWizard.astro"),
    read("src/pages/transit.astro"),
    read("src/styles/transit/sections/form-wizard.css"),
  ]);
  assert.match(component, /export type TransitSavedChart/);
  assert.match(component, /data-transit-birth-fields/);
  assert.match(component, /name="profileId"/);
  assert.match(component, /class="transit-wizard__kicker-row"/);
  assert.match(
    component,
    /variant="primary"[\s\S]*?data-dialog-open="transit-profile-picker"/,
  );
  assert.doesNotMatch(
    component,
    /transit-wizard__profile-bar|variant="outline"[\s\S]*?data-dialog-open="transit-profile-picker"/,
  );
  assert.match(component, /savedCharts\.length/);
  assert.match(component, /transit-wizard__empty/);
  assert.match(component, /import Button/);
  assert.match(component, /import DateSelector/);
  assert.match(component, /import TimeSelector/);
  assert.match(component, /import LocationAutocomplete/);
  assert.match(component, /import Dialog/);
  assert.match(component, /import AddProfileForm/);
  assert.match(component, /import StepProgress/);
  assert.equal((component.match(/<StepProgress/g) ?? []).length, 2);
  assert.match(
    component,
    /<StepProgress[\s\S]*?\/>\s*<p class="birth-chart-wizard__eyebrow"/,
  );
  assert.doesNotMatch(component, /BrandLogo|birth-chart-wizard__topbar/);
  assert.doesNotMatch(component, /data-transit-step-number|data-transit-dot/);
  assert.match(component, /data-transit-wizard/);
  assert.match(component, /data-transit-profile-add/);
  assert.match(component, /data-transit-profile-add-view/);
  assert.match(component, /<AddProfileForm/);
  assert.match(component, /csrfToken=\{csrfToken\}/);
  assert.match(component, /<DateSelector/);
  assert.match(component, /selectPresentation="popover"/);
  assert.match(component, /#transit-date-month/);
  assert.match(component, /#transit-date-day/);
  assert.match(component, /#transit-date-year/);
  assert.doesNotMatch(component, /<select\b/);
  assert.match(component, /id="transit-continue"/);
  assert.match(
    component,
    /querySelector<HTMLButtonElement>\("#transit-continue"\)/,
  );
  assert.match(component, /scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(component, /focus\(\{ preventScroll: true \}\)/);
  assert.match(component, /new CustomEvent\("transitformsubmit"/);
  assert.doesNotMatch(component, /<AstrologyProfileForm/);
  assert.doesNotMatch(component, /CastingState|ResultsShell/);
  assert.match(page, /loadPublicPageContent\(Astro, "transit"\)/);
  assert.match(
    page,
    /import Header from "\.\.\/components\/shared\/Header\.astro"/,
  );
  assert.match(page, /<Header/);
  assert.match(page, /id="transit-header"/);
  assert.match(page, /navigation=\{navigation\}/);
  assert.match(page, /actions=\{actions\}/);
  assert.match(page, /options: languageOptions/);
  assert.match(
    page,
    /import TransitExperience from "\.\.\/components\/transit\/TransitExperience\.astro"/,
  );
  assert.match(page, /<TransitExperience/);
  assert.match(page, /listCustomerUserProfiles/);
  assert.match(page, /const savedCharts: readonly TransitSavedChart\[\]/);
  assert.match(page, /savedCharts=\{savedCharts\}/);
  assert.doesNotMatch(page, /temporarySavedCharts|alex-rivera|sam-chen/);
  assert.match(page, /isAuthenticated=\{Boolean\(customerSession\)\}/);
  assert.match(styles, /@media \(max-width: 50rem\)/);
  assert.match(styles, /scroll-margin-block-start: 4\.625rem/);
  assert.match(styles, /scroll-margin-block-start: 4\.25rem/);
  assert.match(styles, /\.transit-wizard__birth-fields[\s\S]*?gap: 0\.9375rem/);
  assert.match(
    styles,
    /\.transit-wizard__birth-fields[\s\S]*?\.sidera-form-field:not\(\[data-invalid="true"\]\)[\s\S]*?> \.sidera-form-field__error[\s\S]*?display: none/,
  );
  assert.match(
    styles,
    /\.transit-wizard__actions[\s\S]*?margin-block-start: 1\.178125rem/,
  );
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(
    styles,
    /\.transit-profile-picker__option \.sidera-avatar[\s\S]*?--avatar-size: 3rem/,
  );
  assert.match(styles, /--avatar-font-size: 0\.9375rem/);
  assert.match(styles, /\.transit-profile-picker__add-row/);
  assert.doesNotMatch(styles, /\.transit-wizard__date-fields/);
  assert.doesNotMatch(styles, /\.transit-wizard \.astrology-profile-form__/);
});

test("Transit form copy and registry cover all active locales", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getTransitDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const englishKeys = Object.keys(getTransitDefaults("en")).sort();
  for (const locale of activeLocaleCodes) {
    const defaults = getTransitDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string");
      assert.notEqual(defaults[field].trim(), "");
    }
  }
  const primaryKeys = englishKeys.filter(
    (field) =>
      !field.startsWith("results_") && !field.startsWith("year_ahead_"),
  );
  assert.deepEqual(getBuilderPageTargets("transit"), [
    { collection: "site_transit", entry: "transit" },
    { collection: "site_transit_results", entry: "results" },
  ]);
  const configured = new Set(
    getBuilderEntryConfig("site_transit", "transit")?.editableFields.map(
      (field) => field.slug,
    ) ?? [],
  );
  for (const field of primaryKeys.filter(
    (key) =>
      !key.startsWith("seo_") &&
      !key.startsWith("og_") &&
      !key.startsWith("twitter_"),
  )) {
    assert.equal(configured.has(field), true, `${field} is not editable`);
  }
});

test("Transit form fields have executable forward migrations", async () => {
  const [
    baseMigration,
    chartPickerMigration,
    profileLabelMigration,
    profileCtaMigration,
    chooseProfileMigration,
    chooseProfileRevisionMigration,
    addProfileContentMigration,
  ] = await Promise.all([
    read("migrations/0024_transit_form_content.sql"),
    read("migrations/0027_transit_chart_picker_content.sql"),
    read("migrations/0125_transit_select_profile_label.sql"),
    read("migrations/0126_transit_profile_cta_copy.sql"),
    read("migrations/0127_transit_choose_profile_cta.sql"),
    read("migrations/0128_transit_choose_profile_revision_copy.sql"),
    read("migrations/0129_transit_add_profile_content.sql"),
  ]);
  const { getTransitFormWizardCopy } =
    await import("../../src/data/locale/transit/sections/form-wizard.ts");
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(baseMigration);
  sqlite.exec(chartPickerMigration);
  sqlite.exec(`
    CREATE TABLE revisions (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      entry_id TEXT NOT NULL,
      data TEXT NOT NULL
    );
    INSERT INTO ec_site_transit (
      id,
      locale,
      new_chart_label,
      live_revision_id,
      draft_revision_id
    ) VALUES (
      'transit-en',
      'en',
      'Cast a new natal chart',
      'transit-live',
      'transit-draft'
    );
    INSERT INTO revisions (id, collection, entry_id, data) VALUES
      ('transit-live', 'site_transit', 'transit-en', '{"new_chart_label":"Cast a new natal chart"}'),
      ('transit-draft', 'site_transit', 'transit-en', '{"new_chart_label":"Cast a new natal chart"}');
  `);
  sqlite.exec(profileLabelMigration);
  sqlite.exec(profileCtaMigration);
  sqlite.exec(chooseProfileMigration);
  sqlite.exec(chooseProfileRevisionMigration);
  sqlite.exec(addProfileContentMigration);
  assert.deepEqual(
    {
      ...sqlite
        .prepare(
          `SELECT
          new_chart_label AS entryLabel,
          json_extract(live.data, '$.new_chart_label') AS liveLabel,
          json_extract(draft.data, '$.new_chart_label') AS draftLabel
        FROM ec_site_transit entry
        JOIN revisions live ON live.id = entry.live_revision_id
        JOIN revisions draft ON draft.id = entry.draft_revision_id
        WHERE entry.id = 'transit-en'`,
        )
        .get(),
    },
    {
      entryLabel: "Choose Profile",
      liveLabel: "Choose Profile",
      draftLabel: "Choose Profile",
    },
  );
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_transit)")
      .all()
      .map((column) => column.name),
  );
  for (const field of Object.keys(getTransitFormWizardCopy("en"))) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  sqlite.close();
});

test("Transit is registered as an editable visitor route", async () => {
  const manifest = JSON.parse(await read("template.manifest.json"));
  assert.equal(
    manifest.localization.publicEditableEntries.includes(
      "site_transit/transit",
    ),
    true,
  );
  assert.equal(
    manifest.routes.visitorRoutes.some(
      (route) => route.method === "GET" && route.path === "/transit",
    ),
    true,
  );
});
