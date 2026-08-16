import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/header/LanguageDropdown.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/shared/header/language-dropdown.css",
  import.meta.url,
);

test("LanguageDropdown exposes caller-owned locale data and listbox semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /activeLocale: string/);
  assert.match(source, /options: LanguageOption\[\]/);
  assert.match(source, /triggerLabel: string/);
  assert.match(source, /menuLabel: string/);
  assert.match(source, /aria-haspopup="listbox"/);
  assert.match(source, /aria-expanded=/);
  assert.match(source, /aria-controls=\{menuId\}/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /role: "option"/);
  assert.match(source, /"aria-selected": selected/);
  assert.doesNotMatch(source, /English|Español|Français|Português|русский|Italiano|Deutsche/);
});

test("LanguageDropdown supports links and event-driven locale integration", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /editAttributes: Record<string, string>/);
  assert.match(source, /\{\.\.\.option\.editAttributes\}/);
  assert.match(source, /option\.href \? \(/);
  assert.match(source, /href=\{option\.disabled \? undefined : option\.href\}/);
  assert.match(source, /hreflang=\{option\.hreflang\}/);
  assert.match(source, /new CustomEvent\("localechange"/);
  assert.match(source, /const nextLocale = target\.dataset\.locale/);
  assert.match(source, /window\.localStorage\.setItem\(localeStorageKey, nextLocale\)/);
  assert.match(source, /locale: nextLocale/);
  assert.match(source, /href: target\.getAttribute\("href"\)/);
});

test("LanguageDropdown keeps option-label editing separate from locale navigation", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /closest\("\[data-builder-edit\]"\)/);
  assert.match(source, /document\.body\.hasAttribute\("data-builder-edit-mode"\)/);
  assert.match(
    source,
    /document\.body\.hasAttribute\("data-builder-edit-mode"\)[\s\S]*editTarget[\s\S]*return;[\s\S]*const target =/,
  );
});

test("LanguageDropdown implements the approved keyboard and dismissal behavior", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /event\.key === "Enter"/);
  assert.match(source, /event\.key === " "/);
  assert.match(source, /event\.key === "ArrowDown"/);
  assert.match(source, /event\.key === "ArrowUp"/);
  assert.match(source, /event\.key === "Home"/);
  assert.match(source, /event\.key === "End"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key === "Tab"/);
  assert.match(source, /document\.addEventListener\("pointerdown"/);
  assert.match(source, /window\.addEventListener\("resize"/);
  assert.match(source, /setOpen\(false, "trigger"\)/);
});

test("LanguageDropdown contains the menu within desktop and mobile viewports", async () => {
  const component = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesPath, "utf8");

  assert.match(component, /sidera-language-dropdown--drop-up/);
  assert.match(component, /--sidera-language-menu-max-height/);
  assert.match(component, /--sidera-language-menu-shift/);
  assert.match(
    styles,
    /\.sidera-language-dropdown--open\s*\{[^}]*z-index:\s*40/s,
  );
  assert.match(styles, /max-inline-size: calc\(100vw - 1rem\)/);
  assert.match(styles, /overflow-y: auto/);
  assert.match(styles, /overscroll-behavior: contain/);
  assert.match(styles, /min-block-size: 2\.75rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /min-block-size: 3rem/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
