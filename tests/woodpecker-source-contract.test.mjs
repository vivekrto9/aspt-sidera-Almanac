import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const exists = (path) => existsSync(new URL(path, root));

test("template source delegates releases to the signed Woodpecker extension", () => {
  const manifest = JSON.parse(readFileSync(new URL("template.manifest.json", root), "utf8"));

  assert.deepEqual(manifest.workflows.template, {
    provider: "woodpecker",
    configurationSource: "signed-control-plane-extension",
    entrypoint: "pnpm run astropages:pipeline",
    purposes: {
      ci: "template_ci",
      preview: "template_preview",
      production: "template_production",
    },
    githubSafetyCi: ".github/workflows/ci.yml",
    catalogScreenshots: "admin-managed",
  });
  assert.equal(exists(".github/workflows/ci.yml"), true);
  assert.equal(exists(".github/workflows/deploy-template-preview.yml"), false);
  assert.equal(exists(".github/workflows/deploy-production.yml"), false);
  assert.equal(exists(".woodpecker.yml"), false);
  assert.equal(exists("scripts/astropages-pipeline.mjs"), true);
  assert.equal(exists(".astropages/generated-site-workflows/deploy-preview.yml"), true);
  assert.equal(exists(".astropages/generated-site-workflows/deploy-production.yml"), true);
});

