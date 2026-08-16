import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Related articles match the reference using approved shared components", async () => {
  const component = await read(
    "src/components/blog/sections/BlogRelatedArticles.astro",
  );
  const styles = await read(
    "src/styles/blog/sections/blog-related-articles.css",
  );

  assert.match(component, /import ArticleCard from "\.\.\/\.\.\/shared\/ArticleCard\.astro"/);
  assert.match(component, /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/);
  assert.match(component, /import SectionHeading from "\.\.\/\.\.\/shared\/SectionHeading\.astro"/);
  assert.match(component, /variant="compact"/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /mobileColumns=\{1\}/);
  assert.match(component, /editAttributes\("blog_related_title"\)/);
  assert.match(styles, /inline-size: min\(100%, 62\.5rem\)/);
  assert.match(styles, /padding: 3\.75rem 2\.125rem/);
  assert.match(styles, /min-block-size: 8\.75rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Each Blog article renders three different localized related destinations", async () => {
  const page = await read("src/pages/blog/[slug].astro");

  assert.match(page, /\.filter\(\(item\) => item\.key !== article\.key\)/);
  assert.match(page, /\.slice\(0, 3\)/);
  assert.match(page, /content\[item\.categoryField\]/);
  assert.match(page, /content\[item\.titleField\]/);
  assert.match(page, /localizePath\(`\/blog\/\$\{item\.slug\}`, locale\)/);
  assert.match(page, /title=\{content\.blog_related_title\}/);
  assert.match(page, /<BlogRelatedArticles/);
});

test("Related heading remains localized, editable, and stored with article bodies", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getBlogArticleBodyCopy } = await import(
    "../../src/data/locale/blog/sections/article-body.ts"
  );
  const { getBuilderFieldTarget } = await import(
    "../../src/builder/registry.ts"
  );

  for (const locale of activeLocaleCodes) {
    assert.notEqual(
      getBlogArticleBodyCopy(locale).blog_related_title.trim(),
      "",
      `${locale} related heading should not be empty`,
    );
  }
  assert.deepEqual(getBuilderFieldTarget("blog_related_title", "blog"), {
    collection: "site_blog_article_bodies",
    entry: "bodies",
  });
});

test("Related heading has a bounded executable forward migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0082_blog_article_body_content.sql"));
  sqlite.exec(await read("migrations/0095_blog_related_articles_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_blog_article_bodies)")
      .all()
      .map((column) => column.name),
  );

  assert.equal(columns.has("blog_related_title"), true);
  assert.ok(columns.size < 70);
  sqlite.close();
});
