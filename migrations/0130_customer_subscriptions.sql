CREATE TABLE IF NOT EXISTS ap_customer_subscriptions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  current_period_start TEXT,
  current_period_end TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  canceled_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  CHECK (plan_id IN ('star', 'cosmos')),
  CHECK (status IN ('incomplete', 'trialing', 'active', 'past_due', 'unpaid', 'canceled')),
  CHECK (cancel_at_period_end IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_ap_customer_subscriptions_status
  ON ap_customer_subscriptions(status, current_period_end);

CREATE TABLE IF NOT EXISTS ap_subscription_checkout_attempts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created',
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_checkout_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  CHECK (plan_id IN ('star', 'cosmos')),
  CHECK (amount_cents > 0),
  CHECK (status IN ('created', 'checkout_created', 'confirmed', 'failed', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_ap_subscription_attempts_account
  ON ap_subscription_checkout_attempts(account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS ap_subscription_events (
  id TEXT PRIMARY KEY,
  provider_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  account_id TEXT,
  stripe_subscription_id TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ap_subscription_events_subscription
  ON ap_subscription_events(stripe_subscription_id, created_at DESC);
