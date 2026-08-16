-- Retire the recurring-plan system after Sidera moved to wallet-only chat payments.
-- Historical migrations remain immutable; this forward migration removes their
-- runtime and Content Studio tables from both upgraded and fresh databases.
DROP TABLE IF EXISTS ap_subscription_events;
DROP TABLE IF EXISTS ap_subscription_checkout_attempts;
DROP TABLE IF EXISTS ap_customer_subscriptions;
DROP TABLE IF EXISTS ec_site_pricing;
ALTER TABLE ec_site_chrome DROP COLUMN footer_link_pricing;
