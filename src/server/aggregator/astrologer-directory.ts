import {
  browseAstrologers,
  type BrowseAstrologer,
} from "../../data/astrologers/browse.ts";
import type { RuntimeEnv } from "./runtime.ts";
import { selectIndependentPrice, selectPriceForCurrency } from "./payment-pricing.ts";
import type { PaymentCurrency } from "./payment-preference.ts";

type AstrologerRow = {
  slug?: unknown;
  name?: unknown;
  tradition?: unknown;
  rating?: unknown;
  reviews_count?: unknown;
  rate_cents?: unknown;
  price_inr_cents?: unknown;
  price_usd_cents?: unknown;
  currency?: unknown;
  availability?: unknown;
  categories_json?: unknown;
  specialties_json?: unknown;
  description?: unknown;
  years_reading?: unknown;
  sessions_count?: unknown;
  languages_count?: unknown;
  biography?: unknown;
  image_url?: unknown;
};

const availabilityValues = new Set(["online", "busy", "offline"]);
const specialtyValues = new Set([
  "love",
  "career",
  "life-path",
  "timing",
  "spiritual",
]);
const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const number = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const stringArray = (value: unknown) => {
  try {
    const parsed = JSON.parse(text(value));
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};
const resolveImageUrl = (slug: string, storedUrl: string) =>
  import.meta.env?.DEV
    ? `/@fs${new URL(`../../../astropages/assets/astrologers/${slug}.png`, import.meta.url).pathname}`
    : storedUrl;

export type PricedAstrologer = BrowseAstrologer & { rateCents: number; currency: string };
const normalizeRow = (row: AstrologerRow): PricedAstrologer | undefined => {
  const slug = text(row.slug);
  const availability = text(row.availability);
  const categories = stringArray(row.categories_json).filter((item) =>
    specialtyValues.has(item),
  );
  const imageUrl = text(row.image_url);
  if (
    !slug ||
    !text(row.name) ||
    !availabilityValues.has(availability) ||
    !imageUrl
  )
    return undefined;
  return {
    slug,
    imageUrl: resolveImageUrl(slug, imageUrl),
    name: text(row.name),
    tradition: text(row.tradition),
    rating: number(row.rating),
    reviews: number(row.reviews_count),
    rate: number(row.rate_cents) / 100,
    rateCents: number(row.rate_cents),
    currency: text(row.currency).toUpperCase() === "INR" ? "INR" : "USD",
    availability: availability as BrowseAstrologer["availability"],
    categories: categories as BrowseAstrologer["categories"],
    specialties: stringArray(row.specialties_json),
    description: text(row.description),
    yearsReading: number(row.years_reading),
    sessions: number(row.sessions_count),
    languages: number(row.languages_count),
    biography: text(row.biography),
    chatProfileType: slug === "selene-marlowe" ? "MATCHING" : "KUNDLI",
  };
};

const localFallback = (): PricedAstrologer[] =>
  browseAstrologers.map((profile) => ({
    ...profile,
    rateCents: Math.round(profile.rate * 100),
    currency: "USD",
    imageUrl: resolveImageUrl(
      profile.slug,
      `/_assets/aliases/astrologers-${profile.slug}/${profile.slug}.png`,
    ),
  }));

const selectColumns = `
  SELECT slug, name, tradition, rating, reviews_count, rate_cents,
         rate_inr_cents AS price_inr_cents, rate_usd_cents AS price_usd_cents, currency, availability,
         categories_json, specialties_json, description, years_reading,
         sessions_count, languages_count, biography, image_url
  FROM ap_astrologers
`;

export const listAstrologers = async (
  env: RuntimeEnv,
): Promise<PricedAstrologer[]> => {
  if (!env.DB) return localFallback();
  try {
    const result = await env.DB.prepare(
      `${selectColumns} WHERE active = 1 ORDER BY sort_order ASC, slug ASC`,
    ).all?.<AstrologerRow>();
    const priced = await Promise.all((result?.results ?? []).map(async (row) => {
      const selected = await selectIndependentPrice(env, row as Record<string, unknown>);
      return { ...selected, rate_cents: selected.price_cents };
    }));
    return priced
      .map(normalizeRow)
      .filter(Boolean) as PricedAstrologer[];
  } catch {
    return [];
  }
};

export const getAstrologerBySlug = async (
  env: RuntimeEnv,
  slug: string,
  currency?: PaymentCurrency,
): Promise<PricedAstrologer | undefined> => {
  if (!env.DB) return localFallback().find((profile) => profile.slug === slug);
  try {
    const row = (await env.DB.prepare(
      `${selectColumns} WHERE active = 1 AND slug = ? LIMIT 1`,
    )
      .bind(slug)
      .first?.()) as AstrologerRow | null | undefined;
    if (!row) return undefined;
    const selected = currency
      ? selectPriceForCurrency(row as Record<string, unknown>, currency)
      : await selectIndependentPrice(env, row as Record<string, unknown>);
    return normalizeRow({ ...selected, rate_cents: selected.price_cents });
  } catch {
    return undefined;
  }
};
