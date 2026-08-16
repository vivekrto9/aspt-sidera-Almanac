import type { SupportedLocale } from "../../../localization-contract.ts";

export type DailyHoroscopeReadingCopy = {
  breadcrumbLabel: string;
  changeSign: string;
  signLabel: string;
  ruledByLabel: string;
  periodsLabel: string;
  periods: {
    id: "yesterday" | "today" | "tomorrow" | "week" | "month";
    label: string;
    overline: string;
  }[];
  themeLabels: [string, string, string];
  themeTexts: [string, string, string];
  browseSigns: string;
  dayGlance: string;
  ratingLabels: [string, string, string, string];
  luckyToday: string;
  mood: string;
  number: string;
  colour: string;
  bestMatch: string;
  skyBehind: string;
  fullSky: string;
  breadcrumbAriaLabel: string;
};

const english: DailyHoroscopeReadingCopy = {
  breadcrumbLabel: "Horoscope",
  changeSign: "Change sign",
  signLabel: "sign",
  ruledByLabel: "ruled by",
  periodsLabel: "Reading period",
  periods: [
    { id: "yesterday", label: "Yesterday", overline: "Yesterday" },
    { id: "today", label: "Today", overline: "Today" },
    { id: "tomorrow", label: "Tomorrow", overline: "Tomorrow" },
    { id: "week", label: "This Week", overline: "This week" },
    { id: "month", label: "This Month", overline: "This month" },
  ],
  themeLabels: ["Love", "Work & Money", "Wellbeing"],
  themeTexts: [
    "Lead with warmth, but leave room for another person to surprise you.",
    "A focused decision carries more momentum than three half-finished plans.",
    "Choose the pace that keeps your energy steady instead of merely busy.",
  ],
  browseSigns: "Browse signs",
  dayGlance: "The day at a glance",
  ratingLabels: ["Energy", "Love", "Focus", "Luck"],
  luckyToday: "Lucky today",
  mood: "Mood",
  number: "Number",
  colour: "Colour",
  bestMatch: "Best match",
  skyBehind: "The sky behind this",
  fullSky: "See the full sky →",
  breadcrumbAriaLabel: "Daily horoscope breadcrumb",
};

