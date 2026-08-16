import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountSettingsCopy = {
  eyebrow: string;
  title: string;
  fullNameLabel: string;
  emailLabel: string;
  houseSystemLabel: string;
  placidusLabel: string;
  wholeSignLabel: string;
  zodiacLabel: string;
  tropicalLabel: string;
  siderealLabel: string;
  horoscopeLabel: string;
  horoscopeDescription: string;
  saveLabel: string;
  savedMessage: string;
};

const copy: Record<SupportedLocale, AccountSettingsCopy> = {
  en: {
    eyebrow: "Settings",
    title: "Account settings",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    houseSystemLabel: "Default house system",
    placidusLabel: "Placidus",
    wholeSignLabel: "Whole sign",
    zodiacLabel: "Zodiac",
    tropicalLabel: "Tropical",
    siderealLabel: "Sidereal",
    horoscopeLabel: "Email me daily horoscopes",
    horoscopeDescription: "A short reading for Leo, every morning.",
    saveLabel: "Save changes",
    savedMessage: "Settings saved.",
  },
  es: {
    eyebrow: "Ajustes",
    title: "Ajustes de la cuenta",
    fullNameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    houseSystemLabel: "Sistema de casas predeterminado",
    placidusLabel: "Placidus",
    wholeSignLabel: "Signo completo",
    zodiacLabel: "Zodiaco",
    tropicalLabel: "Tropical",
    siderealLabel: "Sideral",
    horoscopeLabel: "Enviarme horóscopos diarios",
    horoscopeDescription: "Una lectura breve para Leo, cada mañana.",
    saveLabel: "Guardar cambios",
    savedMessage: "Ajustes guardados.",
  },
  fr: {
    eyebrow: "Réglages",
    title: "Réglages du compte",
    fullNameLabel: "Nom complet",
    emailLabel: "E-mail",
    houseSystemLabel: "Système de maisons par défaut",
    placidusLabel: "Placidus",
    wholeSignLabel: "Maisons entières",
    zodiacLabel: "Zodiaque",
    tropicalLabel: "Tropical",
    siderealLabel: "Sidéral",
    horoscopeLabel: "M’envoyer l’horoscope quotidien",
    horoscopeDescription: "Une courte lecture pour le Lion, chaque matin.",
    saveLabel: "Enregistrer",
    savedMessage: "Réglages enregistrés.",
  },
  pt: {
    eyebrow: "Definições",
    title: "Definições da conta",
    fullNameLabel: "Nome completo",
    emailLabel: "E-mail",
    houseSystemLabel: "Sistema de casas predefinido",
    placidusLabel: "Placidus",
    wholeSignLabel: "Signos inteiros",
    zodiacLabel: "Zodíaco",
    tropicalLabel: "Tropical",
    siderealLabel: "Sideral",
    horoscopeLabel: "Enviar horóscopos diários",
    horoscopeDescription: "Uma leitura curta para Leão, todas as manhãs.",
    saveLabel: "Guardar alterações",
    savedMessage: "Definições guardadas.",
  },
  ru: {
    eyebrow: "Настройки",
    title: "Настройки аккаунта",
    fullNameLabel: "Полное имя",
    emailLabel: "Эл. почта",
    houseSystemLabel: "Система домов по умолчанию",
    placidusLabel: "Плацидус",
    wholeSignLabel: "Цельные знаки",
    zodiacLabel: "Зодиак",
    tropicalLabel: "Тропический",
    siderealLabel: "Сидерический",
    horoscopeLabel: "Присылать ежедневный гороскоп",
    horoscopeDescription: "Короткий прогноз для Льва каждое утро.",
    saveLabel: "Сохранить изменения",
    savedMessage: "Настройки сохранены.",
  },
  it: {
    eyebrow: "Impostazioni",
    title: "Impostazioni account",
    fullNameLabel: "Nome completo",
    emailLabel: "Email",
    houseSystemLabel: "Sistema di case predefinito",
    placidusLabel: "Placidus",
    wholeSignLabel: "Segni interi",
    zodiacLabel: "Zodiaco",
    tropicalLabel: "Tropicale",
    siderealLabel: "Siderale",
    horoscopeLabel: "Inviami l’oroscopo quotidiano",
    horoscopeDescription: "Una breve lettura per il Leone, ogni mattina.",
    saveLabel: "Salva modifiche",
    savedMessage: "Impostazioni salvate.",
  },
  de: {
    eyebrow: "Einstellungen",
    title: "Kontoeinstellungen",
    fullNameLabel: "Vollständiger Name",
    emailLabel: "E-Mail",
    houseSystemLabel: "Standard-Häusersystem",
    placidusLabel: "Placidus",
    wholeSignLabel: "Ganzzeichenhäuser",
    zodiacLabel: "Tierkreis",
    tropicalLabel: "Tropisch",
    siderealLabel: "Siderisch",
    horoscopeLabel: "Tägliche Horoskope per E-Mail",
    horoscopeDescription: "Jeden Morgen eine kurze Deutung für Löwe.",
    saveLabel: "Änderungen speichern",
    savedMessage: "Einstellungen gespeichert.",
  },
};

export const getAccountSettingsCopy = (locale: SupportedLocale) => copy[locale];
