import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { detectWorkflowMode, workflowPaths } from "./workflow-mode.mjs";

const sourceRoot = new URL("../../", import.meta.url);
const sourcePaths = detectWorkflowMode(sourceRoot) === "template-source"
  ? [workflowPaths.generatedPreviewSeed, workflowPaths.generatedProductionSeed]
  : [workflowPaths.installedPreview, workflowPaths.installedProduction];
const workflowContents = sourcePaths.map((path) => readFileSync(new URL(path, sourceRoot), "utf8"));

const fixture = (t, mode) => {
  const root = mkdtempSync(join(tmpdir(), "sidera-core-workflow-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of [
    "package.json",
    "template.manifest.json",
    "src/server/aggregator/admin-sso.ts",
    "scripts/cloudflare-runtime-contract.mjs",
    "scripts/d1-schema-contract.mjs",
    "tests/core-platform-contract.test.mjs",
    "tests/cloudflare/workflow-mode.mjs",
    "tests/cloudflare/generated-site-contract-assertions.mjs",
  ]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(new URL(path, sourceRoot), join(root, path));
  }
  const paths = mode === "template-source"
    ? [workflowPaths.generatedPreviewSeed, workflowPaths.generatedProductionSeed]
    : [workflowPaths.installedPreview, workflowPaths.installedProduction];
  paths.forEach((path, index) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), workflowContents[index]);
  });
  return { root, paths };
};

const runCoreWorkflowTests = (root) => {
  // Exercise the real core tests, not a separate assertion implementation.
  // Do not inherit NODE_TEST_CONTEXT: this child must start its own test runner.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return spawnSync(process.execPath, [
    "--test",
    "--test-name-pattern=SSO default target|deployment workflows keep",
    "tests/core-platform-contract.test.mjs",
  ], { cwd: root, env, encoding: "utf8", timeout: 15_000 });
};

for (const mode of ["template-source", "generated-site"]) {
  test(`core workflow contracts pass in ${mode} layout`, (t) => {
    const { root } = fixture(t, mode);
    const result = runCoreWorkflowTests(root);
    assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
  });
}

test("generated core workflow contracts reject missing production workflow", (t) => {
  const { root, paths } = fixture(t, "generated-site");
  rmSync(join(root, paths[1]));
  const result = runCoreWorkflowTests(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /ENOENT/);
  assert.match(result.stdout, /\.github\/workflows\/deploy-production\.yml/);
});

test("generated core workflow contracts still enforce deployment stages", (t) => {
  const { root, paths } = fixture(t, "generated-site");
  writeFileSync(join(root, paths[0]), workflowContents[0].replaceAll("pnpm run build", "echo omitted-build"));
  const result = runCoreWorkflowTests(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /must include pnpm run build/);
});

test("generated core workflow contracts still reject obsolete admin routes", (t) => {
  const { root, paths } = fixture(t, "generated-site");
  writeFileSync(join(root, paths[0]), `${workflowContents[0]}\n# /astropages/admin\n`);
  const result = runCoreWorkflowTests(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /must not reference generated-site admin/);
});
