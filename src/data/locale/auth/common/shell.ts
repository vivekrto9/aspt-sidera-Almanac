import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthShellCopy = {
  brandLabel: string;
  brandAriaLabel: string;
  backLabel: string;
  kicker: string;
  title: string;
  description: string;
  perks: Array<{ icon: string; label: string }>;
};

const copyByLocale = {
  en: {
    brandLabel: "Sidera",
    brandAriaLabel: "Sidera home",
    backLabel: "Back to Sidera",
    kicker: "Your account",
    title: "Your sky,\nsaved and waiting.",
    description:
      "Sign in to reach your charts, the people you track, saved readings, and every report you own — all in one place.",
    perks: [
      { icon: "✦", label: "1.2M charts cast" },
      { icon: "✦", label: "Swiss Ephemeris" },
    ],
  },
  es: {
    brandLabel: "Sidera",
    brandAriaLabel: "Inicio de Sidera",
    backLabel: "Volver a Sidera",
    kicker: "Tu cuenta",
    title: "Tu cielo,\nguardado y esperándote.",
    description:
      "Inicia sesión para acceder a tus cartas, las personas que sigues, las lecturas guardadas y todos tus informes, todo en un solo lugar.",
    perks: [
      { icon: "✦", label: "1,2 M de cartas calculadas" },
      { icon: "✦", label: "Efemérides suizas" },
    ],
  },
  fr: {
    brandLabel: "Sidera",
    brandAriaLabel: "Accueil Sidera",
    backLabel: "Retour à Sidera",
    kicker: "Votre compte",
    title: "Votre ciel,\nenregistré et prêt.",
    description:
      "Connectez-vous pour retrouver vos thèmes, les personnes suivies, vos lectures enregistrées et tous vos rapports, au même endroit.",
    perks: [
      { icon: "✦", label: "1,2 M de thèmes calculés" },
      { icon: "✦", label: "Éphémérides suisses" },
    ],
  },
  pt: {
    brandLabel: "Sidera",
    brandAriaLabel: "Início da Sidera",
    backLabel: "Voltar à Sidera",
    kicker: "Sua conta",
    title: "Seu céu,\nsalvo e à sua espera.",
    description:
      "Entre para acessar seus mapas, as pessoas que acompanha, leituras salvas e todos os relatórios adquiridos, tudo em um só lugar.",
    perks: [
      { icon: "✦", label: "1,2 mi de mapas calculados" },
      { icon: "✦", label: "Efemérides suíças" },
    ],
  },
  ru: {
    brandLabel: "Sidera",
    brandAriaLabel: "Главная Sidera",
    backLabel: "Вернуться в Sidera",
    kicker: "Ваш аккаунт",
    title: "Ваше небо\nсохранено и ждёт.",
    description:
      "Войдите, чтобы открыть свои карты, сохранённых людей, выбранные материалы и все приобретённые отчёты в одном месте.",
    perks: [
      { icon: "✦", label: "Построено 1,2 млн карт" },
      { icon: "✦", label: "Швейцарские эфемериды" },
    ],
  },
  it: {
    brandLabel: "Sidera",
    brandAriaLabel: "Home di Sidera",
    backLabel: "Torna a Sidera",
    kicker: "Il tuo account",
    title: "Il tuo cielo,\nsalvato e pronto.",
    description:
      "Accedi per ritrovare i tuoi temi, le persone che segui, le letture salvate e tutti i rapporti acquistati, tutto in un unico posto.",
    perks: [
      { icon: "✦", label: "1,2 M di temi calcolati" },
      { icon: "✦", label: "Effemeridi svizzere" },
    ],
  },
  de: {
    brandLabel: "Sidera",
    brandAriaLabel: "Sidera Startseite",
    backLabel: "Zurück zu Sidera",
    kicker: "Dein Konto",
    title: "Dein Himmel,\ngespeichert und bereit.",
    description:
      "Melde dich an und öffne deine Horoskope, gespeicherten Personen, Lesungen und alle gekauften Berichte an einem Ort.",
    perks: [
      { icon: "✦", label: "1,2 Mio. Horoskope berechnet" },
      { icon: "✦", label: "Schweizer Ephemeriden" },
    ],
  },
} satisfies Record<SupportedLocale, AuthShellCopy>;

export const getAuthShellCopy = (locale: SupportedLocale): AuthShellCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
