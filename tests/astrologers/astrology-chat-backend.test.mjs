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
    "0108_astrologer_directory.sql",
    "0109_customer_auth_mutations.sql",
    "0110_customer_profiles_and_preferences.sql",
    "0111_session_payment_entitlements.sql",
    "0136_wallet_stripe_recharges.sql",
  ]) sqlite.exec(read(`migrations/${migration}`));
  sqlite.exec(
    read("migrations/0146_wallet_funded_astrology_chat.sql").split(
      "-- Content Studio fields",
    )[0],
  );
  sqlite.exec(read("migrations/0153_matching_chat_profiles.sql"));
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

const seedMatchingAstrologer = (sqlite) => {
  sqlite.prepare(`INSERT INTO ap_astrologers (
    id, slug, name, tradition, rating, reviews_count, rate_cents, currency,
    availability, categories_json, specialties_json, description,
    years_reading, sessions_count, languages_count, biography, image_url,
    active, sort_order, created_at, updated_at
  ) VALUES (
    'astrologer_selene_test', 'selene-marlowe', 'Selene Marlowe',
    'Western · Synastry', 4.8, 982, 500, 'USD', 'online', '["love"]',
    '["Synastry"]', 'Compatibility reading', 15, 3200, 1,
    'Compatibility specialist', '/selene.png', 1, 20,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )`).run();
};

const seedPartnerProfile = (sqlite, accountId) => {
  const now = new Date().toISOString();
  sqlite.prepare(`INSERT INTO ap_customer_user_profiles (
    id, account_id, profile_name, birth_date, birth_time, birth_place,
    place_lat, place_lon, place_timezone, timezone_offset, is_default,
    created_at, updated_at
  ) VALUES (?, ?, 'Partner', '1992-09-03', '14:15', 'Mumbai, India',
    19.076, 72.8777, 'Asia/Kolkata', 'UTC+05:30', 0, ?, ?)`)
    .run(`partner_${accountId}`, accountId, now, now);
};

const seedCustomer = (
  sqlite,
  accountId = "account_chat",
  balanceCents = 1000,
) => {
  const now = new Date().toISOString();
  sqlite
    .prepare(`INSERT INTO ap_customer_accounts (
      id, email, display_name, password_hash, password_salt,
      default_language, consent_marketing, created_at, updated_at
    ) VALUES (?, ?, ?, 'hash', 'salt', 'English', 0, ?, ?)`)
    .run(accountId, `${accountId}@example.test`, "Chat Customer", now, now);
  sqlite
    .prepare(`INSERT INTO ap_customer_user_profiles (
      id, account_id, profile_name, birth_date, birth_time, birth_place,
      place_lat, place_lon, place_timezone, timezone_offset, is_default,
      created_at, updated_at
    ) VALUES (?, ?, 'Me', '1990-04-12', '08:30', 'Delhi, India',
      28.6139, 77.209, 'Asia/Kolkata', 'UTC+05:30', 1, ?, ?)`)
    .run(`profile_${accountId}`, accountId, now, now);
  sqlite
    .prepare(`INSERT INTO ap_wallets (
      id, account_id, balance_cents, currency, created_at, updated_at
    ) VALUES (?, ?, ?, 'USD', ?, ?)`)
    .run(`wallet_${accountId}`, accountId, balanceCents, now, now);
};

const providerFetch = (answer, onCall = () => {}) => async (_url, init) => {
  onCall(JSON.parse(init.body));
  return new Response(JSON.stringify({ success: true, answer }));
};

