-- Preserve wallet-funded chat history while allowing the wallet's locked
-- denomination to flow into new chat sessions. Migration 0158 made wallets
-- dual-currency but the original chat-session constraint remained USD-only.
CREATE TABLE ap_wallet_chat_sessions_v2 (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  astrologer_slug TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'astrologyapi',
  session_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  client_request_key TEXT,
  completed_at TEXT,
  send_lock_token TEXT,
  send_lock_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  partner_profile_id TEXT,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles(id),
  FOREIGN KEY (partner_profile_id) REFERENCES ap_customer_user_profiles(id),
  FOREIGN KEY (astrologer_slug) REFERENCES ap_astrologers(slug),
  CHECK (status IN ('active', 'completed', 'cancelled')),
  CHECK (price_cents > 0),
  CHECK (currency IN ('USD', 'INR'))
);

INSERT INTO ap_wallet_chat_sessions_v2 (
  id, account_id, profile_id, astrologer_slug, provider, session_name,
  status, price_cents, currency, client_request_key, completed_at,
  send_lock_token, send_lock_expires_at, created_at, updated_at,
  partner_profile_id
)
SELECT
  id, account_id, profile_id, astrologer_slug, provider, session_name,
  status, price_cents, currency, client_request_key, completed_at,
  send_lock_token, send_lock_expires_at, created_at, updated_at,
  partner_profile_id
FROM ap_wallet_chat_sessions;

CREATE TABLE ap_wallet_chat_messages_v2 (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  provider_message_json TEXT,
  reply_to_message_id TEXT,
  client_request_key TEXT,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES ap_wallet_chat_sessions_v2(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_to_message_id) REFERENCES ap_wallet_chat_messages_v2(id),
  CHECK (role IN ('user', 'assistant', 'system')),
  CHECK (cost_cents >= 0)
);

INSERT INTO ap_wallet_chat_messages_v2 (
  id, session_id, role, message, provider_message_json,
  reply_to_message_id, client_request_key, cost_cents, created_at
)
SELECT
  id, session_id, role, message, provider_message_json,
  reply_to_message_id, client_request_key, cost_cents, created_at
FROM ap_wallet_chat_messages;

DROP TABLE ap_wallet_chat_messages;
DROP TABLE ap_wallet_chat_sessions;
ALTER TABLE ap_wallet_chat_sessions_v2 RENAME TO ap_wallet_chat_sessions;
ALTER TABLE ap_wallet_chat_messages_v2 RENAME TO ap_wallet_chat_messages;

CREATE INDEX idx_ap_wallet_chat_sessions_account
  ON ap_wallet_chat_sessions(account_id, updated_at DESC);
CREATE INDEX idx_ap_wallet_chat_sessions_status
  ON ap_wallet_chat_sessions(status, updated_at DESC);
CREATE UNIQUE INDEX idx_ap_wallet_chat_sessions_request
  ON ap_wallet_chat_sessions(account_id, client_request_key)
  WHERE client_request_key IS NOT NULL;
CREATE INDEX idx_ap_wallet_chat_sessions_partner_profile
  ON ap_wallet_chat_sessions(partner_profile_id, updated_at DESC);
CREATE INDEX idx_ap_wallet_chat_messages_session
  ON ap_wallet_chat_messages(session_id, created_at, id);
CREATE UNIQUE INDEX idx_ap_wallet_chat_messages_request
  ON ap_wallet_chat_messages(session_id, client_request_key)
  WHERE client_request_key IS NOT NULL;
