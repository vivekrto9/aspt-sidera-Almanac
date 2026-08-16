import { callAstrologyChatProvider } from "./astrology-chat-provider.ts";
import { getAstrologerBySlug } from "./astrologer-directory.ts";
import { getCustomerUserProfile } from "./customer-profiles.ts";
import { AP_TABLES as tables } from "./db/tables.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";
import {
  ensureCustomerWallet,
  getCustomerWalletSummary,
} from "./wallet-store.ts";

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
) => {
  if (!env.DB) return undefined;
  return (await env.DB.prepare(sql).bind(...values).run?.()) as RunResult;
};

const changed = (result: RunResult) =>
  Number(result?.meta?.changes ?? result?.changes ?? 0) > 0;

const validRequestKey = (value: string) =>
  /^[A-Za-z0-9._:-]{8,128}$/.test(value);

const priceCentsFor = (rate: number) => Math.max(0, Math.round(rate * 100));

const formatUsd = (amountCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amountCents / 100);

const sessionFromRow = (row: Row) => ({
  id: safeString(row.id),
  accountId: safeString(row.account_id),
  profileId: safeString(row.profile_id),
  partnerProfileId: safeString(row.partner_profile_id),
  astrologerSlug: safeString(row.astrologer_slug),
  astrologerName: safeString(row.astrologer_name),
  astrologerImage: safeString(row.astrologer_image),
  profileName: safeString(row.profile_name),
  partnerProfileName: safeString(row.partner_profile_name),
  provider: safeString(row.provider),
  sessionName: safeString(row.session_name),
  sessionType: "chat" as const,
  status: safeString(row.status),
  priceCents: Number(row.price_cents ?? 0),
  currency: safeString(row.currency) || "USD",
  durationMinutes: null,
  startedAt: safeString(row.created_at),
  endsAt: "",
  completedAt: safeString(row.completed_at),
  updatedAt: safeString(row.updated_at),
  lastMessage: safeString(row.last_message),
});

export type AstrologyChatSession = ReturnType<typeof sessionFromRow>;

const messageFromRow = (row: Row) => ({
  id: safeString(row.id),
  sessionId: safeString(row.session_id),
  role: safeString(row.role) as "user" | "assistant" | "system",
  message: safeString(row.message),
  replyToMessageId: safeString(row.reply_to_message_id),
  clientRequestKey: safeString(row.client_request_key),
  costCents: Number(row.cost_cents ?? 0),
  createdAt: safeString(row.created_at),
});

const sessionSelect = `
  SELECT session.*,
         astrologer.name AS astrologer_name,
         astrologer.image_url AS astrologer_image,
         profile.profile_name,
         partner_profile.profile_name AS partner_profile_name,
         (
           SELECT message.message
           FROM ${tables.chatMessages} message
           WHERE message.session_id = session.id
           ORDER BY message.created_at DESC, message.id DESC LIMIT 1
         ) AS last_message
  FROM ${tables.chatSessions} session
  JOIN ap_astrologers astrologer ON astrologer.slug = session.astrologer_slug
  JOIN ${tables.customerUserProfiles} profile ON profile.id = session.profile_id
  LEFT JOIN ${tables.customerUserProfiles} partner_profile
    ON partner_profile.id = session.partner_profile_id
`;

export const getAstrologyChatSession = async (
  env: RuntimeEnv,
  accountId: string,
  sessionId: string,
) => {
  const row = await first(
    env,
    `${sessionSelect}
     WHERE session.account_id = ? AND session.id = ? LIMIT 1`,
    [accountId, sessionId],
  );
  return row ? sessionFromRow(row) : null;
};

export const getAstrologyChatMessages = async (
  env: RuntimeEnv,
  sessionId: string,
) =>
  (
    await all(
      env,
      `SELECT * FROM ${tables.chatMessages}
       WHERE session_id = ? ORDER BY created_at ASC, id ASC`,
      [sessionId],
    )
  ).map(messageFromRow);

