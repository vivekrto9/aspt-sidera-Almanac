import type { SupportedLocale } from "../../../localization-contract.ts";

export type RetrogradesFinalCtaCopy = {
  titleAccent: string;
  titleRest: string;
  actionLabel: string;
};

const copyByLocale = {
  en: {
    titleAccent: "Backward",
    titleRest: ", on purpose.",
    actionLabel: "Start with your birth chart",
  },
  es: {
    titleAccent: "Hacia atrás",
    titleRest: ", con intención.",
    actionLabel: "Empieza con tu carta natal",
  },
  fr: {
    titleAccent: "En arrière",
    titleRest: ", avec intention.",
    actionLabel: "Commencez par votre thème natal",
  },
  pt: {
    titleAccent: "Para trás",
    titleRest: ", de propósito.",
    actionLabel: "Comece pelo seu mapa natal",
  },
  ru: {
    titleAccent: "Назад",
    titleRest: " — намеренно.",
    actionLabel: "Начните со своей натальной карты",
  },
  it: {
    titleAccent: "All’indietro",
    titleRest: ", di proposito.",
    actionLabel: "Inizia dal tuo tema natale",
  },
  de: {
    titleAccent: "Rückwärts",
    titleRest: " — mit Absicht.",
    actionLabel: "Beginne mit deinem Geburtshoroskop",
  },
} satisfies Record<SupportedLocale, RetrogradesFinalCtaCopy>;

export const getRetrogradesFinalCtaCopy = (
  locale: SupportedLocale,
): RetrogradesFinalCtaCopy => copyByLocale[locale] ?? copyByLocale.en;
