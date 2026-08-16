import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeSynastryCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  personAName: string;
  personADetail: string;
  personBName: string;
  personBDetail: string;
  resonance: string;
};

const copyByLocale: Record<SupportedLocale, HomeSynastryCopy> = {
  en: {
    eyebrow: "Compatibility · Synastry",
    titleAccent: "Two",
    titleRest: "charts, one story.",
    description:
      "Overlay two birth charts to see how they actually interact — the easy contacts, the friction that keeps things alive, and the long-term shape of the connection.",
    primaryCta: "Create a synastry chart",
    secondaryCta: "How compatibility works",
    personAName: "Person A",
    personADetail: "Leo · Scorpio rising",
    personBName: "Person B",
    personBDetail: "Aquarius · Taurus rising",
    resonance: "84% resonance",
  },
  es: {
    eyebrow: "Compatibilidad · Sinastría",
    titleAccent: "Dos",
    titleRest: "cartas, una historia.",
    description:
      "Superpone dos cartas natales para ver cómo interactúan: los contactos fáciles, la fricción que mantiene viva la relación y su forma a largo plazo.",
    primaryCta: "Crear carta de sinastría",
    secondaryCta: "Cómo funciona la compatibilidad",
    personAName: "Persona A",
    personADetail: "Leo · Ascendente Escorpio",
    personBName: "Persona B",
    personBDetail: "Acuario · Ascendente Tauro",
    resonance: "84% de resonancia",
  },
  fr: {
    eyebrow: "Compatibilité · Synastrie",
    titleAccent: "Deux",
    titleRest: "thèmes, une histoire.",
    description:
      "Superposez deux thèmes natals pour voir leurs interactions : les liens faciles, les tensions vivantes et la forme durable de la relation.",
    primaryCta: "Créer un thème de synastrie",
    secondaryCta: "Comprendre la compatibilité",
    personAName: "Personne A",
    personADetail: "Lion · Ascendant Scorpion",
    personBName: "Personne B",
    personBDetail: "Verseau · Ascendant Taureau",
    resonance: "84 % de résonance",
  },
  pt: {
    eyebrow: "Compatibilidade · Sinastria",
    titleAccent: "Dois",
    titleRest: "mapas, uma história.",
    description:
      "Sobreponha dois mapas natais para ver como interagem: os contatos fáceis, a tensão que mantém tudo vivo e a forma duradoura da conexão.",
    primaryCta: "Criar mapa de sinastria",
    secondaryCta: "Como funciona a compatibilidade",
    personAName: "Pessoa A",
    personADetail: "Leão · Ascendente Escorpião",
    personBName: "Pessoa B",
    personBDetail: "Aquário · Ascendente Touro",
    resonance: "84% de ressonância",
  },
  ru: {
    eyebrow: "Совместимость · Синастрия",
    titleAccent: "Две",
    titleRest: "карты, одна история.",
    description:
      "Наложите две натальные карты, чтобы увидеть лёгкие связи, живое напряжение и долгосрочную форму отношений.",
    primaryCta: "Создать карту синастрии",
    secondaryCta: "Как работает совместимость",
    personAName: "Человек A",
    personADetail: "Лев · Асцендент в Скорпионе",
    personBName: "Человек B",
    personBDetail: "Водолей · Асцендент в Тельце",
    resonance: "84% резонанса",
  },
  it: {
    eyebrow: "Compatibilità · Sinastria",
    titleAccent: "Due",
    titleRest: "carte, una storia.",
    description:
      "Sovrapponi due carte natali per vedere come interagiscono: i contatti facili, l'attrito che mantiene vivo il rapporto e la sua forma nel tempo.",
    primaryCta: "Crea carta di sinastria",
    secondaryCta: "Come funziona la compatibilità",
    personAName: "Persona A",
    personADetail: "Leone · Ascendente Scorpione",
    personBName: "Persona B",
    personBDetail: "Acquario · Ascendente Toro",
    resonance: "84% di risonanza",
  },
  de: {
    eyebrow: "Kompatibilität · Synastrie",
    titleAccent: "Zwei",
    titleRest: "Horoskope, eine Geschichte.",
    description:
      "Lege zwei Geburtshoroskope übereinander und erkenne leichte Verbindungen, belebende Reibung und die langfristige Form der Beziehung.",
    primaryCta: "Synastrie erstellen",
    secondaryCta: "So funktioniert Kompatibilität",
    personAName: "Person A",
    personADetail: "Löwe · Aszendent Skorpion",
    personBName: "Person B",
    personBDetail: "Wassermann · Aszendent Stier",
    resonance: "84% Resonanz",
  },
};

export const getHomeSynastryCopy = (
  locale: SupportedLocale,
): HomeSynastryCopy => copyByLocale[locale] ?? copyByLocale.en;
