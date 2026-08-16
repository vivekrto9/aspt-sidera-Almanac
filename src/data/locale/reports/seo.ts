import type { SupportedLocale } from "../../localization-contract.ts";

export type ReportsSeoCopy = {
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
    seoTitle: "Personal Astrology Reports | Sidera",
    seoDescription:
      "Explore in-depth astrology reports written from your exact birth data and delivered as beautifully typeset PDFs.",
    ogTitle: "Personal Astrology Reports | Sidera",
    ogDescription:
      "Explore thoughtful, astrologer-written interpretations of your exact chart.",
    ogImageAlt: "Sidera personal astrology reports",
    twitterTitle: "Personal Astrology Reports | Sidera",
    twitterDescription:
      "Explore thoughtful, astrologer-written interpretations of your exact chart.",
  },
  es: {
    seoTitle: "Informes astrológicos personales | Sidera",
    seoDescription:
      "Explora informes astrológicos en profundidad, escritos a partir de tus datos natales exactos y entregados en PDF.",
    ogTitle: "Informes astrológicos personales | Sidera",
    ogDescription:
      "Descubre interpretaciones cuidadas de tu carta exacta escritas por astrólogos.",
    ogImageAlt: "Informes astrológicos personales de Sidera",
    twitterTitle: "Informes astrológicos personales | Sidera",
    twitterDescription:
      "Descubre interpretaciones cuidadas de tu carta exacta escritas por astrólogos.",
  },
  fr: {
    seoTitle: "Rapports astrologiques personnels | Sidera",
    seoDescription:
      "Découvrez des rapports astrologiques approfondis, rédigés à partir de vos données natales exactes et livrés en PDF.",
    ogTitle: "Rapports astrologiques personnels | Sidera",
    ogDescription:
      "Découvrez des interprétations attentives de votre thème exact, rédigées par des astrologues.",
    ogImageAlt: "Rapports astrologiques personnels Sidera",
    twitterTitle: "Rapports astrologiques personnels | Sidera",
    twitterDescription:
      "Découvrez des interprétations attentives de votre thème exact, rédigées par des astrologues.",
  },
  pt: {
    seoTitle: "Relatórios astrológicos pessoais | Sidera",
    seoDescription:
      "Explore relatórios astrológicos aprofundados, escritos com seus dados natais exatos e entregues em PDF.",
    ogTitle: "Relatórios astrológicos pessoais | Sidera",
    ogDescription:
      "Explore interpretações cuidadosas do seu mapa exato, escritas por astrólogos.",
    ogImageAlt: "Relatórios astrológicos pessoais da Sidera",
    twitterTitle: "Relatórios astrológicos pessoais | Sidera",
    twitterDescription:
      "Explore interpretações cuidadosas do seu mapa exato, escritas por astrólogos.",
  },
  ru: {
    seoTitle: "Персональные астрологические отчёты | Sidera",
    seoDescription:
      "Изучайте подробные астрологические отчёты, созданные по вашим точным данным рождения и оформленные в PDF.",
    ogTitle: "Персональные астрологические отчёты | Sidera",
    ogDescription:
      "Получите вдумчивые трактовки вашей точной карты, написанные астрологами.",
    ogImageAlt: "Персональные астрологические отчёты Sidera",
    twitterTitle: "Персональные астрологические отчёты | Sidera",
    twitterDescription:
      "Получите вдумчивые трактовки вашей точной карты, написанные астрологами.",
  },
  it: {
    seoTitle: "Report astrologici personali | Sidera",
    seoDescription:
      "Esplora report astrologici approfonditi, scritti sui tuoi dati natali esatti e consegnati in PDF.",
    ogTitle: "Report astrologici personali | Sidera",
    ogDescription:
      "Esplora interpretazioni attente della tua carta esatta, scritte da astrologi.",
    ogImageAlt: "Report astrologici personali Sidera",
    twitterTitle: "Report astrologici personali | Sidera",
    twitterDescription:
      "Esplora interpretazioni attente della tua carta esatta, scritte da astrologi.",
  },
  de: {
    seoTitle: "Persönliche Astrologie-Berichte | Sidera",
    seoDescription:
      "Entdecke ausführliche Astrologie-Berichte, die aus deinen exakten Geburtsdaten erstellt und als PDF geliefert werden.",
    ogTitle: "Persönliche Astrologie-Berichte | Sidera",
    ogDescription:
      "Entdecke sorgfältige, von Astrolog:innen verfasste Deutungen deines exakten Horoskops.",
    ogImageAlt: "Persönliche Astrologie-Berichte von Sidera",
    twitterTitle: "Persönliche Astrologie-Berichte | Sidera",
    twitterDescription:
      "Entdecke sorgfältige, von Astrolog:innen verfasste Deutungen deines exakten Horoskops.",
  },
} satisfies Record<SupportedLocale, ReportsSeoCopy>;

export const getReportsSeoCopy = (
  locale: SupportedLocale,
): ReportsSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
