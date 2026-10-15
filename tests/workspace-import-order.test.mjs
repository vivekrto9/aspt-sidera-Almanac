import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { authoredImportOrder } from '../src/server/generated-site/workspace-state/import-order.ts';

function schema(sql, names) {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys=ON'); db.exec(sql);
  const tables = names.map(name => ({ name, columns: ['id'], keys: ['id'] }));
  return { db, tables, keys: tables.map(table => db.prepare(`PRAGMA foreign_key_list("${table.name}")`).all()) };
}
test('schema dependencies cover every selected table and respect immediate RESTRICT/CASCADE', () => {
  const { db, tables, keys } = schema('CREATE TABLE parent(id PRIMARY KEY); CREATE TABLE child(id PRIMARY KEY,parent_id REFERENCES parent(id) ON DELETE RESTRICT); CREATE TABLE leaf(id PRIMARY KEY,child_id REFERENCES child(id) ON DELETE CASCADE); CREATE TABLE business(id PRIMARY KEY);', ['leaf','business','child','parent']);
  try {
    const order = authoredImportOrder(tables, keys).map(table => table.name);
    assert.deepEqual(new Set(order), new Set(['leaf','business','child','parent']));
    assert.ok(order.indexOf('parent') < order.indexOf('child'));
    assert.ok(order.indexOf('child') < order.indexOf('leaf'));
    db.exec('INSERT INTO parent VALUES(1); INSERT INTO child VALUES(1,1); INSERT INTO leaf VALUES(1,1); INSERT INTO business VALUES(1); BEGIN');
    for (const table of [...order].reverse()) db.exec(`DELETE FROM "${table}"`);
    db.exec('COMMIT');
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  } finally { db.close(); }
});
test('a deferred NO ACTION cycle imports atomically with foreign keys enabled', () => {
  const { db, tables, keys } = schema('CREATE TABLE a(id PRIMARY KEY,b_id REFERENCES b(id)); CREATE TABLE b(id PRIMARY KEY,a_id REFERENCES a(id));', ['b','a']);
  try {
    const order = authoredImportOrder(tables, keys);
    for (const id of [1,2]) {
      db.exec('BEGIN; PRAGMA defer_foreign_keys=ON');
      for (const table of [...order].reverse()) db.exec(`DELETE FROM "${table.name}"`);
      for (const table of order) db.prepare(`INSERT INTO "${table.name}" VALUES(?,?)`).run(id,id);
      db.exec('COMMIT');
    }
    assert.equal(db.prepare('SELECT id FROM a').get().id, 2);
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  } finally { db.close(); }
});
test('an immediate cross-table cycle and a self RESTRICT cycle fail before mutation', () => {
  for (const definition of ['CREATE TABLE a(id PRIMARY KEY,b_id REFERENCES b(id) ON DELETE CASCADE); CREATE TABLE b(id PRIMARY KEY,a_id REFERENCES a(id));','CREATE TABLE a(id PRIMARY KEY,parent_id REFERENCES a(id) ON DELETE RESTRICT);']) {
    const names = definition.includes('CREATE TABLE b') ? ['a','b'] : ['a'];
    const { db, tables, keys } = schema(definition, names);
    try { assert.throws(() => authoredImportOrder(tables, keys), /Unsafe immediate authored foreign-key cycle/); }
    finally { db.close(); }
  }
});
test('missing dependency metadata or duplicate selected tables fail closed', () => {
  const selected = [{ name: 'a', columns: ['id'], keys: ['id'] }];
  assert.throws(() => authoredImportOrder(selected, []), /incomplete or duplicated/);
  assert.throws(() => authoredImportOrder([...selected,...selected], [[],[]]), /incomplete or duplicated/);
});
