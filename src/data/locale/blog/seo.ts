import type { SupportedLocale } from "../../localization-contract.ts";

type BlogSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "The Sidera Journal | Astrology, clearly explained",
    description:
      "Practical astrology articles on chart technique, transits, signs and the sky.",
    imageAlt: "The Sidera astrology journal",
  },
  es: {
    title: "El diario de Sidera | Astrología explicada con claridad",
    description:
      "Artículos prácticos sobre cartas, tránsitos, signos y el cielo.",
    imageAlt: "El diario astrológico de Sidera",
  },
  fr: {
    title: "Le journal Sidera | L’astrologie expliquée clairement",
    description:
      "Des articles pratiques sur le thème natal, les transits, les signes et le ciel.",
    imageAlt: "Le journal astrologique Sidera",
  },
  pt: {
    title: "O diário Sidera | Astrologia explicada com clareza",
    description:
      "Artigos práticos sobre mapas, trânsitos, signos e o céu.",
    imageAlt: "O diário de astrologia Sidera",
  },
  ru: {
    title: "Журнал Sidera | Астрология простыми словами",
    description:
      "Практические статьи о натальных картах, транзитах, знаках и небе.",
    imageAlt: "Астрологический журнал Sidera",
  },
  it: {
    title: "Il diario Sidera | Astrologia spiegata con chiarezza",
    description:
      "Articoli pratici su tema natale, transiti, segni e cielo.",
    imageAlt: "Il diario astrologico di Sidera",
  },
  de: {
    title: "Das Sidera Journal | Astrologie klar erklärt",
    description:
      "Praktische Artikel über Horoskoptechnik, Transite, Zeichen und den Himmel.",
    imageAlt: "Das Sidera Astrologie-Journal",
  },
} satisfies Record<SupportedLocale, BlogSeoCopy>;

export const getBlogSeoCopy = (locale: SupportedLocale): BlogSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
