CREATE TABLE IF NOT EXISTS ap_chart_readings (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  profile_id TEXT,
  reading_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'ready',
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  input_json TEXT NOT NULL DEFAULT '{}',
  result_json TEXT NOT NULL DEFAULT '{}',
  provider_payload_json TEXT,
  provider_response_json TEXT,
  failure_message TEXT,
  generated_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts (id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles (id)
);

CREATE INDEX IF NOT EXISTS idx_ap_chart_readings_account
  ON ap_chart_readings (account_id, reading_type, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ap_chart_readings_profile
  ON ap_chart_readings (profile_id, reading_type, updated_at DESC);
