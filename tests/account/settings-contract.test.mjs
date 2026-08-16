import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Account Settings matches the reference form and shared control pattern", () => {
  const component = read(
    "src/components/account/sections/AccountSettings.astro",
  );
  const page = read("src/pages/account.astro");
  for (const dependency of [
    "SectionHeading",
    "FormField",
    "TextField",
    "SelectField",
    "Button",
  ])
    assert.match(component, new RegExp(`import ${dependency}`));
  assert.match(component, /id="settings"/);
  assert.match(component, /data-account-settings-form/);
  assert.doesNotMatch(component, /account-settings-horoscope/);
  assert.doesNotMatch(component, /<Checkbox/);
  assert.match(component, /data-daily-horoscope=\{String\(props\.dailyHoroscope\)\}/);
  assert.match(component, /dailyHoroscope: form\.dataset\.dailyHoroscope === "true"/);
  assert.match(component, /form\.reportValidity\(\)/);
  assert.match(component, /customer\/profile/);
  assert.match(component, /x-astropages-customer-csrf/);
  assert.match(component, /method: "PATCH"/);
  assert.doesNotMatch(
    component,
    /if \(status\) status\.hidden = false;\s*\}\);/,
  );
  assert.match(page, /<AccountSettings/);
  assert.match(page, /csrfToken=\{customerSession\?\.csrfToken/);
  assert.match(page, /houseSystem=\{customerSession\?\.account\.houseSystem/);
});

test("Account Settings keeps its responsive layout page-local", () => {
  const styles = read("src/styles/account/sections/account-settings.css");
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(styles, /account-settings__preference/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Account Settings copy and migration cover seven locales", () => {
  const locale = read("src/data/locale/account/sections/settings.ts");
  const defaults = read("src/data/public-copy.ts");
  const migration = read("migrations/0104_account_settings_content.sql");
  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"])
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  for (const field of [
    "eyebrow",
    "title",
    "full_name_label",
    "email_label",
    "house_system_label",
    "placidus_label",
    "whole_sign_label",
    "zodiac_label",
    "tropical_label",
    "sidereal_label",
    "horoscope_label",
    "horoscope_description",
    "save_label",
    "saved_message",
  ]) {
    assert.match(defaults, new RegExp(`account_settings_${field}`));
    assert.match(
      migration,
      new RegExp(`ADD COLUMN account_settings_${field} TEXT`),
    );
  }
});
