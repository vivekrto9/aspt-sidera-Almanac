import type { SupportedLocale } from "../../../localization-contract.ts";

export type ReportsDetailNavigationCopy = {
  backLabel: string;
};

const copyByLocale = {
  en: { backLabel: "All reports" },
  es: { backLabel: "Todos los informes" },
  fr: { backLabel: "Tous les rapports" },
  pt: { backLabel: "Todos os relatórios" },
  ru: { backLabel: "Все отчёты" },
  it: { backLabel: "Tutti i report" },
  de: { backLabel: "Alle Berichte" },
} satisfies Record<SupportedLocale, ReportsDetailNavigationCopy>;

export const getReportsDetailNavigationCopy = (
  locale: SupportedLocale,
): ReportsDetailNavigationCopy => copyByLocale[locale] ?? copyByLocale.en;
