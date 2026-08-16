import { runtimeContract } from "./cloudflare-runtime-contract.mjs";

console.log("# Operator-run Cloudflare resource plan");
console.log("# This prints equivalent manual Cloudflare resource commands.");
console.log("# It does not create resources.\n");

for (const envName of runtimeContract.environments) {
  const resource = runtimeContract.resources[envName];
  console.log(`## ${envName}`);
  console.log(`pnpm exec wrangler d1 create ${resource.d1DatabaseName}`);
  console.log(`pnpm exec wrangler r2 bucket create ${resource.r2BucketName}`);
  console.log(`pnpm exec wrangler kv namespace create ${resource.kvNamespaceName}`);
  console.log(`pnpm exec wrangler secret put EMDASH_ENCRYPTION_KEY --env ${envName}`);
  console.log(`pnpm exec wrangler secret put BUILDER_MCP_TOKEN --env ${envName}`);
  console.log(`pnpm exec wrangler secret put BUILDER_MCP_PROVISION_SECRET --env ${envName}`);
  console.log("");
}
