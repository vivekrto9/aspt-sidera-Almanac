export type D1DatabaseLike = {
  prepare: (sql: string) => {
    bind: (...values: unknown[]) => any;
    first?: <T = Record<string, unknown>>() => Promise<T | null>;
    all?: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
    run?: () => Promise<unknown>;
  };
};

export type RuntimeEnv = Record<string, unknown> & {
  DB?: D1DatabaseLike;
};

export const nowIso = () => new Date().toISOString();

export const createId = (prefix: string) => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${String(random).replace(/-/g, "").slice(0, 18)}`;
};

export const safeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const required = (value: unknown) => safeString(value).length > 0;
