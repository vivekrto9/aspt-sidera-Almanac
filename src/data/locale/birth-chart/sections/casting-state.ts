import type { SupportedLocale } from "../../../localization-contract.ts";

export type BirthChartCastingStateCopy = {
  casting_title: string;
  casting_status: string;
  casting_summary: string;
};

const en: BirthChartCastingStateCopy = {
  casting_title: "Casting your chart…",
  casting_status: "Placing planets from the Swiss Ephemeris",
  casting_summary: "Aligning your birth details with the sky",
};

const localized = {
  en,
  es: {
    casting_title: "Creando tu carta…",
    casting_status: "Situando los planetas con las efemérides suizas",
    casting_summary: "Alineando tus datos de nacimiento con el cielo",
  },
  fr: {
    casting_title: "Création de votre thème…",
    casting_status: "Placement des planètes avec les éphémérides suisses",
    casting_summary: "Alignement de vos données de naissance avec le ciel",
  },
  pt: {
    casting_title: "Criando seu mapa…",
    casting_status: "Posicionando os planetas com as efemérides suíças",
    casting_summary: "Alinhando seus dados de nascimento com o céu",
  },
  ru: {
    casting_title: "Строим вашу карту…",
    casting_status: "Расставляем планеты по швейцарским эфемеридам",
    casting_summary: "Сопоставляем данные вашего рождения с небом",
  },
  it: {
    casting_title: "Creazione del tuo tema…",
    casting_status: "Posizionamento dei pianeti con le effemeridi svizzere",
    casting_summary: "Allineamento dei tuoi dati di nascita con il cielo",
  },
  de: {
    casting_title: "Dein Horoskop wird erstellt…",
    casting_status: "Planeten werden mit der Schweizer Ephemeride platziert",
    casting_summary: "Deine Geburtsdaten werden mit dem Himmel abgeglichen",
  },
} satisfies Record<SupportedLocale, BirthChartCastingStateCopy>;

export const getBirthChartCastingStateCopy = (
  locale: SupportedLocale,
): BirthChartCastingStateCopy => localized[locale] ?? localized.en;
