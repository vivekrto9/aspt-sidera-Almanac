import type { SupportedLocale } from "../../../localization-contract.ts";

export type AstrologerSessionSummaryCopy = {
  liveOverline: string;
  liveTitle: string;
  liveBody: string;
  bookedOverline: string;
  bookedTitle: string;
  bookedBody: string;
  sentOverline: string;
  sentTitle: string;
  sentBody: string;
  sessionTypeLabel: string;
  durationLabel: string;
  freeIntroLabel: string;
  freeIntroValue: string;
  billedAtLabel: string;
  whenLabel: string;
  lengthLabel: string;
  typeLabel: string;
  replyByLabel: string;
  chartLabel: string;
  sharedValue: string;
  totalChargedLabel: string;
  estimatedTotalLabel: string;
  ratingTitle: string;
  ratingAriaLabel: string;
  notePlaceholder: string;
  livePrimaryAction: string;
  bookedPrimaryAction: string;
  sentPrimaryAction: string;
  backAction: string;
  returnHome: string;
};

const en: AstrologerSessionSummaryCopy = {
  liveOverline: "Session complete",
  liveTitle: "That’s a wrap.",
  liveBody:
    "The full conversation is saved to your account. Here’s the breakdown — the first three minutes were on us.",
  bookedOverline: "Booking confirmed",
  bookedTitle: "You’re on the calendar.",
  bookedBody:
    "We’ve reserved your time with {name}. A reminder and a one-tap join link will land in your inbox.",
  sentOverline: "Question sent",
  sentTitle: "It’s on its way.",
  sentBody:
    "{name} will read your chart and reply in detail within 24 hours. We’ll notify you the moment it lands.",
  sessionTypeLabel: "Session type",
  durationLabel: "Duration",
  freeIntroLabel: "Free intro",
  freeIntroValue: "− 3:00",
  billedAtLabel: "Billed at",
  whenLabel: "When",
  lengthLabel: "Length",
  typeLabel: "Type",
  replyByLabel: "Reply by",
  chartLabel: "Your chart",
  sharedValue: "Shared",
  totalChargedLabel: "Total charged",
  estimatedTotalLabel: "Estimated total",
  ratingTitle: "How was your reading?",
  ratingAriaLabel: "Rate this reading",
  notePlaceholder: "Leave {name} a note (optional)",
  livePrimaryAction: "Book a follow-up",
  bookedPrimaryAction: "Add to calendar",
  sentPrimaryAction: "Ask another astrologer",
  backAction: "Back to astrologers",
  returnHome: "Return home",
};

const translated = (
  overrides: Partial<AstrologerSessionSummaryCopy>,
): AstrologerSessionSummaryCopy => ({
  ...en,
  ...overrides,
});

