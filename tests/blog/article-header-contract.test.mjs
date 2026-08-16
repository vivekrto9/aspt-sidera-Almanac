import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Blog article header matches the editorial reference with approved shared components", async () => {
  const component = await read(
    "src/components/blog/sections/BlogArticleHeader.astro",
  );
  const styles = await read(
    "src/styles/blog/sections/blog-article-header.css",
  );

  assert.match(component, /import Avatar from "\.\.\/\.\.\/shared\/Avatar\.astro"/);
  assert.match(component, /import Button from "\.\.\/\.\.\/shared\/Button\.astro"/);
  assert.match(component, /data-screen-label="Blog · Article"/);
  assert.match(component, /fallback="initials"/);
  assert.match(component, /editAttributes\(fields\.title\)/);
  assert.match(component, /editAttributes\(fields\.author\)/);
  assert.match(styles, /inline-size: min\(100%, 45rem\)/);
  assert.match(styles, /inline-size: min\(100%, 56\.25rem\)/);
  assert.match(styles, /min-block-size: 16\.25rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /\.blog-article-header__masthead \{[\s\S]*text-align: start/);
  assert.match(styles, /\.blog-article-header__byline \{[\s\S]*justify-content: flex-start/);
});

test("Every prepared Blog article resolves through the dynamic detail header route", async () => {
  const page = await read("src/pages/blog/[slug].astro");
  const { blogArticles } = await import("../../src/data/blog/articles.ts");

  assert.equal(blogArticles.length, 6);
  assert.equal(
    new Set(blogArticles.map((article) => article.slug)).size,
    blogArticles.length,
  );
  assert.match(page, /loadPublicPageContent\(Astro, "blog"\)/);
  assert.match(page, /blogArticles\.find\(\(item\) => item\.slug === slug\)/);
  assert.match(page, /<Header/);
  assert.match(page, /<BlogArticleHeader/);
  assert.match(page, /<BlogArticleBody/);
  assert.match(page, /<Footer/);
  assert.match(page, /<BlogRelatedArticles/);
});

test("Blog article header defaults stay aligned and non-empty for every locale", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getBlogArticleHeaderCopy } = await import(
    "../../src/data/locale/blog/sections/article-header.ts"
  );
  const englishKeys = Object.keys(getBlogArticleHeaderCopy("en")).sort();

  for (const locale of activeLocaleCodes) {
    const copy = getBlogArticleHeaderCopy(locale);
    assert.deepEqual(Object.keys(copy).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.notEqual(copy[field].trim(), "", `${locale} empty ${field}`);
    }
  }
});

test("Blog article header fields use the dedicated supplemental Content Studio target", async () => {
  const { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");

  assert.deepEqual(getBuilderPageTargets("blog"), [
    { collection: "site_blog", entry: "blog" },
    { collection: "site_blog_articles", entry: "articles" },
    { collection: "site_blog_article_bodies", entry: "bodies" },
  ]);
  assert.deepEqual(getBuilderFieldTarget("blog_article_back_label", "blog"), {
    collection: "site_blog_articles",
    entry: "articles",
  });
  assert.equal(
    getBuilderEntryConfig("site_blog_articles", "articles")?.editableFields.some(
      (field) => field.slug === "blog_article_mercury_retrograde_date",
    ),
    true,
  );
});

test("Blog article header fields have a forward executable migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0081_blog_article_header_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_blog_articles)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "blog_article_back_label",
    "blog_article_lot_fortune_category",
    "blog_article_lot_fortune_date",
    "blog_article_aries_rising_author",
    "blog_article_aries_rising_date",
    "blog_article_mercury_retrograde_author",
    "blog_article_mercury_retrograde_date",
  ]) {
    assert.equal(columns.has(field), true, `${field} should be migrated`);
  }
  assert.ok(columns.size < 40);
  sqlite.close();
});
