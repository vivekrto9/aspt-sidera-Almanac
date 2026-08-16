import type { SupportedLocale } from "../../localization-contract.ts";

export type AccountSeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

const copyByLocale = {
  en: {
    title: "My account | Sidera",
    description: "Manage your Sidera charts, people, orders, sessions, and settings.",
    imageAlt: "Sidera account",
  },
  es: {
    title: "Mi cuenta | Sidera",
    description: "Gestiona tus cartas, personas, pedidos, sesiones y ajustes de Sidera.",
    imageAlt: "Cuenta de Sidera",
  },
  fr: {
    title: "Mon compte | Sidera",
    description: "Gérez vos thèmes, personnes, commandes, consultations et paramètres Sidera.",
    imageAlt: "Compte Sidera",
  },
  pt: {
    title: "Minha conta | Sidera",
    description: "Gerencie seus mapas, pessoas, pedidos, sessões e configurações da Sidera.",
    imageAlt: "Conta Sidera",
  },
  ru: {
    title: "Мой аккаунт | Sidera",
    description: "Управляйте картами, людьми, заказами, сеансами и настройками Sidera.",
    imageAlt: "Аккаунт Sidera",
  },
  it: {
    title: "Il mio account | Sidera",
    description: "Gestisci temi, persone, ordini, sessioni e impostazioni Sidera.",
    imageAlt: "Account Sidera",
  },
  de: {
    title: "Mein Konto | Sidera",
    description: "Verwalten Sie Ihre Sidera-Horoskope, Personen, Bestellungen, Sitzungen und Einstellungen.",
    imageAlt: "Sidera-Konto",
  },
} satisfies Record<SupportedLocale, AccountSeoCopy>;

export const getAccountSeoCopy = (locale: SupportedLocale): AccountSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
