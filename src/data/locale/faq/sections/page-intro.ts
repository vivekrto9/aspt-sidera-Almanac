import type { SupportedLocale } from "../../../localization-contract.ts";

export type FaqPageIntroCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  description: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Help",
    titleLead: "Frequently asked",
    titleEmphasis: "questions.",
    description:
      "Everything about charts, accuracy, billing and readings. Still stuck? Reach us any time.",
  },
  es: {
    eyebrow: "Ayuda",
    titleLead: "Preguntas",
    titleEmphasis: "frecuentes.",
    description:
      "Todo sobre cartas, precisión, facturación y lecturas. ¿Aún necesitas ayuda? Escríbenos cuando quieras.",
  },
  fr: {
    eyebrow: "Aide",
    titleLead: "Questions",
    titleEmphasis: "fréquentes.",
    description:
      "Tout savoir sur les thèmes, la précision, la facturation et les consultations. Besoin d’aide ? Écrivez-nous à tout moment.",
  },
  pt: {
    eyebrow: "Ajuda",
    titleLead: "Perguntas",
    titleEmphasis: "frequentes.",
    description:
      "Tudo sobre mapas, precisão, cobrança e leituras. Ainda precisa de ajuda? Fale conosco quando quiser.",
  },
  ru: {
    eyebrow: "Помощь",
    titleLead: "Частые",
    titleEmphasis: "вопросы.",
    description:
      "Всё о картах, точности, оплате и консультациях. Остались вопросы? Напишите нам в любое время.",
  },
  it: {
    eyebrow: "Aiuto",
    titleLead: "Domande",
    titleEmphasis: "frequenti.",
    description:
      "Tutto su temi, precisione, pagamenti e consulti. Hai ancora dubbi? Scrivici quando vuoi.",
  },
  de: {
    eyebrow: "Hilfe",
    titleLead: "Häufig gestellte",
    titleEmphasis: "Fragen.",
    description:
      "Alles über Horoskope, Genauigkeit, Abrechnung und Deutungen. Noch Fragen? Schreib uns jederzeit.",
  },
} satisfies Record<SupportedLocale, FaqPageIntroCopy>;

export const getFaqPageIntroCopy = (
  locale: SupportedLocale,
): FaqPageIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
