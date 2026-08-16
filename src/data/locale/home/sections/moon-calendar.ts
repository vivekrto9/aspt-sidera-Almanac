import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeMoonCalendarPhase = {
  phase:
    | "new"
    | "waxing-crescent"
    | "first-quarter"
    | "waxing-gibbous"
    | "full"
    | "waning-gibbous"
    | "last-quarter"
    | "waning-crescent";
  name: string;
  date: string;
};

export type HomeMoonCalendarCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  currentPhaseName: string;
  currentPhaseMeta: string;
  currentPhaseDescription: string;
  ctaLabel: string;
  phases: HomeMoonCalendarPhase[];
  nextFullLabel: string;
  nextFullValue: string;
  nextNewLabel: string;
  nextNewValue: string;
};

const copyByLocale: Record<SupportedLocale, HomeMoonCalendarCopy> = {
  en: {
    eyebrow: "Moon Calendar",
    titleAccent: "Follow",
    titleRest: "the Moon.",
    currentPhaseName: "Waxing Gibbous",
    currentPhaseMeta: "78% illuminated · in Capricorn",
    currentPhaseDescription:
      "A building, gathering energy. Good for refining plans set at the New Moon before the Full Moon peak.",
    ctaLabel: "Open the Moon calendar",
    phases: [
      { phase: "new", name: "New Moon", date: "Jun 25" },
      { phase: "first-quarter", name: "First Quarter", date: "Jul 2" },
      { phase: "full", name: "Full Moon", date: "Jul 10" },
      { phase: "last-quarter", name: "Last Quarter", date: "Jul 17" },
      { phase: "new", name: "New Moon", date: "Jul 24" },
    ],
    nextFullLabel: "Next Full Moon",
    nextFullValue: "Jul 10 · Capricorn",
    nextNewLabel: "Next New Moon",
    nextNewValue: "Jul 24 · Leo",
  },
  es: {
    eyebrow: "Calendario lunar",
    titleAccent: "Sigue",
    titleRest: "la Luna.",
    currentPhaseName: "Luna gibosa creciente",
    currentPhaseMeta: "78% iluminada · en Capricornio",
    currentPhaseDescription:
      "Una energía que crece y se reúne. Es un buen momento para afinar los planes iniciados en la Luna nueva antes del plenilunio.",
    ctaLabel: "Abrir el calendario lunar",
    phases: [
      { phase: "new", name: "Luna nueva", date: "25 jun" },
      { phase: "first-quarter", name: "Cuarto creciente", date: "2 jul" },
      { phase: "full", name: "Luna llena", date: "10 jul" },
      { phase: "last-quarter", name: "Cuarto menguante", date: "17 jul" },
      { phase: "new", name: "Luna nueva", date: "24 jul" },
    ],
    nextFullLabel: "Próxima Luna llena",
    nextFullValue: "10 jul · Capricornio",
    nextNewLabel: "Próxima Luna nueva",
    nextNewValue: "24 jul · Leo",
  },
  fr: {
    eyebrow: "Calendrier lunaire",
    titleAccent: "Suivez",
    titleRest: "la Lune.",
    currentPhaseName: "Lune gibbeuse croissante",
    currentPhaseMeta: "Éclairée à 78 % · en Capricorne",
    currentPhaseDescription:
      "Une énergie qui se construit et se rassemble. Le moment est propice pour affiner les intentions posées à la Nouvelle Lune.",
    ctaLabel: "Ouvrir le calendrier lunaire",
    phases: [
      { phase: "new", name: "Nouvelle Lune", date: "25 juin" },
      { phase: "first-quarter", name: "Premier quartier", date: "2 juil." },
      { phase: "full", name: "Pleine Lune", date: "10 juil." },
      { phase: "last-quarter", name: "Dernier quartier", date: "17 juil." },
      { phase: "new", name: "Nouvelle Lune", date: "24 juil." },
    ],
    nextFullLabel: "Prochaine Pleine Lune",
    nextFullValue: "10 juil. · Capricorne",
    nextNewLabel: "Prochaine Nouvelle Lune",
    nextNewValue: "24 juil. · Lion",
  },
  pt: {
    eyebrow: "Calendário lunar",
    titleAccent: "Siga",
    titleRest: "a Lua.",
    currentPhaseName: "Lua gibosa crescente",
    currentPhaseMeta: "78% iluminada · em Capricórnio",
    currentPhaseDescription:
      "Uma energia crescente e agregadora. Um bom momento para refinar os planos definidos na Lua nova antes do auge da Lua cheia.",
    ctaLabel: "Abrir o calendário lunar",
    phases: [
      { phase: "new", name: "Lua nova", date: "25 jun" },
      { phase: "first-quarter", name: "Quarto crescente", date: "2 jul" },
      { phase: "full", name: "Lua cheia", date: "10 jul" },
      { phase: "last-quarter", name: "Quarto minguante", date: "17 jul" },
      { phase: "new", name: "Lua nova", date: "24 jul" },
    ],
    nextFullLabel: "Próxima Lua cheia",
    nextFullValue: "10 jul · Capricórnio",
    nextNewLabel: "Próxima Lua nova",
    nextNewValue: "24 jul · Leão",
  },
  ru: {
    eyebrow: "Лунный календарь",
    titleAccent: "Следуйте",
    titleRest: "за Луной.",
    currentPhaseName: "Растущая выпуклая Луна",
    currentPhaseMeta: "Освещена на 78% · в Козероге",
    currentPhaseDescription:
      "Энергия нарастает и собирается. Это хорошее время, чтобы уточнить планы, заданные в Новолуние, до пика Полнолуния.",
    ctaLabel: "Открыть лунный календарь",
    phases: [
      { phase: "new", name: "Новолуние", date: "25 июн." },
      { phase: "first-quarter", name: "Первая четверть", date: "2 июл." },
      { phase: "full", name: "Полнолуние", date: "10 июл." },
      { phase: "last-quarter", name: "Последняя четверть", date: "17 июл." },
      { phase: "new", name: "Новолуние", date: "24 июл." },
    ],
    nextFullLabel: "Следующее Полнолуние",
    nextFullValue: "10 июл. · Козерог",
    nextNewLabel: "Следующее Новолуние",
    nextNewValue: "24 июл. · Лев",
  },
  it: {
    eyebrow: "Calendario lunare",
    titleAccent: "Segui",
    titleRest: "la Luna.",
    currentPhaseName: "Luna gibbosa crescente",
    currentPhaseMeta: "Illuminata al 78% · in Capricorno",
    currentPhaseDescription:
      "Un'energia che cresce e si raccoglie. È il momento giusto per affinare i progetti nati con la Luna nuova prima del plenilunio.",
    ctaLabel: "Apri il calendario lunare",
    phases: [
      { phase: "new", name: "Luna nuova", date: "25 giu" },
      { phase: "first-quarter", name: "Primo quarto", date: "2 lug" },
      { phase: "full", name: "Luna piena", date: "10 lug" },
      { phase: "last-quarter", name: "Ultimo quarto", date: "17 lug" },
      { phase: "new", name: "Luna nuova", date: "24 lug" },
    ],
    nextFullLabel: "Prossima Luna piena",
    nextFullValue: "10 lug · Capricorno",
    nextNewLabel: "Prossima Luna nuova",
    nextNewValue: "24 lug · Leone",
  },
  de: {
    eyebrow: "Mondkalender",
    titleAccent: "Folge",
    titleRest: "dem Mond.",
    currentPhaseName: "Zunehmender Dreiviertelmond",
    currentPhaseMeta: "Zu 78% beleuchtet · im Steinbock",
    currentPhaseDescription:
      "Die Energie baut sich auf und bündelt sich. Jetzt lassen sich die zum Neumond gefassten Pläne vor dem Vollmond verfeinern.",
    ctaLabel: "Mondkalender öffnen",
    phases: [
      { phase: "new", name: "Neumond", date: "25. Juni" },
      { phase: "first-quarter", name: "Erstes Viertel", date: "2. Juli" },
      { phase: "full", name: "Vollmond", date: "10. Juli" },
      { phase: "last-quarter", name: "Letztes Viertel", date: "17. Juli" },
      { phase: "new", name: "Neumond", date: "24. Juli" },
    ],
    nextFullLabel: "Nächster Vollmond",
    nextFullValue: "10. Juli · Steinbock",
    nextNewLabel: "Nächster Neumond",
    nextNewValue: "24. Juli · Löwe",
  },
};

export const getHomeMoonCalendarCopy = (
  locale: SupportedLocale,
): HomeMoonCalendarCopy => copyByLocale[locale] ?? copyByLocale.en;
