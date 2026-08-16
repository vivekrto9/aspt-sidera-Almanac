export type BlogCategoryKey =
  | "techniques"
  | "birth-chart"
  | "the-sky"
  | "transits"
  | "beginner";

export type BlogCategoryFilter = "all" | BlogCategoryKey;

export type BlogArticleIndexItem = {
  key: "aries-rising" | "morning-star" | "saturn-return" | "twelve-houses" | "mercury-retrograde";
  slug: string;
  category: BlogCategoryKey;
  glyph: string;
  coverTone: "ochre" | "rose" | "slate" | "olive" | "stone";
  image: BlogArticleImage;
};

export type BlogArticleImage = {
  src: string;
  alt: string;
  width: 1200;
  height: 760;
};

export type BlogArticleItem = {
  key:
    | "lot-fortune"
    | BlogArticleIndexItem["key"];
  slug: string;
  glyph: string;
  coverTone: "terracotta" | BlogArticleIndexItem["coverTone"];
  image: BlogArticleImage;
  categoryField: string;
  titleField: string;
  excerptField: string;
  authorField: string;
  dateField: string;
  readTimeField: string;
};

const blogImage = (slug: string, alt: string): BlogArticleImage => ({
  src: import.meta.env?.DEV
    ? `/@fs${new URL(
        `../../../astropages/assets/blog/${slug}.png`,
        import.meta.url,
      ).pathname}`
    : `/_assets/aliases/blog-${slug}/${slug}.png`,
  alt,
  width: 1200,
  height: 760,
});

export type BlogArticleBodyBlockKind = "paragraph" | "heading" | "quote";

export const blogCategories: BlogCategoryFilter[] = [
  "all",
  "techniques",
  "birth-chart",
  "the-sky",
  "transits",
  "beginner",
];

export const blogIndexArticles: BlogArticleIndexItem[] = [
  {
    key: "aries-rising",
    slug: "aries-rising-the-pioneer-ascendant",
    category: "birth-chart",
    glyph: "♈︎",
    coverTone: "ochre",
    image: blogImage(
      "aries-rising-the-pioneer-ascendant",
      "Aries rising represented by a warm celestial ram illustration",
    ),
  },
  {
    key: "morning-star",
    slug: "morning-star-evening-star",
    category: "the-sky",
    glyph: "♀︎",
    coverTone: "rose",
    image: blogImage(
      "morning-star-evening-star",
      "Venus shown as the morning and evening star in a celestial sky",
    ),
  },
  {
    key: "saturn-return",
    slug: "reading-your-saturn-return",
    category: "transits",
    glyph: "♄︎",
    coverTone: "slate",
    image: blogImage(
      "reading-your-saturn-return",
      "Saturn and its rings arranged within an astrological chart",
    ),
  },
  {
    key: "twelve-houses",
    slug: "the-twelve-houses-room-by-room",
    category: "beginner",
    glyph: "♌︎",
    coverTone: "olive",
    image: blogImage(
      "the-twelve-houses-room-by-room",
      "The twelve astrological houses illustrated as a celestial wheel",
    ),
  },
  {
    key: "mercury-retrograde",
    slug: "what-mercury-retrograde-actually-does",
    category: "techniques",
    glyph: "☿︎",
    coverTone: "stone",
    image: blogImage(
      "what-mercury-retrograde-actually-does",
      "Mercury tracing a retrograde path through a star chart",
    ),
  },
];

export const blogArticles: BlogArticleItem[] = [
  {
    key: "lot-fortune",
    slug: "the-lot-of-fortune-explained",
    glyph: "⊗",
    coverTone: "terracotta",
    image: blogImage(
      "the-lot-of-fortune-explained",
      "The Lot of Fortune marked on an antique astrological chart",
    ),
    categoryField: "blog_article_lot_fortune_category",
    titleField: "blog_featured_title",
    excerptField: "blog_featured_excerpt",
    authorField: "blog_featured_author",
    dateField: "blog_article_lot_fortune_date",
    readTimeField: "blog_featured_read_time",
  },
  ...blogIndexArticles.map((article) => {
    const prefix = `blog_article_${article.key.replaceAll("-", "_")}`;
    return {
      key: article.key,
      slug: article.slug,
      glyph: article.glyph,
      coverTone: article.coverTone,
      image: article.image,
      categoryField: `${prefix}_category`,
      titleField: `${prefix}_title`,
      excerptField: `${prefix}_excerpt`,
      authorField: `${prefix}_author`,
      dateField: `${prefix}_date`,
      readTimeField: `${prefix}_read_time`,
    };
  }),
];

export const blogArticleBodyKinds: Record<
  BlogArticleItem["key"],
  BlogArticleBodyBlockKind[]
> = {
  "lot-fortune": [
    "paragraph",
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
    "heading",
    "paragraph",
  ],
  "aries-rising": [
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
    "heading",
    "paragraph",
  ],
  "morning-star": [
    "paragraph",
    "heading",
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
  ],
  "saturn-return": [
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
    "heading",
    "paragraph",
  ],
  "twelve-houses": [
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
    "heading",
    "paragraph",
  ],
  "mercury-retrograde": [
    "paragraph",
    "heading",
    "paragraph",
    "quote",
    "paragraph",
    "heading",
    "paragraph",
  ],
};
