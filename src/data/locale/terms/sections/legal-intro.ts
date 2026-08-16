import type { SupportedLocale } from "../../../localization-contract.ts";

export type TermsLegalIntroCopy = {
  eyebrow: string;
  title: string;
  updatedLabel: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Legal",
    title: "Terms of Service",
    updatedLabel: "Last updated July 1, 2026",
  },
  es: {
    eyebrow: "Información legal",
    title: "Términos del servicio",
    updatedLabel: "Última actualización: 1 de julio de 2026",
  },
  fr: {
    eyebrow: "Informations juridiques",
    title: "Conditions d’utilisation",
    updatedLabel: "Dernière mise à jour : 1er juillet 2026",
  },
  pt: {
    eyebrow: "Informações jurídicas",
    title: "Termos de Serviço",
    updatedLabel: "Última atualização em 1º de julho de 2026",
  },
  ru: {
    eyebrow: "Правовая информация",
    title: "Условия использования",
    updatedLabel: "Последнее обновление: 1 июля 2026 г.",
  },
  it: {
    eyebrow: "Informazioni legali",
    title: "Termini di servizio",
    updatedLabel: "Ultimo aggiornamento: 1 luglio 2026",
  },
  de: {
    eyebrow: "Rechtliches",
    title: "Nutzungsbedingungen",
    updatedLabel: "Zuletzt aktualisiert am 1. Juli 2026",
  },
} satisfies Record<SupportedLocale, TermsLegalIntroCopy>;

export const getTermsLegalIntroCopy = (
  locale: SupportedLocale,
): TermsLegalIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
