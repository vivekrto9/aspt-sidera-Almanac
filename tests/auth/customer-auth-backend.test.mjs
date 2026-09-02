import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("customer auth migration adds the account consent field", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0002_customer_auth.sql"));
  sqlite.exec(await read("migrations/0109_customer_auth_mutations.sql"));
  const columns = sqlite
    .prepare("PRAGMA table_info(ap_customer_accounts)")
    .all();
  assert.ok(columns.some((column) => column.name === "consent_marketing"));
  sqlite.close();
});

test("signup and reset routes expose the bounded customer-auth mutations", async () => {
  const [
    repository,
    signup,
    requestReset,
    reset,
    signupForm,
    forgotForm,
    resetForm,
  ] = await Promise.all([
    read("src/server/aggregator/customer-auth.ts"),
    read("src/pages/api/astropages/generated-site/customer-auth/signup.ts"),
    read(
      "src/pages/api/astropages/generated-site/customer-auth/request-password-reset.ts",
    ),
    read(
      "src/pages/api/astropages/generated-site/customer-auth/reset-password.ts",
    ),
    read("src/components/auth/sections/AuthSignupForm.astro"),
    read("src/components/auth/sections/AuthForgotPasswordForm.astro"),
    read("src/components/auth/sections/AuthResetPasswordForm.astro"),
  ]);

  assert.match(repository, /passwordResetTtlMs = 60 \* 60 \* 1000/);
  assert.match(repository, /reset_token_hash/);
  assert.match(
    repository,
    /SET used_at = \? WHERE id = \? AND used_at IS NULL/,
  );
  assert.match(repository, /SET revoked_at = \? WHERE account_id = \?/);
  assert.doesNotMatch(requestReset, /resetUrl|token/);
  assert.match(signup, /acceptedTerms: parsedBody\.body\.acceptedTerms/);
  assert.match(reset, /resetCustomerPassword/);
  assert.match(signupForm, /customer-auth\/signup/);
  assert.match(forgotForm, /customer-auth\/request-password-reset/);
  assert.match(resetForm, /customer-auth\/reset-password/);
  for (const source of [signupForm, forgotForm, resetForm]) {
    assert.doesNotMatch(source, /await new Promise\(\(resolve\) => setTimeout/);
  }
});

test("password reset email keeps the token in the private delivery body", async () => {
  const email = await read(
    "src/server/aggregator/notifications/password-reset-email.ts",
  );
  assert.match(email, /sendTransactionalEmail/);
  assert.match(email, /escapeHtml\(url\)/);
  assert.match(email, /expires in one hour/i);
});
