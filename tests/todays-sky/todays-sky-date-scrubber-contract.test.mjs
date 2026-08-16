import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Today's Sky composes the shared DateNavigator and bounded range", async () => {
  const [component, page] = await Promise.all([
    read("src/components/todays-sky/sections/TodaysSkyDateScrubber.astro"),
    read("src/pages/todays-sky.astro"),
  ]);

  assert.match(component, /import DateNavigator/);
  assert.match(component, /<DateNavigator/);
  assert.match(component, /type="range"/);
  assert.match(component, /const rangeMin = -30/);
  assert.match(component, /const rangeMax = 120/);
  assert.match(component, /new Intl\.DateTimeFormat/);
  assert.match(component, /new Intl\.RelativeTimeFormat/);
  assert.match(component, /fetch\(href/);
  assert.match(component, /new DOMParser\(\)\.parseFromString/);
  assert.match(
    component,
    /currentContent\.replaceChildren\(\.\.\.nextContent\.childNodes\)/,
  );
  assert.match(component, /window\.history\.pushState\(\{ todaysSky: true \}/);
  assert.doesNotMatch(component, /range\.addEventListener\("input"/);
  assert.match(component, /window\.addEventListener\("popstate"/);
  assert.match(component, /event\.stopImmediatePropagation\(\)/);
  assert.match(component, /\}, true\);/);
  assert.match(component, /new Event\("todays-sky:content-replaced"\)/);
  assert.match(component, /requestAnimationFrame\(\(\) => \{/);
  assert.match(component, /window\.scrollTo\(scrollX, scrollY\)/);
  assert.match(component, /rememberDateNavigationScroll\(href\)/);
  assert.match(component, /window\.location\.assign\(href\)/);
  assert.match(component, /previousAction\?\.setAttribute/);
  assert.match(component, /nextAction\?\.setAttribute/);
  assert.match(component, /hrefForOffset\(Math\.max\(rangeMin, offset - 1\)\)/);
  assert.match(
    component,
    /hrefForOffset\(Math\.min\(rangeMax, offset \+ 1\)\)/,
  );
  assert.match(page, /<TodaysSkyDateScrubber/);
  assert.match(page, /data-todays-sky-dynamic-content/);
  assert.ok(
    page.indexOf("<TodaysSkyDateScrubber") >
      page.indexOf("<TodaysSkyPageHeader"),
  );
});

test("Today's Sky date scrubber binds only visible static copy for Content Studio", async () => {
  const [component, page] = await Promise.all([
    read("src/components/todays-sky/sections/TodaysSkyDateScrubber.astro"),
    read("src/pages/todays-sky.astro"),
  ]);

  assert.match(component, /eyebrowEditAttributes=\{eyebrowEditAttributes\}/);
  assert.match(
    component,
    /resetLabelEditAttributes=\{todayActionEditAttributes\}/,
  );
  assert.match(
    component,
    /<span \{\.\.\.todayMarkerEditAttributes\}>\{todayMarker\}<\/span>/,
  );
  for (const field of [
    "date_scrubber_eyebrow",
    "date_scrubber_today_action",
    "date_scrubber_today_marker",
    "date_scrubber_moving_now_label",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
});

test("Today's Sky date scrubber supplies all seven locales and matching registry defaults", async () => {
  const { activeLocales } =
    await import("../../src/data/localization-contract.ts");
  const { getTodaysSkyDateScrubberCopy } =
    await import("../../src/data/locale/todays-sky/sections/date-scrubber.ts");
  const { getTodaysSkyDefaults } =
    await import("../../src/data/public-copy.ts");

  for (const { code } of activeLocales) {
    const copy = getTodaysSkyDateScrubberCopy(code);
    assert.ok(Object.values(copy).every((value) => value.trim().length > 0));
    const defaults = getTodaysSkyDefaults(code);
    assert.equal(defaults.date_scrubber_eyebrow, copy.eyebrow);
    assert.equal(defaults.date_scrubber_today_action, copy.todayAction);
    assert.equal(defaults.date_scrubber_today_marker, copy.todayMarker);
    assert.equal(defaults.date_scrubber_moving_now_label, copy.movingNowLabel);
  }
});

test("Today's Sky date scrubber preserves reference geometry and mobile containment", async () => {
  const styles = await read(
    "src/styles/todays-sky/sections/todays-sky-date-scrubber.css",
  );

  assert.match(styles, /inline-size: min\(100%, 73\.75rem\)/);
  assert.match(styles, /padding: 1\.5rem 2\.125rem 0/);
  assert.match(styles, /border-radius: 1\.25rem/);
  assert.match(styles, /inset-inline-start: calc\(20% \+ 0\.45rem\)/);
  assert.match(styles, /block-size: 0\.3125rem/);
  assert.match(styles, /inline-size: 1\.5rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Today's Sky date scrubber has a physical forward migration", async () => {
  const migration = await read(
    "migrations/0015_todays_sky_date_scrubber_content.sql",
  );

  for (const field of [
    "date_scrubber_eyebrow",
    "date_scrubber_today_action",
    "date_scrubber_today_marker",
  ]) {
    assert.match(
      migration,
      new RegExp(`ALTER TABLE ec_site_todays_sky ADD COLUMN ${field} TEXT`),
    );
  }
});

test("Today's Sky date scrubber renders six provider-supplied position pills", async () => {
  const [component, page, migration] = await Promise.all([
    read("src/components/todays-sky/sections/TodaysSkyDateScrubber.astro"),
    read("src/pages/todays-sky.astro"),
    read("migrations/0016_todays_sky_moving_now_content.sql"),
  ]);

  assert.match(component, /positions: SkyBodyPosition\[\]/);
  assert.match(component, /positions\.slice\(0, 6\)\.map/);
  assert.match(component, /data-sky-position=\{position\.id\}/);
  assert.match(component, /data-sky-position-value/);
  assert.match(component, /data-sky-position-motion/);
  assert.match(component, /range\.addEventListener\("change"/);
  assert.match(page, /const providerSky = await getSkyForDate\(\{/);
  assert.match(page, /positions=\{providerSky\.positions\}/);
  assert.doesNotMatch(component, /getSkyStripPositions|getSkyBodyPositions/);
  assert.match(
    migration,
    /ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_moving_now_label TEXT/,
  );
  assert.doesNotMatch(component, /9° Cancer|22° Libra|14° Cancer/);
});
