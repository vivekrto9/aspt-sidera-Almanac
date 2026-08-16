import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const profileFields = [
  "profile_back_label",
  "profile_years_reading",
  "profile_sessions",
  "profile_languages",
  "profile_about",
  "profile_specialties",
  "profile_what_to_expect",
  "profile_expectation_one",
  "profile_expectation_two",
  "profile_expectation_three",
  "profile_expectation_four",
  "profile_recent_reviews",
  "profile_average",
  "profile_reviews_suffix",
  "profile_rate_unit",
  "profile_talk_now",
  "profile_book_next_slot",
  "profile_schedule",
  "profile_written_question",
  "profile_free_minutes_note",
  "profile_chart_ready",
  "profile_chart_owner",
  "profile_chart_label",
  "profile_review_one_date",
  "profile_review_one_text",
  "profile_review_two_date",
  "profile_review_two_text",
  "profile_review_three_date",
  "profile_review_three_text",
];

test("Astrologer profile composes the approved shared identity and actions", async () => {
  const component = await read(
    "src/components/astrologers/sections/AstrologerProfile.astro",
  );
  for (const shared of [
    "AstrologerProfilePicker",
    "Badge",
    "Button",
    "ChartWheel",
    "ProfileSummary",
  ]) {
    assert.match(component, new RegExp(`import ${shared} from`));
    assert.match(component, new RegExp(`<${shared}`));
  }
  assert.match(component, /astrologer-profile__layout/);
  assert.match(component, /astrologer-profile__booking/);
  assert.match(component, /astrologer-profile__chart/);
  assert.match(component, /editAttributes\(availabilityField\)/);
  assert.match(component, /editAttributes\("profile_free_minutes_note"\)/);
  assert.match(component, /data-dialog-open/);
  assert.match(component, /data-chat-booking-href/);
  assert.match(component, /data-chat-profile-type/);
  assert.match(component, /href="#astrologer-reviews"/);
  assert.match(component, /data-review-scroll/);
  assert.match(component, /scrollIntoView/);
  assert.match(component, /customerChart \? \(/);
  assert.match(component, /href=\{customerChart\.href\}/);
  assert.doesNotMatch(component, /Alex Rivera|Leo Sun/);
  assert.doesNotMatch(component, /profile_free_minutes_(?:prefix|suffix)/);
  assert.doesNotMatch(
    component,
    /DateSelector|TimeSelector|OrderSummary|Dialog|Toast/,
  );
});

test("Astrologer profile route keeps shared Header and full Footer from its first section", async () => {
  const page = await read("src/pages/astrologers/[slug].astro");
  assert.match(page, /loadPublicPageContent\(Astro, "astrologers"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<AstrologerProfile/);
  assert.match(page, /createSharedFooterProps/);
  assert.match(page, /<Footer \{\.\.\.footerProps\} \/>/);
  assert.match(page, /getAstrologerBySlug\(runtimeEnv, Astro\.params\.slug/);
  assert.match(page, /<AstrologerSessionSetup/);
  assert.match(page, /<AstrologerLiveSession/);
  assert.match(page, /<AstrologerSessionSummary/);
  assert.match(page, /pickerCopy=\{profilePickerCopy\}/);
  assert.match(page, /customerProfiles=\{customerProfiles\}/);
  assert.match(page, /listBirthChartReadings/);
  assert.match(page, /customerChart=\{customerChart\}/);
  assert.match(page, /authenticated=\{Boolean\(customerSession\)\}/);
});

test("Profile CTA copy is localized, editable, and migrated without a new content field", async () => {
  const [locale, component, migration] = await Promise.all([
    read("src/data/locale/astrologers/sections/profile.ts"),
    read("src/components/astrologers/sections/AstrologerProfile.astro"),
    read("migrations/0145_astrologer_profile_chat_review_ctas.sql"),
  ]);

  assert.match(locale, /talkNow: "Chat now"/);
  assert.match(locale, /checkReviews: "Check reviews"/);
  assert.match(component, /\? "profile_talk_now"/);
  assert.match(component, /editAttributes\("profile_written_question"\)/);
  assert.match(migration, /UPDATE ec_site_astrologer_profiles/);
  assert.match(migration, /'Chat now'/);
  assert.match(migration, /'Check reviews'/);
  assert.match(migration, /UPDATE revisions/);
  assert.match(migration, /collection = 'site_astrologer_profiles'/);
});

test("Profile identity and biography remain prepared runtime data", async () => {
  const data = await read("src/data/astrologers/browse.ts");
  const locale = await read("src/data/locale/astrologers/sections/profile.ts");
  assert.match(data, /yearsReading: 18/);
  assert.match(data, /sessions: 38200/);
  assert.match(data, /Guides you through your natal chart/);
  assert.doesNotMatch(locale, /Mara Ellison|Devin Roy|Yuki Tanaka/);
});

test("each seeded astrologer gets distinct deterministic Random User reviewers", async () => {
  const { astrologerReviewerProfiles } =
    await import("../../src/data/astrologers/reviewers.ts");
  const component = await read(
    "src/components/astrologers/sections/AstrologerProfile.astro",
  );
  const reviewerSets = Object.values(astrologerReviewerProfiles);
  const reviewers = reviewerSets.flat();

  assert.equal(reviewerSets.length, 2);
  assert.ok(reviewerSets.every((profiles) => profiles.length === 3));
  assert.equal(reviewers.length, 6);
  assert.equal(new Set(reviewers.map((reviewer) => reviewer.name)).size, 6);
  assert.equal(new Set(reviewers.map((reviewer) => reviewer.imageUrl)).size, 6);
  assert.ok(
    reviewers.every((reviewer) =>
      /^https:\/\/randomuser\.me\/api\/portraits\/med\/(?:men|women)\/\d+\.jpg$/.test(
        reviewer.imageUrl,
      ),
    ),
  );
  assert.match(component, /getAstrologerReviewerProfiles\(astrologer\.slug\)/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /referrerpolicy="no-referrer"/);
});

test("all locales expose aligned profile copy through a bounded supplemental target", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getAstrologerProfileDefaults, getAstrologersPrimaryDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");
  const englishKeys = Object.keys(getAstrologerProfileDefaults("en"));
  const primaryFields = new Set(
    Object.keys(getAstrologersPrimaryDefaults("en")),
  );
  const config = getBuilderEntryConfig("site_astrologer_profiles", "profiles");
  assert.ok(config);
  const registeredFields = new Set(
    config.editableFields.map((field) => field.slug),
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getAstrologerProfileDefaults(locale);
    assert.deepEqual(Object.keys(defaults), englishKeys);
    for (const field of profileFields) {
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
        primaryFields.has(field),
        false,
        `${field} leaked into the primary collection`,
      );
      assert.equal(
        registeredFields.has(field),
        true,
        `${field} is not registered`,
      );
      assert.deepEqual(getBuilderFieldTarget(field, "astrologers"), {
        collection: "site_astrologer_profiles",
        entry: "profiles",
      });
    }
  }
});

test("Profile fields migrate out of the primary table without losing locale rows", async () => {
  const browseMigration = await read(
    "migrations/0050_astrologers_browse_content.sql",
  );
  const profileMigration = await read(
    "migrations/0060_astrologers_profile_content.sql",
  );
  const splitMigration = await read(
    "migrations/0078_astrologer_profile_collection.sql",
  );
  const database = new DatabaseSync(":memory:");
  database.exec(browseMigration);
  database.exec(profileMigration);
  database.exec(`
    INSERT INTO ec_site_astrologers (
      id, slug, locale, status, profile_back_label, profile_about
    ) VALUES (
      'astrologers-en', 'astrologers', 'en', 'published', 'Back', 'Biography'
    );
  `);
  database.exec(splitMigration);
  const primaryColumns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologers)")
      .all()
      .map((row) => row.name),
  );
  const profileColumns = new Set(
    database
      .prepare("PRAGMA table_info(ec_site_astrologer_profiles)")
      .all()
      .map((row) => row.name),
  );
  for (const field of profileFields) {
    assert.equal(primaryColumns.has(field), false);
    assert.equal(profileColumns.has(field), true);
  }
  assert.equal(primaryColumns.size < 80, true);
  assert.equal(profileColumns.size < 80, true);
  assert.deepEqual(
    {
      ...database
        .prepare(
          `SELECT slug, locale, status, profile_back_label, profile_about
         FROM ec_site_astrologer_profiles`,
        )
        .get(),
    },
    {
      slug: "profiles",
      locale: "en",
      status: "published",
      profile_back_label: "Back",
      profile_about: "Biography",
    },
  );
});

test("Profile CSS preserves the reference rail and responsive stacking", async () => {
  const styles = await read("src/styles/astrologers/sections/profile.css");
  assert.match(styles, /max-inline-size: 73\.75rem/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1\.6fr\)/);
  assert.match(styles, /\.astrologer-profile__rail\s*\{[^}]*position: sticky/s);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.doesNotMatch(
    styles,
    /\.sidera-profile-summary__(?:name|content|meta)/,
  );
});
