import type { SupportedLocale } from "../../localization-contract.ts";
import type { AuthSeoCopy } from "./seo.ts";

const copyByLocale = {
  en: {
    title: "Create an account | Sidera",
    description:
      "Create your Sidera account to save charts, readings, people, and reports.",
    imageAlt: "Create a Sidera account",
  },
  es: {
    title: "Crear una cuenta | Sidera",
    description:
      "Crea tu cuenta de Sidera para guardar cartas, lecturas, personas e informes.",
    imageAlt: "Crear una cuenta de Sidera",
  },
  fr: {
    title: "Créer un compte | Sidera",
    description:
      "Créez votre compte Sidera pour enregistrer thèmes, lectures, personnes et rapports.",
    imageAlt: "Créer un compte Sidera",
  },
  pt: {
    title: "Criar uma conta | Sidera",
    description:
      "Crie sua conta Sidera para salvar mapas, leituras, pessoas e relatórios.",
    imageAlt: "Criar uma conta Sidera",
  },
  ru: {
    title: "Создать аккаунт | Sidera",
    description:
      "Создайте аккаунт Sidera, чтобы сохранять карты, материалы, людей и отчёты.",
    imageAlt: "Создать аккаунт Sidera",
  },
  it: {
    title: "Crea un account | Sidera",
    description:
      "Crea il tuo account Sidera per salvare temi, letture, persone e rapporti.",
    imageAlt: "Creare un account Sidera",
  },
  de: {
    title: "Konto erstellen | Sidera",
    description:
      "Erstelle dein Sidera-Konto, um Horoskope, Deutungen, Menschen und Berichte zu speichern.",
    imageAlt: "Ein Sidera-Konto erstellen",
  },
} satisfies Record<SupportedLocale, AuthSeoCopy>;

export const getAuthSignupSeoCopy = (
  locale: SupportedLocale,
): AuthSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
