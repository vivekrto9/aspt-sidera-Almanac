export type DailyHoroscopePeriodId =
  | "yesterday"
  | "today"
  | "tomorrow"
  | "week"
  | "month";

export type DailyHoroscopeFixture = {
  slug: string;
  ruler: string;
  keyword: string;
  headlines: Record<DailyHoroscopePeriodId, string>;
  ratings: [number, number, number, number];
  lucky: {
    mood: string;
    number: string;
    colorName: string;
    colorHex: string;
    matchSlug: string;
  };
  transits: [
    { glyph: string; title: string; note: string },
    { glyph: string; title: string; note: string },
  ];
};

const sharedHeadlines = {
  yesterday:
    "What felt like resistance was really a request to choose your direction more clearly.",
  today:
    "A quiet opening appears when you stop forcing the answer and notice what is already moving.",
  tomorrow:
    "Follow the conversation that leaves you more curious; it carries the next useful clue.",
  week:
    "This week rewards a steady rhythm, honest boundaries, and one promise you can truly keep.",
  month:
    "The month ahead turns patient effort into visible momentum, especially around work and belonging.",
} satisfies Record<DailyHoroscopePeriodId, string>;

const profiles = [
  ["aries", "Mars", "I begin", [5, 4, 4, 3], "Energised", "9", "Terracotta", "#b85f43", "leo"],
  ["taurus", "Venus", "I ground", [4, 4, 5, 3], "Steady", "6", "Moss", "#66745a", "virgo"],
  ["gemini", "Mercury", "I connect", [5, 4, 5, 4], "Curious", "5", "Saffron", "#c48b3c", "libra"],
  ["cancer", "Moon", "I nurture", [3, 5, 3, 4], "Tender", "2", "Sea glass", "#73958d", "pisces"],
  ["leo", "Sun", "I shine", [5, 5, 4, 4], "Radiant", "1", "Amber", "#c88636", "aries"],
  ["virgo", "Mercury", "I refine", [4, 3, 5, 4], "Focused", "4", "Sage", "#84906d", "taurus"],
  ["libra", "Venus", "I balance", [4, 5, 4, 4], "Open", "7", "Rose", "#bd7d78", "gemini"],
  ["scorpio", "Pluto", "I transform", [5, 4, 5, 3], "Intent", "8", "Burgundy", "#743f45", "cancer"],
  ["sagittarius", "Jupiter", "I explore", [5, 4, 3, 5], "Expansive", "3", "Ochre", "#b57a39", "aquarius"],
  ["capricorn", "Saturn", "I build", [4, 3, 5, 4], "Resolved", "10", "Umber", "#705447", "virgo"],
  ["aquarius", "Uranus", "I imagine", [4, 4, 5, 5], "Inventive", "11", "Teal", "#3f746f", "sagittarius"],
  ["pisces", "Neptune", "I feel", [3, 5, 4, 4], "Dreamy", "12", "Lavender", "#89779f", "cancer"],
] as const;

export const dailyHoroscopeFixtures: DailyHoroscopeFixture[] = profiles.map(
  ([slug, ruler, keyword, ratings, mood, number, colorName, colorHex, matchSlug], index) => ({
    slug,
    ruler,
    keyword,
    headlines: {
      ...sharedHeadlines,
      today: `${sharedHeadlines.today} ${keyword} becomes less a declaration and more a practical choice.`,
    },
    ratings: [...ratings],
    lucky: { mood, number, colorName, colorHex, matchSlug },
    transits: [
      {
        glyph: index % 2 === 0 ? "☿" : "♀",
        title: index % 2 === 0 ? "Mercury sextile Jupiter" : "Venus trine the Moon",
        note:
          index % 2 === 0
            ? "Perspective widens when you ask the better question."
            : "Warmth and honesty make connection easier to receive.",
      },
      {
        glyph: index % 3 === 0 ? "♄" : "☽",
        title: index % 3 === 0 ? "Saturn steadies Mars" : "The Moon changes signs",
        note:
          index % 3 === 0
            ? "Discipline gives today’s momentum a useful shape."
            : "The emotional weather softens as the day moves forward.",
      },
    ],
  }),
);

export const getDailyHoroscopeFixture = (slug: string) =>
  dailyHoroscopeFixtures.find((fixture) => fixture.slug === slug);
