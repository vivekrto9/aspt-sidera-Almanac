import type { SupportedLocale } from "../../../localization-contract.ts";
import type { MoonCalendarPhase } from "../../../moon-calendar/calendar-model.ts";

export type MoonCalendarLunarCycleStripCopy = {
  title: string;
  description: string;
  phases: Array<{
    phase: MoonCalendarPhase;
    name: string;
  }>;
};

const phaseOrder: MoonCalendarPhase[] = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent",
];

const copyByLocale = {
  en: {
    title: "The eight phases",
    description: "One full cycle runs about 29.5 days — New to New",
    phaseNames: [
      "New Moon",
      "Waxing Crescent",
      "First Quarter",
      "Waxing Gibbous",
      "Full Moon",
      "Waning Gibbous",
      "Last Quarter",
      "Waning Crescent",
    ],
  },
  es: {
    title: "Las ocho fases",
    description: "Un ciclo completo dura unos 29,5 días, de Luna nueva a Luna nueva",
    phaseNames: [
      "Luna nueva",
      "Creciente",
      "Cuarto creciente",
      "Gibosa creciente",
      "Luna llena",
      "Gibosa menguante",
      "Cuarto menguante",
      "Menguante",
    ],
  },
  fr: {
    title: "Les huit phases",
    description: "Un cycle complet dure environ 29,5 jours, de Nouvelle Lune à Nouvelle Lune",
    phaseNames: [
      "Nouvelle Lune",
      "Premier croissant",
      "Premier quartier",
      "Gibbeuse croissante",
      "Pleine Lune",
      "Gibbeuse décroissante",
      "Dernier quartier",
      "Dernier croissant",
    ],
  },
  pt: {
    title: "As oito fases",
    description: "Um ciclo completo dura cerca de 29,5 dias, de Lua nova a Lua nova",
    phaseNames: [
      "Lua nova",
      "Crescente",
      "Quarto crescente",
      "Gibosa crescente",
      "Lua cheia",
      "Gibosa minguante",
      "Quarto minguante",
      "Minguante",
    ],
  },
  ru: {
    title: "Восемь фаз",
    description: "Полный цикл длится около 29,5 дня — от новолуния до новолуния",
    phaseNames: [
      "Новолуние",
      "Растущий серп",
      "Первая четверть",
      "Растущая выпуклая",
      "Полнолуние",
      "Убывающая выпуклая",
      "Последняя четверть",
      "Убывающий серп",
    ],
  },
  it: {
    title: "Le otto fasi",
    description: "Un ciclo completo dura circa 29,5 giorni, da Luna nuova a Luna nuova",
    phaseNames: [
      "Luna nuova",
      "Falce crescente",
      "Primo quarto",
      "Gibbosa crescente",
      "Luna piena",
      "Gibbosa calante",
      "Ultimo quarto",
      "Falce calante",
    ],
  },
  de: {
    title: "Die acht Phasen",
    description: "Ein vollständiger Zyklus dauert etwa 29,5 Tage — von Neumond zu Neumond",
    phaseNames: [
      "Neumond",
      "Zunehmende Sichel",
      "Erstes Viertel",
      "Zunehmender Dreiviertelmond",
      "Vollmond",
      "Abnehmender Dreiviertelmond",
      "Letztes Viertel",
      "Abnehmende Sichel",
    ],
  },
} satisfies Record<
  SupportedLocale,
  {
    title: string;
    description: string;
    phaseNames: string[];
  }
>;

export const getMoonCalendarLunarCycleStripCopy = (
  locale: SupportedLocale,
): MoonCalendarLunarCycleStripCopy => {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return {
    title: copy.title,
    description: copy.description,
    phases: phaseOrder.map((phase, index) => ({
      phase,
      name: copy.phaseNames[index],
    })),
  };
};