const copyByLocale: Record<SupportedLocale, DailyHoroscopeReadingCopy> = {
  en: english,
  es: {
    ...english,
    breadcrumbLabel: "Horóscopo",
    changeSign: "Cambiar signo",
    signLabel: "signo",
    ruledByLabel: "regido por",
    periodsLabel: "Periodo de lectura",
    periods: [
      { id: "yesterday", label: "Ayer", overline: "Ayer" },
      { id: "today", label: "Hoy", overline: "Hoy" },
      { id: "tomorrow", label: "Mañana", overline: "Mañana" },
      { id: "week", label: "Esta semana", overline: "Esta semana" },
      { id: "month", label: "Este mes", overline: "Este mes" },
    ],
    themeLabels: ["Amor", "Trabajo y dinero", "Bienestar"],
    browseSigns: "Explorar signos",
    dayGlance: "El día de un vistazo",
    ratingLabels: ["Energía", "Amor", "Enfoque", "Suerte"],
    luckyToday: "Tu suerte hoy",
    mood: "Ánimo",
    number: "Número",
    colour: "Color",
    bestMatch: "Mejor conexión",
    skyBehind: "El cielo detrás de esto",
    fullSky: "Ver el cielo completo →",
    breadcrumbAriaLabel: "Ruta del horóscopo diario",
  },
  fr: {
    ...english,
    breadcrumbLabel: "Horoscope",
    changeSign: "Changer de signe",
    signLabel: "signe",
    ruledByLabel: "gouverné par",
    periodsLabel: "Période de lecture",
    periods: [
      { id: "yesterday", label: "Hier", overline: "Hier" },
      { id: "today", label: "Aujourd’hui", overline: "Aujourd’hui" },
      { id: "tomorrow", label: "Demain", overline: "Demain" },
      { id: "week", label: "Cette semaine", overline: "Cette semaine" },
      { id: "month", label: "Ce mois-ci", overline: "Ce mois-ci" },
    ],
    themeLabels: ["Amour", "Travail et argent", "Bien-être"],
    browseSigns: "Parcourir les signes",
    dayGlance: "La journée en un coup d’œil",
    ratingLabels: ["Énergie", "Amour", "Concentration", "Chance"],
    luckyToday: "Chance du jour",
    mood: "Humeur",
    number: "Nombre",
    colour: "Couleur",
    bestMatch: "Meilleure affinité",
    skyBehind: "Le ciel derrière tout cela",
    fullSky: "Voir tout le ciel →",
    breadcrumbAriaLabel: "Fil d’Ariane de l’horoscope",
  },
  pt: {
    ...english,
    breadcrumbLabel: "Horóscopo",
    changeSign: "Mudar signo",
    signLabel: "signo",
    ruledByLabel: "regido por",
    periodsLabel: "Período da leitura",
    periods: [
      { id: "yesterday", label: "Ontem", overline: "Ontem" },
      { id: "today", label: "Hoje", overline: "Hoje" },
      { id: "tomorrow", label: "Amanhã", overline: "Amanhã" },
      { id: "week", label: "Esta semana", overline: "Esta semana" },
      { id: "month", label: "Este mês", overline: "Este mês" },
    ],
    themeLabels: ["Amor", "Trabalho e dinheiro", "Bem-estar"],
    browseSigns: "Explorar signos",
    dayGlance: "O dia num relance",
    ratingLabels: ["Energia", "Amor", "Foco", "Sorte"],
    luckyToday: "Sorte de hoje",
    mood: "Humor",
    number: "Número",
    colour: "Cor",
    bestMatch: "Melhor combinação",
    skyBehind: "O céu por trás disto",
    fullSky: "Ver o céu completo →",
    breadcrumbAriaLabel: "Navegação do horóscopo diário",
  },
  ru: {
    ...english,
    breadcrumbLabel: "Гороскоп",
    changeSign: "Сменить знак",
    signLabel: "стихия",
    ruledByLabel: "управитель",
    periodsLabel: "Период прогноза",
    periods: [
      { id: "yesterday", label: "Вчера", overline: "Вчера" },
      { id: "today", label: "Сегодня", overline: "Сегодня" },
      { id: "tomorrow", label: "Завтра", overline: "Завтра" },
      { id: "week", label: "Эта неделя", overline: "Эта неделя" },
      { id: "month", label: "Этот месяц", overline: "Этот месяц" },
    ],
    themeLabels: ["Любовь", "Работа и деньги", "Самочувствие"],
    browseSigns: "Другие знаки",
    dayGlance: "День одним взглядом",
    ratingLabels: ["Энергия", "Любовь", "Фокус", "Удача"],
    luckyToday: "Удача сегодня",
    mood: "Настрой",
    number: "Число",
    colour: "Цвет",
    bestMatch: "Лучшее сочетание",
    skyBehind: "Небо за этим прогнозом",
    fullSky: "Посмотреть всё небо →",
    breadcrumbAriaLabel: "Навигация по гороскопу",
  },
  it: {
    ...english,
    breadcrumbLabel: "Oroscopo",
    changeSign: "Cambia segno",
    signLabel: "segno",
    ruledByLabel: "governato da",
    periodsLabel: "Periodo della lettura",
    periods: [
      { id: "yesterday", label: "Ieri", overline: "Ieri" },
      { id: "today", label: "Oggi", overline: "Oggi" },
      { id: "tomorrow", label: "Domani", overline: "Domani" },
      { id: "week", label: "Questa settimana", overline: "Questa settimana" },
      { id: "month", label: "Questo mese", overline: "Questo mese" },
    ],
    themeLabels: ["Amore", "Lavoro e denaro", "Benessere"],
    browseSigns: "Esplora i segni",
    dayGlance: "La giornata in sintesi",
    ratingLabels: ["Energia", "Amore", "Concentrazione", "Fortuna"],
    luckyToday: "Fortuna di oggi",
    mood: "Umore",
    number: "Numero",
    colour: "Colore",
    bestMatch: "Migliore intesa",
    skyBehind: "Il cielo dietro tutto questo",
    fullSky: "Guarda il cielo completo →",
    breadcrumbAriaLabel: "Percorso dell’oroscopo",
  },
  de: {
    ...english,
    breadcrumbLabel: "Horoskop",
    changeSign: "Zeichen wechseln",
    signLabel: "Zeichen",
    ruledByLabel: "regiert von",
    periodsLabel: "Deutungszeitraum",
    periods: [
      { id: "yesterday", label: "Gestern", overline: "Gestern" },
      { id: "today", label: "Heute", overline: "Heute" },
      { id: "tomorrow", label: "Morgen", overline: "Morgen" },
      { id: "week", label: "Diese Woche", overline: "Diese Woche" },
      { id: "month", label: "Dieser Monat", overline: "Dieser Monat" },
    ],
    themeLabels: ["Liebe", "Arbeit und Geld", "Wohlbefinden"],
    browseSigns: "Zeichen ansehen",
    dayGlance: "Der Tag auf einen Blick",
    ratingLabels: ["Energie", "Liebe", "Fokus", "Glück"],
    luckyToday: "Glück heute",
    mood: "Stimmung",
    number: "Zahl",
    colour: "Farbe",
    bestMatch: "Beste Verbindung",
    skyBehind: "Der Himmel dahinter",
    fullSky: "Den ganzen Himmel ansehen →",
    breadcrumbAriaLabel: "Tageshoroskop-Navigation",
  },
};

export const getDailyHoroscopeReadingCopy = (
  locale: SupportedLocale,
): DailyHoroscopeReadingCopy => copyByLocale[locale] ?? english;

export const getDailyHoroscopeReadingDefaults = (
  locale: SupportedLocale,
): Record<string, string> => {
  const copy = getDailyHoroscopeReadingCopy(locale);

  return {
    reading_breadcrumb_label: copy.breadcrumbLabel,
    reading_change_sign: copy.changeSign,
    reading_sign_label: copy.signLabel,
    reading_ruled_by_label: copy.ruledByLabel,
    ...Object.fromEntries(
      copy.periods.map((period) => [
        `reading_period_${period.id}_label`,
        period.label,
      ]),
    ),
    reading_theme_1_label: copy.themeLabels[0],
    reading_theme_1_text: copy.themeTexts[0],
    reading_theme_2_label: copy.themeLabels[1],
    reading_theme_2_text: copy.themeTexts[1],
    reading_theme_3_label: copy.themeLabels[2],
    reading_theme_3_text: copy.themeTexts[2],
    reading_browse_signs: copy.browseSigns,
    reading_day_glance: copy.dayGlance,
    reading_rating_1_label: copy.ratingLabels[0],
    reading_rating_2_label: copy.ratingLabels[1],
    reading_rating_3_label: copy.ratingLabels[2],
    reading_rating_4_label: copy.ratingLabels[3],
    reading_lucky_today: copy.luckyToday,
    reading_mood_label: copy.mood,
    reading_number_label: copy.number,
    reading_colour_label: copy.colour,
    reading_best_match_label: copy.bestMatch,
    reading_sky_behind_label: copy.skyBehind,
    reading_full_sky_label: copy.fullSky,
  };
};
