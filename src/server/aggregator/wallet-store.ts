import { AP_TABLES as tables } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

type Row = Record<string, unknown>;
type RunResult =
  | { meta?: { changes?: number }; changes?: number }
  | undefined;

const first = async (
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) => {
  if (!env.DB) return null;
  const statement = env.DB.prepare(sql).bind(...values) as {
    first?: () => Promise<Row | null>;
  };
  return (await statement.first?.()) ?? null;
};

const all = async (
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) => {
  if (!env.DB) return [];
  const statement = env.DB.prepare(sql).bind(...values) as {
    all?: () => Promise<{ results?: Row[] }>;
  };
  return (await statement.all?.())?.results ?? [];
};

const run = async (
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) =>
  (await env.DB?.prepare(sql).bind(...values).run?.()) as RunResult;

const changed = (result: RunResult) =>
  Number(result?.meta?.changes ?? result?.changes ?? 0) > 0;

const WALLET_CURRENCY = "USD";
export const minimumWalletRechargeCents = 2000;
export const maximumWalletRechargeCents = 500000;
export const walletRecentTransactionLimit = 8;

export const walletOffers = [
  { id: "wl_100", amountCents: 10000, creditCents: 10000, bonusCents: 0 },
  { id: "wl_250", amountCents: 25000, creditCents: 26500, bonusCents: 1500 },
  { id: "wl_500", amountCents: 50000, creditCents: 55000, bonusCents: 5000 },
  { id: "wl_1000", amountCents: 100000, creditCents: 115000, bonusCents: 15000 },
] as const;

const amount = (cents: number, locale = "en") =>
  new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
    style: "currency",
    currency: WALLET_CURRENCY,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const walletFromRow = (row: Row, locale = "en") => ({
  id: safeString(row.id),
  accountId: safeString(row.account_id),
  balanceCents: Number(row.balance_cents ?? 0),
  balance: amount(Number(row.balance_cents ?? 0), locale),
  currency: WALLET_CURRENCY,
  updatedAt: safeString(row.updated_at),
});

const transactionFromRow = (row: Row, locale = "en") => {
  const amountCents = Number(row.amount_cents ?? 0);
  return {
    id: safeString(row.id),
    rechargeId: safeString(row.recharge_id),
    type: safeString(row.transaction_type),
    amountCents,
    amount: amount(Math.abs(amountCents), locale),
    signedAmount: `${amountCents >= 0 ? "+" : "-"}${amount(Math.abs(amountCents), locale)}`,
    balanceAfterCents: Number(row.balance_after_cents ?? 0),
    balanceAfter: amount(Number(row.balance_after_cents ?? 0), locale),
    currency: WALLET_CURRENCY,
    description: safeString(row.description),
    createdAt: safeString(row.created_at),
  };
};

const rechargeFromRow = (row: Row) => ({
  id: safeString(row.id),
  accountId: safeString(row.account_id),
  walletId: safeString(row.wallet_id),
  amountCents: Number(row.amount_cents ?? 0),
  creditCents: Number(row.credit_cents ?? 0),
  bonusCents: Number(row.bonus_cents ?? 0),
  currency: WALLET_CURRENCY,
  offerId: safeString(row.offer_id),
  requestKey: safeString(row.request_key),
  paymentState: safeString(row.payment_state),
  stripeCheckoutSessionId: safeString(row.stripe_checkout_session_id),
  stripePaymentIntentId: safeString(row.stripe_payment_intent_id),
  customerEmail: safeString(row.customer_email),
  createdAt: safeString(row.created_at),
  updatedAt: safeString(row.updated_at),
});

export type WalletRecharge = ReturnType<typeof rechargeFromRow>;

