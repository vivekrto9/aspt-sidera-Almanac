import type { SupportedLocale } from "../../../localization-contract.ts";

export type AstrologersBrowseCopy = {
  eyebrow: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
  searchAria: string;
  searchPlaceholder: string;
  searchSubmit: string;
  searchClear: string;
  filterLabel: string;
  filterAll: string;
  filterLove: string;
  filterCareer: string;
  filterLifePath: string;
  filterTiming: string;
  filterSpiritual: string;
  onlineNow: string;
  busyLabel: string;
  offlineLabel: string;
  resultsSuffix: string;
  noResultsTitle: string;
  noResultsBody: string;
  profileAction: string;
  talkNow: string;
  bookNextSlot: string;
  schedule: string;
  rateUnit: string;
  reviewsSuffix: string;
  profilePickerEyebrow: string;
  profilePickerTitle: string;
  profilePickerDescription: string;
  profilePickerCloseLabel: string;
  profilePickerEmptyTitle: string;
  profilePickerEmptyDescription: string;
  profilePickerCreateLabel: string;
  profilePickerSelectLabel: string;
  profilePickerDefaultLabel: string;
  profilePickerAddTitle: string;
  profilePickerBackLabel: string;
  profilePickerSaveLabel: string;
  profilePickerSavingLabel: string;
  profilePickerError: string;
};

export type AstrologerProfilePickerCopy = Pick<
  AstrologersBrowseCopy,
  | "profilePickerEyebrow"
  | "profilePickerTitle"
  | "profilePickerDescription"
  | "profilePickerCloseLabel"
  | "profilePickerEmptyTitle"
  | "profilePickerEmptyDescription"
  | "profilePickerCreateLabel"
  | "profilePickerSelectLabel"
  | "profilePickerDefaultLabel"
  | "profilePickerAddTitle"
  | "profilePickerBackLabel"
  | "profilePickerSaveLabel"
  | "profilePickerSavingLabel"
  | "profilePickerError"
>;

const en: AstrologersBrowseCopy = {
  eyebrow: "Live Readings",
  titleAccent: "Talk",
  titleSuffix: "to an astrologer.",
  description:
    "Real astrologers reading your actual chart. Pay securely from your wallet, one answered question at a time.",
  searchAria: "Search astrologers",
  searchPlaceholder: "Search by name or specialty",
  searchSubmit: "Search",
  searchClear: "Clear search",
  filterLabel: "Filter by specialty",
  filterAll: "All",
  filterLove: "Love",
  filterCareer: "Career",
  filterLifePath: "Life Path",
  filterTiming: "Timing",
  filterSpiritual: "Spiritual",
  onlineNow: "Online now",
  busyLabel: "In a session",
  offlineLabel: "Offline",
  resultsSuffix: "astrologers available",
  noResultsTitle: "No astrologers match that.",
  noResultsBody: "Try clearing a filter or searching a different specialty.",
  profileAction: "Profile",
  talkNow: "Chat now",
  bookNextSlot: "Book next slot",
  schedule: "Schedule",
  rateUnit: "/question",
  reviewsSuffix: "reviews",
  profilePickerEyebrow: "Saved profiles",
  profilePickerTitle: "Choose a birth profile",
  profilePickerDescription:
    "Select the birth profile you want to share for this chat.",
  profilePickerCloseLabel: "Close profile picker",
  profilePickerEmptyTitle: "No saved profiles yet",
  profilePickerEmptyDescription:
    "Create a birth profile before starting a chat.",
  profilePickerCreateLabel: "Add profile",
  profilePickerSelectLabel: "Select",
  profilePickerDefaultLabel: "Default",
  profilePickerAddTitle: "Add a birth profile",
  profilePickerBackLabel: "Back to profiles",
  profilePickerSaveLabel: "Save and select profile",
  profilePickerSavingLabel: "Saving profile",
  profilePickerError: "Profile could not be saved. Please try again.",
};

