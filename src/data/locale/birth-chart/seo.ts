import type { SupportedLocale } from "../../localization-contract.ts";

export type BirthChartSeoCopy = {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

const en: BirthChartSeoCopy = {
  seoTitle: "Free Birth Chart | Sidera",
  seoDescription: "Create your natal chart from your birth date, time, and place.",
  ogTitle: "Create your natal chart",
  ogDescription: "See the planetary pattern from the moment you were born.",
  ogImageAlt: "Sidera birth chart",
  twitterTitle: "Create your natal chart | Sidera",
  twitterDescription: "Build your free natal chart with Sidera.",
};

const localized = {
  en,
  es: { ...en, seoTitle: "Carta natal gratis | Sidera", seoDescription: "Crea tu carta natal con tu fecha, hora y lugar de nacimiento.", ogTitle: "Crea tu carta natal", ogDescription: "Descubre el patrón planetario del momento en que naciste.", ogImageAlt: "Carta natal de Sidera", twitterTitle: "Crea tu carta natal | Sidera", twitterDescription: "Crea tu carta natal gratis con Sidera." },
  fr: { ...en, seoTitle: "Thème natal gratuit | Sidera", seoDescription: "Créez votre thème natal avec votre date, heure et lieu de naissance.", ogTitle: "Créez votre thème natal", ogDescription: "Découvrez la configuration planétaire de votre naissance.", ogImageAlt: "Thème natal Sidera", twitterTitle: "Créez votre thème natal | Sidera", twitterDescription: "Créez gratuitement votre thème natal avec Sidera." },
  pt: { ...en, seoTitle: "Mapa natal gratuito | Sidera", seoDescription: "Crie seu mapa natal com data, hora e local de nascimento.", ogTitle: "Crie seu mapa natal", ogDescription: "Veja o padrão planetário do momento em que você nasceu.", ogImageAlt: "Mapa natal Sidera", twitterTitle: "Crie seu mapa natal | Sidera", twitterDescription: "Crie gratuitamente seu mapa natal com a Sidera." },
  ru: { ...en, seoTitle: "Бесплатная натальная карта | Sidera", seoDescription: "Постройте натальную карту по дате, времени и месту рождения.", ogTitle: "Постройте натальную карту", ogDescription: "Узнайте положение планет в момент вашего рождения.", ogImageAlt: "Натальная карта Sidera", twitterTitle: "Постройте натальную карту | Sidera", twitterDescription: "Создайте бесплатную натальную карту в Sidera." },
  it: { ...en, seoTitle: "Tema natale gratuito | Sidera", seoDescription: "Crea il tuo tema natale con data, ora e luogo di nascita.", ogTitle: "Crea il tuo tema natale", ogDescription: "Scopri lo schema planetario del momento in cui sei nato.", ogImageAlt: "Tema natale Sidera", twitterTitle: "Crea il tuo tema natale | Sidera", twitterDescription: "Crea gratuitamente il tuo tema natale con Sidera." },
  de: { ...en, seoTitle: "Kostenloses Geburtshoroskop | Sidera", seoDescription: "Erstelle dein Geburtshoroskop mit Geburtsdatum, Uhrzeit und Ort.", ogTitle: "Erstelle dein Geburtshoroskop", ogDescription: "Entdecke das Planetenmuster deines Geburtsmoments.", ogImageAlt: "Sidera Geburtshoroskop", twitterTitle: "Erstelle dein Geburtshoroskop | Sidera", twitterDescription: "Erstelle dein kostenloses Geburtshoroskop mit Sidera." },
} satisfies Record<SupportedLocale, BirthChartSeoCopy>;

export const getBirthChartSeoCopy = (locale: SupportedLocale): BirthChartSeoCopy =>
  localized[locale] ?? localized.en;
