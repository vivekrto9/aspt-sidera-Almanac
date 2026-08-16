import type { SupportedLocale } from "../../../localization-contract.ts";

export type AstrologerSessionSetupCopy = {
  backLabel: string;
  title: string;
  description: string;
  connectTitle: string;
  liveChat: string;
  liveChatDescription: string;
  voiceCall: string;
  voiceCallDescription: string;
  videoCall: string;
  videoCallDescription: string;
  writtenQuestion: string;
  writtenQuestionDescription: string;
  whenTitle: string;
  talkNow: string;
  talkNowDescription: string;
  scheduleLater: string;
  scheduleLaterDescription: string;
  chooseSlot: string;
  slotOne: string;
  slotTwo: string;
  slotThree: string;
  slotFour: string;
  slotFive: string;
  slotSix: string;
  sessionLength: string;
  durationFifteen: string;
  durationThirty: string;
  durationFortyFive: string;
  durationSixty: string;
  questionTitle: string;
  questionDescription: string;
  topicLove: string;
  topicCareer: string;
  topicTiming: string;
  topicLifePath: string;
  questionPlaceholder: string;
  chartShared: string;
  chartOwner: string;
  chartLabel: string;
  editChart: string;
  summaryLabel: string;
  sessionLabel: string;
  whenLabel: string;
  withinDayLabel: string;
  rateLabel: string;
  perMinuteLabel: string;
  flatRateLabel: string;
  estimatedLabel: string;
  totalLabel: string;
  freeMinutes: string;
  startNow: string;
  confirmBooking: string;
  sendQuestion: string;
  secureNote: string;
};

const en: AstrologerSessionSetupCopy = {
  backLabel: "Back to {name}’s profile",
  title: "Set up your session",
  description: "A few choices, then you’re connected with {name}.",
  connectTitle: "How do you want to connect?",
  liveChat: "Live chat",
  liveChatDescription: "Text in real time",
  voiceCall: "Voice call",
  voiceCallDescription: "Talk live, audio only",
  videoCall: "Video call",
  videoCallDescription: "Face to face, shared chart",
  writtenQuestion: "Written question",
  writtenQuestionDescription: "Reply within 24 hours",
  whenTitle: "When?",
  talkNow: "Talk now",
  talkNowDescription: "Connect as soon as they’re ready",
  scheduleLater: "Schedule for later",
  scheduleLaterDescription: "Pick a time that suits you",
  chooseSlot: "Choose a slot",
  slotOne: "Today 6:30 PM",
  slotTwo: "Today 8:00 PM",
  slotThree: "Tomorrow 11:00 AM",
  slotFour: "Tomorrow 4:30 PM",
  slotFive: "Thursday 7:00 PM",
  slotSix: "Friday 1:00 PM",
  sessionLength: "Session length",
  durationFifteen: "15 min",
  durationThirty: "30 min",
  durationFortyFive: "45 min",
  durationSixty: "60 min",
  questionTitle: "What’s on your mind?",
  questionDescription:
    "Optional — it helps {name} prepare. Or just start and see where it goes.",
  topicLove: "Love & relationships",
  topicCareer: "Career & money",
  topicTiming: "Timing a decision",
  topicLifePath: "Life direction",
  questionPlaceholder:
    "e.g. I’ve been offered a new role and I’m torn about the timing...",
  chartShared: "Your chart — shared with {name}",
  chartOwner: "Alex Rivera",
  chartLabel: "Leo Sun · Scorpio rising · Moon in Pisces",
  editChart: "Edit",
  summaryLabel: "Session summary",
  sessionLabel: "Session",
  whenLabel: "When",
  withinDayLabel: "Reply within 24h",
  rateLabel: "Rate",
  perMinuteLabel: "Per minute",
  flatRateLabel: "Flat rate",
  estimatedLabel: "Estimated",
  totalLabel: "Total",
  freeMinutes: "First 3 minutes free",
  startNow: "Start session now",
  confirmBooking: "Confirm booking",
  sendQuestion: "Send question",
  secureNote:
    "Secure · you’re only charged for time used. Cancel anytime with one tap.",
};

const translated = (
  overrides: Partial<AstrologerSessionSetupCopy>,
): AstrologerSessionSetupCopy => ({ ...en, ...overrides });

