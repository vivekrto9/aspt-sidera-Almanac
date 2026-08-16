-- Materialize shared-collection fields registered by parallel page sessions.
-- New standalone page collections are created by the explicit EmDash bootstrap.
CREATE TABLE IF NOT EXISTS ec_site_chrome (
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
  nav_home TEXT,
  footer_brand_name TEXT,
  footer_about TEXT,
  brand_name TEXT,
  brand_aria_label TEXT,
  primary_navigation_label TEXT,
  nav_todays_sky TEXT,
  nav_charts TEXT,
  nav_compatibility TEXT,
  nav_moon TEXT,
  nav_horoscope TEXT,
  nav_astrologers TEXT,
  nav_learn TEXT,
  action_sign_in TEXT,
  action_get_chart TEXT,
  language_trigger_label TEXT,
  language_menu_label TEXT,
  menu_open_label TEXT,
  menu_close_label TEXT,
  UNIQUE(slug, locale)
);

ALTER TABLE ec_site_chrome ADD COLUMN language_option_en_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_es_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_fr_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_pt_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_ru_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_it_label TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN language_option_de_label TEXT;

ALTER TABLE ec_site_pages ADD COLUMN terms_legal_eyebrow TEXT;
ALTER TABLE ec_site_pages ADD COLUMN terms_title TEXT;
ALTER TABLE ec_site_pages ADD COLUMN terms_updated_label TEXT;
