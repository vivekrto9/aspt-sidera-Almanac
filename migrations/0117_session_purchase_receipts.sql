CREATE TABLE IF NOT EXISTS ap_session_entitlement_notifications (
  id TEXT PRIMARY KEY,
  entitlement_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_message_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  FOREIGN KEY (entitlement_id) REFERENCES ap_session_entitlements(id) ON DELETE CASCADE,
  UNIQUE(entitlement_id, event_type),
  CHECK (status IN ('sending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_ap_session_entitlement_notifications_status
  ON ap_session_entitlement_notifications(status, updated_at);

INSERT OR IGNORE INTO ap_email_events (
  event_type, audience, email_type, enabled, schedule_json, updated_at
) VALUES (
  'session.payment_paid', 'customer', 'transactional', 1, '{}', CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO ap_email_variable_mappings (
  variable_key, source_type, source_path, enabled, updated_at
) VALUES
  ('sessionDescription', 'event_payload', 'sessionDescription', 1, CURRENT_TIMESTAMP),
  ('astrologerName', 'event_payload', 'astrologerName', 1, CURRENT_TIMESTAMP),
  ('sessionTotal', 'event_payload', 'sessionTotal', 1, CURRENT_TIMESTAMP),
  ('sessionsUrl', 'generated_url', 'urls.sessions', 1, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO ap_email_templates (
  key, display_name, event_type, audience, locale, channel, enabled, subject,
  preheader, html_body, text_body, required_variables_json,
  sample_payload_json, updated_by, updated_at
) VALUES (
  'session_payment_paid_customer_en',
  'Session payment paid',
  'session.payment_paid',
  'customer',
  'en',
  'email',
  1,
  'Your Sidera session is confirmed',
  'Your astrology session payment is confirmed.',
  '<p>Hello {{customerName}},</p><p>We received {{sessionTotal}} for {{sessionDescription}} with {{astrologerName}}.</p><p>Open <a href="{{sessionsUrl}}">your Sidera sessions</a> to continue.</p><p>{{supportFooter}}</p>',
  'Hello {{customerName}}, we received {{sessionTotal}} for {{sessionDescription}} with {{astrologerName}}. Continue: {{sessionsUrl}}. {{supportFooter}}',
  '["customerName","sessionDescription","astrologerName","sessionTotal","sessionsUrl","supportFooter"]',
  '{"customerName":"Asha","sessionDescription":"15-minute astrology chat","astrologerName":"Mara Ellison","sessionTotal":"$48.00","sessionsUrl":"https://example.com/account/sessions","supportFooter":"For support, reply to this email."}',
  'system',
  CURRENT_TIMESTAMP
);
