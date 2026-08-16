import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeHero.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-hero.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const layoutPath = new URL(
  "../../src/layouts/BaseLayout.astro",
  import.meta.url,
);
const registryPath = new URL("../../src/builder/registry.ts", import.meta.url);

test("Home Hero composes the approved shared actions without the decorative wheel", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(
    source,
    /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/,
  );
  assert.match(source, /<Button[\s\S]*href=\{primaryHref\}/);
  assert.match(source, /<Button[\s\S]*href=\{secondaryHref\}/);
  assert.doesNotMatch(source, /ChartWheel|home-hero__visual|home-hero__wheel/);
});

test("Home Hero keeps visible copy and edit bindings caller-owned", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const prop of [
    "kicker: string",
    "title: string",
    "body: string",
    "primaryCta: string",
    "secondaryCta: string",
    "proofs: ProofItem[]",
  ]) {
    assert.match(
      source,
      new RegExp(prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }

  assert.match(source, /\{\.\.\.kickerEditAttributes\}/);
  assert.match(source, /\{\.\.\.titleEditAttributes\}/);
  assert.match(source, /\{\.\.\.bodyEditAttributes\}/);
  assert.match(source, /editAttributes=\{primaryCtaEditAttributes\}/);
  assert.match(source, /editAttributes=\{secondaryCtaEditAttributes\}/);
  assert.doesNotMatch(
    source,
    /Astrology, done properly|Read the sky|Create your free chart/,
  );
});

test("Home Hero preserves the Meridian centered field, wrapping proofs, and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /inline-size: min\(100%, 72\.5rem\)/);
  assert.match(styles, /justify-items: center/);
  assert.match(styles, /font-size: clamp\(3rem, 7\.4vw, 6\.125rem\)/);
  assert.match(styles, /\.home-hero__proofs\s*\{[^}]*display: flex[^}]*flex-wrap: wrap/s);
  assert.doesNotMatch(styles, /home-hero__visual|home-hero__wheel/);
  assert.match(styles, /@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(styles, /@media \(max-width: 62rem\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.chart-wheel__/);
  assert.doesNotMatch(styles, /\.sidera-button/);
});

test("Home route prepares localized chrome and mounts the approved Home sections", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import Header from "\.\.\/components\/shared\/Header\.astro"/,
  );
  assert.match(
    source,
    /import HomeHero from "\.\.\/components\/home\/sections\/HomeHero\.astro"/,
  );
  assert.match(source, /activeLocales/);
  assert.match(source, /localizePath\("\/birth-chart", locale\)/);
  assert.match(source, /localizePath\("\/todays-sky", locale\)/);
  assert.match(source, /builderEdit\("hero_title"\)/);
  assert.match(source, /chromeEdit\("nav_todays_sky"\)/);
  assert.match(
    source,
    /const field = `language_option_\$\{item\.code\}_label`/,
  );
  assert.match(source, /label: content\[field\] \|\| item\.nativeName/);
  assert.match(
    source,
    /editAttributes: componentEditAttributes\(chromeEdit\(field\)\)/,
  );
  assert.doesNotMatch(source, /class="features"/);
  assert.doesNotMatch(source, /class="site-footer"/);
});

test("Home completes the Content Studio first-section gate", async () => {
  const page = await readFile(pagePath, "utf8");
  const layout = await readFile(layoutPath, "utf8");
  const registry = await readFile(registryPath, "utf8");
  const { getBuilderEntryConfig } =
    await import("../../src/builder/registry.ts");

  assert.match(page, /loadPublicPageContent\(Astro, "home"\)/);
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
  for (const field of [
    "hero_kicker",
    "hero_title",
    "hero_body",
    "hero_primary_cta",
    "hero_secondary_cta",
    "hero_proof_1",
    "hero_proof_2",
    "hero_proof_3",
  ]) {
    assert.match(page, new RegExp(`builderEdit\\("${field}"\\)`));
  }
  assert.match(layout, /<BuilderToolbar \{\.\.\.builderToolbar\} \/>/);
  assert.match(registry, /\["site_pages\/home", entries\[0\]\]/);
  assert.match(registry, /\["site_chrome\/main", entries\[1\]\]/);
  const chromeFields = new Set(
    getBuilderEntryConfig("site_chrome", "main")?.editableFields.map(
      (field) => field.slug,
    ),
  );
  assert.equal(chromeFields.has("nav_more"), true);
  for (const locale of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.equal(
      chromeFields.has(`language_option_${locale}_label`),
      true,
      `site_chrome/main should register the ${locale} option label`,
    );
  }
});

