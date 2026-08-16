import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const setupFields = [
  "setup_back_label",
  "setup_title",
  "setup_description",
  "setup_connect_title",
  "setup_chat_label",
  "setup_chat_description",
  "setup_voice_label",
  "setup_voice_description",
  "setup_video_label",
  "setup_video_description",
  "setup_written_label",
  "setup_written_description",
  "setup_when_title",
  "setup_talk_now",
  "setup_talk_now_description",
  "setup_schedule_later",
  "setup_schedule_later_description",
  "setup_choose_slot",
  "setup_slot_one",
  "setup_slot_two",
  "setup_slot_three",
  "setup_slot_four",
  "setup_slot_five",
  "setup_slot_six",
  "setup_session_length",
  "setup_duration_fifteen",
  "setup_duration_thirty",
  "setup_duration_forty_five",
  "setup_duration_sixty",
  "setup_question_title",
  "setup_question_description",
  "setup_topic_love",
  "setup_topic_career",
  "setup_topic_timing",
  "setup_topic_life_path",
  "setup_question_placeholder",
  "setup_chart_shared",
  "setup_chart_owner",
  "setup_chart_label",
  "setup_edit_chart",
  "setup_summary_label",
  "setup_session_label",
  "setup_when_label",
  "setup_within_day_label",
  "setup_rate_label",
  "setup_per_minute_label",
  "setup_flat_rate_label",
  "setup_estimated_label",
  "setup_total_label",
  "setup_free_minutes",
  "setup_start_now",
  "setup_confirm_booking",
  "setup_send_question",
  "setup_secure_note",
];

test("Session setup composes only the approved shared booking components", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerSessionSetup.astro",
  );
  for (const shared of [
    "ChoiceChips",
    "FormField",
    "OrderSummary",
    "ProfileSummary",
    "TextArea",
  ]) {
    assert.match(component, new RegExp(`import ${shared} from`));
    assert.match(component, new RegExp(`<${shared}`));
  }
  assert.match(component, /data-session-setup/);
  assert.match(component, /name="book" value="1"/);
  assert.match(component, /name="session" value="1"/);
  assert.doesNotMatch(component, /SessionSummary|Dialog|Toast/);
});

test("Session setup route is query-selected and keeps the shared page shell", async () => {
  const page = await read("src/pages/astrologers/[slug].astro");
  assert.match(page, /Astro\.url\.searchParams\.get\("book"\) === "1"/);
  assert.match(page, /<AstrologerSessionSetup/);
  assert.match(page, /<Header/);
  assert.match(page, /<Footer \{\.\.\.footerProps\} \/>/);
});

test("Session setup summary uses localized runtime values rather than English script literals", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerSessionSetup.astro",
  );
  assert.match(component, /id="session-slot"/);
  assert.match(component, /id="session-duration"/);
  assert.match(component, /data-written-when-label=\{copy\.withinDayLabel\}/);
  assert.match(component, /setup\.dataset\.confirmAction/);
  assert.match(component, /setup\.dataset\.writtenAction/);
  assert.doesNotMatch(component, /const rates = \{ chat: 3\.2/);
});

test("all locales expose aligned Session setup copy and registered fields", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const {
    getAstrologerSessionSetupDefaults,
    getAstrologersPrimaryDefaults,
  } = await import(
    "../../src/data/public-copy.ts"
  );
  const { getBuilderEntryConfig, getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );
  const primaryFields = new Set(
    Object.keys(getAstrologersPrimaryDefaults("en")),
  );
  const englishKeys = Object.keys(getAstrologerSessionSetupDefaults("en"));
  const config = getBuilderEntryConfig(
    "site_astrologers_session_setup",
    "session-setup",
  );
  assert.ok(config);
  const registeredFields = new Set(config.editableFields.map((field) => field.slug));

  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologerSessionSetupDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of setupFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.equal(primaryFields.has(field), false, `${field} leaked into the primary collection`);
      assert.equal(registeredFields.has(field), true, `${field} is not registered`);
      assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
        collection: "site_astrologers_session_setup",
        entry: "session-setup",
      });
    }
  }
});

test("Session setup fields have a bounded forward migration", async () => {
  const setupMigration = await read(
    "migrations/0074_astrologers_session_setup_content.sql",
  );
  const database = new DatabaseSync(":memory:");
  database.exec(setupMigration);
  const columns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologers_session_setup)")
      .all()
      .map((row) => row.name),
  );
  for (const field of [
    "id",
    "slug",
    "status",
    "author_id",
    "primary_byline_id",
    "created_at",
    "updated_at",
    "published_at",
    "scheduled_at",
    "deleted_at",
    "version",
    "live_revision_id",
    "draft_revision_id",
    "locale",
    "translation_group",
  ]) {
    assert.equal(columns.has(field), true, `missing core column ${field}`);
  }
  for (const field of setupFields) assert.equal(columns.has(field), true);
  assert.equal(columns.size <= 100, true);
});

test("Session setup CSS preserves the reference rail and responsive stacking", async () => {
  const styles = await read(
    "src/styles/astrologers/sections/session-setup.css",
  );
  assert.match(styles, /max-inline-size: 67\.5rem/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.5fr\)/);
  assert.match(styles, /font-size: 1\.5em/);
  assert.match(styles, /float: inline-start/);
  assert.match(styles, /clear: both/);
  assert.match(styles, /padding-block-start: 1\.5rem/);
  assert.match(styles, /grid-auto-rows: 1fr/);
  assert.match(
    styles,
    /\.astrologer-setup__type-card,[^{]+\{[^}]*block-size: 100%/s,
  );
  assert.match(
    styles,
    /\.astrologer-setup__summary \{[^}]*position: sticky;[^}]*inset-block-start: 5\.5rem/s,
  );
  assert.match(styles, /--choice-chip-background: var\(--color-surface\)/);
  assert.match(styles, /--choice-chip-checked-background: rgb\(156 79 56 \/ 8%\)/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /prefers-reduced-motion/);
});

test("Session setup uses the exact reference outline icons instead of font glyphs", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerSessionSetup.astro",
  );
  const styles = await read(
    "src/styles/astrologers/sections/session-setup.css",
  );
  for (const geometry of [
    "M21 11.5a8.38 8.38",
    "M22 16.9v3a2 2",
    "M23 7l-7 5 7 5V7z",
    "M3 7l9 6 9-6",
  ]) {
    assert.match(component, new RegExp(geometry.replaceAll(".", "\\.")));
  }
  assert.doesNotMatch(component, /["'](?:◌|⌕|▣|✉)["']/);
  assert.match(styles, /stroke-width: 1\.7/);
  assert.match(styles, /color: var\(--color-muted\)/);
  assert.match(styles, /color: var\(--color-primary\)/);
});
