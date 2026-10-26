import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const createD1 = (value = "AUTO") => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("CREATE TABLE ap_business_settings (key TEXT PRIMARY KEY,value_json TEXT NOT NULL,updated_at TEXT NOT NULL)");
  sqlite.prepare("INSERT INTO ap_business_settings VALUES ('payment_preference',?,?)").run(JSON.stringify({ value, schemaVersion: 1, revision: 1 }), new Date().toISOString());
  return { sqlite, prepare(sql) { const statement = sqlite.prepare(sql); let values=[]; return { bind(...next){ values=next; return this; }, async first(){ return statement.get(...values) ?? null; }, async all(){ return {results:statement.all(...values)}; }, async run(){ const result=statement.run(...values); return {meta:{changes:Number(result.changes)}}; } }; } };
};
const b64 = (value) => Buffer.from(value).toString("base64url");
const jwt = async (privateKey, payload) => { const header=b64(JSON.stringify({alg:"ES256",typ:"JWT"})); const body=b64(JSON.stringify(payload)); const signature=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},privateKey,new TextEncoder().encode(`${header}.${body}`)); return `${header}.${body}.${b64(Buffer.from(signature))}`; };
const sha256 = async (value) => [...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))].map((byte)=>byte.toString(16).padStart(2,"0")).join("");

test("AUTO resolves India to INR and unknown/non-India to USD", async () => {
  const { resolvePaymentCurrency, providerForPaymentCurrency } = await import("../../src/server/aggregator/payment-preference.ts");
  assert.equal(resolvePaymentCurrency("AUTO", "IN"), "INR");
  assert.equal(resolvePaymentCurrency("AUTO", "US"), "USD");
  assert.equal(resolvePaymentCurrency("AUTO", undefined), "USD");
  assert.equal(providerForPaymentCurrency("INR"), "razorpay");
  assert.equal(providerForPaymentCurrency("USD"), "stripe");
});

test("country trust accepts Cloudflare metadata in production and only authenticated Tunnel headers in dev", async () => {
  const { paymentCountryFromRequest } = await import("../../src/server/aggregator/payment-country.ts");
  const production = new Request("https://sidera.example/shop"); Object.defineProperty(production, "cf", { value: { country: "IN" } });
  assert.equal(paymentCountryFromRequest(production, false), "IN");
  assert.equal(paymentCountryFromRequest(new Request("http://localhost:4321/shop", { headers: { "cf-ipcountry": "IN", "cf-ray": "ray" } }), true), undefined);
  assert.equal(paymentCountryFromRequest(new Request("https://demo.trycloudflare.com/shop", { headers: { "cf-ipcountry": "IN" } }), true), undefined);
  assert.equal(paymentCountryFromRequest(new Request("https://demo.trycloudflare.com/shop", { headers: { "cf-ipcountry": "IN", "cf-ray": "ray" } }), true), "IN");
});

test("preference updates use strict input and compare-and-swap revision", async () => {
  const DB = createD1();
  const { readPaymentPreference, updatePaymentPreference } = await import("../../src/server/aggregator/payment-preference.ts");
  const initial = await readPaymentPreference({ DB });
  assert.equal(initial.payment_preference, "AUTO"); assert.equal(initial.revision, 1); assert.ok(initial.updatedAt);
  const updated = await updatePaymentPreference({ DB }, { payment_preference: "INR", expectedRevision: 1 });
  assert.equal(updated.payment_preference, "INR"); assert.equal(updated.revision, 2);
  await assert.rejects(() => updatePaymentPreference({ DB }, { payment_preference: "USD", expectedRevision: 1 }), (error) => error.status === 409);
  await assert.rejects(() => updatePaymentPreference({ DB }, { payment_preference: "INR", expectedRevision: 2, extra: true }), (error) => error.status === 400);
  DB.sqlite.close();
});

