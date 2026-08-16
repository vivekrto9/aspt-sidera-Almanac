import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Header.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/shared/header.css",
  import.meta.url,
);

test("Header composes approved identity, action, and locale components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import BrandLogo from "\.\/BrandLogo\.astro"/);
  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import IconButton from "\.\/IconButton\.astro"/);
  assert.match(
    source,
    /import LanguageDropdown from "\.\/header\/LanguageDropdown\.astro"/,
  );
  assert.match(source, /<BrandLogo/);
  assert.match(source, /<LanguageDropdown/);
  assert.match(source, /<IconButton/);
  assert.match(source, /<Button/);
});

test("Header keeps navigation, locale, and actions caller-owned", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /navigation: NavigationItem\[\]/);
  assert.match(source, /actions\?: HeaderAction\[\]/);
  assert.match(source, /language\?: LanguageConfig/);
  assert.match(source, /editAttributes: Record<string, string>/);
  assert.match(source, /mobileUtilityActionId\?: string/);
  assert.match(source, /const mobileUtilityAction =/);
  assert.match(source, /const mobilePanelActions =/);
  assert.match(source, /primaryNavigationItems\.map\(\(item\)/);
  assert.match(source, /moreNavigationItems\.map\(\(item\)/);
  assert.match(source, /actions\.map\(\(action\)/);
  assert.match(source, /aria-current=\{item\.current/);
  assert.equal(
    (source.match(/options=\{language\.options\}/g) ?? []).length,
    2,
    "desktop and mobile dropdowns should share the prepared editable options",
  );
  assert.match(source, /new CustomEvent\("headeraction"/);
  assert.doesNotMatch(
    source,
    /Today's Sky|Charts|Compatibility|Horoscope|Astrologers|Sign In|Get your chart/,
  );
});

test("Header replaces Sign In with a localized Account destination for customers", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /getCustomerSession\(runtimeEnv, Astro\.request\)/);
  assert.match(source, /customerSession && action\.id === "sign-in"/);
  assert.match(source, /id: "account"/);
  assert.match(source, /const sharedFooterCopy = getSharedFooterCopy\(locale\)/);
  assert.match(source, /label: sharedFooterCopy\.accountLabel/);
  assert.match(source, /href: localizePath\("\/account", locale\)/);
  assert.match(source, /editAttributes: undefined/);
  assert.match(source, /resolvedMobileUtilityActionId/);
  assert.match(source, /resolvedActions\.map\(\(action\)/);
});

test("Header provides semantic desktop and mobile navigation", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /<header[\s\S]*id=\{id\}/);
  assert.match(source, /<nav class="sidera-header__desktop-nav"/);
  assert.match(source, /<nav class="sidera-header__mobile-nav"/);
  assert.match(source, /aria-label=\{navigationLabel\}/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /controls=\{panelId\}/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /closest\("\.sidera-language-dropdown__menu"\)/);
  assert.match(source, /document\.addEventListener\("pointerdown"/);
  assert.match(source, /window\.addEventListener\("resize"/);
  assert.ok(
    source.indexOf('class="sidera-header__mobile-trigger"') <
      source.indexOf("<BrandLogo"),
    "mobile menu trigger should precede the brand in source and focus order",
  );
});

test("Header preserves reference proportions and responsive safeguards", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /\.sidera-header\s*\{[^}]*inline-size: 100%/s);
  assert.match(styles, /inline-size: min\(100%, 87\.5rem\)/);
  assert.match(styles, /padding: 0\.875rem 2\.125rem/);
  assert.match(styles, /gap: 1\.875rem/);
  assert.match(styles, /gap: 1\.5rem/);
  assert.match(styles, /justify-content: flex-end;\s*gap: 0\.9375rem/);
  assert.match(styles, /\.sidera-header__actions\s*\{\s*gap: 0\.9375rem/);
  assert.match(
    styles,
    /\.sidera-header__action \.sidera-button__label\s*\{[^}]*gap: 0\.5rem/s,
  );
  assert.match(
    styles,
    /@media \(max-width: 63\.999rem\)[\s\S]*grid-template-columns: auto minmax\(0, 1fr\) auto;\s*gap: 0\.25rem/,
  );
  assert.match(
    styles,
    /\.sidera-header__brand \.brand-logo__name\s*\{[^}]*overflow-wrap: normal/s,
  );
  assert.match(
    styles,
    /\.sidera-header__menu-button\.icon-button\s*\{[^}]*--icon-button-size: 2\.5rem/s,
  );
  assert.match(styles, /backdrop-filter: blur\(0\.875rem\)/);
  assert.match(styles, /z-index: 60/);
  assert.match(styles, /\.sidera-header--menu-open\s*\{[^}]*z-index: 70/s);
  assert.match(styles, /@media \(max-width: 63\.999rem\)/);
  assert.match(styles, /max-block-size: calc\(100dvh - 4\.25rem\)/);
  assert.match(styles, /overflow-y: auto/);
  assert.match(
    styles,
    /\.sidera-header__mobile-panel:not\(\[hidden\]\)\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/s,
  );
  assert.match(styles, /\.sidera-header__mobile-nav,[\s\S]*inline-size: 100%/);
  assert.match(styles, /min-block-size: 3rem/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
