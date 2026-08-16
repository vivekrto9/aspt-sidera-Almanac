-- Materialize Synastry overlaying-state copy for initialized local databases.
CREATE TABLE IF NOT EXISTS ec_site_synastry (
  id TEXT PRIMARY KEY,
  slug TEXT,
  status TEXT DEFAULT 'draft',
  author_id TEXT,
  primary_byline_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  published_at TEXT,
  scheduled_at TEXT,
  deleted_at TEXT,
  version INTEGER DEFAULT 1,
  live_revision_id TEXT,
  draft_revision_id TEXT,
  locale TEXT DEFAULT 'en' NOT NULL,
  translation_group TEXT,
  UNIQUE(slug, locale)
);

ALTER TABLE ec_site_synastry ADD COLUMN overlaying_title TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN overlaying_status TEXT;
