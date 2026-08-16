import type { SupportedLocale } from "../../../localization-contract.ts";

export type MoonCalendarPersonalizedCtaCopy = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Make it personal",
    titlePrefix: "The Moon touches your chart differently. See",
    titleAccent: "your",
    titleSuffix: "lunar returns.",
    description:
      "Find the house each New and Full Moon lights up in your birth chart — and what to do with it.",
    primaryLabel: "Cast your free chart",
    secondaryLabel: "Explore today's sky",
  },
  es: {
    eyebrow: "Hazlo personal",
    titlePrefix: "La Luna toca tu carta de una forma única. Descubre",
    titleAccent: "tus",
    titleSuffix: "retornos lunares.",
    description:
      "Descubre qué casa ilumina cada Luna nueva y llena en tu carta natal, y cómo aprovecharla.",
    primaryLabel: "Crea tu carta gratis",
    secondaryLabel: "Explora el cielo de hoy",
  },
  fr: {
    eyebrow: "Rendez-le personnel",
    titlePrefix: "La Lune touche votre thème d’une manière unique. Découvrez",
    titleAccent: "vos",
    titleSuffix: "retours lunaires.",
    description:
      "Découvrez la maison que chaque Nouvelle et Pleine Lune éclaire dans votre thème natal, et comment l’accompagner.",
    primaryLabel: "Créez votre thème gratuit",
    secondaryLabel: "Explorez le ciel du jour",
  },
  pt: {
    eyebrow: "Torne-o pessoal",
    titlePrefix: "A Lua toca o seu mapa de um jeito único. Veja",
    titleAccent: "os seus",
    titleSuffix: "retornos lunares.",
    description:
      "Descubra qual casa cada Lua nova e cheia ilumina no seu mapa natal — e como trabalhar com essa energia.",
    primaryLabel: "Crie seu mapa grátis",
    secondaryLabel: "Explore o céu de hoje",
  },
  ru: {
    eyebrow: "Сделайте это личным",
    titlePrefix: "Луна по-разному касается вашей карты. Узнайте о",
    titleAccent: "своих",
    titleSuffix: "лунных возвращениях.",
    description:
      "Узнайте, какой дом вашей натальной карты освещает каждое новолуние и полнолуние — и как с этим работать.",
    primaryLabel: "Построить карту бесплатно",
    secondaryLabel: "Исследовать небо сегодня",
  },
  it: {
    eyebrow: "Rendilo personale",
    titlePrefix: "La Luna tocca il tuo tema in modo unico. Scopri",
    titleAccent: "i tuoi",
    titleSuffix: "ritorni lunari.",
    description:
      "Scopri quale casa illumina ogni Luna nuova e piena nel tuo tema natale, e come lavorare con questa energia.",
    primaryLabel: "Crea il tuo tema gratuito",
    secondaryLabel: "Esplora il cielo di oggi",
  },
  de: {
    eyebrow: "Mach es persönlich",
    titlePrefix: "Der Mond berührt dein Horoskop auf einzigartige Weise. Entdecke",
    titleAccent: "deine",
    titleSuffix: "Mondwiederkehren.",
    description:
      "Finde heraus, welches Haus jeder Neu- und Vollmond in deinem Geburtshoroskop erhellt — und wie du damit arbeiten kannst.",
    primaryLabel: "Kostenloses Horoskop erstellen",
    secondaryLabel: "Heutigen Himmel erkunden",
  },
} satisfies Record<SupportedLocale, MoonCalendarPersonalizedCtaCopy>;

export const getMoonCalendarPersonalizedCtaCopy = (
  locale: SupportedLocale,
): MoonCalendarPersonalizedCtaCopy => copyByLocale[locale] ?? copyByLocale.en;
