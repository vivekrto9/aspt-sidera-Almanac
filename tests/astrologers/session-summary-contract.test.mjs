import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const summaryFields = [
  "summary_live_overline",
  "summary_live_title",
  "summary_live_body",
  "summary_booked_overline",
  "summary_booked_title",
  "summary_booked_body",
  "summary_sent_overline",
  "summary_sent_title",
  "summary_sent_body",
  "summary_session_type_label",
  "summary_duration_label",
  "summary_free_intro_label",
  "summary_free_intro_value",
  "summary_billed_at_label",
  "summary_when_label",
  "summary_length_label",
  "summary_type_label",
  "summary_reply_by_label",
  "summary_chart_label",
  "summary_shared_value",
  "summary_total_charged_label",
  "summary_estimated_total_label",
  "summary_rating_title",
  "summary_rating_aria_label",
  "summary_note_placeholder",
  "summary_live_primary_action",
  "summary_booked_primary_action",
  "summary_sent_primary_action",
  "summary_back_action",
  "summary_return_home",
];

test("Session summary composes the approved shared receipt, profile, rating, field, and action primitives", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerSessionSummary.astro",
  );
  for (const shared of [
    "Button",
    "OrderSummary",
    "ProfileSummary",
    "RatingStars",
    "TextArea",
  ]) {
    assert.match(component, new RegExp(`import ${shared} from`));
    assert.match(component, new RegExp(`<${shared}`));
  }
  assert.match(component, /data-session-summary/);
  assert.match(component, /"live" \| "booked" \| "sent"/);
  assert.match(component, /text\/calendar/);
});

test("all summary outcomes are routed after Live session and use the standard Header and Footer shell", async () => {
  const page = await read("src/pages/astrologers/[slug].astro");
  assert.match(page, /const isSessionSummary/);
  assert.match(page, /isSessionSummary \? \(\s*<AstrologerSessionSummary/s);
  assert.match(page, /exitHref=\{localizePath\(`\/astrologers\/\$\{astrologer\.slug\}`/);
  assert.match(page, /!isLiveSession && \(\s*<Header/s);
  assert.match(page, /\{!isLiveSession && <Footer \{\.\.\.footerProps\} \/>\}/);
});

test("all locales expose aligned summary copy in a bounded supplemental target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getAstrologerSessionSummaryDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");
  const englishKeys = Object.keys(getAstrologerSessionSummaryDefaults("en"));
  const config = getBuilderEntryConfig(
    "site_astrologers_session_summary",
    "session-summary",
  );
  assert.ok(config);
  const registered = new Set(config.editableFields.map((field) => field.slug));
  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologerSessionSummaryDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of summaryFields) {
      assert.equal(
        typeof defaults[field],
        "string",
        `${locale} missing ${field}`,
      );
      assert.notEqual(
        defaults[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
      assert.equal(registered.has(field), true, `${field} is not registered`);
      assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
        collection: "site_astrologers_session_summary",
        entry: "session-summary",
      });
    }
  }
});

test("Session summary migration is fresh-safe and remains below the D1 column ceiling", async () => {
  const migration = await read(
    "migrations/0096_astrologers_session_summary_content.sql",
  );
  const database = new DatabaseSync(":memory:");
  database.exec(migration);
  const columns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologers_session_summary)")
      .all()
      .map((row) => row.name),
  );
  for (const field of summaryFields)
    assert.equal(columns.has(field), true, `missing ${field}`);
  assert.equal(columns.size <= 100, true);
});

test("Session summary matches the reference measure and responsive action stack", async () => {
  const styles = await read(
    "src/styles/astrologers/sections/session-summary.css",
  );
  assert.match(styles, /inline-size: min\(100%, 41\.25rem\)/);
  assert.match(styles, /background: var\(--color-dark-strong\)/);
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /grid-template-columns: 1fr/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});
