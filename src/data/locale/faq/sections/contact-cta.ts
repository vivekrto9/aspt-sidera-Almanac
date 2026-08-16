import type { SupportedLocale } from "../../../localization-contract.ts";

export type FaqContactCtaCopy = {
  title: string;
  description: string;
  actionLabel: string;
};

const copy: Record<SupportedLocale, FaqContactCtaCopy> = {
  en: {
    title: "Still have a question?",
    description: "We answer within a day, usually much less.",
    actionLabel: "Talk to us",
  },
  es: {
    title: "¿Todavía tienes una pregunta?",
    description: "Respondemos en un día, normalmente mucho antes.",
    actionLabel: "Habla con nosotros",
  },
  fr: {
    title: "Vous avez encore une question ?",
    description: "Nous répondons sous un jour, généralement bien avant.",
    actionLabel: "Parlez-nous",
  },
  pt: {
    title: "Ainda tem alguma pergunta?",
    description: "Respondemos em até um dia, geralmente bem antes.",
    actionLabel: "Fale conosco",
  },
  ru: {
    title: "Остались вопросы?",
    description: "Мы отвечаем в течение дня, обычно гораздо быстрее.",
    actionLabel: "Связаться с нами",
  },
  it: {
    title: "Hai ancora una domanda?",
    description: "Rispondiamo entro un giorno, di solito molto prima.",
    actionLabel: "Parla con noi",
  },
  de: {
    title: "Noch eine Frage?",
    description: "Wir antworten innerhalb eines Tages, meistens viel schneller.",
    actionLabel: "Sprich mit uns",
  },
};

export const getFaqContactCtaCopy = (
  locale: SupportedLocale,
): FaqContactCtaCopy => copy[locale] ?? copy.en;
