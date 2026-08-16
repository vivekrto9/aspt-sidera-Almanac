export type ReportCatalogItem = {
  slug: string;
  glyph: string;
  pages: string;
  price: string;
  coverTone: "terracotta" | "ochre" | "rose" | "olive" | "slate";
};

export const reportCatalog: ReportCatalogItem[] = [
  {
    slug: "natal-blueprint",
    glyph: "☉",
    pages: "42 pages",
    price: "$29",
    coverTone: "terracotta",
  },
  {
    slug: "year-ahead-forecast",
    glyph: "♃",
    pages: "38 pages",
    price: "$34",
    coverTone: "ochre",
  },
  {
    slug: "relationship-synastry",
    glyph: "♀",
    pages: "31 pages",
    price: "$39",
    coverTone: "rose",
  },
  {
    slug: "solar-return-report",
    glyph: "☀",
    pages: "26 pages",
    price: "$27",
    coverTone: "terracotta",
  },
  {
    slug: "career-vocation",
    glyph: "♐",
    pages: "34 pages",
    price: "$32",
    coverTone: "olive",
  },
  {
    slug: "saturn-return-report",
    glyph: "♄",
    pages: "30 pages",
    price: "$30",
    coverTone: "slate",
  },
];
