ALTER TABLE ap_customer_accounts ADD COLUMN house_system TEXT NOT NULL DEFAULT 'placidus';
ALTER TABLE ap_customer_accounts ADD COLUMN zodiac_system TEXT NOT NULL DEFAULT 'tropical';
ALTER TABLE ap_customer_accounts ADD COLUMN daily_horoscope INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS ap_customer_user_profiles (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  request_key TEXT,
  profile_name TEXT NOT NULL,
  relation TEXT,
  gender TEXT,
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  place_id TEXT,
  place_lat REAL NOT NULL,
  place_lon REAL NOT NULL,
  place_timezone TEXT NOT NULL,
  timezone_offset TEXT,
  notes TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_ap_customer_user_profiles_account
  ON ap_customer_user_profiles(account_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_customer_user_profiles_default
  ON ap_customer_user_profiles(account_id) WHERE is_default = 1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_customer_user_profiles_request_key
  ON ap_customer_user_profiles(account_id, request_key) WHERE request_key IS NOT NULL;
