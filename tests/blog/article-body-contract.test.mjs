import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Blog article body follows the editorial reference and reuses Avatar", async () => {
  const component = await read(
    "src/components/blog/sections/BlogArticleBody.astro",
  );
  const styles = await read("src/styles/blog/sections/blog-article-body.css");

  assert.match(component, /import Avatar from "\.\.\/\.\.\/shared\/Avatar\.astro"/);
  assert.match(component, /block\.kind === "heading"/);
  assert.match(component, /block\.kind === "quote"/);
  assert.match(component, /editAttributes\(block\.field\)/);
  assert.match(component, /editAttributes\("blog_article_author_bio"\)/);
  assert.match(styles, /inline-size: min\(100%, 42\.5rem\)/);
  assert.match(styles, /font: 400 1\.0625rem \/ 1\.75/);
  assert.match(styles, /border-inline-start: 3px solid/);
  assert.match(styles, /--avatar-size: 3\.25rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Dynamic Blog article route renders editable body blocks before the footer", async () => {
  const page = await read("src/pages/blog/[slug].astro");

  assert.match(page, /blogArticleBodyKinds\[article\.key\]\.map/);
  assert.match(page, /<BlogArticleHeader/);
  assert.match(page, /<BlogArticleBody/);
  assert.match(page, /authorBio=\{content\.blog_article_author_bio\}/);
  assert.match(page, /<BlogRelatedArticles/);
});

test("Every locale has a complete body matching each article block contract", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { blogArticleBodyKinds } = await import(
    "../../src/data/blog/articles.ts"
  );
  const { getBlogArticleBodyCopy } = await import(
    "../../src/data/locale/blog/sections/article-body.ts"
  );
  const englishKeys = Object.keys(getBlogArticleBodyCopy("en")).sort();
  const expectedCount =
    2 +
    Object.values(blogArticleBodyKinds).reduce(
      (total, kinds) => total + kinds.length,
      0,
    );

  assert.equal(englishKeys.length, expectedCount);
  for (const locale of activeLocaleCodes) {
    const copy = getBlogArticleBodyCopy(locale);
    assert.deepEqual(Object.keys(copy).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.equal(typeof copy[field], "string", `${locale} missing ${field}`);
      assert.notEqual(copy[field].trim(), "", `${locale} empty ${field}`);
    }
  }
});

test("Blog body fields use a bounded supplemental Content Studio collection", async () => {
  const { getBuilderEntryConfig, getBuilderFieldTarget, getBuilderPageTargets } =
    await import("../../src/builder/registry.ts");

  assert.deepEqual(getBuilderPageTargets("blog"), [
    { collection: "site_blog", entry: "blog" },
    { collection: "site_blog_articles", entry: "articles" },
    { collection: "site_blog_article_bodies", entry: "bodies" },
  ]);
  assert.deepEqual(
    getBuilderFieldTarget("blog_article_lot_fortune_body_1", "blog"),
    { collection: "site_blog_article_bodies", entry: "bodies" },
  );
  assert.equal(
    getBuilderEntryConfig(
      "site_blog_article_bodies",
      "bodies",
    )?.editableFields.some(
      (field) => field.slug === "blog_article_mercury_retrograde_body_7",
    ),
    true,
  );
});

test("Blog article body migration is executable and stays below the D1 column limit", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0082_blog_article_body_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_blog_article_bodies)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "blog_article_author_bio",
    "blog_article_lot_fortune_body_1",
    "blog_article_lot_fortune_body_8",
    "blog_article_mercury_retrograde_body_7",
  ]) {
    assert.equal(columns.has(field), true, `${field} should be migrated`);
  }
  assert.ok(columns.size < 70);
  sqlite.close();
});
