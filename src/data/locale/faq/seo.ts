import type { SupportedLocale } from "../../localization-contract.ts";

export type FaqSeoCopy = {
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
    seoTitle: "Frequently Asked Questions | Sidera",
    seoDescription:
      "Answers about Sidera birth charts, astrology accuracy, billing and readings.",
    ogTitle: "Frequently Asked Questions | Sidera",
    ogDescription:
      "Find clear answers about charts, accuracy, billing and astrology readings.",
    ogImageAlt: "Sidera frequently asked questions",
    twitterTitle: "Frequently Asked Questions | Sidera",
    twitterDescription:
      "Find clear answers about charts, accuracy, billing and astrology readings.",
  },
  es: {
    seoTitle: "Preguntas frecuentes | Sidera",
    seoDescription:
      "Respuestas sobre cartas natales, precisión astrológica, facturación y lecturas de Sidera.",
    ogTitle: "Preguntas frecuentes | Sidera",
    ogDescription:
      "Encuentra respuestas claras sobre cartas, precisión, facturación y lecturas astrológicas.",
    ogImageAlt: "Preguntas frecuentes de Sidera",
    twitterTitle: "Preguntas frecuentes | Sidera",
    twitterDescription:
      "Encuentra respuestas claras sobre cartas, precisión, facturación y lecturas astrológicas.",
  },
  fr: {
    seoTitle: "Questions fréquentes | Sidera",
    seoDescription:
      "Réponses sur les thèmes astraux Sidera, leur précision, la facturation et les consultations.",
    ogTitle: "Questions fréquentes | Sidera",
    ogDescription:
      "Des réponses claires sur les thèmes, la précision, la facturation et les consultations astrologiques.",
    ogImageAlt: "Questions fréquentes de Sidera",
    twitterTitle: "Questions fréquentes | Sidera",
    twitterDescription:
      "Des réponses claires sur les thèmes, la précision, la facturation et les consultations astrologiques.",
  },
  pt: {
    seoTitle: "Perguntas frequentes | Sidera",
    seoDescription:
      "Respostas sobre mapas astrais, precisão astrológica, cobrança e leituras da Sidera.",
    ogTitle: "Perguntas frequentes | Sidera",
    ogDescription:
      "Encontre respostas claras sobre mapas, precisão, cobrança e leituras astrológicas.",
    ogImageAlt: "Perguntas frequentes da Sidera",
    twitterTitle: "Perguntas frequentes | Sidera",
    twitterDescription:
      "Encontre respostas claras sobre mapas, precisão, cobrança e leituras astrológicas.",
  },
  ru: {
    seoTitle: "Частые вопросы | Sidera",
    seoDescription:
      "Ответы о натальных картах Sidera, точности астрологии, оплате и консультациях.",
    ogTitle: "Частые вопросы | Sidera",
    ogDescription:
      "Понятные ответы о картах, точности, оплате и астрологических консультациях.",
    ogImageAlt: "Частые вопросы о Sidera",
    twitterTitle: "Частые вопросы | Sidera",
    twitterDescription:
      "Понятные ответы о картах, точности, оплате и астрологических консультациях.",
  },
  it: {
    seoTitle: "Domande frequenti | Sidera",
    seoDescription:
      "Risposte su temi natali Sidera, precisione astrologica, pagamenti e consulti.",
    ogTitle: "Domande frequenti | Sidera",
    ogDescription:
      "Risposte chiare su temi, precisione, pagamenti e consulti astrologici.",
    ogImageAlt: "Domande frequenti di Sidera",
    twitterTitle: "Domande frequenti | Sidera",
    twitterDescription:
      "Risposte chiare su temi, precisione, pagamenti e consulti astrologici.",
  },
  de: {
    seoTitle: "Häufig gestellte Fragen | Sidera",
    seoDescription:
      "Antworten zu Sidera-Geburtshoroskopen, astrologischer Genauigkeit, Abrechnung und Deutungen.",
    ogTitle: "Häufig gestellte Fragen | Sidera",
    ogDescription:
      "Klare Antworten zu Horoskopen, Genauigkeit, Abrechnung und astrologischen Deutungen.",
    ogImageAlt: "Häufig gestellte Fragen zu Sidera",
    twitterTitle: "Häufig gestellte Fragen | Sidera",
    twitterDescription:
      "Klare Antworten zu Horoskopen, Genauigkeit, Abrechnung und astrologischen Deutungen.",
  },
} satisfies Record<SupportedLocale, FaqSeoCopy>;

export const getFaqSeoCopy = (locale: SupportedLocale): FaqSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
