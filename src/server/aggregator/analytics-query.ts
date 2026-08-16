type D1BoundStatementLike = {
  first?: <T = Record<string, unknown>>() => Promise<T | null>;
  all?: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
};

type D1StatementLike = {
  bind: (...values: unknown[]) => D1BoundStatementLike;
  first?: <T = Record<string, unknown>>() => Promise<T | null>;
  all?: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
};

export type AnalyticsQueryDb = {
  prepare: (sql: string) => D1StatementLike;
};

export type AnalyticsDateRangeKey =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_3_months"
  | "this_month"
  | "last_month"
  | "this_year"
  | "all_time";

export type AnalyticsPlan = {
  mode: "unsupported";
  confidence: number;
  reason: string;
  params: {
    rangeKey: AnalyticsDateRangeKey;
    from: string | null;
    to: string | null;
    label: string;
  };
};

export type AnalyticsQueryResponse = {
  answer: string;
  title?: string;
  range?: {
    from?: string;
    to?: string;
    label?: string;
  };
  metrics?: Array<{
    label: string;
    value: number | string;
    unit?: string;
  }>;
  rows?: Array<Record<string, unknown>>;
  plan?: Record<string, unknown>;
};

const supportedTopicsAnswer =
  "Analytics is available through the MCP endpoint, but no project-specific analytics adapters are configured for Sidera yet.";

const pad = (value: number) => String(value).padStart(2, "0");

const isoDate = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

const startOfUtcDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const addUtcDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const addUtcMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

const parseNow = (now: string) => {
  const parsed = new Date(now);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeQuestion = (question: string) =>
  question.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

const resolveDateRange = (question: string, now: string): AnalyticsPlan["params"] => {
  const current = startOfUtcDay(parseNow(now));
  const tomorrow = addUtcDays(current, 1);
  const yesterday = addUtcDays(current, -1);
  const monthStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1));
  const lastMonthStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 1, 1));
  const yearStart = new Date(Date.UTC(current.getUTCFullYear(), 0, 1));

  if (/\byesterday\b/.test(question)) {
    return { rangeKey: "yesterday", from: isoDate(yesterday), to: isoDate(current), label: "yesterday" };
  }
  if (/\btoday\b/.test(question)) {
    return { rangeKey: "today", from: isoDate(current), to: isoDate(tomorrow), label: "today" };
  }
  if (/\blast\s*7\s*days?\b|\b7d\b/.test(question)) {
    return { rangeKey: "last_7_days", from: isoDate(addUtcDays(current, -7)), to: isoDate(tomorrow), label: "last 7 days" };
  }
  if (/\blast\s*30\s*days?\b|\b30d\b/.test(question)) {
    return { rangeKey: "last_30_days", from: isoDate(addUtcDays(current, -30)), to: isoDate(tomorrow), label: "last 30 days" };
  }
  if (/\blast\s*3\s*months?\b|\bpast\s*3\s*months?\b|\bthree\s*months?\b/.test(question)) {
    return { rangeKey: "last_3_months", from: isoDate(addUtcMonths(current, -3)), to: isoDate(tomorrow), label: "last 3 months" };
  }
  if (/\blast\s*month\b|previous\s*month\b/.test(question)) {
    return { rangeKey: "last_month", from: isoDate(lastMonthStart), to: isoDate(monthStart), label: "last month" };
  }
  if (/\bthis\s*month\b|current\s*month\b/.test(question)) {
    return { rangeKey: "this_month", from: isoDate(monthStart), to: isoDate(nextMonthStart), label: "this month" };
  }
  if (/\bthis\s*year\b|current\s*year\b|year\s*to\s*date\b|ytd\b/.test(question)) {
    return { rangeKey: "this_year", from: isoDate(yearStart), to: isoDate(tomorrow), label: "this year" };
  }

  return { rangeKey: "all_time", from: null, to: null, label: "all time" };
};

export const findAnalyticsApi = (
  question: string,
  now = new Date().toISOString(),
  timezone = "Asia/Kolkata",
): AnalyticsPlan => {
  void timezone;
  return {
    mode: "unsupported",
    confidence: 0.1,
    reason: "No project-specific analytics adapters are configured for Sidera.",
    params: resolveDateRange(normalizeQuestion(question), now),
  };
};

export const formatAnalyticsAnswer = (plan: AnalyticsPlan): AnalyticsQueryResponse => ({
  answer: supportedTopicsAnswer,
  title: "Analytics help",
  range: {
    ...(plan.params.from ? { from: plan.params.from } : {}),
    ...(plan.params.to ? { to: plan.params.to } : {}),
    label: plan.params.label,
  },
  plan,
});

export const answerAnalyticsQuery = async (input: {
  db?: AnalyticsQueryDb;
  question: string;
  projectId?: string;
  timezone?: string;
  now?: string;
}): Promise<AnalyticsQueryResponse> => {
  const plan = findAnalyticsApi(input.question, input.now ?? new Date().toISOString(), input.timezone ?? "Asia/Kolkata");
  void input.db;
  void input.projectId;
  return formatAnalyticsAnswer(plan);
};

export const unsupportedAnalyticsAnswer = supportedTopicsAnswer;
