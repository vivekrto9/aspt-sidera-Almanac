import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeReportItem = {
  title: string;
  description: string;
  pagesLabel: string;
  price: string;
  actionLabel: string;
  href?: string;
};

export type HomeReportsCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  browseLabel: string;
  reports: HomeReportItem[];
};

const prices = ["$29", "$34", "$39"] as const;

const reportSet = (
  reports: Array<Omit<HomeReportItem, "price" | "actionLabel">>,
  actionLabel: string,
): HomeReportItem[] =>
  reports.map((report, index) => ({
    ...report,
    price: prices[index],
    actionLabel,
  }));

const copies: Record<SupportedLocale, HomeReportsCopy> = {
  en: {
    eyebrow: "Reports",
    titleAccent: "In-depth",
    titleRest: "written reports.",
    browseLabel: "See all reports",
    reports: reportSet(
      [
        {
          title: "The Natal Blueprint",
          description:
            "Your full birth chart interpreted chapter by chapter — signs, houses, aspects, and the story they tell together.",
          pagesLabel: "42 pages",
        },
        {
          title: "Year Ahead Forecast",
          description:
            "Every major transit to your chart for the next twelve months, timed and translated into plain language.",
          pagesLabel: "38 pages",
        },
        {
          title: "Relationship Synastry",
          description:
            "Two charts, compared. Where you meet, where you stretch, and how the connection actually works.",
          pagesLabel: "31 pages",
        },
      ],
      "Get report",
    ),
  },
  es: {
    eyebrow: "Informes",
    titleAccent: "Informes",
    titleRest: "escritos en profundidad.",
    browseLabel: "Ver todos los informes",
    reports: reportSet(
      [
        {
          title: "El mapa natal",
          description:
            "Tu carta natal completa, interpretada capítulo a capítulo: signos, casas, aspectos y la historia que cuentan juntos.",
          pagesLabel: "42 páginas",
        },
        {
          title: "Pronóstico del año",
          description:
            "Cada tránsito importante de los próximos doce meses, fechado y traducido a un lenguaje claro.",
          pagesLabel: "38 páginas",
        },
        {
          title: "Sinastría de pareja",
          description:
            "Dos cartas comparadas: dónde conectáis, dónde crecéis y cómo funciona realmente el vínculo.",
          pagesLabel: "31 páginas",
        },
      ],
      "Obtener informe",
    ),
  },
  fr: {
    eyebrow: "Rapports",
    titleAccent: "Des rapports",
    titleRest: "écrits approfondis.",
    browseLabel: "Voir tous les rapports",
    reports: reportSet(
      [
        {
          title: "Le plan natal",
          description:
            "Votre thème natal complet, interprété chapitre par chapitre : signes, maisons, aspects et leur récit commun.",
          pagesLabel: "42 pages",
        },
        {
          title: "Prévisions annuelles",
          description:
            "Chaque transit majeur des douze prochains mois, daté et traduit dans un langage clair.",
          pagesLabel: "38 pages",
        },
        {
          title: "Synastrie relationnelle",
          description:
            "Deux thèmes comparés : vos accords, vos défis et le fonctionnement réel de votre relation.",
          pagesLabel: "31 pages",
        },
      ],
      "Obtenir le rapport",
    ),
  },
  pt: {
    eyebrow: "Relatórios",
    titleAccent: "Relatórios",
    titleRest: "escritos em profundidade.",
    browseLabel: "Ver todos os relatórios",
    reports: reportSet(
      [
        {
          title: "O mapa natal",
          description:
            "Seu mapa natal completo, interpretado capítulo a capítulo: signos, casas, aspectos e a história que formam juntos.",
          pagesLabel: "42 páginas",
        },
        {
          title: "Previsão do ano",
          description:
            "Cada trânsito importante dos próximos doze meses, com datas e explicações em linguagem simples.",
          pagesLabel: "38 páginas",
        },
        {
          title: "Sinastria de relacionamento",
          description:
            "Dois mapas comparados: onde vocês se encontram, crescem e como a conexão realmente funciona.",
          pagesLabel: "31 páginas",
        },
      ],
      "Obter relatório",
    ),
  },
  ru: {
    eyebrow: "Отчёты",
    titleAccent: "Подробные",
    titleRest: "письменные отчёты.",
    browseLabel: "Смотреть все отчёты",
    reports: reportSet(
      [
        {
          title: "Натальный портрет",
          description:
            "Полный разбор натальной карты по главам: знаки, дома, аспекты и история, которую они создают вместе.",
          pagesLabel: "42 страницы",
        },
        {
          title: "Прогноз на год",
          description:
            "Все важные транзиты на ближайшие двенадцать месяцев с датами и понятными объяснениями.",
          pagesLabel: "38 страниц",
        },
        {
          title: "Синастрия отношений",
          description:
            "Сравнение двух карт: точки встречи, зоны роста и то, как на самом деле работает ваша связь.",
          pagesLabel: "31 страница",
        },
      ],
      "Получить отчёт",
    ),
  },
  it: {
    eyebrow: "Report",
    titleAccent: "Report",
    titleRest: "scritti e approfonditi.",
    browseLabel: "Vedi tutti i report",
    reports: reportSet(
      [
        {
          title: "Il progetto natale",
          description:
            "La tua carta natale completa, interpretata capitolo per capitolo: segni, case, aspetti e la storia che raccontano.",
          pagesLabel: "42 pagine",
        },
        {
          title: "Previsioni per l'anno",
          description:
            "Ogni transito importante dei prossimi dodici mesi, datato e tradotto in un linguaggio chiaro.",
          pagesLabel: "38 pagine",
        },
        {
          title: "Sinastria di coppia",
          description:
            "Due carte a confronto: dove vi incontrate, dove crescete e come funziona davvero la relazione.",
          pagesLabel: "31 pagine",
        },
      ],
      "Ottieni il report",
    ),
  },
  de: {
    eyebrow: "Berichte",
    titleAccent: "Ausführliche",
    titleRest: "schriftliche Berichte.",
    browseLabel: "Alle Berichte ansehen",
    reports: reportSet(
      [
        {
          title: "Der Geburtsplan",
          description:
            "Dein vollständiges Geburtshoroskop, Kapitel für Kapitel gedeutet: Zeichen, Häuser, Aspekte und ihre gemeinsame Geschichte.",
          pagesLabel: "42 Seiten",
        },
        {
          title: "Jahresvorschau",
          description:
            "Jeder wichtige Transit der nächsten zwölf Monate, zeitlich eingeordnet und verständlich erklärt.",
          pagesLabel: "38 Seiten",
        },
        {
          title: "Beziehungs-Synastrie",
          description:
            "Zwei Horoskope im Vergleich: wo ihr euch begegnet, wachst und wie eure Verbindung wirklich funktioniert.",
          pagesLabel: "31 Seiten",
        },
      ],
      "Bericht erhalten",
    ),
  },
};

export const getHomeReportsCopy = (locale: SupportedLocale): HomeReportsCopy =>
  copies[locale] ?? copies.en;
