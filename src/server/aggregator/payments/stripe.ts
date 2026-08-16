import { resolveSecretBinding } from "../runtime-bindings.ts";
import { safeString, type RuntimeEnv } from "../runtime.ts";

const encodeBasic = (value: string) => btoa(value);
const bytesToHex = (value: ArrayBuffer) =>
  [...new Uint8Array(value)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const timingSafeEqual = (left: string, right: string) => {
  if (!left || !right) return false;
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |=
      (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
};

export type StripeSessionPayable = {
  id: string;
  accountId: string;
  astrologerSlug: string;
  sessionType: "chat" | "written";
  deliveryMode: "now" | "scheduled";
  durationMinutes: number | null;
  amountCents: number;
  currency: string;
};

export type StripeCommercePayable = {
  id: string;
  accountId: string;
  orderType: "shop" | "report";
  orderNumber: string;
  totalCents: number;
  currency: string;
  reportSlug: string;
  lines: Array<{
    productName: string;
    quantity: number;
    unitCents: number;
  }>;
};

export type StripeWalletPayable = {
  id: string;
  accountId: string;
  amountCents: number;
  creditCents: number;
  currency: string;
};

export const createStripeWalletCheckout = async ({
  env,
  payable,
  attemptId,
  origin,
  locale = "en",
  fetcher = fetch,
}: {
  env: RuntimeEnv;
  payable: StripeWalletPayable;
  attemptId: string;
  origin: string;
  locale?: string;
  fetcher?: typeof fetch;
}) => {
  const secretKey = await resolveSecretBinding(env, "STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("Stripe credentials are not configured.");
  const localeSuffix = locale && locale !== "en" ? `&locale=${encodeURIComponent(locale)}` : "";
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("client_reference_id", payable.id);
  params.set("success_url", `${origin}/wallet?payment=success&rechargeId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}&session_id={CHECKOUT_SESSION_ID}${localeSuffix}`);
  params.set("cancel_url", `${origin}/wallet?payment=cancelled&rechargeId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}${localeSuffix}`);
  params.set("metadata[attemptId]", attemptId);
  params.set("metadata[payableType]", "wallet_recharge");
  params.set("metadata[payableId]", payable.id);
  params.set("metadata[accountId]", payable.accountId);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", payable.currency.toLowerCase());
  params.set("line_items[0][price_data][unit_amount]", String(payable.amountCents));
  params.set("line_items[0][price_data][product_data][name]", "Sidera wallet credit");
  const response = await fetcher("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Basic ${encodeBasic(`${secretKey}:`)}`,
      "content-type": "application/x-www-form-urlencoded",
      "idempotency-key": attemptId,
    },
    body: params.toString(),
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const sessionId = safeString(body.id);
  const checkoutUrl = safeString(body.url);
  if (!response.ok || !sessionId || !checkoutUrl)
    throw new Error("Stripe wallet checkout creation failed.");
  return { sessionId, checkoutUrl };
};

export const verifyStripeWalletPayment = ({
  payable,
  attemptId,
  session,
}: {
  payable: StripeWalletPayable;
  attemptId: string;
  session: Record<string, unknown>;
}) => {
  const metadata = session.metadata && typeof session.metadata === "object" && !Array.isArray(session.metadata)
    ? session.metadata as Record<string, unknown>
    : {};
  if (safeString(session.payment_status) !== "paid")
    return { ok: false as const, message: "Stripe session is not paid." };
  if (
    safeString(session.client_reference_id) !== payable.id ||
    safeString(metadata.payableId) !== payable.id ||
    safeString(metadata.payableType) !== "wallet_recharge" ||
    safeString(metadata.attemptId) !== attemptId ||
    safeString(metadata.accountId) !== payable.accountId
  ) return { ok: false as const, message: "Stripe wallet target does not match." };
  if (
    Number(session.amount_total) !== payable.amountCents ||
    safeString(session.currency).toUpperCase() !== payable.currency.toUpperCase()
  ) return { ok: false as const, message: "Stripe wallet amount does not match." };
  return { ok: true as const };
};

export const createStripeCommerceCheckout = async ({
  env,
  payable,
  attemptId,
  origin,
  locale = "en",
  fetcher = fetch,
}: {
  env: RuntimeEnv;
  payable: StripeCommercePayable;
  attemptId: string;
  origin: string;
  locale?: string;
  fetcher?: typeof fetch;
}) => {
  const secretKey = await resolveSecretBinding(env, "STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("Stripe credentials are not configured.");
  const localeSuffix =
    locale && locale !== "en" ? `&locale=${encodeURIComponent(locale)}` : "";
  const returnPath =
    payable.orderType === "shop"
      ? "/shop?view=confirmed"
      : `/reports/${encodeURIComponent(payable.reportSlug)}?payment=success`;
  const cancelPath =
    payable.orderType === "shop"
      ? "/shop?view=failed"
      : `/reports/${encodeURIComponent(payable.reportSlug)}?payment=cancelled`;
  const separator = returnPath.includes("?") ? "&" : "?";
  const cancelSeparator = cancelPath.includes("?") ? "&" : "?";
  const successUrl = `${origin}${returnPath}${separator}orderId=${encodeURIComponent(payable.id)}&attemptId=${encodeURIComponent(attemptId)}&session_id={CHECKOUT_SESSION_ID}${localeSuffix}`;
  const cancelUrl = `${origin}${cancelPath}${cancelSeparator}orderId=${encodeURIComponent(payable.id)}${localeSuffix}`;
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("client_reference_id", payable.id);
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("metadata[attemptId]", attemptId);
  params.set("metadata[payableType]", "commerce_order");
  params.set("metadata[payableId]", payable.id);
  params.set("metadata[accountId]", payable.accountId);
  params.set("metadata[orderType]", payable.orderType);
  payable.lines.forEach((line, index) => {
    params.set(`line_items[${index}][quantity]`, String(line.quantity));
    params.set(
      `line_items[${index}][price_data][currency]`,
      payable.currency.toLowerCase(),
    );
    params.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(line.unitCents),
    );
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      line.productName,
    );
  });
  const lineTotal = payable.lines.reduce(
    (sum, line) => sum + line.unitCents * line.quantity,
    0,
  );
  const adjustment = payable.totalCents - lineTotal;
  if (adjustment > 0) {
    const index = payable.lines.length;
    params.set(`line_items[${index}][quantity]`, "1");
    params.set(
      `line_items[${index}][price_data][currency]`,
      payable.currency.toLowerCase(),
    );
    params.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(adjustment),
    );
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      "Shipping and estimated tax",
    );
  }
  const response = await fetcher(
    "https://api.stripe.com/v1/checkout/sessions",
    {
      method: "POST",
      headers: {
        authorization: `Basic ${encodeBasic(`${secretKey}:`)}`,
        "content-type": "application/x-www-form-urlencoded",
        "idempotency-key": attemptId,
      },
      body: params.toString(),
    },
  );
  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const sessionId = safeString(body.id);
  const checkoutUrl = safeString(body.url);
  if (!response.ok || !sessionId || !checkoutUrl) {
    throw new Error("Stripe checkout session creation failed.");
  }
  return { sessionId, checkoutUrl };
};

