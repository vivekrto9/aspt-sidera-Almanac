import type { SupportedLocale } from "../../../localization-contract.ts";

export type TodaysSkyDateScrubberCopy = {
  eyebrow: string;
  todayAction: string;
  todayMarker: string;
  movingNowLabel: string;
  navigationLabel: string;
  previousLabel: string;
  nextLabel: string;
  rangeLabel: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Viewing the sky on",
    todayAction: "Today",
    todayMarker: "Today",
    movingNowLabel: "Moving now",
    navigationLabel: "Sky date navigation",
    previousLabel: "View previous day",
    nextLabel: "View next day",
    rangeLabel: "Choose a sky date",
  },
  es: {
    eyebrow: "Viendo el cielo el",
    todayAction: "Hoy",
    todayMarker: "Hoy",
    movingNowLabel: "En movimiento",
    navigationLabel: "Navegación por fecha del cielo",
    previousLabel: "Ver el día anterior",
    nextLabel: "Ver el día siguiente",
    rangeLabel: "Elegir una fecha del cielo",
  },
  fr: {
    eyebrow: "Le ciel observé le",
    todayAction: "Aujourd’hui",
    todayMarker: "Aujourd’hui",
    movingNowLabel: "En mouvement",
    navigationLabel: "Navigation par date du ciel",
    previousLabel: "Voir le jour précédent",
    nextLabel: "Voir le jour suivant",
    rangeLabel: "Choisir une date du ciel",
  },
  pt: {
    eyebrow: "Observando o céu em",
    todayAction: "Hoje",
    todayMarker: "Hoje",
    movingNowLabel: "Em movimento",
    navigationLabel: "Navegação por data do céu",
    previousLabel: "Ver o dia anterior",
    nextLabel: "Ver o dia seguinte",
    rangeLabel: "Escolher uma data do céu",
  },
  ru: {
    eyebrow: "Небо на дату",
    todayAction: "Сегодня",
    todayMarker: "Сегодня",
    movingNowLabel: "Сейчас в движении",
    navigationLabel: "Навигация по датам неба",
    previousLabel: "Предыдущий день",
    nextLabel: "Следующий день",
    rangeLabel: "Выберите дату неба",
  },
  it: {
    eyebrow: "Il cielo osservato il",
    todayAction: "Oggi",
    todayMarker: "Oggi",
    movingNowLabel: "In movimento",
    navigationLabel: "Navigazione per data del cielo",
    previousLabel: "Visualizza il giorno precedente",
    nextLabel: "Visualizza il giorno successivo",
    rangeLabel: "Scegli una data del cielo",
  },
  de: {
    eyebrow: "Himmelsansicht für",
    todayAction: "Heute",
    todayMarker: "Heute",
    movingNowLabel: "Jetzt in Bewegung",
    navigationLabel: "Himmelsnavigation nach Datum",
    previousLabel: "Vorherigen Tag anzeigen",
    nextLabel: "Nächsten Tag anzeigen",
    rangeLabel: "Ein Himmelsdatum auswählen",
  },
} satisfies Record<SupportedLocale, TodaysSkyDateScrubberCopy>;

export const getTodaysSkyDateScrubberCopy = (
  locale: SupportedLocale,
): TodaysSkyDateScrubberCopy => copyByLocale[locale] ?? copyByLocale.en;
