import type { SupportedLocale } from "../../localization-contract.ts";

export type ForgotPasswordSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "Forgot password | Sidera",
    description:
      "Request a password reset for your Sidera account in a secure and simple way.",
    imageAlt: "Forgot password on Sidera",
  },
  es: {
    title: "Olvidé mi contraseña | Sidera",
    description:
      "Solicita un restablecimiento de contraseña para tu cuenta de Sidera de forma segura y rápida.",
    imageAlt: "Restablecer contraseña en Sidera",
  },
  fr: {
    title: "Mot de passe oublié | Sidera",
    description:
      "Demandez la réinitialisation de votre mot de passe Sidera de façon sûre et simple.",
    imageAlt: "Mot de passe oublié sur Sidera",
  },
  pt: {
    title: "Esqueci minha senha | Sidera",
    description:
      "Solicite a redefinição de senha da sua conta Sidera de forma segura e simples.",
    imageAlt: "Esqueci a senha no Sidera",
  },
  ru: {
    title: "Забыли пароль | Sidera",
    description:
      "Запросите безопасное и простое восстановление пароля для вашего аккаунта Sidera.",
    imageAlt: "Забыли пароль в Sidera",
  },
  it: {
    title: "Password dimenticata | Sidera",
    description:
      "Richiedi un ripristino della password per il tuo account Sidera in modo semplice e sicuro.",
    imageAlt: "Password dimenticata su Sidera",
  },
  de: {
    title: "Passwort vergessen | Sidera",
    description:
      "Fordere eine sichere und einfache Passwortwiederherstellung für dein Sidera-Konto an.",
    imageAlt: "Passwort vergessen bei Sidera",
  },
} satisfies Record<SupportedLocale, ForgotPasswordSeoCopy>;

export const getForgotPasswordSeoCopy = (
  locale: SupportedLocale,
): ForgotPasswordSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
