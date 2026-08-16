import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const readJson = (path) => JSON.parse(read(path));

const textExtensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".yml",
  ".yaml",
]);
const excludedDirectories = new Set([".git", ".wrangler", "dist", "node_modules"]);
const historicalIdentityMigration = "migrations/0001_base_runtime.sql";
const identityContractTest = "tests/identity-contract.test.mjs";

const activeTextFiles = (directory = new URL(".", root)) => {
  const files = [];
  for (const name of readdirSync(directory)) {
    if (excludedDirectories.has(name)) continue;
    const url = new URL(`${name}${statSync(new URL(name, directory)).isDirectory() ? "/" : ""}`, directory);
    const path = relative(new URL(".", root).pathname, url.pathname).replace(/\/$/, "");
    if (statSync(url).isDirectory()) {
      files.push(...activeTextFiles(url));
    } else if (
      textExtensions.has(extname(name)) &&
      path !== historicalIdentityMigration &&
      path !== identityContractTest
    ) {
      files.push(path);
    }
  }
  return files;
};

test("Sidera identity is consistent across package, runtime, and deployment contracts", () => {
  const packageJson = readJson("package.json");
  const manifest = readJson("template.manifest.json");
  const wrangler = read("wrangler.jsonc");
  const publicCopy = read("src/data/public-copy.ts");
  const siteSettings = readJson("src/generated/site-settings.json");

  assert.equal(packageJson.name, "@astropages/sidera-almanac");
  assert.equal(packageJson.emdash.label, "Sidera Almanac");
  assert.equal(manifest.templateKey, "sidera-almanac");
  assert.equal(manifest.displayName, "Sidera Almanac");
  assert.match(wrangler, /"name": "sidera-almanac"/);
  assert.match(publicCopy, /brand_name: "Sidera"/);
  assert.equal(siteSettings.siteSettings.brandName, "Sidera");
});

test("active source contains no inherited base identity or fixed tunnel hostname", () => {
  const staleIdentity = /@astropages\/base-template|astropages-base-template|AstroPages Base Template|base-template|Base Template|BASE_TEMPLATE|ngrok-free\.(?:app|dev)/;
  for (const path of activeTextFiles()) {
    assert.doesNotMatch(read(path), staleIdentity, `${path} contains inherited base-template identity or a fixed tunnel host`);
  }
});

test("forward migration updates deployed site identity without rewriting migration 0001", () => {
  assert.match(read(historicalIdentityMigration), /"brandName":"Base Template"/);
  const migration = read("migrations/0008_sidera_warm_modern_identity.sql");
  assert.match(migration, /json_set\(value_json, '\$\.brandName', 'Sidera'\)/);
  assert.match(migration, /WHERE key = 'site'/);
});
