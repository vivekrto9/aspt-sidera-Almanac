CREATE TABLE IF NOT EXISTS ap_session_entitlements (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  astrologer_slug TEXT NOT NULL,
  session_type TEXT NOT NULL,
  delivery_mode TEXT NOT NULL,
  duration_minutes INTEGER,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending_payment',
  request_key TEXT NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  paid_at TEXT,
  reserved_at TEXT,
  consumed_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  CHECK (session_type IN ('chat', 'written')),
  CHECK (delivery_mode IN ('now', 'scheduled')),
  CHECK (status IN ('pending_payment', 'paid', 'reserved', 'consumed', 'expired', 'cancelled', 'refunded')),
  CHECK (amount_cents > 0),
  CHECK (
    (session_type = 'chat' AND duration_minutes IN (15, 30, 45, 60)) OR
    (session_type = 'written' AND duration_minutes IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_session_entitlements_request
  ON ap_session_entitlements(account_id, request_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_session_entitlements_checkout
  ON ap_session_entitlements(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ap_session_entitlements_account
  ON ap_session_entitlements(account_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ap_session_entitlements_status
  ON ap_session_entitlements(status, expires_at);

CREATE TABLE IF NOT EXISTS ap_payment_attempts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  payable_type TEXT NOT NULL,
  payable_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_order_id TEXT,
  provider_payment_id TEXT,
  provider_checkout_url TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  CHECK (provider = 'stripe'),
  CHECK (status IN ('created', 'requires_action', 'paid', 'failed', 'expired', 'cancelled')),
  CHECK (amount_cents > 0)
);

CREATE INDEX IF NOT EXISTS idx_ap_payment_attempts_payable
  ON ap_payment_attempts(payable_type, payable_id, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_payment_attempts_provider_order
  ON ap_payment_attempts(provider, provider_order_id)
  WHERE provider_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS ap_payment_events (
  id TEXT PRIMARY KEY,
  payable_type TEXT NOT NULL,
  payable_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  status TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE(provider, provider_event_id),
  CHECK (provider = 'stripe'),
  CHECK (status IN ('paid', 'failed', 'expired', 'browser_verified'))
);

CREATE INDEX IF NOT EXISTS idx_ap_payment_events_payable
  ON ap_payment_events(payable_type, payable_id, created_at DESC);
