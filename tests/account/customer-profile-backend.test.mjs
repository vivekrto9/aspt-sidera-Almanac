import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const createD1 = () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(read("migrations/0002_customer_auth.sql"));
  sqlite.exec(read("migrations/0109_customer_auth_mutations.sql"));
  sqlite.exec(read("migrations/0110_customer_profiles_and_preferences.sql"));
  return {
    sqlite,
    prepare(sql) {
      const prepared = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...nextValues) {
          values = nextValues;
          return this;
        },
        async first() {
          return prepared.get(...values) ?? null;
        },
        async all() {
          return { results: prepared.all(...values) };
        },
        async run() {
          return prepared.run(...values);
        },
      };
    },
  };
};

test("customer preferences and owned birth profiles have a durable D1 schema", () => {
  const migration = read(
    "migrations/0110_customer_profiles_and_preferences.sql",
  );

  for (const preference of [
    "house_system",
    "zodiac_system",
    "daily_horoscope",
  ]) {
    assert.match(migration, new RegExp(`ADD COLUMN ${preference}`));
  }
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ap_customer_user_profiles/);
  assert.match(
    migration,
    /FOREIGN KEY \(account_id\) REFERENCES ap_customer_accounts\(id\)/,
  );
  assert.match(migration, /WHERE is_default = 1/);
  assert.match(migration, /WHERE request_key IS NOT NULL/);
});

test("customer profile APIs enforce sessions, CSRF, ownership, and idempotency", () => {
  const settingsRoute = read(
    "src/pages/api/astropages/generated-site/customer/profile.ts",
  );
  const collectionRoute = read(
    "src/pages/api/astropages/generated-site/customer/user-profiles.ts",
  );
  const itemRoute = read(
    "src/pages/api/astropages/generated-site/customer/user-profiles/[profileId].ts",
  );
  const repository = read("src/server/aggregator/customer-profiles.ts");

  assert.match(settingsRoute, /requireCustomerCsrf/);
  assert.match(collectionRoute, /requireCustomerSession/);
  assert.match(collectionRoute, /requireCustomerCsrf/);
  assert.match(collectionRoute, /x-idempotency-key/);
  assert.match(itemRoute, /requireCustomerCsrf/);
  assert.match(itemRoute, /context\.params\.profileId/);
  assert.match(repository, /WHERE account_id = \? AND id = \?/);
  assert.match(repository, /WHERE account_id = \? AND request_key = \?/);
});

test("Account pages load the authenticated customer's people instead of fixtures", () => {
  const account = read("src/pages/account.astro");
  const collection = read("src/pages/account/[collection].astro");
  const people = read("src/data/account/people.ts");

  assert.match(account, /await listCustomerUserProfiles/);
  assert.match(account, /prepareAccountPeopleFromProfiles\(customerProfiles/);
  assert.match(collection, /await listCustomerUserProfiles/);
  assert.match(collection, /prepareAccountPeopleFromProfiles\(ownedProfiles/);
  assert.match(people, /CustomerUserProfile/);
  assert.match(people, /profile\.birthPlace/);
});

test("owned profile CRUD and account settings persist end to end", async () => {
  const DB = createD1();
  const env = { DB };
  const now = new Date().toISOString();
  DB.sqlite
    .prepare(
      `INSERT INTO ap_customer_accounts (
        id, email, display_name, password_hash, password_salt,
        default_language, consent_marketing, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      "account_one",
      "account@example.test",
      "Original Name",
      "hash",
      "salt",
      "English",
      0,
      now,
      now,
    );

  const profiles = await import(
    "../../src/server/aggregator/customer-profiles.ts"
  );
  const accounts = await import(
    "../../src/server/aggregator/customer-account.ts"
  );
  const payload = {
    profileName: "Self",
    relation: "self",
    gender: "",
    birthDate: "1990-05-14",
    birthTime: "08:30",
    birthPlace: "New Delhi, India",
    placeId: "new-delhi",
    placeLat: 28.6139,
    placeLon: 77.209,
    placeTimezone: "Asia/Kolkata",
    timezoneOffset: "+05:30",
    notes: "",
    isDefault: true,
  };

  const created = await profiles.createCustomerUserProfile({
    env,
    accountId: "account_one",
    profile: payload,
    idempotencyKey: "profile-request-one",
  });
  assert.equal(created.ok, true);
  assert.equal(created.profile.isDefault, true);

  const replay = await profiles.createCustomerUserProfile({
    env,
    accountId: "account_one",
    profile: payload,
    idempotencyKey: "profile-request-one",
  });
  assert.equal(replay.profile.id, created.profile.id);
  assert.equal(
    (await profiles.listCustomerUserProfiles(env, "account_one")).length,
    1,
  );

  const updated = await profiles.updateCustomerUserProfile({
    env,
    accountId: "account_one",
    profileId: created.profile.id,
    profile: { ...payload, profileName: "Updated Self" },
  });
  assert.equal(updated.profile.profileName, "Updated Self");

  const settings = await accounts.updateCustomerAccountSettings({
    env,
    accountId: "account_one",
    displayName: "Updated Account",
    defaultLanguage: "English",
    consentMarketing: true,
    houseSystem: "whole-sign",
    zodiacSystem: "sidereal",
    dailyHoroscope: false,
  });
  assert.equal(settings.account.displayName, "Updated Account");
  assert.equal(settings.account.houseSystem, "whole-sign");
  assert.equal(settings.account.zodiacSystem, "sidereal");
  assert.equal(settings.account.dailyHoroscope, false);

  assert.deepEqual(
    await profiles.deleteCustomerUserProfile(
      env,
      "account_one",
      created.profile.id,
    ),
    { ok: true },
  );
  assert.equal(
    (await profiles.listCustomerUserProfiles(env, "account_one")).length,
    0,
  );
  DB.sqlite.close();
});
