import assert from "node:assert/strict";
import test from "node:test";

import {
  integrationSecretBundleBinding,
  platformGooglePlacesSecretBinding,
  secretStoreBindingsForGeneratedSite,
  loadWranglerConfig,
  runtimeContract,
  validateCloudflareRuntimeConfig,
} from "../../scripts/cloudflare-runtime-contract.mjs";
import { assertWranglerRuntimeContract } from "./generated-site-contract-assertions.mjs";

test("wrangler config defines local, preview, and production runtime bindings", () => {
  const config = loadWranglerConfig();

  assert.deepEqual(validateCloudflareRuntimeConfig(config), []);
  assert.deepEqual(Object.keys(config.env).sort(), ["preview", "production"]);

  for (const envName of ["local", ...runtimeContract.environments]) {
    const section = envName === "local" ? config : config.env[envName];
    assert.equal(section.images.binding, "IMAGES");
    assert.equal(section.d1_databases[0].binding, "DB");
    assert.equal(section.r2_buckets[0].binding, "MEDIA");
    assert.equal(section.kv_namespaces[0].binding, "SESSION");
    assert.equal(section.worker_loaders[0].binding, "LOADER");
    assert.equal(section.assets.binding, "ASSETS");
    assert.deepEqual(section.assets.run_worker_first, runtimeContract.workerFirstRoutes);
    if (envName === "local") {
      assert.equal(section.secrets, undefined);
    } else {
      assert.deepEqual(section.secrets.required, runtimeContract.requiredSecretNames);
    }
    for (const bindingName of runtimeContract.optionalProviderBindingNames) {
      assert.equal(section.secrets?.required?.includes(bindingName) ?? false, false);
    }
  }
});

test("preview and production resource names match the approved contract", () => {
  const config = loadWranglerConfig();
  const serializedConfig = JSON.stringify(config);

  assert.doesNotMatch(serializedConfig, /third-project/);

  assert.equal(config.env.preview.name, runtimeContract.resources.preview.workerName);
  assert.equal(
    config.env.preview.d1_databases[0].database_name,
    runtimeContract.resources.preview.d1DatabaseName,
  );
  assert.equal(
    config.env.preview.r2_buckets[0].bucket_name,
    runtimeContract.resources.preview.r2BucketName,
  );
  assert.equal(
    config.env.preview.kv_namespaces[0].id,
    "PREVIEW_SESSION_KV_NAMESPACE_ID_FROM_WRANGLER_CREATE",
  );

  assert.equal(
    config.env.production.name,
    runtimeContract.resources.production.workerName,
  );
  assert.equal(
    config.env.production.d1_databases[0].database_name,
    runtimeContract.resources.production.d1DatabaseName,
  );
  assert.equal(
    config.env.production.r2_buckets[0].bucket_name,
    runtimeContract.resources.production.r2BucketName,
  );
  assert.equal(
    config.env.production.kv_namespaces[0].id,
    "PRODUCTION_SESSION_KV_NAMESPACE_ID_FROM_WRANGLER_CREATE",
  );
});

test("worker secret contract and generated-site Secret Store bindings match platform contract", () => {
  assertWranglerRuntimeContract();
  const bindings = secretStoreBindingsForGeneratedSite({
    envName: "preview",
    projectId: "11111111-1111-4111-8111-111111111111",
    storeId: "store-123",
  });
  assert.deepEqual(
    bindings.map((binding) => binding.binding),
    [integrationSecretBundleBinding, platformGooglePlacesSecretBinding],
  );
});
