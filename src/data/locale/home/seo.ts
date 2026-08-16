import type { SupportedLocale } from "../../localization-contract.ts";

export type HomeSeoCopy = {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

const copyByLocale = {
  en: {
    seoTitle: "Sidera | Read the sky like a story",
    seoDescription:
      "Create your birth chart, follow today's transits, and explore the Moon with precise, beginner-friendly astrology.",
    ogTitle: "Sidera | Read the sky like a story",
    ogDescription:
      "Precise modern astrology for birth charts, transits, and the Moon.",
    ogImageAlt: "Sidera astrology",
    twitterTitle: "Sidera | Read the sky like a story",
    twitterDescription:
      "Create your birth chart and follow the sky with precise modern astrology.",
  },
  es: {
    seoTitle: "Sidera | Lee el cielo como una historia",
    seoDescription:
      "Crea tu carta natal, sigue los tránsitos de hoy y explora la Luna con una astrología precisa y accesible.",
    ogTitle: "Sidera | Lee el cielo como una historia",
    ogDescription:
      "Astrología moderna y precisa para cartas natales, tránsitos y la Luna.",
    ogImageAlt: "Astrología de Sidera",
    twitterTitle: "Sidera | Lee el cielo como una historia",
    twitterDescription:
      "Crea tu carta natal y sigue el cielo con astrología moderna y precisa.",
  },
  fr: {
    seoTitle: "Sidera | Lisez le ciel comme une histoire",
    seoDescription:
      "Créez votre thème natal, suivez les transits du jour et explorez la Lune grâce à une astrologie précise et accessible.",
    ogTitle: "Sidera | Lisez le ciel comme une histoire",
    ogDescription:
      "Une astrologie moderne et précise pour les thèmes natals, les transits et la Lune.",
    ogImageAlt: "Astrologie Sidera",
    twitterTitle: "Sidera | Lisez le ciel comme une histoire",
    twitterDescription:
      "Créez votre thème natal et suivez le ciel avec une astrologie moderne et précise.",
  },
  pt: {
    seoTitle: "Sidera | Leia o céu como uma história",
    seoDescription:
      "Crie seu mapa natal, acompanhe os trânsitos de hoje e explore a Lua com uma astrologia precisa e acessível.",
    ogTitle: "Sidera | Leia o céu como uma história",
    ogDescription:
      "Astrologia moderna e precisa para mapas natais, trânsitos e a Lua.",
    ogImageAlt: "Astrologia Sidera",
    twitterTitle: "Sidera | Leia o céu como uma história",
    twitterDescription:
      "Crie seu mapa natal e acompanhe o céu com astrologia moderna e precisa.",
  },
  ru: {
    seoTitle: "Sidera | Читайте небо как историю",
    seoDescription:
      "Создайте натальную карту, следите за сегодняшними транзитами и изучайте Луну с помощью точной и понятной астрологии.",
    ogTitle: "Sidera | Читайте небо как историю",
    ogDescription:
      "Точная современная астрология: натальные карты, транзиты и Луна.",
    ogImageAlt: "Астрология Sidera",
    twitterTitle: "Sidera | Читайте небо как историю",
    twitterDescription:
      "Создайте натальную карту и следите за небом с помощью точной современной астрологии.",
  },
  it: {
    seoTitle: "Sidera | Leggi il cielo come una storia",
    seoDescription:
      "Crea il tuo tema natale, segui i transiti di oggi ed esplora la Luna con un’astrologia precisa e accessibile.",
    ogTitle: "Sidera | Leggi il cielo come una storia",
    ogDescription:
      "Astrologia moderna e precisa per temi natali, transiti e Luna.",
    ogImageAlt: "Astrologia Sidera",
    twitterTitle: "Sidera | Leggi il cielo come una storia",
    twitterDescription:
      "Crea il tuo tema natale e segui il cielo con un’astrologia moderna e precisa.",
  },
  de: {
    seoTitle: "Sidera | Lies den Himmel wie eine Geschichte",
    seoDescription:
      "Erstelle dein Geburtshoroskop, verfolge die heutigen Transite und erkunde den Mond mit präziser, verständlicher Astrologie.",
    ogTitle: "Sidera | Lies den Himmel wie eine Geschichte",
    ogDescription:
      "Präzise moderne Astrologie für Geburtshoroskope, Transite und den Mond.",
    ogImageAlt: "Sidera Astrologie",
    twitterTitle: "Sidera | Lies den Himmel wie eine Geschichte",
    twitterDescription:
      "Erstelle dein Geburtshoroskop und folge dem Himmel mit präziser moderner Astrologie.",
  },
} satisfies Record<SupportedLocale, HomeSeoCopy>;

export const getHomeSeoCopy = (locale: SupportedLocale): HomeSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
