import type { SupportedLocale } from "../../../localization-contract.ts";

export type SynastryOverlayingStateCopy = {
  overlaying_title: string;
  overlaying_status: string;
};

const en: SynastryOverlayingStateCopy = {
  overlaying_title: "Overlaying two charts…",
  overlaying_status: "Measuring the aspects between you",
};

const copyByLocale = {
  en,
  es: {
    overlaying_title: "Superponiendo las dos cartas…",
    overlaying_status: "Midiendo los aspectos entre ustedes",
  },
  fr: {
    overlaying_title: "Superposition des deux thèmes…",
    overlaying_status: "Mesure des aspects entre vous",
  },
  pt: {
    overlaying_title: "Sobrepondo os dois mapas…",
    overlaying_status: "Medindo os aspectos entre vocês",
  },
  ru: {
    overlaying_title: "Накладываем две карты…",
    overlaying_status: "Измеряем аспекты между вами",
  },
  it: {
    overlaying_title: "Sovrapposizione dei due temi…",
    overlaying_status: "Misurazione degli aspetti tra voi",
  },
  de: {
    overlaying_title: "Die beiden Horoskope werden überlagert…",
    overlaying_status: "Die Aspekte zwischen Ihnen werden gemessen",
  },
} satisfies Record<SupportedLocale, SynastryOverlayingStateCopy>;

export const getSynastryOverlayingStateCopy = (
  locale: SupportedLocale,
): SynastryOverlayingStateCopy => copyByLocale[locale] ?? copyByLocale.en;
