import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const liveFields = [
  "live_connected",
  "live_wallet_label",
  "live_meter_label",
  "live_end_session",
  "live_session_started",
  "live_opening_message",
  "live_reply_message",
  "live_quick_year",
  "live_quick_career",
  "live_quick_love",
  "live_quick_transits",
  "live_message_placeholder",
  "live_send_message",
  "live_chart_title",
  "live_chart_owner",
  "live_chart_label",
  "live_asked_title",
  "live_asked_text",
  "live_placements_title",
  "live_sun_placement",
  "live_moon_placement",
  "live_rising_placement",
  "live_wallet_low_title",
  "live_wallet_low_description",
  "live_wallet_current_label",
  "live_wallet_required_label",
  "live_wallet_shortfall_label",
  "live_add_funds_label",
  "live_wallet_close_label",
];
const historyFields = [
  "live_history_title",
  "live_new_chat",
  "live_open_history",
  "live_close_history",
  "live_no_history",
  "live_session_ended",
  "live_chats_label",
  "live_transactions_label",
  "live_no_transactions",
  "live_chatting_as",
  "live_secure_private",
  "live_back_to_astrologers",
  "live_load_more",
  "live_delete_session_label",
  "live_delete_session_title",
  "live_delete_session_description",
  "live_delete_session_confirm",
  "live_delete_session_deleting",
  "live_delete_session_cancel",
];

test("Live session composes approved shared primitives and keeps its workspace private", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerLiveSession.astro",
  );
  for (const shared of [
    "Avatar",
    "Button",
    "IconButton",
    "StatusDot",
    "TextField",
    "Dialog",
    "ChartWheel",
  ]) {
    assert.match(component, new RegExp(`import ${shared} from`));
    assert.match(component, new RegExp(`<${shared}`));
  }
  assert.match(component, /data-live-session/);
  assert.match(component, /data-live-composer/);
  assert.match(component, /data-wallet-balance/);
  assert.match(component, /data-wallet-dialog-trigger/);
  assert.match(component, /INSUFFICIENT_WALLET_BALANCE/);
  assert.match(component, /appendMessage/);
  assert.match(component, /sessionId && initialMessages\.length/);
  assert.match(component, /data-live-question/);
  assert.match(component, /chartContext\?\.owner/);
  assert.doesNotMatch(component, /const zodiac =/);
  assert.doesNotMatch(component, /copy\.chartOwner/);
  assert.doesNotMatch(component, /copy\.askedText/);
  assert.doesNotMatch(component, /ChatComposer|SessionSummary|OrderSummary/);
});

test("Dedicated chat route restores an owned session into the immersive workspace", async () => {
  const [page, chatRoute, history] = await Promise.all([
    read("src/pages/astrologers/[slug].astro"),
    read("src/pages/chat/[sessionId].astro"),
    read("src/components/astrologers/shared/AstrologerChatHistory.astro"),
  ]);
  assert.match(chatRoute, /getCustomerSession/);
  assert.match(chatRoute, /getAstrologyChatSessionDetail/);
  assert.match(chatRoute, /Astro\.rewrite/);
  assert.match(page, /Astro\.url\.searchParams\.get\("sessionId"\)/);
  assert.match(page, /getAstrologyChatSessionDetail/);
  assert.match(page, /listAstrologyChatSessions/);
  assert.match(page, /pageSize: 50/);
  assert.match(page, /sessionActive=\{chatDetail\?\.session\.status === "active"\}/);
  assert.match(history, /data-chat-history-session/);
  assert.match(history, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(history, /const chatHref =/);
  assert.match(history, /href=\{chatHref\(session\.id\)\}/);
  assert.match(history, /data-chat-sidebar-tab="chats"/);
  assert.match(history, /data-chat-sidebar-tab="transactions"/);
  assert.match(page, /listWalletTransactions/);
  assert.match(
    page,
    /const isSessionSetup =\s*!isLiveSession && \(Astro\.url\.searchParams\.get\("book"\) === "1" \|\| isPaymentReturn\)/s,
  );
  assert.match(page, /isLiveSession \? \(\s*<AstrologerLiveSession/s);
  assert.match(page, /!isLiveSession && \(\s*<Header/s);
  assert.match(page, /\{!isLiveSession && <Footer \{\.\.\.footerProps\} \/>\}/);
  assert.match(page, /isSessionSummary \? \(\s*<AstrologerSessionSummary/s);
});

test("chat history copy is localized in its own bounded Content Studio collection", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getAstrologerChatHistoryDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");
  const englishKeys = Object.keys(getAstrologerChatHistoryDefaults("en"));
  const config = getBuilderEntryConfig(
    "site_astrologers_chat_history",
    "chat-history",
  );
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologerChatHistoryDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of historyFields) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
      assert.equal(registeredFields.has(field), true, `${field} is not registered`);
      assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
        collection: "site_astrologers_chat_history",
        entry: "chat-history",
      });
    }
  }
});

