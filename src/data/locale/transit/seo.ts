import type { SupportedLocale } from "../../localization-contract.ts";

const titles: Record<SupportedLocale, string> = {
  en: "Transit Chart | Sidera", es: "Carta de tránsitos | Sidera",
  fr: "Thème de transits | Sidera", pt: "Mapa de trânsitos | Sidera",
  ru: "Транзитная карта | Sidera", it: "Carta dei transiti | Sidera",
  de: "Transitkarte | Sidera",
};

const descriptions: Record<SupportedLocale, string> = {
  en: "Compare the moving planets with your natal chart for any date.",
  es: "Compara los planetas en movimiento con tu carta natal para cualquier fecha.",
  fr: "Comparez les planètes en mouvement à votre thème natal pour la date de votre choix.",
  pt: "Compare os planetas em movimento com seu mapa natal em qualquer data.",
  ru: "Сравните движущиеся планеты с натальной картой на любую дату.",
  it: "Confronta i pianeti in movimento con il tuo tema natale per qualsiasi data.",
  de: "Vergleiche die laufenden Planeten an jedem Datum mit deinem Geburtshoroskop.",
};

export const getTransitSeoCopy = (locale: SupportedLocale) => ({
  seoTitle: titles[locale],
  seoDescription: descriptions[locale],
  ogTitle: titles[locale],
  ogDescription: descriptions[locale],
  ogImageAlt: `${titles[locale]} chart`,
  twitterTitle: titles[locale],
  twitterDescription: descriptions[locale],
});