test("signed settings API binds project, environment, method, path, body, role, and CAS", async () => {
  const DB=createD1(); const {publicKey,privateKey}=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]); const publicJwk=await crypto.subtle.exportKey("jwk",publicKey);
  const path="/api/astropages/generated-site/payment-settings/v1", now=Math.floor(Date.now()/1000);
  const call=async(method,body="",overrides={})=>{ const token=await jwt(privateKey,{iss:"astropages-control-plane",aud:"astropages-generated-site-payment-settings",sub:"control-plane",projectId:"project-1",environment:"preview",role:"owner",method,path,bodyHash:await sha256(body),iat:now,exp:now+300,...overrides}); const request=new Request(`https://preview.example${path}`,{method,headers:{authorization:`Bearer ${token}`,...(body?{"content-type":"application/json"}:{})},...(body?{body}:{})}); const route=await import("../../src/pages/api/astropages/generated-site/payment-settings/v1.ts"); return route[method]({request,locals:{runtime:{env:{DB,ASTROPAGES_SSO_PUBLIC_JWK:JSON.stringify(publicJwk),ASTROPAGES_PROJECT_ID:"project-1",ASTROPAGES_SITE_ENVIRONMENT:"preview"}}}}); };
  const get=await call("GET"); assert.equal(get.status,200); assert.equal((await get.json()).data.payment_preference,"AUTO");
  const patch=await call("PATCH",JSON.stringify({payment_preference:"INR",expectedRevision:1})); assert.equal(patch.status,200); assert.equal((await patch.json()).data.revision,2);
  assert.equal((await call("PATCH",JSON.stringify({payment_preference:"USD",expectedRevision:2}),{role:"viewer"})).status,403);
  assert.equal((await call("PATCH",JSON.stringify({payment_preference:"USD",expectedRevision:1}))).status,409);
  assert.equal((await call("GET","",{projectId:"other"})).status,403);
  DB.sqlite.close();
});

test("fixed prices select only the configured denomination and fail closed when missing", async () => {
  const { selectPriceForCurrency } = await import("../../src/server/aggregator/payment-pricing.ts");
  const row = { slug: "natal-blueprint", price_usd_cents: 2900, price_inr_cents: 249900 };
  assert.equal(selectPriceForCurrency(row, "USD").price_cents, 2900);
  assert.equal(selectPriceForCurrency(row, "INR").price_cents, 249900);
  assert.throws(() => selectPriceForCurrency({ price_usd_cents: 2900 }, "INR"), /not configured/);
});

test("Razorpay uses raw-body HMAC and verifies metadata, amount, and currency", async () => {
  const { verifyRazorpayWebhookSignature, verifyRazorpayPayment } = await import("../../src/server/aggregator/payments/razorpay.ts");
  const rawBody = JSON.stringify({ event: "payment_link.paid" });
  const signature = createHmac("sha256", "webhook-secret").update(rawBody).digest("hex");
  assert.equal(await verifyRazorpayWebhookSignature({ secret: "webhook-secret", rawBody, signature }), true);
  assert.equal(await verifyRazorpayWebhookSignature({ secret: "webhook-secret", rawBody: `${rawBody} `, signature }), false);
  const payable = { id: "order_1", accountId: "account_1", totalCents: 249900, currency: "INR" };
  const entity = { amount_paid: 249900, currency: "INR", status: "paid", notes: { payableType: "commerce_order", payableId: "order_1", attemptId: "attempt_1", accountId: "account_1" } };
  assert.deepEqual(verifyRazorpayPayment({ payable, attemptId: "attempt_1", payableType: "commerce_order", entity }), { ok: true });
  assert.equal(verifyRazorpayPayment({ payable, attemptId: "attempt_1", payableType: "commerce_order", entity: { ...entity, amount_paid: 1 } }).ok, false);
});

