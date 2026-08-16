import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeTodaySkyPosition = {
  id: string;
  planetName: string;
  planetGlyph: string;
  signName: string;
  degreeText: string;
  motionText?: string;
};

export type HomeTodaySkyCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  metadata: string;
  ctaLabel: string;
  planetNames: Record<HomeTodaySkyBodyId, string>;
  motions: {
    waxing: string;
    waning: string;
    retrograde: string;
  };
};

export type HomeTodaySkyBodyId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn";

const copyByLocale = {
  en: {
    eyebrow: "Today's Sky",
    titleAccent: "The sky",
    titleRest: ", right now.",
    metadata: "Geocentric · Tropical zodiac",
    ctaLabel: "Open today's sky",
    planets: {
      sun: "Sun",
      moon: "Moon",
      mercury: "Mercury",
      venus: "Venus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
    },
    signs: {
      cancer: "Cancer",
      libra: "Libra",
      gemini: "Gemini",
      leo: "Leo",
      pisces: "Pisces",
    },
    motions: { waxing: "Waxing", waning: "Waning", retrograde: "Rx" },
  },
  es: {
    eyebrow: "El cielo de hoy",
    titleAccent: "El cielo",
    titleRest: ", ahora mismo.",
    metadata: "Geocéntrico · Zodiaco tropical",
    ctaLabel: "Abrir el cielo de hoy",
    planets: {
      sun: "Sol",
      moon: "Luna",
      mercury: "Mercurio",
      venus: "Venus",
      mars: "Marte",
      jupiter: "Júpiter",
      saturn: "Saturno",
    },
    signs: {
      cancer: "Cáncer",
      libra: "Libra",
      gemini: "Géminis",
      leo: "Leo",
      pisces: "Piscis",
    },
    motions: { waxing: "Creciente", waning: "Menguante", retrograde: "Rx" },
  },
  fr: {
    eyebrow: "Le ciel du jour",
    titleAccent: "Le ciel",
    titleRest: ", en ce moment.",
    metadata: "Géocentrique · Zodiaque tropical",
    ctaLabel: "Ouvrir le ciel du jour",
    planets: {
      sun: "Soleil",
      moon: "Lune",
      mercury: "Mercure",
      venus: "Vénus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturne",
    },
    signs: {
      cancer: "Cancer",
      libra: "Balance",
      gemini: "Gémeaux",
      leo: "Lion",
      pisces: "Poissons",
    },
    motions: {
      waxing: "Croissante",
      waning: "Décroissante",
      retrograde: "Rétro",
    },
  },
  pt: {
    eyebrow: "O céu de hoje",
    titleAccent: "O céu",
    titleRest: ", agora.",
    metadata: "Geocêntrico · Zodíaco tropical",
    ctaLabel: "Abrir o céu de hoje",
    planets: {
      sun: "Sol",
      moon: "Lua",
      mercury: "Mercúrio",
      venus: "Vênus",
      mars: "Marte",
      jupiter: "Júpiter",
      saturn: "Saturno",
    },
    signs: {
      cancer: "Câncer",
      libra: "Libra",
      gemini: "Gêmeos",
      leo: "Leão",
      pisces: "Peixes",
    },
    motions: { waxing: "Crescente", waning: "Minguante", retrograde: "Retró." },
  },
  ru: {
    eyebrow: "Небо сегодня",
    titleAccent: "Небо",
    titleRest: " прямо сейчас.",
    metadata: "Геоцентрическая · Тропический зодиак",
    ctaLabel: "Открыть небо сегодня",
    planets: {
      sun: "Солнце",
      moon: "Луна",
      mercury: "Меркурий",
      venus: "Венера",
      mars: "Марс",
      jupiter: "Юпитер",
      saturn: "Сатурн",
    },
    signs: {
      cancer: "Рак",
      libra: "Весы",
      gemini: "Близнецы",
      leo: "Лев",
      pisces: "Рыбы",
    },
    motions: { waxing: "Растущая", waning: "Убывающая", retrograde: "Ретр." },
  },
  it: {
    eyebrow: "Il cielo di oggi",
    titleAccent: "Il cielo",
    titleRest: ", proprio ora.",
    metadata: "Geocentrico · Zodiaco tropicale",
    ctaLabel: "Apri il cielo di oggi",
    planets: {
      sun: "Sole",
      moon: "Luna",
      mercury: "Mercurio",
      venus: "Venere",
      mars: "Marte",
      jupiter: "Giove",
      saturn: "Saturno",
    },
    signs: {
      cancer: "Cancro",
      libra: "Bilancia",
      gemini: "Gemelli",
      leo: "Leone",
      pisces: "Pesci",
    },
    motions: { waxing: "Crescente", waning: "Calante", retrograde: "Retro" },
  },
  de: {
    eyebrow: "Der heutige Himmel",
    titleAccent: "Der Himmel",
    titleRest: ", genau jetzt.",
    metadata: "Geozentrisch · Tropischer Tierkreis",
    ctaLabel: "Heutigen Himmel öffnen",
    planets: {
      sun: "Sonne",
      moon: "Mond",
      mercury: "Merkur",
      venus: "Venus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
    },
    signs: {
      cancer: "Krebs",
      libra: "Waage",
      gemini: "Zwillinge",
      leo: "Löwe",
      pisces: "Fische",
    },
    motions: { waxing: "Zunehmend", waning: "Abnehmend", retrograde: "Rückl." },
  },
} satisfies Record<
  SupportedLocale,
  Omit<HomeTodaySkyCopy, "planetNames"> & {
    planets: Record<HomeTodaySkyBodyId, string>;
    signs: Record<string, string>;
  }
>;

export const getHomeTodaySkyCopy = (
  locale: SupportedLocale,
): HomeTodaySkyCopy => {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return {
    eyebrow: copy.eyebrow,
    titleAccent: copy.titleAccent,
    titleRest: copy.titleRest,
    metadata: copy.metadata,
    ctaLabel: copy.ctaLabel,
    planetNames: copy.planets,
    motions: copy.motions,
  };
};