const copyByLocale: Record<SupportedLocale, AstrologersBrowseCopy> = {
  en,
  es: {
    ...en,
    eyebrow: "Lecturas en directo",
    titleAccent: "Habla",
    titleSuffix: "con un astrólogo.",
    description:
      "Astrólogos reales leyendo tu carta. Paga desde tu cartera, una pregunta respondida cada vez.",
    rateUnit: "/pregunta",
    searchAria: "Buscar astrólogos",
    searchPlaceholder: "Buscar por nombre o especialidad",
    searchSubmit: "Buscar",
    searchClear: "Borrar búsqueda",
    filterLabel: "Filtrar por especialidad",
    filterAll: "Todos",
    filterLove: "Amor",
    filterCareer: "Carrera",
    filterLifePath: "Camino vital",
    filterTiming: "Momentos",
    filterSpiritual: "Espiritual",
    onlineNow: "En línea ahora",
    busyLabel: "En consulta",
    offlineLabel: "Desconectado",
    resultsSuffix: "astrólogos disponibles",
    noResultsTitle: "Ningún astrólogo coincide.",
    noResultsBody: "Borra un filtro o prueba otra especialidad.",
    profileAction: "Perfil",
    talkNow: "Chatear ahora",
    bookNextSlot: "Reservar próximo horario",
    schedule: "Programar",
    reviewsSuffix: "reseñas",
    profilePickerEyebrow: "Perfiles guardados",
    profilePickerTitle: "Elige un perfil natal",
    profilePickerDescription:
      "Selecciona el perfil natal que quieres compartir en este chat.",
    profilePickerCloseLabel: "Cerrar selector de perfiles",
    profilePickerEmptyTitle: "Aún no hay perfiles guardados",
    profilePickerEmptyDescription:
      "Crea un perfil natal antes de iniciar un chat.",
    profilePickerCreateLabel: "Añadir perfil",
    profilePickerSelectLabel: "Seleccionar",
    profilePickerDefaultLabel: "Predeterminado",
    profilePickerAddTitle: "Añadir un perfil natal",
    profilePickerBackLabel: "Volver a perfiles",
    profilePickerSaveLabel: "Guardar y seleccionar perfil",
    profilePickerSavingLabel: "Guardando perfil",
    profilePickerError: "No se pudo guardar el perfil. Inténtalo de nuevo.",
  },
  fr: {
    ...en,
    eyebrow: "Consultations en direct",
    titleAccent: "Parlez",
    titleSuffix: "à un astrologue.",
    description:
      "De vrais astrologues lisent votre thème. Payez avec votre portefeuille, une réponse à la fois.",
    rateUnit: "/question",
    searchAria: "Rechercher des astrologues",
    searchPlaceholder: "Nom ou spécialité",
    searchSubmit: "Rechercher",
    searchClear: "Effacer la recherche",
    filterLabel: "Filtrer par spécialité",
    filterAll: "Tous",
    filterLove: "Amour",
    filterCareer: "Carrière",
    filterLifePath: "Chemin de vie",
    filterTiming: "Timing",
    filterSpiritual: "Spirituel",
    onlineNow: "En ligne",
    busyLabel: "En consultation",
    offlineLabel: "Hors ligne",
    resultsSuffix: "astrologues disponibles",
    noResultsTitle: "Aucun astrologue ne correspond.",
    noResultsBody: "Retirez un filtre ou essayez une autre spécialité.",
    profileAction: "Profil",
    talkNow: "Discuter maintenant",
    bookNextSlot: "Réserver le prochain créneau",
    schedule: "Planifier",
    reviewsSuffix: "avis",
    profilePickerEyebrow: "Profils enregistrés",
    profilePickerTitle: "Choisissez un profil natal",
    profilePickerDescription:
      "Sélectionnez le profil natal à partager pour cette discussion.",
    profilePickerCloseLabel: "Fermer le sélecteur de profils",
    profilePickerEmptyTitle: "Aucun profil enregistré",
    profilePickerEmptyDescription:
      "Créez un profil natal avant de commencer une discussion.",
    profilePickerCreateLabel: "Ajouter un profil",
    profilePickerSelectLabel: "Choisir",
    profilePickerDefaultLabel: "Par défaut",
    profilePickerAddTitle: "Ajouter un profil natal",
    profilePickerBackLabel: "Retour aux profils",
    profilePickerSaveLabel: "Enregistrer et choisir",
    profilePickerSavingLabel: "Enregistrement du profil",
    profilePickerError: "Impossible d’enregistrer le profil. Réessayez.",
  },
  pt: {
    ...en,
    eyebrow: "Leituras ao vivo",
    titleAccent: "Fale",
    titleSuffix: "com um astrólogo.",
    description:
      "Astrólogos reais lendo o seu mapa. Pague pela carteira, uma pergunta respondida de cada vez.",
    rateUnit: "/pergunta",
    searchAria: "Pesquisar astrólogos",
    searchPlaceholder: "Pesquisar por nome ou especialidade",
    searchSubmit: "Pesquisar",
    searchClear: "Limpar pesquisa",
    filterLabel: "Filtrar por especialidade",
    filterAll: "Todos",
    filterLove: "Amor",
    filterCareer: "Carreira",
    filterLifePath: "Caminho de vida",
    filterTiming: "Timing",
    filterSpiritual: "Espiritual",
    onlineNow: "Online agora",
    busyLabel: "Em consulta",
    offlineLabel: "Offline",
    resultsSuffix: "astrólogos disponíveis",
    noResultsTitle: "Nenhum astrólogo corresponde.",
    noResultsBody: "Limpe um filtro ou tente outra especialidade.",
    profileAction: "Perfil",
    talkNow: "Conversar agora",
    bookNextSlot: "Reservar próximo horário",
    schedule: "Agendar",
    reviewsSuffix: "avaliações",
    profilePickerEyebrow: "Perfis salvos",
    profilePickerTitle: "Escolha um perfil natal",
    profilePickerDescription:
      "Selecione o perfil natal que deseja compartilhar neste chat.",
    profilePickerCloseLabel: "Fechar seletor de perfis",
    profilePickerEmptyTitle: "Nenhum perfil salvo",
    profilePickerEmptyDescription:
      "Crie um perfil natal antes de iniciar um chat.",
    profilePickerCreateLabel: "Adicionar perfil",
    profilePickerSelectLabel: "Selecionar",
    profilePickerDefaultLabel: "Padrão",
    profilePickerAddTitle: "Adicionar um perfil natal",
    profilePickerBackLabel: "Voltar aos perfis",
    profilePickerSaveLabel: "Salvar e selecionar perfil",
    profilePickerSavingLabel: "Salvando perfil",
    profilePickerError: "Não foi possível salvar o perfil. Tente novamente.",
  },
  ru: {
    ...en,
    eyebrow: "Живые консультации",
    titleAccent: "Поговорите",
    titleSuffix: "с астрологом.",
    description:
      "Настоящие астрологи читают вашу карту. Оплата из кошелька за каждый полученный ответ.",
    searchAria: "Поиск астрологов",
    searchPlaceholder: "Имя или специализация",
    searchSubmit: "Найти",
    searchClear: "Очистить поиск",
    filterLabel: "Фильтр по специализации",
    filterAll: "Все",
    filterLove: "Любовь",
    filterCareer: "Карьера",
    filterLifePath: "Жизненный путь",
    filterTiming: "Выбор времени",
    filterSpiritual: "Духовность",
    onlineNow: "Сейчас в сети",
    busyLabel: "На консультации",
    offlineLabel: "Не в сети",
    resultsSuffix: "астрологов доступно",
    noResultsTitle: "Совпадений нет.",
    noResultsBody: "Сбросьте фильтр или выберите другую специализацию.",
    profileAction: "Профиль",
    talkNow: "Начать чат",
    bookNextSlot: "Забронировать время",
    schedule: "Запланировать",
    rateUnit: "/вопрос",
    reviewsSuffix: "отзывов",
    profilePickerEyebrow: "Сохранённые профили",
    profilePickerTitle: "Выберите профиль рождения",
    profilePickerDescription:
      "Выберите профиль рождения, которым хотите поделиться в этом чате.",
    profilePickerCloseLabel: "Закрыть выбор профиля",
    profilePickerEmptyTitle: "Сохранённых профилей пока нет",
    profilePickerEmptyDescription:
      "Создайте профиль рождения перед началом чата.",
    profilePickerCreateLabel: "Добавить профиль",
    profilePickerSelectLabel: "Выбрать",
    profilePickerDefaultLabel: "Основной",
    profilePickerAddTitle: "Добавить профиль рождения",
    profilePickerBackLabel: "Назад к профилям",
    profilePickerSaveLabel: "Сохранить и выбрать",
    profilePickerSavingLabel: "Сохранение профиля",
    profilePickerError: "Не удалось сохранить профиль. Попробуйте снова.",
  },
  it: {
    ...en,
    eyebrow: "Consulti dal vivo",
    titleAccent: "Parla",
    titleSuffix: "con un astrologo.",
    description:
      "Astrologi reali leggono il tuo tema. Paga dal portafoglio, una domanda con risposta alla volta.",
    rateUnit: "/domanda",
    searchAria: "Cerca astrologi",
    searchPlaceholder: "Cerca per nome o specialità",
    searchSubmit: "Cerca",
    searchClear: "Cancella ricerca",
    filterLabel: "Filtra per specialità",
    filterAll: "Tutti",
    filterLove: "Amore",
    filterCareer: "Carriera",
    filterLifePath: "Percorso di vita",
    filterTiming: "Tempismo",
    filterSpiritual: "Spirituale",
    onlineNow: "Online ora",
    busyLabel: "In consulto",
    offlineLabel: "Offline",
    resultsSuffix: "astrologi disponibili",
    noResultsTitle: "Nessun astrologo corrisponde.",
    noResultsBody: "Rimuovi un filtro o prova un’altra specialità.",
    profileAction: "Profilo",
    talkNow: "Chatta ora",
    bookNextSlot: "Prenota il prossimo orario",
    schedule: "Programma",
    reviewsSuffix: "recensioni",
    profilePickerEyebrow: "Profili salvati",
    profilePickerTitle: "Scegli un profilo natale",
    profilePickerDescription:
      "Seleziona il profilo natale da condividere in questa chat.",
    profilePickerCloseLabel: "Chiudi selettore profili",
    profilePickerEmptyTitle: "Nessun profilo salvato",
    profilePickerEmptyDescription:
      "Crea un profilo natale prima di avviare una chat.",
    profilePickerCreateLabel: "Aggiungi profilo",
    profilePickerSelectLabel: "Seleziona",
    profilePickerDefaultLabel: "Predefinito",
    profilePickerAddTitle: "Aggiungi un profilo natale",
    profilePickerBackLabel: "Torna ai profili",
    profilePickerSaveLabel: "Salva e seleziona profilo",
    profilePickerSavingLabel: "Salvataggio profilo",
    profilePickerError: "Impossibile salvare il profilo. Riprova.",
  },
  de: {
    ...en,
    eyebrow: "Live-Beratungen",
    titleAccent: "Sprich",
    titleSuffix: "mit einem Astrologen.",
    description:
      "Echte Astrologen lesen dein persönliches Horoskop. Bezahle pro beantworteter Frage aus deinem Wallet.",
    searchAria: "Astrologen suchen",
    searchPlaceholder: "Nach Name oder Fachgebiet suchen",
    searchSubmit: "Suchen",
    searchClear: "Suche löschen",
    filterLabel: "Nach Fachgebiet filtern",
    filterAll: "Alle",
    filterLove: "Liebe",
    filterCareer: "Karriere",
    filterLifePath: "Lebensweg",
    filterTiming: "Timing",
    filterSpiritual: "Spirituell",
    onlineNow: "Jetzt online",
    busyLabel: "In einer Beratung",
    offlineLabel: "Offline",
    resultsSuffix: "Astrologen verfügbar",
    noResultsTitle: "Keine passenden Astrologen.",
    noResultsBody:
      "Entferne einen Filter oder suche nach einem anderen Fachgebiet.",
    profileAction: "Profil",
    talkNow: "Jetzt chatten",
    bookNextSlot: "Nächsten Termin buchen",
    schedule: "Planen",
    rateUnit: "/Frage",
    reviewsSuffix: "Bewertungen",
    profilePickerEyebrow: "Gespeicherte Profile",
    profilePickerTitle: "Geburtsprofil auswählen",
    profilePickerDescription:
      "Wählen Sie das Geburtsprofil, das Sie für diesen Chat teilen möchten.",
    profilePickerCloseLabel: "Profilauswahl schließen",
    profilePickerEmptyTitle: "Noch keine Profile gespeichert",
    profilePickerEmptyDescription:
      "Erstellen Sie vor dem Chat ein Geburtsprofil.",
    profilePickerCreateLabel: "Profil hinzufügen",
    profilePickerSelectLabel: "Auswählen",
    profilePickerDefaultLabel: "Standard",
    profilePickerAddTitle: "Geburtsprofil hinzufügen",
    profilePickerBackLabel: "Zurück zu Profilen",
    profilePickerSaveLabel: "Speichern und Profil auswählen",
    profilePickerSavingLabel: "Profil wird gespeichert",
    profilePickerError:
      "Das Profil konnte nicht gespeichert werden. Versuchen Sie es erneut.",
  },
};

export const getAstrologersBrowseCopy = (
  locale: SupportedLocale,
): AstrologersBrowseCopy => copyByLocale[locale] ?? copyByLocale.en;
