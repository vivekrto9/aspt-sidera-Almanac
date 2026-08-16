import type { SupportedLocale } from "../../../localization-contract.ts";

export type MoonCalendarPageHeaderCopy = {
  eyebrow: string;
  titleAccent: string;
  titleSuffix: string;
  metaPrimary: string;
  metaSecondary: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Moon Calendar",
    titleAccent: "Follow",
    titleSuffix: " the Moon.",
    metaPrimary: "A full lunar cycle at a glance",
    metaSecondary: "Pick any day to read its phase & meaning",
  },
  es: {
    eyebrow: "Calendario lunar",
    titleAccent: "Sigue",
    titleSuffix: " la Luna.",
    metaPrimary: "Un ciclo lunar completo de un vistazo",
    metaSecondary: "Elige cualquier día para leer su fase y significado",
  },
  fr: {
    eyebrow: "Calendrier lunaire",
    titleAccent: "Suivez",
    titleSuffix: " la Lune.",
    metaPrimary: "Un cycle lunaire complet en un coup d’œil",
    metaSecondary: "Choisissez un jour pour lire sa phase et sa signification",
  },
  pt: {
    eyebrow: "Calendário lunar",
    titleAccent: "Siga",
    titleSuffix: " a Lua.",
    metaPrimary: "Um ciclo lunar completo num relance",
    metaSecondary: "Escolha um dia para ver a sua fase e significado",
  },
  ru: {
    eyebrow: "Лунный календарь",
    titleAccent: "Следуйте",
    titleSuffix: " за Луной.",
    metaPrimary: "Полный лунный цикл с первого взгляда",
    metaSecondary: "Выберите день, чтобы узнать его фазу и значение",
  },
  it: {
    eyebrow: "Calendario lunare",
    titleAccent: "Segui",
    titleSuffix: " la Luna.",
    metaPrimary: "Un intero ciclo lunare a colpo d’occhio",
    metaSecondary: "Scegli un giorno per leggerne fase e significato",
  },
  de: {
    eyebrow: "Mondkalender",
    titleAccent: "Folge",
    titleSuffix: " dem Mond.",
    metaPrimary: "Ein vollständiger Mondzyklus auf einen Blick",
    metaSecondary: "Wähle einen Tag, um Phase und Bedeutung zu lesen",
  },
} satisfies Record<SupportedLocale, MoonCalendarPageHeaderCopy>;

export const getMoonCalendarPageHeaderCopy = (
  locale: SupportedLocale,
): MoonCalendarPageHeaderCopy => copyByLocale[locale] ?? copyByLocale.en;
