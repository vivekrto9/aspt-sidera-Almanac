import type { SupportedLocale } from "../../localization-contract.ts";

export type TermsSeoCopy = {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
};

const copyByLocale = {
  en: {
    seoTitle: "Terms of Service | Sidera",
    seoDescription:
      "Read the terms that govern your use of Sidera’s astrology tools, reports, wallet payments, and live astrologer sessions.",
    ogTitle: "Terms of Service | Sidera",
    ogDescription:
      "The terms governing Sidera’s astrology tools, reports, wallet payments, and sessions.",
    ogImageAlt: "Sidera Terms of Service",
    twitterTitle: "Terms of Service | Sidera",
    twitterDescription: "Read the terms governing your use of Sidera.",
  },
  es: {
    seoTitle: "Términos del servicio | Sidera",
    seoDescription:
      "Consulta los términos que regulan el uso de las herramientas astrológicas, informes, pagos de cartera y sesiones de Sidera.",
    ogTitle: "Términos del servicio | Sidera",
    ogDescription:
      "Los términos aplicables a las herramientas, informes, pagos de cartera y sesiones de Sidera.",
    ogImageAlt: "Términos del servicio de Sidera",
    twitterTitle: "Términos del servicio | Sidera",
    twitterDescription: "Consulta los términos que regulan el uso de Sidera.",
  },
  fr: {
    seoTitle: "Conditions d’utilisation | Sidera",
    seoDescription:
      "Consultez les conditions qui régissent l’utilisation des outils astrologiques, rapports, paiements du portefeuille et consultations Sidera.",
    ogTitle: "Conditions d’utilisation | Sidera",
    ogDescription:
      "Les conditions applicables aux outils, rapports, paiements du portefeuille et consultations Sidera.",
    ogImageAlt: "Conditions d’utilisation de Sidera",
    twitterTitle: "Conditions d’utilisation | Sidera",
    twitterDescription:
      "Consultez les conditions qui régissent l’utilisation de Sidera.",
  },
  pt: {
    seoTitle: "Termos de Serviço | Sidera",
    seoDescription:
      "Leia os termos que regem o uso das ferramentas astrológicas, relatórios, pagamentos da carteira e consultas da Sidera.",
    ogTitle: "Termos de Serviço | Sidera",
    ogDescription:
      "Os termos aplicáveis às ferramentas, relatórios, pagamentos da carteira e consultas da Sidera.",
    ogImageAlt: "Termos de Serviço da Sidera",
    twitterTitle: "Termos de Serviço | Sidera",
    twitterDescription: "Leia os termos que regem o uso da Sidera.",
  },
  ru: {
    seoTitle: "Условия использования | Sidera",
    seoDescription:
      "Ознакомьтесь с условиями использования астрологических инструментов, отчётов, платежей кошелька и консультаций Sidera.",
    ogTitle: "Условия использования | Sidera",
    ogDescription:
      "Условия использования инструментов, отчётов, платежей кошелька и консультаций Sidera.",
    ogImageAlt: "Условия использования Sidera",
    twitterTitle: "Условия использования | Sidera",
    twitterDescription: "Ознакомьтесь с условиями использования Sidera.",
  },
  it: {
    seoTitle: "Termini di servizio | Sidera",
    seoDescription:
      "Leggi i termini che regolano l’uso degli strumenti astrologici, dei report, dei pagamenti del portafoglio e delle consulenze Sidera.",
    ogTitle: "Termini di servizio | Sidera",
    ogDescription:
      "I termini applicabili agli strumenti, ai report, ai pagamenti del portafoglio e alle consulenze Sidera.",
    ogImageAlt: "Termini di servizio di Sidera",
    twitterTitle: "Termini di servizio | Sidera",
    twitterDescription: "Leggi i termini che regolano l’uso di Sidera.",
  },
  de: {
    seoTitle: "Nutzungsbedingungen | Sidera",
    seoDescription:
      "Lesen Sie die Bedingungen für die Nutzung der Astrologie-Werkzeuge, Berichte, Wallet-Zahlungen und Beratungen von Sidera.",
    ogTitle: "Nutzungsbedingungen | Sidera",
    ogDescription:
      "Die Bedingungen für Sideras Werkzeuge, Berichte, Wallet-Zahlungen und Beratungen.",
    ogImageAlt: "Nutzungsbedingungen von Sidera",
    twitterTitle: "Nutzungsbedingungen | Sidera",
    twitterDescription:
      "Lesen Sie die Bedingungen für die Nutzung von Sidera.",
  },
} satisfies Record<SupportedLocale, TermsSeoCopy>;

export const getTermsSeoCopy = (locale: SupportedLocale): TermsSeoCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