export const ensureCustomerWallet = async (
  env: RuntimeEnv,
  accountId: string,
) => {
  const existing = await first(
    env,
    `SELECT * FROM ${tables.wallets} WHERE account_id = ? LIMIT 1`,
    [accountId],
  );
  if (existing) return existing;
  const now = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.wallets}
      (id, account_id, balance_cents, currency, created_at, updated_at)
     VALUES (?, ?, 0, ?, ?, ?)
     ON CONFLICT(account_id) DO NOTHING`,
    [createId("wlt"), accountId, WALLET_CURRENCY, now, now],
  );
  return first(
    env,
    `SELECT * FROM ${tables.wallets} WHERE account_id = ? LIMIT 1`,
    [accountId],
  );
};

export const getCustomerWalletSummary = async (
  env: RuntimeEnv,
  accountId: string,
  locale = "en",
) => {
  const wallet = await ensureCustomerWallet(env, accountId);
  return wallet
    ? walletFromRow(wallet, locale)
    : {
        id: "",
        accountId,
        balanceCents: 0,
        balance: amount(0, locale),
        currency: WALLET_CURRENCY,
        updatedAt: "",
      };
};

export const listWalletTransactions = async (
  env: RuntimeEnv,
  accountId: string,
  { limit = 20, locale = "en" }: { limit?: number; locale?: string } = {},
) =>
  (
    await all(
      env,
      `SELECT * FROM ${tables.walletTransactions}
       WHERE account_id = ? ORDER BY created_at DESC LIMIT ?`,
      [accountId, Math.max(1, Math.min(100, Math.trunc(limit)))],
    )
  ).map((row) => transactionFromRow(row, locale));

export type WalletTransactionFilter = "all" | "credit" | "debit";

export const listWalletTransactionsPage = async (
  env: RuntimeEnv,
  accountId: string,
  {
    page = 1,
    pageSize = 12,
    filter = "all",
    locale = "en",
  }: {
    page?: number;
    pageSize?: number;
    filter?: WalletTransactionFilter;
    locale?: string;
  } = {},
) => {
  const safePageSize = Math.max(1, Math.min(50, Math.trunc(pageSize)));
  const safeFilter: WalletTransactionFilter =
    filter === "credit" || filter === "debit" ? filter : "all";
  const amountClause =
    safeFilter === "credit"
      ? " AND amount_cents > 0"
      : safeFilter === "debit"
        ? " AND amount_cents < 0"
        : "";
  const countRow = await first(
    env,
    `SELECT COUNT(*) AS total FROM ${tables.walletTransactions}
     WHERE account_id = ?${amountClause}`,
    [accountId],
  );
  const totalItems = Number(countRow?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.max(1, Math.min(totalPages, Math.trunc(page)));
  const rows = await all(
    env,
    `SELECT * FROM ${tables.walletTransactions}
     WHERE account_id = ?${amountClause}
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [accountId, safePageSize, (safePage - 1) * safePageSize],
  );
  return {
    items: rows.map((row) => transactionFromRow(row, locale)),
    totalItems,
    totalPages,
    page: safePage,
    pageSize: safePageSize,
    filter: safeFilter,
  };
};

export const getWalletRecharge = async (
  env: RuntimeEnv,
  rechargeId: string,
  accountId?: string,
) => {
  const row = await first(
    env,
    `SELECT recharge.*, account.email AS customer_email
     FROM ${tables.walletRecharges} recharge
     JOIN ${tables.customerAccounts} account ON account.id = recharge.account_id
     WHERE recharge.id = ?${accountId ? " AND recharge.account_id = ?" : ""}
     LIMIT 1`,
    accountId ? [rechargeId, accountId] : [rechargeId],
  );
  return row ? rechargeFromRow(row) : null;
};

export const getWalletPaymentAttempt = async (
  env: RuntimeEnv,
  attemptId: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.paymentAttempts}
     WHERE id = ? AND payable_type = 'wallet_recharge' LIMIT 1`,
    [attemptId],
  );
  return row
    ? {
        id: safeString(row.id),
        accountId: safeString(row.account_id),
        payableId: safeString(row.payable_id),
        providerOrderId: safeString(row.provider_order_id),
        checkoutUrl: safeString(row.provider_checkout_url),
        amountCents: Number(row.amount_cents ?? 0),
        currency: safeString(row.currency),
        status: safeString(row.status),
      }
    : null;
};

const walletAttemptForRecharge = async (
  env: RuntimeEnv,
  rechargeId: string,
) => {
  const row = await first(
    env,
    `SELECT id FROM ${tables.paymentAttempts}
     WHERE payable_type = 'wallet_recharge' AND payable_id = ?
     ORDER BY created_at DESC LIMIT 1`,
    [rechargeId],
  );
  return row ? getWalletPaymentAttempt(env, safeString(row.id)) : null;
};

const ensureWalletAttempt = async (
  env: RuntimeEnv,
  recharge: WalletRecharge,
) => {
  const existing = await walletAttemptForRecharge(env, recharge.id);
  if (existing) return existing;
  const id = createId("pay");
  const now = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.paymentAttempts} (
      id, account_id, payable_type, payable_id, provider, amount_cents,
      currency, status, idempotency_key, created_at, updated_at
    ) VALUES (?, ?, 'wallet_recharge', ?, 'stripe', ?, ?, 'created', ?, ?, ?)
    ON CONFLICT(idempotency_key) DO NOTHING`,
    [
      id,
      recharge.accountId,
      recharge.id,
      recharge.amountCents,
      recharge.currency,
      `wallet_recharge:${recharge.id}:stripe:1`,
      now,
      now,
    ],
  );
  return (await walletAttemptForRecharge(env, recharge.id))!;
};

