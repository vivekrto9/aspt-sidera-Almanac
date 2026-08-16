import type { SupportedLocale } from "../../data/localization-contract.ts";
import {
  shopCatalogProducts,
  type ShopCatalogProduct,
  type ShopProductId,
} from "../../data/shop/catalog.ts";
import type { RuntimeEnv } from "./runtime.ts";

export type ShopProduct = ShopCatalogProduct & {
  slug: string;
  priceCents: number;
  currency: string;
  imageUrl: string;
  priceLabel: string;
};

type ShopProductRow = {
  id?: unknown;
  slug?: unknown;
  category?: unknown;
  price_cents?: unknown;
  currency?: unknown;
  personalized?: unknown;
  rating?: unknown;
  reviews_count?: unknown;
  tone?: unknown;
  variant_key?: unknown;
  variant_option_count?: unknown;
  image_url?: unknown;
};

const productIds = new Set<ShopProductId>(
  shopCatalogProducts.map((item) => item.id),
);
const categories = new Set(["prints", "books", "home", "jewelry"]);
const variantKeys = new Set([
  "frame",
  "size",
  "cover",
  "scent",
  "element",
  "metal",
]);
const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const number = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPrice = (
  priceCents: number,
  currency: string,
  locale: SupportedLocale,
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);

const resolveImageUrl = (id: ShopProductId, storedUrl: string) =>
  import.meta.env?.DEV
    ? `/@fs${
        new URL(`../../../astropages/assets/shop/${id}.png`, import.meta.url)
          .pathname
      }`
    : storedUrl;

const normalizeRow = (
  row: ShopProductRow,
  locale: SupportedLocale,
): ShopProduct | undefined => {
  const id = text(row.id) as ShopProductId;
  const slug = text(row.slug);
  const category = text(row.category) as ShopCatalogProduct["category"];
  const priceCents = number(row.price_cents);
  const currency = text(row.currency) || "USD";
  const rating = number(row.rating);
  const reviews = number(row.reviews_count);
  const tone = number(row.tone);
  const variantKey = text(row.variant_key);
  const optionCount = number(row.variant_option_count);
  const imageUrl = text(row.image_url);
  if (
    !productIds.has(id) ||
    !slug ||
    !categories.has(category) ||
    priceCents < 0 ||
    !imageUrl
  )
    return undefined;

  return {
    id,
    slug,
    category,
    price: priceCents / 100,
    priceCents,
    priceLabel: formatPrice(priceCents, currency, locale),
    currency,
    personalized: number(row.personalized) === 1 || undefined,
    rating,
    reviews,
    tone,
    variant:
      variantKey && variantKeys.has(variantKey) && optionCount > 0
        ? {
            key: variantKey as NonNullable<
              ShopCatalogProduct["variant"]
            >["key"],
            optionCount,
          }
        : undefined,
    imageUrl: resolveImageUrl(id, imageUrl),
  };
};

const localFallback = (locale: SupportedLocale): ShopProduct[] =>
  shopCatalogProducts.map((product) => ({
    ...product,
    slug: product.id,
    priceCents: product.price * 100,
    currency: "USD",
    priceLabel: formatPrice(product.price * 100, "USD", locale),
    imageUrl: resolveImageUrl(
      product.id,
      `/_assets/aliases/shop-${product.id}/${product.id}.png`,
    ),
  }));

const selectColumns = `
  SELECT id, slug, category, price_cents, currency, personalized, rating,
         reviews_count, tone, variant_key, variant_option_count, image_url
  FROM ap_shop_products
`;

export const listShopProducts = async (
  env: RuntimeEnv,
  locale: SupportedLocale,
): Promise<ShopProduct[]> => {
  if (!env.DB) return localFallback(locale);
  try {
    const result = await env.DB.prepare(
      `${selectColumns} WHERE active = 1 ORDER BY sort_order ASC, slug ASC`,
    ).all?.<ShopProductRow>();
    return (result?.results ?? [])
      .map((row) => normalizeRow(row, locale))
      .filter(Boolean) as ShopProduct[];
  } catch {
    return [];
  }
};

export const getShopProductBySlug = async (
  env: RuntimeEnv,
  slug: string,
  locale: SupportedLocale,
): Promise<ShopProduct | undefined> => {
  if (!env.DB)
    return localFallback(locale).find((product) => product.slug === slug);
  try {
    const row = (await env.DB.prepare(
      `${selectColumns} WHERE active = 1 AND slug = ? LIMIT 1`,
    )
      .bind(slug)
      .first?.()) as ShopProductRow | null | undefined;
    return row ? normalizeRow(row, locale) : undefined;
  } catch {
    return undefined;
  }
};
