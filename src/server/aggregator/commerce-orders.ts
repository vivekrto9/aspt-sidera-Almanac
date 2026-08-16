import { getCustomerUserProfile } from "./customer-profiles.ts";
import { AP_TABLES as tables } from "./db/tables.ts";
import { linkBusinessLead, markLeadConvertedBySourceReference } from "./lead-records.ts";
import { sendCommerceOrderReceipt } from "./notifications/commerce-order-receipt.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

type Row = Record<string, unknown>;
type OrderType = "shop" | "report";

const first = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return null;
  const statement = env.DB.prepare(sql).bind(...values) as {
    first?: () => Promise<Row | null>;
  };
  return (await statement.first?.()) ?? null;
};
const all = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return [];
  const statement = env.DB.prepare(sql).bind(...values) as {
    all?: () => Promise<{ results?: Row[] }>;
  };
  const result = await statement.all?.();
  return result?.results ?? [];
};
const run = async (env: RuntimeEnv, sql: string, values: unknown[] = []) =>
  env.DB?.prepare(sql)
    .bind(...values)
    .run?.();

const orderFromRow = (row: Row) => ({
  id: String(row.id),
  orderNumber: String(row.order_number),
  accountId: String(row.account_id),
  orderType: String(row.order_type) as OrderType,
  status: String(row.status),
  fulfillmentStatus: String(row.fulfillment_status),
  currency: String(row.currency),
  subtotalCents: Number(row.subtotal_cents),
  shippingCents: Number(row.shipping_cents),
  taxCents: Number(row.tax_cents),
  totalCents: Number(row.total_cents),
  customerName: String(row.customer_name),
  customerEmail: String(row.customer_email),
  profileId: safeString(row.profile_id),
  reportSlug: safeString(row.report_slug),
  requestKey: String(row.request_key),
  stripeCheckoutSessionId: safeString(row.stripe_checkout_session_id),
  stripePaymentIntentId: safeString(row.stripe_payment_intent_id),
  reportDownloadUrl: safeString(row.report_download_url),
  paidAt: safeString(row.paid_at),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

const lineFromRow = (row: Row) => ({
  id: String(row.id),
  orderId: String(row.order_id),
  productSlug: String(row.product_slug),
  productName: String(row.product_name),
  productKind: String(row.product_kind) as OrderType,
  variantLabel: safeString(row.variant_label),
  quantity: Number(row.quantity),
  unitCents: Number(row.unit_cents),
  totalCents: Number(row.total_cents),
  imageUrl: safeString(row.image_url),
});

const attemptFromRow = (row: Row) => ({
  id: String(row.id),
  accountId: String(row.account_id),
  payableId: String(row.payable_id),
  providerOrderId: safeString(row.provider_order_id),
  providerPaymentId: safeString(row.provider_payment_id),
  checkoutUrl: safeString(row.provider_checkout_url),
  amountCents: Number(row.amount_cents),
  currency: String(row.currency),
  status: String(row.status),
});

export type CommerceOrder = ReturnType<typeof orderFromRow> & {
  lines: ReturnType<typeof lineFromRow>[];
};

const validKey = (value: unknown) => {
  const key = safeString(value);
  return /^[A-Za-z0-9._:-]{8,128}$/.test(key) ? key : "";
};
const cleanText = (value: unknown, maximum: number) =>
  safeString(value).slice(0, maximum);

export const getCommerceOrder = async (
  env: RuntimeEnv,
  orderId: string,
  accountId?: string,
): Promise<CommerceOrder | null> => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.commerceOrders}
     WHERE id = ?${accountId ? " AND account_id = ?" : ""} LIMIT 1`,
    accountId ? [orderId, accountId] : [orderId],
  );
  if (!row) return null;
  const lines = await all(
    env,
    `SELECT * FROM ${tables.commerceOrderLines} WHERE order_id = ? ORDER BY created_at ASC, id ASC`,
    [orderId],
  );
  return { ...orderFromRow(row), lines: lines.map(lineFromRow) };
};

export const getCommercePaymentAttempt = async (
  env: RuntimeEnv,
  attemptId: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.paymentAttempts}
     WHERE id = ? AND payable_type = 'commerce_order' LIMIT 1`,
    [attemptId],
  );
  return row ? attemptFromRow(row) : null;
};

