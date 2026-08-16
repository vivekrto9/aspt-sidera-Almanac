import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeFinalCtaCopy = {
  titleAccent: string;
  titleRest: string;
  actionLabel: string;
};

const copies: Record<SupportedLocale, HomeFinalCtaCopy> = {
  en: {
    titleAccent: "Read",
    titleRest: "Your Sky",
    actionLabel: "Create your free chart",
  },
  es: {
    titleAccent: "Lee",
    titleRest: "tu cielo",
    actionLabel: "Crea tu carta gratis",
  },
  fr: {
    titleAccent: "Lisez",
    titleRest: "votre ciel",
    actionLabel: "Créez votre thème gratuitement",
  },
  pt: {
    titleAccent: "Leia",
    titleRest: "seu céu",
    actionLabel: "Crie seu mapa grátis",
  },
  ru: {
    titleAccent: "Читайте",
    titleRest: "своё небо",
    actionLabel: "Создать бесплатную карту",
  },
  it: {
    titleAccent: "Leggi",
    titleRest: "il tuo cielo",
    actionLabel: "Crea la tua carta gratuita",
  },
  de: {
    titleAccent: "Lies",
    titleRest: "deinen Himmel",
    actionLabel: "Erstelle dein kostenloses Geburtshoroskop",
  },
};

export const getHomeFinalCtaCopy = (
  locale: SupportedLocale,
): HomeFinalCtaCopy => copies[locale];
