CREATE TABLE IF NOT EXISTS ap_wallets (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  CHECK (balance_cents >= 0),
  CHECK (currency = 'USD')
);

CREATE TABLE IF NOT EXISTS ap_wallet_recharges (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  wallet_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  credit_cents INTEGER NOT NULL,
  bonus_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  offer_id TEXT,
  request_key TEXT NOT NULL,
  payment_state TEXT NOT NULL DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (wallet_id) REFERENCES ap_wallets(id),
  UNIQUE (account_id, request_key),
  CHECK (amount_cents BETWEEN 2000 AND 500000),
  CHECK (credit_cents >= amount_cents),
  CHECK (bonus_cents = credit_cents - amount_cents),
  CHECK (currency = 'USD'),
  CHECK (payment_state IN ('pending', 'paid', 'failed', 'cancelled', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_ap_wallet_recharges_account
  ON ap_wallet_recharges(account_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_wallet_recharges_checkout
  ON ap_wallet_recharges(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS ap_wallet_transactions (
  id TEXT PRIMARY KEY,
  wallet_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  recharge_id TEXT UNIQUE,
  transaction_type TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  balance_after_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES ap_wallets(id),
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (recharge_id) REFERENCES ap_wallet_recharges(id),
  CHECK (currency = 'USD'),
  CHECK (transaction_type IN ('recharge', 'chat_debit', 'refund')),
  CHECK (balance_after_cents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_ap_wallet_transactions_account
  ON ap_wallet_transactions(account_id, created_at DESC);
