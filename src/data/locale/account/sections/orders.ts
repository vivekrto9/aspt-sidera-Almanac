import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountOrdersCopy = {
  eyebrow: string;
  title: string;
  deliveredLabel: string;
  shippedLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel: string;
};

const copy: Record<SupportedLocale, AccountOrdersCopy> = {
  en: {
    eyebrow: "Orders",
    title: "Purchase history",
    deliveredLabel: "Delivered",
    shippedLabel: "Shipped",
    emptyTitle: "No purchases yet",
    emptyDescription:
      "Explore astrology tools, reports, and guides. Your orders will appear here.",
    emptyActionLabel: "+ Browse the shop",
  },
  es: {
    eyebrow: "Pedidos",
    title: "Historial de compras",
    deliveredLabel: "Entregado",
    shippedLabel: "Enviado",
    emptyTitle: "Aún no hay compras",
    emptyDescription:
      "Explora herramientas, informes y guías de astrología. Tus pedidos aparecerán aquí.",
    emptyActionLabel: "+ Explorar la tienda",
  },
  fr: {
    eyebrow: "Commandes",
    title: "Historique des achats",
    deliveredLabel: "Livré",
    shippedLabel: "Expédié",
    emptyTitle: "Aucun achat pour le moment",
    emptyDescription:
      "Découvrez nos outils, rapports et guides d’astrologie. Vos commandes apparaîtront ici.",
    emptyActionLabel: "+ Découvrir la boutique",
  },
  pt: {
    eyebrow: "Pedidos",
    title: "Histórico de compras",
    deliveredLabel: "Entregue",
    shippedLabel: "Enviado",
    emptyTitle: "Ainda não há compras",
    emptyDescription:
      "Explore ferramentas, relatórios e guias de astrologia. Seus pedidos aparecerão aqui.",
    emptyActionLabel: "+ Explorar a loja",
  },
  ru: {
    eyebrow: "Заказы",
    title: "История покупок",
    deliveredLabel: "Доставлено",
    shippedLabel: "Отправлено",
    emptyTitle: "Покупок пока нет",
    emptyDescription:
      "Посмотрите астрологические инструменты, отчёты и руководства. Заказы появятся здесь.",
    emptyActionLabel: "+ Перейти в магазин",
  },
  it: {
    eyebrow: "Ordini",
    title: "Cronologia acquisti",
    deliveredLabel: "Consegnato",
    shippedLabel: "Spedito",
    emptyTitle: "Nessun acquisto",
    emptyDescription:
      "Esplora strumenti, report e guide di astrologia. I tuoi ordini appariranno qui.",
    emptyActionLabel: "+ Esplora lo shop",
  },
  de: {
    eyebrow: "Bestellungen",
    title: "Kaufverlauf",
    deliveredLabel: "Geliefert",
    shippedLabel: "Versandt",
    emptyTitle: "Noch keine Käufe",
    emptyDescription:
      "Entdecken Sie astrologische Tools, Berichte und Ratgeber. Ihre Bestellungen erscheinen hier.",
    emptyActionLabel: "+ Shop entdecken",
  },
};

export const getAccountOrdersCopy = (locale: SupportedLocale) => copy[locale];
