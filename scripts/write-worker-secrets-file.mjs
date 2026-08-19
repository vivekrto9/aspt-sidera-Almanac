import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { runtimeContract } from "./cloudflare-runtime-contract.mjs";

const runnerTemp = process.env.RUNNER_TEMP ?? ".wrangler/generated";
const outputPath = join(runnerTemp, "sidera-almanac-worker-secrets.json");
const secrets = {};

for (const name of runtimeContract.requiredSecretNames) {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} is required to write the Worker secrets file`);
    process.exit(1);
  }
  secrets[name] = value;
}

const optionalSecretNames = [
  "ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN",
  "SERVICE_CALLBACK_BEARER_TOKEN",
  ...runtimeContract.sensitiveProviderSecretBindings.map((item) => item.binding),
];

for (const name of optionalSecretNames) {
  const value = process.env[name];
  if (value) {
    secrets[name] = value;
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(secrets)}\n`, { mode: 0o600 });
console.log(`Worker secrets file written to ${outputPath}`);
