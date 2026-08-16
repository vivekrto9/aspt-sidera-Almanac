import type { SupportedLocale } from "../../localization-contract.ts";

export type SharedHeaderCopy = {
  brandLabel: string;
  brandAriaLabel: string;
  navigationLabel: string;
  todaysSkyLabel: string;
  chartsLabel: string;
  compatibilityLabel: string;
  moonLabel: string;
  horoscopeLabel: string;
  astrologersLabel: string;
  moreLabel: string;
  blogLabel: string;
  shopLabel: string;
  walletLabel: string;
  signInLabel: string;
  getChartLabel: string;
  languageTriggerLabel: string;
  languageMenuLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
};

const copyByLocale = {
  en: {
    brandLabel: "Sidera",
    brandAriaLabel: "Sidera home",
    navigationLabel: "Primary navigation",
    todaysSkyLabel: "Today's Sky",
    chartsLabel: "Charts",
    compatibilityLabel: "Compatibility",
    moonLabel: "Moon",
    horoscopeLabel: "Horoscope",
    astrologersLabel: "Astrologers",
    moreLabel: "More",
    blogLabel: "Blog",
    shopLabel: "Shop",
    walletLabel: "Wallet",
    signInLabel: "Sign In",
    getChartLabel: "Get your chart",
    languageTriggerLabel: "Language",
    languageMenuLabel: "Select language",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  es: {
    brandLabel: "Sidera",
    brandAriaLabel: "Inicio de Sidera",
    navigationLabel: "Navegación principal",
    todaysSkyLabel: "El cielo de hoy",
    chartsLabel: "Cartas",
    compatibilityLabel: "Compatibilidad",
    moonLabel: "Luna",
    horoscopeLabel: "Horóscopo",
    astrologersLabel: "Astrólogos",
    moreLabel: "Más",
    blogLabel: "Artículos",
    shopLabel: "Tienda",
    walletLabel: "Cartera",
    signInLabel: "Iniciar sesión",
    getChartLabel: "Obtén tu carta",
    languageTriggerLabel: "Idioma",
    languageMenuLabel: "Seleccionar idioma",
    openMenuLabel: "Abrir menú",
    closeMenuLabel: "Cerrar menú",
  },
  fr: {
    brandLabel: "Sidera",
    brandAriaLabel: "Accueil Sidera",
    navigationLabel: "Navigation principale",
    todaysSkyLabel: "Le ciel du jour",
    chartsLabel: "Thèmes",
    compatibilityLabel: "Compatibilité",
    moonLabel: "Lune",
    horoscopeLabel: "Horoscope",
    astrologersLabel: "Astrologues",
    moreLabel: "Plus",
    blogLabel: "Articles",
    shopLabel: "Boutique",
    walletLabel: "Portefeuille",
    signInLabel: "Se connecter",
    getChartLabel: "Obtenir votre thème",
    languageTriggerLabel: "Langue",
    languageMenuLabel: "Choisir la langue",
    openMenuLabel: "Ouvrir le menu",
    closeMenuLabel: "Fermer le menu",
  },
  pt: {
    brandLabel: "Sidera",
    brandAriaLabel: "Início da Sidera",
    navigationLabel: "Navegação principal",
    todaysSkyLabel: "Céu de hoje",
    chartsLabel: "Mapas",
    compatibilityLabel: "Compatibilidade",
    moonLabel: "Lua",
    horoscopeLabel: "Horóscopo",
    astrologersLabel: "Astrólogos",
    moreLabel: "Mais",
    blogLabel: "Artigos",
    shopLabel: "Loja",
    walletLabel: "Carteira",
    signInLabel: "Entrar",
    getChartLabel: "Obter seu mapa",
    languageTriggerLabel: "Idioma",
    languageMenuLabel: "Selecionar idioma",
    openMenuLabel: "Abrir menu",
    closeMenuLabel: "Fechar menu",
  },
  ru: {
    brandLabel: "Sidera",
    brandAriaLabel: "Главная Sidera",
    navigationLabel: "Основная навигация",
    todaysSkyLabel: "Небо сегодня",
    chartsLabel: "Карты",
    compatibilityLabel: "Совместимость",
    moonLabel: "Луна",
    horoscopeLabel: "Гороскоп",
    astrologersLabel: "Астрологи",
    moreLabel: "Ещё",
    blogLabel: "Статьи",
    shopLabel: "Магазин",
    walletLabel: "Кошелёк",
    signInLabel: "Войти",
    getChartLabel: "Создать карту",
    languageTriggerLabel: "Язык",
    languageMenuLabel: "Выбрать язык",
    openMenuLabel: "Открыть меню",
    closeMenuLabel: "Закрыть меню",
  },
  it: {
    brandLabel: "Sidera",
    brandAriaLabel: "Home di Sidera",
    navigationLabel: "Navigazione principale",
    todaysSkyLabel: "Il cielo di oggi",
    chartsLabel: "Temi",
    compatibilityLabel: "Compatibilità",
    moonLabel: "Luna",
    horoscopeLabel: "Oroscopo",
    astrologersLabel: "Astrologi",
    moreLabel: "Altro",
    blogLabel: "Articoli",
    shopLabel: "Negozio",
    walletLabel: "Portafoglio",
    signInLabel: "Accedi",
    getChartLabel: "Crea il tuo tema",
    languageTriggerLabel: "Lingua",
    languageMenuLabel: "Seleziona la lingua",
    openMenuLabel: "Apri menu",
    closeMenuLabel: "Chiudi menu",
  },
  de: {
    brandLabel: "Sidera",
    brandAriaLabel: "Sidera Startseite",
    navigationLabel: "Hauptnavigation",
    todaysSkyLabel: "Heutiger Himmel",
    chartsLabel: "Horoskope",
    compatibilityLabel: "Kompatibilität",
    moonLabel: "Mond",
    horoscopeLabel: "Tageshoroskop",
    astrologersLabel: "Astrologen",
    moreLabel: "Mehr",
    blogLabel: "Artikel",
    shopLabel: "Shop",
    walletLabel: "Wallet",
    signInLabel: "Anmelden",
    getChartLabel: "Horoskop erstellen",
    languageTriggerLabel: "Sprache",
    languageMenuLabel: "Sprache auswählen",
    openMenuLabel: "Menü öffnen",
    closeMenuLabel: "Menü schließen",
  },
} satisfies Record<SupportedLocale, SharedHeaderCopy>;

export const getSharedHeaderCopy = (
  locale: SupportedLocale,
): SharedHeaderCopy => copyByLocale[locale] ?? copyByLocale.en;
