-- Product-approved fixed INR question prices for Sidera's two active chat
-- astrologers. USD rates and existing chat-session snapshots remain unchanged.
UPDATE ap_astrologers
SET rate_inr_cents = CASE slug
      WHEN 'orion-hale' THEN 15000
      WHEN 'selene-marlowe' THEN 10000
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('orion-hale', 'selene-marlowe');
