import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { assertProjectSecretRequirement } from "../scripts/project-secret-requirement-contract.mjs";

const builtInSecretKeys = new Set([
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "GA4_API_SECRET",
  "POSTHOG_PERSONAL_API_KEY",
  "ZAPIER_WEBHOOK_URL",
  "ZAPIER_REST_HOOK_SUBSCRIPTIONS_JSON",
  "GOOGLE_CALENDAR_CLIENT_ID",
  "GOOGLE_CALENDAR_CLIENT_SECRET",
  "GOOGLE_CALENDAR_REFRESH_TOKEN",
  "CALENDLY_API_TOKEN",
  "CALENDLY_WEBHOOK_SIGNING_KEY",
  "WATI_API_TOKEN",
  "MAILCHIMP_API_KEY",
  "X_ASTROLOGYAPI_KEY",
  "GOOGLE_PLACES_API_KEY",
  "ASTROPAGES_PLATFORM_GOOGLE_PLACES_GOOGLE_PLACES_API_KEY",
]);

const sourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return /\.(?:ts|tsx|js|mjs)$/.test(entry.name) ? [target] : [];
    }),
  );
  return nested.flat();
};

test("secret manifest contains requirements only and declares non-catalog lookups", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../astropages/secrets.manifest.json", import.meta.url), "utf8"),
  );
  assert.equal(manifest.version, 1);
  assert.ok(Array.isArray(manifest.integrations));
  const declared = new Set();
  for (const integration of manifest.integrations) {
    assert.match(integration.key, /^[a-z][a-z0-9_]{0,63}$/);
    assert.equal(typeof integration.name, "string");
    assert.ok(Array.isArray(integration.secrets));
    for (const secret of integration.secrets) {
      assertProjectSecretRequirement(secret, builtInSecretKeys);
      assert.deepEqual(
        Object.keys(secret).sort(),
        Object.keys(secret)
          .filter((key) =>
            ["key", "label", "helpText", "required", "environments"].includes(
              key,
            ),
          )
          .sort(),
      );
      assert.match(secret.key, /^[A-Z][A-Z0-9_]{0,63}$/);
      assert.ok(
        !declared.has(secret.key),
        `duplicate secret key ${secret.key}`,
      );
      declared.add(secret.key);
    }
  }

  const lookupPattern =
    /resolveSecretBinding\([^,]+,\s*["']([A-Z][A-Z0-9_]*)["']/g;
  const srcDirectory = new URL("../src", import.meta.url).pathname;
  for (const file of await sourceFiles(srcDirectory)) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(lookupPattern)) {
      assert.ok(
        builtInSecretKeys.has(match[1]) || declared.has(match[1]),
        `${path.relative(process.cwd(), file)} uses undeclared secret ${match[1]}`,
      );
    }
  }
});

test("project secret requirements reject catalog-managed Calendly keys", () => {
  for (const key of ["CALENDLY_API_TOKEN", "CALENDLY_WEBHOOK_SIGNING_KEY"]) {
    assert.throws(
      () => assertProjectSecretRequirement(
        { key, environments: ["preview", "production"] }, builtInSecretKeys,
      ),
      /managed by the integration catalog/,
    );
  }
});

test("custom secret requirements only accept unique deployment environments", () => {
  for (const environments of [undefined, [], ["local"], ["local", "preview", "production"], ["preview", "preview"]]) {
    assert.throws(
      () => assertProjectSecretRequirement(
        { key: "CUSTOM_PROVIDER_TOKEN", environments }, builtInSecretKeys,
      ),
      /unique preview\/production values/,
    );
  }
  for (const environments of [["preview"], ["production"], ["preview", "production"]]) {
    assert.doesNotThrow(() => assertProjectSecretRequirement(
      { key: "CUSTOM_PROVIDER_TOKEN", environments }, builtInSecretKeys,
    ));
  }
});