test("wallet chat is owned, idempotent, and debits only after a provider answer", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite);
  seedCustomer(DB.sqlite, "account_other");
  const chat = await import("../../src/server/aggregator/astrology-chat.ts");
  const env = {
    DB,
    ASTROPAGES_PROJECT_ID: "chat-test",
    X_ASTROLOGYAPI_KEY: "test-key",
    ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
  };
  const input = {
    env,
    accountId: "account_chat",
    profileId: "profile_account_chat",
    astrologerSlug: "mara-ellison",
    requestKey: "chat-session-request-001",
  };
  const created = await chat.createAstrologyChatSession(input);
  assert.equal(created.ok, true);
  assert.equal(created.session.status, "active");
  assert.equal(
    DB.sqlite.prepare("SELECT balance_cents FROM ap_wallets WHERE account_id = 'account_chat'").get().balance_cents,
    1000,
  );
  const replay = await chat.createAstrologyChatSession(input);
  assert.equal(replay.replay, true);
  assert.equal(replay.session.id, created.session.id);
  assert.equal(
    await chat.getAstrologyChatSession(env, "account_other", created.session.id),
    null,
  );

  let providerPayload;
  const sent = await chat.sendAstrologyChatMessage({
    env,
    accountId: "account_chat",
    sessionId: created.session.id,
    message: "What should I focus on next?",
    requestKey: "message-request-001",
    fetcher: providerFetch(
      "Focus on the work already gaining momentum.",
      (payload) => { providerPayload = payload; },
    ),
  });
  assert.equal(sent.ok, true);
  assert.equal(sent.costCents, 320);
  assert.equal(sent.balanceAfterCents, 680);
  assert.equal(providerPayload.ac, "WESTERN");
  assert.equal(providerPayload.sid, created.session.id);
  assert.equal((await chat.getAstrologyChatMessages(env, created.session.id)).length, 2);
  const walletTransaction = DB.sqlite
    .prepare("SELECT transaction_type, amount_cents, balance_after_cents FROM ap_wallet_transactions")
    .get();
  assert.equal(walletTransaction.transaction_type, "chat_debit");
  assert.equal(walletTransaction.amount_cents, -320);
  assert.equal(walletTransaction.balance_after_cents, 680);

  const sentReplay = await chat.sendAstrologyChatMessage({
    env,
    accountId: "account_chat",
    sessionId: created.session.id,
    message: "This changed text must not be resent",
    requestKey: "message-request-001",
  });
  assert.equal(sentReplay.replay, true);
  assert.equal((await chat.getAstrologyChatMessages(env, created.session.id)).length, 2);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_transactions").get().total,
    1,
  );
  assert.equal(
    (await chat.completeAstrologyChatSession(env, "account_chat", created.session.id)).ok,
    true,
  );
  DB.sqlite.close();
});

test("chat session deletion is owner-scoped and removes its messages", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite, "account_delete");
  seedCustomer(DB.sqlite, "account_delete_other");
  const chat = await import("../../src/server/aggregator/astrology-chat.ts");
  const env = { DB, ASTROPAGES_PROJECT_ID: "chat-delete-test" };
  const created = await chat.createAstrologyChatSession({
    env,
    accountId: "account_delete",
    profileId: "profile_account_delete",
    astrologerSlug: "mara-ellison",
    requestKey: "chat-delete-session",
  });
  assert.equal(created.ok, true);
  DB.sqlite.prepare(`INSERT INTO ap_wallet_chat_messages (
    id, session_id, role, message, cost_cents, created_at
  ) VALUES ('delete_message', ?, 'assistant', 'Temporary reply', 0, CURRENT_TIMESTAMP)`)
    .run(created.session.id);

  const denied = await chat.deleteAstrologyChatSession(
    env,
    "account_delete_other",
    created.session.id,
  );
  assert.equal(denied.ok, false);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_chat_messages WHERE session_id = ?")
      .get(created.session.id).total,
    1,
  );

  const deleted = await chat.deleteAstrologyChatSession(
    env,
    "account_delete",
    created.session.id,
  );
  assert.equal(deleted.ok, true);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_chat_sessions WHERE id = ?")
      .get(created.session.id).total,
    0,
  );
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_chat_messages WHERE session_id = ?")
      .get(created.session.id).total,
    0,
  );
  DB.sqlite.close();
});

