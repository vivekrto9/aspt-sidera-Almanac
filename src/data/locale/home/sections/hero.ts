import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeHeroCopy = {
  kicker: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  proofCharts: string;
  proofEphemeris: string;
  proofBeginner: string;
  chartTitle: string;
  chartDescription: string;
};

const copyByLocale = {
  en: {
    kicker: "Astrology, done properly",
    title: "Read the sky like a story.",
    body:
      "Cast your birth chart from any time and place, track today's transits, and follow the Moon — all built on the Swiss Ephemeris, accurate to the arcminute.",
    primaryCta: "Create your free chart",
    secondaryCta: "Explore today's sky",
    proofCharts: "1.2M charts cast",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Beginner-friendly",
    chartTitle: "Decorative zodiac chart wheel",
    chartDescription:
      "A circular zodiac wheel with twelve signs surrounding a solar center.",
  },
  es: {
    kicker: "Astrología, bien hecha",
    title: "Lee el cielo como una historia.",
    body:
      "Crea tu carta natal para cualquier hora y lugar, sigue los tránsitos de hoy y acompaña a la Luna; todo basado en Swiss Ephemeris, con precisión de minuto de arco.",
    primaryCta: "Crea tu carta gratis",
    secondaryCta: "Explora el cielo de hoy",
    proofCharts: "1,2 M de cartas creadas",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Ideal para principiantes",
    chartTitle: "Rueda zodiacal decorativa",
    chartDescription:
      "Una rueda zodiacal circular con doce signos alrededor de un centro solar.",
  },
  fr: {
    kicker: "L’astrologie, faite comme il faut",
    title: "Lisez le ciel comme une histoire.",
    body:
      "Dressez votre thème natal pour toute heure et tout lieu, suivez les transits du jour et le cycle de la Lune — le tout fondé sur Swiss Ephemeris, avec une précision à la minute d’arc.",
    primaryCta: "Créer votre thème gratuit",
    secondaryCta: "Explorer le ciel du jour",
    proofCharts: "1,2 M de thèmes dressés",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Accessible aux débutants",
    chartTitle: "Roue zodiacale décorative",
    chartDescription:
      "Une roue zodiacale circulaire avec douze signes autour d’un centre solaire.",
  },
  pt: {
    kicker: "Astrologia, feita com rigor",
    title: "Leia o céu como uma história.",
    body:
      "Calcule seu mapa natal para qualquer hora e lugar, acompanhe os trânsitos de hoje e siga a Lua — tudo com base no Swiss Ephemeris, com precisão de minuto de arco.",
    primaryCta: "Crie seu mapa grátis",
    secondaryCta: "Explore o céu de hoje",
    proofCharts: "1,2 mi de mapas calculados",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Fácil para iniciantes",
    chartTitle: "Roda zodiacal decorativa",
    chartDescription:
      "Uma roda zodiacal circular com doze signos ao redor de um centro solar.",
  },
  ru: {
    kicker: "Астрология без упрощений",
    title: "Читайте небо как историю.",
    body:
      "Рассчитайте натальную карту для любого времени и места, следите за сегодняшними транзитами и движением Луны — всё на основе Swiss Ephemeris с точностью до угловой минуты.",
    primaryCta: "Создать карту бесплатно",
    secondaryCta: "Исследовать небо сегодня",
    proofCharts: "Построено 1,2 млн карт",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Понятно начинающим",
    chartTitle: "Декоративный зодиакальный круг",
    chartDescription:
      "Круг зодиака с двенадцатью знаками вокруг солнечного центра.",
  },
  it: {
    kicker: "Astrologia, fatta come si deve",
    title: "Leggi il cielo come una storia.",
    body:
      "Calcola il tuo tema natale per qualsiasi ora e luogo, segui i transiti di oggi e il cammino della Luna — tutto basato su Swiss Ephemeris, con precisione al minuto d’arco.",
    primaryCta: "Crea il tuo tema gratuito",
    secondaryCta: "Esplora il cielo di oggi",
    proofCharts: "1,2 M di temi calcolati",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Adatto ai principianti",
    chartTitle: "Ruota zodiacale decorativa",
    chartDescription:
      "Una ruota zodiacale circolare con dodici segni intorno a un centro solare.",
  },
  de: {
    kicker: "Astrologie, richtig gemacht",
    title: "Lies den Himmel wie eine Geschichte.",
    body:
      "Erstelle dein Geburtshoroskop für jede Zeit und jeden Ort, verfolge die heutigen Transite und den Lauf des Mondes — basierend auf Swiss Ephemeris und genau bis zur Bogenminute.",
    primaryCta: "Kostenloses Horoskop erstellen",
    secondaryCta: "Heutigen Himmel erkunden",
    proofCharts: "1,2 Mio. Horoskope erstellt",
    proofEphemeris: "Swiss Ephemeris",
    proofBeginner: "Einsteigerfreundlich",
    chartTitle: "Dekorativer Tierkreis",
    chartDescription:
      "Ein kreisförmiger Tierkreis mit zwölf Zeichen um ein Sonnenzentrum.",
  },
} satisfies Record<SupportedLocale, HomeHeroCopy>;

export const getHomeHeroCopy = (locale: SupportedLocale): HomeHeroCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
