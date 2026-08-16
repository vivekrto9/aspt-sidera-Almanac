-- Materialize FAQ contact CTA fields for existing and fresh databases.
CREATE TABLE IF NOT EXISTS ec_site_faq (
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
  faq_intro_eyebrow TEXT,
  faq_intro_title_lead TEXT,
  faq_intro_title_emphasis TEXT,
  faq_intro_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_canonical_path TEXT,
  seo_robots TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_image_alt TEXT,
  twitter_card TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  UNIQUE(slug, locale)
);

ALTER TABLE ec_site_faq ADD COLUMN faq_contact_title TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_contact_description TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_contact_action TEXT;
