import type { SupportedLocale } from "../../../localization-contract.ts";

export type AboutPrinciple = {
  title: string;
  body: string;
};

const copyByLocale = {
  en: [
    {
      title: "Accurate to the arcminute",
      body: "Positions are computed from the Swiss Ephemeris, not approximated. Your chart matches what an observatory would tell you.",
    },
    {
      title: "Readable for beginners",
      body: "No jargon walls. Every placement is explained in plain language, with technical depth one click deeper for those who want it.",
    },
    {
      title: "Honest by default",
      body: "We do not invent urgency or sell fear. Astrology here is a lens for reflection, not a slot machine for anxiety.",
    },
  ],
  es: [
    {
      title: "Precisión hasta el minuto de arco",
      body: "Las posiciones se calculan con Swiss Ephemeris, sin aproximaciones. Tu carta coincide con lo que indicaría un observatorio.",
    },
    {
      title: "Comprensible para principiantes",
      body: "Sin muros de jerga. Cada posición se explica con claridad, con profundidad técnica a un clic para quien quiera ir más allá.",
    },
    {
      title: "Honestidad por defecto",
      body: "No inventamos urgencia ni vendemos miedo. Aquí la astrología es una lente para reflexionar, no una máquina de ansiedad.",
    },
  ],
  fr: [
    {
      title: "Précis à la minute d’arc",
      body: "Les positions sont calculées avec Swiss Ephemeris, sans approximation. Votre thème correspond à ce qu’indiquerait un observatoire.",
    },
    {
      title: "Lisible pour les débutants",
      body: "Pas de mur de jargon. Chaque position est expliquée simplement, avec un niveau technique accessible en un clic pour aller plus loin.",
    },
    {
      title: "Honnête par défaut",
      body: "Nous ne créons pas d’urgence et ne vendons pas la peur. Ici, l’astrologie est un outil de réflexion, pas une machine à anxiété.",
    },
  ],
  pt: [
    {
      title: "Precisão até o minuto de arco",
      body: "As posições são calculadas com o Swiss Ephemeris, sem aproximações. Seu mapa corresponde ao que um observatório indicaria.",
    },
    {
      title: "Claro para iniciantes",
      body: "Sem paredes de jargão. Cada posição é explicada em linguagem simples, com profundidade técnica a um clique para quem quiser.",
    },
    {
      title: "Honestidade por padrão",
      body: "Não inventamos urgência nem vendemos medo. Aqui, a astrologia é uma lente para reflexão, não uma máquina de ansiedade.",
    },
  ],
  ru: [
    {
      title: "Точность до угловой минуты",
      body: "Положения рассчитываются по Swiss Ephemeris без приближений. Ваша карта соответствует данным профессиональной обсерватории.",
    },
    {
      title: "Понятно для начинающих",
      body: "Никаких стен из терминов. Каждое положение объясняется простым языком, а технические детали доступны тем, кто хочет глубже.",
    },
    {
      title: "Честность по умолчанию",
      body: "Мы не создаём искусственную срочность и не продаём страх. Здесь астрология — инструмент размышления, а не источник тревоги.",
    },
  ],
  it: [
    {
      title: "Precisa al minuto d’arco",
      body: "Le posizioni sono calcolate con Swiss Ephemeris, senza approssimazioni. Il tuo tema coincide con ciò che indicherebbe un osservatorio.",
    },
    {
      title: "Chiara per chi inizia",
      body: "Niente muri di gergo. Ogni posizione è spiegata con parole semplici, con la profondità tecnica a un clic per chi la desidera.",
    },
    {
      title: "Onesta per principio",
      body: "Non inventiamo urgenza e non vendiamo paura. Qui l’astrologia è una lente per riflettere, non una macchina per alimentare l’ansia.",
    },
  ],
  de: [
    {
      title: "Auf die Bogenminute genau",
      body: "Positionen werden mit Swiss Ephemeris berechnet, nicht geschätzt. Ihr Horoskop entspricht den Angaben eines Observatoriums.",
    },
    {
      title: "Verständlich für Einsteiger",
      body: "Keine Mauern aus Fachbegriffen. Jede Position wird klar erklärt; technische Tiefe ist für Interessierte nur einen Klick entfernt.",
    },
    {
      title: "Ehrlichkeit als Grundsatz",
      body: "Wir erfinden keine Dringlichkeit und verkaufen keine Angst. Astrologie ist hier eine Perspektive zur Reflexion, kein Spielautomat für Sorgen.",
    },
  ],
} satisfies Record<SupportedLocale, AboutPrinciple[]>;

export const getAboutPrinciplesCopy = (
  locale: SupportedLocale,
): AboutPrinciple[] => copyByLocale[locale] ?? copyByLocale.en;
