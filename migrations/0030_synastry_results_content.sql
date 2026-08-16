-- Materialize Synastry Results static copy for initialized local databases.
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

ALTER TABLE ec_site_synastry ADD COLUMN results_resonance_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_verdict_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_chart_title TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_chart_description TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_inner_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_outer_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_aspect_kicker TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_aspect_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_theme_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_orb_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_contacts_title TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_conjunction_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_harmonious_label TEXT;
ALTER TABLE ec_site_synastry ADD COLUMN results_challenging_label TEXT;
