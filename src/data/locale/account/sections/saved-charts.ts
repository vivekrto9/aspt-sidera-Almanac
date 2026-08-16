import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountSavedChartsCopy = {
  eyebrow: string;
  title: string;
  chartTypes: readonly [string, string, string, string];
  openLabel: string;
  reportLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel: string;
};

const copy: Record<SupportedLocale, AccountSavedChartsCopy> = {
  en: {
    eyebrow: "Saved charts",
    title: "Your charts",
    chartTypes: ["Natal", "Relocation", "Natal · shared", "Solar return"],
    openLabel: "Open",
    reportLabel: "Report",
    emptyTitle: "No saved charts yet",
    emptyDescription:
      "Create your first birth chart and it will be saved here for easy access.",
    emptyActionLabel: "+ Create a chart",
  },
  es: {
    eyebrow: "Cartas guardadas",
    title: "Tus cartas",
    chartTypes: ["Natal", "Reubicación", "Natal · compartida", "Retorno solar"],
    openLabel: "Abrir",
    reportLabel: "Informe",
    emptyTitle: "Aún no hay cartas guardadas",
    emptyDescription:
      "Crea tu primera carta natal y se guardará aquí para acceder fácilmente.",
    emptyActionLabel: "+ Crear una carta",
  },
  fr: {
    eyebrow: "Thèmes enregistrés",
    title: "Vos thèmes",
    chartTypes: [
      "Natal",
      "Relocalisation",
      "Natal · partagé",
      "Révolution solaire",
    ],
    openLabel: "Ouvrir",
    reportLabel: "Rapport",
    emptyTitle: "Aucun thème enregistré",
    emptyDescription:
      "Créez votre premier thème natal : il sera enregistré ici pour un accès facile.",
    emptyActionLabel: "+ Créer un thème",
  },
  pt: {
    eyebrow: "Mapas salvos",
    title: "Seus mapas",
    chartTypes: [
      "Natal",
      "Relocação",
      "Natal · compartilhado",
      "Retorno solar",
    ],
    openLabel: "Abrir",
    reportLabel: "Relatório",
    emptyTitle: "Ainda não há mapas salvos",
    emptyDescription:
      "Crie seu primeiro mapa natal e ele ficará salvo aqui para fácil acesso.",
    emptyActionLabel: "+ Criar um mapa",
  },
  ru: {
    eyebrow: "Сохранённые карты",
    title: "Ваши карты",
    chartTypes: ["Натальная", "Релокация", "Натальная · общая", "Соляр"],
    openLabel: "Открыть",
    reportLabel: "Отчёт",
    emptyTitle: "Сохранённых карт пока нет",
    emptyDescription:
      "Создайте первую натальную карту — она сохранится здесь для быстрого доступа.",
    emptyActionLabel: "+ Создать карту",
  },
  it: {
    eyebrow: "Temi salvati",
    title: "I tuoi temi",
    chartTypes: [
      "Natale",
      "Rilocazione",
      "Natale · condiviso",
      "Rivoluzione solare",
    ],
    openLabel: "Apri",
    reportLabel: "Report",
    emptyTitle: "Nessun tema salvato",
    emptyDescription:
      "Crea il tuo primo tema natale: verrà salvato qui per ritrovarlo facilmente.",
    emptyActionLabel: "+ Crea un tema",
  },
  de: {
    eyebrow: "Gespeicherte Horoskope",
    title: "Ihre Horoskope",
    chartTypes: ["Radix", "Relokation", "Radix · geteilt", "Solarhoroskop"],
    openLabel: "Öffnen",
    reportLabel: "Bericht",
    emptyTitle: "Noch keine Horoskope gespeichert",
    emptyDescription:
      "Erstellen Sie Ihr erstes Geburtshoroskop. Es wird hier für den schnellen Zugriff gespeichert.",
    emptyActionLabel: "+ Horoskop erstellen",
  },
};

export const getAccountSavedChartsCopy = (locale: SupportedLocale) =>
  copy[locale];
