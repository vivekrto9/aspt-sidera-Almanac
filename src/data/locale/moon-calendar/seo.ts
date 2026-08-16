import type { SupportedLocale } from "../../localization-contract.ts";

export type MoonCalendarSeoCopy = {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

const copyByLocale = {
  en: {
    seoTitle: "Moon Phase Calendar | Sidera",
    seoDescription:
      "Follow the lunar cycle day by day and explore each Moon phase, sign, and meaning.",
    ogTitle: "Moon Phase Calendar | Sidera",
    ogDescription: "See a complete lunar cycle and read the meaning of any day.",
    ogImageAlt: "Sidera Moon phase calendar",
    twitterTitle: "Moon Phase Calendar | Sidera",
    twitterDescription:
      "See a complete lunar cycle and read the meaning of any day.",
  },
  es: {
    seoTitle: "Calendario de fases lunares | Sidera",
    seoDescription:
      "Sigue el ciclo lunar día a día y explora cada fase, signo y significado de la Luna.",
    ogTitle: "Calendario de fases lunares | Sidera",
    ogDescription:
      "Consulta un ciclo lunar completo y descubre el significado de cualquier día.",
    ogImageAlt: "Calendario de fases lunares de Sidera",
    twitterTitle: "Calendario de fases lunares | Sidera",
    twitterDescription:
      "Consulta un ciclo lunar completo y descubre el significado de cualquier día.",
  },
  fr: {
    seoTitle: "Calendrier des phases lunaires | Sidera",
    seoDescription:
      "Suivez le cycle lunaire jour après jour et découvrez chaque phase, signe et signification de la Lune.",
    ogTitle: "Calendrier des phases lunaires | Sidera",
    ogDescription:
      "Consultez un cycle lunaire complet et la signification de chaque jour.",
    ogImageAlt: "Calendrier des phases lunaires Sidera",
    twitterTitle: "Calendrier des phases lunaires | Sidera",
    twitterDescription:
      "Consultez un cycle lunaire complet et la signification de chaque jour.",
  },
  pt: {
    seoTitle: "Calendário das fases da Lua | Sidera",
    seoDescription:
      "Acompanhe o ciclo lunar dia a dia e explore cada fase, signo e significado da Lua.",
    ogTitle: "Calendário das fases da Lua | Sidera",
    ogDescription:
      "Veja um ciclo lunar completo e leia o significado de qualquer dia.",
    ogImageAlt: "Calendário das fases da Lua da Sidera",
    twitterTitle: "Calendário das fases da Lua | Sidera",
    twitterDescription:
      "Veja um ciclo lunar completo e leia o significado de qualquer dia.",
  },
  ru: {
    seoTitle: "Календарь фаз Луны | Sidera",
    seoDescription:
      "Следите за лунным циклом день за днём и изучайте фазы, знаки и значения Луны.",
    ogTitle: "Календарь фаз Луны | Sidera",
    ogDescription:
      "Посмотрите полный лунный цикл и узнайте значение любого дня.",
    ogImageAlt: "Календарь фаз Луны Sidera",
    twitterTitle: "Календарь фаз Луны | Sidera",
    twitterDescription:
      "Посмотрите полный лунный цикл и узнайте значение любого дня.",
  },
  it: {
    seoTitle: "Calendario delle fasi lunari | Sidera",
    seoDescription:
      "Segui il ciclo lunare giorno per giorno e scopri ogni fase, segno e significato della Luna.",
    ogTitle: "Calendario delle fasi lunari | Sidera",
    ogDescription:
      "Guarda un intero ciclo lunare e leggi il significato di ogni giorno.",
    ogImageAlt: "Calendario delle fasi lunari Sidera",
    twitterTitle: "Calendario delle fasi lunari | Sidera",
    twitterDescription:
      "Guarda un intero ciclo lunare e leggi il significato di ogni giorno.",
  },
  de: {
    seoTitle: "Mondphasen-Kalender | Sidera",
    seoDescription:
      "Verfolge den Mondzyklus Tag für Tag und entdecke jede Phase, jedes Zeichen und ihre Bedeutung.",
    ogTitle: "Mondphasen-Kalender | Sidera",
    ogDescription:
      "Sieh den vollständigen Mondzyklus und lies die Bedeutung jedes Tages.",
    ogImageAlt: "Sidera Mondphasen-Kalender",
    twitterTitle: "Mondphasen-Kalender | Sidera",
    twitterDescription:
      "Sieh den vollständigen Mondzyklus und lies die Bedeutung jedes Tages.",
  },
} satisfies Record<SupportedLocale, MoonCalendarSeoCopy>;

export const getMoonCalendarSeoCopy = (
  locale: SupportedLocale,
): MoonCalendarSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
