import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const createD1 = () => {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of ["0001_base_runtime.sql", "0002_customer_auth.sql", "0109_customer_auth_mutations.sql", "0111_session_payment_entitlements.sql", "0136_wallet_stripe_recharges.sql"]) sqlite.exec(read(`migrations/${file}`));
  return { sqlite, prepare(sql) { const statement = sqlite.prepare(sql); let values = []; return { bind(...next) { values = next; return this; }, async first() { return statement.get(...values) ?? null; }, async all() { return { results: statement.all(...values) }; }, async run() { const result = statement.run(...values); return { meta: { changes: Number(result.changes) } }; } }; } };
};
const insertAccount = (sqlite) => { const now = new Date().toISOString(); sqlite.prepare(`INSERT INTO ap_customer_accounts (id,email,display_name,password_hash,password_salt,default_language,consent_marketing,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)`).run("wallet_account","wallet@example.test","Wallet User","hash","salt","English",0,now,now); };

test("wallet recharge verifies Stripe metadata and credits exactly once", async () => {
  const DB = createD1(); insertAccount(DB.sqlite);
  const wallet = await import("../../src/server/aggregator/wallet-store.ts");
  const stripe = await import("../../src/server/aggregator/payments/stripe.ts");
  const created = await wallet.createWalletRecharge({ env: { DB }, accountId: "wallet_account", amountCents: 25000, offerId: "wl_250", requestKey: "wallet-request-0001" });
  assert.equal(created.ok, true); assert.equal(created.recharge.creditCents, 26500);
  let checkoutBody = "";
  const checkout = await stripe.createStripeWalletCheckout({ env: { STRIPE_SECRET_KEY: "sk_test_wallet" }, payable: created.recharge, attemptId: created.attempt.id, origin: "https://sidera.example", fetcher: async (_url, init) => { checkoutBody = String(init.body); return new Response(JSON.stringify({ id: "cs_wallet", url: "https://checkout.stripe.test/wallet" }), { status: 200 }); } });
  const params = new URLSearchParams(checkoutBody);
  assert.equal(params.get("metadata[payableType]"), "wallet_recharge"); assert.equal(params.get("line_items[0][price_data][unit_amount]"), "25000");
  await wallet.recordWalletCheckout({ env: { DB }, rechargeId: created.recharge.id, attemptId: created.attempt.id, sessionId: checkout.sessionId, checkoutUrl: checkout.checkoutUrl });
  const session = { id: "cs_wallet", client_reference_id: created.recharge.id, payment_status: "paid", amount_total: 25000, currency: "usd", payment_intent: "pi_wallet", metadata: { payableType: "wallet_recharge", payableId: created.recharge.id, attemptId: created.attempt.id, accountId: "wallet_account" } };
  assert.deepEqual(stripe.verifyStripeWalletPayment({ payable: created.recharge, attemptId: created.attempt.id, session }), { ok: true });
  assert.equal(stripe.verifyStripeWalletPayment({ payable: created.recharge, attemptId: created.attempt.id, session: { ...session, amount_total: 1 } }).ok, false);
  const paid = await wallet.markWalletRechargePaid({ env: { DB }, rechargeId: created.recharge.id, attemptId: created.attempt.id, sessionId: "cs_wallet", paymentIntentId: "pi_wallet", eventId: "evt_wallet", eventStatus: "paid" });
  assert.equal(paid.wallet.balanceCents, 26500);
  const duplicate = await wallet.markWalletRechargePaid({ env: { DB }, rechargeId: created.recharge.id, attemptId: created.attempt.id, sessionId: "cs_wallet", paymentIntentId: "pi_wallet", eventId: "evt_wallet", eventStatus: "paid" });
  assert.equal(duplicate.duplicate, true);
  assert.equal(DB.sqlite.prepare("SELECT balance_cents FROM ap_wallets WHERE account_id = ?").get("wallet_account").balance_cents, 26500);
  assert.equal(DB.sqlite.prepare("SELECT COUNT(*) AS count FROM ap_wallet_transactions").get().count, 1);
  DB.sqlite.close();
});