export const getAstrologyChatSessionDetail = async (
  env: RuntimeEnv,
  accountId: string,
  sessionId: string,
) => {
  const session = await getAstrologyChatSession(env, accountId, sessionId);
  if (!session) return null;
  return { session, messages: await getAstrologyChatMessages(env, session.id) };
};

export const listAstrologyChatSessions = async ({
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
  const safePageSize = Math.max(1, Math.min(50, Math.floor(pageSize)));
  const safePage = Math.max(1, Math.floor(page));
  const count = await first(
    env,
    `SELECT COUNT(*) AS total FROM ${tables.chatSessions} WHERE account_id = ?`,
    [accountId],
  );
  const total = Number(count?.total ?? 0);
  const rows = await all(
    env,
    `${sessionSelect}
     WHERE session.account_id = ?
     ORDER BY session.updated_at DESC
     LIMIT ? OFFSET ?`,
    [accountId, safePageSize, (safePage - 1) * safePageSize],
  );
  return {
    sessions: rows.map(sessionFromRow),
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    },
  };
};

export const checkAstrologyChatEligibility = async ({
  env,
  accountId,
  astrologerSlug,
}: {
  env: RuntimeEnv;
  accountId: string;
  astrologerSlug: string;
}) => {
  const astrologer = await getAstrologerBySlug(env, astrologerSlug);
  if (!astrologer || astrologer.availability === "offline") {
    return {
      ok: false as const,
      status: 409,
      message: "Selected astrologer is unavailable.",
    };
  }
  const perQuestionCostCents = priceCentsFor(astrologer.rate);
  if (perQuestionCostCents <= 0) {
    return {
      ok: false as const,
      status: 409,
      message: "Chat pricing is not configured.",
    };
  }
  const wallet = await getCustomerWalletSummary(env, accountId);
  return {
    ok: true as const,
    canStartChat: wallet.balanceCents >= perQuestionCostCents,
    walletBalance: wallet.balanceCents / 100,
    walletBalanceCents: wallet.balanceCents,
    perQuestionCost: perQuestionCostCents / 100,
    perQuestionCostCents,
    estimatedQuestionsCount: Math.floor(
      wallet.balanceCents / perQuestionCostCents,
    ),
    astrologer,
  };
};

export const createAstrologyChatSession = async ({
  env,
  accountId,
  profileId,
  partnerProfileId,
  astrologerSlug,
  requestKey,
}: {
  env: RuntimeEnv;
  accountId: string;
  profileId: string;
  partnerProfileId?: string;
  astrologerSlug: string;
  requestKey?: unknown;
}) => {
  const key = safeString(requestKey);
  if (key && !validRequestKey(key)) {
    return {
      ok: false as const,
      status: 400,
      message: "A valid session request key is required.",
    };
  }
  if (key) {
    const existing = await first(
      env,
      `SELECT id FROM ${tables.chatSessions}
       WHERE account_id = ? AND client_request_key = ? LIMIT 1`,
      [accountId, key],
    );
    if (existing) {
      return {
        ok: true as const,
        replay: true,
        session: await getAstrologyChatSession(
          env,
          accountId,
          safeString(existing.id),
        ),
      };
    }
  }
  const [profile, eligibility] = await Promise.all([
    getCustomerUserProfile(env, accountId, profileId),
    checkAstrologyChatEligibility({ env, accountId, astrologerSlug }),
  ]);
  if (!profile) {
    return {
      ok: false as const,
      status: 404,
      message: "Select a valid birth profile before starting chat.",
    };
  }
  if (!eligibility.ok) return eligibility;

  const matchingChat = eligibility.astrologer.chatProfileType === "MATCHING";
  const cleanPartnerProfileId = safeString(partnerProfileId);
  if (matchingChat && !cleanPartnerProfileId) {
    return {
      ok: false as const,
      status: 400,
      message: "Select two birth profiles before starting compatibility chat.",
    };
  }
  if (matchingChat && cleanPartnerProfileId === profile.id) {
    return {
      ok: false as const,
      status: 400,
      message: "Select two different birth profiles for compatibility chat.",
    };
  }
  const partnerProfile = matchingChat
    ? await getCustomerUserProfile(env, accountId, cleanPartnerProfileId)
    : null;
  if (matchingChat && !partnerProfile) {
    return {
      ok: false as const,
      status: 404,
      message: "Select a valid second birth profile before starting chat.",
    };
  }

  const sessionId = createId("wchat");
  const now = nowIso();
  try {
    await run(
      env,
      `INSERT INTO ${tables.chatSessions} (
        id, account_id, profile_id, partner_profile_id, astrologer_slug, provider, session_name,
        status, price_cents, currency, client_request_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'astrologyapi', ?, 'active', ?, 'USD', ?, ?, ?)`,
      [
        sessionId,
        accountId,
        profile.id,
        partnerProfile?.id ?? null,
        eligibility.astrologer.slug,
        `Chat with ${eligibility.astrologer.name}`,
        eligibility.perQuestionCostCents,
        key || null,
        now,
        now,
      ],
    );
  } catch (error) {
    if (key) {
      const replay = await first(
        env,
        `SELECT id FROM ${tables.chatSessions}
         WHERE account_id = ? AND client_request_key = ? LIMIT 1`,
        [accountId, key],
      );
      if (replay) {
        return {
          ok: true as const,
          replay: true,
          session: await getAstrologyChatSession(
            env,
            accountId,
            safeString(replay.id),
          ),
        };
      }
    }
    throw error;
  }
  return {
    ok: true as const,
    replay: false,
    session: await getAstrologyChatSession(env, accountId, sessionId),
  };
};

