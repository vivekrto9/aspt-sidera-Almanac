import type { SupportedLocale } from "../localization-contract.ts";
import type { CommerceOrder } from "../../server/aggregator/commerce-orders.ts";

export type AccountOrderRecord = {
  id: string;
  dateLabel: string;
  title: string;
  meta: string;
  status: "delivered" | "shipped";
  statusLabel?: string;
  price: string;
};

const formatDate = (locale: SupportedLocale, isoDate: string) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));

const orders = [
  [
    "year-ahead-forecast",
    "2026-07-01",
    "Year Ahead Forecast",
    "Report · 38 pages · PDF",
    "delivered",
    "$34",
  ],
  [
    "lunar-phase-candle",
    "2026-06-18",
    "Lunar Phase Candle",
    "Shop · Soy · 40hr",
    "shipped",
    "$22",
  ],
  [
    "natal-blueprint",
    "2026-05-30",
    "The Natal Blueprint",
    "Report · 42 pages · PDF",
    "delivered",
    "$29",
  ],
  [
    "natal-chart-print",
    "2026-05-12",
    "Natal Chart Print",
    "Shop · Framed giclée",
    "delivered",
    "$48",
  ],
  [
    "synastry-deep-dive",
    "2026-04-22",
    "Synastry Deep Dive",
    "Report · 31 pages · PDF",
    "delivered",
    "$32",
  ],
  [
    "moon-journal",
    "2026-03-14",
    "Moon Journal",
    "Shop · Linen bound",
    "delivered",
    "$26",
  ],
  [
    "solar-return-forecast",
    "2026-02-08",
    "Solar Return Forecast",
    "Report · 36 pages · PDF",
    "delivered",
    "$34",
  ],
  [
    "zodiac-card-deck",
    "2026-01-19",
    "Zodiac Card Deck",
    "Shop · 48 cards",
    "delivered",
    "$28",
  ],
  [
    "career-transits",
    "2025-12-03",
    "Career Transits",
    "Report · 24 pages · PDF",
    "delivered",
    "$24",
  ],
  [
    "birth-chart-notebook",
    "2025-11-16",
    "Birth Chart Notebook",
    "Shop · Hardcover",
    "delivered",
    "$20",
  ],
  [
    "relationship-timing",
    "2025-10-27",
    "Relationship Timing",
    "Report · 28 pages · PDF",
    "delivered",
    "$27",
  ],
] as const;

export const prepareAccountOrders = (
  locale: SupportedLocale,
): AccountOrderRecord[] =>
  orders.map(([id, date, title, meta, status, price]) => ({
    id,
    dateLabel: formatDate(locale, date),
    title,
    meta,
    status,
    price,
  }));

const runtimeLabels: Record<
  SupportedLocale,
  {
    report: string;
    shop: string;
    ready: string;
    processing: string;
    paid: string;
    item: string;
    items: string;
  }
> = {
  en: {
    report: "Report",
    shop: "Shop",
    ready: "Ready",
    processing: "Processing",
    paid: "Paid",
    item: "item",
    items: "items",
  },
  es: {
    report: "Informe",
    shop: "Tienda",
    ready: "Listo",
    processing: "En proceso",
    paid: "Pagado",
    item: "artículo",
    items: "artículos",
  },
  fr: {
    report: "Rapport",
    shop: "Boutique",
    ready: "Prêt",
    processing: "En cours",
    paid: "Payé",
    item: "article",
    items: "articles",
  },
  pt: {
    report: "Relatório",
    shop: "Loja",
    ready: "Pronto",
    processing: "Em processamento",
    paid: "Pago",
    item: "item",
    items: "itens",
  },
  ru: {
    report: "Отчёт",
    shop: "Магазин",
    ready: "Готово",
    processing: "В обработке",
    paid: "Оплачено",
    item: "позиция",
    items: "позиций",
  },
  it: {
    report: "Report",
    shop: "Negozio",
    ready: "Pronto",
    processing: "In elaborazione",
    paid: "Pagato",
    item: "articolo",
    items: "articoli",
  },
  de: {
    report: "Bericht",
    shop: "Shop",
    ready: "Bereit",
    processing: "In Bearbeitung",
    paid: "Bezahlt",
    item: "Artikel",
    items: "Artikel",
  },
};

export const prepareAccountOrdersFromRuntime = (
  orders: CommerceOrder[],
  locale: SupportedLocale,
): AccountOrderRecord[] => {
  const labels = runtimeLabels[locale];
  return orders.map((order) => {
    const firstLine = order.lines[0];
    const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
    const ready =
      order.fulfillmentStatus === "ready" ||
      order.fulfillmentStatus === "delivered";
    const title = firstLine?.productName || order.orderNumber;
    return {
      id: order.id,
      dateLabel: new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
      }).format(new Date(order.createdAt)),
      title,
      meta:
        order.orderType === "report"
          ? `${labels.report} · ${order.orderNumber}`
          : `${labels.shop} · ${itemCount} ${itemCount === 1 ? labels.item : labels.items}`,
      status: ready ? "delivered" : "shipped",
      statusLabel: ready
        ? labels.ready
        : order.status === "paid"
          ? labels.processing
          : labels.paid,
      price: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: order.currency,
      }).format(order.totalCents / 100),
    };
  });
};
