import type { SupportedLocale } from "../../../localization-contract.ts";

export type MoonCalendarTonightCopy = {
  eyebrow: string;
  phaseName: string;
  phaseDetail: string;
  meaning: string;
  nextFullLabel: string;
  nextFullDate: string;
  nextFullCountdown: string;
  nextNewLabel: string;
  nextNewDate: string;
  nextNewCountdown: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Tonight's Moon",
    phaseName: "Waxing Gibbous",
    phaseDetail: "78% illuminated · in Capricorn",
    meaning:
      "A building, gathering energy. Good for refining plans set at the New Moon before the Full Moon peak.",
    nextFullLabel: "Next Full",
    nextFullDate: "Jul 10",
    nextFullCountdown: "in 8 days",
    nextNewLabel: "Next New",
    nextNewDate: "Jul 24",
    nextNewCountdown: "in 22 days",
  },
  es: {
    eyebrow: "La Luna de esta noche",
    phaseName: "Gibosa creciente",
    phaseDetail: "78% iluminada · en Capricornio",
    meaning:
      "Una energía que crece y se reúne. Ideal para perfeccionar los planes iniciados en la Luna nueva antes del punto álgido de la Luna llena.",
    nextFullLabel: "Próxima llena",
    nextFullDate: "10 jul",
    nextFullCountdown: "en 8 días",
    nextNewLabel: "Próxima nueva",
    nextNewDate: "24 jul",
    nextNewCountdown: "en 22 días",
  },
  fr: {
    eyebrow: "La Lune de ce soir",
    phaseName: "Gibbeuse croissante",
    phaseDetail: "78 % éclairée · en Capricorne",
    meaning:
      "Une énergie qui se construit et se rassemble. Idéale pour affiner les projets lancés à la Nouvelle Lune avant le sommet de la Pleine Lune.",
    nextFullLabel: "Prochaine pleine",
    nextFullDate: "10 juil.",
    nextFullCountdown: "dans 8 jours",
    nextNewLabel: "Prochaine nouvelle",
    nextNewDate: "24 juil.",
    nextNewCountdown: "dans 22 jours",
  },
  pt: {
    eyebrow: "A Lua desta noite",
    phaseName: "Gibosa crescente",
    phaseDetail: "78% iluminada · em Capricórnio",
    meaning:
      "Uma energia que cresce e se reúne. Boa para aperfeiçoar os planos iniciados na Lua nova antes do auge da Lua cheia.",
    nextFullLabel: "Próxima cheia",
    nextFullDate: "10 jul.",
    nextFullCountdown: "em 8 dias",
    nextNewLabel: "Próxima nova",
    nextNewDate: "24 jul.",
    nextNewCountdown: "em 22 dias",
  },
  ru: {
    eyebrow: "Луна сегодня вечером",
    phaseName: "Растущая выпуклая",
    phaseDetail: "освещено 78% · в Козероге",
    meaning:
      "Энергия нарастает и собирается. Подходящее время уточнить планы, заложенные в новолуние, перед пиком полнолуния.",
    nextFullLabel: "Следующее полнолуние",
    nextFullDate: "10 июл.",
    nextFullCountdown: "через 8 дней",
    nextNewLabel: "Следующее новолуние",
    nextNewDate: "24 июл.",
    nextNewCountdown: "через 22 дня",
  },
  it: {
    eyebrow: "La Luna di stasera",
    phaseName: "Gibbosa crescente",
    phaseDetail: "78% illuminata · in Capricorno",
    meaning:
      "Un’energia che cresce e si raccoglie. Ideale per perfezionare i piani avviati con la Luna nuova prima del culmine della Luna piena.",
    nextFullLabel: "Prossima piena",
    nextFullDate: "10 lug",
    nextFullCountdown: "tra 8 giorni",
    nextNewLabel: "Prossima nuova",
    nextNewDate: "24 lug",
    nextNewCountdown: "tra 22 giorni",
  },
  de: {
    eyebrow: "Der Mond heute Nacht",
    phaseName: "Zunehmender Dreiviertelmond",
    phaseDetail: "78 % beleuchtet · im Steinbock",
    meaning:
      "Eine aufbauende, sammelnde Energie. Gut, um Pläne aus dem Neumond vor dem Höhepunkt des Vollmonds zu verfeinern.",
    nextFullLabel: "Nächster Vollmond",
    nextFullDate: "10. Juli",
    nextFullCountdown: "in 8 Tagen",
    nextNewLabel: "Nächster Neumond",
    nextNewDate: "24. Juli",
    nextNewCountdown: "in 22 Tagen",
  },
} satisfies Record<SupportedLocale, MoonCalendarTonightCopy>;

export const getMoonCalendarTonightCopy = (
  locale: SupportedLocale,
): MoonCalendarTonightCopy => copyByLocale[locale] ?? copyByLocale.en;
