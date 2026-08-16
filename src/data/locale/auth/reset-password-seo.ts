import type { SupportedLocale } from "../../localization-contract.ts";

export type ResetPasswordSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "Reset password | Sidera",
    description: "Set a secure new password for your Sidera account.",
    imageAlt: "Reset password on Sidera",
  },
  es: {
    title: "Restablecer contraseña | Sidera",
    description: "Configura una nueva contraseña segura para tu cuenta Sidera.",
    imageAlt: "Restablecer contraseña en Sidera",
  },
  fr: {
    title: "Réinitialisation du mot de passe | Sidera",
    description:
      "Définissez un nouveau mot de passe sécurisé pour votre compte Sidera.",
    imageAlt: "Réinitialiser le mot de passe sur Sidera",
  },
  pt: {
    title: "Redefinir senha | Sidera",
    description:
      "Defina uma nova senha segura para sua conta Sidera.",
    imageAlt: "Redefinir senha no Sidera",
  },
  ru: {
    title: "Сброс пароля | Sidera",
    description: "Установите новый безопасный пароль для вашей учетной записи Sidera.",
    imageAlt: "Сброс пароля на Sidera",
  },
  it: {
    title: "Reimposta password | Sidera",
    description:
      "Imposta una nuova password sicura per il tuo account Sidera.",
    imageAlt: "Reimposta password su Sidera",
  },
  de: {
    title: "Passwort zurücksetzen | Sidera",
    description:
      "Legen Sie ein neues, sicheres Passwort für Ihr Sidera-Konto fest.",
    imageAlt: "Passwort zurücksetzen bei Sidera",
  },
} satisfies Record<SupportedLocale, ResetPasswordSeoCopy>;

export const getResetPasswordSeoCopy = (
  locale: SupportedLocale,
): ResetPasswordSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