test("insufficient balance and provider failure never charge or persist a fake transcript", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite, "account_low", 100);
  seedCustomer(DB.sqlite, "account_provider", 1000);
  const chat = await import("../../src/server/aggregator/astrology-chat.ts");

  const lowSession = await chat.createAstrologyChatSession({
    env: { DB },
    accountId: "account_low",
    profileId: "profile_account_low",
    astrologerSlug: "mara-ellison",
    requestKey: "chat-session-request-low",
  });
  let providerCalled = false;
  const low = await chat.sendAstrologyChatMessage({
    env: { DB },
    accountId: "account_low",
    sessionId: lowSession.session.id,
    message: "What comes next in my career?",
    requestKey: "message-request-low",
    fetcher: providerFetch("Never called", () => { providerCalled = true; }),
  });
  assert.equal(low.ok, false);
  assert.equal(low.status, 402);
  assert.equal(low.code, "INSUFFICIENT_WALLET_BALANCE");
  assert.equal(low.shortfallCents, 220);
  assert.equal(providerCalled, false);
  assert.equal((await chat.getAstrologyChatMessages({ DB }, lowSession.session.id)).length, 0);

  const providerSession = await chat.createAstrologyChatSession({
    env: { DB },
    accountId: "account_provider",
    profileId: "profile_account_provider",
    astrologerSlug: "mara-ellison",
    requestKey: "chat-session-request-provider",
  });
  const failed = await chat.sendAstrologyChatMessage({
    env: { DB },
    accountId: "account_provider",
    sessionId: providerSession.session.id,
    message: "Will this be fabricated?",
    requestKey: "message-request-provider",
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.reason, "missing-provider");
  assert.equal((await chat.getAstrologyChatMessages({ DB }, providerSession.session.id)).length, 0);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_transactions").get().total,
    0,
  );
  DB.sqlite.close();
});

test("greeting-only messages are free and keep wallet balance unchanged", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite);
  const chat = await import("../../src/server/aggregator/astrology-chat.ts");
  const session = await chat.createAstrologyChatSession({
    env: { DB },
    accountId: "account_chat",
    profileId: "profile_account_chat",
    astrologerSlug: "mara-ellison",
    requestKey: "chat-session-request-greeting",
  });
  const greeting = await chat.sendAstrologyChatMessage({
    env: { DB },
    accountId: "account_chat",
    sessionId: session.session.id,
    message: "Hello",
    requestKey: "message-request-greeting",
  });
  assert.equal(greeting.ok, true);
  assert.equal(greeting.free, true);
  assert.equal(greeting.costCents, 0);
  assert.equal(greeting.balanceAfterCents, 1000);
  assert.equal((await chat.getAstrologyChatMessages({ DB }, session.session.id)).length, 2);
  assert.equal(
    DB.sqlite.prepare("SELECT COUNT(*) AS total FROM ap_wallet_transactions").get().total,
    0,
  );
  DB.sqlite.close();
});

test("legacy ASTROLOGYAPI_CHAT_BASE_URL value falls back to json-chat host", async () => {
  const chatProvider = await import("../../src/server/aggregator/astrology-chat-provider.ts");
  const profile = {
    id: "profile_legacy",
    accountId: "acct_legacy",
    profileName: "Legacy User",
    birthDate: "1990-01-01",
    birthTime: "10:30",
    birthPlace: "Delhi, India",
    placeLat: 28.6139,
    placeLon: 77.209,
    timezoneOffset: "UTC+05:30",
  };

  let endpoint;
  const result = await chatProvider.callAstrologyChatProvider({
    env: {
      X_ASTROLOGYAPI_KEY: "test-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://api.astrologyapi.com",
    },
    profile,
    sessionId: "session_legacy",
    message: "Hello",
    fetcher: (url) => {
      endpoint = String(url);
      return new Response(JSON.stringify({ status: true, answer: "ok" }));
    },
  });

  assert.equal(result.ok, true);
  assert.equal(/json-chat\.astrologyapi\.com/.test(endpoint), true);
});

