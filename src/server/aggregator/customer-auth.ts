import { AP_TABLES as tables } from "./db/tables.ts";
import { sendPasswordResetEmail } from "./notifications/password-reset-email.ts";
import { createId, nowIso, safeString, type RuntimeEnv } from "./runtime.ts";

type Row = Record<string, unknown>;

const encoder = new TextEncoder();
const sessionCookieName = "ap_customer_session";
const csrfCookieName = "ap_customer_csrf";
const sessionTtlMs = 30 * 24 * 60 * 60 * 1000;
const passwordResetTtlMs = 60 * 60 * 1000;
const passwordIterations = 100_000;

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const fromHex = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
};

const sha256Hex = async (value: string) =>
  toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));

const randomHex = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return [...array].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const first = async <T extends Row = Row>(
  env: RuntimeEnv,
  sql: string,
  values: unknown[] = [],
) => {
  if (!env.DB) return null;
  const statement = env.DB.prepare(sql).bind(...values) as {
    first?: <Result = T>() => Promise<Result | null>;
  };
  return (await statement.first?.<T>()) ?? null;
};

const run = async (env: RuntimeEnv, sql: string, values: unknown[] = []) => {
  if (!env.DB) return;
  return await env.DB.prepare(sql)
    .bind(...values)
    .run?.();
};

const normalizeEmail = (email: unknown) => safeString(email).toLowerCase();

const requestOrigin = (env: RuntimeEnv, request: Request) => {
  const configured = safeString(env.SITE_ORIGIN);
  return (configured || new URL(request.url).origin).replace(/\/+$/, "");
};

const hashPassword = async (password: string, salt = randomHex(16)) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: fromHex(salt),
      iterations: passwordIterations,
    },
    keyMaterial,
    256,
  );
  return { salt, hash: toHex(bits) };
};

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
};

const cookieValue = (request: Request, name: string) => {
  const cookie = request.headers.get("cookie") ?? "";
  return (
    cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? ""
  );
};

const cookieSuffix = (request: Request) => {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Lax${secure}`;
};

const csrfCookieSuffix = (request: Request) => {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `Path=/; SameSite=Lax${secure}`;
};

const accountFromRow = (row: Row) => ({
  id: String(row.id),
  email: String(row.email),
  displayName: String(row.display_name ?? ""),
  phone: row.phone ? String(row.phone) : "",
  defaultLanguage: row.default_language
    ? String(row.default_language)
    : "English",
  consentMarketing: Number(row.consent_marketing ?? 0) === 1,
  houseSystem: safeString(row.house_system) || "placidus",
  zodiacSystem: safeString(row.zodiac_system) || "tropical",
  dailyHoroscope: Number(row.daily_horoscope ?? 1) === 1,
  createdAt: String(row.created_at ?? ""),
  updatedAt: String(row.updated_at ?? ""),
});

export type CustomerAccount = ReturnType<typeof accountFromRow>;

export const getCustomerAccountByEmail = async (
  env: RuntimeEnv,
  email: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.customerAccounts} WHERE email = ?`,
    [normalizeEmail(email)],
  );
  return row ? accountFromRow(row) : null;
};

export const getCustomerAccountById = async (
  env: RuntimeEnv,
  accountId: string,
) => {
  const row = await first(
    env,
    `SELECT * FROM ${tables.customerAccounts} WHERE id = ?`,
    [accountId],
  );
  return row ? accountFromRow(row) : null;
};

