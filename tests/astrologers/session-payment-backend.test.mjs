import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
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
    "0108_astrologer_directory.sql",
    "0109_customer_auth_mutations.sql",
    "0110_customer_profiles_and_preferences.sql",
    "0111_session_payment_entitlements.sql",
    "0117_session_purchase_receipts.sql",
  ]) {
    sqlite.exec(read(`migrations/${migration}`));
  }
  return {
    sqlite,
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...nextValues) {
          values = nextValues;
          return this;
        },
        async first() {
          return statement.get(...values) ?? null;
        },
        async all() {
          return { results: statement.all(...values) };
        },
        async run() {
          const result = statement.run(...values);
          return { meta: { changes: Number(result.changes) } };
        },
      };
    },
  };
};

const insertAccount = (sqlite) => {
  const now = new Date().toISOString();
  sqlite
    .prepare(
      `INSERT INTO ap_customer_accounts (
        id, email, display_name, password_hash, password_salt,
        default_language, consent_marketing, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      "account_payment",
      "session-payment@example.test",
      "Session Payment",
      "hash",
      "salt",
      "English",
      0,
      now,
      now,
    );
};

test("session entitlement schema constrains pricing targets and payment events", () => {
  const migration = read("migrations/0111_session_payment_entitlements.sql");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ap_session_entitlements/);
  assert.match(migration, /session_type IN \('chat', 'written'\)/);
  assert.match(migration, /duration_minutes IN \(15, 30, 45, 60\)/);
  assert.match(migration, /UNIQUE\(provider, provider_event_id\)/);
  assert.match(migration, /idempotency_key TEXT NOT NULL UNIQUE/);
  assert.match(read("migrations/0117_session_purchase_receipts.sql"), /UNIQUE\(entitlement_id, event_type\)/);
});

test("session checkout target resolves the D1 astrologer rate and replays idempotently", async () => {
  const DB = createD1();
  insertAccount(DB.sqlite);
  const { createSessionPaymentTarget } = await import(
    "../../src/server/aggregator/session-entitlements.ts"
  );
  const input = {
    env: { DB },
    accountId: "account_payment",
    astrologerSlug: "mara-ellison",
    sessionType: "chat",
    deliveryMode: "now",
    durationMinutes: 15,
    requestKey: "session-payment-request-001",
  };
  const created = await createSessionPaymentTarget(input);
  assert.equal(created.ok, true);
  assert.equal(created.entitlement.amountCents, 320 * 15);
  assert.equal(created.entitlement.durationMinutes, 15);
  assert.equal(created.attempt.status, "created");

  const replay = await createSessionPaymentTarget(input);
  assert.equal(replay.ok, true);
  assert.equal(replay.replay, true);
  assert.equal(replay.entitlement.id, created.entitlement.id);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS count FROM ap_session_entitlements").get()
      .count,
    1,
  );
  DB.sqlite.close();
});

test("Stripe session checkout and reconciliation verify target, amount, currency, and signature", async () => {
  const DB = createD1();
  insertAccount(DB.sqlite);
  const repository = await import(
    "../../src/server/aggregator/session-entitlements.ts"
  );
  const stripe = await import(
    "../../src/server/aggregator/payments/stripe.ts"
  );
  const target = await repository.createSessionPaymentTarget({
    env: { DB },
    accountId: "account_payment",
    astrologerSlug: "mara-ellison",
    sessionType: "written",
    deliveryMode: "now",
    durationMinutes: null,
    requestKey: "written-payment-request-001",
  });
  let checkoutBody = "";
  let checkoutIdempotencyKey = "";
  const checkout = await stripe.createStripeSessionCheckout({
    env: { STRIPE_SECRET_KEY: "sk_test_session" },
    payable: target.entitlement,
    attemptId: target.attempt.id,
    origin: "https://sidera.example",
    fetcher: async (_url, init) => {
      checkoutBody = String(init.body);
      checkoutIdempotencyKey = new Headers(init.headers).get("idempotency-key") ?? "";
      return new Response(
        JSON.stringify({
          id: "cs_test_session",
          url: "https://checkout.stripe.test/session",
        }),
        { status: 200 },
      );
    },
  });
  assert.equal(checkout.sessionId, "cs_test_session");
  assert.equal(checkoutIdempotencyKey, target.attempt.id);
  const params = new URLSearchParams(checkoutBody);
  assert.equal(params.get("line_items[0][price_data][unit_amount]"), "1900");
  assert.equal(params.get("metadata[payableType]"), "session_entitlement");

  await repository.recordSessionCheckout({
    env: { DB },
    entitlementId: target.entitlement.id,
    attemptId: target.attempt.id,
    sessionId: checkout.sessionId,
    checkoutUrl: checkout.checkoutUrl,
  });
  const stripeSession = {
    id: checkout.sessionId,
    client_reference_id: target.entitlement.id,
    payment_status: "paid",
    amount_total: 1900,
    currency: "usd",
    payment_intent: "pi_test_session",
    metadata: {
      payableType: "session_entitlement",
      payableId: target.entitlement.id,
      attemptId: target.attempt.id,
    },
  };
  assert.deepEqual(
    stripe.verifyStripeSessionPayment({
      payable: target.entitlement,
      attemptId: target.attempt.id,
      session: stripeSession,
    }),
    { ok: true },
  );
  assert.equal(
    stripe.verifyStripeSessionPayment({
      payable: target.entitlement,
      attemptId: target.attempt.id,
      session: { ...stripeSession, amount_total: 1 },
    }).ok,
    false,
  );

  const paid = await repository.markSessionPaymentPaid({
    env: { DB },
    entitlementId: target.entitlement.id,
    attemptId: target.attempt.id,
    sessionId: checkout.sessionId,
    paymentIntentId: "pi_test_session",
    eventId: "evt_test_session",
    eventStatus: "paid",
  });
  assert.equal(paid.ok, true);
  assert.equal(paid.entitlement.status, "paid");
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_leads WHERE source_reference_id = ?").get(target.entitlement.id).status, "converted");
  const duplicate = await repository.markSessionPaymentPaid({
    env: { DB },
    entitlementId: target.entitlement.id,
    attemptId: target.attempt.id,
    sessionId: checkout.sessionId,
    paymentIntentId: "pi_test_session",
    eventId: "evt_test_session",
    eventStatus: "paid",
  });
  assert.equal(duplicate.duplicate, true);

  const { sendSessionPurchaseReceipt } = await import(
    "../../src/server/aggregator/notifications/session-purchase-receipt.ts"
  );
  let receiptCalls = 0;
  const receiptEnv = { DB, AWS_REGION: "us-east-1", AWS_ACCESS_KEY_ID: "test-access", AWS_SECRET_ACCESS_KEY: "test-secret", SES_SENDER_EMAIL: "sessions@sidera.test", SES_SENDER_NAME: "Sidera" };
  const sendReceipt = () => sendSessionPurchaseReceipt({ env: receiptEnv, entitlement: paid.entitlement, siteOrigin: "https://sidera.example", fetch: async () => { receiptCalls += 1; return new Response(JSON.stringify({ MessageId: "ses_session_1" }), { status: 200 }); } });
  assert.equal((await sendReceipt()).ok, true);
  assert.equal((await sendReceipt()).skipped, true);
  assert.equal(receiptCalls, 1);
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_session_entitlement_notifications WHERE entitlement_id = ?").get(target.entitlement.id).status, "sent");

  const secret = "whsec_test_session";
  const rawBody = JSON.stringify({ id: "evt_test_session" });
  const timestamp = 1_786_536_000;
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  assert.equal(
    await stripe.verifyStripeWebhookSignature({
      secret,
      rawBody,
      signatureHeader: `t=${timestamp},v1=${signature}`,
      nowSeconds: timestamp,
    }),
    true,
  );
  DB.sqlite.close();
});

test("session payment routes require customer CSRF and a signed Stripe webhook", () => {
  const checkout = read(
    "src/pages/api/astropages/generated-site/session-checkout-intents.ts",
  );
  const confirm = read(
    "src/pages/api/astropages/generated-site/payments/stripe/session-confirm.ts",
  );
  const webhook = read(
    "src/pages/api/astropages/generated-site/webhooks/payment/stripe.ts",
  );
  assert.match(checkout, /requireCustomerCsrf/);
  assert.match(checkout, /STRIPE_WEBHOOK_SECRET/);
  assert.match(checkout, /x-idempotency-key/);
  assert.match(confirm, /requireCustomerCsrf/);
  assert.match(confirm, /readStripeCheckoutSession/);
  assert.match(webhook, /verifyStripeWebhookSignature/);
  assert.match(webhook, /checkout\.session\.async_payment_succeeded/);
});
