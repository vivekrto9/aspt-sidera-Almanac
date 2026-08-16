CREATE TABLE IF NOT EXISTS ap_commerce_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  account_id TEXT NOT NULL,
  order_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  fulfillment_status TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address_json TEXT,
  profile_id TEXT,
  report_slug TEXT,
  request_key TEXT NOT NULL,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  report_download_url TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles(id),
  CHECK (order_type IN ('shop', 'report')),
  CHECK (status IN ('pending_payment', 'paid', 'cancelled', 'expired', 'refunded')),
  CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'generation_pending', 'generating', 'ready', 'failed')),
  CHECK (subtotal_cents >= 0 AND shipping_cents >= 0 AND tax_cents >= 0 AND total_cents > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_commerce_orders_request
  ON ap_commerce_orders(account_id, request_key);
CREATE INDEX IF NOT EXISTS idx_ap_commerce_orders_account
  ON ap_commerce_orders(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ap_commerce_orders_status
  ON ap_commerce_orders(status, fulfillment_status, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_commerce_orders_checkout
  ON ap_commerce_orders(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS ap_commerce_order_lines (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_kind TEXT NOT NULL,
  variant_label TEXT,
  quantity INTEGER NOT NULL,
  unit_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  image_url TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES ap_commerce_orders(id) ON DELETE CASCADE,
  CHECK (product_kind IN ('shop', 'report')),
  CHECK (quantity BETWEEN 1 AND 99),
  CHECK (unit_cents >= 0 AND total_cents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_ap_commerce_order_lines_order
  ON ap_commerce_order_lines(order_id, created_at ASC);
