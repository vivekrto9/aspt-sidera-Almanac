import type { SupportedLocale } from "../../localization-contract.ts";

export type GlossarySeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "Astrology Glossary | Sidera",
    description:
      "Clear definitions for the astrology terms Sidera uses, from Ascendant to Zodiac.",
    imageAlt: "Sidera astrology glossary",
  },
  es: {
    title: "Glosario de astrología | Sidera",
    description:
      "Definiciones claras de los términos astrológicos que utiliza Sidera, del Ascendente al Zodiaco.",
    imageAlt: "Glosario de astrología de Sidera",
  },
  fr: {
    title: "Glossaire de l’astrologie | Sidera",
    description:
      "Des définitions claires des termes astrologiques utilisés par Sidera, de l’Ascendant au Zodiaque.",
    imageAlt: "Glossaire de l’astrologie Sidera",
  },
  pt: {
    title: "Glossário de astrologia | Sidera",
    description:
      "Definições claras dos termos astrológicos usados pela Sidera, do Ascendente ao Zodíaco.",
    imageAlt: "Glossário de astrologia da Sidera",
  },
  ru: {
    title: "Астрологический глоссарий | Sidera",
    description:
      "Понятные определения астрологических терминов Sidera — от Асцендента до Зодиака.",
    imageAlt: "Астрологический глоссарий Sidera",
  },
  it: {
    title: "Glossario dell’astrologia | Sidera",
    description:
      "Definizioni chiare dei termini astrologici usati da Sidera, dall’Ascendente allo Zodiaco.",
    imageAlt: "Glossario dell’astrologia di Sidera",
  },
  de: {
    title: "Astrologie-Glossar | Sidera",
    description:
      "Klare Definitionen der astrologischen Begriffe von Sidera, vom Aszendenten bis zum Tierkreis.",
    imageAlt: "Astrologie-Glossar von Sidera",
  },
} satisfies Record<SupportedLocale, GlossarySeoCopy>;

export const getGlossarySeoCopy = (
  locale: SupportedLocale,
): GlossarySeoCopy => copyByLocale[locale] ?? copyByLocale.en;
