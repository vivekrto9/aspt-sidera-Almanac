import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getBlogArticleBodyDefaults,
  getBlogArticleHeaderDefaults,
  getBlogDefaults,
} from "../src/data/public-copy.ts";
import {
  blogArticleBodyKinds,
  blogArticles,
} from "../src/data/blog/articles.ts";
import { activeLocales } from "../src/data/localization-contract.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "seed/seed.json");

const postsCollection = {
  slug: "posts",
  label: "Blog Articles",
  labelSingular: "Blog Article",
  description: "Published articles shown on the Blog index, article pages, related stories, and connected previews.",
  icon: "file-text",
  supports: ["drafts", "revisions", "preview", "scheduling", "search", "seo"],
  urlPattern: "/blog/{slug}",
  fields: [
    { slug: "title", label: "Title", type: "string", required: true, searchable: true },
    { slug: "excerpt", label: "Excerpt", type: "text", required: true, searchable: true },
    { slug: "content", label: "Article body", type: "portableText", required: true, searchable: true },
    { slug: "featured_image", label: "Featured image", type: "image" },
    { slug: "author", label: "Author", type: "string" },
    { slug: "category", label: "Category", type: "string", searchable: true },
    { slug: "read_time", label: "Read time", type: "string" },
    { slug: "tags", label: "Tags", type: "multiSelect" },
    { slug: "related", label: "Related article slugs", type: "multiSelect" },
  ],
};

const articlePrefix = (article) => `blog_article_${article.key.replaceAll("-", "_")}`;
const portableBlock = (article, kind, text, index) => ({
  _type: "block",
  _key: `${article.key}-${index + 1}`,
  style: kind === "heading" ? "h2" : kind === "quote" ? "blockquote" : "normal",
  markDefs: [],
  children: [{
    _type: "span",
    _key: `${article.key}-${index + 1}-span`,
    text,
    marks: [],
  }],
});

const entries = activeLocales.flatMap(({ code: locale }) => {
  const indexCopy = getBlogDefaults(locale);
  const headerCopy = getBlogArticleHeaderDefaults(locale);
  const bodyCopy = getBlogArticleBodyDefaults(locale);

  return blogArticles.map((article, articleIndex) => {
    const prefix = articlePrefix(article);
    const isFeatured = article.key === "lot-fortune";
    const title = indexCopy[isFeatured ? "blog_featured_title" : `${prefix}_title`];
    const excerpt = indexCopy[isFeatured ? "blog_featured_excerpt" : `${prefix}_excerpt`];
    const category = isFeatured
      ? headerCopy.blog_article_lot_fortune_category
      : indexCopy[`${prefix}_category`];
    const author = isFeatured
      ? indexCopy.blog_featured_author
      : headerCopy[`${prefix}_author`];
    const readTime = indexCopy[isFeatured ? "blog_featured_read_time" : `${prefix}_read_time`];
    const blocks = blogArticleBodyKinds[article.key].map((kind, blockIndex) =>
      portableBlock(
        article,
        kind,
        bodyCopy[`${prefix}_body_${blockIndex + 1}`],
        blockIndex,
      ));
    const related = Array.from({ length: 3 }, (_, offset) =>
      blogArticles[(articleIndex + offset + 1) % blogArticles.length].slug);

    return {
      id: `post:${article.key}:${locale}`,
      slug: article.slug,
      status: "published",
      locale,
      data: {
        title,
        excerpt,
        content: blocks,
        featured_image: {
          src: `/_assets/aliases/blog-${article.slug}/${article.slug}.png`,
          alt: locale === "en" ? article.image.alt : title,
        },
        author,
        category,
        read_time: readTime,
        tags: [category],
        related,
      },
    };
  });
});

const seed = {
  $schema: "https://emdashcms.com/seed.schema.json",
  version: "1",
  meta: {
    name: "Sidera Almanac",
    description: "EmDash seed for the Sidera Almanac astrology experience.",
    author: "AstroPages",
  },
  settings: {
    title: "Sidera",
    tagline: "Modern astrology, warmly guided",
  },
  collections: [postsCollection],
  taxonomies: [],
  menus: [],
  widgetAreas: [],
  content: { posts: entries },
};

writeFileSync(outputPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Generated ${entries.length} localized Blog post seeds.`);
