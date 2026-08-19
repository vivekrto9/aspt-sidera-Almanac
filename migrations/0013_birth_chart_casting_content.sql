-- Materialize Birth Chart casting fields for existing and fresh local databases.
CREATE TABLE IF NOT EXISTS ec_site_birth_chart (
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

ALTER TABLE ec_site_birth_chart ADD COLUMN casting_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN casting_status TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN casting_summary TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN panel_kicker TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN panel_title_accent TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN panel_title_rest TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN panel_description TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_date_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_date_hint TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_time_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_time_hint TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_place_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN step_place_hint TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN progress_step TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN progress_of TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN date_kicker TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN date_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN date_body TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN name_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN name_optional TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN name_placeholder TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN date_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN month_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN day_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN year_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN time_kicker TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN time_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN time_body TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN time_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN hour_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN minute_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN period_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN unknown_time_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN unknown_time_description TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN place_kicker TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN place_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN place_body TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_placeholder TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_start TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_searching TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_empty TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_unavailable TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN location_selected TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN house_system_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN house_system_help TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN house_placidus TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN house_whole_sign TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN house_equal TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN back_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN continue_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN cast_label TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN casting_unavailable TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN seo_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN seo_description TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN seo_canonical_path TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN seo_robots TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN og_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN og_description TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN og_image TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN og_image_alt TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN twitter_card TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN twitter_title TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN twitter_description TEXT;
ALTER TABLE ec_site_birth_chart ADD COLUMN twitter_image TEXT;
