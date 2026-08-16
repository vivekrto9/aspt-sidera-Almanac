import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Breadcrumb.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/breadcrumb.css",
  import.meta.url,
);

test("Breadcrumb keeps native trail semantics and a prepared current page", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type BreadcrumbItem =/);
  assert.match(source, /items: BreadcrumbItem\[\]/);
  assert.match(source, /<nav class=\{classes\} id=\{id\} aria-label=\{ariaLabel\}>/);
  assert.match(source, /<ol class="breadcrumb__list">/);
  assert.match(source, /aria-current=\{isCurrent \? "page" : undefined\}/);
  assert.match(source, /visibleItems\.length > 0/);
  assert.doesNotMatch(source, /<script/);
});

test("Breadcrumb localizes internal destinations without selecting locale policy", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /localizePath/);
  assert.match(source, /locale\?: SupportedLocale/);
  assert.match(source, /locale = defaultLocale/);
  assert.match(source, /localizePath\(item\.href, locale\)/);
  assert.match(source, /editAttributes\?: Record<string, string>/);
});

test("Breadcrumb exposes only the two literal reference separators", async () => {
  const source = await readFile(componentPath, "utf8");
  const styles = await readFile(stylesheetPath, "utf8");

  assert.match(source, /type BreadcrumbSeparator = "chevron" \| "slash"/);
  assert.match(source, /separator === "slash" \? "\/" : "›"/);
  assert.match(styles, /\.breadcrumb__link:hover/);
  assert.match(styles, /\.breadcrumb__link:focus-visible/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /\.breadcrumb__item \{[\s\S]*flex: none/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
