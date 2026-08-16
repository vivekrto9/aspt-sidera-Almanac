import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL(
  "../../src/pages/forgot-password.astro",
  import.meta.url,
);
const componentPath = new URL(
  "../../src/components/auth/sections/AuthForgotPasswordForm.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/auth/sections/forgot-password-form.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0087_forgot_password_brand_panel_content.sql",
  import.meta.url,
);
const formMigrationPath = new URL(
  "../../migrations/0088_forgot_password_form_content.sql",
  import.meta.url,
);
const resendMigrationPath = new URL(
  "../../migrations/0094_forgot_password_resend_content.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("Forgot Password page composes the approved shell and password recovery shell copy", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import AuthShell from "\.\.\/components\/shared\/AuthShell\.astro"/,
  );
  assert.match(source, /import AuthForgotPasswordForm/);
  assert.match(source, /loadPublicPageContent\(Astro, "forgot-password"\)/);
  assert.match(source, /getAuthForgotPasswordFormCopy\(locale\)/);
  assert.match(source, /formLabel=\{shellCopy\.formLabel\}/);
});

test("Forgot Password Brand/value panel fields and registry wiring are complete", async () => {
  const page = await readFile(pagePath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getForgotPasswordDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");

  const brandFields = [
    "forgot_password_brand_label",
    "forgot_password_back_label",
    "forgot_password_panel_kicker",
    "forgot_password_panel_title",
    "forgot_password_panel_description",
    "forgot_password_proof_1_label",
    "forgot_password_proof_2_label",
  ];

  for (const field of brandFields) {
    assert.equal(
      page.includes(`builderEdit("${field}")`),
      true,
      `Forgot Password should wire ${field} to builder edit`,
    );
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  assert.deepEqual(getBuilderPageTargets("forgot-password"), [
    { collection: "site_forgot_password", entry: "forgot-password" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig(
      "site_forgot_password",
      "forgot-password",
    )?.editableFields.map((field) => field.slug),
  );
  for (const field of [...brandFields, "seo_title", "seo_description"]) {
    assert.equal(
      fields.has(field),
      true,
      `Forgot password should register ${field}`,
    );
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes(
      "site_forgot_password/forgot-password",
    ),
    true,
  );

  const englishKeys = Object.keys(getForgotPasswordDefaults("en")).sort();
  for (const locale of activeLocaleCodes) {
    const defaults = getForgotPasswordDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
    assert.equal(defaults.seo_canonical_path, "/forgot-password");
  }
});

test("Forgot Password form fields are fully localized, editable, and physically migrated", async () => {
  const page = await readFile(pagePath, "utf8");
  const component = await readFile(componentPath, "utf8");
  const formMigration = await readFile(formMigrationPath, "utf8");
  const resendMigration = await readFile(resendMigrationPath, "utf8");
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getForgotPasswordDefaults } =
    await import("../../src/data/public-copy.ts");

  const fields = [
    "forgot_password_form_heading",
    "forgot_password_form_subheading",
    "forgot_password_email_label",
    "forgot_password_email_placeholder",
    "forgot_password_submit_label",
    "forgot_password_loading_label",
    "forgot_password_success_label",
    "forgot_password_resent_success_label",
    "forgot_password_invalid_email_label",
    "forgot_password_resend_prompt",
    "forgot_password_resend_label",
    "forgot_password_resend_countdown_label",
    "forgot_password_resend_ready_label",
    "forgot_password_login_prompt",
    "forgot_password_login_label",
  ];
  const statusRuntimeOnlyFields = new Set([
    "forgot_password_loading_label",
    "forgot_password_success_label",
    "forgot_password_resent_success_label",
    "forgot_password_invalid_email_label",
    "forgot_password_resend_countdown_label",
    "forgot_password_resend_ready_label",
  ]);
  const runtimeCopyKeys = {
    forgot_password_loading_label: "loadingLabel",
    forgot_password_success_label: "successLabel",
    forgot_password_resent_success_label: "resentSuccessLabel",
    forgot_password_invalid_email_label: "invalidEmailLabel",
    forgot_password_resend_countdown_label: "resendCountdownLabel",
    forgot_password_resend_ready_label: "resendReadyLabel",
  };

  for (const field of fields) {
    assert.match(page, new RegExp(`content\\.${field}`));
    if (statusRuntimeOnlyFields.has(field)) {
      const runtimeKey = runtimeCopyKeys[field];
      assert.match(
        component,
        new RegExp(`\\b${runtimeKey}\\b`),
        `Forgot Password runtime should serialize ${runtimeKey} from ${field}`,
      );
    } else {
      assert.equal(
        component.includes(`edit("${field}")`),
        true,
        `Forgot Password component should call edit for ${field}`,
      );
    }
    assert.match(
      `${formMigration}\n${resendMigration}`,
      new RegExp(`ADD COLUMN ${field} TEXT`),
    );
  }

  for (const locale of activeLocaleCodes) {
    const defaults = getForgotPasswordDefaults(locale);
    for (const field of fields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
  }
});

test("Forgot Password form keeps validation and status behavior", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(component, /data-auth-forgot-password-form/);
  assert.match(component, /data-auth-forgot-password-submit/);
  assert.match(component, /data-runtime-copy/);
  assert.match(component, /type="email"/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /setAttribute\("aria-busy", "true"\)/);
  assert.match(component, /showError\(|setStatus\(/);
  assert.match(component, /customer-auth\/request-password-reset/);
  assert.match(component, /await fetch/);
  assert.match(component, /data-auth-forgot-password-resend/);
  assert.match(component, /Date\.now\(\) \+ 60_000/);
  assert.match(component, /window\.setInterval\(updateCooldown, 1_000\)/);
  assert.match(component, /countdownLabel\.replace\("\{time\}"/);
  assert.match(component, /role="timer"/);
  assert.match(component, /setAttribute\("aria-live", "polite"\)/);
  assert.match(component, /resendButton\?\.addEventListener\("click"/);
  assert.match(component, /\(resend && !resend\.hidden\)/);
  assert.match(component, /resetDeliveryState\(\)/);
  assert.match(styles, /__status/);
  assert.match(styles, /__resend-action/);
  assert.match(styles, /font-variant-numeric: tabular-nums/);
  assert.match(styles, /__switch/);
  assert.match(styles, /@media \(max-width: 35rem\)/);
});
