-- Materialize the editable static copy in the Today's Sky date scrubber.
CREATE TABLE IF NOT EXISTS ec_site_todays_sky (
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

ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_eyebrow TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_today_action TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_today_marker TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN page_header_eyebrow TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN page_header_title_accent TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN page_header_title_suffix TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN page_header_meta_primary TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN page_header_meta_secondary TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN header_action_transits TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN seo_title TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN seo_description TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN seo_canonical_path TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN seo_robots TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN og_title TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN og_description TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN og_image TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN og_image_alt TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN twitter_card TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN twitter_title TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN twitter_description TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN twitter_image TEXT;
