import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthSignupShellCopy = {
  kicker: string;
  title: string;
  description: string;
  formLabel: string;
};

const copyByLocale = {
  en: {
    kicker: "Create your account",
    title: "Your sky,\nready to stay with you.",
    description:
      "Create a Sidera account to save your charts, follow the people in your orbit, keep readings, and return to every report you own.",
    formLabel: "Create your Sidera account",
  },
  es: {
    kicker: "Crea tu cuenta",
    title: "Tu cielo,\nlisto para acompañarte.",
    description:
      "Crea una cuenta de Sidera para guardar tus cartas, seguir a las personas de tu órbita, conservar lecturas y volver a todos tus informes.",
    formLabel: "Crea tu cuenta de Sidera",
  },
  fr: {
    kicker: "Créez votre compte",
    title: "Votre ciel,\nprêt à vous accompagner.",
    description:
      "Créez un compte Sidera pour enregistrer vos thèmes, suivre les personnes de votre univers, conserver vos lectures et retrouver tous vos rapports.",
    formLabel: "Créer votre compte Sidera",
  },
  pt: {
    kicker: "Crie sua conta",
    title: "Seu céu,\npronto para seguir com você.",
    description:
      "Crie uma conta Sidera para salvar seus mapas, acompanhar as pessoas da sua órbita, guardar leituras e voltar a todos os seus relatórios.",
    formLabel: "Crie sua conta Sidera",
  },
  ru: {
    kicker: "Создайте аккаунт",
    title: "Ваше небо\nвсегда рядом.",
    description:
      "Создайте аккаунт Sidera, чтобы сохранять карты, следить за важными людьми, хранить материалы и возвращаться ко всем своим отчётам.",
    formLabel: "Создать аккаунт Sidera",
  },
  it: {
    kicker: "Crea il tuo account",
    title: "Il tuo cielo,\npronto a restare con te.",
    description:
      "Crea un account Sidera per salvare i tuoi temi, seguire le persone nella tua orbita, conservare le letture e ritrovare tutti i tuoi rapporti.",
    formLabel: "Crea il tuo account Sidera",
  },
  de: {
    kicker: "Erstelle dein Konto",
    title: "Dein Himmel,\nbereit, dich zu begleiten.",
    description:
      "Erstelle ein Sidera-Konto, um Horoskope zu speichern, Menschen in deinem Umfeld zu verfolgen, Deutungen aufzubewahren und alle Berichte wiederzufinden.",
    formLabel: "Erstelle dein Sidera-Konto",
  },
} satisfies Record<SupportedLocale, AuthSignupShellCopy>;

export const getAuthSignupShellCopy = (
  locale: SupportedLocale,
): AuthSignupShellCopy => copyByLocale[locale] ?? copyByLocale.en;