test("Razorpay webhook rejects invalid signatures and ignores signed unsupported events", async () => {
  const { POST } = await import("../../src/pages/api/astropages/generated-site/webhooks/payment/razorpay.ts");
  const call = (rawBody, signature) => POST({ request: new Request("https://sidera.example/api/astropages/generated-site/webhooks/payment/razorpay", { method:"POST", headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_test"}, body:rawBody }), locals:{runtime:{env:{RAZORPAY_WEBHOOK_SECRET:"webhook-secret"}}} });
  assert.equal((await call("{}","wrong")).status,403);
  const rawBody = JSON.stringify({event:"payment.authorized",payload:{}});
  const signature = createHmac("sha256","webhook-secret").update(rawBody).digest("hex");
  const response = await call(rawBody,signature); assert.equal(response.status,200); assert.equal((await response.json()).data.decision,"ignored");
});

test("migrations have explicit independent INR values and no exchange multiplier", () => {
  const preferenceMigration = readFileSync(new URL("../../migrations/0158_payment_currency_preference.sql", import.meta.url), "utf8");
  const rateMigration = readFileSync(new URL("../../migrations/0160_lower_active_astrologer_inr_rates.sql", import.meta.url), "utf8");
  assert.doesNotMatch(`${preferenceMigration}\n${rateMigration}`, /\*\s*80|80\s*\*/);
  assert.match(preferenceMigration, /'natal-blueprint' THEN 249900/);
  assert.match(preferenceMigration, /'natal-print' THEN 399900/);
  assert.match(preferenceMigration, /provider IN \('stripe','razorpay'\)/);
  assert.match(rateMigration, /'orion-hale' THEN 15000/);
  assert.match(rateMigration, /'selene-marlowe' THEN 10000/);
  assert.doesNotMatch(rateMigration, /rate_(?:usd_)?cents\s*=/);
});

test("browser verification restores the pre-existing saved preference", () => {
  const script = readFileSync(new URL("../../scripts/verification/currency-dev-browser.mjs", import.meta.url), "utf8");
  assert.match(script, /const originalSetting = JSON\.parse/);
  assert.match(script, /setPreference\(originalSetting\.value\)/);
  assert.doesNotMatch(script, /finally \{\s*setPreference\("AUTO"\)/);
});

test("astrologer cards use the selected fixed rate instead of relabeling the USD amount", async () => {
  const sqlite = new DatabaseSync(":memory:");
  for (const name of ["0001_base_runtime.sql", "0002_customer_auth.sql", "0106_report_catalog.sql", "0107_shop_catalog.sql", "0108_astrologer_directory.sql", "0109_customer_auth_mutations.sql", "0111_session_payment_entitlements.sql", "0136_wallet_stripe_recharges.sql", "0151_chani_chat_astrologer_catalog.sql", "0158_payment_currency_preference.sql", "0160_lower_active_astrologer_inr_rates.sql"])
    sqlite.exec(readFileSync(new URL(`../../migrations/${name}`, import.meta.url), "utf8"));
  const DB = { prepare(sql) { const statement=sqlite.prepare(sql); let values=[]; return { bind(...next){values=next;return this;}, async first(){return statement.get(...values)??null;}, async all(){return {results:statement.all(...values)};} }; } };
  const { getAstrologerBySlug } = await import("../../src/server/aggregator/astrologer-directory.ts");
  const astrologer = await getAstrologerBySlug({ DB }, "orion-hale", "INR");
  assert.equal(astrologer?.currency, "INR");
  assert.equal(astrologer?.rateCents, 15000);
  assert.equal(astrologer?.rate, 150);
  sqlite.close();
});

test("pending first recharge reserves INR and successful funding locks it across owner changes", async () => {
  const sqlite = new DatabaseSync(":memory:");
  for (const name of ["0001_base_runtime.sql", "0002_customer_auth.sql", "0106_report_catalog.sql", "0107_shop_catalog.sql", "0108_astrologer_directory.sql", "0109_customer_auth_mutations.sql", "0111_session_payment_entitlements.sql", "0136_wallet_stripe_recharges.sql", "0158_payment_currency_preference.sql"])
    sqlite.exec(readFileSync(new URL(`../../migrations/${name}`, import.meta.url), "utf8"));
  const DB = { sqlite, prepare(sql) { const statement=sqlite.prepare(sql); let values=[]; return { bind(...next){values=next;return this;}, async first(){return statement.get(...values)??null;}, async all(){return {results:statement.all(...values)};}, async run(){const result=statement.run(...values);return {meta:{changes:Number(result.changes)}};} }; } };
  const now = new Date().toISOString();
  sqlite.prepare("INSERT INTO ap_customer_accounts(id,email,display_name,password_hash,password_salt,default_language,consent_marketing,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("inr_account","inr@example.test","INR User","hash","salt","English",0,now,now);
  sqlite.prepare("UPDATE ap_business_settings SET value_json=? WHERE key='payment_preference'").run(JSON.stringify({ value:"INR",schemaVersion:1,revision:2 }));
  const wallet = await import("../../src/server/aggregator/wallet-store.ts");
  const pricing = await import("../../src/server/aggregator/payment-pricing.ts");
  const created = await wallet.createWalletRecharge({ env:{DB},accountId:"inr_account",amountCents:99900,offerId:"wl_100",requestKey:"inr-wallet-request-1" });
  assert.equal(created.ok,true); assert.equal(created.attempt.provider,"razorpay"); assert.equal(created.recharge.currency,"INR");
  sqlite.prepare("UPDATE ap_business_settings SET value_json=? WHERE key='payment_preference'").run(JSON.stringify({ value:"USD",schemaVersion:1,revision:3 }));
  assert.equal(await pricing.getWalletCurrency({DB},"inr_account"),"INR");
  await wallet.recordWalletCheckout({env:{DB},rechargeId:created.recharge.id,attemptId:created.attempt.id,sessionId:"plink_1",checkoutUrl:"https://rzp.test/1"});
  const { POST } = await import("../../src/pages/api/astropages/generated-site/webhooks/payment/razorpay.ts");
  const notes = { payableType:"wallet_recharge", payableId:created.recharge.id, attemptId:created.attempt.id, accountId:"inr_account" };
  const deliver = async (rawBody, eventId) => {
    const signature = createHmac("sha256","webhook-secret").update(rawBody).digest("hex");
    return POST({ request:new Request("https://sidera.example/api/astropages/generated-site/webhooks/payment/razorpay",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":eventId},body:rawBody}), locals:{runtime:{env:{DB,RAZORPAY_WEBHOOK_SECRET:"webhook-secret"}}} });
  };
  const capturedBody = JSON.stringify({ event:"payment.captured", payload:{ payment:{ entity:{ id:"pay_1", order_id:"order_internal_1", amount:99900, currency:"INR", status:"captured", notes } } } });
  const paid = await deliver(capturedBody,"evt_captured_1"); assert.equal(paid.status,200); assert.equal((await paid.json()).data.decision,"accepted");
  const duplicate = await deliver(capturedBody,"evt_captured_1"); assert.equal(duplicate.status,200); assert.equal((await duplicate.json()).data.decision,"duplicate");
  const paymentLinkBody = JSON.stringify({ event:"payment_link.paid", payload:{ payment_link:{ entity:{ id:"plink_1", amount_paid:99900, currency:"INR", status:"paid", notes } }, payment:{ entity:{ id:"pay_1" } } } });
  const linkDuplicate = await deliver(paymentLinkBody,"evt_link_1"); assert.equal(linkDuplicate.status,200); assert.equal((await linkDuplicate.json()).data.decision,"duplicate");
  const funded = await wallet.getCustomerWalletSummary({DB},"inr_account");
  assert.equal(funded.currency,"INR"); assert.equal(funded.balanceCents,99900);
  assert.equal(sqlite.prepare("SELECT count(*) AS count FROM ap_wallet_transactions WHERE account_id='inr_account'").get().count,1);
  assert.ok(sqlite.prepare("SELECT currency_locked_at FROM ap_wallets WHERE account_id='inr_account'").get().currency_locked_at);
  assert.equal((await pricing.getWalletPricing({DB},"inr_account")).currency,"INR");
  sqlite.close();
});
