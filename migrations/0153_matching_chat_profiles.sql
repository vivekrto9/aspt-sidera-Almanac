ALTER TABLE ap_wallet_chat_sessions
  ADD COLUMN partner_profile_id TEXT
  REFERENCES ap_customer_user_profiles(id);

CREATE INDEX IF NOT EXISTS idx_ap_wallet_chat_sessions_partner_profile
  ON ap_wallet_chat_sessions(partner_profile_id, updated_at DESC);
