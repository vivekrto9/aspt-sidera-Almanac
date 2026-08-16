import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Blog categories and article grid compose approved shared components", async () => {
  const component = await read(
    "src/components/blog/sections/BlogCategoriesGrid.astro",
  );
  const page = await read("src/pages/blog.astro");

  assert.match(component, /import ArticleCard from "\.\.\/\.\.\/shared\/ArticleCard\.astro"/);
  assert.match(component, /import CardGrid from "\.\.\/\.\.\/shared\/CardGrid\.astro"/);
  assert.match(component, /import ChoiceChips from "\.\.\/\.\.\/shared\/ChoiceChips\.astro"/);
  assert.match(component, /columns=\{3\}/);
  assert.match(component, /gap="loose"/);
  assert.match(component, /selectedCategory !== "all"/);
  assert.match(component, /window\.history\.replaceState/);
  assert.match(component, /window\.scrollTo\(scrollPosition\.x, scrollPosition\.y\)/);
  assert.doesNotMatch(component, /form\.requestSubmit\(\)/);
  assert.match(page, /<BlogCategoriesGrid/);
  assert.match(page, /Astro\.url\.searchParams\.get\("category"\)/);
  assert.match(page, /localizePath\(`\/blog\/\$\{article\.slug\}`/);
});

test("Blog grid keeps reference geometry and responsive reflow page-owned", async () => {
  const styles = await read(
    "src/styles/blog/sections/blog-categories-grid.css",
  );

  assert.match(styles, /inline-size: min\(100%, 70rem\)/);
  assert.match(styles, /--sidera-card-grid-gap: 1\.625rem/);
  assert.match(styles, /padding: 0 2\.125rem 6rem/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});

test("Blog grid fields have a forward executable migration", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0066_blog_index_featured_content.sql"));
  sqlite.exec(await read("migrations/0076_blog_categories_grid_content.sql"));
  const columns = new Set(
    sqlite
      .prepare("PRAGMA table_info(ec_site_blog)")
      .all()
      .map((column) => column.name),
  );

  for (const field of [
    "blog_categories_label",
    "blog_category_all",
    "blog_category_techniques",
    "blog_category_beginner",
    "blog_article_aries_rising_title",
    "blog_article_morning_star_excerpt",
    "blog_article_saturn_return_read_time",
    "blog_article_twelve_houses_category",
    "blog_article_mercury_retrograde_title",
  ]) {
    assert.equal(columns.has(field), true, `${field} should be migrated`);
  }
  assert.ok(columns.size < 70);
  sqlite.close();
});

test("Blog category/card copy stays structurally aligned for every locale", async () => {
  const { activeLocaleCodes } = await import(
    "../../src/data/localization-contract.ts"
  );
  const { getBlogCategoriesGridCopy } = await import(
    "../../src/data/locale/blog/sections/categories-grid.ts"
  );
  const englishKeys = Object.keys(getBlogCategoriesGridCopy("en")).sort();

  for (const locale of activeLocaleCodes) {
    const copy = getBlogCategoriesGridCopy(locale);
    assert.deepEqual(Object.keys(copy).sort(), englishKeys);
    for (const field of englishKeys) {
      assert.notEqual(copy[field].trim(), "", `${locale} empty ${field}`);
    }
  }
});
