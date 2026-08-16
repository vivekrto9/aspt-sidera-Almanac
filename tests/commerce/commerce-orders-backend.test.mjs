import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const createD1 = () => {
  const sqlite = new DatabaseSync(":memory:");
  for (const migration of [
    "0001_base_runtime.sql",
    "0002_customer_auth.sql",
    "0005_leads.sql",
    "0006_email_template_management.sql",
    "0106_report_catalog.sql",
    "0107_shop_catalog.sql",
    "0109_customer_auth_mutations.sql",
    "0110_customer_profiles_and_preferences.sql",
    "0111_session_payment_entitlements.sql",
    "0114_commerce_orders.sql",
    "0115_commerce_sales_views.sql",
    "0116_commerce_order_receipts.sql",
  ]) sqlite.exec(read(`migrations/${migration}`));
  return {
    sqlite,
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...nextValues) { values = nextValues; return this; },
        async first() { return statement.get(...values) ?? null; },
        async all() { return { results: statement.all(...values) }; },
        async run() {
          const result = statement.run(...values);
          return { meta: { changes: Number(result.changes) } };
        },
      };
    },
  };
};

const seedCustomer = (sqlite) => {
  const now = new Date().toISOString();
  sqlite.prepare(`INSERT INTO ap_customer_accounts (id, email, display_name, password_hash, password_salt, default_language, consent_marketing, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run("commerce_account", "buyer@example.test", "Sidera Buyer", "hash", "salt", "English", 0, now, now);
  sqlite.prepare(`INSERT INTO ap_customer_user_profiles (id, account_id, profile_name, birth_date, birth_time, birth_place, place_lat, place_lon, place_timezone, is_default, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run("profile_self", "commerce_account", "Self", "1990-01-01", "12:00", "Delhi", 28.6, 77.2, "Asia/Kolkata", 1, now, now);
};

test("commerce schema owns normalized orders and line snapshots", () => {
  const migration = read("migrations/0114_commerce_orders.sql");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ap_commerce_orders/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ap_commerce_order_lines/);
  assert.match(migration, /UNIQUE INDEX IF NOT EXISTS idx_ap_commerce_orders_request/);
  assert.match(migration, /order_type IN \('shop', 'report'\)/);
  assert.match(read("migrations/0116_commerce_order_receipts.sql"), /UNIQUE\(order_id, event_type\)/);
});

test("shop orders resolve D1 prices and replay idempotently", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite);
  const repository = await import("../../src/server/aggregator/commerce-orders.ts");
  const input = {
    env: { DB },
    accountId: "commerce_account",
    accountEmail: "buyer@example.test",
    requestKey: "shop-order-request-001",
    items: [{ id: "natal-print", quantity: 1, variant: "Oak" }, { id: "candle", quantity: 2, variant: "Cedar" }],
    contact: { firstName: "Sidera", lastName: "Buyer", street: "1 Sky Way", city: "Delhi", state: "Delhi", postalCode: "110001", country: "India" },
  };
  const created = await repository.createShopOrder(input);
  assert.equal(created.ok, true);
  assert.equal(created.order.subtotalCents, 9200);
  assert.equal(created.order.shippingCents, 0);
  assert.equal(created.order.taxCents, 736);
  assert.equal(created.order.totalCents, 9936);
  assert.equal(created.order.lines.length, 2);
  assert.equal(created.attempt.amountCents, 9936);
  const sales = DB.sqlite.prepare("SELECT * FROM ap_sales_transactions_v1 WHERE transaction_id = ?").get(created.order.id);
  assert.equal(sales.kind_key, "product_order");
  assert.equal(sales.amount_minor, 9936);
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_leads WHERE source_reference_id = ?").get(created.order.id).status, "new");
  const paid = await repository.markCommercePaymentPaid({
    env: {
      DB,
      AWS_REGION: "us-east-1",
      AWS_ACCESS_KEY_ID: "test-access-key",
      AWS_SECRET_ACCESS_KEY: "test-secret-key",
      SES_SENDER_EMAIL: "orders@sidera.test",
      SES_SENDER_NAME: "Sidera",
    },
    orderId: created.order.id,
    attemptId: created.attempt.id,
    sessionId: "cs_shop_paid",
    paymentIntentId: "pi_shop_paid",
    eventId: "evt_shop_paid",
    eventStatus: "paid",
    siteOrigin: "https://sidera.example",
    sendReceipt: async () => ({ ok: true }),
  });
  assert.equal(paid.ok, true);
  // The repository uses the real SES adapter; provider delivery is covered by the
  // dedicated receipt helper test below, while conversion remains synchronous.
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_leads WHERE source_reference_id = ?").get(created.order.id).status, "converted");
  const replay = await repository.createShopOrder(input);
  assert.equal(replay.replay, true);
  assert.equal(replay.order.id, created.order.id);
  DB.sqlite.close();
});

