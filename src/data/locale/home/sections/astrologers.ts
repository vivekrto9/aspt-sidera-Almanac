import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeAstrologerProfile = {
  slug?: string;
  imageUrl?: string;
  href?: string;
  name: string;
  tradition: string;
  ratingValue: number;
  ratingText: string;
  ratingAriaLabel: string;
  availability: "online" | "offline";
  availabilityLabel: string;
  rateText: string;
  rateUnit: string;
  actionLabel: string;
};

export type HomeAstrologersCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  browseLabel: string;
  profiles: HomeAstrologerProfile[];
};

const names = [
  "Mara Ellison",
  "Devin Roy",
  "Yuki Tanaka",
  "Priya Nair",
] as const;
const ratings = [4.9, 4.8, 5, 4.9] as const;
const rates = ["$3.20", "$2.80", "$4.10", "$3.00"] as const;
const availability = ["online", "online", "offline", "online"] as const;

const profileSet = (
  traditions: string[],
  onlineLabel: string,
  offlineLabel: string,
  onlineAction: string,
  offlineAction: string,
  rateUnit: string,
  ratingLabel: (name: string, rating: string) => string,
): HomeAstrologerProfile[] =>
  names.map((name, index) => {
    const state = availability[index];
    const ratingText = ratings[index].toFixed(1);
    return {
      name,
      tradition: traditions[index],
      ratingValue: ratings[index],
      ratingText,
      ratingAriaLabel: ratingLabel(name, ratingText),
      availability: state,
      availabilityLabel: state === "online" ? onlineLabel : offlineLabel,
      rateText: rates[index],
      rateUnit,
      actionLabel: state === "online" ? onlineAction : offlineAction,
    };
  });

const copies: Record<SupportedLocale, HomeAstrologersCopy> = {
  en: {
    eyebrow: "Live Readings",
    titleAccent: "Talk",
    titleRest: "to an astrologer.",
    browseLabel: "Browse all 40+",
    profiles: profileSet(
      [
        "Vedic · Relationships",
        "Hellenistic · Career",
        "Psychological · Transits",
        "Horary · Timing",
      ],
      "Online",
      "Offline",
      "Chat now",
      "Book a slot",
      "/min",
      (name, rating) => `${name} is rated ${rating} out of 5`,
    ),
  },
  es: {
    eyebrow: "Lecturas en directo",
    titleAccent: "Habla",
    titleRest: "con un astrólogo.",
    browseLabel: "Ver los más de 40",
    profiles: profileSet(
      [
        "Védica · Relaciones",
        "Helenística · Carrera",
        "Psicológica · Tránsitos",
        "Horaria · Tiempos",
      ],
      "En línea",
      "Desconectado",
      "Chatear ahora",
      "Reservar horario",
      "/min",
      (name, rating) => `${name} tiene ${rating} de 5`,
    ),
  },
  fr: {
    eyebrow: "Consultations en direct",
    titleAccent: "Parlez",
    titleRest: "à un astrologue.",
    browseLabel: "Voir les 40+ profils",
    profiles: profileSet(
      [
        "Védique · Relations",
        "Hellénistique · Carrière",
        "Psychologique · Transits",
        "Horaire · Timing",
      ],
      "En ligne",
      "Hors ligne",
      "Discuter",
      "Réserver",
      "/min",
      (name, rating) => `${name} est noté ${rating} sur 5`,
    ),
  },
  pt: {
    eyebrow: "Leituras ao vivo",
    titleAccent: "Fale",
    titleRest: "com um astrólogo.",
    browseLabel: "Ver todos os 40+",
    profiles: profileSet(
      [
        "Védica · Relacionamentos",
        "Helenística · Carreira",
        "Psicológica · Trânsitos",
        "Horária · Timing",
      ],
      "Online",
      "Offline",
      "Conversar agora",
      "Reservar horário",
      "/min",
      (name, rating) => `${name} tem nota ${rating} de 5`,
    ),
  },
  ru: {
    eyebrow: "Живые консультации",
    titleAccent: "Поговорите",
    titleRest: "с астрологом.",
    browseLabel: "Все 40+ астрологов",
    profiles: profileSet(
      [
        "Ведическая · Отношения",
        "Эллинистическая · Карьера",
        "Психологическая · Транзиты",
        "Хорарная · Выбор времени",
      ],
      "В сети",
      "Не в сети",
      "Начать чат",
      "Забронировать",
      "/мин",
      (name, rating) => `Рейтинг ${name}: ${rating} из 5`,
    ),
  },
  it: {
    eyebrow: "Consulti dal vivo",
    titleAccent: "Parla",
    titleRest: "con un astrologo.",
    browseLabel: "Scopri tutti i 40+",
    profiles: profileSet(
      [
        "Vedica · Relazioni",
        "Ellenistica · Carriera",
        "Psicologica · Transiti",
        "Oraria · Tempismo",
      ],
      "Online",
      "Offline",
      "Chatta ora",
      "Prenota",
      "/min",
      (name, rating) => `${name} ha una valutazione di ${rating} su 5`,
    ),
  },
  de: {
    eyebrow: "Live-Beratungen",
    titleAccent: "Sprich",
    titleRest: "mit einem Astrologen.",
    browseLabel: "Alle 40+ ansehen",
    profiles: profileSet(
      [
        "Vedisch · Beziehungen",
        "Hellenistisch · Karriere",
        "Psychologisch · Transite",
        "Stundenastrologie · Timing",
      ],
      "Online",
      "Offline",
      "Jetzt chatten",
      "Termin buchen",
      "/Min.",
      (name, rating) => `${name} ist mit ${rating} von 5 bewertet`,
    ),
  },
};

export const getHomeAstrologersCopy = (
  locale: SupportedLocale,
): HomeAstrologersCopy => copies[locale] ?? copies.en;
