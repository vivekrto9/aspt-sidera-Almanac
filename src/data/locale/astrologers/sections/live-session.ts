import type { SupportedLocale } from "../../../localization-contract.ts";

export type AstrologerLiveSessionCopy = {
  historyTitle: string;
  newChat: string;
  openHistory: string;
  closeHistory: string;
  noHistory: string;
  sessionEnded: string;
  chatsLabel: string;
  transactionsLabel: string;
  noTransactions: string;
  chattingAs: string;
  securePrivate: string;
  backToAstrologers: string;
  loadMore: string;
  deleteSessionLabel: string;
  deleteSessionTitle: string;
  deleteSessionDescription: string;
  deleteSessionConfirm: string;
  deleteSessionDeleting: string;
  deleteSessionCancel: string;
  connected: string;
  walletLabel: string;
  meterLabel: string;
  endSession: string;
  sessionStarted: string;
  openingMessage: string;
  replyMessage: string;
  quickYear: string;
  quickCareer: string;
  quickLove: string;
  quickTransits: string;
  messagePlaceholder: string;
  sendMessage: string;
  chartTitle: string;
  chartOwner: string;
  chartLabel: string;
  askedTitle: string;
  askedText: string;
  placementsTitle: string;
  sunPlacement: string;
  moonPlacement: string;
  risingPlacement: string;
  walletLowTitle: string;
  walletLowDescription: string;
  walletCurrentLabel: string;
  walletRequiredLabel: string;
  walletShortfallLabel: string;
  addFundsLabel: string;
  walletCloseLabel: string;
};

const en: AstrologerLiveSessionCopy = {
  historyTitle: "Chat history",
  newChat: "New chat",
  openHistory: "Open chat history",
  closeHistory: "Close chat history",
  noHistory: "No previous chats yet.",
  sessionEnded: "ended",
  chatsLabel: "Chats",
  transactionsLabel: "Transactions",
  noTransactions: "No wallet transactions yet.",
  chattingAs: "Chatting as",
  securePrivate: "100% secure & private",
  backToAstrologers: "Back to astrologers",
  loadMore: "Load more",
  deleteSessionLabel: "Delete chat session",
  deleteSessionTitle: "Delete this chat?",
  deleteSessionDescription:
    "This permanently deletes the session and its message history. This action cannot be undone.",
  deleteSessionConfirm: "Delete session",
  deleteSessionDeleting: "Deleting session",
  deleteSessionCancel: "Keep session",
  connected: "connected",
  walletLabel: "Wallet",
  meterLabel: "per question",
  endSession: "End session",
  sessionStarted: "Session started · {name} has your chart open",
  openingMessage:
    "Hi Alex — I have your chart open. What would you most like clarity on today?",
  replyMessage:
    "I’d like to understand the timing around a possible career change.",
  quickYear: "Tell me about my year ahead",
  quickCareer: "Is now a good time for a career move?",
  quickLove: "What’s happening in my love life?",
  quickTransits: "Read my current transits",
  messagePlaceholder: "Type a message...",
  sendMessage: "Send message",
  chartTitle: "Your chart",
  chartOwner: "Alex Rivera",
  chartLabel: "Leo Sun · Scorpio rising · Moon in Pisces",
  askedTitle: "You asked",
  askedText:
    "I’ve been offered a new role and I’m torn about whether this is the right time to move.",
  placementsTitle: "Key placements today",
  sunPlacement: "Sun · 9° Cancer",
  moonPlacement: "Moon · 5° Scorpio",
  risingPlacement: "Scorpio rising · 18°",
  walletLowTitle: "Add funds to keep chatting",
  walletLowDescription:
    "Your message is still here. Recharge your wallet, then send it again.",
  walletCurrentLabel: "Current balance",
  walletRequiredLabel: "Question price",
  walletShortfallLabel: "Amount needed",
  addFundsLabel: "Add funds",
  walletCloseLabel: "Not now",
};

