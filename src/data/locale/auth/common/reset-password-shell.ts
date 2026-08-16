import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthResetPasswordShellCopy = {
  kicker: string;
  title: string;
  description: string;
  formLabel: string;
};

const copyByLocale = {
  en: {
    kicker: "Reset password",
    title: "Choose a new password for your sky.",
    description:
      "Create a secure password to continue and unlock access to your Sidera account.",
    formLabel: "Set a new password",
  },
  es: {
    kicker: "Restablecer contraseña",
    title: "Elige una nueva contraseña para tu cuenta.",
    description:
      "Crea una contraseña segura para continuar y volver a acceder a tu cuenta de Sidera.",
    formLabel: "Crear nueva contraseña",
  },
  fr: {
    kicker: "Réinitialiser le mot de passe",
    title: "Choisissez un nouveau mot de passe pour votre compte.",
    description:
      "Créez un mot de passe sécurisé pour poursuivre et retrouver l’accès à votre compte Sidera.",
    formLabel: "Créer un nouveau mot de passe",
  },
  pt: {
    kicker: "Redefinir senha",
    title: "Escolha uma nova senha para sua conta.",
    description:
      "Crie uma senha segura para continuar e recuperar o acesso à sua conta Sidera.",
    formLabel: "Definir nova senha",
  },
  ru: {
    kicker: "Сбросить пароль",
    title: "Выберите новый пароль для вашего аккаунта.",
    description:
      "Создайте надежный пароль, чтобы продолжить и восстановить доступ к вашей учетной записи Sidera.",
    formLabel: "Установить новый пароль",
  },
  it: {
    kicker: "Reimposta password",
    title: "Scegli una nuova password per il tuo account.",
    description:
      "Crea una password sicura per continuare e tornare a accedere al tuo account Sidera.",
    formLabel: "Imposta nuova password",
  },
  de: {
    kicker: "Passwort zurücksetzen",
    title: "Wähle ein neues Passwort für deinen Account.",
    description:
      "Lege ein sicheres Passwort fest, um fortzufahren und wieder auf dein Sidera-Konto zuzugreifen.",
    formLabel: "Neues Passwort festlegen",
  },
} satisfies Record<SupportedLocale, AuthResetPasswordShellCopy>;

export const getResetPasswordShellCopy = (
  locale: SupportedLocale,
): AuthResetPasswordShellCopy => copyByLocale[locale] ?? copyByLocale.en;
