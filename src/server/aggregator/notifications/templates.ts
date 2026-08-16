export type TemplateValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export type RenderedEmailResult =
  | {
      ok: true;
      subject: string;
      htmlBody: string;
      textBody: string;
    }
  | { ok: false; message: string };

const tokenPattern = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export const extractTemplateVariables = (parts: string[]) => {
  const variables = new Set<string>();
  for (const part of parts) {
    for (const match of part.matchAll(tokenPattern)) {
      variables.add(match[1]);
    }
  }
  return [...variables].sort();
};

export const validateTemplateVariables = ({
  subject,
  htmlBody,
  textBody,
  requiredVariables,
}: {
  subject: string;
  htmlBody: string;
  textBody: string;
  requiredVariables: string[];
}): TemplateValidationResult => {
  const allowed = new Set(requiredVariables);
  const used = extractTemplateVariables([subject, htmlBody, textBody]);
  const unknown = used.filter((variable) => !allowed.has(variable));
  if (unknown.length > 0) {
    return {
      ok: false,
      message: `Template uses unknown variables: ${unknown.join(", ")}.`,
    };
  }
  return { ok: true };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderPart = (
  part: string,
  payload: Record<string, unknown>,
  escape = false,
) =>
  part.replace(tokenPattern, (_, variable: string) => {
    const value = payload[variable];
    if (value === null || value === undefined) return "";
    const text = String(value);
    return escape ? escapeHtml(text) : text;
  });

export const renderEmailTemplate = ({
  template,
  payload,
}: {
  template: {
    subject: string;
    htmlBody: string;
    textBody: string;
    requiredVariables: string[];
  };
  payload: Record<string, unknown>;
}): RenderedEmailResult => {
  const missing = template.requiredVariables.filter((variable) => {
    const value = payload[variable];
    return value === null || value === undefined || String(value).trim() === "";
  });
  if (missing.length > 0) {
    return {
      ok: false,
      message: `Missing required template variables: ${missing.join(", ")}.`,
    };
  }

  const validation = validateTemplateVariables(template);
  if (!validation.ok) return validation;

  return {
    ok: true,
    subject: renderPart(template.subject, payload),
    htmlBody: renderPart(template.htmlBody, payload, true),
    textBody: renderPart(template.textBody, payload),
  };
};

export const parseJsonArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((entry) => String(entry)) : [];
  } catch {
    return [];
  }
};
