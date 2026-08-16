import type { SupportedLocale } from "../../localization-contract.ts";

export type SharedFooterCopy = {
  brandLabel: string;
  description: string;
  navigationLabel: string;
  legalNavigationLabel: string;
  chartsLabel: string;
  birthChartLabel: string;
  transitLabel: string;
  synastryLabel: string;
  toolsLabel: string;
  todaysSkyLabel: string;
  moonCalendarLabel: string;
  retrogradesLabel: string;
  reportsLabel: string;
  learnLabel: string;
  blogLabel: string;
  horoscopeLabel: string;
  glossaryLabel: string;
  faqLabel: string;
  companyLabel: string;
  aboutLabel: string;
  accountLabel: string;
  shopLabel: string;
  copyrightText: string;
  privacyLabel: string;
  termsLabel: string;
};

const copyByLocale = {
  en: {
    brandLabel: "Sidera",
    description:
      "Readable for beginners. Deep for the curious. Built on the Swiss Ephemeris, accurate to the arcminute.",
    navigationLabel: "Footer navigation",
    legalNavigationLabel: "Legal",
    chartsLabel: "Charts",
    birthChartLabel: "Birth Chart",
    transitLabel: "Transit",
    synastryLabel: "Synastry",
    toolsLabel: "Tools",
    todaysSkyLabel: "Today's Sky",
    moonCalendarLabel: "Moon Calendar",
    retrogradesLabel: "Retrogrades",
    reportsLabel: "Reports",
    learnLabel: "Learn",
    blogLabel: "Blog",
    horoscopeLabel: "Horoscope",
    glossaryLabel: "Glossary",
    faqLabel: "FAQ",
    companyLabel: "Company",
    aboutLabel: "About",
    accountLabel: "My Account",
    shopLabel: "Shop",
    copyrightText: "© 2026 Sidera. All rights reserved.",
    privacyLabel: "Privacy Policy",
    termsLabel: "Terms of Service",
  },
  es: {
    brandLabel: "Sidera",
    description:
      "Claro para principiantes. Profundo para quienes quieren saber más. Basado en Swiss Ephemeris, con precisión de minuto de arco.",
    navigationLabel: "Navegación del pie de página",
    legalNavigationLabel: "Información legal",
    chartsLabel: "Cartas",
    birthChartLabel: "Carta natal",
    transitLabel: "Tránsitos",
    synastryLabel: "Sinastría",
    toolsLabel: "Herramientas",
    todaysSkyLabel: "El cielo de hoy",
    moonCalendarLabel: "Calendario lunar",
    retrogradesLabel: "Retrógrados",
    reportsLabel: "Informes",
    learnLabel: "Aprender",
    blogLabel: "Blog",
    horoscopeLabel: "Horóscopo",
    glossaryLabel: "Glosario",
    faqLabel: "Preguntas frecuentes",
    companyLabel: "Empresa",
    aboutLabel: "Quiénes somos",
    accountLabel: "Mi cuenta",
    shopLabel: "Tienda",
    copyrightText: "© 2026 Sidera. Todos los derechos reservados.",
    privacyLabel: "Política de privacidad",
    termsLabel: "Términos del servicio",
  },
  fr: {
    brandLabel: "Sidera",
    description:
      "Accessible aux débutants. Approfondi pour les curieux. Basé sur Swiss Ephemeris, précis à la minute d’arc.",
    navigationLabel: "Navigation du pied de page",
    legalNavigationLabel: "Mentions légales",
    chartsLabel: "Thèmes",
    birthChartLabel: "Thème natal",
    transitLabel: "Transits",
    synastryLabel: "Synastrie",
    toolsLabel: "Outils",
    todaysSkyLabel: "Le ciel du jour",
    moonCalendarLabel: "Calendrier lunaire",
    retrogradesLabel: "Rétrogrades",
    reportsLabel: "Rapports",
    learnLabel: "Découvrir",
    blogLabel: "Blog",
    horoscopeLabel: "Horoscope",
    glossaryLabel: "Glossaire",
    faqLabel: "FAQ",
    companyLabel: "Entreprise",
    aboutLabel: "À propos",
    accountLabel: "Mon compte",
    shopLabel: "Boutique",
    copyrightText: "© 2026 Sidera. Tous droits réservés.",
    privacyLabel: "Politique de confidentialité",
    termsLabel: "Conditions d’utilisation",
  },
  pt: {
    brandLabel: "Sidera",
    description:
      "Acessível para iniciantes. Profundo para os curiosos. Desenvolvido com Swiss Ephemeris, preciso ao minuto de arco.",
    navigationLabel: "Navegação do rodapé",
    legalNavigationLabel: "Informações legais",
    chartsLabel: "Mapas",
    birthChartLabel: "Mapa natal",
    transitLabel: "Trânsitos",
    synastryLabel: "Sinastria",
    toolsLabel: "Ferramentas",
    todaysSkyLabel: "Céu de hoje",
    moonCalendarLabel: "Calendário lunar",
    retrogradesLabel: "Retrógrados",
    reportsLabel: "Relatórios",
    learnLabel: "Aprender",
    blogLabel: "Blog",
    horoscopeLabel: "Horóscopo",
    glossaryLabel: "Glossário",
    faqLabel: "Perguntas frequentes",
    companyLabel: "Empresa",
    aboutLabel: "Sobre",
    accountLabel: "Minha conta",
    shopLabel: "Loja",
    copyrightText: "© 2026 Sidera. Todos os direitos reservados.",
    privacyLabel: "Política de privacidade",
    termsLabel: "Termos de Serviço",
  },
  ru: {
    brandLabel: "Sidera",
    description:
      "Понятно начинающим. Глубоко для любознательных. На основе Swiss Ephemeris с точностью до угловой минуты.",
    navigationLabel: "Навигация в подвале",
    legalNavigationLabel: "Правовая информация",
    chartsLabel: "Карты",
    birthChartLabel: "Натальная карта",
    transitLabel: "Транзиты",
    synastryLabel: "Синастрия",
    toolsLabel: "Инструменты",
    todaysSkyLabel: "Небо сегодня",
    moonCalendarLabel: "Лунный календарь",
    retrogradesLabel: "Ретроградность",
    reportsLabel: "Отчёты",
    learnLabel: "Материалы",
    blogLabel: "Блог",
    horoscopeLabel: "Гороскоп",
    glossaryLabel: "Глоссарий",
    faqLabel: "Вопросы и ответы",
    companyLabel: "Компания",
    aboutLabel: "О нас",
    accountLabel: "Мой аккаунт",
    shopLabel: "Магазин",
    copyrightText: "© 2026 Sidera. Все права защищены.",
    privacyLabel: "Политика конфиденциальности",
    termsLabel: "Условия использования",
  },
  it: {
    brandLabel: "Sidera",
    description:
      "Chiaro per chi inizia. Profondo per chi è curioso. Basato su Swiss Ephemeris, preciso al minuto d’arco.",
    navigationLabel: "Navigazione del piè di pagina",
    legalNavigationLabel: "Informazioni legali",
    chartsLabel: "Temi",
    birthChartLabel: "Tema natale",
    transitLabel: "Transiti",
    synastryLabel: "Sinastria",
    toolsLabel: "Strumenti",
    todaysSkyLabel: "Il cielo di oggi",
    moonCalendarLabel: "Calendario lunare",
    retrogradesLabel: "Retrogradazioni",
    reportsLabel: "Report",
    learnLabel: "Scopri",
    blogLabel: "Blog",
    horoscopeLabel: "Oroscopo",
    glossaryLabel: "Glossario",
    faqLabel: "FAQ",
    companyLabel: "Azienda",
    aboutLabel: "Chi siamo",
    accountLabel: "Il mio account",
    shopLabel: "Negozio",
    copyrightText: "© 2026 Sidera. Tutti i diritti riservati.",
    privacyLabel: "Informativa sulla privacy",
    termsLabel: "Termini di servizio",
  },
  de: {
    brandLabel: "Sidera",
    description:
      "Verständlich für Einsteiger. Tiefgehend für Neugierige. Basierend auf Swiss Ephemeris, genau bis auf die Bogenminute.",
    navigationLabel: "Fußzeilennavigation",
    legalNavigationLabel: "Rechtliches",
    chartsLabel: "Horoskope",
    birthChartLabel: "Geburtshoroskop",
    transitLabel: "Transite",
    synastryLabel: "Synastrie",
    toolsLabel: "Werkzeuge",
    todaysSkyLabel: "Heutiger Himmel",
    moonCalendarLabel: "Mondkalender",
    retrogradesLabel: "Rückläufigkeiten",
    reportsLabel: "Berichte",
    learnLabel: "Entdecken",
    blogLabel: "Blog",
    horoscopeLabel: "Horoskop",
    glossaryLabel: "Glossar",
    faqLabel: "FAQ",
    companyLabel: "Unternehmen",
    aboutLabel: "Über uns",
    accountLabel: "Mein Konto",
    shopLabel: "Shop",
    copyrightText: "© 2026 Sidera. Alle Rechte vorbehalten.",
    privacyLabel: "Datenschutzerklärung",
    termsLabel: "Nutzungsbedingungen",
  },
} satisfies Record<SupportedLocale, SharedFooterCopy>;

export const getSharedFooterCopy = (locale: SupportedLocale): SharedFooterCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
