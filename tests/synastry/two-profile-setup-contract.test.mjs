import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Synastry composes only the approved two-profile setup", async () => {
  const [page, component, css, pageCss] = await Promise.all([
    read("src/pages/synastry.astro"),
    read("src/components/synastry/sections/SynastryTwoProfileSetup.astro"),
    read("src/styles/synastry/sections/two-profile-setup.css"),
    read("src/styles/synastry/synastry.css"),
  ]);
  assert.match(page, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(page, /<Header/);
  assert.match(page, /current: true/);
  assert.match(page, /<SynastryExperience/);
  assert.match(page, /<main class="synastry-main">/);
  assert.match(pageCss, /\.synastry-main\s*\{[^}]*max-inline-size:\s*none/s);
  assert.doesNotMatch(page, /CastingState|ResultsShell|FinalCtaSection/);
  assert.match(component, /import AstrologyProfileForm/);
  assert.doesNotMatch(component, /ChoiceChips|synastry-relationship|relationshipOptions/);
  assert.doesNotMatch(component, /BrandLogo|synastry-setup__topbar/);
  assert.match(component, /layout="paired"/);
  assert.match(component, /profiles=\{profiles\}/);
  assert.match(page, /await listCustomerUserProfiles\(runtimeEnv, customerSession\.account\.id\)/);
  assert.match(page, /customerProfiles\.find\(\(profile\) => profile\.id === requestedProfileId\)/);
  assert.match(page, /initialProfile=\{initialProfile\}/);
  assert.match(page, /savedProfiles=\{savedProfiles\}/);
  assert.match(component, /nameValue: initialProfile\?\.name/);
  assert.match(component, /date: personOneDate/);
  assert.match(component, /time: personOneTime/);
  assert.match(component, /location: personOneLocation/);
  assert.match(component, /selectedLocation:/);
  assert.match(component, /method="get"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.synastry-setup__intro\s*\{[^}]*text-align:\s*center/s);
  assert.match(
    css,
    /\.synastry-setup__intro h1\s*\{[^}]*margin:\s*0\.875rem auto 0;[^}]*text-align:\s*center/s,
  );
  assert.doesNotMatch(css, /\.astrology-profile-form__/);
  assert.doesNotMatch(css, /\.sidera-choice-chips__/);
});

test("Synastry reuses shared profile selection and creation components", async () => {
  const [component, experience, addProfile, css] = await Promise.all([
    read("src/components/synastry/sections/SynastryTwoProfileSetup.astro"),
    read("src/components/synastry/SynastryExperience.astro"),
    read("src/components/shared/AddProfileForm.astro"),
    read("src/styles/synastry/sections/two-profile-setup.css"),
  ]);

  assert.match(component, /import Dialog from "\.\.\/\.\.\/shared\/Dialog\.astro"/);
  assert.match(component, /import EmptyState from "\.\.\/\.\.\/shared\/EmptyState\.astro"/);
  assert.match(component, /import AddProfileForm from "\.\.\/\.\.\/shared\/AddProfileForm\.astro"/);
  assert.equal((component.match(/data-synastry-profile-target=/g) || []).length, 2);
  assert.match(component, /slot="profile-one-heading-action"/);
  assert.match(component, /slot="profile-two-heading-action"/);
  assert.equal((component.match(/variant="link"/g) || []).length >= 3, true);
  assert.doesNotMatch(component, /slot="profile-one-extra"/);
  assert.doesNotMatch(component, /slot="profile-two-extra"/);
  assert.match(component, /data-synastry-profile-option/);
  assert.match(component, /data-synastry-profile-empty/);
  assert.match(component, /class="synastry-profile-picker__name-row"/);
  assert.match(component, /title=\{profile\.name\}/);
  assert.match(component, /profile\.isDefault/);
  assert.match(component, /sidera:profile-created/);
  assert.match(component, /dialog\.close\("selected"\)/);
  assert.match(component, /data-location-value=/);
  assert.match(experience, /savedProfiles=\{savedProfiles\}/);
  assert.match(addProfile, /<AstrologyProfileForm/);
  assert.match(addProfile, /<Button/);
  assert.match(addProfile, /loading=\{false\}/);
  assert.match(addProfile, /x-astropages-customer-csrf/);
  assert.match(addProfile, /x-idempotency-key/);
  assert.match(addProfile, /sidera:profile-created/);
  assert.match(css, /\.synastry-profile-picker__option:hover/);
  assert.match(css, /\.synastry-profile-picker__option:focus-visible/);
  assert.match(css, /\.synastry-profile-picker__name-row strong\s*\{[^}]*text-overflow: ellipsis;[^}]*white-space: nowrap/s);
  assert.match(css, /\.synastry-profile-picker__list\s*\{[^}]*max-block-size:[^}]*overflow-y: auto/s);
  assert.match(css, /@media \(max-width: 40rem\)[\s\S]*\.synastry-profile-picker__list\s*\{[^}]*max-block-size:/);
  assert.match(css, /\.synastry-setup__profile-heading-action \.sidera-button/);
});

