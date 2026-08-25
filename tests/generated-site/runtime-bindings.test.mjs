import assert from "node:assert/strict";
import test from "node:test";

test("runtime binding resolution times out stalled Secret Store reads", async () => {
  const { resolveRuntimeBinding } = await import("../../src/server/aggregator/runtime-bindings.ts");
  const startedAt = Date.now();
  const value = await resolveRuntimeBinding({
    get: () => new Promise(() => {}),
  });

  assert.equal(value, "");
  assert.ok(Date.now() - startedAt < 2500);
});

test("Google Places resolves its canonical platform binding with legacy fallbacks", async () => {
  const {
    integrationSecretBundleBinding,
    legacyPlatformGooglePlacesSecretBinding,
    platformGooglePlacesSecretBinding,
    resolveSecretBinding,
  } = await import("../../src/server/aggregator/runtime-bindings.ts");

  assert.equal(
    platformGooglePlacesSecretBinding,
    "ASTROPAGES_PLATFORM_GOOGLE_PLACES_GOOGLE_PLACES_API_KEY",
  );
  assert.equal(
    await resolveSecretBinding(
      { [platformGooglePlacesSecretBinding]: "canonical-key" },
      platformGooglePlacesSecretBinding,
    ),
    "canonical-key",
  );
  assert.equal(
    await resolveSecretBinding(
      { [legacyPlatformGooglePlacesSecretBinding]: "legacy-platform-key" },
      platformGooglePlacesSecretBinding,
    ),
    "legacy-platform-key",
  );
  assert.equal(
    await resolveSecretBinding(
      {
        [integrationSecretBundleBinding]: JSON.stringify({
          secrets: { GOOGLE_PLACES_API_KEY: "legacy-bundled-key" },
        }),
      },
      platformGooglePlacesSecretBinding,
    ),
    "legacy-bundled-key",
  );
  assert.equal(
    await resolveSecretBinding(
      {
        [integrationSecretBundleBinding]: JSON.stringify({
          secrets: { [platformGooglePlacesSecretBinding]: "canonical-bundled-key" },
        }),
      },
      "GOOGLE_PLACES_API_KEY",
    ),
    "canonical-bundled-key",
  );
  assert.equal(
    await resolveSecretBinding(
      { GOOGLE_PLACES_API_KEY: "legacy-direct-key" },
      platformGooglePlacesSecretBinding,
    ),
    "legacy-direct-key",
  );
});

test("generic secrets can fall back to trimmed process environment values", async () => {
  const { resolveSecretBinding } = await import("../../src/server/aggregator/runtime-bindings.ts");
  const bindingName = "ASTROPAGES_TEST_PROCESS_SECRET";
  const previousValue = process.env[bindingName];

  try {
    process.env[bindingName] = "  process-secret  ";
    assert.equal(await resolveSecretBinding({}, bindingName), "process-secret");
  } finally {
    if (previousValue === undefined) delete process.env[bindingName];
    else process.env[bindingName] = previousValue;
  }
});
