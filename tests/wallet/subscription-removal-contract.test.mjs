import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("legacy Pricing traffic moves to the wallet-only experience", () => {
  const pricing = read("src/pages/pricing.astro");

  assert.match(pricing, /getLocaleFromUrl\(Astro\.request\.url\)/);
  assert.match(
    pricing,
    /Astro\.redirect\(localizePath\("\/wallet", locale\), 302\)/,
  );
  assert.doesNotMatch(pricing, /PricingTiers|subscription|checkout/i);
});

test("subscription UI, APIs, repository, and editable pricing content are retired", () => {
  for (const path of [
    "src/components/account/sections/AccountMembership.astro",
    "src/components/pricing/sections/PricingTiers.astro",
    "src/data/locale/account/sections/membership.ts",
    "src/data/locale/pricing/subscription-actions.ts",
    "src/pages/api/astropages/generated-site/subscriptions/checkout.ts",
    "src/pages/api/astropages/generated-site/subscriptions/confirm.ts",
    "src/pages/api/astropages/generated-site/subscriptions/manage.ts",
    "src/pages/api/astropages/generated-site/subscriptions/status.ts",
    "src/server/aggregator/customer-subscriptions.ts",
    "src/styles/account/sections/account-membership.css",
    "src/styles/pricing/sections/pricing-tiers.css",
  ]) {
    assert.equal(existsSync(new URL(path, root)), false, `${path} must stay retired`);
  }

  const registry = read("src/builder/registry.ts");
  const manifest = read("template.manifest.json");
  const footer = read("src/data/shared-footer-navigation.ts");
  assert.doesNotMatch(registry, /site_pricing|getPricingDefaults/);
  assert.doesNotMatch(manifest, /site_pricing\/pricing/);
  assert.doesNotMatch(footer, /footer_link_pricing|"\/pricing"/);
});

test("Stripe remains one-time-payment only and cleanup migration removes old tables", () => {
  const stripe = read("src/server/aggregator/payments/stripe.ts");
  const webhook = read(
    "src/pages/api/astropages/generated-site/webhooks/payment/stripe.ts",
  );
  const tables = read("src/server/aggregator/db/tables.ts");
  const migration = read("migrations/0142_retire_subscriptions.sql");

  assert.doesNotMatch(stripe, /StripeSubscription|mode", "subscription"|\/v1\/subscriptions/);
  assert.doesNotMatch(webhook, /customer\.subscription|sidera_subscription/);
  assert.doesNotMatch(tables, /customerSubscriptions|subscriptionCheckoutAttempts|subscriptionEvents/);
  for (const table of [
    "ap_subscription_events",
    "ap_subscription_checkout_attempts",
    "ap_customer_subscriptions",
    "ec_site_pricing",
  ]) {
    assert.match(migration, new RegExp(`DROP TABLE IF EXISTS ${table}`));
  }
  assert.match(
    migration,
    /ALTER TABLE ec_site_chrome DROP COLUMN footer_link_pricing/,
  );
  assert.match(stripe, /createStripeWalletCheckout/);
  assert.match(webhook, /wallet_recharge/);
});
