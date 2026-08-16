CREATE TABLE IF NOT EXISTS ec_site_transit (
  id TEXT NOT NULL,
  locale TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  data TEXT,
  PRIMARY KEY (id, locale)
);

ALTER TABLE ec_site_transit ADD COLUMN casting_title TEXT;
ALTER TABLE ec_site_transit ADD COLUMN casting_status TEXT;
ALTER TABLE ec_site_transit ADD COLUMN casting_summary TEXT;
