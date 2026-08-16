import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const browseFields = [
  "browse_eyebrow",
  "browse_title_accent",
  "browse_title_suffix",
  "browse_description",
  "search_aria",
  "search_placeholder",
  "search_submit",
  "search_clear",
  "filter_label",
  "filter_all",
  "filter_love",
  "filter_career",
  "filter_life_path",
  "filter_timing",
  "filter_spiritual",
  "online_now",
  "busy_label",
  "offline_label",
  "results_suffix",
  "no_results_title",
  "no_results_body",
  "profile_action",
  "talk_now",
  "book_next_slot",
  "schedule",
  "rate_unit",
  "reviews_suffix",
  "browse_profile_picker_eyebrow",
  "browse_profile_picker_title",
  "browse_profile_picker_description",
  "browse_profile_picker_close_label",
  "browse_profile_picker_empty_title",
  "browse_profile_picker_empty_description",
  "browse_profile_picker_create_label",
  "browse_profile_picker_select_label",
  "browse_profile_picker_default_label",
  "browse_profile_picker_add_title",
  "browse_profile_picker_back_label",
  "browse_profile_picker_save_label",
  "browse_profile_picker_saving_label",
  "browse_profile_picker_error",
];
const seoFields = [
  "seo_title",
  "seo_description",
  "seo_canonical_path",
  "seo_robots",
  "og_title",
  "og_description",
  "og_image",
  "og_image_alt",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
];
const editableFields = [...browseFields, ...seoFields];

test("Browse astrologers composes only approved shared UI", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologersBrowse.astro",
  );
  for (const shared of [
    "AstrologerCard",
    "AstrologerProfilePicker",
    "CardGrid",
    "ChoiceChips",
    "PageIntro",
    "SearchField",
  ]) {
    assert.match(component, new RegExp(`import ${shared} from`));
    assert.match(component, new RegExp(`<${shared}`));
  }
  assert.match(component, /headingId="astrologers-browse-title"/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /tabletColumns=\{2\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /data-astrologer-filter-form/);
  assert.match(component, /data-astrologer-card/);
  assert.match(component, /data-astrologer-result-count/);
  assert.match(component, /data-astrologer-empty/);
  assert.doesNotMatch(
    component,
    /ProfileSummary|DateSelector|TimeSelector|OrderSummary|Toast/,
  );
  assert.match(component, /data-dialog-open": "astrologer-profile-picker"/);
  assert.doesNotMatch(component, /<Dialog|<AddProfileForm/);
});

test("Browse astrologers matches the reference layout and responsive contract", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologersBrowse.astro",
  );
  const styles = await read("src/styles/astrologers/sections/browse.css");
  assert.match(
    styles,
    /\.astrologers-browse__directory\s*\{[^}]*73\.75rem[^}]*5\.625rem/s,
  );
  assert.match(
    styles,
    /\.astrologers-browse__toolbar\s*\{[^}]*position: sticky[^}]*border-radius: 1rem/s,
  );
  assert.match(styles, /--sidera-card-grid-gap: 1\.25rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(
    styles,
    /\.astrologers-browse__toolbar\s*\{[^}]*overflow-x: clip/s,
  );
  assert.match(
    styles,
    /\.astrologers-browse__filters\s*\{[^}]*max-inline-size: 100%[^}]*overflow-x: auto[^}]*overflow-y: hidden/s,
  );
  assert.doesNotMatch(component, /astrologer-availability|name="online"/);
  assert.doesNotMatch(component, /copy\.filterLifePath|copy\.filterSpiritual/);
  assert.match(
    styles,
    /input:checked\s*\+\s*\[data-builder-edit\]\[data-builder-hovered\][^{]*\{[^}]*background: var\(--choice-chip-checked-background\)[^}]*color: var\(--choice-chip-checked-color\)/s,
  );
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(
    styles,
    /\.sidera-(?:page-intro|section-heading|astrologer-card)__/,
  );
});