const createCustomerSession = async ({
  env,
  accountId,
  request,
}: {
  env: RuntimeEnv;
  accountId: string;
  request: Request;
}) => {
  const token = randomHex(32);
  const csrf = randomHex(24);
  const expiresAt = new Date(Date.now() + sessionTtlMs).toISOString();
  const now = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.customerSessions} (
      id, account_id, session_token_hash, csrf_token_hash, expires_at,
      last_seen_at, revoked_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)`,
    [
      createId("csess"),
      accountId,
      await sha256Hex(token),
      await sha256Hex(csrf),
      expiresAt,
      now,
      now,
    ],
  );
  return {
    csrfToken: csrf,
    cookies: [
      `${sessionCookieName}=${token}; Expires=${new Date(expiresAt).toUTCString()}; ${cookieSuffix(request)}`,
      `${csrfCookieName}=${csrf}; Expires=${new Date(expiresAt).toUTCString()}; ${csrfCookieSuffix(request)}`,
    ],
  };
};

export const signupCustomer = async ({
  env,
  request,
  displayName,
  email,
  phone,
  password,
  acceptedTerms,
  consentMarketing,
}: {
  env: RuntimeEnv;
  request: Request;
  displayName: unknown;
  email: unknown;
  phone?: unknown;
  password: unknown;
  acceptedTerms: unknown;
  consentMarketing?: unknown;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      code: "storage_unavailable",
      message: "Customer account storage is not ready.",
    };
  const normalizedEmail = normalizeEmail(email);
  const name = safeString(displayName);
  const rawPassword = safeString(password);
  if (!name)
    return {
      ok: false as const,
      code: "name_required",
      message: "Full name is required.",
    };
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return {
      ok: false as const,
      code: "invalid_email",
      message: "Enter a valid email address.",
    };
  }
  if (rawPassword.length < 8) {
    return {
      ok: false as const,
      code: "password_too_short",
      message: "Password must be at least 8 characters.",
    };
  }
  if (acceptedTerms !== true) {
    return {
      ok: false as const,
      code: "terms_required",
      message: "Accept the Terms and Privacy Policy to continue.",
    };
  }
  if (await getCustomerAccountByEmail(env, normalizedEmail)) {
    return {
      ok: false as const,
      code: "email_exists",
      message: "An account already exists for this email.",
    };
  }

  const now = nowIso();
  const accountId = createId("acct");
  const passwordResult = await hashPassword(rawPassword);
  await run(
    env,
    `INSERT INTO ${tables.customerAccounts} (
      id, email, display_name, phone, password_hash, password_salt,
      default_language, consent_marketing, email_verified_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'English', ?, NULL, ?, ?)`,
    [
      accountId,
      normalizedEmail,
      name,
      safeString(phone) || null,
      passwordResult.hash,
      passwordResult.salt,
      consentMarketing === true ? 1 : 0,
      now,
      now,
    ],
  );
  const account = await getCustomerAccountById(env, accountId);
  if (!account)
    return {
      ok: false as const,
      code: "create_failed",
      message: "Account could not be created.",
    };
  const session = await createCustomerSession({ env, accountId, request });
  return {
    ok: true as const,
    account,
    cookies: session.cookies,
    csrfToken: session.csrfToken,
  };
};

export const requestCustomerPasswordReset = async ({
  env,
  request,
  email,
  locale,
  tokenForTest,
  sendEmail = sendPasswordResetEmail,
}: {
  env: RuntimeEnv;
  request: Request;
  email: unknown;
  locale?: unknown;
  tokenForTest?: string;
  sendEmail?: typeof sendPasswordResetEmail;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      code: "storage_unavailable",
      message: "Customer account storage is not ready.",
    };
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return {
      ok: false as const,
      code: "invalid_email",
      message: "Enter a valid email address.",
    };
  }

  const genericMessage =
    "If an account exists for this email, password reset instructions will be sent shortly.";
  const row = await first(
    env,
    `SELECT * FROM ${tables.customerAccounts} WHERE email = ?`,
    [normalizedEmail],
  );
  if (!row) return { ok: true as const, message: genericMessage };

  const token =
    tokenForTest && /^[a-f0-9]{64}$/i.test(tokenForTest)
      ? tokenForTest
      : randomHex(32);
  const resetUrl = new URL(
    "/reset-password",
    `${requestOrigin(env, request)}/`,
  );
  resetUrl.searchParams.set("token", token);
  const resolvedLocale = safeString(locale);
  if (resolvedLocale && resolvedLocale !== "en")
    resetUrl.searchParams.set("locale", resolvedLocale);
  const now = nowIso();
  await run(
    env,
    `INSERT INTO ${tables.customerPasswordResets} (
      id, account_id, reset_token_hash, expires_at, used_at, created_at
    ) VALUES (?, ?, ?, ?, NULL, ?)`,
    [
      createId("cpwr"),
      String(row.id),
      await sha256Hex(token),
      new Date(Date.now() + passwordResetTtlMs).toISOString(),
      now,
    ],
  );
  await sendEmail({
    env,
    email: normalizedEmail,
    resetUrl: resetUrl.toString(),
  }).catch(() => ({ ok: false as const }));
  return { ok: true as const, message: genericMessage };
};

export const resetCustomerPassword = async ({
  env,
  token,
  password,
}: {
  env: RuntimeEnv;
  token: unknown;
  password: unknown;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      code: "storage_unavailable",
      message: "Customer account storage is not ready.",
    };
  const rawToken = safeString(token);
  const rawPassword = safeString(password);
  if (!rawToken)
    return {
      ok: false as const,
      code: "invalid_token",
      message: "Reset link is invalid or expired.",
    };
  if (rawPassword.length < 8) {
    return {
      ok: false as const,
      code: "password_too_short",
      message: "Password must be at least 8 characters.",
    };
  }

  const row = await first(
    env,
    `SELECT * FROM ${tables.customerPasswordResets}
      WHERE reset_token_hash = ? AND used_at IS NULL
      ORDER BY created_at DESC LIMIT 1`,
    [await sha256Hex(rawToken)],
  );
  if (!row || new Date(String(row.expires_at)).getTime() < Date.now()) {
    return {
      ok: false as const,
      code: "invalid_token",
      message: "Reset link is invalid or expired.",
    };
  }

  const now = nowIso();
  const consumed = (await run(
    env,
    `UPDATE ${tables.customerPasswordResets} SET used_at = ? WHERE id = ? AND used_at IS NULL`,
    [now, String(row.id)],
  )) as { meta?: { changes?: number }; changes?: number } | undefined;
  const changes = Number(consumed?.meta?.changes ?? consumed?.changes ?? 0);
  if (changes !== 1) {
    return {
      ok: false as const,
      code: "invalid_token",
      message: "Reset link is invalid or expired.",
    };
  }

  const passwordResult = await hashPassword(rawPassword);
  await run(
    env,
    `UPDATE ${tables.customerAccounts} SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?`,
    [passwordResult.hash, passwordResult.salt, now, String(row.account_id)],
  );
  await run(
    env,
    `UPDATE ${tables.customerSessions} SET revoked_at = ? WHERE account_id = ? AND revoked_at IS NULL`,
    [now, String(row.account_id)],
  );
  return {
    ok: true as const,
    message: "Password updated. Please sign in with your new password.",
  };
};

export const loginCustomer = async ({
  env,
  request,
  email,
  password,
}: {
  env: RuntimeEnv;
  request: Request;
  email: unknown;
  password: unknown;
}) => {
  if (!env.DB)
    return {
      ok: false as const,
      message: "Customer account storage is not ready.",
    };
  const normalizedEmail = normalizeEmail(email);
  const rawPassword = safeString(password);
  if (!normalizedEmail || !rawPassword)
    return { ok: false as const, message: "Email and password are required." };
  const row = await first(
    env,
    `SELECT * FROM ${tables.customerAccounts} WHERE email = ?`,
    [normalizedEmail],
  );
  if (!row)
    return { ok: false as const, message: "Email or password is incorrect." };
  const passwordResult = await hashPassword(
    rawPassword,
    String(row.password_salt ?? ""),
  );
  if (!timingSafeEqual(passwordResult.hash, String(row.password_hash ?? ""))) {
    return { ok: false as const, message: "Email or password is incorrect." };
  }
  const account = accountFromRow(row);
  const session = await createCustomerSession({
    env,
    accountId: account.id,
    request,
  });
  return {
    ok: true as const,
    account,
    cookies: session.cookies,
    csrfToken: session.csrfToken,
  };
};

export const getCustomerSession = async (env: RuntimeEnv, request: Request) => {
  const token = cookieValue(request, sessionCookieName);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const session = await first(
    env,
    `SELECT * FROM ${tables.customerSessions}
     WHERE session_token_hash = ? AND revoked_at IS NULL`,
    [tokenHash],
  );
  if (!session || new Date(String(session.expires_at)).getTime() < Date.now())
    return null;
  const account = await getCustomerAccountById(env, String(session.account_id));
  if (!account) return null;
  await run(
    env,
    `UPDATE ${tables.customerSessions} SET last_seen_at = ? WHERE id = ?`,
    [nowIso(), String(session.id)],
  );
  return {
    sessionId: String(session.id),
    account,
    csrfToken: cookieValue(request, csrfCookieName),
    csrfTokenHash: String(session.csrf_token_hash ?? ""),
  };
};

export const requireCustomerSession = async (
  env: RuntimeEnv,
  request: Request,
) => {
  const session = await getCustomerSession(env, request);
  if (!session) {
    return {
      ok: false as const,
      response: new Response("Customer login is required.", { status: 401 }),
    };
  }
  return { ok: true as const, session };
};

export const requireCustomerCsrf = async (
  env: RuntimeEnv,
  request: Request,
) => {
  const auth = await requireCustomerSession(env, request);
  if (!auth.ok) return auth;
  const supplied = request.headers.get("x-astropages-customer-csrf") ?? "";
  if (
    !supplied ||
    !timingSafeEqual(await sha256Hex(supplied), auth.session.csrfTokenHash)
  ) {
    return {
      ok: false as const,
      response: new Response("Customer CSRF validation failed.", {
        status: 403,
      }),
    };
  }
  return auth;
};

export const revokeCustomerSession = async (
  env: RuntimeEnv,
  request: Request,
) => {
  const token = cookieValue(request, sessionCookieName);
  if (token) {
    await run(
      env,
      `UPDATE ${tables.customerSessions} SET revoked_at = ? WHERE session_token_hash = ?`,
      [nowIso(), await sha256Hex(token)],
    );
  }
  return [
    `${sessionCookieName}=; Max-Age=0; ${cookieSuffix(request)}`,
    `${csrfCookieName}=; Max-Age=0; ${csrfCookieSuffix(request)}`,
  ];
};
