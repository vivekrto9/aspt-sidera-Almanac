-- The session setup collection is already at SQLite's column limit. Keep the
-- chat history workspace copy in its own bounded Content Studio collection.
CREATE TABLE IF NOT EXISTS ec_site_astrologers_chat_history (
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
  live_history_title TEXT,
  live_new_chat TEXT,
  live_open_history TEXT,
  live_close_history TEXT,
  live_no_history TEXT,
  live_session_ended TEXT,
  UNIQUE(slug, locale)
);
