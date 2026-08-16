import type { SupportedLocale } from "../../../localization-contract.ts";

export type TransitYearAheadHandoffCopy = {
  year_ahead_eyebrow: string;
  year_ahead_title: string;
  year_ahead_description: string;
  year_ahead_primary_label: string;
  year_ahead_secondary_label: string;
};

const localized = {
  en: {
    year_ahead_eyebrow: "Go deeper",
    year_ahead_title: "Year Ahead Forecast — every major transit, timed.",
    year_ahead_description:
      "38 pages tracing the next twelve months of transits to your chart — when each one peaks, and what to do with it.",
    year_ahead_primary_label: "Get the forecast · $34",
    year_ahead_secondary_label: "Run another chart",
  },
  es: {
    year_ahead_eyebrow: "Profundiza",
    year_ahead_title:
      "Pronóstico del año — cada tránsito importante, en su momento.",
    year_ahead_description:
      "38 páginas que recorren los próximos doce meses de tránsitos a tu carta: cuándo alcanza su punto máximo cada uno y qué hacer con él.",
    year_ahead_primary_label: "Obtener el pronóstico · 34 $",
    year_ahead_secondary_label: "Calcular otra carta",
  },
  fr: {
    year_ahead_eyebrow: "Aller plus loin",
    year_ahead_title:
      "Prévisions de l’année — chaque transit majeur, au bon moment.",
    year_ahead_description:
      "38 pages pour suivre les douze prochains mois de transits sur votre thème : leur apogée et la façon de les traverser.",
    year_ahead_primary_label: "Obtenir les prévisions · 34 $",
    year_ahead_secondary_label: "Calculer un autre thème",
  },
  pt: {
    year_ahead_eyebrow: "Aprofunde-se",
    year_ahead_title:
      "Previsão do ano — cada trânsito importante, no seu momento.",
    year_ahead_description:
      "38 páginas que acompanham os próximos doze meses de trânsitos ao seu mapa — quando cada um atinge o auge e como agir.",
    year_ahead_primary_label: "Obter a previsão · $34",
    year_ahead_secondary_label: "Calcular outro mapa",
  },
  ru: {
    year_ahead_eyebrow: "Узнать больше",
    year_ahead_title:
      "Прогноз на год — каждый важный транзит в нужный момент.",
    year_ahead_description:
      "38 страниц о транзитах к вашей карте на ближайшие двенадцать месяцев — когда каждый достигает пика и как действовать.",
    year_ahead_primary_label: "Получить прогноз · $34",
    year_ahead_secondary_label: "Рассчитать другую карту",
  },
  it: {
    year_ahead_eyebrow: "Vai più a fondo",
    year_ahead_title:
      "Previsioni dell’anno — ogni transito importante, al momento giusto.",
    year_ahead_description:
      "38 pagine sui prossimi dodici mesi di transiti al tuo tema: quando ognuno raggiunge il picco e come affrontarlo.",
    year_ahead_primary_label: "Ottieni le previsioni · 34 $",
    year_ahead_secondary_label: "Calcola un altro tema",
  },
  de: {
    year_ahead_eyebrow: "Tiefer einsteigen",
    year_ahead_title:
      "Jahresprognose — jeder wichtige Transit, genau terminiert.",
    year_ahead_description:
      "38 Seiten über die kommenden zwölf Monate der Transite zu deinem Horoskop — wann jeder seinen Höhepunkt erreicht und wie du damit umgehst.",
    year_ahead_primary_label: "Prognose erhalten · 34 $",
    year_ahead_secondary_label: "Weiteres Horoskop berechnen",
  },
} satisfies Record<SupportedLocale, TransitYearAheadHandoffCopy>;

export const getTransitYearAheadHandoffCopy = (
  locale: SupportedLocale,
): TransitYearAheadHandoffCopy => localized[locale] ?? localized.en;
