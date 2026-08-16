import type { SupportedLocale } from "../../../localization-contract.ts";

export type SynastryRelationshipReportHandoffCopy = {
  report_eyebrow: string;
  report_title: string;
  report_description: string;
  report_primary_label: string;
  report_secondary_label: string;
};

const copyByLocale = {
  en: {
    report_eyebrow: "Go deeper",
    report_title:
      "The Relationship Synastry report — every contact, in full.",
    report_description:
      "31 pages on how the two of you actually work: attraction, communication, conflict, and the long arc.",
    report_primary_label: "Get the full report · $39",
    report_secondary_label: "Compare another pair",
  },
  es: {
    report_eyebrow: "Ve más allá",
    report_title:
      "El informe de sinastría de pareja — cada contacto, al completo.",
    report_description:
      "31 páginas sobre cómo funcionan realmente: atracción, comunicación, conflicto y evolución a largo plazo.",
    report_primary_label: "Obtén el informe completo · $39",
    report_secondary_label: "Comparar otra pareja",
  },
  fr: {
    report_eyebrow: "Allez plus loin",
    report_title:
      "Le rapport de synastrie relationnelle — chaque contact, en détail.",
    report_description:
      "31 pages sur votre fonctionnement réel : attirance, communication, conflit et évolution à long terme.",
    report_primary_label: "Obtenir le rapport complet · 39 $",
    report_secondary_label: "Comparer un autre duo",
  },
  pt: {
    report_eyebrow: "Aprofunde-se",
    report_title:
      "O relatório de sinastria do relacionamento — cada contato, por completo.",
    report_description:
      "31 páginas sobre como vocês realmente funcionam: atração, comunicação, conflito e o caminho a longo prazo.",
    report_primary_label: "Obter o relatório completo · $39",
    report_secondary_label: "Comparar outro par",
  },
  ru: {
    report_eyebrow: "Узнайте больше",
    report_title:
      "Отчёт о синастрии отношений — каждый контакт во всех деталях.",
    report_description:
      "31 страница о том, как вы взаимодействуете: притяжение, общение, конфликты и долгосрочная динамика.",
    report_primary_label: "Получить полный отчёт · $39",
    report_secondary_label: "Сравнить другую пару",
  },
  it: {
    report_eyebrow: "Vai più a fondo",
    report_title:
      "Il rapporto di sinastria relazionale — ogni contatto, per intero.",
    report_description:
      "31 pagine su come funzionate davvero: attrazione, comunicazione, conflitto e sviluppo nel tempo.",
    report_primary_label: "Ottieni il rapporto completo · $39",
    report_secondary_label: "Confronta un'altra coppia",
  },
  de: {
    report_eyebrow: "Geh tiefer",
    report_title:
      "Der Beziehungs-Synastriebericht — jeder Kontakt im Detail.",
    report_description:
      "31 Seiten darüber, wie ihr wirklich miteinander funktioniert: Anziehung, Kommunikation, Konflikt und langfristige Entwicklung.",
    report_primary_label: "Vollständigen Bericht erhalten · $39",
    report_secondary_label: "Ein weiteres Paar vergleichen",
  },
} satisfies Record<SupportedLocale, SynastryRelationshipReportHandoffCopy>;

export const getSynastryRelationshipReportHandoffCopy = (
  locale: SupportedLocale,
): SynastryRelationshipReportHandoffCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
