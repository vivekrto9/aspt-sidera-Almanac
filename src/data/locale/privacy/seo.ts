import type { SupportedLocale } from "../../localization-contract.ts";

export type PrivacySeoCopy = {
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
    seoTitle: "Privacy Policy | Sidera",
    seoDescription:
      "Learn what information Sidera collects, how it is used, and the choices you have over your account and birth data.",
    ogTitle: "Privacy Policy | Sidera",
    ogDescription:
      "How Sidera protects your account, birth data, and privacy choices.",
    ogImageAlt: "Sidera Privacy Policy",
    twitterTitle: "Privacy Policy | Sidera",
    twitterDescription:
      "Learn how Sidera protects your information and privacy choices.",
  },
  es: {
    seoTitle: "Política de privacidad | Sidera",
    seoDescription:
      "Descubre qué información recopila Sidera, cómo la utiliza y qué opciones tienes sobre tu cuenta y tus datos de nacimiento.",
    ogTitle: "Política de privacidad | Sidera",
    ogDescription:
      "Cómo protege Sidera tu cuenta, tus datos de nacimiento y tus opciones de privacidad.",
    ogImageAlt: "Política de privacidad de Sidera",
    twitterTitle: "Política de privacidad | Sidera",
    twitterDescription:
      "Descubre cómo protege Sidera tu información y tus opciones de privacidad.",
  },
  fr: {
    seoTitle: "Politique de confidentialité | Sidera",
    seoDescription:
      "Découvrez les informations recueillies par Sidera, leur utilisation et vos choix concernant votre compte et vos données de naissance.",
    ogTitle: "Politique de confidentialité | Sidera",
    ogDescription:
      "Comment Sidera protège votre compte, vos données de naissance et vos choix de confidentialité.",
    ogImageAlt: "Politique de confidentialité de Sidera",
    twitterTitle: "Politique de confidentialité | Sidera",
    twitterDescription:
      "Découvrez comment Sidera protège vos informations et vos choix de confidentialité.",
  },
  pt: {
    seoTitle: "Política de privacidade | Sidera",
    seoDescription:
      "Saiba quais informações a Sidera coleta, como as utiliza e quais escolhas você tem sobre sua conta e seus dados de nascimento.",
    ogTitle: "Política de privacidade | Sidera",
    ogDescription:
      "Como a Sidera protege sua conta, seus dados de nascimento e suas escolhas de privacidade.",
    ogImageAlt: "Política de privacidade da Sidera",
    twitterTitle: "Política de privacidade | Sidera",
    twitterDescription:
      "Saiba como a Sidera protege suas informações e escolhas de privacidade.",
  },
  ru: {
    seoTitle: "Политика конфиденциальности | Sidera",
    seoDescription:
      "Узнайте, какие данные собирает Sidera, как они используются и как вы можете управлять данными аккаунта и рождения.",
    ogTitle: "Политика конфиденциальности | Sidera",
    ogDescription:
      "Как Sidera защищает ваш аккаунт, данные рождения и настройки конфиденциальности.",
    ogImageAlt: "Политика конфиденциальности Sidera",
    twitterTitle: "Политика конфиденциальности | Sidera",
    twitterDescription:
      "Узнайте, как Sidera защищает ваши данные и настройки конфиденциальности.",
  },
  it: {
    seoTitle: "Informativa sulla privacy | Sidera",
    seoDescription:
      "Scopri quali informazioni raccoglie Sidera, come le utilizza e quali scelte hai per il tuo account e i dati di nascita.",
    ogTitle: "Informativa sulla privacy | Sidera",
    ogDescription:
      "Come Sidera protegge il tuo account, i dati di nascita e le tue scelte sulla privacy.",
    ogImageAlt: "Informativa sulla privacy di Sidera",
    twitterTitle: "Informativa sulla privacy | Sidera",
    twitterDescription:
      "Scopri come Sidera protegge le tue informazioni e le tue scelte sulla privacy.",
  },
  de: {
    seoTitle: "Datenschutzerklärung | Sidera",
    seoDescription:
      "Erfahren Sie, welche Informationen Sidera erhebt, wie sie verwendet werden und welche Wahlmöglichkeiten Sie für Konto- und Geburtsdaten haben.",
    ogTitle: "Datenschutzerklärung | Sidera",
    ogDescription:
      "Wie Sidera Ihr Konto, Ihre Geburtsdaten und Ihre Datenschutzentscheidungen schützt.",
    ogImageAlt: "Datenschutzerklärung von Sidera",
    twitterTitle: "Datenschutzerklärung | Sidera",
    twitterDescription:
      "Erfahren Sie, wie Sidera Ihre Informationen und Datenschutzentscheidungen schützt.",
  },
} satisfies Record<SupportedLocale, PrivacySeoCopy>;

export const getPrivacySeoCopy = (
  locale: SupportedLocale,
): PrivacySeoCopy => copyByLocale[locale] ?? copyByLocale.en;
