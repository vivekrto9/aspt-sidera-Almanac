import type { SupportedLocale } from "../../../localization-contract.ts";

export type GlossaryPageIntroCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  description: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Reference",
    titleLead: "The astrology",
    titleEmphasis: "glossary.",
    description:
      "Every term Sidera uses, defined in plain language. From Ascendant to Zodiac.",
  },
  es: {
    eyebrow: "Referencia",
    titleLead: "El glosario de",
    titleEmphasis: "astrología.",
    description:
      "Cada término que utiliza Sidera, explicado con claridad. Del Ascendente al Zodiaco.",
  },
  fr: {
    eyebrow: "Référence",
    titleLead: "Le glossaire de",
    titleEmphasis: "l’astrologie.",
    description:
      "Chaque terme utilisé par Sidera, défini simplement. De l’Ascendant au Zodiaque.",
  },
  pt: {
    eyebrow: "Referência",
    titleLead: "O glossário de",
    titleEmphasis: "astrologia.",
    description:
      "Cada termo usado pela Sidera, explicado de forma simples. Do Ascendente ao Zodíaco.",
  },
  ru: {
    eyebrow: "Справочник",
    titleLead: "Астрологический",
    titleEmphasis: "глоссарий.",
    description:
      "Все термины Sidera простыми словами — от Асцендента до Зодиака.",
  },
  it: {
    eyebrow: "Riferimenti",
    titleLead: "Il glossario",
    titleEmphasis: "dell’astrologia.",
    description:
      "Ogni termine usato da Sidera, spiegato con parole semplici. Dall’Ascendente allo Zodiaco.",
  },
  de: {
    eyebrow: "Nachschlagewerk",
    titleLead: "Das Astrologie-",
    titleEmphasis: "Glossar.",
    description:
      "Jeder Begriff, den Sidera verwendet, einfach erklärt. Vom Aszendenten bis zum Tierkreis.",
  },
} satisfies Record<SupportedLocale, GlossaryPageIntroCopy>;

export const getGlossaryPageIntroCopy = (
  locale: SupportedLocale,
): GlossaryPageIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