test("Astrologer identities and availability stay in prepared runtime data", async () => {
  const data = await read("src/data/astrologers/browse.ts");
  const locale = await read("src/data/locale/astrologers/sections/browse.ts");
  assert.match(data, /export const browseAstrologers/);
  assert.match(data, /slug: "orion-hale"/);
  assert.match(data, /slug: "selene-marlowe"/);
  assert.match(data, /chatProfileType: "KUNDLI"/);
  assert.match(data, /chatProfileType: "MATCHING"/);
  assert.match(data, /categories: \["love", "timing"\]/);
  assert.doesNotMatch(locale, /Mara Ellison|Devin Roy|Yuki Tanaka/);
});

test("Browse filter cleanup repairs the English Love label", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0050_astrologers_browse_content.sql"));
  sqlite
    .prepare(
      `INSERT INTO ec_site_astrologers
        (id, slug, locale, filter_love, created_at, updated_at)
       VALUES ('astrologers-en-test', 'astrologers', 'en', 'Love s', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    )
    .run();
  sqlite.exec(
    await read("migrations/0152_astrologer_browse_filter_cleanup.sql"),
  );
  const row = sqlite
    .prepare(
      "SELECT filter_love FROM ec_site_astrologers WHERE id = 'astrologers-en-test'",
    )
    .get();

  assert.equal(row.filter_love, "Love");
  sqlite.close();
});

test("Astrologers route mounts only Browse with real localized chrome", async () => {
  const page = await read("src/pages/astrologers.astro");
  assert.match(page, /loadPublicPageContent\(Astro, "astrologers"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<AstrologersBrowse/);
  assert.match(page, /createSharedFooterProps/);
  assert.match(page, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.doesNotMatch(page, /variant="compact"/);
  assert.match(page, /current: path === "\/astrologers"/);
  assert.match(page, /getCustomerSession/);
  assert.match(page, /listCustomerUserProfiles/);
  assert.match(page, /customerProfiles=\{customerProfiles\}/);
  assert.match(page, /authenticated=\{Boolean\(customerSession\)\}/);
  assert.match(page, /csrfToken=\{customerSession\?\.csrfToken \|\| ""\}/);
  assert.match(page, /profileFormCopy=\{profileFormCopy\}/);
  for (const path of [
    "/",
    "/todays-sky",
    "/birth-chart",
    "/synastry",
    "/moon-calendar",
    "/daily-horoscope",
    "/astrologers",
    "/blog",
    "/login",
  ]) {
    assert.match(page, new RegExp(`"${path}"`));
  }
  assert.doesNotMatch(
    page,
    /AstrologerProfile|SessionSetup|LiveSession|SessionSummary/,
  );
});

test("Astrologers completes the Content Studio first-section gate", async () => {
  const page = await read("src/pages/astrologers.astro");
  const {
    getBuilderEntryConfig,
    getBuilderFieldTarget,
    getBuilderPageTargets,
    getBuilderReleaseTargets,
  } = await import("../../src/builder/registry.ts");

  for (const toolbarField of [
    "launcherEnabled: builder.launcherEnabled",
    "studioModeEnabled: builder.studioModeEnabled",
    "collection: builder.collection",
    "entry: builder.entry",
    "locale: builder.locale",
    "csrfToken: builder.csrfToken",
    "canPublish: builder.canPublish",
    "seo: seoContent",
    "reviewTargets",
  ]) {
    assert.match(
      page,
      new RegExp(toolbarField.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  assert.match(
    page,
    /hasSavedDraft: builderPage\.hasSavedDraft \|\| chromePage\.hasSavedDraft/,
  );
  for (const field of editableFields) {
    assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
      collection: "site_astrologers",
      entry: "astrologers",
    });
  }
  assert.deepEqual(getBuilderPageTargets("astrologers"), [
    { collection: "site_astrologers", entry: "astrologers" },
    {
      collection: "site_astrologer_profiles",
      entry: "profiles",
    },
    {
      collection: "site_astrologers_session_setup",
      entry: "session-setup",
    },
    {
      collection: "site_astrologers_session_summary",
      entry: "session-summary",
    },
    {
      collection: "site_astrologers_chat_history",
      entry: "chat-history",
    },
  ]);
  assert.equal(
    getBuilderReleaseTargets().some(
      (target) =>
        target.collection === "site_astrologers" &&
        target.entry === "astrologers",
    ),
    true,
  );
  const config = getBuilderEntryConfig("site_astrologers", "astrologers");
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );
  for (const field of editableFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
  }
});

test("all locales provide aligned Browse and SEO defaults", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getAstrologersDefaults } =
    await import("../../src/data/public-copy.ts");
  const englishKeys = Object.keys(getAstrologersDefaults("en"));
  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologersDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of editableFields) {
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
    }
    assert.equal(defaults.seo_canonical_path, "/astrologers");
  }
});

test("Browse fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0000_emdash_schema_bootstrap.sql"));
  sqlite.exec(await read("migrations/0050_astrologers_browse_content.sql"));
  sqlite.exec(await read("migrations/0143_astrologer_chat_profile_picker.sql"));
  sqlite.exec(
    await read("migrations/0144_astrologer_profile_picker_add_form.sql"),
  );
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_astrologers)")
      .all()
      .map((column) => column.name),
  );
  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});

test("online Chat now requires auth, then selects or adds an owned profile before setup", async () => {
  const [
    component,
    picker,
    locale,
    page,
    profilePage,
    migration,
    addFormMigration,
  ] = await Promise.all([
    read("src/components/astrologers/sections/AstrologersBrowse.astro"),
    read("src/components/astrologers/shared/AstrologerProfilePicker.astro"),
    read("src/data/locale/astrologers/sections/browse.ts"),
    read("src/pages/astrologers.astro"),
    read("src/pages/astrologers/[slug].astro"),
    read("migrations/0143_astrologer_chat_profile_picker.sql"),
    read("migrations/0144_astrologer_profile_picker_add_form.sql"),
  ]);

  assert.match(locale, /talkNow: "Chat now"/);
  assert.match(component, /loginHrefFor\(bookingHref\(astrologer\.slug\)\)/);
  assert.match(
    component,
    /authenticated && astrologer\.availability === "online"/,
  );
  assert.match(component, /data-chat-booking-href/);
  assert.match(component, /<AstrologerProfilePicker/);
  assert.match(picker, /<AddProfileForm/);
  assert.match(picker, /data-astrologer-profile-option/);
  assert.match(picker, /data-astrologer-profile-add/);
  assert.match(picker, /slot="actions"/);
  assert.match(picker, /data-astrologer-profile-actions/);
  assert.match(picker, /profileFooter\.hidden = true/);
  assert.match(picker, /data-astrologer-profile-back/);
  assert.match(picker, /builderToolbarAbove/);
  assert.match(picker, /dialog\.dataset\.chatProfileType === "MATCHING"/);
  assert.match(picker, /primaryProfileId/);
  assert.match(picker, /fetch\("\/api\/astro-chat\/create-session"/);
  assert.match(
    picker,
    /body: JSON\.stringify\(\{ profileId, partnerProfileId, astrologerSlug \}\)/,
  );
  assert.match(
    picker,
    /destination\.pathname = .*encodeURIComponent\(sessionId\)/,
  );
  assert.match(component, /data-chat-astrologer-slug/);
  assert.match(component, /data-chat-profile-type/);
  assert.match(component, /data-chat-csrf-token/);
  assert.match(page, /customerProfiles=\{customerProfiles\}/);
  assert.match(profilePage, /Astro\.url\.searchParams\.get\("profileId"\)/);
  assert.match(
    profilePage,
    /customerProfiles\.find\(\(profile\) => profile\.id === requestedProfileId\)/,
  );
  assert.match(migration, /UPDATE revisions/);
  assert.match(migration, /'Talk now'/);
  assert.match(migration, /'Chat now'/);
  assert.match(addFormMigration, /'Add profile'/);
  assert.match(addFormMigration, /UPDATE revisions/);
});

test("AstrologerCard exposes exact edit hooks and optional action behavior", async () => {
  const component = await read("src/components/shared/AstrologerCard.astro");
  assert.match(component, /profileEditAttributes\?: Record<string, string>/);
  assert.match(component, /profileEditAttributes = \{\}/);
  assert.match(component, /editAttributes=\{profileEditAttributes\}/);
  assert.match(component, /actionButtonAttributes\?: Record<string, string>/);
  assert.match(component, /\.\.\.actionButtonAttributes/);
});