const translated = (
  overrides: Partial<AstrologerLiveSessionCopy>,
): AstrologerLiveSessionCopy => ({ ...en, ...overrides });

const copyByLocale: Record<SupportedLocale, AstrologerLiveSessionCopy> = {
  en,
  es: translated({
    historyTitle: "Historial de chats",
    newChat: "Nuevo chat",
    openHistory: "Abrir historial de chats",
    closeHistory: "Cerrar historial de chats",
    noHistory: "Aún no hay chats anteriores.",
    sessionEnded: "finalizada",
    chatsLabel: "Chats",
    transactionsLabel: "Transacciones",
    noTransactions: "Aún no hay transacciones.",
    chattingAs: "Chateando como",
    securePrivate: "100 % seguro y privado",
    backToAstrologers: "Volver a astrólogos",
    loadMore: "Cargar más",
    deleteSessionLabel: "Eliminar sesión de chat",
    deleteSessionTitle: "¿Eliminar este chat?",
    deleteSessionDescription:
      "Esto elimina permanentemente la sesión y su historial de mensajes. Esta acción no se puede deshacer.",
    deleteSessionConfirm: "Eliminar sesión",
    deleteSessionDeleting: "Eliminando sesión",
    deleteSessionCancel: "Conservar sesión",
    connected: "conectada",
    walletLabel: "Cartera",
    meterLabel: "por pregunta",
    endSession: "Finalizar sesión",
    sessionStarted: "Sesión iniciada · {name} tiene tu carta abierta",
    messagePlaceholder: "Escribe un mensaje...",
    sendMessage: "Enviar mensaje",
    chartTitle: "Tu carta",
    askedTitle: "Tu pregunta",
    placementsTitle: "Posiciones clave de hoy",
    walletLowTitle: "Añade fondos para seguir chateando",
    walletLowDescription:
      "Tu mensaje sigue aquí. Recarga la cartera y vuelve a enviarlo.",
    walletCurrentLabel: "Saldo actual",
    walletRequiredLabel: "Precio de la pregunta",
    walletShortfallLabel: "Importe necesario",
    addFundsLabel: "Añadir fondos",
    walletCloseLabel: "Ahora no",
  }),
  fr: translated({
    historyTitle: "Historique des chats",
    newChat: "Nouveau chat",
    openHistory: "Ouvrir l’historique des chats",
    closeHistory: "Fermer l’historique des chats",
    noHistory: "Aucun chat précédent.",
    sessionEnded: "terminée",
    chatsLabel: "Chats",
    transactionsLabel: "Transactions",
    noTransactions: "Aucune transaction de portefeuille.",
    chattingAs: "Vous discutez en tant que",
    securePrivate: "100 % sécurisé et privé",
    backToAstrologers: "Retour aux astrologues",
    loadMore: "Afficher plus",
    deleteSessionLabel: "Supprimer la session de chat",
    deleteSessionTitle: "Supprimer ce chat ?",
    deleteSessionDescription:
      "Cette action supprime définitivement la session et son historique de messages. Elle est irréversible.",
    deleteSessionConfirm: "Supprimer la session",
    deleteSessionDeleting: "Suppression de la session",
    deleteSessionCancel: "Conserver la session",
    connected: "connectée",
    walletLabel: "Portefeuille",
    meterLabel: "par question",
    endSession: "Terminer la session",
    sessionStarted: "Session démarrée · {name} a ouvert votre thème",
    messagePlaceholder: "Écrivez un message...",
    sendMessage: "Envoyer le message",
    chartTitle: "Votre thème",
    askedTitle: "Votre question",
    placementsTitle: "Positions clés du jour",
    walletLowTitle: "Ajoutez des fonds pour continuer",
    walletLowDescription:
      "Votre message est conservé. Rechargez votre portefeuille puis renvoyez-le.",
    walletCurrentLabel: "Solde actuel",
    walletRequiredLabel: "Prix de la question",
    walletShortfallLabel: "Montant nécessaire",
    addFundsLabel: "Ajouter des fonds",
    walletCloseLabel: "Pas maintenant",
  }),
  pt: translated({
    historyTitle: "Histórico de chats",
    newChat: "Novo chat",
    openHistory: "Abrir histórico de chats",
    closeHistory: "Fechar histórico de chats",
    noHistory: "Ainda não há chats anteriores.",
    sessionEnded: "encerrada",
    chatsLabel: "Chats",
    transactionsLabel: "Transações",
    noTransactions: "Ainda não há transações.",
    chattingAs: "Conversando como",
    securePrivate: "100% seguro e privado",
    backToAstrologers: "Voltar aos astrólogos",
    loadMore: "Carregar mais",
    deleteSessionLabel: "Excluir sessão de chat",
    deleteSessionTitle: "Excluir este chat?",
    deleteSessionDescription:
      "Isso exclui permanentemente a sessão e o histórico de mensagens. Esta ação não pode ser desfeita.",
    deleteSessionConfirm: "Excluir sessão",
    deleteSessionDeleting: "Excluindo sessão",
    deleteSessionCancel: "Manter sessão",
    connected: "conectada",
    walletLabel: "Carteira",
    meterLabel: "por pergunta",
    endSession: "Encerrar sessão",
    sessionStarted: "Sessão iniciada · {name} abriu seu mapa",
    messagePlaceholder: "Digite uma mensagem...",
    sendMessage: "Enviar mensagem",
    chartTitle: "Seu mapa",
    askedTitle: "Você perguntou",
    placementsTitle: "Posições importantes hoje",
    walletLowTitle: "Adicione saldo para continuar",
    walletLowDescription:
      "Sua mensagem continua aqui. Recarregue a carteira e envie novamente.",
    walletCurrentLabel: "Saldo atual",
    walletRequiredLabel: "Preço da pergunta",
    walletShortfallLabel: "Valor necessário",
    addFundsLabel: "Adicionar saldo",
    walletCloseLabel: "Agora não",
  }),
  ru: translated({
    historyTitle: "История чатов",
    newChat: "Новый чат",
    openHistory: "Открыть историю чатов",
    closeHistory: "Закрыть историю чатов",
    noHistory: "Предыдущих чатов пока нет.",
    sessionEnded: "завершено",
    chatsLabel: "Чаты",
    transactionsLabel: "Транзакции",
    noTransactions: "Транзакций кошелька пока нет.",
    chattingAs: "Вы общаетесь как",
    securePrivate: "100% безопасно и конфиденциально",
    backToAstrologers: "Назад к астрологам",
    loadMore: "Загрузить ещё",
    deleteSessionLabel: "Удалить сеанс чата",
    deleteSessionTitle: "Удалить этот чат?",
    deleteSessionDescription:
      "Сеанс и история сообщений будут удалены навсегда. Это действие нельзя отменить.",
    deleteSessionConfirm: "Удалить сеанс",
    deleteSessionDeleting: "Удаление сеанса",
    deleteSessionCancel: "Сохранить сеанс",
    connected: "подключено",
    walletLabel: "Кошелёк",
    meterLabel: "за вопрос",
    endSession: "Завершить консультацию",
    sessionStarted: "Консультация началась · {name} открыла вашу карту",
    messagePlaceholder: "Введите сообщение...",
    sendMessage: "Отправить сообщение",
    chartTitle: "Ваша карта",
    askedTitle: "Ваш вопрос",
    placementsTitle: "Ключевые положения сегодня",
    walletLowTitle: "Пополните кошелёк, чтобы продолжить",
    walletLowDescription:
      "Сообщение сохранено. Пополните кошелёк и отправьте его снова.",
    walletCurrentLabel: "Текущий баланс",
    walletRequiredLabel: "Цена вопроса",
    walletShortfallLabel: "Необходимая сумма",
    addFundsLabel: "Пополнить",
    walletCloseLabel: "Не сейчас",
  }),
  it: translated({
    historyTitle: "Cronologia chat",
    newChat: "Nuova chat",
    openHistory: "Apri la cronologia chat",
    closeHistory: "Chiudi la cronologia chat",
    noHistory: "Nessuna chat precedente.",
    sessionEnded: "terminata",
    chatsLabel: "Chat",
    transactionsLabel: "Transazioni",
    noTransactions: "Nessuna transazione del portafoglio.",
    chattingAs: "Stai chattando come",
    securePrivate: "100% sicuro e privato",
    backToAstrologers: "Torna agli astrologi",
    loadMore: "Carica altro",
    deleteSessionLabel: "Elimina sessione di chat",
    deleteSessionTitle: "Eliminare questa chat?",
    deleteSessionDescription:
      "La sessione e la cronologia dei messaggi verranno eliminate definitivamente. Questa azione non può essere annullata.",
    deleteSessionConfirm: "Elimina sessione",
    deleteSessionDeleting: "Eliminazione sessione",
    deleteSessionCancel: "Mantieni sessione",
    connected: "connessa",
    walletLabel: "Portafoglio",
    meterLabel: "per domanda",
    endSession: "Termina sessione",
    sessionStarted: "Sessione iniziata · {name} ha aperto il tuo tema",
    messagePlaceholder: "Scrivi un messaggio...",
    sendMessage: "Invia messaggio",
    chartTitle: "Il tuo tema",
    askedTitle: "Hai chiesto",
    placementsTitle: "Posizioni chiave di oggi",
    walletLowTitle: "Aggiungi fondi per continuare",
    walletLowDescription:
      "Il messaggio è ancora qui. Ricarica il portafoglio e invialo di nuovo.",
    walletCurrentLabel: "Saldo attuale",
    walletRequiredLabel: "Prezzo della domanda",
    walletShortfallLabel: "Importo necessario",
    addFundsLabel: "Aggiungi fondi",
    walletCloseLabel: "Non ora",
  }),
  de: translated({
    historyTitle: "Chatverlauf",
    newChat: "Neuer Chat",
    openHistory: "Chatverlauf öffnen",
    closeHistory: "Chatverlauf schließen",
    noHistory: "Noch keine früheren Chats.",
    sessionEnded: "beendet",
    chatsLabel: "Chats",
    transactionsLabel: "Transaktionen",
    noTransactions: "Noch keine Wallet-Transaktionen.",
    chattingAs: "Du chattest als",
    securePrivate: "100% sicher und privat",
    backToAstrologers: "Zurück zu Astrologen",
    loadMore: "Mehr laden",
    deleteSessionLabel: "Chatsitzung löschen",
    deleteSessionTitle: "Diesen Chat löschen?",
    deleteSessionDescription:
      "Die Sitzung und ihr Nachrichtenverlauf werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    deleteSessionConfirm: "Sitzung löschen",
    deleteSessionDeleting: "Sitzung wird gelöscht",
    deleteSessionCancel: "Sitzung behalten",
    connected: "verbunden",
    walletLabel: "Wallet",
    meterLabel: "pro Frage",
    endSession: "Sitzung beenden",
    sessionStarted: "Sitzung gestartet · {name} hat dein Horoskop geöffnet",
    messagePlaceholder: "Nachricht schreiben...",
    sendMessage: "Nachricht senden",
    chartTitle: "Dein Horoskop",
    askedTitle: "Deine Frage",
    placementsTitle: "Wichtige Positionen heute",
    walletLowTitle: "Guthaben aufladen und weiterchatten",
    walletLowDescription:
      "Deine Nachricht bleibt erhalten. Lade das Wallet auf und sende sie erneut.",
    walletCurrentLabel: "Aktuelles Guthaben",
    walletRequiredLabel: "Preis pro Frage",
    walletShortfallLabel: "Benötigter Betrag",
    addFundsLabel: "Guthaben aufladen",
    walletCloseLabel: "Nicht jetzt",
  }),
};

export const getAstrologerLiveSessionCopy = (
  locale: SupportedLocale,
): AstrologerLiveSessionCopy => copyByLocale[locale] ?? copyByLocale.en;
