import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const fields = [
  "blog_intro_eyebrow",
  "blog_intro_title_accent",
  "blog_intro_title_rest",
  "blog_featured_eyebrow",
  "blog_featured_title",
  "blog_featured_excerpt",
  "blog_featured_author",
  "blog_featured_read_time",
];

test("Blog index intro and featured article use approved shared components", async () => {
  const component = await read(
    "src/components/blog/sections/BlogIndexFeatured.astro",
  );
  const styles = await read(
    "src/styles/blog/sections/blog-index-featured.css",
  );

  assert.match(component, /import ArticleCard from "\.\.\/\.\.\/shared\/ArticleCard\.astro"/);
  assert.match(component, /import PageIntro from "\.\.\/\.\.\/shared\/PageIntro\.astro"/);
  assert.match(component, /variant="featured"/);
  assert.match(component, /headingMeasure="full"/);
  assert.match(component, /coverTone="terracotta"/);
  assert.match(component, /glyph="⊗"/);
  assert.match(styles, /inline-size: min\(100%, 70rem\)/);
  assert.match(styles, /max-inline-size: 52rem/);
  assert.match(styles, /text-wrap: wrap/);
  assert.match(styles, /padding: 4\.375rem 2\.125rem 2\.125rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Blog route keeps the approved first section with full shared chrome", async () => {
  const page = await read("src/pages/blog.astro");

  assert.match(page, /loadPublicPageContent\(Astro, "blog"\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<BlogIndexFeatured/);
  assert.match(page, /<Footer/);
  assert.match(page, /\/blog\/the-lot-of-fortune-explained/);
  assert.doesNotMatch(page, /BlogArticleBody/);
});

test("Blog Content Studio target and locale defaults are aligned", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getBlogDefaults } = await import("../../src/data/public-copy.ts");
  const { getBuilderEntryConfig, getBuilderPageTargets } = await import(
    "../../src/builder/registry.ts"
  );
  const englishKeys = Object.keys(getBlogDefaults("en")).sort();

  assert.deepEqual(getBuilderPageTargets("blog"), [
    { collection: "site_blog", entry: "blog" },
    { collection: "site_blog_articles", entry: "articles" },
    { collection: "site_blog_article_bodies", entry: "bodies" },
  ]);
  const registered = new Set(
    getBuilderEntryConfig("site_blog", "blog")?.editableFields.map(
      (field) => field.slug,
    ),
  );

  for (const locale of activeLocaleCodes) {
    const defaults = getBlogDefaults(locale);
    assert.deepEqual(Object.keys(defaults).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof defaults[field], "string", `${locale} missing ${field}`);
      assert.notEqual(defaults[field].trim(), "", `${locale} empty ${field}`);
    }
  }
  for (const field of [...fields, "seo_title", "seo_description"]) {
    assert.equal(registered.has(field), true, `${field} should be registered`);
  }
});

test("Blog fields have an executable bounded migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0066_blog_index_featured_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_blog)")
      .all()
      .map((column) => column.name),
  );

  const requiredEmDashColumns = [
    "author_id",
    "primary_byline_id",
    "created_at",
    "updated_at",
    "published_at",
    "scheduled_at",
    "deleted_at",
    "version",
    "live_revision_id",
    "draft_revision_id",
    "translation_group",
    "title",
  ];

  for (const field of [...requiredEmDashColumns, ...fields]) {
    assert.equal(columns.has(field), true, `${field} was not migrated`);
  }
  assert.ok(columns.size < 60);
  sqlite.close();
});
