import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const createD1 = () => {
  const sqlite = new DatabaseSync(":memory:");
  for (const migration of ["0001_base_runtime.sql", "0002_customer_auth.sql", "0108_astrologer_directory.sql", "0109_customer_auth_mutations.sql", "0110_customer_profiles_and_preferences.sql", "0111_session_payment_entitlements.sql", "0113_calendly_scheduled_sessions.sql"]) sqlite.exec(read(`migrations/${migration}`));
  return { sqlite, prepare(sql) { const statement = sqlite.prepare(sql); let values = []; return { bind(...next) { values = next; return this; }, async first() { return statement.get(...values) ?? null; }, async all() { return { results: statement.all(...values) }; }, async run() { const result = statement.run(...values); return { meta: { changes: Number(result.changes) } }; } }; } };
};
const seed = (sqlite) => {
  const now = new Date().toISOString();
  sqlite.prepare(`INSERT INTO ap_customer_accounts (id,email,display_name,password_hash,password_salt,default_language,consent_marketing,created_at,updated_at) VALUES ('account_schedule','schedule@example.test','Schedule Customer','hash','salt','English',0,?,?)`).run(now, now);
  sqlite.prepare(`INSERT INTO ap_customer_user_profiles (id,account_id,profile_name,birth_date,birth_time,birth_place,place_lat,place_lon,place_timezone,timezone_offset,is_default,created_at,updated_at) VALUES ('profile_schedule','account_schedule','Me','1990-04-12','08:30','Delhi, India',28.6,77.2,'Asia/Kolkata','UTC+05:30',1,?,?)`).run(now, now);
  sqlite.prepare(`INSERT INTO ap_session_entitlements (id,account_id,astrologer_slug,session_type,delivery_mode,duration_minutes,amount_cents,currency,status,request_key,paid_at,created_at,updated_at) VALUES ('ent_schedule','account_schedule','mara-ellison','chat','scheduled',30,9600,'USD','paid','schedule-request',?,?,?)`).run(now, now, now);
  sqlite.prepare(`INSERT INTO ap_astrologer_calendly_event_types (id,astrologer_slug,duration_minutes,event_type_uri,active,created_at,updated_at) VALUES ('mapping_30','mara-ellison',30,'https://api.calendly.com/event_types/event_30',1,?,?)`).run(now, now);
};
const provider = (slot) => async (url, init = {}) => {
  const target = String(url);
  if (target.endsWith("/event_types/event_30")) return new Response(JSON.stringify({ resource: { uri: target, active: true, duration: 30 } }));
  if (target.includes("event_type_available_times")) return new Response(JSON.stringify({ collection: [{ start_time: slot }] }));
  if (target === "https://api.calendly.com/invitees") {
    const body = JSON.parse(String(init.body));
    assert.equal(body.tracking.utm_content.startsWith("sched_"), true);
    return new Response(JSON.stringify({ resource: { uri: "https://api.calendly.com/scheduled_events/event_1/invitees/invitee_1", cancel_url: "https://calendly.com/cancel/1", event: { uri: "https://api.calendly.com/scheduled_events/event_1", start_time: slot, end_time: new Date(new Date(slot).getTime() + 1_800_000).toISOString(), location: { join_url: "https://meet.example/1" } } } }));
  }
  return new Response("{}", { status: 404 });
};

test("paid scheduled entitlements use exact live Calendly availability and create one owned booking", async () => {
  const DB = createD1(); seed(DB.sqlite);
  const store = await import("../../src/server/aggregator/scheduled-sessions.ts");
  const slot = new Date(Date.now() + 86_400_000).toISOString();
  const env = { DB, CALENDLY_API_TOKEN: "token", ASTROPAGES_PROJECT_ID: "calendly-test" };
  const input = { env, accountId: "account_schedule", customerName: "Schedule Customer", customerEmail: "schedule@example.test", entitlementId: "ent_schedule", profileId: "profile_schedule", astrologerSlug: "mara-ellison", startAt: slot, timezone: "Asia/Kolkata", fetcher: provider(slot) };
  const created = await store.createScheduledSession(input);
  assert.equal(created.ok, true);
  assert.equal(created.booking.status, "scheduled");
  assert.equal(created.booking.meetingUrl, "https://meet.example/1");
  assert.equal((await store.createScheduledSession(input)).replay, true);
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_session_entitlements WHERE id='ent_schedule'").get().status, "reserved");
  assert.equal(await store.getScheduledSession(env, "other-account", created.booking.id), null);
  DB.sqlite.close();
});

test("signed Calendly cancellation is idempotent and does not invent a refund", async () => {
  const DB = createD1(); seed(DB.sqlite);
  const store = await import("../../src/server/aggregator/scheduled-sessions.ts");
  const slot = new Date(Date.now() + 86_400_000).toISOString();
  const key = "calendly-signing-key";
  const env = { DB, CALENDLY_API_TOKEN: "token", CALENDLY_WEBHOOK_SIGNING_KEY: key, ASTROPAGES_PROJECT_ID: "calendly-webhook-test" };
  const created = await store.createScheduledSession({ env, accountId: "account_schedule", customerName: "Schedule Customer", customerEmail: "schedule@example.test", entitlementId: "ent_schedule", profileId: "profile_schedule", astrologerSlug: "mara-ellison", startAt: slot, timezone: "Asia/Kolkata", fetcher: provider(slot) });
  const body = JSON.stringify({ event: "invitee.canceled", payload: { uri: "https://api.calendly.com/scheduled_events/event_1/invitees/invitee_1", scheduled_event: { uri: "https://api.calendly.com/scheduled_events/event_1" }, rescheduled: false } });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", key).update(`${timestamp}.${body}`).digest("hex");
  const first = await store.handleCalendlyWebhook({ env, body, signatureHeader: `t=${timestamp},v1=${signature}` });
  assert.equal(first.ok, true);
  assert.equal((await store.getScheduledSession(env, "account_schedule", created.booking.id)).status, "cancelled");
  await store.handleCalendlyWebhook({ env, body, signatureHeader: `t=${timestamp},v1=${signature}` });
  assert.equal(DB.sqlite.prepare("SELECT COUNT(*) count FROM ap_calendly_events").get().count, 1);
  assert.equal(DB.sqlite.prepare("SELECT status FROM ap_session_entitlements WHERE id='ent_schedule'").get().status, "reserved");
  DB.sqlite.close();
});

test("scheduled UI and APIs use Calendly rather than static-only slot submission", () => {
  const setup = read("src/components/astrologers/sections/AstrologerSessionSetup.astro");
  assert.match(setup, /\/api\/astro-chat\/calendly-availability/);
  assert.match(setup, /\/api\/astro-chat\/create-scheduled-session/);
  assert.match(read("src/pages/api/astro-chat/create-scheduled-session.ts"), /requireCustomerCsrf/);
  assert.match(read("src/pages/api/astropages/generated-site/webhooks/calendly.ts"), /calendly-webhook-signature/);
});
