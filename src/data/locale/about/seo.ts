import type { SupportedLocale } from "../../localization-contract.ts";

export type AboutSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "About Sidera | Precise, Readable Astrology",
    description:
      "Learn why Sidera pairs astronomical precision with clear, intelligent astrology writing.",
    imageAlt: "About Sidera and its approach to readable astrology",
  },
  es: {
    title: "Sobre Sidera | Astrología precisa y comprensible",
    description:
      "Descubre por qué Sidera combina precisión astronómica con una escritura astrológica clara e inteligente.",
    imageAlt: "Sobre Sidera y su enfoque de la astrología comprensible",
  },
  fr: {
    title: "À propos de Sidera | Une astrologie précise et lisible",
    description:
      "Découvrez pourquoi Sidera associe précision astronomique et écriture astrologique claire et intelligente.",
    imageAlt: "À propos de Sidera et de son approche lisible de l’astrologie",
  },
  pt: {
    title: "Sobre a Sidera | Astrologia precisa e clara",
    description:
      "Conheça a proposta da Sidera de unir precisão astronômica a uma escrita astrológica clara e inteligente.",
    imageAlt: "Sobre a Sidera e sua abordagem clara da astrologia",
  },
  ru: {
    title: "О Sidera | Точная и понятная астрология",
    description:
      "Узнайте, почему Sidera объединяет астрономическую точность с ясным и вдумчивым языком астрологии.",
    imageAlt: "О Sidera и её подходе к понятной астрологии",
  },
  it: {
    title: "Chi è Sidera | Astrologia precisa e comprensibile",
    description:
      "Scopri perché Sidera unisce precisione astronomica e una scrittura astrologica chiara e intelligente.",
    imageAlt: "Sidera e il suo approccio comprensibile all’astrologia",
  },
  de: {
    title: "Über Sidera | Präzise, verständliche Astrologie",
    description:
      "Erfahren Sie, warum Sidera astronomische Präzision mit klarer und intelligenter astrologischer Sprache verbindet.",
    imageAlt: "Über Sidera und den verständlichen Ansatz zur Astrologie",
  },
} satisfies Record<SupportedLocale, AboutSeoCopy>;

export const getAboutSeoCopy = (locale: SupportedLocale): AboutSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
