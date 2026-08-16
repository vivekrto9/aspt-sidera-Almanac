import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/home/sections/HomeBlog.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/home/sections/home-blog.css",
  import.meta.url,
);
const pagePath = new URL("../../src/pages/index.astro", import.meta.url);
const migrationPath = new URL(
  "../../migrations/0039_home_blog_content.sql",
  import.meta.url,
);

const editableFields = [
  "home_blog_title_accent",
  "home_blog_title_rest",
  "home_blog_tagline",
  "home_blog_browse_label",
  ...Array.from({ length: 3 }, (_, index) => [
    `home_blog_post_${index + 1}_category`,
    `home_blog_post_${index + 1}_title`,
    `home_blog_post_${index + 1}_excerpt`,
    `home_blog_post_${index + 1}_image_alt`,
  ]).flat(),
];

test("Home Blog composes only approved shared editorial components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import ArticleCard[\s\S]*shared\/ArticleCard\.astro/);
  assert.match(source, /import Button[\s\S]*shared\/Button\.astro/);
  assert.match(source, /import CardGrid[\s\S]*shared\/CardGrid\.astro/);
  assert.match(source, /import SectionHeading[\s\S]*shared\/SectionHeading\.astro/);
  assert.match(source, /columns=\{3\}/);
  assert.match(source, /tabletColumns=\{2\}/);
  assert.match(source, /mobileColumns=\{1\}/);
  assert.doesNotMatch(source, /<script|fetch\(|localStorage|sessionStorage/);
});

test("Home Blog forwards exact visible-copy edit identities", async () => {
  const source = await readFile(componentPath, "utf8");

  for (const field of ["category", "title", "excerpt", "image_alt"]) {
    assert.match(source, new RegExp(`edit\\("${field}"\\)`));
  }
  for (const field of [
    "title_accent",
    "title_rest",
    "tagline",
    "browse_label",
  ]) {
    assert.match(source, new RegExp(`editAttributes\\("${field}"\\)`));
  }
});

test("Home Blog preserves the Meridian editorial measure", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /padding: 6\.25rem 2\.125rem/);
  assert.match(styles, /background: var\(--color-bg\)/);
  assert.match(styles, /inline-size: min\(100%, 75rem\)/);
  assert.match(styles, /margin-block-start: 2\.375rem/);
  assert.match(styles, /text-overflow: ellipsis/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});

test("Home route mounts Blog with localized navigation and exact edit prefix", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /import HomeBlog from "\.\.\/components\/home\/sections\/HomeBlog\.astro"/,
  );
  assert.match(source, /<HomeBlog/);
  assert.match(source, /actionHref=\{localizePath\("\/blog", locale\)\}/);
  assert.match(
    source,
    /componentEditAttributes\(builderEdit\(`home_blog_\$\{field\}`\)\)/,
  );
});

test("all active locales provide three aligned posts in a bounded target", async () => {
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const { getHomeBlogCopy } = await import(
    "../../src/data/locale/home/sections/blog.ts"
  );
  const { getHomeDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");
  const config = getBuilderEntryConfig("site_home_blog", "home");
  const registeredFields = new Set(config?.editableFields.map((field) => field.slug));

  assert.ok(config);
  assert.equal(config.editableFields.length, editableFields.length);
  assert.deepEqual(
    getBuilderFieldTarget("home_blog_post_3_excerpt", "home"),
    { collection: "site_home_blog", entry: "home" },
  );
  assert.ok(
    getBuilderPageTargets("home").some(
      (target) => target.collection === "site_home_blog" && target.entry === "home",
    ),
  );

  for (const field of editableFields) {
    assert.equal(registeredFields.has(field), true, `${field} is not registered`);
  }

  for (const locale of activeLocaleCodes) {
    const copy = getHomeBlogCopy(locale);
    const defaults = getHomeDefaults(locale);
    assert.equal(copy.posts.length, 3, `${locale} must provide three posts`);
    for (const field of editableFields) {
      assert.equal(typeof defaults[field], "string", `${locale} is missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} has empty ${field}`);
    }
  }
});

test("Home Blog migration creates its bounded physical collection", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await readFile(migrationPath, "utf8"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_home_blog)")
      .all()
      .map((column) => column.name),
  );

  for (const field of editableFields) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 100);
  sqlite.close();
});
