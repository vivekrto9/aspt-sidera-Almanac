import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Account route contains only the authenticated shell and shared chrome", async () => {
  const page = await read("src/pages/account.astro");

  assert.match(page, /loadPublicPageContent\(Astro, "account"\)/);
  assert.match(page, /getCustomerSession/);
  assert.match(page, /Astro\.redirect\(loginRedirectHref, 302\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<AccountShellNavigation/);
  assert.match(page, /<Footer/);
  assert.match(page, /<AccountSettings/);
});

test("Account shell matches the reference navigation and runtime-data boundary", async () => {
  const component = await read(
    "src/components/account/sections/AccountShellNavigation.astro",
  );
  const profile = await read("src/data/account/shell.ts");

  assert.match(component, /account-shell__rail/);
  assert.doesNotMatch(component, /aria-current=\{item\.active/);
  assert.match(component, /<script is:inline>/);
  assert.match(component, /dataset\.accountInitialSection/);
  assert.match(component, /window\.location\.hash\.slice\(1\)/);
  assert.match(component, /data-account-section-link=\{item\.id\}/);
  assert.match(component, /section\.scrollIntoView\(\{/);
  assert.match(
    component,
    /behavior: reduceMotion\.matches \? "auto" : "smooth"/,
  );
  assert.match(component, /account-shell__navigation-link--active", isActive/);
  assert.match(component, /link\.setAttribute\("aria-current", "page"\)/);
  assert.match(
    component,
    /window\.addEventListener\("hashchange", syncActiveLinkToHash\)/,
  );
  assert.match(component, /const syncActiveLinkToScroll = \(\) =>/);
  assert.match(component, /entry\.section\.getBoundingClientRect\(\)\.top <= probeLine/);
  assert.match(component, /window\.requestAnimationFrame/);
  assert.match(
    component,
    /window\.addEventListener\("scroll", queueScrollSync, \{ passive: true \}\)/,
  );
  assert.match(component, /document\.documentElement\.scrollHeight > window\.innerHeight \+ 2/);
  assert.match(component, /document\.documentElement\.scrollHeight - 2/);
  assert.match(component, /data-account-sign-out/);
  assert.match(component, /customer-auth\/logout/);
  assert.match(profile, /account\?\.displayName/);
  assert.match(profile, /fixtureDisplayName = "Mara Ellison"/);
  assert.match(profile, /displayName\.trim\(\)\[0\]/);
});

test("Account shell is responsive and keeps one restrained rail", async () => {
  const styles = await read(
    "src/styles/account/sections/account-shell-navigation.css",
  );

  assert.match(styles, /grid-template-columns: 15\.625rem minmax\(0, 1fr\)/);
  assert.match(styles, /position: sticky/);
  assert.match(
    styles,
    /\.account-shell__navigation \{[\s\S]*align-items: stretch/,
  );
  assert.match(
    styles,
    /\.account-shell__navigation-link \{[\s\S]*inline-size: 100%/,
  );
  assert.match(
    styles,
    /body\[data-builder-edit-mode\][\s\S]*\.account-shell__navigation-link--active[\s\S]*\[data-builder-edit\]:hover[\s\S]*background: transparent[\s\S]*color: var\(--color-surface\)[\s\S]*caret-color: var\(--color-surface\)/,
  );
  assert.match(
    styles,
    /\.account-shell__navigation-link--active:hover \{[\s\S]*background: var\(--color-dark\)[\s\S]*color: var\(--color-surface\)/,
  );
  assert.match(
    styles,
    /:root\[data-account-initial-section="orders"\][\s\S]*data-account-section-link="orders"/,
  );
  assert.match(
    styles,
    /:root\[data-account-initial-section="wallet"\][\s\S]*data-account-section-link="wallet"/,
  );
  assert.match(styles, /@media \(max-width: 56rem\)/);
  assert.match(styles, /flex-direction: row/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(
    styles,
    /\.account-shell__sign-out:hover:not\(:disabled\) \{[^}]*background: var\(--color-danger-soft\)[^}]*color: var\(--color-primary-strong\)/s,
  );
});

test("Account copy and Content Studio contract cover all seven locales", async () => {
  const locale = await read(
    "src/data/locale/account/sections/shell-navigation.ts",
  );
  const defaults = await read("src/data/public-copy.ts");
  const registry = await read("src/builder/registry.ts");
  const page = await read("src/pages/account.astro");
  const migration = await read(
    "migrations/0073_account_shell_navigation_content.sql",
  );

  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  }
  assert.match(defaults, /getAccountDefaults/);
  assert.match(registry, /site_account/);
  assert.match(
    registry,
    /(?:\["account", \{ collection: "site_account"|page === "account"[\s\S]*collection: "site_account")/,
  );
  assert.match(page, /builderEdit\(field\)/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ec_site_account/);
});