const copyByLocale: Record<SupportedLocale, AstrologerSessionSummaryCopy> = {
  en,
  es: translated({
    liveOverline: "Sesión finalizada",
    liveTitle: "Eso es todo.",
    bookedOverline: "Reserva confirmada",
    bookedTitle: "Ya está en el calendario.",
    sentOverline: "Pregunta enviada",
    sentTitle: "Ya está en camino.",
    sessionTypeLabel: "Tipo de sesión",
    durationLabel: "Duración",
    freeIntroLabel: "Introducción gratis",
    billedAtLabel: "Tarifa",
    whenLabel: "Cuándo",
    lengthLabel: "Duración",
    typeLabel: "Tipo",
    replyByLabel: "Respuesta antes de",
    chartLabel: "Tu carta",
    sharedValue: "Compartida",
    totalChargedLabel: "Total cobrado",
    estimatedTotalLabel: "Total estimado",
    ratingTitle: "¿Cómo fue tu lectura?",
    ratingAriaLabel: "Valora esta lectura",
    livePrimaryAction: "Reservar seguimiento",
    bookedPrimaryAction: "Añadir al calendario",
    sentPrimaryAction: "Preguntar a otro astrólogo",
    backAction: "Volver a astrólogos",
    returnHome: "Volver al inicio",
  }),
  fr: translated({
    liveOverline: "Session terminée",
    liveTitle: "C’est terminé.",
    bookedOverline: "Réservation confirmée",
    bookedTitle: "C’est dans votre agenda.",
    sentOverline: "Question envoyée",
    sentTitle: "Elle est en route.",
    sessionTypeLabel: "Type de session",
    durationLabel: "Durée",
    freeIntroLabel: "Introduction offerte",
    billedAtLabel: "Tarif",
    whenLabel: "Quand",
    lengthLabel: "Durée",
    typeLabel: "Type",
    replyByLabel: "Réponse sous",
    chartLabel: "Votre thème",
    sharedValue: "Partagé",
    totalChargedLabel: "Total facturé",
    estimatedTotalLabel: "Total estimé",
    ratingTitle: "Comment s’est passée votre consultation ?",
    ratingAriaLabel: "Noter cette consultation",
    livePrimaryAction: "Réserver un suivi",
    bookedPrimaryAction: "Ajouter au calendrier",
    sentPrimaryAction: "Consulter un autre astrologue",
    backAction: "Retour aux astrologues",
    returnHome: "Retour à l’accueil",
  }),
  pt: translated({
    liveOverline: "Sessão concluída",
    liveTitle: "Terminamos por aqui.",
    bookedOverline: "Reserva confirmada",
    bookedTitle: "Está no seu calendário.",
    sentOverline: "Pergunta enviada",
    sentTitle: "Já está a caminho.",
    sessionTypeLabel: "Tipo de sessão",
    durationLabel: "Duração",
    freeIntroLabel: "Introdução grátis",
    billedAtLabel: "Cobrado a",
    whenLabel: "Quando",
    lengthLabel: "Duração",
    typeLabel: "Tipo",
    replyByLabel: "Resposta em",
    chartLabel: "Seu mapa",
    sharedValue: "Compartilhado",
    totalChargedLabel: "Total cobrado",
    estimatedTotalLabel: "Total estimado",
    ratingTitle: "Como foi sua leitura?",
    ratingAriaLabel: "Avaliar esta leitura",
    livePrimaryAction: "Agendar retorno",
    bookedPrimaryAction: "Adicionar ao calendário",
    sentPrimaryAction: "Perguntar a outro astrólogo",
    backAction: "Voltar aos astrólogos",
    returnHome: "Voltar ao início",
  }),
  ru: translated({
    liveOverline: "Консультация завершена",
    liveTitle: "На этом всё.",
    bookedOverline: "Запись подтверждена",
    bookedTitle: "Встреча в календаре.",
    sentOverline: "Вопрос отправлен",
    sentTitle: "Он уже в пути.",
    sessionTypeLabel: "Тип консультации",
    durationLabel: "Продолжительность",
    freeIntroLabel: "Бесплатное вступление",
    billedAtLabel: "Тариф",
    whenLabel: "Когда",
    lengthLabel: "Длительность",
    typeLabel: "Тип",
    replyByLabel: "Ответ в течение",
    chartLabel: "Ваша карта",
    sharedValue: "Передана",
    totalChargedLabel: "Списано всего",
    estimatedTotalLabel: "Ориентировочная сумма",
    ratingTitle: "Как прошла консультация?",
    ratingAriaLabel: "Оценить консультацию",
    livePrimaryAction: "Записаться повторно",
    bookedPrimaryAction: "Добавить в календарь",
    sentPrimaryAction: "Спросить другого астролога",
    backAction: "Назад к астрологам",
    returnHome: "На главную",
  }),
  it: translated({
    liveOverline: "Sessione completata",
    liveTitle: "È tutto.",
    bookedOverline: "Prenotazione confermata",
    bookedTitle: "È nel tuo calendario.",
    sentOverline: "Domanda inviata",
    sentTitle: "È già in viaggio.",
    sessionTypeLabel: "Tipo di sessione",
    durationLabel: "Durata",
    freeIntroLabel: "Introduzione gratuita",
    billedAtLabel: "Tariffa",
    whenLabel: "Quando",
    lengthLabel: "Durata",
    typeLabel: "Tipo",
    replyByLabel: "Risposta entro",
    chartLabel: "Il tuo tema",
    sharedValue: "Condiviso",
    totalChargedLabel: "Totale addebitato",
    estimatedTotalLabel: "Totale stimato",
    ratingTitle: "Com’è andata la lettura?",
    ratingAriaLabel: "Valuta questa lettura",
    livePrimaryAction: "Prenota un seguito",
    bookedPrimaryAction: "Aggiungi al calendario",
    sentPrimaryAction: "Chiedi a un altro astrologo",
    backAction: "Torna agli astrologi",
    returnHome: "Torna alla home",
  }),
  de: translated({
    liveOverline: "Sitzung abgeschlossen",
    liveTitle: "Das war’s.",
    bookedOverline: "Buchung bestätigt",
    bookedTitle: "Der Termin steht.",
    sentOverline: "Frage gesendet",
    sentTitle: "Sie ist unterwegs.",
    sessionTypeLabel: "Sitzungsart",
    durationLabel: "Dauer",
    freeIntroLabel: "Kostenlose Einführung",
    billedAtLabel: "Tarif",
    whenLabel: "Wann",
    lengthLabel: "Länge",
    typeLabel: "Art",
    replyByLabel: "Antwort innerhalb",
    chartLabel: "Dein Horoskop",
    sharedValue: "Geteilt",
    totalChargedLabel: "Gesamtbetrag",
    estimatedTotalLabel: "Geschätzter Gesamtbetrag",
    ratingTitle: "Wie war deine Beratung?",
    ratingAriaLabel: "Beratung bewerten",
    livePrimaryAction: "Folgetermin buchen",
    bookedPrimaryAction: "Zum Kalender hinzufügen",
    sentPrimaryAction: "Anderen Astrologen fragen",
    backAction: "Zurück zu Astrologen",
    returnHome: "Zur Startseite",
  }),
};

export const getAstrologerSessionSummaryCopy = (
  locale: SupportedLocale,
): AstrologerSessionSummaryCopy => copyByLocale[locale] ?? copyByLocale.en;
