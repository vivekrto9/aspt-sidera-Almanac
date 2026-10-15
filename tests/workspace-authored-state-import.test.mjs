import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { buildBaseWorkspace } from '../scripts/preview-artifacts.mjs';
import { exportWorkspaceAuthoredState, importWorkspaceAuthoredState } from '../src/server/generated-site/workspace-authored-state.ts';

// The native base builder's atomic D1 interface, backed by actual SQLite.
function adapter(sqlite) {
  return {
    prepare(sql) {
      let values = [];
      return { bind(...next) { values = next; return this; }, execute() { return { results: sqlite.prepare(sql).all(...values) }; } };
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const result = statements.map(statement => statement.execute()); sqlite.exec('COMMIT'); return result; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
}
async function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'sidera-authored-import-'));
  let source, target;
  try {
    const sourcePath = join(directory, 'source.sqlite');
    const evidence = await buildBaseWorkspace(sourcePath, { templateCommitSha: 'a'.repeat(40) });
    copyFileSync(sourcePath, join(directory, 'target.sqlite'));
    source = new DatabaseSync(sourcePath); target = new DatabaseSync(join(directory, 'target.sqlite'));
    for (const db of [source, target]) db.exec('PRAGMA foreign_keys=ON');
    for (const [db, label] of [[source, 'source'], [target, 'target']]) {
      db.prepare('INSERT INTO _emdash_menus (id,name,label,locale) VALUES (?,?,?,?)').run(`${label}-menu`, `${label}-menu`, label, 'en');
      db.prepare("INSERT INTO _emdash_menu_items (id,menu_id,type,custom_url,label,locale) VALUES (?,?,'custom',?,?,?)").run(`${label}-item`, `${label}-menu`, `/${label}`, label, 'en');
    }
    source.exec("UPDATE ec_posts SET title='Imported fixture post' WHERE id=(SELECT id FROM ec_posts LIMIT 1)");
    source.exec("UPDATE ap_email_events SET enabled=0 WHERE event_type=(SELECT event_type FROM ap_email_events LIMIT 1)");
    source.exec("UPDATE ap_asset_records SET display_name='Imported fixture asset' WHERE asset_id=(SELECT asset_id FROM ap_asset_records LIMIT 1)");
    for (const table of ['ap_report_products','ap_shop_products','ap_astrologers']) {
      const column = table === 'ap_astrologers' ? 'rate_cents' : 'price_cents';
      source.exec(`UPDATE ${table} SET ${column}=${column}+1 WHERE id=(SELECT id FROM ${table} LIMIT 1)`);
    }
    source.exec("UPDATE ap_business_settings SET value_json=json_set(value_json,'$.fixture','source') WHERE key='site'");
    target.prepare('INSERT INTO ap_business_settings(key,value_json,updated_at) VALUES (?,?,?)').run('unrelated_fixture', '{"value":"preserved"}', '2026-01-01T00:00:00Z');
    const identity = { templateCommitSha: 'a'.repeat(40), migrationDigest: evidence.migrationDigest };
    const options = db => ({ env: { DB: adapter(db) }, identity, blobs: { verify: async () => true } });
    const envelope = await exportWorkspaceAuthoredState(options(source));
    assert.equal(envelope.domains.length, 6);
    for (const domain of envelope.domains) assert.ok(Object.values(domain.payload.tables).some(rows => rows.length), `nonempty ${domain.kind}`);
    await run({ source, target, envelope, options });
  } finally { source?.close(); target?.close(); rmSync(directory, { recursive: true, force: true }); }
}

test('imports all six authored domains into a nonempty SQLite destination with foreign keys', async () => {
  await fixture(async ({ target, envelope, options }) => {
    const imported = await importWorkspaceAuthoredState({ ...options(target), envelope });
    assert.equal(imported.idempotent, false);
    const after = await exportWorkspaceAuthoredState(options(target));
    assert.deepEqual(after.domains, envelope.domains);
    assert.deepEqual(after.blobs, envelope.blobs);
    assert.equal(after.authoredRevision, envelope.authoredRevision);
    assert.deepEqual(target.prepare('PRAGMA foreign_key_check').all(), []);
    assert.equal(target.prepare("SELECT value_json FROM ap_business_settings WHERE key='unrelated_fixture'").get().value_json, '{"value":"preserved"}');
    assert.equal((await importWorkspaceAuthoredState({ ...options(target), envelope })).idempotent, true);
  });
});

test('a mid-import SQLite constraint failure rolls back all domains and import metadata', async () => {
  await fixture(async ({ target, envelope, options }) => {
    const before = await exportWorkspaceAuthoredState(options(target));
    target.exec("CREATE TRIGGER fixture_import_failure BEFORE INSERT ON ap_shop_products BEGIN SELECT RAISE(ABORT,'fixture import failure'); END");
    await assert.rejects(importWorkspaceAuthoredState({ ...options(target), envelope }), /fixture import failure/);
    const after = await exportWorkspaceAuthoredState(options(target));
    assert.deepEqual(after.domains, before.domains);
    assert.equal(after.authoredRevision, before.authoredRevision);
    assert.equal(target.prepare('SELECT imported_envelope_digest FROM ap_workspace_authored_state WHERE id=1').get().imported_envelope_digest, null);
    assert.deepEqual(target.prepare('PRAGMA foreign_key_check').all(), []);
  });
});