export const createWalletRecharge = async ({
  env,
  accountId,
  amountCents,
  offerId,
  requestKey,
}: {
  env: RuntimeEnv;
  accountId: string;
  amountCents: number;
  offerId?: string;
  requestKey: string;
}) => {
  if (!env.DB)
    return { ok: false as const, status: 500, message: "Wallet storage is unavailable." };
  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(requestKey))
    return { ok: false as const, status: 400, message: "A valid idempotency key is required." };
  if (
    !Number.isInteger(amountCents) ||
    amountCents < minimumWalletRechargeCents ||
    amountCents > maximumWalletRechargeCents
  )
    return { ok: false as const, status: 400, message: "Wallet recharge amount is outside the allowed range." };

  const replay = await first(
    env,
    `SELECT id FROM ${tables.walletRecharges}
     WHERE account_id = ? AND request_key = ? LIMIT 1`,
    [accountId, requestKey],
  );
  if (replay) {
    const recharge = await getWalletRecharge(env, safeString(replay.id), accountId);
    return recharge
      ? { ok: true as const, recharge, attempt: await ensureWalletAttempt(env, recharge), replay: true }
      : { ok: false as const, status: 409, message: "Wallet recharge could not be restored." };
  }

  const offer = offerId
    ? walletOffers.find((candidate) => candidate.id === offerId)
    : undefined;
  if (offerId && !offer)
    return { ok: false as const, status: 400, message: "Selected wallet offer is unavailable." };
  if (offer && offer.amountCents !== amountCents)
    return { ok: false as const, status: 400, message: "Wallet offer amount does not match." };

  const wallet = await ensureCustomerWallet(env, accountId);
  if (!wallet)
    return { ok: false as const, status: 500, message: "Wallet could not be created." };
  const id = createId("wlr");
  const now = nowIso();
  const creditCents = offer?.creditCents ?? amountCents;
  await run(
    env,
    `INSERT INTO ${tables.walletRecharges} (
      id, account_id, wallet_id, amount_cents, credit_cents, bonus_cents,
      currency, offer_id, request_key, payment_state, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      id,
      accountId,
      safeString(wallet.id),
      amountCents,
      creditCents,
      creditCents - amountCents,
      WALLET_CURRENCY,
      offer?.id ?? null,
      requestKey,
      now,
      now,
    ],
  );
  const recharge = (await getWalletRecharge(env, id, accountId))!;
  return {
    ok: true as const,
    recharge,
    attempt: await ensureWalletAttempt(env, recharge),
    replay: false,
  };
};

export const recordWalletCheckout = async ({
  env,
  rechargeId,
  attemptId,
  sessionId,
  checkoutUrl,
}: {
  env: RuntimeEnv;
  rechargeId: string;
  attemptId: string;
  sessionId: string;
  checkoutUrl: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET provider_order_id = ?, provider_checkout_url = ?,
         status = 'requires_action', updated_at = ?
     WHERE id = ? AND payable_id = ? AND status IN ('created', 'requires_action')`,
    [sessionId, checkoutUrl, now, attemptId, rechargeId],
  );
  await run(
    env,
    `UPDATE ${tables.walletRecharges}
     SET stripe_checkout_session_id = ?, updated_at = ?
     WHERE id = ? AND payment_state = 'pending'`,
    [sessionId, now, rechargeId],
  );
};

export const recordWalletBrowserVerification = async ({
  env,
  rechargeId,
  attemptId,
  sessionId,
  paymentIntentId,
}: {
  env: RuntimeEnv;
  rechargeId: string;
  attemptId: string;
  sessionId: string;
  paymentIntentId: string;
}) => {
  const [recharge, attempt] = await Promise.all([
    getWalletRecharge(env, rechargeId),
    getWalletPaymentAttempt(env, attemptId),
  ]);
  if (
    !recharge ||
    !attempt ||
    attempt.payableId !== recharge.id ||
    attempt.accountId !== recharge.accountId ||
    attempt.amountCents !== recharge.amountCents ||
    attempt.currency.toUpperCase() !== recharge.currency.toUpperCase() ||
    (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
  ) {
    return { ok: false as const, message: "Payment attempt does not match." };
  }
  const now = nowIso();
  if (attempt.status !== "paid") {
    await run(
      env,
      `UPDATE ${tables.paymentAttempts}
       SET provider_order_id = ?, provider_payment_id = ?, status = 'requires_action', updated_at = ?
       WHERE id = ? AND payable_id = ?`,
      [sessionId, paymentIntentId || sessionId, now, attemptId, rechargeId],
    );
  }
  await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (
      id, payable_type, payable_id, provider, provider_event_id,
      status, payload_json, created_at
    ) VALUES (?, 'wallet_recharge', ?, 'stripe', ?, 'browser_verified', ?, ?)
    ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      rechargeId,
      `browser:${sessionId}`,
      JSON.stringify({
        sessionId,
        source: "browser-confirmation",
        nextStep: "Webhook is authoritative for paid payment state.",
      }),
      now,
    ],
  );
  return {
    ok: true as const,
    paymentReference: paymentIntentId || sessionId,
    authoritativeState: "waiting-for-webhook" as const,
  };
};

