import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Account Overview follows the reference hierarchy and runtime boundary", async () => {
  const component = await read(
    "src/components/account/sections/AccountOverview.astro",
  );
  const page = await read("src/pages/account.astro");
  const data = await read("src/data/account/overview.ts");
  const runtime = await read("src/server/aggregator/account-overview.ts");

  assert.match(component, /account-overview__stats/);
  assert.match(component, /account-overview__sky/);
  assert.doesNotMatch(component, /account-overview__session/);
  assert.doesNotMatch(component, /<ProfileSummary/);
  assert.match(component, /<Button/);
  assert.match(component, /import EmptyState/);
  assert.match(component, /props\.positions \? \(/);
  assert.match(page, /<AccountOverview/);
  assert.match(data, /new Intl\.DateTimeFormat/);
  assert.match(data, /greetingKey/);
  assert.match(data, /stats: readonly number\[\] = \[3, 4, 2, 12\]/);
  assert.doesNotMatch(data, /Devin Roy|career transits check-in|9° Cancer/);
  assert.doesNotMatch(page, /prepareUpcomingAccountSession/);
  assert.doesNotMatch(page, /listScheduledSessions/);
  assert.match(page, /prepareAccountSkyOverview/);
  assert.match(page, /getSkyForDate/);
  assert.match(page, /getAccountOverviewStats/);
  assert.match(runtime, /ap_chart_readings|tables\.chartReadings/);
  assert.match(runtime, /order_type = 'report'/);
  assert.match(runtime, /status = 'paid'/);
});

test("Account Overview is responsive and keeps editor nodes exact", async () => {
  const component = await read(
    "src/components/account/sections/AccountOverview.astro",
  );
  const page = await read("src/pages/account.astro");
  const styles = await read("src/styles/account/sections/account-overview.css");

  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /\.account-overview__sky\s*\{[^}]*inline-size: 100%/s);
  assert.match(styles, /@media \(max-width: 68rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(component, /account_overview_sky_insight/);
  assert.doesNotMatch(component, /account_overview_session_action_label/);
  assert.match(component, /account_overview_sky_empty_title/);
  assert.doesNotMatch(component, /account_overview_session_empty_title/);
  assert.match(page, /id: "shop"/);
  assert.match(page, /label: content\.footer_link_shop/);
  assert.match(page, /href: localizePath\("\/shop", locale\)/);
  assert.match(page, /mobileUtilityActionId="shop"/);
  assert.match(
    component,
    /account_overview_sky_action_label[^]*<\/span>\s*<span aria-hidden="true">→<\/span>/,
  );
});

test("Account Overview copy and migration cover all seven locales", async () => {
  const locale = await read("src/data/locale/account/sections/overview.ts");
  const defaults = await read("src/data/public-copy.ts");
  const migration = await read("migrations/0082_account_overview_content.sql");

  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  }
  for (const field of [
    "account_overview_greeting_morning",
    "account_overview_sky_insight",
    "account_overview_session_action_label",
  ]) {
    assert.match(defaults, new RegExp(field));
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }
  assert.match(defaults, /`account_overview_stat_\$\{index \+ 1\}_label`/);
  assert.match(migration, /ADD COLUMN account_overview_stat_4_label TEXT/);
});

test("Account Overview selects only genuine future bookings and live sky positions", async () => {
  const { prepareAccountSkyOverview, prepareUpcomingAccountSession } =
    await import("../../src/data/account/overview.ts");
  const bodies = ["sun", "moon", "mercury"].map((id, index) => ({
    id,
    planetGlyph: ["☉", "☽", "☿"][index],
    degreeText: `${index + 1}°`,
    signName: ["Leo", "Virgo", "Libra"][index],
    motionText: id === "mercury" ? "Retrograde" : undefined,
  }));
  assert.deepEqual(prepareAccountSkyOverview(bodies), [
    { id: "sun", value: "☉ 1° Leo" },
    { id: "moon", value: "☽ 2° Virgo" },
    { id: "mercury", value: "☿ 3° Libra ℞" },
  ]);

  const now = new Date("2026-08-13T10:00:00Z");
  const base = {
    astrologerName: "Real Astrologer",
    astrologerImage: "/real.webp",
    profileName: "My chart",
    durationMinutes: 30,
    requestedStartAt: "",
    inviteeTimezone: "UTC",
    meetingUrl: "https://meet.example/real",
  };
  const upcoming = prepareUpcomingAccountSession(
    [
      {
        ...base,
        id: "past",
        status: "scheduled",
        scheduledStartAt: "2026-08-12T12:00:00Z",
      },
      {
        ...base,
        id: "cancelled",
        status: "cancelled",
        scheduledStartAt: "2026-08-14T12:00:00Z",
      },
      {
        ...base,
        id: "later",
        status: "scheduled",
        scheduledStartAt: "2026-08-16T12:00:00Z",
      },
      {
        ...base,
        id: "next",
        status: "scheduled",
        scheduledStartAt: "2026-08-14T12:00:00Z",
      },
    ],
    "en",
    now,
  );
  assert.equal(upcoming?.id, "next");
  assert.equal(upcoming?.meetingUrl, "https://meet.example/real");
  assert.match(upcoming?.timing ?? "", /tomorrow/);
  assert.equal(prepareUpcomingAccountSession([], "en", now), null);
});
