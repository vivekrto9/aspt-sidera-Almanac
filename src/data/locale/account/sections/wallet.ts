import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountWalletCopy = {
  navigationLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  entriesLabel: string;
  availableLabel: string;
  usage: string;
  addLabel: string;
  browseLabel: string;
  historyLabel: string;
  balanceAfterLabel: string;
  creditFallback: string;
  debitFallback: string;
  emptyTitle: string;
  emptyDescription: string;
};

const copy: Record<SupportedLocale, AccountWalletCopy> = {
  en: { navigationLabel: "My wallet", eyebrow: "Wallet", title: "Balance & transactions", description: "Use your wallet for astrologer chats. Every credit and debit is recorded here.", entriesLabel: "entries", availableLabel: "Available balance", usage: "Used for astrologer chats · USD", addLabel: "Add funds", browseLabel: "Browse astrologers", historyLabel: "Recent wallet activity", balanceAfterLabel: "Balance after", creditFallback: "Wallet credit", debitFallback: "Paid chat", emptyTitle: "No wallet activity yet", emptyDescription: "Add funds once, then every wallet credit and paid chat will appear here." },
  es: { navigationLabel: "Mi cartera", eyebrow: "Cartera", title: "Saldo y transacciones", description: "Usa tu cartera para hablar con astrólogos. Aquí se registra cada crédito y débito.", entriesLabel: "registros", availableLabel: "Saldo disponible", usage: "Para chats con astrólogos · USD", addLabel: "Añadir fondos", browseLabel: "Ver astrólogos", historyLabel: "Actividad reciente", balanceAfterLabel: "Saldo después", creditFallback: "Crédito de cartera", debitFallback: "Chat de pago", emptyTitle: "Aún no hay actividad", emptyDescription: "Añade fondos y aquí aparecerán cada crédito y chat de pago." },
  fr: { navigationLabel: "Mon portefeuille", eyebrow: "Portefeuille", title: "Solde et transactions", description: "Utilisez votre portefeuille pour les consultations. Chaque crédit et débit est enregistré ici.", entriesLabel: "opérations", availableLabel: "Solde disponible", usage: "Pour les consultations · USD", addLabel: "Ajouter des fonds", browseLabel: "Voir les astrologues", historyLabel: "Activité récente", balanceAfterLabel: "Solde après", creditFallback: "Crédit du portefeuille", debitFallback: "Chat payant", emptyTitle: "Aucune activité", emptyDescription: "Ajoutez des fonds : chaque crédit et chat payant apparaîtra ici." },
  pt: { navigationLabel: "Minha carteira", eyebrow: "Carteira", title: "Saldo e transações", description: "Use sua carteira para conversar com astrólogos. Cada crédito e débito fica registrado aqui.", entriesLabel: "registros", availableLabel: "Saldo disponível", usage: "Para conversas com astrólogos · USD", addLabel: "Adicionar fundos", browseLabel: "Ver astrólogos", historyLabel: "Atividade recente", balanceAfterLabel: "Saldo após", creditFallback: "Crédito da carteira", debitFallback: "Conversa paga", emptyTitle: "Ainda não há atividade", emptyDescription: "Adicione fundos e cada crédito e conversa paga aparecerá aqui." },
  ru: { navigationLabel: "Мой кошелёк", eyebrow: "Кошелёк", title: "Баланс и операции", description: "Используйте кошелёк для чатов с астрологами. Все пополнения и списания сохраняются здесь.", entriesLabel: "операций", availableLabel: "Доступный баланс", usage: "Для чатов с астрологами · USD", addLabel: "Пополнить", browseLabel: "Выбрать астролога", historyLabel: "Последние операции", balanceAfterLabel: "Баланс после", creditFallback: "Пополнение кошелька", debitFallback: "Платный чат", emptyTitle: "Операций пока нет", emptyDescription: "Пополните кошелёк — здесь появятся все пополнения и платные чаты." },
  it: { navigationLabel: "Il mio portafoglio", eyebrow: "Portafoglio", title: "Saldo e transazioni", description: "Usa il portafoglio per le chat con gli astrologi. Ogni credito e addebito viene registrato qui.", entriesLabel: "operazioni", availableLabel: "Saldo disponibile", usage: "Per le chat con gli astrologi · USD", addLabel: "Aggiungi fondi", browseLabel: "Vedi gli astrologi", historyLabel: "Attività recente", balanceAfterLabel: "Saldo dopo", creditFallback: "Credito del portafoglio", debitFallback: "Chat a pagamento", emptyTitle: "Nessuna attività", emptyDescription: "Aggiungi fondi e ogni credito e chat a pagamento apparirà qui." },
  de: { navigationLabel: "Mein Wallet", eyebrow: "Wallet", title: "Guthaben und Transaktionen", description: "Nutze dein Wallet für Astrologen-Chats. Jede Gutschrift und Abbuchung wird hier erfasst.", entriesLabel: "Einträge", availableLabel: "Verfügbares Guthaben", usage: "Für Astrologen-Chats · USD", addLabel: "Guthaben hinzufügen", browseLabel: "Astrologen ansehen", historyLabel: "Letzte Wallet-Aktivität", balanceAfterLabel: "Guthaben danach", creditFallback: "Wallet-Gutschrift", debitFallback: "Bezahlter Chat", emptyTitle: "Noch keine Wallet-Aktivität", emptyDescription: "Füge Guthaben hinzu; danach erscheint hier jede Gutschrift und jeder bezahlte Chat." },
};

export const getAccountWalletCopy = (locale: SupportedLocale) => copy[locale];