export const markWalletRechargePaid = async ({
  env,
  rechargeId,
  attemptId,
  sessionId,
  paymentIntentId,
  eventId,
  eventStatus,
}: {
  env: RuntimeEnv;
  rechargeId: string;
  attemptId: string;
  sessionId: string;
  paymentIntentId: string;
  eventId: string;
  eventStatus: "paid" | "browser_verified";
}) => {
  const [recharge, attempt] = await Promise.all([
    getWalletRecharge(env, rechargeId),
    getWalletPaymentAttempt(env, attemptId),
  ]);
  if (
    !recharge ||
    !attempt ||
    attempt.payableId !== recharge.id ||
    attempt.accountId !== recharge.accountId ||
    attempt.amountCents !== recharge.amountCents ||
    attempt.currency.toUpperCase() !== recharge.currency.toUpperCase() ||
    (attempt.providerOrderId && attempt.providerOrderId !== sessionId)
  )
    return { ok: false as const, message: "Payment attempt does not match." };

  const now = nowIso();
  const claimed = await run(
    env,
    `UPDATE ${tables.walletRecharges}
     SET stripe_checkout_session_id = ?, stripe_payment_intent_id = ?,
         payment_state = 'paid', paid_at = COALESCE(paid_at, ?), updated_at = ?
     WHERE id = ? AND payment_state = 'pending'`,
    [sessionId, paymentIntentId || sessionId, now, now, rechargeId],
  );
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET provider_order_id = ?, provider_payment_id = ?, status = 'paid', updated_at = ?
     WHERE id = ? AND payable_id = ?`,
    [sessionId, paymentIntentId || sessionId, now, attemptId, rechargeId],
  );
  if (changed(claimed)) {
    await run(
      env,
      `UPDATE ${tables.wallets}
       SET balance_cents = balance_cents + ?, updated_at = ?
       WHERE id = ? AND account_id = ?`,
      [recharge.creditCents, now, recharge.walletId, recharge.accountId],
    );
    const wallet = await getCustomerWalletSummary(env, recharge.accountId);
    await run(
      env,
      `INSERT OR IGNORE INTO ${tables.walletTransactions} (
        id, wallet_id, account_id, recharge_id, transaction_type,
        amount_cents, balance_after_cents, currency, description,
        metadata_json, created_at
      ) VALUES (?, ?, ?, ?, 'recharge', ?, ?, ?, 'Wallet recharge', ?, ?)`,
      [
        createId("wtx"),
        recharge.walletId,
        recharge.accountId,
        recharge.id,
        recharge.creditCents,
        wallet.balanceCents,
        WALLET_CURRENCY,
        JSON.stringify({ bonusCents: recharge.bonusCents, offerId: recharge.offerId }),
        now,
      ],
    );
  }
  await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (
      id, payable_type, payable_id, provider, provider_event_id,
      status, payload_json, created_at
    ) VALUES (?, 'wallet_recharge', ?, 'stripe', ?, ?, ?, ?)
    ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      rechargeId,
      eventId,
      eventStatus,
      JSON.stringify({ sessionId }),
      now,
    ],
  );
  return {
    ok: true as const,
    duplicate: !changed(claimed),
    recharge: await getWalletRecharge(env, rechargeId),
    wallet: await getCustomerWalletSummary(env, recharge.accountId),
  };
};

export const markWalletRechargeFailed = async ({
  env,
  rechargeId,
  attemptId,
  status,
  eventId,
  sessionId,
}: {
  env: RuntimeEnv;
  rechargeId: string;
  attemptId: string;
  status: "failed" | "expired" | "cancelled";
  eventId: string;
  sessionId: string;
}) => {
  const now = nowIso();
  await run(
    env,
    `UPDATE ${tables.paymentAttempts}
     SET status = ?, updated_at = ?
     WHERE id = ? AND payable_id = ? AND status <> 'paid'`,
    [status, now, attemptId, rechargeId],
  );
  await run(
    env,
    `UPDATE ${tables.walletRecharges}
     SET payment_state = ?, updated_at = ?
     WHERE id = ? AND payment_state = 'pending'`,
    [status, now, rechargeId],
  );
  await run(
    env,
    `INSERT INTO ${tables.paymentEvents} (
      id, payable_type, payable_id, provider, provider_event_id,
      status, payload_json, created_at
    ) VALUES (?, 'wallet_recharge', ?, 'stripe', ?, ?, ?, ?)
    ON CONFLICT(provider, provider_event_id) DO NOTHING`,
    [
      createId("pevt"),
      rechargeId,
      eventId,
      status === "cancelled" ? "failed" : status,
      JSON.stringify({ sessionId }),
      now,
    ],
  );
};
