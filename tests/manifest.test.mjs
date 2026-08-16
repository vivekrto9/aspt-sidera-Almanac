import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const manifest = JSON.parse(readFileSync(new URL("../template.manifest.json", import.meta.url), "utf8"));
const analyticsManifest = JSON.parse(readFileSync(new URL("../astropages/analytics.manifest.json", import.meta.url), "utf8"));
const leadsManifest = JSON.parse(readFileSync(new URL("../astropages/leads.manifest.json", import.meta.url), "utf8"));

const routePaths = (items) => new Set(items.map((item) => item.path));

test("template manifest keeps Sidera Almanac identity", () => {
  assert.equal(manifest.templateKey, "sidera-almanac");
  assert.equal(manifest.displayName, "Sidera Almanac");
  assert.equal(Object.hasOwn(manifest, "version"), false);
  assert.equal(Object.hasOwn(manifest, "registryVersionId"), false);
  assert.equal(manifest.analytics.required, true);
  assert.equal(manifest.analytics.path, "astropages/analytics.manifest.json");
  assert.equal(manifest.leads.required, true);
  assert.equal(manifest.leads.path, "astropages/leads.manifest.json");
});

test("manifest declares reusable generated-site APIs and Sidera visitor routes", () => {
  const visitorRoutes = routePaths(manifest.routes.visitorRoutes);
  for (const path of [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/birth-chart",
    "/todays-sky",
    "/retrogrades",
    "/synastry",
    "/synastry/[slug]",
    "/transit",
    "/transit/[slug]",
  ]) {
    assert.equal(visitorRoutes.has(path), true, `${path} visitor route must be declared`);
  }

  const apiRoutes = routePaths(manifest.routes.generatedSiteApis);
  for (const path of [
    "/api/astropages/generated-site/health",
    "/api/astropages/generated-site/edit-readiness",
    "/api/astropages/generated-site/emdash/bootstrap",
    "/api/astropages/generated-site/content-release/status",
    "/api/astropages/generated-site/content-release/export",
    "/api/astropages/generated-site/content-release/import",
    "/api/astropages/generated-site/runtime-config/sync",
    "/api/astropages/generated-site/sso/exchange",
    "/api/astropages/generated-site/editor/content-field",
    "/api/astropages/generated-site/editor/provision-mcp-token",
    "/api/astropages/generated-site/email-templates",
    "/api/astropages/generated-site/email-templates/render",
    "/api/astropages/generated-site/email-templates/test-send",
    "/api/astropages/generated-site/email-templates/publish",
    "/api/astropages/generated-site/customer-auth/signup",
    "/api/astropages/generated-site/customer-auth/request-password-reset",
    "/api/astropages/generated-site/customer-auth/reset-password",
    "/api/astropages/generated-site/customer/profile",
    "/api/astropages/generated-site/customer/user-profiles",
    "/api/astropages/generated-site/birth-chart",
    "/api/astropages/generated-site/horoscope",
    "/api/astropages/generated-site/moon-guide",
    "/api/astropages/generated-site/todays-sky",
    "/api/astropages/generated-site/retrogrades",
    "/api/astropages/generated-site/synastry",
    "/api/astropages/generated-site/transit",
    "/api/astropages/generated-site/session-checkout-intents",
    "/api/astropages/generated-site/payments/stripe/session-confirm",
    "/api/astropages/generated-site/webhooks/payment/stripe",
    "/api/astropages/generated-site/session-entitlements/[entitlementId]",
  ]) {
    assert.equal(apiRoutes.has(path), true, `${path} generated-site API must be declared`);
  }

  for (const path of ["/consultations", "/puja-services"]) {
    assert.equal(visitorRoutes.has(path), false, `${path} is Pandit-specific and must not be in base`);
  }
});

test("manifest distinguishes template deploy secrets from generated-site deploy secrets", () => {
  assert.equal(manifest.secrets.requiredForTemplateDeployment.includes("BUILDER_MCP_TOKEN"), true);
  assert.equal(manifest.secrets.requiredForTemplateDeployment.includes("BUILDER_MCP_PROVISION_SECRET"), true);

  assert.equal(manifest.secrets.requiredForGeneratedSiteDeployment.includes("EMDASH_ENCRYPTION_KEY"), true);
  assert.equal(
    manifest.secrets.requiredForGeneratedSiteDeployment.includes("ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN"),
    true,
  );
  assert.equal(manifest.secrets.requiredForGeneratedSiteDeployment.includes("BUILDER_MCP_TOKEN"), false);
  assert.equal(manifest.secrets.requiredForGeneratedSiteDeployment.includes("BUILDER_MCP_PROVISION_SECRET"), false);
  assert.deepEqual(manifest.secrets.deploymentMapping.generatedSiteWorkerSecrets, [
    "EMDASH_ENCRYPTION_KEY",
    "ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN",
  ]);
});

test("manifest declares reusable runtime persistence tables", () => {
  for (const table of [
    "ap_runtime_config",
    "ap_admin_sessions",
    "ap_admin_sso_exchanges",
    "ap_content_revision_log",
    "ap_content_environment_state",
    "ap_emdash_bootstrap_state",
    "ap_customer_accounts",
    "ap_customer_user_profiles",
    "ap_session_entitlements",
    "ap_payment_attempts",
    "ap_payment_events",
    "ap_astrology_chat_sessions",
    "ap_astrology_chat_messages",
    "ap_astrologer_calendly_event_types",
    "ap_scheduled_sessions",
    "ap_calendly_events",
    "ap_business_events",
    "ap_leads",
    "ap_email_templates",
    "ap_email_events",
    "ap_email_variable_mappings",
  ]) {
    assert.equal(manifest.runtimePersistence.tables.includes(table), true, `${table} must be declared`);
  }
  for (const table of ["ap_report_orders", "ap_puja_orders", "ap_product_orders", "ap_consultation_bookings"]) {
    assert.equal(manifest.runtimePersistence.tables.includes(table), false, `${table} is not part of base`);
  }
});

test("leads manifest exposes the canonical reusable sources", () => {
  assert.equal(leadsManifest.semanticModel, "leads.v1");
  assert.equal(leadsManifest.table, "ap_leads");
  assert.deepEqual(Object.keys(leadsManifest.sources), [
    "consultation_booking",
    "product_order",
    "puja_order",
    "report_order",
    "newsletter",
    "support",
  ]);
});

test("analytics manifest is base-specific and read-only", () => {
  assert.equal(analyticsManifest.templateKey, "sidera-almanac");
  const queries = JSON.stringify(analyticsManifest.queries ?? []);
  assert.match(queries, /\bSELECT\b|\bWITH\b/i);
  assert.doesNotMatch(queries, /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|TRUNCATE)\b/i);
  assert.doesNotMatch(queries, /\b(ap_report_orders|ap_puja_orders|ap_shop_products|ap_consultation_bookings)\b/i);
});
