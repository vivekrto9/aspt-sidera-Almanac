import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/birth-chart/sections/BirthChartFormWizard.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/birth-chart/sections/form-wizard.css",
  import.meta.url,
);
const routePath = new URL("../../src/pages/birth-chart.astro", import.meta.url);
const copyPath = new URL(
  "../../src/data/locale/birth-chart/sections/form-wizard.ts",
  import.meta.url,
);
const registryPath = new URL("../../src/builder/registry.ts", import.meta.url);

test("Birth Chart form wizard composes approved shared controls", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const component of [
    "Button",
    "DateSelector",
    "FormField",
    "LocationAutocomplete",
    "SelectField",
    "StepProgress",
    "TextField",
    "TimeSelector",
  ]) {
    assert.match(
      source,
      new RegExp(`import ${component} from "../../shared/${component}\\.astro"`),
    );
  }
  assert.doesNotMatch(source, /<input\b|<select\b/);
});

test("Birth Chart form wizard implements the three-step accessible flow", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.equal((source.match(/data-wizard-step="/g) ?? []).length, 3);
  assert.equal((source.match(/<StepProgress/g) ?? []).length, 3);
  assert.match(source, /current=\{1\}/);
  assert.match(source, /current=\{2\}/);
  assert.match(source, /current=\{3\}/);
  assert.match(
    source,
    /<StepProgress[\s\S]*?\/>\s*<p class="birth-chart-wizard__eyebrow"/,
  );
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /checkValidity\(\)/);
  assert.match(source, /reportValidity\(\)/);
  assert.match(source, /invalid\.focus\(\)/);
  assert.match(source, /new CustomEvent\("birthchartsubmit"/);
  assert.match(source, /new FormData\(form\)/);
  assert.doesNotMatch(source, /data-unavailable-label/);
  assert.doesNotMatch(source, /\bfetch\(|fake|mock result/i);
});

test("Birth Chart visible wizard copy exposes Content Studio edit bindings", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const field of [
    "panel_kicker",
    "panel_title_accent",
    "panel_title_rest",
    "date_title",
    "name_placeholder",
    "time_title",
    "unknown_time_label",
    "place_title",
    "location_placeholder",
    "house_system_label",
    "back_label",
    "continue_label",
    "cast_label",
  ]) {
    assert.match(source, new RegExp(`edit\\("${field}"\\)`));
  }
  assert.match(source, /inputEditAttributes=\{edit\("location_placeholder"\)\}/);
});

test("Birth Chart page is a thin localized Builder-backed route", async () => {
  const source = await readFile(routePath, "utf8");

  assert.match(source, /loadPublicPageContent\(Astro, "birth_chart"\)/);
  assert.match(source, /<BaseLayout/);
  assert.match(source, /import Header from "\.\.\/components\/shared\/Header\.astro"/);
  assert.match(source, /<Header/);
  assert.match(source, /navigation=\{navigation\}/);
  assert.match(source, /actions=\{actions\}/);
  assert.match(source, /options: languageOptions/);
  assert.match(source, /current: true/);
  assert.match(source, /<BirthChartExperience/);
  assert.match(source, /builderToolbar=\{\{/);
  assert.match(source, /reviewTargets/);
  assert.match(source, /localizePath\("\/", locale\)/);
  assert.match(source, /value === true \? "true" : value/);
  assert.match(source, /builderEdit\(field\)/);
  assert.match(source, /chromeEdit\("brand_name"\)/);
  assert.match(source, /Astro\.url\.searchParams\.get\("profileId"\)/);
  assert.match(source, /getCustomerUserProfile/);
  assert.match(source, /prepareBirthChartProfilePrefill/);
  assert.match(source, /initialProfile=\{initialProfile\}/);
});

test("Birth Chart accepts an owned saved-profile prefill but still asks for house system", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /value=\{initialProfile\?\.name\}/);
  assert.match(source, /monthValue=\{initialMonth/);
  assert.match(source, /hourValue=\{initialHour\}/);
  assert.match(source, /selectedLocation=\{initialProfile\?\.selectedLocation\}/);
  assert.match(source, /name="houseSystem"/);
  assert.match(source, /value="placidus"/);
});

test("Birth Chart wizard leaves global navigation outside the three-step form", async () => {
  const [component, route] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(routePath, "utf8"),
  ]);

  assert.doesNotMatch(component, /BrandLogo|birth-chart-wizard__topbar/);
  assert.doesNotMatch(component, /data-wizard-step-number|data-progress-dot/);
  assert.match(component, /class="birth-chart-wizard__steps"/);
  assert.match(route, /id="birth-chart-header"/);
});

test("Birth Chart copy and registry cover all active locales and release wiring", async () => {
  const [copy, registry] = await Promise.all([
    readFile(copyPath, "utf8"),
    readFile(registryPath, "utf8"),
  ]);

  assert.match(
    copy,
    /satisfies Record<SupportedLocale, BirthChartFormWizardCopy>/,
  );
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(copy, new RegExp(`\\b${locale}:`));
  }
  assert.match(registry, /\["site_birth_chart\/birth_chart", entries\[\d+\]\]/);
  assert.match(
    registry,
    /site_birth_chart"?, entry: "birth_chart"/,
  );
  assert.match(registry, /entry: "birth_chart"[\s\S]*getBirthChartDefaults\("en"\)/);
});

test("Birth Chart form wizard retains intentional responsive and motion states", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(source, /@media \(max-width: 50rem\)/);
  assert.match(source, /@media \(max-width: 35rem\)/);
  assert.match(source, /min-inline-size: 0/);
  assert.match(source, /overflow: hidden/);
  assert.match(
    source,
    /\.birth-chart-wizard__story h1\s*\{\s*max-inline-size: 100%/,
  );
  assert.match(
    source,
    /\.birth-chart-wizard__story-copy > p:last-child\s*\{\s*max-inline-size: 100%/,
  );
  assert.match(source, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
