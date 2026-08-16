-- Materialize Birth Chart Results copy for existing and fresh local databases.
CREATE TABLE IF NOT EXISTS ec_site_birth_chart_results (
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

ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_eyebrow TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_unknown_time_notice TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_sun_role TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_sun_blurb TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_moon_role TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_moon_blurb TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_rising_role TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_rising_blurb TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_reading_kicker TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_sign_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_house_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_element_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_positions_title TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_zodiac_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_body_header TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_sign_header TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_degree_header TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_house_header TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_aspects_title TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_found_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_conjunction_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_harmonious_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN results_challenging_label TEXT;
