import type { SupportedLocale } from "../../../localization-contract.ts";

export type PrivacyLegalIntroCopy = {
  eyebrow: string;
  title: string;
  updatedLabel: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updatedLabel: "Last updated July 1, 2026",
  },
  es: {
    eyebrow: "Información legal",
    title: "Política de privacidad",
    updatedLabel: "Última actualización: 1 de julio de 2026",
  },
  fr: {
    eyebrow: "Informations juridiques",
    title: "Politique de confidentialité",
    updatedLabel: "Dernière mise à jour : 1er juillet 2026",
  },
  pt: {
    eyebrow: "Informações jurídicas",
    title: "Política de privacidade",
    updatedLabel: "Última atualização em 1º de julho de 2026",
  },
  ru: {
    eyebrow: "Правовая информация",
    title: "Политика конфиденциальности",
    updatedLabel: "Последнее обновление: 1 июля 2026 г.",
  },
  it: {
    eyebrow: "Informazioni legali",
    title: "Informativa sulla privacy",
    updatedLabel: "Ultimo aggiornamento: 1 luglio 2026",
  },
  de: {
    eyebrow: "Rechtliches",
    title: "Datenschutzerklärung",
    updatedLabel: "Zuletzt aktualisiert am 1. Juli 2026",
  },
} satisfies Record<SupportedLocale, PrivacyLegalIntroCopy>;

export const getPrivacyLegalIntroCopy = (
  locale: SupportedLocale,
): PrivacyLegalIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