const copyByLocale: Record<SupportedLocale, AstrologerSessionSetupCopy> = {
  en,
  es: translated({
    backLabel: "Volver al perfil de {name}",
    title: "Configura tu sesión",
    description: "Unas pocas opciones y te conectarás con {name}.",
    connectTitle: "¿Cómo quieres conectar?",
    liveChat: "Chat en directo",
    voiceCall: "Llamada de voz",
    videoCall: "Videollamada",
    writtenQuestion: "Pregunta escrita",
    whenTitle: "¿Cuándo?",
    talkNow: "Hablar ahora",
    scheduleLater: "Programar para después",
    questionTitle: "¿Qué tienes en mente?",
    chartShared: "Tu carta, compartida con {name}",
    editChart: "Editar",
    summaryLabel: "Resumen de la sesión",
    sessionLabel: "Sesión",
    whenLabel: "Cuándo",
    withinDayLabel: "En 24 horas",
    rateLabel: "Tarifa",
    freeMinutes: "Los primeros 3 minutos son gratis",
    startNow: "Iniciar sesión ahora",
    sendQuestion: "Enviar pregunta escrita",
  }),
  fr: translated({
    backLabel: "Retour au profil de {name}",
    title: "Préparez votre consultation",
    description: "Quelques choix, puis vous serez en contact avec {name}.",
    connectTitle: "Comment souhaitez-vous échanger ?",
    liveChat: "Chat en direct",
    voiceCall: "Appel audio",
    videoCall: "Appel vidéo",
    writtenQuestion: "Question écrite",
    whenTitle: "Quand ?",
    talkNow: "Parler maintenant",
    scheduleLater: "Planifier plus tard",
    questionTitle: "Qu’avez-vous en tête ?",
    chartShared: "Votre thème — partagé avec {name}",
    editChart: "Modifier",
    summaryLabel: "Résumé de la consultation",
    sessionLabel: "Consultation",
    whenLabel: "Quand",
    withinDayLabel: "Sous 24 heures",
    rateLabel: "Tarif",
    freeMinutes: "Les 3 premières minutes sont offertes",
    startNow: "Commencer maintenant",
    sendQuestion: "Envoyer la question",
  }),
  pt: translated({
    backLabel: "Voltar ao perfil de {name}",
    title: "Configure sua sessão",
    connectTitle: "Como você quer se conectar?",
    whenTitle: "Quando?",
    talkNow: "Falar agora",
    scheduleLater: "Agendar para depois",
    questionTitle: "O que está em sua mente?",
    chartShared: "Seu mapa — compartilhado com {name}",
    editChart: "Editar",
    summaryLabel: "Resumo da sessão",
    sessionLabel: "Sessão",
    whenLabel: "Quando",
    rateLabel: "Tarifa",
    freeMinutes: "Os primeiros 3 minutos são grátis",
    startNow: "Iniciar sessão agora",
  }),
  ru: translated({
    backLabel: "Назад к профилю {name}",
    title: "Настройте консультацию",
    connectTitle: "Как вы хотите связаться?",
    liveChat: "Онлайн-чат",
    voiceCall: "Аудиозвонок",
    videoCall: "Видеозвонок",
    writtenQuestion: "Письменный вопрос",
    whenTitle: "Когда?",
    talkNow: "Поговорить сейчас",
    scheduleLater: "Запланировать",
    questionTitle: "Что вас волнует?",
    chartShared: "Ваша карта — доступна {name}",
    editChart: "Изменить",
    summaryLabel: "Детали консультации",
    sessionLabel: "Формат",
    whenLabel: "Когда",
    rateLabel: "Тариф",
    freeMinutes: "Первые 3 минуты бесплатно",
    startNow: "Начать консультацию",
  }),
  it: translated({
    backLabel: "Torna al profilo di {name}",
    title: "Configura la sessione",
    connectTitle: "Come vuoi collegarti?",
    whenTitle: "Quando?",
    talkNow: "Parla ora",
    scheduleLater: "Programma per dopo",
    questionTitle: "A cosa stai pensando?",
    chartShared: "Il tuo tema — condiviso con {name}",
    editChart: "Modifica",
    summaryLabel: "Riepilogo della sessione",
    sessionLabel: "Sessione",
    whenLabel: "Quando",
    rateLabel: "Tariffa",
    freeMinutes: "I primi 3 minuti sono gratis",
    startNow: "Avvia ora",
  }),
  de: translated({
    backLabel: "Zurück zu {name}s Profil",
    title: "Sitzung einrichten",
    connectTitle: "Wie möchtest du dich verbinden?",
    liveChat: "Live-Chat",
    voiceCall: "Sprachanruf",
    videoCall: "Videoanruf",
    writtenQuestion: "Schriftliche Frage",
    whenTitle: "Wann?",
    talkNow: "Jetzt sprechen",
    scheduleLater: "Für später planen",
    questionTitle: "Was beschäftigt dich?",
    chartShared: "Dein Horoskop — mit {name} geteilt",
    editChart: "Bearbeiten",
    summaryLabel: "Sitzungsübersicht",
    sessionLabel: "Sitzung",
    whenLabel: "Wann",
    rateLabel: "Tarif",
    freeMinutes: "Die ersten 3 Minuten sind kostenlos",
    startNow: "Sitzung jetzt starten",
  }),
};

export const getAstrologerSessionSetupCopy = (
  locale: SupportedLocale,
): AstrologerSessionSetupCopy => copyByLocale[locale] ?? copyByLocale.en;