export const verifyStripeCommercePayment = ({
  payable,
  attemptId,
  session,
}: {
  payable: StripeCommercePayable;
  attemptId: string;
  session: Record<string, unknown>;
}) => {
  const metadata =
    session.metadata &&
    typeof session.metadata === "object" &&
    !Array.isArray(session.metadata)
      ? (session.metadata as Record<string, unknown>)
      : {};
  if (safeString(session.payment_status) !== "paid")
    return { ok: false as const, message: "Stripe session is not paid." };
  if (
    safeString(session.client_reference_id) !== payable.id ||
    safeString(metadata.payableId) !== payable.id ||
    safeString(metadata.payableType) !== "commerce_order"
  ) {
    return {
      ok: false as const,
      message: "Stripe commerce target does not match.",
    };
  }
  if (
    safeString(metadata.attemptId) !== attemptId ||
    safeString(metadata.accountId) !== payable.accountId
  ) {
    return {
      ok: false as const,
      message: "Stripe commerce attempt does not match.",
    };
  }
  if (
    Number(session.amount_total) !== payable.totalCents ||
    safeString(session.currency).toUpperCase() !==
      payable.currency.toUpperCase()
  ) {
    return {
      ok: false as const,
      message: "Stripe commerce amount does not match.",
    };
  }
  return { ok: true as const };
};