test("wallet transaction history paginates and filters persisted credits and debits", async () => {
  const DB = createD1(); insertAccount(DB.sqlite);
  const walletStore = await import("../../src/server/aggregator/wallet-store.ts");
  const summary = await walletStore.getCustomerWalletSummary({ DB }, "wallet_account");
  const now = new Date();
  const insert = DB.sqlite.prepare(`INSERT INTO ap_wallet_transactions
    (id,wallet_id,account_id,recharge_id,transaction_type,amount_cents,balance_after_cents,currency,description,metadata_json,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  insert.run("tx_credit", summary.id, "wallet_account", null, "refund", 2500, 12500, "USD", "Refund", "{}", new Date(now.getTime() - 1000).toISOString());
  insert.run("tx_debit", summary.id, "wallet_account", null, "chat_debit", -1500, 10000, "USD", "Paid chat", "{}", now.toISOString());

  const all = await walletStore.listWalletTransactionsPage({ DB }, "wallet_account", { filter: "all", pageSize: 1 });
  assert.equal(all.totalItems, 2);
  assert.equal(all.totalPages, 2);
  assert.equal(all.items.length, 1);
  assert.equal(all.items[0].amountCents, -1500);

  const credits = await walletStore.listWalletTransactionsPage({ DB }, "wallet_account", { filter: "credit" });
  assert.equal(credits.totalItems, 1);
  assert.equal(credits.items[0].amountCents, 2500);

  const debits = await walletStore.listWalletTransactionsPage({ DB }, "wallet_account", { filter: "debit" });
  assert.equal(debits.totalItems, 1);
  assert.equal(debits.items[0].signedAmount, "-$15");
  assert.equal(walletStore.walletRecentTransactionLimit, 8);
  const recent = await walletStore.listWalletTransactions({ DB }, "wallet_account", { limit: walletStore.walletRecentTransactionLimit });
  assert.equal(recent.length, 2);
  DB.sqlite.close();
});

test("wallet payment APIs return JSON when customer authentication fails", async () => {
  const rechargeApi = await import("../../src/pages/api/wallet/recharges.ts");
  const confirmApi = await import("../../src/pages/api/astropages/generated-site/payments/stripe/wallet-confirm.ts");
  const context = (pathname) => ({
    request: new Request(`https://sidera.example${pathname}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }),
    locals: { runtime: { env: {} } },
  });

  for (const [handler, pathname] of [
    [rechargeApi.POST, "/api/wallet/recharges"],
    [confirmApi.POST, "/api/astropages/generated-site/payments/stripe/wallet-confirm"],
  ]) {
    const response = await handler(context(pathname));
    assert.equal(response.status, 401);
    assert.match(response.headers.get("content-type"), /application\/json/);
    const payload = await response.json();
    assert.equal(payload.status, "error");
    assert.equal(payload.message, "Customer login is required.");
  }
});

test("wallet page and APIs keep auth, CSRF, success, cancel, and failure contracts", () => {
  const page = read("src/pages/wallet.astro"); const component = read("src/components/wallet/sections/WalletWorkspace.astro"); const webhook = read("src/pages/api/astropages/generated-site/webhooks/payment/stripe.ts");
  const transactionsPage = read("src/pages/account/wallet-transactions.astro");
  const transactionsComponent = read("src/components/wallet/sections/WalletTransactionsWorkspace.astro");
  assert.match(page, /loadPublicPageContent\(Astro, "wallet"\)/); assert.match(page, /Astro\.redirect/); assert.match(component, /data-state|cancelled_title|failed_title/); assert.match(component, /x-astropages-customer-csrf/); assert.doesNotMatch(component, /"x-csrf-token"/); assert.match(webhook, /payableType === "wallet_recharge"/); assert.match(read("src/components/shared/Header.astro"), /href=\{walletHref\}/); assert.match(read("src/builder/registry.ts"), /site_wallet/);
  assert.match(component, /wallet-hero__actions/);
  assert.match(component, /wallet-summary/);
  assert.match(component, /data-wallet-after-recharge/);
  assert.match(component, /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/);
  assert.match(component, /variant="primary"/);
  assert.match(component, /variant="secondary"/);
  assert.match(component, /const readPayload = async/);
  assert.match(component, /const renderTransactions = \(items\)/);
  assert.match(component, /renderTransactions\(payload\.data\.transactions\)/);
  assert.match(component, /data-recent-limit=\{recentLimit\}/);
  assert.match(component, /await response\.text\(\)/);
  assert.doesNotMatch(component, /await response\.json\(\)/);
  assert.match(read("src/pages/api/wallet/recharges.ts"), /errorResponse\(feature, await auth\.response\.text\(\), auth\.response\.status\)/);
  assert.match(read("src/pages/api/astropages/generated-site/payments/stripe/wallet-confirm.ts"), /errorResponse\(feature, await auth\.response\.text\(\), auth\.response\.status\)/);
  assert.match(read("src/pages/api/astropages/generated-site/payments/stripe/wallet-confirm.ts"), /data: \{ wallet, transactions, recharge: paid\.recharge \}/);
  assert.match(page, /limit: walletRecentTransactionLimit/);
  assert.match(read("src/styles/wallet/wallet.css"), /grid-template-columns: repeat\(4/);
  assert.match(read("src/styles/wallet/wallet.css"), /background: var\(--color-surface\)/);
  assert.match(read("src/styles/wallet/wallet.css"), /background: var\(--color-panel\)/);
  assert.match(read("src/styles/wallet/wallet.css"), /border: 1px solid rgba\(var\(--color-text-rgb\), 0\.1\)/);
  assert.match(page, /transactionsHref=\{localizePath\("\/account\/wallet-transactions"/);
  assert.match(component, /href=\{transactionsHref\}/);
  assert.match(transactionsPage, /listWalletTransactionsPage/);
  assert.match(transactionsPage, /rawFilter === "credit" \|\| rawFilter === "debit"/);
  assert.match(transactionsComponent, /filterHrefs\.all/);
  assert.match(transactionsComponent, /aria-current/);
  assert.match(read("src/styles/wallet/wallet-transactions.css"), /background: var\(--color-panel\)/);
});

test("wallet copy is registered for every active locale", async () => {
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getWalletCopy } = await import("../../src/data/locale/wallet.ts");
  assert.deepEqual(activeLocaleCodes, ["en", "es", "fr", "pt", "ru", "it", "de"]);
  for (const locale of activeLocaleCodes) {
    const copy = getWalletCopy(locale);
    assert.ok(copy.title);
    assert.ok(copy.pay);
    assert.ok(copy.failed_title);
    assert.ok(copy.tx_title);
    assert.ok(copy.tx_filter_credits);
    assert.ok(copy.tx_filter_debits);
  }
});