test("chat provider can fallback to legacy ASTROLOGY_API_KEY", async () => {
  const chatProvider = await import("../../src/server/aggregator/astrology-chat-provider.ts");
  const profile = {
    id: "profile_legacy_key",
    accountId: "acct_legacy_key",
    profileName: "Legacy Key User",
    birthDate: "1990-01-01",
    birthTime: "10:30",
    birthPlace: "Delhi, India",
    placeLat: 28.6139,
    placeLon: 77.209,
    timezoneOffset: "UTC+05:30",
  };

  const result = await chatProvider.callAstrologyChatProvider({
    env: {
      ASTROLOGY_API_KEY: "legacy-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
    },
    profile,
    sessionId: "session_legacy_key",
    message: "Hello",
    fetcher: () => new Response(JSON.stringify({ status: true, answer: "ok" })),
  });

  assert.equal(result.ok, true);
  assert.equal(result.answer, "ok");
});

test("chat provider prefers ASTROLOGY_API_KEY when X_ASTROLOGYAPI_KEY conflicts", async () => {
  const chatProvider = await import("../../src/server/aggregator/astrology-chat-provider.ts");
  const profile = {
    id: "profile_key_precedence",
    accountId: "acct_key_precedence",
    profileName: "Key Precedence User",
    birthDate: "1990-01-01",
    birthTime: "10:30",
    birthPlace: "Delhi, India",
    placeLat: 28.6139,
    placeLon: 77.209,
    timezoneOffset: "UTC+05:30",
  };
  let authorization = "";

  const result = await chatProvider.callAstrologyChatProvider({
    env: {
      ASTROLOGY_API_KEY: "canonical-key",
      X_ASTROLOGYAPI_KEY: "stale-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
    },
    profile,
    sessionId: "session_key_precedence",
    message: "Hello",
    fetcher: (_url, options) => {
      authorization = options.headers["x-astrologyapi-key"];
      return new Response(JSON.stringify({ status: true, answer: "ok" }));
    },
  });

  assert.equal(result.ok, true);
  assert.equal(authorization, "canonical-key");
});

test("chat provider reports safe transport diagnostics when fetch throws", async () => {
  const chatProvider = await import("../../src/server/aggregator/astrology-chat-provider.ts");
  const profile = {
    id: "profile_transport_error",
    accountId: "acct_transport_error",
    profileName: "Transport Error User",
    birthDate: "1990-01-01",
    birthTime: "10:30",
    birthPlace: "Delhi, India",
    placeLat: 28.6139,
    placeLon: 77.209,
    timezoneOffset: "UTC+05:30",
  };
  const transportError = new TypeError("fetch failed", {
    cause: Object.assign(new Error("socket closed"), { code: "ECONNRESET" }),
  });

  const result = await chatProvider.callAstrologyChatProvider({
    env: {
      ASTROLOGY_API_KEY: "canonical-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
    },
    profile,
    sessionId: "session_transport_error",
    message: "Hello",
    fetcher: async () => {
      throw transportError;
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.providerErrorPhase, "request");
  assert.equal(result.providerErrorCode, "ECONNRESET");
  assert.equal(result.providerErrorName, "TypeError");
});

test("chat provider reads JSON directly without materializing the response as text", async () => {
  const chatProvider = await import("../../src/server/aggregator/astrology-chat-provider.ts");
  const profile = {
    id: "profile_json_response",
    accountId: "acct_json_response",
    profileName: "JSON Response User",
    birthDate: "1990-01-01",
    birthTime: "10:30",
    birthPlace: "Delhi, India",
    placeLat: 28.6139,
    placeLon: 77.209,
    timezoneOffset: "UTC+05:30",
  };

  const result = await chatProvider.callAstrologyChatProvider({
    env: {
      ASTROLOGY_API_KEY: "canonical-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
    },
    profile,
    sessionId: "session_json_response",
    message: "Hello",
    fetcher: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success: true, response: "Working reply" }),
      text: async () => {
        throw new RangeError("response text cannot be materialized");
      },
    }),
  });

  assert.equal(result.ok, true);
  assert.equal(result.answer, "Working reply");
});

