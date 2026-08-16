-- Materialize the FAQ accordion fields for existing and fresh local databases.
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

ALTER TABLE ec_site_faq ADD COLUMN faq_item_1_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_1_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_1_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_2_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_2_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_2_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_3_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_3_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_3_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_4_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_4_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_4_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_5_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_5_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_5_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_6_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_6_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_6_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_7_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_7_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_7_answer TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_8_category TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_8_question TEXT;
ALTER TABLE ec_site_faq ADD COLUMN faq_item_8_answer TEXT;
