import type { SupportedLocale } from "../../localization-contract.ts";

type AstrologersSeoCopy = {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

const en: AstrologersSeoCopy = {
  seoTitle: "Talk to an Astrologer | Sidera",
  seoDescription:
    "Browse thoughtful professional astrologers for live chart readings, calls, and written questions.",
  ogTitle: "Talk to an Astrologer | Sidera",
  ogDescription:
    "Find an astrologer whose approach and specialty fit your question.",
  ogImageAlt: "Sidera live astrology readings",
  twitterTitle: "Talk to an Astrologer | Sidera",
  twitterDescription:
    "Browse professional astrologers for a personal chart reading.",
};

const copies: Record<SupportedLocale, AstrologersSeoCopy> = {
  en,
  es: { ...en, seoTitle: "Habla con un astrólogo | Sidera", ogTitle: "Habla con un astrólogo | Sidera" },
  fr: { ...en, seoTitle: "Parlez à un astrologue | Sidera", ogTitle: "Parlez à un astrologue | Sidera" },
  pt: { ...en, seoTitle: "Fale com um astrólogo | Sidera", ogTitle: "Fale com um astrólogo | Sidera" },
  ru: { ...en, seoTitle: "Поговорите с астрологом | Sidera", ogTitle: "Поговорите с астрологом | Sidera" },
  it: { ...en, seoTitle: "Parla con un astrologo | Sidera", ogTitle: "Parla con un astrologo | Sidera" },
  de: { ...en, seoTitle: "Sprich mit einem Astrologen | Sidera", ogTitle: "Sprich mit einem Astrologen | Sidera" },
};

export const getAstrologersSeoCopy = (
  locale: SupportedLocale,
): AstrologersSeoCopy => copies[locale] ?? copies.en;
