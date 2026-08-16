import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../../src/pages/reset-password.astro", import.meta.url);
const componentPath = new URL(
  "../../src/components/auth/sections/AuthResetPasswordForm.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/auth/sections/reset-password-form.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0089_reset_password_brand_panel_content.sql",
  import.meta.url,
);
const formMigrationPath = new URL(
  "../../migrations/0090_reset_password_form_content.sql",
  import.meta.url,
);
const confirmCopyMigrationPath = new URL(
  "../../migrations/0093_reset_password_confirm_copy.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("Reset Password page composes the approved AuthShell and reset password shell copy", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /import AuthShell from "\.\.\/components\/shared\/AuthShell\.astro"/);
  assert.match(source, /loadPublicPageContent\(Astro, "reset-password"\)/);
  assert.match(source, /getResetPasswordShellCopy\(locale\)/);
  assert.match(source, /formLabel=\{shellCopy\.formLabel\}/);
});

test("Reset Password brand/value panel fields and registry wiring are complete", async () => {
  const page = await readFile(pagePath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getResetPasswordDefaults } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );

  const brandFields = [
    "reset_password_brand_label",
    "reset_password_back_label",
    "reset_password_panel_kicker",
    "reset_password_panel_title",
    "reset_password_panel_description",
    "reset_password_proof_1_label",
    "reset_password_proof_2_label",
  ];

  for (const field of brandFields) {
    assert.equal(
      page.includes(`builderEdit("${field}")`),
      true,
      `Reset Password should wire ${field} to builder edit`,
    );
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  assert.deepEqual(getBuilderPageTargets("reset-password"), [
    { collection: "site_reset_password", entry: "reset-password" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig("site_reset_password", "reset-password")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  for (const field of [...brandFields, "seo_title", "seo_description"]) {
    assert.equal(
      fields.has(field),
      true,
      `Reset Password should register ${field}`,
    );
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes(
      "site_reset_password/reset-password",
    ),
    true,
  );

  const englishKeys = Object.keys(getResetPasswordDefaults("en")).sort();
  for (const locale of activeLocaleCodes) {
    const defaults = getResetPasswordDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
    assert.equal(defaults.seo_canonical_path, "/reset-password");
  }
});

test("Reset Password form fields are fully localized, editable, and physically migrated", async () => {
  const page = await readFile(pagePath, "utf8");
  const component = await readFile(componentPath, "utf8");
  const formMigration = await readFile(formMigrationPath, "utf8");
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getResetPasswordDefaults } = await import(
    "../../src/data/public-copy.ts"
  );

  const fields = [
    "reset_password_form_heading",
    "reset_password_form_subheading",
    "reset_password_password_label",
    "reset_password_password_placeholder",
    "reset_password_confirm_label",
    "reset_password_confirm_placeholder",
    "reset_password_password_hint",
    "reset_password_submit_label",
    "reset_password_loading_label",
    "reset_password_success_label",
    "reset_password_mismatch_label",
    "reset_password_invalid_password_label",
    "reset_password_login_prompt",
    "reset_password_login_label",
  ];

  const runtimeOnlyFields = new Set([
    "reset_password_loading_label",
    "reset_password_success_label",
    "reset_password_mismatch_label",
    "reset_password_invalid_password_label",
  ]);
  const runtimeCopyKeys = {
    reset_password_loading_label: "loadingLabel",
    reset_password_success_label: "successLabel",
    reset_password_mismatch_label: "mismatchLabel",
    reset_password_invalid_password_label: "invalidPasswordLabel",
  };

  for (const field of fields) {
    assert.equal(
      page.includes(`content.${field}`),
      true,
      `Reset Password should bind ${field} from content`,
    );
    if (runtimeOnlyFields.has(field)) {
      const runtimeKey = runtimeCopyKeys[field];
      assert.match(
        component,
        new RegExp(`\\b${runtimeKey}\\b`),
        `Reset Password runtime should serialize ${runtimeKey} from ${field}`,
      );
    } else {
      assert.equal(
        component.includes(`edit("${field}")`),
        true,
        `Reset Password component should call edit for ${field}`,
      );
    }
    assert.match(formMigration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }

  for (const locale of activeLocaleCodes) {
    const defaults = getResetPasswordDefaults(locale);
    for (const field of fields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Reset Password form keeps validation and status behavior", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");
  const confirmCopyMigration = await readFile(confirmCopyMigrationPath, "utf8");

  assert.match(component, /data-auth-reset-password-form/);
  assert.match(component, /data-auth-reset-password-submit/);
  assert.match(component, /data-runtime-copy/);
  assert.match(component, /PasswordField/);
  assert.match(component, /data-auth-reset-password-input/);
  assert.match(component, /data-auth-reset-password-error/);
  assert.match(component, /id="reset-password-password-runtime-error"/);
  assert.match(component, /id="reset-password-confirm-runtime-error"/);
  assert.match(component, /form\.addEventListener\("submit"/);
  assert.match(component, /setStatus\(/);
  assert.match(component, /customer-auth\/reset-password/);
  assert.match(component, /URLSearchParams\(window\.location\.search\)/);
  assert.match(styles, /__status/);
  assert.match(styles, /__actions/);
  assert.match(styles, /__field-error\[hidden\]/);
  assert.match(styles, /color:\s*var\(--color-text\)/);
  assert.doesNotMatch(styles, /visibility:\s*hidden/);
  assert.match(styles, /__switch/);
  assert.match(styles, /@media/);
  assert.match(confirmCopyMigration, /Confirm password/);
});