const greetingOnlyPattern =
  /^(hi+|hello+|hey+|namaste|namaskar|pranam|good\s+(morning|afternoon|evening)|thanks?|thank\s+you|ok(?:ay)?|haan|han|yes|yo|sup)(\s+(ji|sir|madam|there|please|thanks?|thank\s+you|how\s+are\s+you))*[.!?।]*$/i;
const astrologyIntentPattern =
  /\b(astrology|astro|kundli|birth\s*chart|chart|horoscope|zodiac|planet|dasha|career|job|business|finance|money|marriage|love|relationship|compatibility|health|future|prediction|remedy|timing|transit)\b/i;

const isFreeGreetingMessage = (message: string) => {
  const clean = message.trim();
  return (
    clean.length > 0 &&
    clean.split(/\s+/).length <= 4 &&
    !astrologyIntentPattern.test(clean) &&
    greetingOnlyPattern.test(clean)
  );
};

const freeGreetingReply = (message: string) =>
  /thank|thanks/i.test(message)
    ? "You're welcome. Ask me about your chart, transits, career, relationships, or timing whenever you are ready."
    : "Hello. Ask me about your chart, transits, career, relationships, or timing whenever you are ready.";

const replayForMessage = async (
  env: RuntimeEnv,
  sessionId: string,
  requestKey: string,
) =>
  first(
    env,
    `SELECT user_message.id AS user_id,
            assistant_message.message AS answer,
            assistant_message.cost_cents AS cost_cents
     FROM ${tables.chatMessages} user_message
     LEFT JOIN ${tables.chatMessages} assistant_message
       ON assistant_message.reply_to_message_id = user_message.id
      AND assistant_message.role = 'assistant'
     WHERE user_message.session_id = ?
       AND user_message.client_request_key = ?
     LIMIT 1`,
    [sessionId, requestKey],
  );

