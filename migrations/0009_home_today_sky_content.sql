-- Add the Home Today's Sky Content Studio fields to existing site page tables.
-- Fresh EmDash tables receive these columns from the Builder registry.
CREATE TABLE IF NOT EXISTS ec_site_pages (
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
  title TEXT NOT NULL DEFAULT '',
  feature_1_title TEXT,
  feature_1_body TEXT,
  feature_2_title TEXT,
  feature_2_body TEXT,
  feature_3_title TEXT,
  feature_3_body TEXT,
  footer_note TEXT,
  not_found_title TEXT,
  not_found_body TEXT,
  not_found_cta TEXT,
  seo_canonical_path TEXT,
  seo_robots TEXT,
  og_image TEXT,
  twitter_card TEXT,
  twitter_image TEXT,
  hero_kicker TEXT,
  hero_title TEXT,
  hero_body TEXT,
  hero_primary_cta TEXT,
  hero_secondary_cta TEXT,
  hero_proof_1 TEXT,
  hero_proof_2 TEXT,
  hero_proof_3 TEXT,
  hero_chart_title TEXT,
  hero_chart_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_alt TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  UNIQUE(slug, locale)
);

ALTER TABLE ec_site_pages ADD COLUMN today_sky_eyebrow TEXT;
ALTER TABLE ec_site_pages ADD COLUMN today_sky_title_accent TEXT;
ALTER TABLE ec_site_pages ADD COLUMN today_sky_title_rest TEXT;
ALTER TABLE ec_site_pages ADD COLUMN today_sky_metadata TEXT;
ALTER TABLE ec_site_pages ADD COLUMN today_sky_cta TEXT;
