import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../../src/pages/signup.astro", import.meta.url);
const componentPath = new URL(
  "../../src/components/auth/sections/AuthSignupForm.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/auth/sections/signup-form.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0084_signup_brand_panel_content.sql",
  import.meta.url,
);
const formMigrationPath = new URL(
  "../../migrations/0086_signup_form_content.sql",
  import.meta.url,
);
const phoneMigrationPath = new URL(
  "../../migrations/0092_signup_international_phone_content.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("Signup page composes the approved AuthShell and signup form", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /import AuthShell from "\.\.\/components\/shared\/AuthShell\.astro"/);
  assert.match(source, /import AuthSignupForm/);
  assert.match(source, /loadPublicPageContent\(Astro, "signup"\)/);
  assert.match(source, /getAuthSignupFormCopy\(locale\)/);
  assert.doesNotMatch(source, /forgot-password|reset-password/);
  assert.match(source, /formLabel=\{shellCopy\.formLabel\}/);
});

test("Signup Brand/value panel is localized and fully wired to Content Studio", async () => {
  const page = await readFile(pagePath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getSignupDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );

  const brandFields = [
    "signup_brand_label",
    "signup_back_label",
    "signup_panel_kicker",
    "signup_panel_title",
    "signup_panel_description",
    "signup_proof_1_label",
    "signup_proof_2_label",
  ];

  for (const field of brandFields) {
    assert.match(page, new RegExp(`builderEdit\\(\"${field}\"\\)`));
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  assert.deepEqual(getBuilderPageTargets("signup"), [
    { collection: "site_signup", entry: "signup" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig("site_signup", "signup")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  for (const field of [...brandFields, "seo_title", "seo_description"]) {
    assert.equal(fields.has(field), true, `Signup should register ${field}`);
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes("site_signup/signup"),
    true,
  );

  const englishKeys = Object.keys(getSignupDefaults("en")).sort();
  for (const locale of activeLocaleCodes) {
    const defaults = getSignupDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/signup");
  }
});

test("Signup form is fully localized, editable, and physically migrated", async () => {
  const page = await readFile(pagePath, "utf8");
  const component = await readFile(componentPath, "utf8");
  const formMigration = await readFile(formMigrationPath, "utf8");
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getSignupDefaults } = await import("../../src/data/public-copy.ts");

  const fields = [
    "signup_form_heading",
    "signup_form_subheading",
    "signup_full_name_label",
    "signup_full_name_placeholder",
    "signup_email_label",
    "signup_email_placeholder",
    "signup_phone_label",
    "signup_phone_placeholder",
    "signup_password_label",
    "signup_password_placeholder",
    "signup_password_hint",
    "signup_confirm_password_label",
    "signup_confirm_password_placeholder",
    "signup_create_account_label",
    "signup_creating_label",
    "signup_unavailable_label",
    "signup_mismatch_label",
    "signup_missing_password_label",
    "signup_terms_required_label",
    "signup_invalid_email_label",
    "signup_invalid_phone_label",
    "signup_login_prompt",
    "signup_login_label",
    "signup_terms_prefix",
    "signup_terms_label",
    "signup_terms_glue",
    "signup_privacy_label",
    "signup_terms_suffix",
    "signup_marketing_opt_in_label",
  ];
  const statusRuntimeOnlyFields = new Set([
    "signup_creating_label",
    "signup_unavailable_label",
    "signup_mismatch_label",
    "signup_missing_password_label",
    "signup_terms_required_label",
    "signup_invalid_email_label",
    "signup_invalid_phone_label",
  ]);
  const runtimeCopyKeys = {
    signup_creating_label: "creatingLabel",
    signup_unavailable_label: "unavailableLabel",
    signup_mismatch_label: "mismatchLabel",
    signup_missing_password_label: "missingPasswordLabel",
    signup_terms_required_label: "termsRequiredLabel",
    signup_invalid_email_label: "invalidEmailLabel",
    signup_invalid_phone_label: "invalidPhoneLabel",
  };

  for (const field of fields) {
    assert.match(page, new RegExp(`content\\.${field}`));
    if (statusRuntimeOnlyFields.has(field)) {
      const runtimeKey = runtimeCopyKeys[field];
      assert.match(
        component,
        new RegExp(`\\b${runtimeKey}\\b`),
        `Signup runtime should serialize ${runtimeKey} from ${field}`,
      );
    } else {
      assert.match(
        component,
        new RegExp(`edit\\("${field}"\\)`),
        `Signup component should call edit for ${field}`,
      );
    }
    assert.match(formMigration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }

  for (const locale of activeLocaleCodes) {
    const defaults = getSignupDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Signup form keeps validation and status behavior", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-busy/);
  assert.match(component, /form\.addEventListener\("submit"/);
  assert.match(component, /firstInvalid === "terms"/);
  assert.match(component, /data-auth-signup-error/);
  assert.match(component, /id="signup-full-name-error"/);
  assert.match(component, /id="signup-password-runtime-error"/);
  assert.match(component, /confirmPasswordRequiredLabel/);
  assert.match(component, /nameRequiredLabel/);
  assert.match(component, /getCountries/);
  assert.match(component, /getCountryCallingCode/);
  assert.match(component, /parsePhoneNumberFromString/);
  assert.match(component, /data-auth-signup-phone-country/);
  assert.match(component, /data-auth-signup-country-code/);
  assert.match(component, /data-auth-signup-phone-e164/);
  assert.doesNotMatch(component, /\^\[0-9\]\{8,15\}\$/);
  assert.match(component, /unavailableLabel/);
  assert.match(component, /termsRequiredLabel/);
  assert.match(component, /signup-password/);
  assert.match(styles, /__consent/);
  assert.match(styles, /__row/);
  assert.match(styles, /align-items:\s*start/);
  assert.match(styles, /__phone-control/);
  assert.match(styles, /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(styles, /grid-template-columns:\s*7rem minmax\(0, 1fr\)/);
  assert.match(styles, /__country-code/);
  assert.match(styles, /-webkit-text-fill-color:\s*transparent/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /__status/);
  assert.match(styles, /__actions/);
  assert.match(styles, /__field-error\[hidden\]/);
  assert.doesNotMatch(styles, /visibility:\s*hidden/);
});

test("Signup phone validation accepts country-specific lengths and normalizes E.164", async () => {
  const { parsePhoneNumberFromString } = await import("libphonenumber-js");
  const phoneMigration = await readFile(phoneMigrationPath, "utf8");

  const india = parsePhoneNumberFromString("98765 43210", "IN");
  const unitedStates = parsePhoneNumberFromString("202-555-0123", "US");
  const impossible = parsePhoneNumberFromString("8983833333333333333", "IN");

  assert.equal(india?.isValid(), true);
  assert.equal(india?.number, "+919876543210");
  assert.equal(unitedStates?.isValid(), true);
  assert.equal(unitedStates?.number, "+12025550123");
  assert.equal(Boolean(impossible?.isValid()), false);
  assert.match(phoneMigration, /UPDATE ec_site_signup/);
  assert.match(phoneMigration, /National number/);
  assert.match(phoneMigration, /signup_phone_placeholder IN/);
});
