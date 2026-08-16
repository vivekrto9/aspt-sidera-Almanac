import type { SupportedLocale } from "../localization-contract.ts";
import type { CustomerUserProfile } from "../../server/aggregator/customer-profiles.ts";

export type TrackedPersonRecord = {
  id: string;
  name: string;
  signs: string;
  isOwnProfile: boolean;
  birthChart: {
    href: string;
    rotation: number;
    planets: Array<{
      glyph: string;
      longitude: number;
      label: string;
      color: string;
    }>;
  } | null;
  generateBirthChartHref: string;
};

type RuntimeBirthChartReading = {
  id: string;
  profileId: string;
  generatedAt: string;
  chart: {
    chartRotation?: number;
    planets: Array<{
      glyph: string;
      longitude: number;
      name: string;
      color: string;
    }>;
  };
};

const localizedBirthChartHref = (
  locale: SupportedLocale,
  suffix = "",
  profileId?: string,
) => {
  const parameters = new URLSearchParams();
  if (profileId) parameters.set("profileId", profileId);
  if (locale !== "en") parameters.set("locale", locale);
  const query = parameters.toString();
  return `/birth-chart${suffix}${query ? `?${query}` : ""}`;
};

const signLabels: Record<SupportedLocale, readonly string[]> = {
  en: [
    "Aquarius · Taurus rising",
    "Taurus · Leo rising",
    "Gemini · Virgo rising",
    "Cancer · Pisces rising",
    "Leo · Scorpio rising",
    "Virgo · Capricorn rising",
    "Libra · Gemini rising",
    "Scorpio · Aries rising",
    "Sagittarius · Libra rising",
  ],
  es: [
    "Acuario · asc. Tauro",
    "Tauro · asc. Leo",
    "Géminis · asc. Virgo",
    "Cáncer · asc. Piscis",
    "Leo · asc. Escorpio",
    "Virgo · asc. Capricornio",
    "Libra · asc. Géminis",
    "Escorpio · asc. Aries",
    "Sagitario · asc. Libra",
  ],
  fr: [
    "Verseau · asc. Taureau",
    "Taureau · asc. Lion",
    "Gémeaux · asc. Vierge",
    "Cancer · asc. Poissons",
    "Lion · asc. Scorpion",
    "Vierge · asc. Capricorne",
    "Balance · asc. Gémeaux",
    "Scorpion · asc. Bélier",
    "Sagittaire · asc. Balance",
  ],
  pt: [
    "Aquário · asc. Touro",
    "Touro · asc. Leão",
    "Gêmeos · asc. Virgem",
    "Câncer · asc. Peixes",
    "Leão · asc. Escorpião",
    "Virgem · asc. Capricórnio",
    "Libra · asc. Gêmeos",
    "Escorpião · asc. Áries",
    "Sagitário · asc. Libra",
  ],
  ru: [
    "Водолей · асц. Телец",
    "Телец · асц. Лев",
    "Близнецы · асц. Дева",
    "Рак · асц. Рыбы",
    "Лев · асц. Скорпион",
    "Дева · асц. Козерог",
    "Весы · асц. Близнецы",
    "Скорпион · асц. Овен",
    "Стрелец · асц. Весы",
  ],
  it: [
    "Acquario · asc. Toro",
    "Toro · asc. Leone",
    "Gemelli · asc. Vergine",
    "Cancro · asc. Pesci",
    "Leone · asc. Scorpione",
    "Vergine · asc. Capricorno",
    "Bilancia · asc. Gemelli",
    "Scorpione · asc. Ariete",
    "Sagittario · asc. Bilancia",
  ],
  de: [
    "Wassermann · Asz. Stier",
    "Stier · Asz. Löwe",
    "Zwillinge · Asz. Jungfrau",
    "Krebs · Asz. Fische",
    "Löwe · Asz. Skorpion",
    "Jungfrau · Asz. Steinbock",
    "Waage · Asz. Zwillinge",
    "Skorpion · Asz. Widder",
    "Schütze · Asz. Waage",
  ],
};

const people = [
  { id: "devin-r", name: "Devin R.", isOwnProfile: true },
  { id: "sam-k", name: "Sam K.", isOwnProfile: false },
  { id: "noor-a", name: "Noor A.", isOwnProfile: false },
  { id: "eli-m", name: "Eli M.", isOwnProfile: false },
  { id: "mira-s", name: "Mira S.", isOwnProfile: false },
  { id: "theo-j", name: "Theo J.", isOwnProfile: false },
  { id: "aisha-p", name: "Aisha P.", isOwnProfile: false },
  { id: "luca-m", name: "Luca M.", isOwnProfile: false },
  { id: "hana-t", name: "Hana T.", isOwnProfile: false },
] as const;

export const prepareAccountPeople = (
  locale: SupportedLocale,
): TrackedPersonRecord[] =>
  people.map((person, index) => ({
    ...person,
    signs: signLabels[locale][index],
    birthChart: null,
    generateBirthChartHref: localizedBirthChartHref(locale),
  }));

export const prepareAccountPeopleFromProfiles = (
  profiles: CustomerUserProfile[],
  locale: SupportedLocale,
  readings: readonly RuntimeBirthChartReading[] = [],
): TrackedPersonRecord[] =>
  profiles.map((profile) => {
    const date = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(`${profile.birthDate}T00:00:00Z`));
    const reading = readings.find(
      (item) =>
        item.profileId === profile.id &&
        (profile.createdAt === profile.updatedAt ||
          Date.parse(item.generatedAt) >= Date.parse(profile.updatedAt)),
    );
    return {
      id: profile.id,
      name: profile.profileName,
      signs: `${date} · ${profile.birthPlace}`,
      isOwnProfile: profile.isDefault,
      birthChart: reading
        ? {
            href: localizedBirthChartHref(
              locale,
              `/${encodeURIComponent(reading.id)}`,
            ),
            rotation: reading.chart.chartRotation || 0,
            planets: reading.chart.planets.map((planet) => ({
              glyph: planet.glyph,
              longitude: planet.longitude,
              label: planet.name,
              color: planet.color,
            })),
          }
        : null,
      generateBirthChartHref: localizedBirthChartHref(locale, "", profile.id),
    };
  });
