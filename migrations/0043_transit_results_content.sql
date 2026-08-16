CREATE TABLE IF NOT EXISTS ec_site_transit_results (
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

ALTER TABLE ec_site_transit_results ADD COLUMN results_eyebrow TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_title_prefix TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_natal_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_viewing_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_today_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_moving_now_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_chart_title TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_chart_description TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_natal_legend TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_transiting_legend TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_active_title TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_count_suffix TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_applying_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_separating_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_conjunction_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_harmonious_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_challenging_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_no_aspects_title TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_no_aspects_body TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_previous_day_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_next_day_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_range_label TEXT;
ALTER TABLE ec_site_transit_results ADD COLUMN results_new_transit_label TEXT;