test("compatibility chat requires two distinct owned profiles and sends both to the Western provider", async () => {
  const DB = createD1();
  seedCustomer(DB.sqlite, "account_match", 1000);
  seedPartnerProfile(DB.sqlite, "account_match");
  seedMatchingAstrologer(DB.sqlite);
  const chat = await import("../../src/server/aggregator/astrology-chat.ts");
  const missingPartner = await chat.createAstrologyChatSession({
    env: { DB },
    accountId: "account_match",
    profileId: "profile_account_match",
    astrologerSlug: "selene-marlowe",
    requestKey: "chat-session-match-missing",
  });
  assert.equal(missingPartner.ok, false);
  assert.equal(missingPartner.status, 400);

  const created = await chat.createAstrologyChatSession({
    env: { DB },
    accountId: "account_match",
    profileId: "profile_account_match",
    partnerProfileId: "partner_account_match",
    astrologerSlug: "selene-marlowe",
    requestKey: "chat-session-match-valid",
  });
  assert.equal(created.ok, true);
  assert.equal(created.session.partnerProfileId, "partner_account_match");
  assert.equal(created.session.partnerProfileName, "Partner");

  let providerPayload;
  const sent = await chat.sendAstrologyChatMessage({
    env: {
      DB,
      ASTROPAGES_PROJECT_ID: "chat-test",
      X_ASTROLOGYAPI_KEY: "test-key",
      ASTROLOGYAPI_CHAT_BASE_URL: "https://provider.example",
    },
    accountId: "account_match",
    sessionId: created.session.id,
    message: "How do we communicate better?",
    requestKey: "message-match-valid",
    fetcher: providerFetch("Make space for direct, calm conversations.", (payload) => {
      providerPayload = payload;
    }),
  });
  assert.equal(sent.ok, true);
  assert.match(providerPayload.q, /Profile A:/);
  assert.match(providerPayload.q, /Profile B: Partner/);
  assert.match(providerPayload.sid, /-western-match$/);
  DB.sqlite.close();
});

test("chat routes and visible session UI enforce CSRF, wallet errors, and real API calls", () => {
  const picker = read("src/components/astrologers/shared/AstrologerProfilePicker.astro");
  const live = read("src/components/astrologers/sections/AstrologerLiveSession.astro");
  const history = read("src/components/astrologers/shared/AstrologerChatHistory.astro");
  const markdown = read("src/scripts/render-safe-markdown.ts");
  const sendRoute = read("src/pages/api/astro-chat/send-message.ts");
  const sessionRoute = read("src/pages/api/astro-chat/session/[sessionId].ts");
  assert.match(picker, /\/api\/astro-chat\/create-session/);
  assert.match(picker, /partnerProfileId/);
  assert.match(picker, /destination\.pathname/);
  assert.match(picker, /button:not\(\[data-dialog-close\]\)/);
  assert.match(picker, /sessionAttempt/);
  assert.match(picker, /!dialog\.open/);
  assert.match(picker, /x-astropages-customer-csrf/);
  assert.match(live, /\/api\/astro-chat\/send-message/);
  assert.match(live, /INSUFFICIENT_WALLET_BALANCE/);
  assert.match(live, /x-idempotency-key/);
  assert.match(live, /renderSafeMarkdown/);
  assert.match(live, /data-markdown-message/);
  assert.match(history, /data-chat-session-delete/);
  assert.match(history, /astrologer-chat-delete-session/);
  assert.match(history, /method: "DELETE"/);
  assert.match(history, /x-astropages-customer-csrf/);
  assert.match(markdown, /createDocumentFragment/);
  assert.match(markdown, /createElement\("strong"\)/);
  assert.match(markdown, /createElement\(ordered \? "ol" : "ul"\)/);
  assert.doesNotMatch(markdown, /innerHTML|insertAdjacentHTML/);
  assert.match(sendRoute, /requireCustomerCsrf/);
  assert.match(sendRoute, /status: 402/);
  assert.match(sessionRoute, /requireCustomerSession/);
  assert.match(sessionRoute, /requireCustomerCsrf/);
  assert.match(sessionRoute, /export const DELETE/);
  assert.match(sessionRoute, /deleteAstrologyChatSession/);
});
