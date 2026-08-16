import type { SupportedLocale } from "../../localization-contract.ts";

export type RetrogradesSeoCopy = {
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
    seoTitle: "Planets in Retrograde Now | Sidera",
    seoDescription:
      "See which planets are retrograde now and understand what each inward cycle asks you to review, revise, and revisit.",
    ogTitle: "Planets in Retrograde Now | Sidera",
    ogDescription:
      "Follow current planetary retrogrades and understand their reflective themes.",
    ogImageAlt: "Sidera guide to current planetary retrogrades",
    twitterTitle: "Planets in Retrograde Now | Sidera",
    twitterDescription:
      "Follow current planetary retrogrades and understand their reflective themes.",
  },
  es: {
    seoTitle: "Planetas retrógrados ahora | Sidera",
    seoDescription:
      "Descubre qué planetas están retrógrados ahora y qué te invita a revisar, corregir y retomar cada ciclo interior.",
    ogTitle: "Planetas retrógrados ahora | Sidera",
    ogDescription:
      "Sigue los retrógrados planetarios actuales y comprende sus temas de reflexión.",
    ogImageAlt: "Guía de Sidera sobre los retrógrados planetarios actuales",
    twitterTitle: "Planetas retrógrados ahora | Sidera",
    twitterDescription:
      "Sigue los retrógrados planetarios actuales y comprende sus temas de reflexión.",
  },
  fr: {
    seoTitle: "Planètes rétrogrades en ce moment | Sidera",
    seoDescription:
      "Découvrez quelles planètes sont rétrogrades et ce que chaque cycle intérieur vous invite à revoir, réviser et revisiter.",
    ogTitle: "Planètes rétrogrades en ce moment | Sidera",
    ogDescription:
      "Suivez les rétrogrades actuelles et comprenez leurs thèmes de réflexion.",
    ogImageAlt: "Guide Sidera des rétrogrades planétaires actuelles",
    twitterTitle: "Planètes rétrogrades en ce moment | Sidera",
    twitterDescription:
      "Suivez les rétrogrades actuelles et comprenez leurs thèmes de réflexion.",
  },
  pt: {
    seoTitle: "Planetas retrógrados agora | Sidera",
    seoDescription:
      "Veja quais planetas estão retrógrados agora e o que cada ciclo interior convida a rever, corrigir e retomar.",
    ogTitle: "Planetas retrógrados agora | Sidera",
    ogDescription:
      "Acompanhe os retrógrados atuais e compreenda os seus temas de reflexão.",
    ogImageAlt: "Guia da Sidera para os retrógrados planetários atuais",
    twitterTitle: "Planetas retrógrados agora | Sidera",
    twitterDescription:
      "Acompanhe os retrógrados atuais e compreenda os seus temas de reflexão.",
  },
  ru: {
    seoTitle: "Ретроградные планеты сейчас | Sidera",
    seoDescription:
      "Узнайте, какие планеты сейчас ретроградны и что каждый внутренний цикл предлагает пересмотреть, исправить и переосмыслить.",
    ogTitle: "Ретроградные планеты сейчас | Sidera",
    ogDescription:
      "Следите за текущими ретроградными циклами и понимайте их темы для размышления.",
    ogImageAlt: "Гид Sidera по текущим ретроградным планетам",
    twitterTitle: "Ретроградные планеты сейчас | Sidera",
    twitterDescription:
      "Следите за текущими ретроградными циклами и понимайте их темы для размышления.",
  },
  it: {
    seoTitle: "Pianeti retrogradi adesso | Sidera",
    seoDescription:
      "Scopri quali pianeti sono retrogradi e cosa ogni ciclo interiore invita a rivedere, correggere e riprendere.",
    ogTitle: "Pianeti retrogradi adesso | Sidera",
    ogDescription:
      "Segui i retrogradi planetari attuali e comprendine i temi riflessivi.",
    ogImageAlt: "Guida Sidera ai retrogradi planetari attuali",
    twitterTitle: "Pianeti retrogradi adesso | Sidera",
    twitterDescription:
      "Segui i retrogradi planetari attuali e comprendine i temi riflessivi.",
  },
  de: {
    seoTitle: "Aktuell rückläufige Planeten | Sidera",
    seoDescription:
      "Sieh, welche Planeten gerade rückläufig sind und was jeder innere Zyklus zum Prüfen, Überarbeiten und Wiederaufgreifen anregt.",
    ogTitle: "Aktuell rückläufige Planeten | Sidera",
    ogDescription:
      "Verfolge aktuelle Rückläufigkeiten und verstehe ihre nach innen gerichteten Themen.",
    ogImageAlt: "Sidera-Leitfaden zu aktuellen planetaren Rückläufigkeiten",
    twitterTitle: "Aktuell rückläufige Planeten | Sidera",
    twitterDescription:
      "Verfolge aktuelle Rückläufigkeiten und verstehe ihre nach innen gerichteten Themen.",
  },
} satisfies Record<SupportedLocale, RetrogradesSeoCopy>;

export const getRetrogradesSeoCopy = (
  locale: SupportedLocale,
): RetrogradesSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
