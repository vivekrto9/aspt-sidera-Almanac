-- Project-local preference. Existing valid choices are preserved.
INSERT OR IGNORE INTO ap_business_settings (key, value_json, updated_at)
VALUES ('payment_preference', '{"value":"AUTO","schemaVersion":1,"revision":1}', strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- Independent fixed catalog prices. Every INR value below is an explicit product
-- decision; no exchange-rate multiplication is used during seed or runtime.
ALTER TABLE ap_report_products ADD COLUMN price_inr_cents INTEGER CHECK(price_inr_cents >= 0);
ALTER TABLE ap_report_products ADD COLUMN price_usd_cents INTEGER CHECK(price_usd_cents >= 0);
UPDATE ap_report_products SET price_usd_cents = price_cents, price_inr_cents = CASE slug
 WHEN 'natal-blueprint' THEN 249900 WHEN 'year-ahead-forecast' THEN 299900
 WHEN 'relationship-synastry' THEN 349900 WHEN 'solar-return-report' THEN 229900
 WHEN 'career-vocation' THEN 279900 WHEN 'saturn-return-report' THEN 259900 END;
ALTER TABLE ap_shop_products ADD COLUMN price_inr_cents INTEGER CHECK(price_inr_cents >= 0);
ALTER TABLE ap_shop_products ADD COLUMN price_usd_cents INTEGER CHECK(price_usd_cents >= 0);
UPDATE ap_shop_products SET price_usd_cents = price_cents, price_inr_cents = CASE slug
 WHEN 'natal-print' THEN 399900 WHEN 'tapestry' THEN 549900 WHEN 'almanac' THEN 229900
 WHEN 'tarot' THEN 279900 WHEN 'notebook' THEN 149900 WHEN 'candle' THEN 179900
 WHEN 'scarf' THEN 499900 WHEN 'pins' THEN 129900 WHEN 'pendant' THEN 449900 END;
ALTER TABLE ap_astrologers ADD COLUMN rate_inr_cents INTEGER CHECK(rate_inr_cents >= 0);
ALTER TABLE ap_astrologers ADD COLUMN rate_usd_cents INTEGER CHECK(rate_usd_cents >= 0);
UPDATE ap_astrologers SET rate_usd_cents = rate_cents, rate_inr_cents = CASE slug
 WHEN 'mara-ellison' THEN 24900 WHEN 'devin-roy' THEN 21900 WHEN 'yuki-tanaka' THEN 34900
 WHEN 'priya-nair' THEN 23900 WHEN 'sol-marino' THEN 19900 WHEN 'amara-okafor' THEN 29900
 WHEN 'bran-kavanagh' THEN 17900 WHEN 'lena-fischer' THEN 27900 WHEN 'theo-alvarez' THEN 22900
 WHEN 'orion-hale' THEN 79900 WHEN 'selene-marlowe' THEN 39900 END;

CREATE TRIGGER ap_report_product_legacy_price_update AFTER UPDATE OF price_cents ON ap_report_products
WHEN NEW.price_cents IS NOT OLD.price_cents AND NEW.price_usd_cents IS OLD.price_usd_cents
BEGIN UPDATE ap_report_products SET price_usd_cents = NEW.price_cents WHERE id = NEW.id; END;
CREATE TRIGGER ap_shop_product_legacy_price_update AFTER UPDATE OF price_cents ON ap_shop_products
WHEN NEW.price_cents IS NOT OLD.price_cents AND NEW.price_usd_cents IS OLD.price_usd_cents
BEGIN UPDATE ap_shop_products SET price_usd_cents = NEW.price_cents WHERE id = NEW.id; END;
CREATE TRIGGER ap_astrologer_legacy_rate_update AFTER UPDATE OF rate_cents ON ap_astrologers
WHEN NEW.rate_cents IS NOT OLD.rate_cents AND NEW.rate_usd_cents IS OLD.rate_usd_cents
BEGIN UPDATE ap_astrologers SET rate_usd_cents = NEW.rate_cents WHERE id = NEW.id; END;
CREATE TRIGGER ap_report_product_usd_price_update AFTER UPDATE OF price_usd_cents ON ap_report_products
WHEN NEW.price_usd_cents IS NOT NULL AND NEW.price_cents IS NOT NEW.price_usd_cents
BEGIN UPDATE ap_report_products SET price_cents = NEW.price_usd_cents WHERE id = NEW.id; END;
CREATE TRIGGER ap_shop_product_usd_price_update AFTER UPDATE OF price_usd_cents ON ap_shop_products
WHEN NEW.price_usd_cents IS NOT NULL AND NEW.price_cents IS NOT NEW.price_usd_cents
BEGIN UPDATE ap_shop_products SET price_cents = NEW.price_usd_cents WHERE id = NEW.id; END;
CREATE TRIGGER ap_astrologer_usd_rate_update AFTER UPDATE OF rate_usd_cents ON ap_astrologers
WHEN NEW.rate_usd_cents IS NOT NULL AND NEW.rate_cents IS NOT NEW.rate_usd_cents
BEGIN UPDATE ap_astrologers SET rate_cents = NEW.rate_usd_cents WHERE id = NEW.id; END;

INSERT OR IGNORE INTO ap_business_settings(key,value_json,updated_at) VALUES
('wallet_pricing','{"USD":{"minimumCents":2000,"maximumCents":500000,"offers":[{"id":"wl_100","amountCents":10000,"creditCents":10000,"bonusCents":0},{"id":"wl_250","amountCents":25000,"creditCents":26500,"bonusCents":1500},{"id":"wl_500","amountCents":50000,"creditCents":55000,"bonusCents":5000},{"id":"wl_1000","amountCents":100000,"creditCents":115000,"bonusCents":15000}]},"INR":{"minimumCents":19900,"maximumCents":5000000,"offers":[{"id":"wl_100","amountCents":99900,"creditCents":99900,"bonusCents":0},{"id":"wl_250","amountCents":249900,"creditCents":274900,"bonusCents":25000},{"id":"wl_500","amountCents":499900,"creditCents":599900,"bonusCents":100000},{"id":"wl_1000","amountCents":999900,"creditCents":1249900,"bonusCents":250000}]}}',strftime('%Y-%m-%dT%H:%M:%fZ','now')),
('session_pricing','{"USD":{"voiceAddonCents":60,"videoAddonCents":120,"writtenCents":1900},"INR":{"voiceAddonCents":4900,"videoAddonCents":9900,"writtenCents":149900}}',strftime('%Y-%m-%dT%H:%M:%fZ','now'));

-- Rebuild provider-constrained payment tables without changing saved rows.
CREATE TABLE ap_payment_attempts_v2 (
 id TEXT PRIMARY KEY, account_id TEXT NOT NULL, payable_type TEXT NOT NULL, payable_id TEXT NOT NULL,
 provider TEXT NOT NULL, provider_order_id TEXT, provider_payment_id TEXT, provider_checkout_url TEXT,
 amount_cents INTEGER NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL, idempotency_key TEXT NOT NULL UNIQUE,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY(account_id) REFERENCES ap_customer_accounts(id),
 CHECK(provider IN ('stripe','razorpay')), CHECK(status IN ('created','requires_action','paid','failed','expired','cancelled')),
 CHECK(amount_cents > 0), CHECK(currency IN ('USD','INR'))
);
INSERT INTO ap_payment_attempts_v2 SELECT * FROM ap_payment_attempts;
DROP TABLE ap_payment_attempts;
ALTER TABLE ap_payment_attempts_v2 RENAME TO ap_payment_attempts;
CREATE INDEX idx_ap_payment_attempts_payable ON ap_payment_attempts(payable_type, payable_id, updated_at DESC);
CREATE UNIQUE INDEX idx_ap_payment_attempts_provider_order ON ap_payment_attempts(provider, provider_order_id) WHERE provider_order_id IS NOT NULL;
CREATE TABLE ap_payment_events_v2 (
 id TEXT PRIMARY KEY, payable_type TEXT NOT NULL, payable_id TEXT NOT NULL, provider TEXT NOT NULL,
 provider_event_id TEXT NOT NULL, status TEXT NOT NULL, payload_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
 UNIQUE(provider,provider_event_id), CHECK(provider IN ('stripe','razorpay')),
 CHECK(status IN ('paid','failed','expired','browser_verified'))
);
INSERT INTO ap_payment_events_v2 SELECT * FROM ap_payment_events;
DROP TABLE ap_payment_events;
ALTER TABLE ap_payment_events_v2 RENAME TO ap_payment_events;
CREATE INDEX idx_ap_payment_events_payable ON ap_payment_events(payable_type, payable_id, created_at DESC);

-- One wallet per customer; preserve all legacy USD money while allowing INR locks.
CREATE TABLE ap_wallets_v2 (
 id TEXT PRIMARY KEY, account_id TEXT NOT NULL UNIQUE, balance_cents INTEGER NOT NULL DEFAULT 0,
 currency TEXT NOT NULL DEFAULT 'USD', currency_locked_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY(account_id) REFERENCES ap_customer_accounts(id), CHECK(balance_cents >= 0), CHECK(currency IN ('USD','INR'))
);
INSERT INTO ap_wallets_v2 SELECT id,account_id,balance_cents,currency,
 CASE WHEN balance_cents <> 0 OR EXISTS(SELECT 1 FROM ap_wallet_transactions t WHERE t.wallet_id=ap_wallets.id) OR EXISTS(SELECT 1 FROM ap_wallet_recharges r WHERE r.wallet_id=ap_wallets.id AND r.payment_state='paid') THEN updated_at END,
 created_at,updated_at FROM ap_wallets;
CREATE TABLE ap_wallet_recharges_v2 (
 id TEXT PRIMARY KEY, account_id TEXT NOT NULL, wallet_id TEXT NOT NULL, amount_cents INTEGER NOT NULL, credit_cents INTEGER NOT NULL,
 bonus_cents INTEGER NOT NULL DEFAULT 0, currency TEXT NOT NULL, offer_id TEXT, request_key TEXT NOT NULL, payment_state TEXT NOT NULL DEFAULT 'pending',
 stripe_checkout_session_id TEXT, stripe_payment_intent_id TEXT, paid_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY(account_id) REFERENCES ap_customer_accounts(id), FOREIGN KEY(wallet_id) REFERENCES ap_wallets_v2(id), UNIQUE(account_id,request_key),
 CHECK(amount_cents>0), CHECK(credit_cents>=amount_cents), CHECK(bonus_cents=credit_cents-amount_cents), CHECK(currency IN ('USD','INR')),
 CHECK(payment_state IN ('pending','paid','failed','cancelled','expired'))
);
INSERT INTO ap_wallet_recharges_v2 SELECT * FROM ap_wallet_recharges;
CREATE TABLE ap_wallet_transactions_v2 (
 id TEXT PRIMARY KEY, wallet_id TEXT NOT NULL, account_id TEXT NOT NULL, recharge_id TEXT UNIQUE, transaction_type TEXT NOT NULL,
 amount_cents INTEGER NOT NULL, balance_after_cents INTEGER NOT NULL, currency TEXT NOT NULL, description TEXT NOT NULL,
 metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
 FOREIGN KEY(wallet_id) REFERENCES ap_wallets_v2(id), FOREIGN KEY(account_id) REFERENCES ap_customer_accounts(id), FOREIGN KEY(recharge_id) REFERENCES ap_wallet_recharges_v2(id),
 CHECK(currency IN ('USD','INR')), CHECK(transaction_type IN ('recharge','chat_debit','refund')), CHECK(balance_after_cents>=0)
);
INSERT INTO ap_wallet_transactions_v2 SELECT * FROM ap_wallet_transactions;
DROP TABLE ap_wallet_transactions; DROP TABLE ap_wallet_recharges; DROP TABLE ap_wallets;
ALTER TABLE ap_wallets_v2 RENAME TO ap_wallets;
ALTER TABLE ap_wallet_recharges_v2 RENAME TO ap_wallet_recharges;
ALTER TABLE ap_wallet_transactions_v2 RENAME TO ap_wallet_transactions;
CREATE INDEX idx_ap_wallet_recharges_account ON ap_wallet_recharges(account_id,created_at DESC);
CREATE UNIQUE INDEX idx_ap_wallet_recharges_checkout ON ap_wallet_recharges(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX idx_ap_wallet_transactions_account ON ap_wallet_transactions(account_id,created_at DESC);
