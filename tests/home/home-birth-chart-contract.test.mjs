import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeBirthChart.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-birth-chart.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0018_home_birth_chart_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_birth_chart_eyebrow",
  "home_birth_chart_title_accent",
  "home_birth_chart_title_rest",
  "home_birth_chart_description",
  "home_birth_chart_form_title",
  "home_birth_chart_date_label",
  "home_birth_chart_time_label",
  "home_birth_chart_unknown_time_label",
  "home_birth_chart_location_label",
  "home_birth_chart_location_placeholder",
  "home_birth_chart_location_start",
  "home_birth_chart_location_searching",
  "home_birth_chart_location_empty",
  "home_birth_chart_location_unavailable",
  "home_birth_chart_location_selected",
  "home_birth_chart_extended_settings_label",
  "home_birth_chart_house_system_label",
  "home_birth_chart_house_placidus",
  "home_birth_chart_house_whole_sign",
  "home_birth_chart_house_koch",
  "home_birth_chart_house_equal",
  "home_birth_chart_show_aspects_label",
  "home_birth_chart_cta",
  "home_birth_chart_wheel_title",
  "home_birth_chart_wheel_description",
  "home_birth_chart_feature_1_title",
  "home_birth_chart_feature_1_body",
  "home_birth_chart_feature_2_title",
  "home_birth_chart_feature_2_body",
  "home_birth_chart_feature_3_title",
  "home_birth_chart_feature_3_body",
];

test("Home Birth Chart composes the approved shared form and chart primitives", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const component of [
    "AstrologyProfileForm",
    "ChartWheel",
    "Checkbox",
    "FormField",
    "SectionHeading",
    "SelectField",
  ]) {
    assert.match(
      source,
      new RegExp(
        `import ${component}[\\s\\S]*from "\\.\\.\\/\\.\\.\\/shared\\/${component}\\.astro"`,
      ),
    );
  }
  assert.match(source, /<AstrologyProfileForm/);
  assert.match(source, /action=\{actionHref\}/);
  assert.match(source, /method="get"/);
  assert.match(source, /<ChartWheel[\s\S]*mode="natal"/);
  assert.match(source, /interactive/);
  assert.match(source, /<details class="home-birth-chart__extended">/);
});

test("Home Birth Chart creates a reading and redirects directly to its result", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /home-birth-chart-show-aspects/);
  assert.match(
    source,
    /aspectLayer\.style\.display = toggle\.checked \? "" : "none"/,
  );
  assert.match(
    source,
    /aspectLayer\.setAttribute\("aria-hidden", toggle\.checked \? "false" : "true"\)/,
  );
  assert.match(
    source,
    /toggle\.addEventListener\("change", synchronizeAspects\)/,
  );
  assert.match(source, /\/api\/astropages\/generated-site\/birth-chart/);
  assert.match(source, /method: "POST"/);
  assert.match(source, /locationValue\("TimezoneOffset"\)/);
  assert.match(source, /body\.readingId/);
  assert.match(source, /window\.location\.assign/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});

test("Home Birth Chart preserves the Meridian workbench and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(
    styles,
    /grid-template-columns: minmax\(0, 0\.85fr\) minmax\(0, 1\.15fr\)/,
  );
  assert.match(styles, /border-radius: 1\.375rem/);
  assert.match(styles, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 52rem\)/);
  assert.match(styles, /@media \(max-width: 46rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Birth Chart with localized navigation and exact edit targeting", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeBirthChart from "\.\.\/components\/home\/sections\/HomeBirthChart\.astro"/,
  );
  assert.match(source, /<HomeBirthChart/);
  assert.match(
    source,
    /actionHref=\{localizePath\("\/birth-chart", locale\)\}/,
  );
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_birth_chart_\$\{field\}`\)\)/,
  );
});

test("all active locales provide aligned Home Birth Chart content and registry fields", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getHomeBirthChartCopy } =
    await import("../../src/data/locale/home/sections/birth-chart.ts");
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const registeredFields = new Set(
    getBuilderEntryConfig("site_home_sections", "home")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  assert.deepEqual(getBuilderPageTargets("home"), [
    { collection: "site_pages", entry: "home" },
    { collection: "site_home_sections", entry: "home" },
    { collection: "site_home_horoscope", entry: "home" },
    { collection: "site_home_astrologers", entry: "home" },
    { collection: "site_home_reports", entry: "home" },
    { collection: "site_home_shop", entry: "home" },
    { collection: "site_home_blog", entry: "home" },
    { collection: "site_home_final_cta", entry: "home" },
  ]);
  for (const field of editableFields) {
    assert.equal(
      registeredFields.has(field),
      true,
      `${field} is not registered`,
    );
  }

  for (const locale of activeLocaleCodes) {
    const content = getHomeDefaults(locale);
    const copy = getHomeBirthChartCopy(locale);

    for (const field of editableFields) {
      assert.equal(
        typeof content[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(
        content[field].trim(),
        "",
        `${locale} has empty ${field}`,
      );
    }
    assert.equal(copy.features.length, 3);
    assert.notEqual(copy.titleAccent.trim(), "");
    assert.notEqual(copy.ctaLabel.trim(), "");
    for (const label of [
      copy.monthLabel,
      copy.dayLabel,
      copy.yearLabel,
      copy.hourLabel,
      copy.minuteLabel,
      copy.periodLabel,
      copy.locationStart,
      copy.locationSearching,
      copy.locationEmpty,
      copy.locationUnavailable,
      copy.locationSelected,
    ]) {
      assert.notEqual(label.trim(), "");
    }
    if (locale !== "en") {
      assert.notEqual(
        copy.locationSearching,
        getHomeBirthChartCopy("en").locationSearching,
      );
    }
  }
});

test("Home Birth Chart has an explicit forward migration for every editable field", async () => {
  const migration = await readFile(migrationPath, "utf8");
  const sqlite = new DatabaseSync(":memory:");

  assert.doesNotMatch(migration, /ALTER TABLE ec_site_pages/);
  sqlite.exec(migration);
  const migratedColumns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_sections)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.match(migration, new RegExp(`${field} TEXT`));
    assert.equal(migratedColumns.has(field), true, `${field} was not migrated`);
  }

  sqlite.close();
});
