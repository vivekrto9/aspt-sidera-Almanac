import type { ContentEntry } from "emdash";
import { getEmDashCollection, getEmDashEntry } from "emdash";

import type { SupportedLocale } from "../localization-contract.ts";
import {
  blogArticles,
  type BlogArticleBodyBlockKind,
  type BlogArticleImage,
} from "./articles.ts";

export type BlogPostData = {
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  featured_image?: unknown;
  author?: unknown;
  category?: unknown;
  read_time?: unknown;
  related?: unknown;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  image?: BlogArticleImage;
  blocks: Array<{ kind: BlogArticleBodyBlockKind; text: string }>;
  relatedSlugs: string[];
};

type BlogEntry = ContentEntry<BlogPostData>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const firstText = (...values: unknown[]) => {
  for (const value of values) {
    const resolved = text(value);
    if (resolved) return resolved;
  }
  return "";
};
const textArray = (value: unknown) =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : [];

const normalizeImageSource = (value: string) => {
  if (!value) return "";
  if (
    value.startsWith("/") ||
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("data:image/") ||
    value.startsWith("blob:")
  ) return value;
  return `/_emdash/api/media/file/${encodeURIComponent(value)}`;
};

const readImage = (value: unknown, depth = 0): { src: string; alt: string } | undefined => {
  if (depth > 4) return undefined;
  if (typeof value === "string") {
    const src = normalizeImageSource(value.trim());
    return src ? { src, alt: "" } : undefined;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const image = readImage(item, depth + 1);
      if (image) return image;
    }
    return undefined;
  }
  if (!isRecord(value)) return undefined;
  const src = normalizeImageSource(firstText(
    value.src,
    value.url,
    value.previewUrl,
    value.publicUrl,
    value.path,
    value.id,
    value._id,
    value.key,
  ));
  const alt = firstText(value.alt, value.altText, value.title, value.caption, value.filename);
  if (src) return { src, alt };
  for (const field of ["asset", "image", "file", "media", "data"]) {
    const nested = readImage(value[field], depth + 1);
    if (nested) return { ...nested, alt: nested.alt || alt };
  }
  return undefined;
};

const normalizeBlocks = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((block) => {
    if (!isRecord(block)) return [];
    const blockText = Array.isArray(block.children)
      ? block.children.map((child) => isRecord(child) ? text(child.text) : "").filter(Boolean).join("")
      : text(block.text);
    if (!blockText) return [];
    const style = text(block.style);
    const kind: BlogArticleBodyBlockKind = style === "h2" || style === "h3"
      ? "heading"
      : style === "blockquote"
        ? "quote"
        : "paragraph";
    return [{ kind, text: blockText }];
  });
};

const baselineImage = (slug: string) => blogArticles.find((article) => article.slug === slug)?.image;

export const normalizeBlogPost = (
  entry: BlogEntry,
  locale: SupportedLocale,
): BlogPost | undefined => {
  const data = entry.data ?? {};
  const slug = firstText(data.slug, entry.id);
  const title = firstText(data.title);
  if (!slug || !title) return undefined;
  const rawFallbackImage = baselineImage(slug);
  const fallbackImage = rawFallbackImage
    ? { ...rawFallbackImage, alt: locale === "en" ? rawFallbackImage.alt : title }
    : undefined;
  const uploaded = readImage(data.featured_image);
  const useDevFallback = import.meta.env?.DEV && uploaded?.src.startsWith("/_assets/aliases/blog-");
  const resolvedImage = useDevFallback ? fallbackImage : uploaded;
  const image = resolvedImage ?? fallbackImage;

  return {
    slug,
    title,
    excerpt: firstText(data.excerpt),
    author: firstText(data.author),
    category: firstText(data.category),
    readTime: firstText(data.read_time),
    image: image ? {
      src: image.src,
      alt: image.alt || title,
      width: 1200,
      height: 760,
    } : undefined,
    blocks: normalizeBlocks(data.content),
    relatedSlugs: textArray(data.related),
  };
};

export const listBlogPosts = async (locale: SupportedLocale) => {
  try {
    const result = await getEmDashCollection<"posts", BlogPostData>("posts", {
      locale,
      status: "published",
      orderBy: { published_at: "desc" },
    });
    return result.entries
      .map((entry) => normalizeBlogPost(entry, locale))
      .filter(Boolean) as BlogPost[];
  } catch {
    return [];
  }
};

export const getBlogPost = async (slug: string, locale: SupportedLocale) => {
  try {
    const result = await getEmDashEntry<"posts", BlogPostData>("posts", slug, { locale });
    return result.entry ? normalizeBlogPost(result.entry, locale) : undefined;
  } catch {
    return undefined;
  }
};
