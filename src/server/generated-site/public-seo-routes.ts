import { activeLocales, localizePath } from "../../data/localization-contract.ts";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/birth-chart",
] as const;

const ROBOTS_DISALLOW = [
  "/api/",
  "/_emdash",
] as const;

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const normalizedOrigin = (origin: string) => origin.replace(/\/$/, "");

export const buildPublicSitemapXml = (origin: string, now = new Date()) => {
  const baseUrl = normalizedOrigin(origin);
  const lastmod = now.toISOString();
  const localizedUrls = PUBLIC_ROUTES.flatMap((route) =>
    activeLocales.map((locale) => ({
      loc: `${baseUrl}${localizePath(route, locale.code)}`,
      lastmod,
    })),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...localizedUrls.flatMap((url) => [
      "  <url>",
      `    <loc>${xmlEscape(url.loc)}</loc>`,
      `    <lastmod>${xmlEscape(url.lastmod)}</lastmod>`,
      "  </url>",
    ]),
    "</urlset>",
  ].join("\n");
};

export const buildPublicRobotsTxt = (origin: string) => {
  const baseUrl = normalizedOrigin(origin);
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "# Disallow generated-site private and operational routes",
    ...ROBOTS_DISALLOW.map((path) => `Disallow: ${path}`),
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");
};

export const isPublicSeoRoute = (pathname: string) =>
  pathname === "/sitemap.xml" || pathname === "/robots.txt";