const latestAttempt = async (env: RuntimeEnv, orderId: string) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.paymentAttempts}
     WHERE payable_type = 'commerce_order' AND payable_id = ?
     ORDER BY created_at DESC LIMIT 1`,
    [orderId],
  );
  return row ? attemptFromRow(row) : null;
};

const replay = async (
  env: RuntimeEnv,
  accountId: string,
  requestKey: string,
) => {
  const row = await first(
    env,
    `SELECT id FROM ${tables.commerceOrders} WHERE account_id = ? AND request_key = ? LIMIT 1`,
    [accountId, requestKey],
  );
  if (!row) return null;
  const order = await getCommerceOrder(env, String(row.id), accountId);
  return order
    ? { order, attempt: await latestAttempt(env, order.id), replay: true }
    : null;
};

const createAttempt = async (env: RuntimeEnv, order: CommerceOrder) => {
  const id = createId("pay");
  const now = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.paymentAttempts} (
      id, account_id, payable_type, payable_id, provider, amount_cents,
      currency, status, idempotency_key, created_at, updated_at
    ) VALUES (?, ?, 'commerce_order', ?, 'stripe', ?, ?, 'created', ?, ?, ?)`,
    [
      id,
      order.accountId,
      order.id,
      order.totalCents,
      order.currency,
      `commerce_order:${order.id}:stripe:1`,
      now,
      now,
    ],
  );
  return (await getCommercePaymentAttempt(env, id))!;
};

const insertOrder = async ({
  env,
  accountId,
  accountEmail,
  orderType,
  requestKey,
  customerName,
  shippingAddress,
  profileId = null,
  reportSlug = null,
  subtotalCents,
  shippingCents,
  taxCents,
  currency,
  lines,
}: {
  env: RuntimeEnv;
  accountId: string;
  accountEmail: string;
  orderType: OrderType;
  requestKey: string;
  customerName: string;
  shippingAddress?: Record<string, string> | null;
  profileId?: string | null;
  reportSlug?: string | null;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  currency: string;
  lines: Array<{
    productSlug: string;
    productName: string;
    variantLabel?: string;
    quantity: number;
    unitCents: number;
    imageUrl: string;
  }>;
}) => {
  const id = createId("cord");
  const orderNumber = `SD-${id.slice(-10).toUpperCase()}`;
  const now = nowIso();
  const totalCents = subtotalCents + shippingCents + taxCents;
  await run(
    env,
    `INSERT INTO ${tables.commerceOrders} (
      id, order_number, account_id, order_type, status, fulfillment_status,
      currency, subtotal_cents, shipping_cents, tax_cents, total_cents,
      customer_name, customer_email, shipping_address_json, profile_id,
      report_slug, request_key, created_at, updated_at
    ) VALUES (?, ?, ?, ?, 'pending_payment', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      orderNumber,
      accountId,
      orderType,
      orderType === "shop" ? "unfulfilled" : "generation_pending",
      currency,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      customerName,
      accountEmail,
      shippingAddress ? JSON.stringify(shippingAddress) : null,
      profileId,
      reportSlug,
      requestKey,
      now,
      now,
    ],
  );
  for (const line of lines) {
    await run(
      env,
      `INSERT INTO ${tables.commerceOrderLines} (
        id, order_id, product_slug, product_name, product_kind, variant_label,
        quantity, unit_cents, total_cents, image_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        createId("cline"),
        id,
        line.productSlug,
        line.productName,
        orderType,
        line.variantLabel || null,
        line.quantity,
        line.unitCents,
        line.unitCents * line.quantity,
        line.imageUrl || null,
        now,
      ],
    );
  }
  const order = (await getCommerceOrder(env, id, accountId))!;
  const firstLine = order.lines[0];
  await linkBusinessLead({
    env,
    submission: {
      kind: orderType === "report" ? "report" : "commerce",
      source: orderType === "report" ? "report_order" : "product_order",
      formKey: orderType === "report" ? "report_checkout" : "shop_checkout",
      pagePath: orderType === "report" ? `/reports/${reportSlug}` : "/shop?view=checkout",
      fullName: customerName,
      email: accountEmail,
      customerAccountId: accountId,
      sourceReferenceType: "commerce_order",
      sourceReferenceId: order.id,
      details: orderType === "report"
        ? { orderNumber, reportSlug, reportTitle: firstLine?.productName, amountCents: totalCents, currency }
        : { orderNumber, productSlug: firstLine?.productSlug, productTitle: firstLine?.productName, amountCents: totalCents, currency, city: shippingAddress?.city, pincode: shippingAddress?.postalCode },
    },
  });
  return { order, attempt: await createAttempt(env, order), replay: false };
};

