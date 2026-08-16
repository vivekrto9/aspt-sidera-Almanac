import type { SupportedLocale } from "../../localization-contract.ts";

export type AuthSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "Sign in | Sidera",
    description:
      "Sign in to your Sidera account and return to your saved astrology experience.",
    imageAlt: "Sign in to Sidera",
  },
  es: {
    title: "Iniciar sesión | Sidera",
    description:
      "Inicia sesión en tu cuenta de Sidera y vuelve a tu experiencia astrológica guardada.",
    imageAlt: "Iniciar sesión en Sidera",
  },
  fr: {
    title: "Se connecter | Sidera",
    description:
      "Connectez-vous à votre compte Sidera et retrouvez votre expérience astrologique enregistrée.",
    imageAlt: "Se connecter à Sidera",
  },
  pt: {
    title: "Entrar | Sidera",
    description:
      "Entre na sua conta Sidera e retome sua experiência astrológica salva.",
    imageAlt: "Entrar na Sidera",
  },
  ru: {
    title: "Войти | Sidera",
    description:
      "Войдите в аккаунт Sidera и вернитесь к сохранённым астрологическим материалам.",
    imageAlt: "Вход в Sidera",
  },
  it: {
    title: "Accedi | Sidera",
    description:
      "Accedi al tuo account Sidera e torna alla tua esperienza astrologica salvata.",
    imageAlt: "Accedi a Sidera",
  },
  de: {
    title: "Anmelden | Sidera",
    description:
      "Melde dich bei Sidera an und kehre zu deinem gespeicherten Astrologie-Erlebnis zurück.",
    imageAlt: "Bei Sidera anmelden",
  },
} satisfies Record<SupportedLocale, AuthSeoCopy>;

export const getAuthSeoCopy = (locale: SupportedLocale): AuthSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
