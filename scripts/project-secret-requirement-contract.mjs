import assert from "node:assert/strict";

// Project manifests declare custom requirements, not catalog-managed credentials.
export function assertProjectSecretRequirement(secret, catalogSecretKeys) {
  assert.ok(
    !catalogSecretKeys.has(secret.key),
    `${secret.key} is managed by the integration catalog`,
  );
  assert.ok(
    Array.isArray(secret.environments) &&
      secret.environments.length > 0 &&
      secret.environments.every((environment) =>
        ["preview", "production"].includes(environment),
      ) &&
      new Set(secret.environments).size === secret.environments.length,
    `${secret.key} environments must contain unique preview/production values`,
  );
}
