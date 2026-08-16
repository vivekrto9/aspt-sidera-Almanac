import { activeLocales, defaultLocale, localizePath, type SupportedLocale } from "../../data/localization-contract.ts";

type SiteSettings = {
  brandName?: string;
  seoTitle?: string;
  seoDescription?: string;
  contactEmail?: string;
  supportPhone?: string;
};

export type PublicSeoInput = {
  requestUrl: string;
  siteSettings: SiteSettings;
  locale: SupportedLocale;
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: Array<Record<string, unknown>>;
};

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

const absoluteUrl = (requestUrl: string, pathOrUrl: string) => {
  const base = new URL(requestUrl);
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl || "/", base.origin).toString();
};

export const localizedAlternates = ({
  requestUrl,
  canonicalPath,
}: {
  requestUrl: string;
  canonicalPath: string;
}) => [
  ...activeLocales.map((locale) => ({
    locale: locale.code,
    href: absoluteUrl(requestUrl, localizePath(canonicalPath, locale.code)),
  })),
  {
    locale: "x-default",
    href: absoluteUrl(requestUrl, localizePath(canonicalPath, defaultLocale)),
  },
];

export const buildPublicSeo = ({
  requestUrl,
  siteSettings,
  locale,
  title,
  description,
  canonicalPath,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
  jsonLd = [],
}: PublicSeoInput) => {
  const resolvedTitle = text(title) || text(siteSettings.seoTitle) || text(siteSettings.brandName) || "Sidera";
  const resolvedDescription = text(description) || text(siteSettings.seoDescription) || "";
  const resolvedCanonicalPath = text(canonicalPath) || new URL(requestUrl).pathname || "/";
  const canonicalUrl = absoluteUrl(requestUrl, localizePath(resolvedCanonicalPath, locale));
  const resolvedOgImage = text(ogImage) || "/_assets/aliases/logo/logo.svg";

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    canonicalUrl,
    robots: text(robots) || "index,follow",
    alternates: localizedAlternates({ requestUrl, canonicalPath: resolvedCanonicalPath }),
    og: {
      title: text(ogTitle) || resolvedTitle,
      description: text(ogDescription) || resolvedDescription,
      image: absoluteUrl(requestUrl, resolvedOgImage),
      imageAlt: text(ogImageAlt) || text(siteSettings.brandName) || "Sidera",
    },
    twitter: {
      card: text(twitterCard) || "summary_large_image",
      title: text(twitterTitle) || text(ogTitle) || resolvedTitle,
      description: text(twitterDescription) || text(ogDescription) || resolvedDescription,
      image: absoluteUrl(requestUrl, text(twitterImage) || resolvedOgImage),
    },
    jsonLd,
  };
};

export const buildOrganizationJsonLd = ({
  siteSettings,
  requestUrl,
}: {
  siteSettings: SiteSettings;
  requestUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: text(siteSettings.brandName) || "Sidera",
  url: new URL(requestUrl).origin,
  email: text(siteSettings.contactEmail) || undefined,
  telephone: text(siteSettings.supportPhone) || undefined,
});

export const buildWebSiteJsonLd = ({
  siteSettings,
  requestUrl,
}: {
  siteSettings: SiteSettings;
  requestUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: text(siteSettings.brandName) || "Sidera",
  url: new URL(requestUrl).origin,
});

export const buildBreadcrumbJsonLd = ({
  requestUrl,
  items,
}: {
  requestUrl: string;
  items: Array<{ name: string; path: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(requestUrl, item.path),
  })),
});

export const buildFaqJsonLd = (items: Array<{ question?: string; answer?: string }>) => {
  const questions = items.filter((item) => text(item.question) && text(item.answer));
  if (!questions.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: text(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: text(item.answer),
      },
    })),
  };
};
