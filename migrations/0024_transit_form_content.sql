CREATE TABLE IF NOT EXISTS ec_site_transit (
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

ALTER TABLE ec_site_transit ADD COLUMN panel_kicker TEXT;
ALTER TABLE ec_site_transit ADD COLUMN panel_title_accent TEXT;
ALTER TABLE ec_site_transit ADD COLUMN panel_title_rest TEXT;
ALTER TABLE ec_site_transit ADD COLUMN panel_description TEXT;
ALTER TABLE ec_site_transit ADD COLUMN progress_step TEXT;
ALTER TABLE ec_site_transit ADD COLUMN progress_of TEXT;
ALTER TABLE ec_site_transit ADD COLUMN step_chart_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN step_chart_hint TEXT;
ALTER TABLE ec_site_transit ADD COLUMN step_date_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN step_date_hint TEXT;
ALTER TABLE ec_site_transit ADD COLUMN chart_kicker TEXT;
ALTER TABLE ec_site_transit ADD COLUMN chart_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN chart_body TEXT;
ALTER TABLE ec_site_transit ADD COLUMN profile_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN birth_date_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN month_field_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN day_field_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN year_field_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN time_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN hour_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN minute_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN period_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN unknown_time_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN unknown_time_description TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_placeholder TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_start TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_searching TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_empty TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_unavailable TEXT;
ALTER TABLE ec_site_transit ADD COLUMN location_selected TEXT;
ALTER TABLE ec_site_transit ADD COLUMN date_kicker TEXT;
ALTER TABLE ec_site_transit ADD COLUMN date_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN date_body TEXT;
ALTER TABLE ec_site_transit ADD COLUMN transit_date_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN today_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN tomorrow_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN week_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN month_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN back_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN continue_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN cast_label TEXT;
ALTER TABLE ec_site_transit ADD COLUMN seo_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN seo_description TEXT;
ALTER TABLE ec_site_transit ADD COLUMN seo_canonical_path TEXT;
ALTER TABLE ec_site_transit ADD COLUMN seo_robots TEXT;
ALTER TABLE ec_site_transit ADD COLUMN og_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN og_description TEXT;
ALTER TABLE ec_site_transit ADD COLUMN og_image TEXT;
ALTER TABLE ec_site_transit ADD COLUMN og_image_alt TEXT;
ALTER TABLE ec_site_transit ADD COLUMN twitter_card TEXT;
ALTER TABLE ec_site_transit ADD COLUMN twitter_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN twitter_description TEXT;
ALTER TABLE ec_site_transit ADD COLUMN twitter_image TEXT;
