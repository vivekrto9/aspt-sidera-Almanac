-- Preserve deployed migration history while updating the inherited site identity.
UPDATE ap_business_settings
SET
  value_json = json_set(value_json, '$.brandName', 'Sidera'),
  updated_at = '2026-07-28T00:00:00.000Z'
WHERE key = 'site';
