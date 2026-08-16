import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/moon-calendar/sections/MoonCalendarCalendarDetail.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/moon-calendar/sections/moon-calendar-calendar-detail.css",
  import.meta.url,
);
const pagePath = new URL(
  "../../src/pages/moon-calendar.astro",
  import.meta.url,
);
const baseMigrationPath = new URL(
  "../../migrations/0045_moon_calendar_page_header.sql",
  import.meta.url,
);
const tonightMigrationPath = new URL(
  "../../migrations/0046_moon_calendar_tonight_banner.sql",
  import.meta.url,
);
const migrationPath = new URL(
  "../../migrations/0049_moon_calendar_calendar_detail.sql",
  import.meta.url,
);

const fields = [
  "calendar_today_label",
  "calendar_weekday_sun",
  "calendar_weekday_mon",
  "calendar_weekday_tue",
  "calendar_weekday_wed",
  "calendar_weekday_thu",
  "calendar_weekday_fri",
  "calendar_weekday_sat",
  "calendar_legend_new",
  "calendar_legend_quarter",
  "calendar_legend_full",
  "calendar_instruction",
  "detail_today_badge",
  "detail_hold_off_label",
  "detail_cta_label",
];

test("Moon Calendar detail composes DateNavigator and a 42-cell native calendar", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import DateNavigator from "\.\.\/\.\.\/shared\/DateNavigator\.astro"/,
  );
  assert.match(source, /<DateNavigator/);
  assert.match(source, /initialMonth\.cells\.map/);
  assert.match(source, /<button[\s\S]*data-calendar-cell/);
  assert.match(source, /disabled=\{day\?\.iso === initialDay\.iso\}/);
  assert.match(source, /data-detail-weekday/);
  assert.match(source, /data-detail-moon-path/);
  assert.match(source, /data-detail-sign/);
  assert.match(source, /data-detail-ritual/);
  assert.match(source, /data-detail-link/);
  assert.doesNotMatch(source, /data-view-selected-day/);
  assert.match(source, /data-detail-events/);
  assert.match(source, /data-detail-phase-reading/);
  assert.match(source, /data-detail-sign-reading/);
  assert.doesNotMatch(source, /moon-calendar-detail__favoured/);
  assert.match(source, /signIngressDescriptionTemplate/);
  assert.match(source, /phaseEventDescriptionTemplate/);
  assert.match(source, /ingressSignIndex/);
  assert.match(source, /day\.ingress = fill\(runtime\.ingressTemplate/);
});

test("every locale provides a complete day reading and event guidance", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getMoonCalendarOperationalCopy } =
    await import("../../src/data/locale/moon-calendar/sections/calendar-day-detail.ts");

  for (const locale of activeLocaleCodes) {
    const copy = getMoonCalendarOperationalCopy(locale);
    assert.notEqual(
      copy.dayReadingLabel.trim(),
      "",
      `${locale} day reading label`,
    );
    assert.equal(
      Object.keys(copy.phaseReadings).length,
      8,
      `${locale} phase readings`,
    );
    assert.equal(copy.moonSignTones.length, 12, `${locale} Moon sign tones`);
    assert.ok(copy.phaseEventDescriptionTemplate.includes("{phase}"));
    assert.ok(copy.signIngressDescriptionTemplate.includes("{sign}"));
    assert.ok(copy.signIngressDescriptionTemplate.includes("{previousSign}"));
  }
});

test("calendar interactions update month, selected detail, and localized sky link", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /addEventListener\("datechange"/);
  assert.match(source, /action === "reset"/);
  assert.match(source, /renderMonth\(\)/);
  assert.match(source, /syncDetail\(day,/);
  assert.match(source, /searchParams\.set\("date", day\.iso\)/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /addEventListener\("moon-phase-select"/);
  assert.match(source, /scrollIntoView\(\{ behavior: "smooth"/);
  assert.match(source, /root\.scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(source, /cell\.disabled = selected/);
  assert.match(source, /moon-calendar-detail__scroll/);
  assert.match(source, /scope", "month"/);
  assert.match(source, /scope", "day"/);
  assert.match(source, /detailContent\.animate\(/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(source, /detail\.sign\.textContent = operational\.loading/);
  assert.doesNotMatch(source, /detail\.signGlyph\.textContent = "☽"/);
});

test("Moon Calendar route mounts the calendar after Tonight's Moon", async () => {
  const page = await readFile(pagePath, "utf8");

  assert.match(
    page,
    /<MoonCalendarTonightBanner[\s\S]*\/>\s*<MoonCalendarCalendarDetail/,
  );
  assert.match(page, /skyHref=\{localizePath\("\/todays-sky", locale\)\}/);
  assert.match(page, /apiHref=\{moonApiHref\}/);
  assert.match(page, /operational=\{operational\}/);
  for (const field of fields) {
    assert.match(page, new RegExp(`${field}: content\\.${field}`));
  }
  assert.match(page, /componentEditAttributes\(builderEdit\(field\)\)/);
});

test("all active locales register non-empty calendar detail fields", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getMoonCalendarDefaults } =
    await import("../../src/data/public-copy.ts");
  const { getBuilderFieldTarget } =
    await import("../../src/builder/registry.ts");

  for (const locale of activeLocaleCodes) {
    const defaults = getMoonCalendarDefaults(locale);
    for (const field of fields) {
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
      assert.deepEqual(getBuilderFieldTarget(field, "moon_calendar"), {
        collection: "site_moon_calendar",
        entry: "moon_calendar",
      });
    }
  }
});

test("calendar detail fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(baseMigrationPath, "utf8"));
  sqlite.exec(await readFile(tonightMigrationPath, "utf8"));
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_moon_calendar)")
      .all()
      .map((column) => column.name),
  );

  for (const field of fields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});

test("calendar and detail remain responsive with hover only on controls", async () => {
  const source = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 1\.42fr\) minmax\(20rem, 1fr\)/,
  );
  assert.match(styles, /@media \(max-width: 56rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(max-width: 25rem\)/);
  assert.match(styles, /\.moon-calendar-grid__day:hover/);
  assert.match(styles, /\.moon-calendar-grid__day--selected:hover/);
  assert.match(styles, /\.moon-calendar-detail__scroll[\s\S]*overflow-y: scroll/);
  assert.match(styles, /scrollbar-gutter: stable/);
  assert.match(styles, /block-size: var\(--moon-calendar-detail-height, 100%\)/);
  assert.match(source, /const syncPanelHeights = \(\) =>/);
  assert.match(source, /new ResizeObserver\(syncPanelHeights\)\.observe\(calendarPanel\)/);
  assert.match(source, /detailScroll\.scrollTo\(\{ top: 0, behavior: "smooth" \}\)/);
  assert.doesNotMatch(styles, /moon-calendar-detail__scroll\s*\{[^}]*overflow: visible/);
  assert.doesNotMatch(styles, /\.moon-calendar-grid__detail-action/);
  assert.match(styles, /\.moon-calendar-detail__link:hover/);
  assert.doesNotMatch(styles, /\.date-navigator__/);
});
