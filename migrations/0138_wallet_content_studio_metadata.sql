-- Complete the EmDash lifecycle columns for the wallet collection created in 0137.
ALTER TABLE ec_site_wallet ADD COLUMN slug TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN status TEXT DEFAULT 'draft';
ALTER TABLE ec_site_wallet ADD COLUMN author_id TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN primary_byline_id TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN published_at TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN scheduled_at TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN deleted_at TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE ec_site_wallet ADD COLUMN live_revision_id TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN draft_revision_id TEXT;
ALTER TABLE ec_site_wallet ADD COLUMN translation_group TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ec_site_wallet_slug_locale
  ON ec_site_wallet(slug, locale);
