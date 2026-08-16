-- Materialize the Composite Chart Intro and SEO copy for fresh and existing databases.
CREATE TABLE IF NOT EXISTS ec_site_composite_chart (
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

ALTER TABLE ec_site_composite_chart ADD COLUMN intro_eyebrow TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN intro_title_accent TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN intro_title_rest TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN intro_description TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN seo_title TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN seo_description TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN seo_canonical_path TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN seo_robots TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN og_title TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN og_description TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN og_image TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN og_image_alt TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN twitter_card TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN twitter_title TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN twitter_description TEXT;
ALTER TABLE ec_site_composite_chart ADD COLUMN twitter_image TEXT;
