import { safeString, type RuntimeEnv } from "../runtime.ts";
import { readSenderSettings, sendTransactionalEmail } from "./transactional.ts";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const sendPasswordResetEmail = async ({
  env,
  email,
  resetUrl,
}: {
  env: RuntimeEnv;
  email: string;
  resetUrl: string;
}) => {
  const recipient = safeString(email);
  const url = safeString(resetUrl);
  const sender = await readSenderSettings(env);
  if (!recipient || !url || !sender.senderEmail) {
    return {
      ok: false as const,
      message: "Password reset email is not configured.",
    };
  }
  const safeUrl = escapeHtml(url);
  return sendTransactionalEmail({
    env,
    message: {
      to: [{ email: recipient }],
      sender: {
        email: sender.senderEmail,
        name: sender.senderName || "Sidera",
      },
      subject: "Reset your Sidera password",
      html: `<p>Hello,</p><p>Use this private link to reset your Sidera password. It expires in one hour.</p><p><a href="${safeUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      text: `Reset your Sidera password using this private one-hour link:\n${url}\n\nIf you did not request this, ignore this email.`,
      tags: ["password_reset_customer", "customer.password_reset"],
    },
  });
};