const persistReply = async ({
  env,
  sessionId,
  userMessageId,
  assistantMessageId,
  requestKey,
  message,
  answer,
  costCents,
  providerStatusCode,
  freeGreeting,
}: {
  env: RuntimeEnv;
  sessionId: string;
  userMessageId: string;
  assistantMessageId: string;
  requestKey: string;
  message: string;
  answer: string;
  costCents: number;
  providerStatusCode?: number;
  freeGreeting?: boolean;
}) => {
  const createdAt = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.chatMessages}
      (id, session_id, role, message, client_request_key, cost_cents, created_at)
     VALUES (?, ?, 'user', ?, ?, 0, ?)`,
    [userMessageId, sessionId, message, requestKey, createdAt],
  );
  await run(
    env,
    `INSERT INTO ${tables.chatMessages}
      (id, session_id, role, message, provider_message_json,
       reply_to_message_id, cost_cents, created_at)
     VALUES (?, ?, 'assistant', ?, ?, ?, ?, ?)`,
    [
      assistantMessageId,
      sessionId,
      answer,
      JSON.stringify({ providerStatusCode, freeGreeting: Boolean(freeGreeting) }),
      userMessageId,
      costCents,
      nowIso(),
    ],
  );
  await run(
    env,
    `UPDATE ${tables.chatSessions} SET updated_at = ? WHERE id = ?`,
    [nowIso(), sessionId],
  );
};

const debitWalletForChat = async ({
  env,
  accountId,
  amountCents,
  session,
  messageId,
}: {
  env: RuntimeEnv;
  accountId: string;
  amountCents: number;
  session: AstrologyChatSession;
  messageId: string;
}) => {
  const wallet = await ensureCustomerWallet(env, accountId);
  if (!wallet) {
    return {
      ok: false as const,
      status: 500,
      message: "Wallet storage is unavailable.",
    };
  }
  const walletId = safeString(wallet.id);
  const now = nowIso();
  const updated = await first(
    env,
    `UPDATE ${tables.wallets}
     SET balance_cents = balance_cents - ?, updated_at = ?
     WHERE id = ? AND account_id = ? AND balance_cents >= ?
     RETURNING balance_cents`,
    [amountCents, now, walletId, accountId, amountCents],
  );
  if (!updated) {
    const current = await getCustomerWalletSummary(env, accountId);
    return {
      ok: false as const,
      status: 402,
      code: "INSUFFICIENT_WALLET_BALANCE" as const,
      message: "Add money to your wallet to send this question.",
      balanceCents: current.balanceCents,
      requiredCents: amountCents,
      shortfallCents: Math.max(0, amountCents - current.balanceCents),
    };
  }
  const balanceAfterCents = Number(updated.balance_cents ?? 0);
  const transactionId = createId("wtx");
  try {
    await run(
      env,
      `INSERT INTO ${tables.walletTransactions} (
        id, wallet_id, account_id, recharge_id, transaction_type,
        amount_cents, balance_after_cents, currency, description,
        metadata_json, created_at
      ) VALUES (?, ?, ?, NULL, 'chat_debit', ?, ?, 'USD', ?, ?, ?)`,
      [
        transactionId,
        walletId,
        accountId,
        -amountCents,
        balanceAfterCents,
        `Chat question with ${session.astrologerName} · ${formatUsd(amountCents)}`,
        JSON.stringify({
          sessionId: session.id,
          astrologerSlug: session.astrologerSlug,
          messageId,
        }),
        now,
      ],
    );
  } catch (error) {
    await run(
      env,
      `UPDATE ${tables.wallets}
       SET balance_cents = balance_cents + ?, updated_at = ?
       WHERE id = ? AND account_id = ?`,
      [amountCents, nowIso(), walletId, accountId],
    );
    throw error;
  }
  return {
    ok: true as const,
    walletId,
    transactionId,
    balanceAfterCents,
  };
};

const rollbackDebit = async ({
  env,
  accountId,
  walletId,
  transactionId,
  amountCents,
}: {
  env: RuntimeEnv;
  accountId: string;
  walletId: string;
  transactionId: string;
  amountCents: number;
}) => {
  const removed = await run(
    env,
    `DELETE FROM ${tables.walletTransactions}
     WHERE id = ? AND account_id = ? AND transaction_type = 'chat_debit'`,
    [transactionId, accountId],
  );
  if (changed(removed)) {
    await run(
      env,
      `UPDATE ${tables.wallets}
       SET balance_cents = balance_cents + ?, updated_at = ?
       WHERE id = ? AND account_id = ?`,
      [amountCents, nowIso(), walletId, accountId],
    );
  }
};

export const sendAstrologyChatMessage = async ({
  env,
  accountId,
  sessionId,
  message,
  requestKey,
  fetcher,
}: {
  env: RuntimeEnv;
  accountId: string;
  sessionId: string;
  message: unknown;
  requestKey: unknown;
  fetcher?: typeof fetch;
}) => {
  const cleanMessage = safeString(message).slice(0, 2000);
  const key = safeString(requestKey);
  if (!cleanMessage) {
    return { ok: false as const, status: 400, message: "Message is required." };
  }
  if (!validRequestKey(key)) {
    return {
      ok: false as const,
      status: 400,
      message: "A valid message request key is required.",
    };
  }
  const session = await getAstrologyChatSession(env, accountId, sessionId);
  if (!session) {
    return {
      ok: false as const,
      status: 404,
      message: "Chat session was not found.",
    };
  }
  if (session.status !== "active") {
    return {
      ok: false as const,
      status: 409,
      message: "Chat session is not active.",
    };
  }

  const existing = await replayForMessage(env, session.id, key);
  if (existing) {
    if (!safeString(existing.answer)) {
      return {
        ok: false as const,
        status: 409,
        message: "This message is still being processed.",
      };
    }
    const wallet = await getCustomerWalletSummary(env, accountId);
    return {
      ok: true as const,
      replay: true,
      free: Number(existing.cost_cents ?? 0) === 0,
      answer: safeString(existing.answer),
      costCents: Number(existing.cost_cents ?? 0),
      balanceAfterCents: wallet.balanceCents,
    };
  }

  const lockToken = createId("lock");
  const now = nowIso();
  const locked = await run(
    env,
    `UPDATE ${tables.chatSessions}
     SET send_lock_token = ?, send_lock_expires_at = ?, updated_at = ?
     WHERE id = ? AND account_id = ? AND status = 'active'
       AND (send_lock_token IS NULL OR send_lock_expires_at < ?)`,
    [
      lockToken,
      new Date(Date.now() + 60_000).toISOString(),
      now,
      session.id,
      accountId,
      now,
    ],
  );
  if (!changed(locked)) {
    return {
      ok: false as const,
      status: 409,
      message: "Another message is being processed.",
    };
  }

  const userMessageId = createId("wmsg");
  const assistantMessageId = createId("wmsg");
  try {
    const replayAfterLock = await replayForMessage(env, session.id, key);
    if (replayAfterLock?.answer) {
      const wallet = await getCustomerWalletSummary(env, accountId);
      return {
        ok: true as const,
        replay: true,
        free: Number(replayAfterLock.cost_cents ?? 0) === 0,
        answer: safeString(replayAfterLock.answer),
        costCents: Number(replayAfterLock.cost_cents ?? 0),
        balanceAfterCents: wallet.balanceCents,
      };
    }

    if (isFreeGreetingMessage(cleanMessage)) {
      const answer = freeGreetingReply(cleanMessage);
      await persistReply({
        env,
        sessionId: session.id,
        userMessageId,
        assistantMessageId,
        requestKey: key,
        message: cleanMessage,
        answer,
        costCents: 0,
        freeGreeting: true,
      });
      const wallet = await getCustomerWalletSummary(env, accountId);
      return {
        ok: true as const,
        replay: false,
        free: true,
        answer,
        costCents: 0,
        balanceAfterCents: wallet.balanceCents,
      };
    }

    const [profile, partnerProfile, astrologer, wallet] = await Promise.all([
      getCustomerUserProfile(env, accountId, session.profileId),
      session.partnerProfileId
        ? getCustomerUserProfile(env, accountId, session.partnerProfileId)
        : Promise.resolve(null),
      getAstrologerBySlug(env, session.astrologerSlug),
      getCustomerWalletSummary(env, accountId),
    ]);
    if (!profile) {
      return {
        ok: false as const,
        status: 409,
        message: "Birth profile is unavailable.",
      };
    }
    if (!astrologer) {
      return {
        ok: false as const,
        status: 409,
        message: "Selected astrologer is unavailable.",
      };
    }
    const requiredCents = session.priceCents;
    if (wallet.balanceCents < requiredCents) {
      return {
        ok: false as const,
        status: 402,
        code: "INSUFFICIENT_WALLET_BALANCE" as const,
        message: "Add money to your wallet to send this question.",
        balanceCents: wallet.balanceCents,
        requiredCents,
        shortfallCents: requiredCents - wallet.balanceCents,
      };
    }

    const provider = await callAstrologyChatProvider({
      env,
      profile,
      partnerProfile,
      sessionId: session.id,
      message: cleanMessage,
      fetcher,
    });
    if (!provider.ok) {
      return {
        ...provider,
        status: provider.reason === "missing-provider" ? 503 : 502,
      };
    }

    const debit = await debitWalletForChat({
      env,
      accountId,
      amountCents: requiredCents,
      session,
      messageId: assistantMessageId,
    });
    if (!debit.ok) return debit;

    try {
      await persistReply({
        env,
        sessionId: session.id,
        userMessageId,
        assistantMessageId,
        requestKey: key,
        message: cleanMessage,
        answer: provider.answer,
        costCents: requiredCents,
        providerStatusCode: provider.providerStatusCode,
      });
    } catch (error) {
      await run(
        env,
        `DELETE FROM ${tables.chatMessages}
         WHERE session_id = ? AND (id = ? OR id = ?)`,
        [session.id, userMessageId, assistantMessageId],
      );
      await rollbackDebit({
        env,
        accountId,
        walletId: debit.walletId,
        transactionId: debit.transactionId,
        amountCents: requiredCents,
      });
      throw error;
    }
    return {
      ok: true as const,
      replay: false,
      free: false,
      answer: provider.answer,
      costCents: requiredCents,
      balanceAfterCents: debit.balanceAfterCents,
    };
  } finally {
    await run(
      env,
      `UPDATE ${tables.chatSessions}
       SET send_lock_token = NULL, send_lock_expires_at = NULL
       WHERE id = ? AND account_id = ? AND send_lock_token = ?`,
      [session.id, accountId, lockToken],
    );
  }
};

export const renameAstrologyChatSession = async (
  env: RuntimeEnv,
  accountId: string,
  sessionId: string,
  sessionName: unknown,
) => {
  const name = safeString(sessionName).slice(0, 120);
  if (!name) {
    return {
      ok: false as const,
      status: 400,
      message: "Session name is required.",
    };
  }
  const result = await run(
    env,
    `UPDATE ${tables.chatSessions} SET session_name = ?, updated_at = ?
     WHERE id = ? AND account_id = ?`,
    [name, nowIso(), sessionId, accountId],
  );
  if (!changed(result)) {
    return {
      ok: false as const,
      status: 404,
      message: "Session was not found.",
    };
  }
  return {
    ok: true as const,
    session: await getAstrologyChatSession(env, accountId, sessionId),
  };
};

export const completeAstrologyChatSession = async (
  env: RuntimeEnv,
  accountId: string,
  sessionId: string,
) => {
  const now = nowIso();
  const result = await run(
    env,
    `UPDATE ${tables.chatSessions}
     SET status = 'completed', completed_at = COALESCE(completed_at, ?),
         updated_at = ?
     WHERE id = ? AND account_id = ?`,
    [now, now, sessionId, accountId],
  );
  return changed(result)
    ? { ok: true as const }
    : {
        ok: false as const,
        status: 404,
        message: "Session was not found.",
      };
};

export const deleteAstrologyChatSession = async (
  env: RuntimeEnv,
  accountId: string,
  sessionId: string,
) => {
  const session = await getAstrologyChatSession(env, accountId, sessionId);
  if (!session) {
    return {
      ok: false as const,
      status: 404,
      message: "Session was not found.",
    };
  }
  await run(env, `DELETE FROM ${tables.chatMessages} WHERE session_id = ?`, [
    session.id,
  ]);
  const result = await run(
    env,
    `DELETE FROM ${tables.chatSessions} WHERE id = ? AND account_id = ?`,
    [session.id, accountId],
  );
  return changed(result)
    ? { ok: true as const }
    : {
        ok: false as const,
        status: 409,
        message: "Session could not be deleted.",
      };
};
