CREATE TABLE IF NOT EXISTS ap_astrologer_calendly_event_types (
  id TEXT PRIMARY KEY,
  astrologer_slug TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  event_type_uri TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (astrologer_slug) REFERENCES ap_astrologers(slug),
  CHECK (duration_minutes IN (15, 30, 45, 60)),
  UNIQUE(astrologer_slug, duration_minutes)
);

CREATE INDEX IF NOT EXISTS idx_ap_astrologer_calendly_event_types_active
  ON ap_astrologer_calendly_event_types(astrologer_slug, active, duration_minutes);

CREATE TABLE IF NOT EXISTS ap_scheduled_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  entitlement_id TEXT NOT NULL UNIQUE,
  profile_id TEXT NOT NULL,
  astrologer_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduling',
  duration_minutes INTEGER NOT NULL,
  event_type_uri TEXT NOT NULL,
  requested_start_at TEXT NOT NULL,
  scheduled_start_at TEXT,
  scheduled_end_at TEXT,
  invitee_timezone TEXT NOT NULL,
  calendly_event_uri TEXT,
  calendly_invitee_uri TEXT,
  calendly_cancel_url TEXT,
  calendly_reschedule_url TEXT,
  calendly_meeting_url TEXT,
  scheduling_last_error TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (entitlement_id) REFERENCES ap_session_entitlements(id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles(id),
  FOREIGN KEY (astrologer_slug) REFERENCES ap_astrologers(slug),
  CHECK (status IN ('scheduling', 'scheduled', 'action_required', 'cancelled', 'completed')),
  CHECK (duration_minutes IN (15, 30, 45, 60))
);

CREATE INDEX IF NOT EXISTS idx_ap_scheduled_sessions_account
  ON ap_scheduled_sessions(account_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ap_scheduled_sessions_status
  ON ap_scheduled_sessions(status, scheduled_start_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_scheduled_sessions_event
  ON ap_scheduled_sessions(calendly_event_uri)
  WHERE calendly_event_uri IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_scheduled_sessions_invitee
  ON ap_scheduled_sessions(calendly_invitee_uri)
  WHERE calendly_invitee_uri IS NOT NULL;

CREATE TABLE IF NOT EXISTS ap_calendly_events (
  id TEXT PRIMARY KEY,
  scheduled_session_id TEXT,
  provider_event_key TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (scheduled_session_id) REFERENCES ap_scheduled_sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_ap_calendly_events_session
  ON ap_calendly_events(scheduled_session_id, created_at DESC);
