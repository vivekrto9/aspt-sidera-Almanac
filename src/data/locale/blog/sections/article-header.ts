import type { SupportedLocale } from "../../../localization-contract.ts";

type BlogArticleHeaderCopy = Record<string, string>;

const en = {
  blog_article_back_label: "All articles",
  blog_article_lot_fortune_category: "Techniques",
  blog_article_lot_fortune_date: "Jun 28, 2026",
  blog_article_aries_rising_author: "Devin Roy",
  blog_article_aries_rising_date: "Jun 21, 2026",
  blog_article_morning_star_author: "Mara Ellison",
  blog_article_morning_star_date: "Jun 14, 2026",
  blog_article_saturn_return_author: "Yuki Tanaka",
  blog_article_saturn_return_date: "Jun 6, 2026",
  blog_article_twelve_houses_author: "Devin Roy",
  blog_article_twelve_houses_date: "May 30, 2026",
  blog_article_mercury_retrograde_author: "Mara Ellison",
  blog_article_mercury_retrograde_date: "May 22, 2026",
} satisfies BlogArticleHeaderCopy;

const copyByLocale = {
  en,
  es: {
    ...en,
    blog_article_back_label: "Todos los artículos",
    blog_article_lot_fortune_category: "Técnicas",
    blog_article_lot_fortune_date: "28 jun 2026",
    blog_article_aries_rising_date: "21 jun 2026",
    blog_article_morning_star_date: "14 jun 2026",
    blog_article_saturn_return_date: "6 jun 2026",
    blog_article_twelve_houses_date: "30 may 2026",
    blog_article_mercury_retrograde_date: "22 may 2026",
  },
  fr: {
    ...en,
    blog_article_back_label: "Tous les articles",
    blog_article_lot_fortune_category: "Techniques",
    blog_article_lot_fortune_date: "28 juin 2026",
    blog_article_aries_rising_date: "21 juin 2026",
    blog_article_morning_star_date: "14 juin 2026",
    blog_article_saturn_return_date: "6 juin 2026",
    blog_article_twelve_houses_date: "30 mai 2026",
    blog_article_mercury_retrograde_date: "22 mai 2026",
  },
  pt: {
    ...en,
    blog_article_back_label: "Todos os artigos",
    blog_article_lot_fortune_category: "Técnicas",
    blog_article_lot_fortune_date: "28 jun 2026",
    blog_article_aries_rising_date: "21 jun 2026",
    blog_article_morning_star_date: "14 jun 2026",
    blog_article_saturn_return_date: "6 jun 2026",
    blog_article_twelve_houses_date: "30 mai 2026",
    blog_article_mercury_retrograde_date: "22 mai 2026",
  },
  ru: {
    ...en,
    blog_article_back_label: "Все статьи",
    blog_article_lot_fortune_category: "Техники",
    blog_article_lot_fortune_date: "28 июн. 2026",
    blog_article_aries_rising_date: "21 июн. 2026",
    blog_article_morning_star_date: "14 июн. 2026",
    blog_article_saturn_return_date: "6 июн. 2026",
    blog_article_twelve_houses_date: "30 мая 2026",
    blog_article_mercury_retrograde_date: "22 мая 2026",
  },
  it: {
    ...en,
    blog_article_back_label: "Tutti gli articoli",
    blog_article_lot_fortune_category: "Tecniche",
    blog_article_lot_fortune_date: "28 giu 2026",
    blog_article_aries_rising_date: "21 giu 2026",
    blog_article_morning_star_date: "14 giu 2026",
    blog_article_saturn_return_date: "6 giu 2026",
    blog_article_twelve_houses_date: "30 mag 2026",
    blog_article_mercury_retrograde_date: "22 mag 2026",
  },
  de: {
    ...en,
    blog_article_back_label: "Alle Artikel",
    blog_article_lot_fortune_category: "Techniken",
    blog_article_lot_fortune_date: "28. Juni 2026",
    blog_article_aries_rising_date: "21. Juni 2026",
    blog_article_morning_star_date: "14. Juni 2026",
    blog_article_saturn_return_date: "6. Juni 2026",
    blog_article_twelve_houses_date: "30. Mai 2026",
    blog_article_mercury_retrograde_date: "22. Mai 2026",
  },
} satisfies Record<SupportedLocale, BlogArticleHeaderCopy>;

export const getBlogArticleHeaderCopy = (
  locale: SupportedLocale,
): BlogArticleHeaderCopy => copyByLocale[locale] ?? copyByLocale.en;
