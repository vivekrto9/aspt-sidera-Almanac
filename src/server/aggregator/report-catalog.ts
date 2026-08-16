import type { SupportedLocale } from "../../data/localization-contract.ts";
import { reportCatalog } from "../../data/reports/catalog.ts";
import type { RuntimeEnv } from "./runtime.ts";

export type ReportCoverTone =
  | "terracotta"
  | "ochre"
  | "rose"
  | "olive"
  | "slate";

export type ReportProduct = {
  slug: string;
  reportType: string;
  pagesCount: number;
  pages: string;
  priceCents: number;
  price: string;
  currency: string;
  glyph: string;
  coverTone: ReportCoverTone;
  imageUrl: string;
  providerEndpointKey?: string;
};

type ReportProductRow = {
  slug?: unknown;
  report_type?: unknown;
  pages_count?: unknown;
  price_cents?: unknown;
  currency?: unknown;
  glyph?: unknown;
  cover_tone?: unknown;
  image_url?: unknown;
  provider_endpoint_key?: unknown;
};

const coverTones = new Set<ReportCoverTone>([
  "terracotta",
  "ochre",
  "rose",
  "olive",
  "slate",
]);

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const integer = (value: unknown) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : 0;
};

const resolveImageUrl = (slug: string, storedUrl: string) =>
  import.meta.env?.DEV
    ? `/@fs${new URL(
        `../../../astropages/assets/reports/${slug}.png`,
        import.meta.url,
      ).pathname}`
    : storedUrl;

const pageUnit: Record<SupportedLocale, string> = {
  en: "pages",
  es: "páginas",
  fr: "pages",
  pt: "páginas",
  ru: "страниц",
  it: "pagine",
  de: "Seiten",
};

const formatPages = (pagesCount: number, locale: SupportedLocale) =>
  `${new Intl.NumberFormat(locale).format(pagesCount)} ${pageUnit[locale]}`;

const formatPrice = (
  priceCents: number,
  currency: string,
  locale: SupportedLocale,
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

const normalizeRow = (
  row: ReportProductRow,
  locale: SupportedLocale,
): ReportProduct | undefined => {
  const slug = text(row.slug);
  const reportType = text(row.report_type);
  const pagesCount = integer(row.pages_count);
  const priceCents = integer(row.price_cents);
  const currency = text(row.currency) || "USD";
  const glyph = text(row.glyph);
  const rawTone = text(row.cover_tone) as ReportCoverTone;
  const imageUrl = text(row.image_url);
  if (
    !slug ||
    !reportType ||
    pagesCount <= 0 ||
    priceCents < 0 ||
    !glyph ||
    !coverTones.has(rawTone) ||
    !imageUrl
  )
    return undefined;

  return {
    slug,
    reportType,
    pagesCount,
    pages: formatPages(pagesCount, locale),
    priceCents,
    price: formatPrice(priceCents, currency, locale),
    currency,
    glyph,
    coverTone: rawTone,
    imageUrl: resolveImageUrl(slug, imageUrl),
    providerEndpointKey: text(row.provider_endpoint_key) || undefined,
  };
};

const localFallback = (locale: SupportedLocale): ReportProduct[] =>
  reportCatalog
    .map((report, index) => ({
      slug: report.slug,
      reportType: report.slug.replaceAll("-", "_"),
      pagesCount: Number.parseInt(report.pages, 10),
      pages: formatPages(Number.parseInt(report.pages, 10), locale),
      priceCents: Number.parseInt(report.price.replace(/\D/g, ""), 10) * 100,
      price: formatPrice(
        Number.parseInt(report.price.replace(/\D/g, ""), 10) * 100,
        "USD",
        locale,
      ),
      currency: "USD",
      glyph: report.glyph,
      coverTone: report.coverTone,
    imageUrl: resolveImageUrl(
      report.slug,
      `/_assets/aliases/reports-${report.slug}/${report.slug}.png`,
    ),
      providerEndpointKey: undefined,
      sortOrder: (index + 1) * 10,
    }))
    .map(({ sortOrder: _sortOrder, ...report }) => report);

const selectColumns = `
  SELECT slug, report_type, pages_count, price_cents, currency, glyph,
         cover_tone, image_url, provider_endpoint_key
  FROM ap_report_products
`;

export const listReportProducts = async (
  env: RuntimeEnv,
  locale: SupportedLocale,
): Promise<ReportProduct[]> => {
  if (!env.DB) return localFallback(locale);
  try {
    const result = await env.DB.prepare(
      `${selectColumns} WHERE active = 1 ORDER BY sort_order ASC, slug ASC`,
    ).all?.<ReportProductRow>();
    return (result?.results ?? [])
      .map((row) => normalizeRow(row, locale))
      .filter(Boolean) as ReportProduct[];
  } catch {
    return [];
  }
};

export const getReportProductBySlug = async (
  env: RuntimeEnv,
  slug: string,
  locale: SupportedLocale,
): Promise<ReportProduct | undefined> => {
  if (!env.DB)
    return localFallback(locale).find((report) => report.slug === slug);
  try {
    const row = (await env.DB.prepare(
      `${selectColumns} WHERE active = 1 AND slug = ? LIMIT 1`,
    )
      .bind(slug)
      .first?.()) as ReportProductRow | null | undefined;
    return row ? normalizeRow(row, locale) : undefined;
  } catch {
    return undefined;
  }
};
