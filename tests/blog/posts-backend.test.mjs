import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("Blog seed exposes six localized posts through one reusable EmDash collection", async () => {
  const seed = JSON.parse(read("seed/seed.json"));
  const { activeLocaleCodes } = await import("../../src/data/localization-contract.ts");
  const posts = seed.content.posts;
  const collection = seed.collections.find((item) => item.slug === "posts");

  assert.ok(collection);
  assert.equal(collection.urlPattern, "/blog/{slug}");
  assert.deepEqual(
    collection.fields.map((field) => field.slug),
    ["title", "excerpt", "content", "featured_image", "author", "category", "read_time", "tags", "related"],
  );
  assert.equal(posts.length, activeLocaleCodes.length * 6);
  for (const locale of activeLocaleCodes) {
    const localized = posts.filter((post) => post.locale === locale);
    assert.equal(localized.length, 6);
    assert.equal(localized.every((post) => post.status === "published"), true);
    assert.equal(localized.every((post) => post.data.content.length >= 7), true);
    assert.equal(localized.every((post) => post.data.related.length === 3), true);
  }
});

test("Blog runtime reads published posts and preserves the static Content Studio fallback", () => {
  const data = read("src/data/blog/posts.ts");
  const index = read("src/pages/blog.astro");
  const detail = read("src/pages/blog/[slug].astro");

  assert.match(data, /getEmDashCollection/);
  assert.match(data, /getEmDashEntry/);
  assert.match(data, /status: "published"/);
  assert.match(data, /_emdash\/api\/media\/file/);
  assert.match(index, /dynamicPost\?\.title \?\? content/);
  assert.match(detail, /dynamicPost\?\.blocks\.length/);
  assert.match(detail, /staticBodyBlocks/);
  assert.match(detail, /blog_article_author_bio/);
});

test("Blog post schema is migrated and seeded only by explicit bootstrap", () => {
  const migration = read("migrations/0105_blog_posts_collection.sql");
  const bootstrap = read("src/server/generated-site/emdash-bootstrap.ts");

  assert.match(migration, /CREATE TABLE IF NOT EXISTS ec_posts/);
  assert.match(migration, /UNIQUE\(slug, locale\)/);
  assert.match(migration, /featured_image TEXT/);
  assert.match(bootstrap, /ensureBlogPostSeeds/);
  assert.match(bootstrap, /seed\/seed\.json/);
  assert.doesNotMatch(read("src/data/blog/posts.ts"), /INSERT|UPDATE|DELETE|CREATE TABLE/i);
});