test("Synastry registers its bounded editable page target", async () => {
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );
  assert.deepEqual(getBuilderPageTargets("synastry"), [
    { collection: "site_synastry", entry: "synastry" },
  ]);
  const config = getBuilderEntryConfig("site_synastry", "synastry");
  assert.ok(config);
  const fields = new Set(config.editableFields.map((field) => field.slug));
  for (const field of [
    "eyebrow",
    "title_accent",
    "person_one_title",
    "person_two_title",
    "location_placeholder",
    "select_profile_label",
    "profile_picker_empty_title",
    "profile_picker_save_label",
    "submit_label",
    "seo_title",
  ]) {
    assert.equal(fields.has(field), true, `${field} should be registered`);
  }
});

test("all locales provide complete Synastry setup and SEO defaults", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getSynastryDefaults } = await import("../../src/data/public-copy.ts");
  const keys = Object.keys(getSynastryDefaults("en"));
  assert.equal(activeLocaleCodes.length, 7);
  for (const locale of activeLocaleCodes) {
    const defaults = getSynastryDefaults(locale);
    assert.deepEqual(Object.keys(defaults), keys);
    for (const key of keys) {
      assert.equal(typeof defaults[key], "string");
      assert.notEqual(defaults[key].trim(), "", `${locale}.${key}`);
    }
  }
  assert.equal(getSynastryDefaults("de").topbar_label, "Kompatibilität · Synastrie");
  assert.equal(getSynastryDefaults("en").seo_canonical_path, "/synastry");
});

test("Synastry visible copy has exact edit bindings", async () => {
  const [page, component, profileForm] = await Promise.all([
    read("src/pages/synastry.astro"),
    read("src/components/synastry/sections/SynastryTwoProfileSetup.astro"),
    read("src/components/shared/AstrologyProfileForm.astro"),
  ]);
  assert.match(page, /builderEdit\(field\)/);
  for (const field of [
    "eyebrow",
    "title_accent",
    "title_rest",
    "description",
    "person_one_title",
    "person_two_title",
    "name_label",
    "birth_date_label",
    "birth_time_label",
    "birth_place_label",
    "submit_label",
    "footer_text",
  ]) {
    assert.match(component, new RegExp(`edit\\("${field}"\\)`));
  }
  assert.match(profileForm, /nameLabelEditAttributes/);
  assert.match(profileForm, /namePlaceholderEditAttributes/);
  assert.doesNotMatch(component, /relationship_(?:label|romantic|friendship|family|work)/);
});

test("Synastry migration materializes the setup collection", async () => {
  const [migration, pickerMigration] = await Promise.all([
    read("migrations/0027_synastry_setup_content.sql"),
    read("migrations/0123_synastry_profile_picker_content.sql"),
  ]);
  const db = new DatabaseSync(":memory:");
  db.exec(migration);
  db.exec(pickerMigration);
  const columns = new Set(
    db.prepare("PRAGMA table_info(ec_site_synastry)").all().map((row) => row.name),
  );
  for (const field of [
    "topbar_label",
    "relationship_label",
    "person_one_title",
    "person_two_title",
    "location_placeholder",
    "select_profile_label",
    "profile_picker_empty_title",
    "profile_picker_save_label",
    "submit_label",
    "seo_title",
  ]) {
    assert.equal(columns.has(field), true, `${field} should be migrated`);
  }
  db.close();
});
