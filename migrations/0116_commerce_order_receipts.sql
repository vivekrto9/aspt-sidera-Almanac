CREATE TABLE IF NOT EXISTS ap_commerce_order_notifications (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  FOREIGN KEY (order_id) REFERENCES ap_commerce_orders(id) ON DELETE CASCADE,
  UNIQUE(order_id, event_type),
  CHECK (status IN ('sending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_ap_commerce_order_notifications_status
  ON ap_commerce_order_notifications(status, updated_at);

INSERT OR IGNORE INTO ap_email_events (
  event_type, audience, email_type, enabled, schedule_json, updated_at
) VALUES (
  'commerce.order_paid', 'customer', 'transactional', 1, '{}', CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO ap_email_variable_mappings (
  variable_key, source_type, source_path, enabled, updated_at
) VALUES
  ('orderNumber', 'event_payload', 'orderNumber', 1, CURRENT_TIMESTAMP),
  ('orderTotal', 'event_payload', 'orderTotal', 1, CURRENT_TIMESTAMP),
  ('orderItems', 'event_payload', 'orderItems', 1, CURRENT_TIMESTAMP),
  ('accountUrl', 'generated_url', 'urls.account', 1, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO ap_email_templates (
  key, display_name, event_type, audience, locale, channel, enabled, subject,
  preheader, html_body, text_body, required_variables_json,
  sample_payload_json, updated_by, updated_at
) VALUES (
  'commerce_order_paid_customer_en',
  'Commerce order paid',
  'commerce.order_paid',
  'customer',
  'en',
  'email',
  1,
  'Payment confirmed for {{orderNumber}}',
  'Your Sidera order is confirmed.',
  '<p>Hello {{customerName}},</p><p>We received {{orderTotal}} for order <strong>{{orderNumber}}</strong>.</p><p>{{orderItems}}</p><p>You can follow its status in <a href="{{accountUrl}}">your Sidera account</a>.</p><p>{{supportFooter}}</p>',
  'Hello {{customerName}}, we received {{orderTotal}} for order {{orderNumber}}. Items: {{orderItems}}. Follow its status: {{accountUrl}}. {{supportFooter}}',
  '["customerName","orderNumber","orderTotal","orderItems","accountUrl","supportFooter"]',
  '{"customerName":"Asha","orderNumber":"SD-EXAMPLE","orderTotal":"$29.00","orderItems":"Natal Blueprint × 1","accountUrl":"https://example.com/account#orders","supportFooter":"For support, reply to this email."}',
  'system',
  CURRENT_TIMESTAMP
);
