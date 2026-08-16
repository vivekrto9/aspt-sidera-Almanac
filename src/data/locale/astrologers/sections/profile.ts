import type { SupportedLocale } from "../../../localization-contract.ts";

export type AstrologerProfileCopy = {
  backLabel: string;
  yearsReading: string;
  sessions: string;
  languages: string;
  about: string;
  specialties: string;
  whatToExpect: string;
  expectationOne: string;
  expectationTwo: string;
  expectationThree: string;
  expectationFour: string;
  recentReviews: string;
  average: string;
  reviewsSuffix: string;
  rateUnit: string;
  talkNow: string;
  bookNextSlot: string;
  schedule: string;
  checkReviews: string;
  freeMinutesNote: string;
  chartReady: string;
  chartOwner: string;
  chartLabel: string;
  reviewOneDate: string;
  reviewOneText: string;
  reviewTwoDate: string;
  reviewTwoText: string;
  reviewThreeDate: string;
  reviewThreeText: string;
};

const en: AstrologerProfileCopy = {
  backLabel: "All astrologers",
  yearsReading: "years reading",
  sessions: "sessions",
  languages: "languages",
  about: "About",
  specialties: "Specialties",
  whatToExpect: "What to expect",
  expectationOne: "A grounded, jargon-free reading",
  expectationTwo: "Your specific questions answered",
  expectationThree: "Honest about challenges and gifts alike",
  expectationFour: "Something actionable to take away",
  recentReviews: "Recent reviews",
  average: "average",
  reviewsSuffix: "reviews",
  rateUnit: "/question",
  talkNow: "Chat now",
  bookNextSlot: "Book next slot",
  schedule: "Schedule",
  checkReviews: "Check reviews",
  freeMinutesNote:
    "Your wallet is charged only after {name} returns an answer.",
  chartReady: "Your chart is ready",
  chartOwner: "Alex Rivera",
  chartLabel: "Leo Sun · Scorpio rising · Moon in Pisces",
  reviewOneDate: "2 days ago",
  reviewOneText:
    "Genuinely blown away. They picked up on exactly what I’d been circling for months and gave me a concrete way forward. Worth every minute.",
  reviewTwoDate: "1 week ago",
  reviewTwoText:
    "Calm, kind, and scary-accurate about the timing. I’ve already booked a follow-up for after my Saturn return.",
  reviewThreeDate: "2 weeks ago",
  reviewThreeText:
    "No fluff, no cold-reading — just a clear, useful read of my chart. Left feeling lighter and with an actual plan.",
};

const translated = (
  overrides: Partial<AstrologerProfileCopy>,
): AstrologerProfileCopy => ({ ...en, ...overrides });

const copyByLocale: Record<SupportedLocale, AstrologerProfileCopy> = {
  en,
  es: translated({
    backLabel: "Todos los astrólogos",
    yearsReading: "años leyendo",
    sessions: "sesiones",
    languages: "idiomas",
    about: "Acerca de",
    specialties: "Especialidades",
    whatToExpect: "Qué esperar",
    recentReviews: "Reseñas recientes",
    average: "de media",
    reviewsSuffix: "reseñas",
    rateUnit: "/pregunta",
    talkNow: "Chatear ahora",
    bookNextSlot: "Reservar próximo horario",
    schedule: "Programar",
    checkReviews: "Ver reseñas",
    freeMinutesNote:
      "Tu cartera se cobra solo cuando {name} responde.",
    chartReady: "Tu carta está lista",
  }),
  fr: translated({
    backLabel: "Tous les astrologues",
    yearsReading: "ans de pratique",
    sessions: "consultations",
    languages: "langues",
    about: "À propos",
    specialties: "Spécialités",
    whatToExpect: "À quoi s’attendre",
    recentReviews: "Avis récents",
    average: "de moyenne",
    reviewsSuffix: "avis",
    rateUnit: "/question",
    talkNow: "Discuter maintenant",
    bookNextSlot: "Réserver le prochain créneau",
    schedule: "Planifier",
    checkReviews: "Voir les avis",
    freeMinutesNote:
      "Votre portefeuille est débité uniquement après la réponse de {name}.",
    chartReady: "Votre thème est prêt",
  }),
  pt: translated({
    backLabel: "Todos os astrólogos",
    yearsReading: "anos de leitura",
    sessions: "sessões",
    languages: "idiomas",
    about: "Sobre",
    specialties: "Especialidades",
    whatToExpect: "O que esperar",
    recentReviews: "Avaliações recentes",
    average: "de média",
    reviewsSuffix: "avaliações",
    rateUnit: "/pergunta",
    talkNow: "Conversar agora",
    bookNextSlot: "Reservar próximo horário",
    schedule: "Agendar",
    checkReviews: "Ver avaliações",
    freeMinutesNote:
      "Sua carteira só é cobrada quando {name} responde.",
    chartReady: "Seu mapa está pronto",
  }),
  ru: translated({
    backLabel: "Все астрологи",
    yearsReading: "лет практики",
    sessions: "консультаций",
    languages: "языка",
    about: "Об астрологе",
    specialties: "Специализации",
    whatToExpect: "Что ожидать",
    recentReviews: "Недавние отзывы",
    average: "средняя оценка",
    reviewsSuffix: "отзывов",
    rateUnit: "/вопрос",
    talkNow: "Начать чат",
    bookNextSlot: "Забронировать время",
    schedule: "Запланировать",
    checkReviews: "Посмотреть отзывы",
    freeMinutesNote:
      "Списание происходит только после ответа от {name}.",
    chartReady: "Ваша карта готова",
  }),
  it: translated({
    backLabel: "Tutti gli astrologi",
    yearsReading: "anni di letture",
    sessions: "consulti",
    languages: "lingue",
    about: "Chi sono",
    specialties: "Specialità",
    whatToExpect: "Cosa aspettarsi",
    recentReviews: "Recensioni recenti",
    average: "di media",
    reviewsSuffix: "recensioni",
    rateUnit: "/domanda",
    talkNow: "Chatta ora",
    bookNextSlot: "Prenota il prossimo orario",
    schedule: "Programma",
    checkReviews: "Vedi recensioni",
    freeMinutesNote:
      "Il portafoglio viene addebitato solo dopo la risposta di {name}.",
    chartReady: "Il tuo tema è pronto",
  }),
  de: translated({
    backLabel: "Alle Astrologen",
    yearsReading: "Jahre Erfahrung",
    sessions: "Sitzungen",
    languages: "Sprachen",
    about: "Über",
    specialties: "Fachgebiete",
    whatToExpect: "Was dich erwartet",
    recentReviews: "Aktuelle Bewertungen",
    average: "im Durchschnitt",
    reviewsSuffix: "Bewertungen",
    rateUnit: "/Frage",
    talkNow: "Jetzt chatten",
    bookNextSlot: "Nächsten Termin buchen",
    schedule: "Planen",
    checkReviews: "Bewertungen ansehen",
    freeMinutesNote:
      "Dein Wallet wird erst nach der Antwort von {name} belastet.",
    chartReady: "Dein Horoskop ist bereit",
  }),
};

export const getAstrologerProfileCopy = (
  locale: SupportedLocale,
): AstrologerProfileCopy => copyByLocale[locale] ?? copyByLocale.en;
