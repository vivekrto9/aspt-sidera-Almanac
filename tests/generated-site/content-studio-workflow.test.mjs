import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("parallel page sessions share one mandatory Content Studio error workflow", async () => {
  const [errorLog, tracker, checker, registry, emdashTypes] = await Promise.all(
    [
      read("CONTENT_STUDIO_ERROR_LOG.md"),
      read("PAGE_BUILD_TRACKER.md"),
      read("scripts/validate-content-studio-local.mjs"),
      read("src/builder/registry.ts"),
      read("emdash-env.d.ts"),
    ],
  );

  assert.match(errorLog, /\| ID \| STATUS \| ERROR \| ERROR CAUSE \| FIX \|/);
  assert.match(errorLog, /\| CS-001 \| `FIXED` \|/);
  assert.match(errorLog, /\| CS-002 \| `FIXED` \|/);
  assert.match(errorLog, /\| CS-003 \| `FIXED` \|/);
  assert.match(errorLog, /\| CS-004 \| `FIXED` \|/);
  assert.match(errorLog, /one-field and two-field save verification/i);
  assert.match(tracker, /node scripts\/validate-content-studio-local\.mjs/);
  assert.match(tracker, /CONTENT_STUDIO_ERROR_LOG\.md/);
  assert.match(
    checker,
    /Physical column \$\{table\}\.\$\{field\.slug\} is missing/,
  );
  assert.match(checker, /EmDash field metadata is missing/);
  assert.match(checker, /not generated-type safe/);
  assert.match(registry, /"Today Sky Content"/);
  assert.doesNotMatch(registry, /"Today's Sky Content"/);
  assert.match(emdashTypes, /export interface TodaySkyContent/);
  assert.doesNotMatch(emdashTypes, /interface Today'sSkyContent/);
});

test("parallel shared Content Studio fields have a fresh-safe forward migration", async () => {
  const [homeMigration, parallelMigration, labelMigration] = await Promise.all([
    read("migrations/0009_home_today_sky_content.sql"),
    read("migrations/0010_content_studio_parallel_page_fields.sql"),
    read("migrations/0011_content_studio_safe_collection_labels.sql"),
  ]);
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(homeMigration);
  sqlite.exec(parallelMigration);

  const sitePageColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_pages)")
      .all()
      .map((column) => column.name),
  );
  const chromeColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_chrome)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "terms_legal_eyebrow",
    "terms_title",
    "terms_updated_label",
  ]) {
    assert.equal(sitePageColumns.has(field), true, `${field} was not migrated`);
  }
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.equal(
      chromeColumns.has(`language_option_${locale}_label`),
      true,
      `language_option_${locale}_label was not migrated`,
    );
  }

  sqlite.close();

  const metadataSqlite = new DatabaseSync(":memory:");
  metadataSqlite.exec(`
    CREATE TABLE _emdash_collections (
      slug TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      label_singular TEXT,
      updated_at TEXT
    );
    INSERT INTO _emdash_collections (slug, label, label_singular)
    VALUES ('site_todays_sky', 'Today''s Sky Content', 'Today''s Sky Content');
  `);
  metadataSqlite.exec(labelMigration);
  const migratedLabel = metadataSqlite
    .prepare(
      "SELECT label, label_singular FROM _emdash_collections WHERE slug = 'site_todays_sky'",
    )
    .get();

  assert.equal(migratedLabel.label, "Today Sky Content");
  assert.equal(migratedLabel.label_singular, "Today Sky Content");
  metadataSqlite.close();
});

test("Blog and Shop are independent localized Site Chrome fields", async () => {
  const migration = await read("migrations/0131_header_blog_shop_content.sql");
  const localizationMigration = await read(
    "migrations/0132_localize_header_blog_label.sql",
  );
  const legacyLabelMigration = await read(
    "migrations/0133_replace_legacy_learn_blog_labels.sql",
  );
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(`
    CREATE TABLE ec_site_chrome (
      id TEXT PRIMARY KEY,
      locale TEXT NOT NULL,
      nav_learn TEXT
    );
    INSERT INTO ec_site_chrome (id, locale, nav_learn) VALUES
      ('main:en', 'en', 'Stories'),
      ('default:en', 'en', 'Learn'),
      ('main:es', 'es', 'Aprender'),
      ('main:ru', 'ru', 'Материалы');
  `);
  sqlite.exec(migration);
  sqlite.exec(localizationMigration);
  sqlite.exec(legacyLabelMigration);

  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_chrome)")
      .all()
      .map((column) => column.name),
  );
  assert.equal(columns.has("nav_blog"), true);
  assert.equal(columns.has("nav_shop"), true);

  const rows = sqlite
    .prepare(
      "SELECT locale, nav_blog, nav_shop FROM ec_site_chrome ORDER BY locale, nav_blog",
    )
    .all()
    .map((row) => ({ ...row }));
  assert.deepEqual(rows, [
    { locale: "en", nav_blog: "Blog", nav_shop: "Shop" },
    { locale: "en", nav_blog: "Stories", nav_shop: "Shop" },
    { locale: "es", nav_blog: "Artículos", nav_shop: "Tienda" },
    { locale: "ru", nav_blog: "Статьи", nav_shop: "Магазин" },
  ]);

  sqlite.close();
});

test("Header More is a localized Site Chrome field", async () => {
  const migration = await read("migrations/0135_header_more_label.sql");
  const sqlite = new DatabaseSync(":memory:");

  sqlite.exec(`
    CREATE TABLE ec_site_chrome (
      id TEXT PRIMARY KEY,
      locale TEXT NOT NULL
    );
    INSERT INTO ec_site_chrome (id, locale) VALUES
      ('main:en', 'en'),
      ('main:es', 'es'),
      ('main:fr', 'fr'),
      ('main:pt', 'pt'),
      ('main:ru', 'ru'),
      ('main:it', 'it'),
      ('main:de', 'de');
  `);
  sqlite.exec(migration);

  assert.equal(
    sqlite
      .prepare("PRAGMA table_info(ec_site_chrome)")
      .all()
      .some((column) => column.name === "nav_more"),
    true,
  );
  assert.deepEqual(
    sqlite
      .prepare("SELECT locale, nav_more FROM ec_site_chrome ORDER BY locale")
      .all()
      .map((row) => ({ ...row })),
    [
      { locale: "de", nav_more: "Mehr" },
      { locale: "en", nav_more: "More" },
      { locale: "es", nav_more: "Más" },
      { locale: "fr", nav_more: "Plus" },
      { locale: "it", nav_more: "Altro" },
      { locale: "pt", nav_more: "Mais" },
      { locale: "ru", nav_more: "Ещё" },
    ],
  );

  sqlite.close();
});