export const createStripeSessionCheckout = async ({
  env,
  payable,
  attemptId,
  origin,
  locale = "en",
  fetcher = fetch,
}: {
  env: RuntimeEnv;
  payable: StripeSessionPayable;
  attemptId: string;
  origin: string;
  locale?: string;
  fetcher?: typeof fetch;
}) => {
  const secretKey = await resolveSecretBinding(env, "STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("Stripe credentials are not configured.");

  const localeSuffix =
    locale && locale !== "en" ? `&locale=${encodeURIComponent(locale)}` : "";
  const successUrl =
    `${origin}/astrologers/${encodeURIComponent(payable.astrologerSlug)}` +
    `?payment=success&entitlementId=${encodeURIComponent(payable.id)}` +
    `&attemptId=${encodeURIComponent(attemptId)}` +
    `&session_id={CHECKOUT_SESSION_ID}${localeSuffix}`;
  const cancelUrl =
    `${origin}/astrologers/${encodeURIComponent(payable.astrologerSlug)}` +
    `?book=1&payment=cancelled${localeSuffix}`;
  const productName =
    payable.sessionType === "written"
      ? "Written astrology question"
      : `${payable.durationMinutes}-minute astrology chat`;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("client_reference_id", payable.id);
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("metadata[attemptId]", attemptId);
  params.set("metadata[payableType]", "session_entitlement");
  params.set("metadata[payableId]", payable.id);
  params.set("metadata[accountId]", payable.accountId);
  params.set("metadata[astrologerSlug]", payable.astrologerSlug);
  params.set("metadata[sessionType]", payable.sessionType);
  params.set("metadata[deliveryMode]", payable.deliveryMode);
  params.set("line_items[0][quantity]", "1");
  params.set(
    "line_items[0][price_data][currency]",
    payable.currency.toLowerCase(),
  );
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(payable.amountCents),
  );
  params.set("line_items[0][price_data][product_data][name]", productName);

  const response = await fetcher(
    "https://api.stripe.com/v1/checkout/sessions",
    {
      method: "POST",
      headers: {
        authorization: `Basic ${encodeBasic(`${secretKey}:`)}`,
        "content-type": "application/x-www-form-urlencoded",
        "idempotency-key": attemptId,
      },
      body: params.toString(),
    },
  );
  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const sessionId = safeString(body.id);
  const checkoutUrl = safeString(body.url);
  if (!response.ok || !sessionId || !checkoutUrl) {
    throw new Error("Stripe checkout session creation failed.");
  }
  return { sessionId, checkoutUrl };
};

export const readStripeCheckoutSession = async ({
  env,
  sessionId,
  fetcher = fetch,
}: {
  env: RuntimeEnv;
  sessionId: string;
  fetcher?: typeof fetch;
}) => {
  const secretKey = await resolveSecretBinding(env, "STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("Stripe credentials are not configured.");
  const response = await fetcher(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { authorization: `Basic ${encodeBasic(`${secretKey}:`)}` } },
  );
  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok) throw new Error("Stripe checkout session lookup failed.");
  return body;
};

export const verifyStripeSessionPayment = ({
  payable,
  attemptId,
  session,
}: {
  payable: StripeSessionPayable;
  attemptId: string;
  session: Record<string, unknown>;
}) => {
  const metadata =
    session.metadata &&
    typeof session.metadata === "object" &&
    !Array.isArray(session.metadata)
      ? (session.metadata as Record<string, unknown>)
      : {};
  if (safeString(session.payment_status) !== "paid") {
    return { ok: false as const, message: "Stripe session is not paid." };
  }
  if (
    safeString(session.client_reference_id) !== payable.id ||
    safeString(metadata.payableId) !== payable.id ||
    safeString(metadata.payableType) !== "session_entitlement"
  ) {
    return {
      ok: false as const,
      message: "Stripe session payment target does not match.",
    };
  }
  if (safeString(metadata.attemptId) !== attemptId) {
    return {
      ok: false as const,
      message: "Stripe session payment attempt does not match.",
    };
  }
  if (Number(session.amount_total) !== payable.amountCents) {
    return {
      ok: false as const,
      message: "Stripe session amount does not match.",
    };
  }
  if (
    safeString(session.currency).toUpperCase() !==
    payable.currency.toUpperCase()
  ) {
    return {
      ok: false as const,
      message: "Stripe session currency does not match.",
    };
  }
  return { ok: true as const };
};

export const verifyStripeWebhookSignature = async ({
  secret,
  rawBody,
  signatureHeader,
  nowSeconds = Math.floor(Date.now() / 1000),
}: {
  secret: string;
  rawBody: string;
  signatureHeader: string;
  nowSeconds?: number;
}) => {
  if (!secret || !rawBody || !signatureHeader) return false;
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = Number(
    parts.find((part) => part.startsWith("t="))?.slice(2),
  );
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > 300) {
    return false;
  }
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));
  if (signatures.length === 0) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
  const expected = bytesToHex(digest);
  return signatures.some((signature) => timingSafeEqual(expected, signature));
};