test("all active locales provide aligned Header, Hero, and SEO defaults", async () => {
  const { activeLocaleCodes } =
    await import("../../src/data/localization-contract.ts");
  const { getChromeDefaults, getHomeDefaults } =
    await import("../../src/data/public-copy.ts");
  const requiredHomeFields = [
    "hero_kicker",
    "hero_title",
    "hero_body",
    "hero_primary_cta",
    "hero_secondary_cta",
    "hero_proof_1",
    "hero_proof_2",
    "hero_proof_3",
    "hero_chart_title",
    "hero_chart_description",
    "seo_title",
    "seo_description",
  ];
  const requiredChromeFields = [
    "brand_name",
    "brand_aria_label",
    "primary_navigation_label",
    "nav_todays_sky",
    "nav_charts",
    "nav_compatibility",
    "nav_moon",
    "nav_horoscope",
    "nav_astrologers",
    "nav_more",
    "nav_blog",
    "nav_shop",
    "action_sign_in",
    "action_get_chart",
    "language_trigger_label",
    "language_menu_label",
    "language_option_en_label",
    "language_option_es_label",
    "language_option_fr_label",
    "language_option_pt_label",
    "language_option_ru_label",
    "language_option_it_label",
    "language_option_de_label",
    "menu_open_label",
    "menu_close_label",
  ];

  assert.deepEqual(activeLocaleCodes, [
    "en",
    "es",
    "fr",
    "pt",
    "ru",
    "it",
    "de",
  ]);

  const expectedBlogLabels = {
    en: "Blog",
    es: "Artículos",
    fr: "Articles",
    pt: "Artigos",
    ru: "Статьи",
    it: "Articoli",
    de: "Artikel",
  };
  const expectedMoreLabels = {
    en: "More",
    es: "Más",
    fr: "Plus",
    pt: "Mais",
    ru: "Ещё",
    it: "Altro",
    de: "Mehr",
  };

  for (const locale of activeLocaleCodes) {
    const home = getHomeDefaults(locale);
    const chrome = getChromeDefaults(locale);
    assert.equal(chrome.nav_blog, expectedBlogLabels[locale]);
    assert.equal(chrome.nav_more, expectedMoreLabels[locale]);
    for (const field of requiredHomeFields) {
      assert.equal(
        typeof home[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(home[field].trim(), "", `${locale} has empty ${field}`);
    }
    for (const field of requiredChromeFields) {
      assert.equal(
        typeof chrome[field],
        "string",
        `${locale} is missing ${field}`,
      );
      assert.notEqual(chrome[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("selecting English clears a saved non-default locale and keeps the explicit render locale", async () => {
  const page = await readFile(pagePath, "utf8");
  const layout = await readFile(layoutPath, "utf8");

  assert.match(
    page,
    /if \(locale === defaultLocale\)[\s\S]*url\.searchParams\.delete\("locale"\)[\s\S]*url\.searchParams\.set\("locale", defaultLocale\)/,
  );
  assert.match(
    layout,
    /if \(requestedLocale && activeLocaleSet\.has\(requestedLocale\)\)/,
  );
  assert.match(
    layout,
    /window\.localStorage\.setItem\(localeStorageKey, requestedLocale\)/,
  );
  assert.doesNotMatch(layout, /requestedLocale === defaultLocale/);
  assert.doesNotMatch(layout, /currentUrl\.searchParams\.delete\("locale"\)/);
  assert.doesNotMatch(layout, /window\.history\.replaceState/);
});
