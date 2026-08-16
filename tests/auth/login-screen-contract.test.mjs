import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../../src/pages/login.astro", import.meta.url);
const componentPath = new URL(
  "../../src/components/auth/sections/AuthLoginForm.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/auth/sections/login-form.css",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0079_sign_in_brand_panel_content.sql",
  import.meta.url,
);
const formMigrationPath = new URL(
  "../../migrations/0080_login_form_content.sql",
  import.meta.url,
);
const forgotPasswordMigrationPath = new URL(
  "../../migrations/0091_login_forgot_password_link_content.sql",
  import.meta.url,
);
const manifestPath = new URL("../../template.manifest.json", import.meta.url);

test("Login page composes the approved shell and prepared page-area form", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import AuthShell from "\.\.\/components\/shared\/AuthShell\.astro"/,
  );
  assert.match(source, /import AuthLoginForm/);
  assert.match(source, /loadPublicPageContent\(Astro, "login"\)/);
  assert.match(source, /getAuthLoginFormCopy\(locale\)/);
  assert.match(source, /localizePath\("\/signup", locale\)/);
  assert.match(source, /localizePath\("\/forgot-password", locale\)/);
});

test("Login Brand/value panel is localized and fully wired to Content Studio", async () => {
  const page = await readFile(pagePath, "utf8");
  const migration = await readFile(migrationPath, "utf8");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getLoginDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");

  const brandFields = [
    "login_brand_label",
    "login_back_label",
    "login_panel_kicker",
    "login_panel_title",
    "login_panel_description",
    "login_proof_1_label",
    "login_proof_2_label",
  ];
  for (const field of brandFields) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
    assert.match(migration, new RegExp(`${field} TEXT`));
  }

  for (const toolbarField of [
    "launcherEnabled: builder.launcherEnabled",
    "studioModeEnabled: builder.studioModeEnabled",
    "collection: builder.collection",
    "entry: builder.entry",
    "locale: builder.locale",
    "csrfToken: builder.csrfToken",
    "canPublish: builder.canPublish",
    "seo: seoContent",
    "reviewTargets",
  ]) {
    assert.match(
      page,
      new RegExp(toolbarField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.match(
    page,
    /hasSavedDraft: builderPage\.hasSavedDraft \|\| chromePage\.hasSavedDraft/,
  );

  assert.deepEqual(getBuilderPageTargets("login"), [
    { collection: "site_login", entry: "login" },
  ]);
  const fields = new Set(
    getBuilderEntryConfig("site_login", "login")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  for (const field of [...brandFields, "seo_title", "seo_description"]) {
    assert.equal(fields.has(field), true, `Login should register ${field}`);
  }
  assert.equal(
    manifest.localization.publicEditableEntries.includes("site_login/login"),
    true,
  );

  const englishKeys = Object.keys(getLoginDefaults("en")).sort();
  for (const locale of activeLocaleCodes) {
    const defaults = getLoginDefaults(locale);
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
    assert.equal(defaults.seo_canonical_path, "/login");
  }
});

test("Login safely preserves same-origin next destinations", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /requestedNextHref\.startsWith\("\/"\)/);
  assert.match(source, /requestedNextHref\.startsWith\("\/\/"\)/);
  assert.match(source, /target\.origin === requestUrl\.origin/);
  assert.match(source, /successHref=\{successHref\}/);
});

test("Login form composes approved controls and Sidera's email API contract", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(
    source,
    /import FormField from "\.\.\/\.\.\/shared\/FormField\.astro"/,
  );
  assert.match(
    source,
    /import PasswordField from "\.\.\/\.\.\/shared\/PasswordField\.astro"/,
  );
  assert.match(source, /type="email"/);
  assert.match(
    source,
    /body: JSON\.stringify\(\{[\s\S]*email:[\s\S]*password:/,
  );
  assert.match(source, /class="sidera-auth-login__terms"/);
  assert.match(source, /class="sidera-auth-login__signup"/);
  assert.match(source, /class="sidera-auth-login__forgot"/);
  assert.match(source, /href=\{forgotPasswordHref\}/);
  assert.match(source, /href=\{signupHref\}/);
  assert.match(source, /loading=\{false\}/);
  assert.match(source, /loadingLabel=\{copy\.loadingLabel\}/);
  assert.doesNotMatch(source, /identifier|guest-cart|termsAccepted/);
});

test("Login form copy is localized, editable, and physically migrated", async () => {
  const page = await readFile(pagePath, "utf8");
  const component = await readFile(componentPath, "utf8");
  const migration = await readFile(formMigrationPath, "utf8");
  const forgotPasswordMigration = await readFile(
    forgotPasswordMigrationPath,
    "utf8",
  );
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getLoginDefaults } = await import("../../src/data/public-copy.ts");

  const fields = [
    "login_form_heading",
    "login_form_subheading",
    "login_email_label",
    "login_email_placeholder",
    "login_password_label",
    "login_password_placeholder",
    "login_submit_label",
    "login_terms_prefix",
    "login_terms_label",
    "login_terms_glue",
    "login_privacy_label",
    "login_terms_suffix",
    "login_signup_prompt",
    "login_signup_label",
  ];
  for (const field of fields) {
    assert.match(page, new RegExp(`content\\.${field}`));
    assert.match(component, new RegExp(`edit\\("${field}"\\)`));
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }

  assert.match(page, /content\.login_forgot_password_label/);
  assert.match(component, /edit\("login_forgot_password_label"\)/);
  assert.match(
    forgotPasswordMigration,
    /ADD COLUMN login_forgot_password_label TEXT/,
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getLoginDefaults(locale);
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

test("Login form keeps validation, status, and interaction states accessible", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-busy/);
  assert.match(component, /firstInvalid\.focus\(\)/);
  assert.match(
    component,
    /import \{ setActionLoading \} from "\.\.\/\.\.\/\.\.\/scripts\/action-loading\.ts"/,
  );
  assert.match(
    component,
    /setActionLoading\(submit, loading, runtimeCopy\.loadingLabel\)/,
  );
  assert.match(component, /setLoading\(true\)/);
  assert.match(component, /setLoading\(false\)/);
  assert.match(component, /aria-busy"\) === "true"/);
  assert.match(component, /if \(!navigationStarted\) setLoading\(false\)/);
  assert.doesNotMatch(component, /setStatus\(runtimeCopy\.loadingLabel\)/);
  assert.match(component, /signupHref/);
  assert.match(component, /forgotPasswordHref/);
  assert.match(styles, /__forgot/);
  assert.match(styles, /__terms/);
  assert.match(styles, /__signup/);
  assert.match(styles, /@media \(max-width: 35rem\)/);
});
