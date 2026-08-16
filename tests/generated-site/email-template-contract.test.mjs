import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("email-template control-plane contract is declared and service authenticated", async () => {
  const manifest = JSON.parse(read("astropages/email-templates.manifest.json"));
  assert.equal(manifest.contractVersion, "transactional-email.v1");
  assert.equal(manifest.eventsTable, "ap_email_events");
  assert.equal(
    manifest.variableMappingsTable,
    "ap_email_variable_mappings",
  );
  assert.equal(
    manifest.templates.every(
      (entry) =>
        entry.key &&
        entry.eventType &&
        entry.audience &&
        entry.variables.length,
    ),
    true,
  );
  assert.doesNotMatch(
    JSON.stringify(manifest),
    /password|secret|token|credential/i,
  );
  for (const file of ["index.ts", "render.ts", "test-send.ts", "publish.ts"]) {
    const path = `src/pages/api/astropages/generated-site/email-templates/${file}`;
    assert.equal(existsSync(new URL(path, root)), true);
    assert.match(read(path), /requireContentReleaseServiceAuth/);
  }

  const { projectEmailMcpTools } = await import(
    "../../src/server/generated-site/email-templates-mcp.ts"
  );
  assert.deepEqual(
    projectEmailMcpTools.map((tool) => tool.name),
    [
      "email_template_list",
      "email_template_get",
      "email_event_list",
      "email_event_save",
      "email_variable_catalog",
      "email_variable_add_mapping",
      "email_template_save_preview",
      "email_template_save_draft",
      "email_template_render_sample",
    ],
  );
  assert.equal(
    projectEmailMcpTools.some((tool) => tool.name.includes("publish")),
    false,
  );
});

test("email events are definitions, not SES delivery history", async () => {
  const migrationName = readdirSync(new URL("migrations/", root))
    .find((name) => name.endsWith("_email_template_management.sql"));
  assert.ok(migrationName);
  const migration = read(`migrations/${migrationName}`);
  const eventDefinition =
    migration.match(
      /CREATE TABLE IF NOT EXISTS ap_email_events \([\s\S]*?\n\);/,
    )?.[0] ?? "";
  assert.match(eventDefinition, /event_type TEXT PRIMARY KEY/);
  assert.doesNotMatch(
    eventDefinition,
    /recipient|provider_message_id|status TEXT/,
  );

  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(migration);
  const DB = {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...next) {
          values = next;
          return this;
        },
        async first() {
          return statement.get(...values) ?? null;
        },
        async all() {
          return { results: statement.all(...values) };
        },
        async run() {
          return statement.run(...values);
        },
      };
    },
  };
  const { saveEmailEvent, saveManagedEmailTemplate } = await import(
    "../../src/server/aggregator/notifications/email-template-store.ts"
  );
  await saveEmailEvent(
    { DB },
    {
      eventType: "system.test",
      audience: "customer",
      emailType: "transactional",
    },
  );
  const saved = await saveManagedEmailTemplate({
    env: { DB },
    actor: "contract-test",
    input: {
      key: "system_test_customer_en",
      displayName: "System test",
      eventType: "system.test",
      audience: "customer",
      locale: "en",
      subject: "Hello {{customerName}}",
      htmlBody: "<p>Hello {{customerName}}</p>",
      textBody: "Hello {{customerName}}",
      requiredVariables: ["customerName"],
      samplePayload: { customerName: "Asha" },
    },
  });
  assert.equal(saved.ok, true);
  const columns = sqlite.prepare("PRAGMA table_info(ap_email_events)")
    .all()
    .map((row) => row.name);
  assert.equal(columns.includes("event_type"), true);
  assert.equal(columns.includes("recipient"), false);
});