export const createShopOrder = async ({
  env,
  accountId,
  accountEmail,
  requestKey,
  items,
  contact,
}: {
  env: RuntimeEnv;
  accountId: string;
  accountEmail: string;
  requestKey: unknown;
  items: unknown;
  contact: unknown;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      status: 500,
      message: "Order storage is unavailable.",
    };
  const key = validKey(requestKey);
  if (!key)
    return {
      ok: false as const,
      status: 400,
      message: "A valid idempotency key is required.",
    };
  const existing = await replay(env, accountId, key);
  if (existing) return { ok: true as const, ...existing };
  if (!Array.isArray(items) || items.length < 1 || items.length > 40) {
    return {
      ok: false as const,
      status: 400,
      message: "Your cart must contain between 1 and 40 items.",
    };
  }
  const address =
    contact && typeof contact === "object" && !Array.isArray(contact)
      ? (contact as Record<string, unknown>)
      : {};
  const fields = {
    firstName: cleanText(address.firstName, 80),
    lastName: cleanText(address.lastName, 80),
    street: cleanText(address.street, 200),
    city: cleanText(address.city, 100),
    state: cleanText(address.state, 100),
    postalCode: cleanText(address.postalCode, 30),
    country: cleanText(address.country, 100),
  };
  if (Object.values(fields).some((value) => !value)) {
    return {
      ok: false as const,
      status: 400,
      message: "A complete shipping address is required.",
    };
  }
  const rows = await all(
    env,
    `SELECT slug, display_name, price_cents, currency, variant_option_count, image_url
     FROM ap_shop_products WHERE active = 1`,
  );
  const products = new Map(rows.map((row) => [String(row.slug), row]));
  const normalized = [] as Array<{
    productSlug: string;
    productName: string;
    variantLabel?: string;
    quantity: number;
    unitCents: number;
    imageUrl: string;
  }>;
  let currency = "";
  for (const candidate of items) {
    if (
      !candidate ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return {
        ok: false as const,
        status: 400,
        message: "Cart item is invalid.",
      };
    }
    const input = candidate as Record<string, unknown>;
    const slug = safeString(input.id || input.slug);
    const product = products.get(slug);
    const quantity = Math.trunc(Number(input.quantity));
    if (!product || quantity < 1 || quantity > 99) {
      return {
        ok: false as const,
        status: 400,
        message: "Cart product or quantity is invalid.",
      };
    }
    const productCurrency = String(product.currency || "USD").toUpperCase();
    if (currency && currency !== productCurrency) {
      return {
        ok: false as const,
        status: 409,
        message: "Cart currencies do not match.",
      };
    }
    currency = productCurrency;
    const variant = cleanText(input.variant, 80);
    if (Number(product.variant_option_count) > 0 && !variant) {
      return {
        ok: false as const,
        status: 400,
        message: "Select a product option before checkout.",
      };
    }
    normalized.push({
      productSlug: slug,
      productName: String(product.display_name),
      variantLabel: variant || undefined,
      quantity,
      unitCents: Number(product.price_cents),
      imageUrl: safeString(product.image_url),
    });
  }
  const subtotalCents = normalized.reduce(
    (sum, line) => sum + line.unitCents * line.quantity,
    0,
  );
  const shippingCents = subtotalCents >= 7500 ? 0 : 650;
  const taxCents = Math.round(subtotalCents * 0.08);
  const created = await insertOrder({
    env,
    accountId,
    accountEmail,
    orderType: "shop",
    requestKey: key,
    customerName: `${fields.firstName} ${fields.lastName}`,
    shippingAddress: fields,
    subtotalCents,
    shippingCents,
    taxCents,
    currency: currency || "USD",
    lines: normalized,
  });
  return { ok: true as const, ...created };
};

