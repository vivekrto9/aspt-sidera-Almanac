import type { SupportedLocale } from "../../../localization-contract.ts";

export type ReportsCatalogGridCopy = {
  ariaLabel: string;
  actionLabel: string;
  reports: Array<{
    title: string;
    description: string;
  }>;
};

const copies = {
  en: {
    ariaLabel: "Astrology report catalog",
    actionLabel: "View sample",
    reports: [
      {
        title: "The Natal Blueprint",
        description:
          "Your full birth chart, interpreted chapter by chapter — signs, houses, aspects, and the story they tell together.",
      },
      {
        title: "Year Ahead Forecast",
        description:
          "Every major transit to your chart for the next twelve months, timed and translated into plain language.",
      },
      {
        title: "Relationship Synastry",
        description:
          "Two charts, compared. Where you meet, where you stretch, and how the connection actually works.",
      },
      {
        title: "Solar Return Report",
        description:
          "Your personal year, from birthday to birthday — themes, timing and the chart of your return.",
      },
      {
        title: "Career & Vocation",
        description:
          "Your Midheaven, tenth house and vocational signatures — what you are built to do, and how.",
      },
      {
        title: "Saturn Return Report",
        description:
          "The defining passage of your late twenties — what Saturn is asking you to build, end and become.",
      },
    ],
  },
  es: {
    ariaLabel: "Catálogo de informes astrológicos",
    actionLabel: "Ver muestra",
    reports: [
      {
        title: "El mapa natal",
        description:
          "Tu carta natal completa, interpretada capítulo a capítulo: signos, casas, aspectos y la historia que cuentan juntos.",
      },
      {
        title: "Pronóstico del año",
        description:
          "Cada tránsito importante de los próximos doce meses, fechado y traducido a un lenguaje claro.",
      },
      {
        title: "Sinastría de pareja",
        description:
          "Dos cartas comparadas: dónde conectáis, dónde crecéis y cómo funciona realmente el vínculo.",
      },
      {
        title: "Informe de retorno solar",
        description:
          "Tu año personal, de cumpleaños a cumpleaños: temas, momentos clave y la carta de tu retorno.",
      },
      {
        title: "Carrera y vocación",
        description:
          "Tu Medio Cielo, la casa diez y las firmas vocacionales: para qué estás hecho y cómo expresarlo.",
      },
      {
        title: "Informe del retorno de Saturno",
        description:
          "El paso decisivo del final de tus veinte: lo que Saturno te pide construir, cerrar y llegar a ser.",
      },
    ],
  },
  fr: {
    ariaLabel: "Catalogue de rapports astrologiques",
    actionLabel: "Voir un extrait",
    reports: [
      {
        title: "Le plan natal",
        description:
          "Votre thème natal complet, interprété chapitre par chapitre : signes, maisons, aspects et leur récit commun.",
      },
      {
        title: "Prévisions annuelles",
        description:
          "Chaque transit majeur des douze prochains mois, daté et traduit dans un langage clair.",
      },
      {
        title: "Synastrie relationnelle",
        description:
          "Deux thèmes comparés : vos accords, vos défis et le fonctionnement réel de votre relation.",
      },
      {
        title: "Rapport de révolution solaire",
        description:
          "Votre année personnelle, d’anniversaire en anniversaire : thèmes, périodes et thème de retour.",
      },
      {
        title: "Carrière et vocation",
        description:
          "Votre Milieu du Ciel, votre maison dix et vos signatures professionnelles : votre voie et votre manière.",
      },
      {
        title: "Rapport du retour de Saturne",
        description:
          "Le passage fondateur de la fin de la vingtaine : ce que Saturne vous demande de bâtir, clore et devenir.",
      },
    ],
  },
  pt: {
    ariaLabel: "Catálogo de relatórios astrológicos",
    actionLabel: "Ver amostra",
    reports: [
      {
        title: "O mapa natal",
        description:
          "Seu mapa natal completo, interpretado capítulo a capítulo: signos, casas, aspectos e a história que formam juntos.",
      },
      {
        title: "Previsão do ano",
        description:
          "Cada trânsito importante dos próximos doze meses, com datas e explicações em linguagem simples.",
      },
      {
        title: "Sinastria de relacionamento",
        description:
          "Dois mapas comparados: onde vocês se encontram, crescem e como a conexão realmente funciona.",
      },
      {
        title: "Relatório de retorno solar",
        description:
          "Seu ano pessoal, de aniversário a aniversário: temas, momentos e o mapa do seu retorno.",
      },
      {
        title: "Carreira e vocação",
        description:
          "Seu Meio do Céu, a décima casa e as assinaturas vocacionais: o que você veio fazer e como.",
      },
      {
        title: "Relatório do retorno de Saturno",
        description:
          "A passagem marcante do fim dos vinte: o que Saturno pede que você construa, encerre e se torne.",
      },
    ],
  },
  ru: {
    ariaLabel: "Каталог астрологических отчётов",
    actionLabel: "Посмотреть пример",
    reports: [
      {
        title: "Натальный портрет",
        description:
          "Полный разбор натальной карты по главам: знаки, дома, аспекты и история, которую они создают вместе.",
      },
      {
        title: "Прогноз на год",
        description:
          "Все важные транзиты на ближайшие двенадцать месяцев с датами и понятными объяснениями.",
      },
      {
        title: "Синастрия отношений",
        description:
          "Сравнение двух карт: точки встречи, зоны роста и то, как на самом деле работает ваша связь.",
      },
      {
        title: "Отчёт о соляре",
        description:
          "Ваш личный год от дня рождения до дня рождения: темы, сроки и карта солнечного возвращения.",
      },
      {
        title: "Карьера и призвание",
        description:
          "Ваш МС, десятый дом и профессиональные показатели: к чему вы созданы и как это реализовать.",
      },
      {
        title: "Отчёт о возвращении Сатурна",
        description:
          "Определяющий переход конца двадцатых: что Сатурн просит построить, завершить и кем стать.",
      },
    ],
  },
  it: {
    ariaLabel: "Catalogo dei report astrologici",
    actionLabel: "Vedi estratto",
    reports: [
      {
        title: "Il progetto natale",
        description:
          "La tua carta natale completa, interpretata capitolo per capitolo: segni, case, aspetti e la storia che raccontano.",
      },
      {
        title: "Previsioni per l'anno",
        description:
          "Ogni transito importante dei prossimi dodici mesi, datato e tradotto in un linguaggio chiaro.",
      },
      {
        title: "Sinastria di coppia",
        description:
          "Due carte a confronto: dove vi incontrate, dove crescete e come funziona davvero la relazione.",
      },
      {
        title: "Report di rivoluzione solare",
        description:
          "Il tuo anno personale, da compleanno a compleanno: temi, tempi e carta del ritorno.",
      },
      {
        title: "Carriera e vocazione",
        description:
          "Il tuo Medio Cielo, la decima casa e le firme vocazionali: ciò che sei portato a fare e come.",
      },
      {
        title: "Report del ritorno di Saturno",
        description:
          "Il passaggio decisivo della fine dei vent’anni: ciò che Saturno ti chiede di costruire, chiudere e diventare.",
      },
    ],
  },
  de: {
    ariaLabel: "Katalog astrologischer Berichte",
    actionLabel: "Beispiel ansehen",
    reports: [
      {
        title: "Der Geburtsplan",
        description:
          "Dein vollständiges Geburtshoroskop, Kapitel für Kapitel gedeutet: Zeichen, Häuser, Aspekte und ihre gemeinsame Geschichte.",
      },
      {
        title: "Jahresvorschau",
        description:
          "Jeder wichtige Transit der nächsten zwölf Monate, zeitlich eingeordnet und klar übersetzt.",
      },
      {
        title: "Beziehungssynastrie",
        description:
          "Zwei Horoskope im Vergleich: wo ihr euch begegnet, wachst und wie eure Verbindung wirklich funktioniert.",
      },
      {
        title: "Solar-Return-Bericht",
        description:
          "Dein persönliches Jahr von Geburtstag zu Geburtstag: Themen, Zeitpunkte und das Horoskop deiner Rückkehr.",
      },
      {
        title: "Karriere und Berufung",
        description:
          "Dein Medium Coeli, zehntes Haus und berufliche Signaturen: wofür du gemacht bist und wie du es lebst.",
      },
      {
        title: "Saturn-Return-Bericht",
        description:
          "Der prägende Übergang Ende zwanzig: was Saturn dich aufbauen, beenden und werden lässt.",
      },
    ],
  },
} satisfies Record<SupportedLocale, ReportsCatalogGridCopy>;

export const getReportsCatalogGridCopy = (
  locale: SupportedLocale,
): ReportsCatalogGridCopy => copies[locale] ?? copies.en;
