type GeoRequest = Request & { cf?: { country?: unknown } };
export const paymentCountryFromRequest = (request?: GeoRequest, development = false): unknown => {
  if (!request) return undefined;
  if (!development) return request.cf?.country;
  const hostname = new URL(request.url).hostname;
  if (!hostname.endsWith(".trycloudflare.com") || !request.headers.has("cf-ray")) return undefined;
  const country = request.headers.get("cf-ipcountry")?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) ? country : undefined;
};
