export const localeStrategy = "query-param" as const;
export const defaultLocale = "en" as const;
export const rtlSupported = false;
export const maxActiveLocales = 8;

export const activeLocaleCodes = ["en", "es", "fr", "pt", "ru", "it", "de"] as const;
export type SupportedLocale = (typeof activeLocaleCodes)[number];

export type LocaleDirection = "ltr" | "rtl";
export type LocaleCatalogStatus = "active" | "available";

export type LocaleCatalogEntry = {
  code: string;
  label: string;
  name: string;
  nativeName: string;
  dir: LocaleDirection;
  hreflang: string;
  status: LocaleCatalogStatus;
  fallbackChain: string[];
  translationStatus: "verified" | "draft-ready";
  qaStatus: "template-verified" | "catalog-approved";
};

export const availableLocaleCatalog = [
  {
    code: "en",
    label: "ENG",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    hreflang: "en",
    status: "active",
    fallbackChain: [],
    translationStatus: "verified",
    qaStatus: "template-verified",
  },
  {
    code: "es",
    label: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    hreflang: "es",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
  {
    code: "fr",
    label: "fr",
    name: "French",
    nativeName: "Français",
    dir: "ltr",
    hreflang: "fr",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
  {
    code: "pt",
    label: "pt",
    name: "Portuguese",
    nativeName: "Português",
    dir: "ltr",
    hreflang: "pt",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
  {
    code: "ru",
    label: "ru",
    name: "Russian",
    nativeName: "Русский",
    dir: "ltr",
    hreflang: "ru",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
  {
    code: "it",
    label: "it",
    name: "Italian",
    nativeName: "Italiano",
    dir: "ltr",
    hreflang: "it",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
  {
    code: "de",
    label: "de",
    name: "German",
    nativeName: "Deutsch",
    dir: "ltr",
    hreflang: "de",
    status: "active",
    fallbackChain: ["en"],
    translationStatus: "draft-ready",
    qaStatus: "catalog-approved",
  },
] as const satisfies readonly LocaleCatalogEntry[];

export const activeLocales = availableLocaleCatalog.filter((locale) =>
  (activeLocaleCodes as readonly string[]).includes(locale.code),
) as Array<Extract<(typeof availableLocaleCatalog)[number], { code: SupportedLocale }>>;

export const inactiveCatalogLocales = availableLocaleCatalog.filter((locale) => locale.status !== "active");

export const publicEditableContentCollection = "multiple" as const;
export const publicEditableContentEntries = [
  "site_chrome/main",
  "home/main",
  "faq/main",
  "todays_sky/main",
  "not_found_page/main",
] as const;

export function isActiveLocale(locale: string | null | undefined): locale is SupportedLocale {
  return (activeLocaleCodes as readonly string[]).includes(locale ?? "");
}

export function isApprovedLocale(locale: string | null | undefined): boolean {
  return availableLocaleCatalog.some((item) => item.code === locale);
}

export function getLocaleMeta(locale: string | null | undefined): LocaleCatalogEntry | undefined {
  return availableLocaleCatalog.find((item) => item.code === locale);
}

export function getLocaleFromUrl(url: string | URL, fallback: SupportedLocale = defaultLocale): SupportedLocale {
  const parsed = typeof url === "string" ? new URL(url) : url;
  const requested = parsed.searchParams.get("locale");
  return isActiveLocale(requested) ? requested : fallback;
}

export function localizePath(href: string, locale: SupportedLocale): string {
  if (locale === defaultLocale || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }
  const [pathAndQuery = "", hash = ""] = href.split("#");
  const [path, query = ""] = pathAndQuery.split("?");
  const params = new URLSearchParams(query);
  params.set("locale", locale);
  const next = `${path}?${params.toString()}`;
  return hash ? `${next}#${hash}` : next;
}
