import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const readJson = (path) => JSON.parse(read(path));

const docs = {
  readme: read("README.md"),
  agents: read("AGENTS.md"),
  cloudflare: read("docs/cloudflare-runtime.md"),
  openhands: read("docs/openhands-playbook.md"),
  leads: read("LEADS.md"),
  productLeads: read("docs/product-lead-generation.md"),
};

test("repository docs describe Sidera Almanac without stale single-page or legacy catalog guidance", () => {
  const publicDocs = Object.values(docs).join("\n");
  const d1Schema = read("database/d1/001_initial_site_schema.sql");

  assert.match(docs.readme, /# aspt-sidera-Almanac/);
  assert.match(docs.readme, /Almanac Sidera theme/);
  assert.doesNotMatch(publicDocs, /single-page AstroPages template/i);
  assert.doesNotMatch(publicDocs, /only the home page/i);
  assert.doesNotMatch(d1Schema, /single-page/i);
  assert.doesNotMatch(publicDocs, /templates\/sidera-almanac\/0\.1\.0\//);
  assert.doesNotMatch(publicDocs, /\b(?:PREVIEW_ASTRAGURU|PROD_ASTRAGURU|ASTROCONNECT)\b/);
  assert.match(docs.readme, /AstroPages Admin owns the semantic version, release notes, and changelog/i);
});

test("lead documentation is an agent-ready integration reference", () => {
  assert.match(docs.agents, /LEADS\.md/);
  assert.match(docs.leads, /leads\.v1/);
  assert.match(docs.leads, /linkBusinessLead/);
  assert.match(docs.leads, /markLeadConvertedBySourceReference/);
  assert.match(docs.leads, /wrangler d1 execute sidera-almanac-site --local/);
  assert.match(docs.productLeads, /POST \/api\/astropages\/generated-site\/leads\/product-interest/);
  assert.match(docs.productLeads, /pnpm wrangler dev --local --port 4321/);
});

test("docs keep template and generated-site secret contracts separate", () => {
  assert.match(
    docs.cloudflare,
    /Generated-site Worker runtime secrets are:\s*\n\s*-\s*`EMDASH_ENCRYPTION_KEY`\s*\n\s*-\s*`ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN`/m,
  );
  assert.match(docs.agents, /Generated-site Worker deploys must not require `BUILDER_MCP_TOKEN` or `BUILDER_MCP_PROVISION_SECRET`/);
  assert.doesNotMatch(
    `${docs.cloudflare}\n${docs.agents}\n${docs.openhands}`,
    /Generated-site deployments require:[\s\S]*BUILDER_MCP_(?:TOKEN|PROVISION_SECRET)/,
  );
});

test("template release version metadata is owned by AstroPages Admin", () => {
  const manifest = readJson("template.manifest.json");
  const capabilityLock = readJson("capability-lock.json");
  const packageJson = readJson("package.json");
  const bootstrapSource = read("src/server/generated-site/emdash-bootstrap.ts");

  assert.equal(Object.hasOwn(manifest, "version"), false);
  assert.equal(Object.hasOwn(manifest, "registryVersionId"), false);
  assert.equal(Object.hasOwn(capabilityLock, "templateRegistryVersionId"), false);
  assert.equal(Object.hasOwn(packageJson, "version"), false);
  assert.doesNotMatch(bootstrapSource, /bootstrapTemplateVersion/);
});
