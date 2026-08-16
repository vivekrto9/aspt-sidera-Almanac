import type { SupportedLocale } from "../../../localization-contract.ts";

export type TransitCastingStateCopy = {
  casting_title: string;
  casting_status: string;
  casting_summary: string;
};

const en: TransitCastingStateCopy = {
  casting_title: "Aligning the sky…",
  casting_status: "Placing the moving planets over your chart",
  casting_summary: "Preparing your selected chart and transit date",
};

const localized = {
  en,
  es: {
    casting_title: "Alineando el cielo…",
    casting_status: "Situando los planetas en movimiento sobre tu carta",
    casting_summary: "Preparando la carta y la fecha de tránsito seleccionadas",
  },
  fr: {
    casting_title: "Alignement du ciel…",
    casting_status: "Placement des planètes en mouvement sur votre thème",
    casting_summary: "Préparation du thème et de la date de transit sélectionnés",
  },
  pt: {
    casting_title: "Alinhando o céu…",
    casting_status: "Posicionando os planetas em movimento sobre seu mapa",
    casting_summary: "Preparando o mapa e a data de trânsito selecionados",
  },
  ru: {
    casting_title: "Совмещаем небо…",
    casting_status: "Накладываем движущиеся планеты на вашу карту",
    casting_summary: "Подготавливаем выбранную карту и дату транзитов",
  },
  it: {
    casting_title: "Allineamento del cielo…",
    casting_status: "Posizionamento dei pianeti in movimento sul tuo tema",
    casting_summary: "Preparazione del tema e della data di transito selezionati",
  },
  de: {
    casting_title: "Der Himmel wird ausgerichtet…",
    casting_status: "Die laufenden Planeten werden über dein Horoskop gelegt",
    casting_summary: "Dein gewähltes Horoskop und Transitdatum werden vorbereitet",
  },
} satisfies Record<SupportedLocale, TransitCastingStateCopy>;

export const getTransitCastingStateCopy = (
  locale: SupportedLocale,
): TransitCastingStateCopy => localized[locale] ?? localized.en;
