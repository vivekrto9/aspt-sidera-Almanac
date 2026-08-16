CREATE TABLE IF NOT EXISTS ap_astrology_provider_cache (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  cache_key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  response_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'ready',
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_astrology_provider_cache_key
  ON ap_astrology_provider_cache (provider, endpoint, cache_key, locale);

CREATE INDEX IF NOT EXISTS idx_ap_astrology_provider_cache_expiry
  ON ap_astrology_provider_cache (status, expires_at);
