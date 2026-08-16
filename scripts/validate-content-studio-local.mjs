import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import {
  getBuilderEntryConfig,
  getBuilderReleaseTargets,
} from "../src/builder/registry.ts";
import { activeLocales } from "../src/data/localization-contract.ts";

const explicitDatabaseFlag = process.argv.indexOf("--database");
const explicitDatabase =
  explicitDatabaseFlag >= 0 ? process.argv[explicitDatabaseFlag + 1] : undefined;
const localD1Root = resolve(
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject",
);

const sqliteFiles = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sqliteFiles(path);
    return entry.isFile() && entry.name.endsWith(".sqlite") ? [path] : [];
  });
};

const candidates = explicitDatabase
  ? [resolve(explicitDatabase)]
  : sqliteFiles(localD1Root).filter((path) => !path.endsWith("/metadata.sqlite"));

const openContentDatabase = () => {
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const database = new DatabaseSync(path, { readOnly: true });
    const coreTables = database
      .prepare(
        `SELECT COUNT(*) AS count
         FROM sqlite_master
         WHERE type = 'table'
           AND name IN ('_emdash_collections', '_emdash_fields')`,
      )
      .get();
    if (coreTables.count === 2) return { database, path };
    database.close();
  }
  return undefined;
};

const opened = openContentDatabase();
if (!opened) {
  console.error("Content Studio local contract check failed:");
  console.error(
    "- No initialized local Content Studio D1 database was found. Apply local migrations and open the authorized Content Studio route before running this check.",
  );
  process.exit(1);
}

const { database, path: databasePath } = opened;
const failures = [];
const warnings = [];
const targets = getBuilderReleaseTargets();
const localeCodes = activeLocales.map((locale) => locale.code);
const collectionConfigs = new Map();

for (const target of targets) {
  const config = getBuilderEntryConfig(target.collection, target.entry);
  if (!config) {
    failures.push(
      `Builder target ${target.collection}/${target.entry} is not registered.`,
    );
    continue;
  }
  collectionConfigs.set(target.collection, config.collectionConfig);
}

for (const [collection, config] of collectionConfigs) {
  if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(config.label)) {
    failures.push(
      `Builder collection label "${config.label}" is not generated-type safe. Use ASCII letters, numbers, and spaces only; punctuation can produce an invalid emdash-env.d.ts interface.`,
    );
  }
  const table = `ec_${collection}`;
  const tableExists = database
    .prepare(
      "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    )
    .get(table);
  if (!tableExists) {
    warnings.push(
      `Physical table ${table} is missing for Builder collection ${collection}. Run the Content Studio bootstrap before browser verification.`,
    );
    continue;
  }

  const columns = new Set(
    database
      .prepare(`PRAGMA table_info("${table}")`)
      .all()
      .map((column) => column.name),
  );
  for (const field of config.fields) {
    if (!columns.has(field.slug)) {
      failures.push(
        `Physical column ${table}.${field.slug} is missing. Add and apply an explicit forward migration before testing Save draft.`,
      );
    }
  }

  const collectionRow = database
    .prepare(
      "SELECT id, label FROM _emdash_collections WHERE slug = ? LIMIT 1",
    )
    .get(collection);
  if (!collectionRow?.id) {
    warnings.push(
      `EmDash collection metadata is missing for ${collection}. Run the Content Studio bootstrap.`,
    );
    continue;
  }
  if (collectionRow.label !== config.label) {
    failures.push(
      `EmDash collection label mismatch for ${collection}: registry="${config.label}", database="${collectionRow.label}". Add and apply a forward metadata migration before regenerating emdash-env.d.ts.`,
    );
  }

  const metadataFields = new Set(
    database
      .prepare(
        "SELECT slug FROM _emdash_fields WHERE collection_id = ?",
      )
      .all(collectionRow.id)
      .map((field) => field.slug),
  );
  for (const field of config.fields) {
    if (!metadataFields.has(field.slug)) {
      warnings.push(
        `EmDash field metadata is missing for ${collection}.${field.slug}. Run the full Content Studio bootstrap before testing Save draft.`,
      );
    }
  }
}

for (const target of targets) {
  const table = `ec_${target.collection}`;
  const tableExists = database
    .prepare(
      "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    )
    .get(table);
  if (!tableExists) continue;

  const entries = new Set(
    database
      .prepare(`SELECT locale FROM "${table}" WHERE slug = ?`)
      .all(target.entry)
      .map((entry) => entry.locale),
  );
  for (const locale of localeCodes) {
    if (!entries.has(locale)) {
      warnings.push(
        `Builder entry ${target.collection}/${target.entry} is missing locale ${locale}. Run the Content Studio bootstrap.`,
      );
    }
  }
}

database.close();

if (warnings.length > 0) {
  console.warn(`Content Studio local contract warnings (${databasePath}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length > 0) {
  console.error(`Content Studio local contract check failed (${databasePath}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Content Studio local contract check passed: ${collectionConfigs.size} collections, ${targets.length} targets, ${localeCodes.length} locales (${databasePath})`,
);
