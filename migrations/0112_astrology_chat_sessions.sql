CREATE TABLE IF NOT EXISTS ap_astrology_chat_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  entitlement_id TEXT NOT NULL UNIQUE,
  profile_id TEXT NOT NULL,
  astrologer_slug TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'astrologyapi',
  session_name TEXT NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  duration_minutes INTEGER,
  question_topic TEXT,
  written_question TEXT,
  started_at TEXT NOT NULL,
  ends_at TEXT,
  completed_at TEXT,
  send_lock_token TEXT,
  send_lock_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (entitlement_id) REFERENCES ap_session_entitlements(id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles(id),
  CHECK (session_type IN ('chat', 'written')),
  CHECK (status IN ('active', 'completed', 'cancelled')),
  CHECK (
    (session_type = 'chat' AND duration_minutes IN (15, 30, 45, 60) AND ends_at IS NOT NULL) OR
    (session_type = 'written' AND duration_minutes IS NULL AND ends_at IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_ap_astrology_chat_sessions_account
  ON ap_astrology_chat_sessions(account_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ap_astrology_chat_sessions_status
  ON ap_astrology_chat_sessions(status, ends_at);

CREATE TABLE IF NOT EXISTS ap_astrology_chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  provider_message_json TEXT,
  reply_to_message_id TEXT,
  client_request_key TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES ap_astrology_chat_sessions(id),
  CHECK (role IN ('user', 'assistant', 'system'))
);

CREATE INDEX IF NOT EXISTS idx_ap_astrology_chat_messages_session
  ON ap_astrology_chat_messages(session_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_astrology_chat_messages_request
  ON ap_astrology_chat_messages(session_id, client_request_key)
  WHERE client_request_key IS NOT NULL;