export const createReportOrder = async ({
  env,
  accountId,
  accountEmail,
  requestKey,
  reportSlug,
  profileId,
}: {
  env: RuntimeEnv;
  accountId: string;
  accountEmail: string;
  requestKey: unknown;
  reportSlug: unknown;
  profileId: unknown;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      status: 500,
      message: "Order storage is unavailable.",
    };
  const key = validKey(requestKey);
  if (!key)
    return {
      ok: false as const,
      status: 400,
      message: "A valid idempotency key is required.",
    };
  const existing = await replay(env, accountId, key);
  if (existing) return { ok: true as const, ...existing };
  const slug = safeString(reportSlug);
  const ownedProfileId = safeString(profileId);
  const [product, profile] = await Promise.all([
    first(
      env,
      `SELECT slug, report_type, price_cents, currency, image_url FROM ap_report_products WHERE active = 1 AND slug = ? LIMIT 1`,
      [slug],
    ),
    getCustomerUserProfile(env, accountId, ownedProfileId),
  ]);
  if (!product)
    return {
      ok: false as const,
      status: 404,
      message: "Report product was not found.",
    };
  if (!profile)
    return {
      ok: false as const,
      status: 404,
      message: "Select an owned birth profile for this report.",
    };
  const created = await insertOrder({
    env,
    accountId,
    accountEmail,
    orderType: "report",
    requestKey: key,
    customerName: profile.profileName,
    profileId: profile.id,
    reportSlug: slug,
    subtotalCents: Number(product.price_cents),
    shippingCents: 0,
    taxCents: 0,
    currency: String(product.currency || "USD").toUpperCase(),
    lines: [
      {
        productSlug: slug,
        productName: String(product.report_type).replaceAll("_", " "),
        quantity: 1,
        unitCents: Number(product.price_cents),
        imageUrl: safeString(product.image_url),
      },
    ],
  });
  return { ok: true as const, ...created };
};

