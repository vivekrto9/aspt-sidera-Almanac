CREATE TABLE IF NOT EXISTS ec_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id TEXT,
  primary_byline_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  scheduled_at TEXT,
  deleted_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  live_revision_id TEXT,
  draft_revision_id TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  translation_group TEXT,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  content JSON,
  featured_image TEXT,
  author TEXT,
  category TEXT,
  read_time TEXT,
  tags JSON,
  related JSON,
  UNIQUE(slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_ec_posts_status_published
  ON ec_posts(status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_ec_posts_locale_slug
  ON ec_posts(locale, slug);
