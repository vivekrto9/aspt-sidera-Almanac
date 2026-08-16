import type { SupportedLocale } from "../../localization-contract.ts";

export type TodaysSkySeoCopy = {
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
    seoTitle: "Today's Sky | Current planets and transits | Sidera",
    seoDescription:
      "See the current geocentric sky, tropical zodiac positions, Moon phase, and active planetary aspects.",
    ogTitle: "Today's Sky | Sidera",
    ogDescription:
      "Follow the current planets, Moon, and active aspects in the tropical zodiac.",
    ogImageAlt: "Today's geocentric astrology chart on Sidera",
    twitterTitle: "Today's Sky | Sidera",
    twitterDescription:
      "Follow the current planets, Moon, and active aspects in the tropical zodiac.",
  },
  es: {
    seoTitle: "El cielo de hoy | Planetas y tránsitos actuales | Sidera",
    seoDescription:
      "Consulta el cielo geocéntrico actual, las posiciones del zodíaco tropical, la fase lunar y los aspectos planetarios activos.",
    ogTitle: "El cielo de hoy | Sidera",
    ogDescription:
      "Sigue los planetas, la Luna y los aspectos activos del zodíaco tropical.",
    ogImageAlt: "Carta astrológica geocéntrica de hoy en Sidera",
    twitterTitle: "El cielo de hoy | Sidera",
    twitterDescription:
      "Sigue los planetas, la Luna y los aspectos activos del zodíaco tropical.",
  },
  fr: {
    seoTitle: "Le ciel du jour | Planètes et transits actuels | Sidera",
    seoDescription:
      "Consultez le ciel géocentrique actuel, les positions du zodiaque tropical, la phase lunaire et les aspects planétaires actifs.",
    ogTitle: "Le ciel du jour | Sidera",
    ogDescription:
      "Suivez les planètes, la Lune et les aspects actifs du zodiaque tropical.",
    ogImageAlt: "Carte astrologique géocentrique du jour sur Sidera",
    twitterTitle: "Le ciel du jour | Sidera",
    twitterDescription:
      "Suivez les planètes, la Lune et les aspects actifs du zodiaque tropical.",
  },
  pt: {
    seoTitle: "O céu de hoje | Planetas e trânsitos atuais | Sidera",
    seoDescription:
      "Veja o céu geocêntrico atual, as posições do zodíaco tropical, a fase lunar e os aspectos planetários ativos.",
    ogTitle: "O céu de hoje | Sidera",
    ogDescription:
      "Acompanhe os planetas, a Lua e os aspectos ativos no zodíaco tropical.",
    ogImageAlt: "Mapa astrológico geocêntrico de hoje na Sidera",
    twitterTitle: "O céu de hoje | Sidera",
    twitterDescription:
      "Acompanhe os planetas, a Lua e os aspectos ativos no zodíaco tropical.",
  },
  ru: {
    seoTitle: "Небо сегодня | Планеты и текущие транзиты | Sidera",
    seoDescription:
      "Посмотрите текущее геоцентрическое небо, положения в тропическом зодиаке, фазу Луны и активные аспекты планет.",
    ogTitle: "Небо сегодня | Sidera",
    ogDescription:
      "Следите за планетами, Луной и активными аспектами в тропическом зодиаке.",
    ogImageAlt: "Сегодняшняя геоцентрическая астрологическая карта Sidera",
    twitterTitle: "Небо сегодня | Sidera",
    twitterDescription:
      "Следите за планетами, Луной и активными аспектами в тропическом зодиаке.",
  },
  it: {
    seoTitle: "Il cielo di oggi | Pianeti e transiti attuali | Sidera",
    seoDescription:
      "Osserva il cielo geocentrico attuale, le posizioni nello zodiaco tropicale, la fase lunare e gli aspetti planetari attivi.",
    ogTitle: "Il cielo di oggi | Sidera",
    ogDescription:
      "Segui i pianeti, la Luna e gli aspetti attivi nello zodiaco tropicale.",
    ogImageAlt: "Carta astrologica geocentrica di oggi su Sidera",
    twitterTitle: "Il cielo di oggi | Sidera",
    twitterDescription:
      "Segui i pianeti, la Luna e gli aspetti attivi nello zodiaco tropicale.",
  },
  de: {
    seoTitle: "Der heutige Himmel | Aktuelle Planeten und Transite | Sidera",
    seoDescription:
      "Sieh den aktuellen geozentrischen Himmel, Positionen im tropischen Tierkreis, die Mondphase und aktive Planetenaspekte.",
    ogTitle: "Der heutige Himmel | Sidera",
    ogDescription:
      "Verfolge Planeten, Mond und aktive Aspekte im tropischen Tierkreis.",
    ogImageAlt: "Heutige geozentrische Astrologiekarte auf Sidera",
    twitterTitle: "Der heutige Himmel | Sidera",
    twitterDescription:
      "Verfolge Planeten, Mond und aktive Aspekte im tropischen Tierkreis.",
  },
} satisfies Record<SupportedLocale, TodaysSkySeoCopy>;

export const getTodaysSkySeoCopy = (
  locale: SupportedLocale,
): TodaysSkySeoCopy => copyByLocale[locale] ?? copyByLocale.en;
