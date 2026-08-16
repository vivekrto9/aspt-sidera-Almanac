import type { SupportedLocale } from "../../localization-contract.ts";

const copyByLocale = {
  en: ["Synastry Compatibility | Sidera", "Compare two birth charts to explore chemistry, friction, and the long-term shape of a connection."],
  es: ["Compatibilidad de sinastría | Sidera", "Compara dos cartas natales para explorar la química, la fricción y la forma duradera de una conexión."],
  fr: ["Compatibilité en synastrie | Sidera", "Comparez deux thèmes natals pour explorer l’alchimie, les tensions et la forme durable d’un lien."],
  pt: ["Compatibilidade de sinastria | Sidera", "Compare dois mapas natais para explorar a química, os atritos e a forma duradoura de uma conexão."],
  ru: ["Совместимость в синастрии | Sidera", "Сравните две натальные карты, чтобы изучить притяжение, напряжение и долгосрочную форму связи."],
  it: ["Compatibilità di sinastria | Sidera", "Confronta due temi natali per esplorare la chimica, gli attriti e la forma duratura di un legame."],
  de: ["Synastrie-Kompatibilität | Sidera", "Vergleichen Sie zwei Geburtshoroskope und entdecken Sie Chemie, Reibung und die langfristige Form einer Verbindung."],
} satisfies Record<SupportedLocale, readonly [string, string]>;

export const getSynastrySeoCopy = (locale: SupportedLocale) => {
  const [title, description] = copyByLocale[locale] ?? copyByLocale.en;
  return { title, description };
};