test("paid order receipts are managed, escaped, and claimed once", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite);
  const { sendCommerceOrderReceipt } = await import("../../src/server/aggregator/notifications/commerce-order-receipt.ts");
  let calls = 0;
  let body = "";
  const env = { DB, AWS_REGION: "us-east-1", AWS_ACCESS_KEY_ID: "test-access", AWS_SECRET_ACCESS_KEY: "test-secret", SES_SENDER_EMAIL: "orders@sidera.test", SES_SENDER_NAME: "Sidera" };
  DB.sqlite.prepare("INSERT INTO ap_commerce_orders (id, order_number, account_id, order_type, status, fulfillment_status, currency, subtotal_cents, shipping_cents, tax_cents, total_cents, customer_name, customer_email, request_key, created_at, updated_at) VALUES (?, ?, ?, 'report', 'paid', 'generation_pending', 'USD', 2900, 0, 0, 2900, ?, ?, ?, ?, ?)").run("receipt_order", "SD-RECEIPT", "commerce_account", "Asha <Sky>", "buyer@example.test", "receipt-request", new Date().toISOString(), new Date().toISOString());
  const order = { id: "receipt_order", orderNumber: "SD-RECEIPT", customerName: "Asha <Sky>", customerEmail: "buyer@example.test", totalCents: 2900, currency: "USD", lines: [{ productName: "Natal <Blueprint>", quantity: 1 }] };
  const send = () => sendCommerceOrderReceipt({ env, order, siteOrigin: "https://sidera.example", fetch: async (_url, init) => { calls += 1; body = String(init.body); return new Response(JSON.stringify({ MessageId: "ses_receipt_1" }), { status: 200 }); } });
  assert.equal((await send()).ok, true);
  assert.equal((await send()).skipped, true);
  assert.equal(calls, 1);
  const html = JSON.parse(body).Content.Simple.Body.Html.Data;
  assert.match(html, /Asha &lt;Sky&gt;/);
  assert.doesNotMatch(html, /Asha <Sky>/);
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_commerce_order_notifications WHERE order_id = ?").get(order.id).status, "sent");
  DB.sqlite.close();
});

test("report orders require an owned profile and Stripe verifies the exact total", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite);
  const repository = await import("../../src/server/aggregator/commerce-orders.ts");
  const stripe = await import("../../src/server/aggregator/payments/stripe.ts");
  const rejected = await repository.createReportOrder({ env: { DB }, accountId: "commerce_account", accountEmail: "buyer@example.test", requestKey: "report-order-bad-001", reportSlug: "natal-blueprint", profileId: "not-owned" });
  assert.equal(rejected.ok, false);
  const created = await repository.createReportOrder({ env: { DB }, accountId: "commerce_account", accountEmail: "buyer@example.test", requestKey: "report-order-good-001", reportSlug: "natal-blueprint", profileId: "profile_self" });
  assert.equal(created.ok, true);
  assert.equal(created.order.totalCents, 2900);
  assert.equal(created.order.fulfillmentStatus, "generation_pending");
  const session = { client_reference_id: created.order.id, payment_status: "paid", amount_total: 2900, currency: "usd", metadata: { payableType: "commerce_order", payableId: created.order.id, attemptId: created.attempt.id, accountId: "commerce_account" } };
  assert.equal(stripe.verifyStripeCommercePayment({ payable: created.order, attemptId: created.attempt.id, session }).ok, true);
  assert.equal(stripe.verifyStripeCommercePayment({ payable: created.order, attemptId: created.attempt.id, session: { ...session, amount_total: 1 } }).ok, false);
  DB.sqlite.close();
});

test("commerce routes enforce customer ownership and signed Stripe reconciliation", () => {
  for (const route of ["src/pages/api/astropages/generated-site/product-orders.ts", "src/pages/api/astropages/generated-site/report-orders.ts", "src/pages/api/astropages/generated-site/commerce-checkout-intents.ts", "src/pages/api/astropages/generated-site/payments/stripe/commerce-confirm.ts"]) assert.match(read(route), /requireCustomerCsrf/);
  assert.match(read("src/pages/api/astropages/generated-site/customer-orders.ts"), /requireCustomerSession/);
  const webhook = read("src/pages/api/astropages/generated-site/webhooks/payment/stripe.ts");
  assert.match(webhook, /verifyStripeWebhookSignature/);
  assert.match(webhook, /payableType === "commerce_order"/);
});