export const recordCommerceCheckout = async ({
  env,
  orderId,
  attemptId,
  sessionId,
  checkoutUrl,
}: {
  env: RuntimeEnv;
  orderId: string;
  attemptId: string;
  sessionId: string;
  checkoutUrl: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts} SET provider_order_id = ?, provider_checkout_url = ?, status = 'requires_action', updated_at = ? WHERE id = ? AND payable_id = ? AND status IN ('created', 'requires_action')`,
    [sessionId, checkoutUrl, now, attemptId, orderId],
  );
  await run(
    env,
    `UPDATE ${tables.commerceOrders} SET stripe_checkout_session_id = ?, updated_at = ? WHERE id = ? AND status = 'pending_payment'`,
    [sessionId, now, orderId],
  );
};

export const markCommercePaymentPaid = async ({
  env,
  orderId,
  attemptId,
  sessionId,
  paymentIntentId,
  eventId,
  eventStatus,
  siteOrigin = "",
  sendReceipt = sendCommerceOrderReceipt,
}: {
  env: RuntimeEnv;
  orderId: string;
  attemptId: string;
  sessionId: string;
  paymentIntentId: string;
  eventId: string;
  eventStatus: "paid" | "browser_verified";
  siteOrigin?: string;
  sendReceipt?: typeof sendCommerceOrderReceipt;
}) => {
  const [order, attempt] = await Promise.all([
    getCommerceOrder(env, orderId),
    getCommercePaymentAttempt(env, attemptId),
  ]);
  if (
    !order ||
    !attempt ||
    attempt.payableId !== order.id ||
    attempt.accountId !== order.accountId ||
    attempt.amountCents !== order.totalCents ||
    attempt.currency.toUpperCase() !== order.currency.toUpperCase() ||
    (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
  ) {
    return { ok: false as const, message: "Payment attempt does not match." };
  }
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts} SET provider_order_id = ?, provider_payment_id = ?, status = 'paid', updated_at = ? WHERE id = ? AND payable_id = ?`,
    [sessionId, paymentIntentId || sessionId, now, attemptId, orderId],
  );
  await run(
    env,
    `UPDATE ${tables.commerceOrders} SET stripe_checkout_session_id = ?, stripe_payment_intent_id = ?, status = CASE WHEN status = 'pending_payment' THEN 'paid' ELSE status END, fulfillment_status = CASE WHEN order_type = 'shop' AND fulfillment_status = 'unfulfilled' THEN 'processing' ELSE fulfillment_status END, paid_at = COALESCE(paid_at, ?), updated_at = ? WHERE id = ?`,
    [sessionId, paymentIntentId || sessionId, now, now, orderId],
  );
  await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (id, payable_type, payable_id, provider, provider_event_id, status, payload_json, created_at) VALUES (?, 'commerce_order', ?, 'stripe', ?, ?, ?, ?) ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      orderId,
      eventId,
      eventStatus,
      JSON.stringify({ sessionId }),
      now,
    ],
  );
  const paidOrder = await getCommerceOrder(env, orderId);
  await markLeadConvertedBySourceReference({ env, sourceReferenceType: "commerce_order", sourceReferenceId: orderId, conversionReference: order.orderNumber });
  if (paidOrder) await sendReceipt({ env, order: paidOrder, siteOrigin });
  return { ok: true as const, order: paidOrder };
};

export const markCommercePaymentFailed = async ({
  env,
  orderId,
  attemptId,
  status,
  eventId,
  sessionId,
}: {
  env: RuntimeEnv;
  orderId: string;
  attemptId: string;
  status: "failed" | "expired";
  eventId: string;
  sessionId: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts} SET status = ?, updated_at = ? WHERE id = ? AND payable_id = ? AND status <> 'paid'`,
    [status, now, attemptId, orderId],
  );
  await run(
    env,
    `UPDATE ${tables.commerceOrders} SET status = ?, updated_at = ? WHERE id = ? AND status = 'pending_payment'`,
    [status === "expired" ? "expired" : "cancelled", now, orderId],
  );
  await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (id, payable_type, payable_id, provider, provider_event_id, status, payload_json, created_at) VALUES (?, 'commerce_order', ?, 'stripe', ?, ?, ?, ?) ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      orderId,
      eventId,
      status,
      JSON.stringify({ sessionId }),
      now,
    ],
  );
};

export const listCommerceOrders = async ({
  env,
  accountId,
  page = 1,
  pageSize = 10,
}: {
  env: RuntimeEnv;
  accountId: string;
  page?: number;
  pageSize?: number;
}) => {
  const safePage = Math.max(1, Math.trunc(page));
  const safeSize = Math.min(50, Math.max(1, Math.trunc(pageSize)));
  const count = await first(
    env,
    `SELECT COUNT(*) AS total FROM ${tables.commerceOrders} WHERE account_id = ? AND status <> 'pending_payment'`,
    [accountId],
  );
  const rows = await all(
    env,
    `SELECT * FROM ${tables.commerceOrders} WHERE account_id = ? AND status <> 'pending_payment' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [accountId, safeSize, (safePage - 1) * safeSize],
  );
  const items = await Promise.all(
    rows.map((row) => getCommerceOrder(env, String(row.id), accountId)),
  );
  const totalItems = Number(count?.total ?? 0);
  return {
    items: items.filter(Boolean) as CommerceOrder[],
    pagination: {
      page: safePage,
      pageSize: safeSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / safeSize)),
    },
  };
};
