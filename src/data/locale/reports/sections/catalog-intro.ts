import type { SupportedLocale } from "../../../localization-contract.ts";

export type ReportsCatalogIntroCopy = {
  eyebrow: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Reports",
    titleAccent: "In-depth",
    titleSuffix: "written reports.",
    description:
      "Hand-structured interpretations of your chart, delivered as a beautifully typeset PDF. Written by astrologers, generated from your exact data.",
  },
  es: {
    eyebrow: "Informes",
    titleAccent: "Informes",
    titleSuffix: "escritos en profundidad.",
    description:
      "Interpretaciones de tu carta estructuradas a mano y entregadas en un PDF cuidadosamente diseñado. Escritas por astrólogos a partir de tus datos exactos.",
  },
  fr: {
    eyebrow: "Rapports",
    titleAccent: "Des rapports",
    titleSuffix: "écrits approfondis.",
    description:
      "Des interprétations de votre thème structurées à la main, livrées dans un PDF soigneusement composé. Rédigées par des astrologues à partir de vos données exactes.",
  },
  pt: {
    eyebrow: "Relatórios",
    titleAccent: "Relatórios",
    titleSuffix: "escritos em profundidade.",
    description:
      "Interpretações do seu mapa estruturadas à mão e entregues em um PDF cuidadosamente diagramado. Escritas por astrólogos a partir dos seus dados exatos.",
  },
  ru: {
    eyebrow: "Отчёты",
    titleAccent: "Подробные",
    titleSuffix: "письменные отчёты.",
    description:
      "Тщательно структурированные трактовки вашей карты в красиво оформленном PDF. Их пишут астрологи на основе ваших точных данных.",
  },
  it: {
    eyebrow: "Report",
    titleAccent: "Report",
    titleSuffix: "scritti e approfonditi.",
    description:
      "Interpretazioni della tua carta strutturate a mano e consegnate in un PDF curato nei dettagli. Scritte da astrologi a partire dai tuoi dati esatti.",
  },
  de: {
    eyebrow: "Berichte",
    titleAccent: "Ausführliche",
    titleSuffix: "schriftliche Berichte.",
    description:
      "Sorgfältig strukturierte Deutungen deines Horoskops als hochwertig gesetztes PDF. Von Astrolog:innen geschrieben und aus deinen exakten Daten erstellt.",
  },
} satisfies Record<SupportedLocale, ReportsCatalogIntroCopy>;

export const getReportsCatalogIntroCopy = (
  locale: SupportedLocale,
): ReportsCatalogIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
