export type AstrologerAvailability = "online" | "busy" | "offline";
export type AstrologerSpecialty =
  | "love"
  | "career"
  | "life-path"
  | "timing"
  | "spiritual";
export type AstrologerChatProfileType = "KUNDLI" | "MATCHING";

export type BrowseAstrologer = {
  slug: string;
  imageUrl: string;
  name: string;
  tradition: string;
  rating: number;
  reviews: number;
  rate: number;
  availability: AstrologerAvailability;
  categories: AstrologerSpecialty[];
  specialties: string[];
  description: string;
  yearsReading: number;
  sessions: number;
  languages: number;
  biography: string;
  chatProfileType: AstrologerChatProfileType;
};

export const browseAstrologers: BrowseAstrologer[] = [
  {
    slug: "orion-hale",
    imageUrl: "",
    name: "Orion Hale",
    tradition: "Western · Natal charts",
    rating: 4.9,
    reviews: 2480,
    rate: 10,
    availability: "online",
    categories: ["career", "timing", "life-path"],
    specialties: [
      "Birth-chart analysis",
      "Transit and progression timing",
      "Career and relationship questions",
    ],
    description:
      "Traditional Western astrologer focused on the natal chart, transits, progressions, and grounded, actionable guidance.",
    yearsReading: 18,
    sessions: 38200,
    languages: 1,
    biography:
      "Guides you through your natal chart, current transits, and practical direction for career, relationships, and timing.",
    chatProfileType: "KUNDLI",
  },
  {
    slug: "selene-marlowe",
    imageUrl: "",
    name: "Selene Marlowe",
    tradition: "Western · Synastry",
    rating: 4.8,
    reviews: 982,
    rate: 5,
    availability: "online",
    categories: ["love", "timing"],
    specialties: [
      "Synastry chart reading",
      "Composite chart themes",
      "Relationship timing",
    ],
    description:
      "Western astrologer reading synastry, composite charts, and relationship timing with warmth and clear, practical guidance.",
    yearsReading: 15,
    sessions: 3200,
    languages: 1,
    biography:
      "I read two natal charts together — Sun, Moon, Venus, Mars, and the houses — to explain emotional rhythm, attraction, communication, and the growth edge between two people.",
    chatProfileType: "MATCHING",
  },
];
