import type { SupportedLocale } from "../../../localization-contract.ts";

export type TodaysSkyPageHeaderCopy = {
  eyebrow: string;
  titleAccent: string;
  titleSuffix: string;
  metaPrimary: string;
  metaSecondary: string;
  transitsAction: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Today's Sky",
    titleAccent: "The sky",
    titleSuffix: ", right now.",
    metaPrimary: "Geocentric · Tropical zodiac",
    metaSecondary: "The same sky for everyone, everywhere",
    transitsAction: "Your transits",
  },
  es: {
    eyebrow: "El cielo de hoy",
    titleAccent: "El cielo",
    titleSuffix: ", ahora mismo.",
    metaPrimary: "Geocéntrico · Zodíaco tropical",
    metaSecondary: "El mismo cielo para todos, en todas partes",
    transitsAction: "Tus tránsitos",
  },
  fr: {
    eyebrow: "Le ciel du jour",
    titleAccent: "Le ciel",
    titleSuffix: ", en ce moment.",
    metaPrimary: "Géocentrique · Zodiaque tropical",
    metaSecondary: "Le même ciel pour tous, partout",
    transitsAction: "Vos transits",
  },
  pt: {
    eyebrow: "O céu de hoje",
    titleAccent: "O céu",
    titleSuffix: ", agora.",
    metaPrimary: "Geocêntrico · Zodíaco tropical",
    metaSecondary: "O mesmo céu para todos, em todos os lugares",
    transitsAction: "Seus trânsitos",
  },
  ru: {
    eyebrow: "Небо сегодня",
    titleAccent: "Небо",
    titleSuffix: " прямо сейчас.",
    metaPrimary: "Геоцентрическая система · Тропический зодиак",
    metaSecondary: "Одно небо для всех, где бы мы ни находились",
    transitsAction: "Ваши транзиты",
  },
  it: {
    eyebrow: "Il cielo di oggi",
    titleAccent: "Il cielo",
    titleSuffix: ", proprio ora.",
    metaPrimary: "Geocentrico · Zodiaco tropicale",
    metaSecondary: "Lo stesso cielo per tutti, ovunque",
    transitsAction: "I tuoi transiti",
  },
  de: {
    eyebrow: "Der heutige Himmel",
    titleAccent: "Der Himmel",
    titleSuffix: ", genau jetzt.",
    metaPrimary: "Geozentrisch · Tropischer Tierkreis",
    metaSecondary: "Derselbe Himmel für alle, überall",
    transitsAction: "Deine Transite",
  },
} satisfies Record<SupportedLocale, TodaysSkyPageHeaderCopy>;

export const getTodaysSkyPageHeaderCopy = (
  locale: SupportedLocale,
): TodaysSkyPageHeaderCopy => copyByLocale[locale] ?? copyByLocale.en;
