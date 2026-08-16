import type { SupportedLocale } from "../../../localization-contract.ts";

export type BirthChartNatalReportHandoffCopy = {
  report_eyebrow: string;
  report_title: string;
  report_description: string;
  report_primary_label: string;
  report_secondary_label: string;
};

const localized = {
  en: {
    report_eyebrow: "Go deeper",
    report_title: "The Natal Blueprint — your chart, chapter by chapter.",
    report_description:
      "42 pages interpreting every sign, house, and aspect in plain language. Yours to keep.",
    report_primary_label: "Get the full report · $29",
    report_secondary_label: "Cast another chart",
  },
  es: {
    report_eyebrow: "Ve más allá",
    report_title: "El plano natal — tu carta, capítulo a capítulo.",
    report_description:
      "42 páginas que interpretan cada signo, casa y aspecto con un lenguaje claro. Para conservar.",
    report_primary_label: "Obtén el informe completo · $29",
    report_secondary_label: "Crear otra carta",
  },
  fr: {
    report_eyebrow: "Allez plus loin",
    report_title: "Le plan natal — votre thème, chapitre par chapitre.",
    report_description:
      "42 pages pour interpréter chaque signe, maison et aspect en termes clairs. À conserver.",
    report_primary_label: "Obtenir le rapport complet · 29 $",
    report_secondary_label: "Créer un autre thème",
  },
  pt: {
    report_eyebrow: "Aprofunde-se",
    report_title: "O plano natal — seu mapa, capítulo por capítulo.",
    report_description:
      "42 páginas interpretando cada signo, casa e aspecto em linguagem clara. Para guardar.",
    report_primary_label: "Obter o relatório completo · $29",
    report_secondary_label: "Criar outro mapa",
  },
  ru: {
    report_eyebrow: "Узнайте больше",
    report_title: "Натальный план — ваша карта, глава за главой.",
    report_description:
      "42 страницы с понятным толкованием каждого знака, дома и аспекта. Ваш личный отчёт.",
    report_primary_label: "Получить полный отчёт · $29",
    report_secondary_label: "Построить другую карту",
  },
  it: {
    report_eyebrow: "Vai più a fondo",
    report_title: "Il progetto natale — il tuo tema, capitolo per capitolo.",
    report_description:
      "42 pagine che interpretano ogni segno, casa e aspetto con parole chiare. Da conservare.",
    report_primary_label: "Ottieni il rapporto completo · $29",
    report_secondary_label: "Crea un altro tema",
  },
  de: {
    report_eyebrow: "Geh tiefer",
    report_title: "Der Geburtsplan — dein Horoskop, Kapitel für Kapitel.",
    report_description:
      "42 Seiten, die jedes Zeichen, Haus und jeden Aspekt verständlich deuten. Für dich zum Behalten.",
    report_primary_label: "Vollständigen Bericht erhalten · $29",
    report_secondary_label: "Weiteres Horoskop erstellen",
  },
} satisfies Record<SupportedLocale, BirthChartNatalReportHandoffCopy>;

export const getBirthChartNatalReportHandoffCopy = (
  locale: SupportedLocale,
): BirthChartNatalReportHandoffCopy =>
  localized[locale] ?? localized.en;
