import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { buildBaseWorkspace, collectWorkerFiles } from "../scripts/preview-artifacts.mjs";
import { nativeStaticAssets } from "../src/server/generated-site/workspace-state/template-contract.ts";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

test("native Sidera base is deterministic and keeps public catalog, content, and assets", async () => {
  const directory = mkdtempSync(join(tmpdir(), "sidera-native-contract-"));
  try {
    const commit = "0".repeat(40);
    const first = join(directory, "first.sqlite");
    const second = join(directory, "second.sqlite");
    const a = await buildBaseWorkspace(first, { templateCommitSha: commit });
    const b = await buildBaseWorkspace(second, { templateCommitSha: commit });
    assert.equal(sha256(readFileSync(first)), sha256(readFileSync(second)));
    assert.equal(a.authoredFingerprint, b.authoredFingerprint);
    const assets = JSON.parse(readFileSync(new URL("../astropages/assets.manifest.json", import.meta.url), "utf8")).assets;
    assert.equal(a.seedAssets.length, assets.length);
    assert.equal(a.localizedEntries, 336);
    assert.equal(nativeStaticAssets.length, 17);
    const db = new DatabaseSync(first, { readOnly: true });
    try {
      for (const [table, minimum] of Object.entries({
        ec_posts: 42,
        ap_report_products: 6,
        ap_shop_products: 9,
        ap_astrologers: 11,
        ap_email_templates: 3,
        ap_email_events: 3,
        ap_email_variable_mappings: 11,
        ap_asset_records: new Set(assets.map((asset) => asset.contentHash)).size,
        ap_asset_aliases: assets.length,
      })) assert.ok(db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count >= minimum, table);
      assert.equal(db.prepare("SELECT COUNT(*) AS count FROM ap_email_deliveries").get().count, 0);
      assert.equal(db.prepare("SELECT COUNT(*) AS count FROM ap_customer_accounts").get().count, 0);
      assert.equal(db.prepare("SELECT value_json FROM ap_business_settings WHERE key='payment_preference'").get().value_json, '{"value":"AUTO","schemaVersion":1,"revision":1}');
      assert.ok(db.prepare("SELECT id FROM _emdash_collections WHERE slug='posts'").get());
      assert.deepEqual(db.prepare("PRAGMA foreign_key_check").all(), []);
      assert.equal(db.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
    } finally { db.close(); }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("VM bundle omits only native static bytes already signed as seed assets", () => {
  const assets = JSON.parse(readFileSync(new URL("../astropages/assets.manifest.json", import.meta.url), "utf8")).assets;
  const seedDigests = new Set(assets.map(asset => asset.contentHash.slice("sha256:".length)));
  const directory = mkdtempSync(join(tmpdir(), "sidera-worker-files-"));
  try {
    mkdirSync(join(directory, "server"));
    writeFileSync(join(directory, "server/entry.mjs"), "export default {};");
    for (const asset of nativeStaticAssets) {
      const path = `client${asset.path}`;
      const target = join(directory, path);
      mkdirSync(join(target, ".."), { recursive: true });
      copyFileSync(new URL(`../public${asset.path}`, import.meta.url), target);
    }
    const files = collectWorkerFiles(directory);
    const paths = new Set(files.map(file => file.path));
    for (const asset of nativeStaticAssets) {
      const path = `client${asset.path}`;
      assert.equal(sha256(readFileSync(join(directory, path))), asset.digest, path);
      assert.equal(paths.has(path), !seedDigests.has(asset.digest), path);
    }
    assert.equal(nativeStaticAssets.filter(asset => seedDigests.has(asset.digest)).length, 15);
    const first = join(directory, `client${nativeStaticAssets[0].path}`);
    writeFileSync(first, "tampered");
    assert.throws(() => collectWorkerFiles(directory), /native_public_asset_bundle_mismatch/);
    rmSync(first);
    assert.throws(() => collectWorkerFiles(directory), /native_public_asset_bundle_mismatch|ENOENT/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
