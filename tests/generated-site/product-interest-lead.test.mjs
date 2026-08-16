import assert from "node:assert/strict";
import test from "node:test";

const { POST } = await import(
  "../../src/pages/api/astropages/generated-site/leads/product-interest.ts"
);

const captureDb = () => {
  const calls = [];
  const leads = new Map();
  return {
    calls,
    prepare(sql) {
      return {
        bind(...values) {
          calls.push({ sql, values });
          return {
            async first() {
              if (!sql.includes("SELECT id FROM ap_leads")) return null;
              const id = leads.get(values[0]);
              return id ? { id } : null;
            },
            async run() {
              if (sql.includes("INSERT INTO ap_leads")) {
                const existingId = leads.get(values[22]);
                leads.set(values[22], existingId ?? values[0]);
              }
              return { meta: { changes: 1 } };
            },
          };
        },
      };
    },
  };
};

const post = (body, DB = captureDb()) =>
  POST({
    request: new Request("https://example.com/api/astropages/generated-site/leads/product-interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    locals: { runtime: { env: { DB } } },
  });

test("product-interest endpoint creates a consented, allowlisted support lead", async () => {
  const DB = captureDb();
  const response = await post({
    fullName: "Example Customer",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    message: "Please share the walnut finish.",
    consentContact: true,
    idempotencyKey: "product-request-1",
    attribution: { utmSource: "launch", password: "discard-me" },
    unexpected: "discard-me",
  }, DB);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, "ready");
  assert.match(payload.data.leadId, /^lead_/);

  const insert = DB.calls.find((call) => call.sql.includes("INSERT INTO ap_leads"));
  assert.ok(insert);
  assert.equal(insert.values[1], "contact");
  assert.equal(insert.values[2], "support");
  assert.equal(insert.values[3], "sidera-chart-guidance");
  assert.deepEqual(JSON.parse(insert.values[19]), { utmSource: "launch" });
  assert.deepEqual(JSON.parse(insert.values[20]), {
    topic: "product-interest",
    subject: "Personal Birth Chart",
    message: "Please share the walnut finish.",
  });
});

test("product-interest endpoint requires contact consent and contact details", async () => {
  const response = await post({
    fullName: "Example Customer",
    email: "customer@example.com",
    consentContact: false,
    idempotencyKey: "product-request-2",
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.message, "Contact consent is required.");
});

test("product-interest honeypot returns success without storing a lead", async () => {
  const DB = captureDb();
  const response = await post({
    company: "automated submission",
    email: "bot@example.com",
    consentContact: true,
  }, DB);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.data.leadId, "accepted");
  assert.equal(DB.calls.length, 0);
});
