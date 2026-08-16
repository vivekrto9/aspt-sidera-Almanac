import {
  browseAstrologers,
  type BrowseAstrologer,
} from "../../data/astrologers/browse.ts";
import type { RuntimeEnv } from "./runtime.ts";

type AstrologerRow = {
  slug?: unknown;
  name?: unknown;
  tradition?: unknown;
  rating?: unknown;
  reviews_count?: unknown;
  rate_cents?: unknown;
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

const normalizeRow = (row: AstrologerRow): BrowseAstrologer | undefined => {
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

const localFallback = (): BrowseAstrologer[] =>
  browseAstrologers.map((profile) => ({
    ...profile,
    imageUrl: resolveImageUrl(
      profile.slug,
      `/_assets/aliases/astrologers-${profile.slug}/${profile.slug}.png`,
    ),
  }));

const selectColumns = `
  SELECT slug, name, tradition, rating, reviews_count, rate_cents, availability,
         categories_json, specialties_json, description, years_reading,
         sessions_count, languages_count, biography, image_url
  FROM ap_astrologers
`;

export const listAstrologers = async (
  env: RuntimeEnv,
): Promise<BrowseAstrologer[]> => {
  if (!env.DB) return localFallback();
  try {
    const result = await env.DB.prepare(
      `${selectColumns} WHERE active = 1 ORDER BY sort_order ASC, slug ASC`,
    ).all?.<AstrologerRow>();
    return (result?.results ?? [])
      .map(normalizeRow)
      .filter(Boolean) as BrowseAstrologer[];
  } catch {
    return [];
  }
};

export const getAstrologerBySlug = async (
  env: RuntimeEnv,
  slug: string,
): Promise<BrowseAstrologer | undefined> => {
  if (!env.DB) return localFallback().find((profile) => profile.slug === slug);
  try {
    const row = (await env.DB.prepare(
      `${selectColumns} WHERE active = 1 AND slug = ? LIMIT 1`,
    )
      .bind(slug)
      .first?.()) as AstrologerRow | null | undefined;
    return row ? normalizeRow(row) : undefined;
  } catch {
    return undefined;
  }
};
