import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountOverviewCopy = {
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  newChartLabel: string;
  stats: readonly [string, string, string, string];
  skyEyebrow: string;
  sunLabel: string;
  moonLabel: string;
  mercuryLabel: string;
  skyInsight: string;
  skyActionLabel: string;
  skyEmptyTitle: string;
  skyEmptyDescription: string;
  skyEmptyActionLabel: string;
  sessionEyebrow: string;
  sessionTiming: string;
  sessionTopicPrefix: string;
  sessionActionLabel: string;
  sessionEmptyTitle: string;
  sessionEmptyDescription: string;
  sessionEmptyActionLabel: string;
};

const copy: Record<SupportedLocale, AccountOverviewCopy> = {
  en: {
    greetingMorning: "Good morning",
    greetingAfternoon: "Good afternoon",
    greetingEvening: "Good evening",
    newChartLabel: "New chart",
    stats: [
      "Saved charts",
      "People tracked",
      "Reports owned",
      "Session credits",
    ],
    skyEyebrow: "Your sky today",
    sunLabel: "Sun",
    moonLabel: "Moon",
    mercuryLabel: "Mercury",
    skyInsight: "Live Sun, Moon, and Mercury positions calculated for today.",
    skyActionLabel: "Open today's sky",
    skyEmptyTitle: "Add your birth details",
    skyEmptyDescription:
      "Create a birth profile to unlock your current sky and personalized transits.",
    skyEmptyActionLabel: "+ Add birth details",
    sessionEyebrow: "Upcoming session",
    sessionTiming: "In 2 days · Fri, 7:00 PM",
    sessionTopicPrefix: "Duration",
    sessionActionLabel: "Join session",
    sessionEmptyTitle: "No upcoming session",
    sessionEmptyDescription:
      "Book a reading with an astrologer and your next confirmed appointment will appear here.",
    sessionEmptyActionLabel: "Book a session",
  },
  es: {
    greetingMorning: "Buenos días",
    greetingAfternoon: "Buenas tardes",
    greetingEvening: "Buenas noches",
    newChartLabel: "Nueva carta",
    stats: [
      "Cartas guardadas",
      "Personas seguidas",
      "Informes adquiridos",
      "Créditos de sesión",
    ],
    skyEyebrow: "Tu cielo de hoy",
    sunLabel: "Sol",
    moonLabel: "Luna",
    mercuryLabel: "Mercurio",
    skyInsight:
      "Posiciones en vivo del Sol, la Luna y Mercurio calculadas para hoy.",
    skyActionLabel: "Abrir el cielo de hoy",
    skyEmptyTitle: "Añade tus datos de nacimiento",
    skyEmptyDescription:
      "Crea un perfil natal para desbloquear tu cielo actual y tránsitos personalizados.",
    skyEmptyActionLabel: "+ Añadir datos de nacimiento",
    sessionEyebrow: "Próxima sesión",
    sessionTiming: "En 2 días · Vie, 19:00",
    sessionTopicPrefix: "Duración",
    sessionActionLabel: "Unirse a la sesión",
    sessionEmptyTitle: "No hay sesiones próximas",
    sessionEmptyDescription:
      "Reserva una lectura con un astrólogo y tu próxima cita confirmada aparecerá aquí.",
    sessionEmptyActionLabel: "Reservar una sesión",
  },
  fr: {
    greetingMorning: "Bonjour",
    greetingAfternoon: "Bon après-midi",
    greetingEvening: "Bonsoir",
    newChartLabel: "Nouveau thème",
    stats: [
      "Thèmes enregistrés",
      "Personnes suivies",
      "Rapports acquis",
      "Crédits de séance",
    ],
    skyEyebrow: "Votre ciel aujourd’hui",
    sunLabel: "Soleil",
    moonLabel: "Lune",
    mercuryLabel: "Mercure",
    skyInsight:
      "Positions en direct du Soleil, de la Lune et de Mercure calculées pour aujourd’hui.",
    skyActionLabel: "Ouvrir le ciel du jour",
    skyEmptyTitle: "Ajoutez vos informations de naissance",
    skyEmptyDescription:
      "Créez un profil natal pour accéder à votre ciel actuel et à vos transits personnalisés.",
    skyEmptyActionLabel: "+ Ajouter les informations",
    sessionEyebrow: "Prochaine séance",
    sessionTiming: "Dans 2 jours · Ven, 19 h",
    sessionTopicPrefix: "Durée",
    sessionActionLabel: "Rejoindre la séance",
    sessionEmptyTitle: "Aucune séance à venir",
    sessionEmptyDescription:
      "Réservez une consultation avec un astrologue et votre prochain rendez-vous confirmé apparaîtra ici.",
    sessionEmptyActionLabel: "Réserver une séance",
  },
  pt: {
    greetingMorning: "Bom dia",
    greetingAfternoon: "Boa tarde",
    greetingEvening: "Boa noite",
    newChartLabel: "Novo mapa",
    stats: [
      "Mapas salvos",
      "Pessoas acompanhadas",
      "Relatórios adquiridos",
      "Créditos de sessão",
    ],
    skyEyebrow: "Seu céu hoje",
    sunLabel: "Sol",
    moonLabel: "Lua",
    mercuryLabel: "Mercúrio",
    skyInsight:
      "Posições ao vivo do Sol, da Lua e de Mercúrio calculadas para hoje.",
    skyActionLabel: "Abrir o céu de hoje",
    skyEmptyTitle: "Adicione seus dados de nascimento",
    skyEmptyDescription:
      "Crie um perfil natal para acessar seu céu atual e trânsitos personalizados.",
    skyEmptyActionLabel: "+ Adicionar dados de nascimento",
    sessionEyebrow: "Próxima sessão",
    sessionTiming: "Em 2 dias · Sex, 19:00",
    sessionTopicPrefix: "Duração",
    sessionActionLabel: "Entrar na sessão",
    sessionEmptyTitle: "Nenhuma sessão futura",
    sessionEmptyDescription:
      "Agende uma leitura com um astrólogo e seu próximo compromisso confirmado aparecerá aqui.",
    sessionEmptyActionLabel: "Agendar uma sessão",
  },
  ru: {
    greetingMorning: "Доброе утро",
    greetingAfternoon: "Добрый день",
    greetingEvening: "Добрый вечер",
    newChartLabel: "Новая карта",
    stats: [
      "Сохранённые карты",
      "Отслеживаемые люди",
      "Купленные отчёты",
      "Кредиты сессий",
    ],
    skyEyebrow: "Ваше небо сегодня",
    sunLabel: "Солнце",
    moonLabel: "Луна",
    mercuryLabel: "Меркурий",
    skyInsight:
      "Текущие положения Солнца, Луны и Меркурия, рассчитанные на сегодня.",
    skyActionLabel: "Открыть небо сегодня",
    skyEmptyTitle: "Добавьте данные о рождении",
    skyEmptyDescription:
      "Создайте натальный профиль, чтобы открыть текущее небо и персональные транзиты.",
    skyEmptyActionLabel: "+ Добавить данные",
    sessionEyebrow: "Предстоящая сессия",
    sessionTiming: "Через 2 дня · Пт, 19:00",
    sessionTopicPrefix: "Длительность",
    sessionActionLabel: "Присоединиться",
    sessionEmptyTitle: "Нет предстоящих сеансов",
    sessionEmptyDescription:
      "Запишитесь на консультацию, и следующая подтверждённая встреча появится здесь.",
    sessionEmptyActionLabel: "Записаться",
  },
  it: {
    greetingMorning: "Buongiorno",
    greetingAfternoon: "Buon pomeriggio",
    greetingEvening: "Buonasera",
    newChartLabel: "Nuovo tema",
    stats: [
      "Temi salvati",
      "Persone seguite",
      "Report acquistati",
      "Crediti sessione",
    ],
    skyEyebrow: "Il tuo cielo oggi",
    sunLabel: "Sole",
    moonLabel: "Luna",
    mercuryLabel: "Mercurio",
    skyInsight:
      "Posizioni in tempo reale di Sole, Luna e Mercurio calcolate per oggi.",
    skyActionLabel: "Apri il cielo di oggi",
    skyEmptyTitle: "Aggiungi i dati di nascita",
    skyEmptyDescription:
      "Crea un profilo natale per accedere al cielo attuale e ai transiti personalizzati.",
    skyEmptyActionLabel: "+ Aggiungi i dati di nascita",
    sessionEyebrow: "Prossima sessione",
    sessionTiming: "Tra 2 giorni · Ven, 19:00",
    sessionTopicPrefix: "Durata",
    sessionActionLabel: "Partecipa alla sessione",
    sessionEmptyTitle: "Nessuna sessione in programma",
    sessionEmptyDescription:
      "Prenota una lettura con un astrologo e il prossimo appuntamento confermato apparirà qui.",
    sessionEmptyActionLabel: "Prenota una sessione",
  },
  de: {
    greetingMorning: "Guten Morgen",
    greetingAfternoon: "Guten Tag",
    greetingEvening: "Guten Abend",
    newChartLabel: "Neues Horoskop",
    stats: [
      "Gespeicherte Horoskope",
      "Beobachtete Personen",
      "Eigene Berichte",
      "Sitzungsguthaben",
    ],
    skyEyebrow: "Ihr Himmel heute",
    sunLabel: "Sonne",
    moonLabel: "Mond",
    mercuryLabel: "Merkur",
    skyInsight:
      "Aktuelle Positionen von Sonne, Mond und Merkur, für heute berechnet.",
    skyActionLabel: "Heutigen Himmel öffnen",
    skyEmptyTitle: "Geburtsdaten hinzufügen",
    skyEmptyDescription:
      "Erstellen Sie ein Geburtsprofil, um Ihren aktuellen Himmel und persönliche Transite freizuschalten.",
    skyEmptyActionLabel: "+ Geburtsdaten hinzufügen",
    sessionEyebrow: "Nächste Sitzung",
    sessionTiming: "In 2 Tagen · Fr, 19:00",
    sessionTopicPrefix: "Dauer",
    sessionActionLabel: "Sitzung beitreten",
    sessionEmptyTitle: "Keine bevorstehende Sitzung",
    sessionEmptyDescription:
      "Buchen Sie eine Beratung. Ihr nächster bestätigter Termin wird hier angezeigt.",
    sessionEmptyActionLabel: "Sitzung buchen",
  },
};

export const getAccountOverviewCopy = (locale: SupportedLocale) => copy[locale];