test("all locales expose aligned editable Live session copy in the bounded session target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getAstrologerSessionSetupDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");
  const englishKeys = Object.keys(getAstrologerSessionSetupDefaults("en"));
  const config = getBuilderEntryConfig(
    "site_astrologers_session_setup",
    "session-setup",
  );
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologerSessionSetupDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of liveFields) {
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
      assert.equal(
        registeredFields.has(field),
        true,
        `${field} is not registered`,
      );
      assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
        collection: "site_astrologers_session_setup",
        entry: "session-setup",
      });
    }
  }
});

test("Live session fields use a forward migration and preserve the D1 column ceiling", async () => {
  const setupMigration = await read(
    "migrations/0074_astrologers_session_setup_content.sql",
  );
  const liveMigration = await read(
    "migrations/0085_astrologers_live_session_content.sql",
  );
  const walletMigration = await read(
    "migrations/0146_wallet_funded_astrology_chat.sql",
  );
  const historyMigration = await read(
    "migrations/0154_chat_session_history_content.sql",
  );
  const workspaceMigration = await read(
    "migrations/0155_chat_workspace_content.sql",
  );
  const deleteDialogMigration = await read(
    "migrations/0156_chat_delete_dialog_content.sql",
  );
  const database = new DatabaseSync(":memory:");
  database.exec(setupMigration);
  database.exec(liveMigration);
  for (const statement of walletMigration.match(
    /ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN [^;]+;/g,
  ) ?? []) {
    database.exec(statement);
  }
  const columns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologers_session_setup)")
      .all()
      .map((row) => row.name),
  );
  for (const field of liveFields) {
    assert.equal(columns.has(field), true, `missing ${field}`);
  }
  assert.equal(columns.size <= 100, true);
  database.exec(historyMigration);
  database.exec(workspaceMigration);
  database.exec(deleteDialogMigration);
  const historyColumns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologers_chat_history)")
      .all()
      .map((row) => row.name),
  );
  for (const field of historyFields) {
    assert.equal(historyColumns.has(field), true, `missing ${field}`);
  }
  assert.equal(historyColumns.size <= 40, true);
});

test("Live session CSS matches the reference desktop split and mobile stack", async () => {
  const styles = await read("src/styles/astrologers/sections/live-session.css");
  const historyStyles = await read(
    "src/styles/astrologers/shared/chat-history.css",
  );
  assert.match(styles, /grid-template-columns: 21\.25rem minmax\(0, 1fr\)/);
  assert.match(styles, /\.astrologer-live__history-trigger/);
  assert.match(historyStyles, /\.astrologer-chat-history__item\.is-active/);
  assert.match(
    historyStyles,
    /\.astrologer-chat-history__list\s*\{[\s\S]*?display: block;/,
  );
  assert.match(historyStyles, /@media \(max-width: 64rem\)/);
  assert.match(historyStyles, /transform: translateX\(-102%\)/);
  assert.match(styles, /background: var\(--color-dark\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.7fr\)/);
  assert.match(styles, /min-block-size: calc\(100svh - 68px\)/);
  assert.match(
    styles,
    /@media \(max-width: 48rem\)[\s\S]*?\.astrologer-live__context\s*\{\s*display: none;/,
  );
  assert.match(styles, /max-block-size: calc\(100svh - 158px\)/);
  assert.match(styles, /@media \(max-width: 48rem\)/);
  assert.match(styles, /flex-direction: column/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /@media \(max-width: 28rem\)/);
});
