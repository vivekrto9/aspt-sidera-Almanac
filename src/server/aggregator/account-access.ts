import {
  getLocaleFromUrl,
  localizePath,
} from "../../data/localization-contract.ts";

export const isProtectedAccountPath = (pathname: string) =>
  pathname === "/account" || pathname.startsWith("/account/") || pathname === "/wallet";

export const getAccountLoginRedirect = (url: URL) => {
  const loginPath = localizePath("/login", getLocaleFromUrl(url));
  const separator = loginPath.includes("?") ? "&" : "?";
  const next = `${url.pathname}${url.search}`;

  return `${loginPath}${separator}next=${encodeURIComponent(next)}`;
};
