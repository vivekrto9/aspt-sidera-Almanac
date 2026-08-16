import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountShellNavigationCopy = {
  navigationLabel: string;
  overviewLabel: string;
  chartsLabel: string;
  peopleLabel: string;
  ordersLabel: string;
  sessionsLabel: string;
  settingsLabel: string;
  signOutLabel: string;
  memberLabel: string;
  risingLabel: string;
};

const copyByLocale = {
  en: {
    navigationLabel: "Account navigation",
    overviewLabel: "Overview",
    chartsLabel: "Saved charts",
    peopleLabel: "People",
    ordersLabel: "Orders",
    sessionsLabel: "Sessions",
    settingsLabel: "Settings",
    signOutLabel: "Sign out",
    memberLabel: "Star member",
    risingLabel: "Scorpio rising",
  },
  es: {
    navigationLabel: "Navegación de la cuenta",
    overviewLabel: "Resumen",
    chartsLabel: "Cartas guardadas",
    peopleLabel: "Personas",
    ordersLabel: "Pedidos",
    sessionsLabel: "Sesiones",
    settingsLabel: "Ajustes",
    signOutLabel: "Cerrar sesión",
    memberLabel: "Miembro Estrella",
    risingLabel: "Ascendente Escorpio",
  },
  fr: {
    navigationLabel: "Navigation du compte",
    overviewLabel: "Aperçu",
    chartsLabel: "Thèmes sauvegardés",
    peopleLabel: "Personnes",
    ordersLabel: "Commandes",
    sessionsLabel: "Consultations",
    settingsLabel: "Paramètres",
    signOutLabel: "Se déconnecter",
    memberLabel: "Membre Étoile",
    risingLabel: "Ascendant Scorpion",
  },
  pt: {
    navigationLabel: "Navegação da conta",
    overviewLabel: "Visão geral",
    chartsLabel: "Mapas salvos",
    peopleLabel: "Pessoas",
    ordersLabel: "Pedidos",
    sessionsLabel: "Sessões",
    settingsLabel: "Configurações",
    signOutLabel: "Sair",
    memberLabel: "Membro Estrela",
    risingLabel: "Ascendente em Escorpião",
  },
  ru: {
    navigationLabel: "Навигация по аккаунту",
    overviewLabel: "Обзор",
    chartsLabel: "Сохранённые карты",
    peopleLabel: "Люди",
    ordersLabel: "Заказы",
    sessionsLabel: "Сеансы",
    settingsLabel: "Настройки",
    signOutLabel: "Выйти",
    memberLabel: "Тариф «Звезда»",
    risingLabel: "Асцендент в Скорпионе",
  },
  it: {
    navigationLabel: "Navigazione dell’account",
    overviewLabel: "Panoramica",
    chartsLabel: "Temi salvati",
    peopleLabel: "Persone",
    ordersLabel: "Ordini",
    sessionsLabel: "Sessioni",
    settingsLabel: "Impostazioni",
    signOutLabel: "Esci",
    memberLabel: "Membro Stella",
    risingLabel: "Ascendente Scorpione",
  },
  de: {
    navigationLabel: "Kontonavigation",
    overviewLabel: "Übersicht",
    chartsLabel: "Gespeicherte Horoskope",
    peopleLabel: "Personen",
    ordersLabel: "Bestellungen",
    sessionsLabel: "Sitzungen",
    settingsLabel: "Einstellungen",
    signOutLabel: "Abmelden",
    memberLabel: "Stern-Mitglied",
    risingLabel: "Aszendent Skorpion",
  },
} satisfies Record<SupportedLocale, AccountShellNavigationCopy>;

export const getAccountShellNavigationCopy = (
  locale: SupportedLocale,
): AccountShellNavigationCopy => copyByLocale[locale] ?? copyByLocale.en;
