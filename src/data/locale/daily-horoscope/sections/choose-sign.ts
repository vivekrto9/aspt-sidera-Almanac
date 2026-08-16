import type { SupportedLocale } from "../../../localization-contract.ts";

export type DailyHoroscopeSign = {
  slug: string;
  glyph: string;
  elementTone: "fire" | "earth" | "air" | "water";
  name: string;
  dates: string;
  element: string;
};

export type DailyHoroscopeChooseSignCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  helperPrefix: string;
  helperCta: string;
  signs: DailyHoroscopeSign[];
};

const signDefinitions = [
  { slug: "aries", glyph: "♈", elementTone: "fire" },
  { slug: "taurus", glyph: "♉", elementTone: "earth" },
  { slug: "gemini", glyph: "♊", elementTone: "air" },
  { slug: "cancer", glyph: "♋", elementTone: "water" },
  { slug: "leo", glyph: "♌", elementTone: "fire" },
  { slug: "virgo", glyph: "♍", elementTone: "earth" },
  { slug: "libra", glyph: "♎", elementTone: "air" },
  { slug: "scorpio", glyph: "♏", elementTone: "water" },
  { slug: "sagittarius", glyph: "♐", elementTone: "fire" },
  { slug: "capricorn", glyph: "♑", elementTone: "earth" },
  { slug: "aquarius", glyph: "♒", elementTone: "air" },
  { slug: "pisces", glyph: "♓", elementTone: "water" },
] as const;

type LocalizedSignData = {
  names: string[];
  dates: string[];
  elements: string[];
};

const localizedSigns: Record<SupportedLocale, LocalizedSignData> = {
  en: {
    names: [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ],
    dates: [
      "Mar 21 – Apr 19",
      "Apr 20 – May 20",
      "May 21 – Jun 20",
      "Jun 21 – Jul 22",
      "Jul 23 – Aug 22",
      "Aug 23 – Sep 22",
      "Sep 23 – Oct 22",
      "Oct 23 – Nov 21",
      "Nov 22 – Dec 21",
      "Dec 22 – Jan 19",
      "Jan 20 – Feb 18",
      "Feb 19 – Mar 20",
    ],
    elements: [
      "Fire",
      "Earth",
      "Air",
      "Water",
      "Fire",
      "Earth",
      "Air",
      "Water",
      "Fire",
      "Earth",
      "Air",
      "Water",
    ],
  },
  es: {
    names: [
      "Aries",
      "Tauro",
      "Géminis",
      "Cáncer",
      "Leo",
      "Virgo",
      "Libra",
      "Escorpio",
      "Sagitario",
      "Capricornio",
      "Acuario",
      "Piscis",
    ],
    dates: [
      "21 mar – 19 abr",
      "20 abr – 20 may",
      "21 may – 20 jun",
      "21 jun – 22 jul",
      "23 jul – 22 ago",
      "23 ago – 22 sep",
      "23 sep – 22 oct",
      "23 oct – 21 nov",
      "22 nov – 21 dic",
      "22 dic – 19 ene",
      "20 ene – 18 feb",
      "19 feb – 20 mar",
    ],
    elements: [
      "Fuego",
      "Tierra",
      "Aire",
      "Agua",
      "Fuego",
      "Tierra",
      "Aire",
      "Agua",
      "Fuego",
      "Tierra",
      "Aire",
      "Agua",
    ],
  },
  fr: {
    names: [
      "Bélier",
      "Taureau",
      "Gémeaux",
      "Cancer",
      "Lion",
      "Vierge",
      "Balance",
      "Scorpion",
      "Sagittaire",
      "Capricorne",
      "Verseau",
      "Poissons",
    ],
    dates: [
      "21 mars – 19 avr.",
      "20 avr. – 20 mai",
      "21 mai – 20 juin",
      "21 juin – 22 juil.",
      "23 juil. – 22 août",
      "23 août – 22 sept.",
      "23 sept. – 22 oct.",
      "23 oct. – 21 nov.",
      "22 nov. – 21 déc.",
      "22 déc. – 19 janv.",
      "20 janv. – 18 févr.",
      "19 févr. – 20 mars",
    ],
    elements: [
      "Feu",
      "Terre",
      "Air",
      "Eau",
      "Feu",
      "Terre",
      "Air",
      "Eau",
      "Feu",
      "Terre",
      "Air",
      "Eau",
    ],
  },
  pt: {
    names: [
      "Áries",
      "Touro",
      "Gêmeos",
      "Câncer",
      "Leão",
      "Virgem",
      "Libra",
      "Escorpião",
      "Sagitário",
      "Capricórnio",
      "Aquário",
      "Peixes",
    ],
    dates: [
      "21 mar – 19 abr",
      "20 abr – 20 mai",
      "21 mai – 20 jun",
      "21 jun – 22 jul",
      "23 jul – 22 ago",
      "23 ago – 22 set",
      "23 set – 22 out",
      "23 out – 21 nov",
      "22 nov – 21 dez",
      "22 dez – 19 jan",
      "20 jan – 18 fev",
      "19 fev – 20 mar",
    ],
    elements: [
      "Fogo",
      "Terra",
      "Ar",
      "Água",
      "Fogo",
      "Terra",
      "Ar",
      "Água",
      "Fogo",
      "Terra",
      "Ar",
      "Água",
    ],
  },
  ru: {
    names: [
      "Овен",
      "Телец",
      "Близнецы",
      "Рак",
      "Лев",
      "Дева",
      "Весы",
      "Скорпион",
      "Стрелец",
      "Козерог",
      "Водолей",
      "Рыбы",
    ],
    dates: [
      "21 мар. – 19 апр.",
      "20 апр. – 20 мая",
      "21 мая – 20 июн.",
      "21 июн. – 22 июл.",
      "23 июл. – 22 авг.",
      "23 авг. – 22 сент.",
      "23 сент. – 22 окт.",
      "23 окт. – 21 нояб.",
      "22 нояб. – 21 дек.",
      "22 дек. – 19 янв.",
      "20 янв. – 18 февр.",
      "19 февр. – 20 мар.",
    ],
    elements: [
      "Огонь",
      "Земля",
      "Воздух",
      "Вода",
      "Огонь",
      "Земля",
      "Воздух",
      "Вода",
      "Огонь",
      "Земля",
      "Воздух",
      "Вода",
    ],
  },
  it: {
    names: [
      "Ariete",
      "Toro",
      "Gemelli",
      "Cancro",
      "Leone",
      "Vergine",
      "Bilancia",
      "Scorpione",
      "Sagittario",
      "Capricorno",
      "Acquario",
      "Pesci",
    ],
    dates: [
      "21 mar – 19 apr",
      "20 apr – 20 mag",
      "21 mag – 20 giu",
      "21 giu – 22 lug",
      "23 lug – 22 ago",
      "23 ago – 22 set",
      "23 set – 22 ott",
      "23 ott – 21 nov",
      "22 nov – 21 dic",
      "22 dic – 19 gen",
      "20 gen – 18 feb",
      "19 feb – 20 mar",
    ],
    elements: [
      "Fuoco",
      "Terra",
      "Aria",
      "Acqua",
      "Fuoco",
      "Terra",
      "Aria",
      "Acqua",
      "Fuoco",
      "Terra",
      "Aria",
      "Acqua",
    ],
  },
  de: {
    names: [
      "Widder",
      "Stier",
      "Zwillinge",
      "Krebs",
      "Löwe",
      "Jungfrau",
      "Waage",
      "Skorpion",
      "Schütze",
      "Steinbock",
      "Wassermann",
      "Fische",
    ],
    dates: [
      "21. März – 19. Apr.",
      "20. Apr. – 20. Mai",
      "21. Mai – 20. Juni",
      "21. Juni – 22. Juli",
      "23. Juli – 22. Aug.",
      "23. Aug. – 22. Sept.",
      "23. Sept. – 22. Okt.",
      "23. Okt. – 21. Nov.",
      "22. Nov. – 21. Dez.",
      "22. Dez. – 19. Jan.",
      "20. Jan. – 18. Feb.",
      "19. Feb. – 20. März",
    ],
    elements: [
      "Feuer",
      "Erde",
      "Luft",
      "Wasser",
      "Feuer",
      "Erde",
      "Luft",
      "Wasser",
      "Feuer",
      "Erde",
      "Luft",
      "Wasser",
    ],
  },
};

const sectionCopy: Record<
  SupportedLocale,
  Omit<DailyHoroscopeChooseSignCopy, "signs">
> = {
  en: {
    eyebrow: "Daily Horoscope",
    titleAccent: "Read",
    titleRest: "your sky, today.",
    description:
      "Pick your Sun sign to begin. Your reading covers yesterday through the month ahead — grounded in the transits actually moving overhead.",
    helperPrefix: "Not sure of your sign?",
    helperCta: "Cast your free birth chart →",
  },
  es: {
    eyebrow: "Horóscopo diario",
    titleAccent: "Lee",
    titleRest: "tu cielo de hoy.",
    description:
      "Elige tu signo solar para comenzar. Tu lectura abarca desde ayer hasta el próximo mes, guiada por los tránsitos que se mueven sobre ti.",
    helperPrefix: "¿No sabes cuál es tu signo?",
    helperCta: "Crea gratis tu carta natal →",
  },
  fr: {
    eyebrow: "Horoscope du jour",
    titleAccent: "Lisez",
    titleRest: "votre ciel aujourd’hui.",
    description:
      "Choisissez votre signe solaire pour commencer. Votre lecture va d’hier au mois à venir, ancrée dans les transits qui traversent réellement le ciel.",
    helperPrefix: "Vous ne connaissez pas votre signe ?",
    helperCta: "Créez gratuitement votre thème natal →",
  },
  pt: {
    eyebrow: "Horóscopo diário",
    titleAccent: "Leia",
    titleRest: "o seu céu de hoje.",
    description:
      "Escolha o seu signo solar para começar. A leitura vai de ontem ao próximo mês, com base nos trânsitos que realmente se movem no céu.",
    helperPrefix: "Não sabe qual é o seu signo?",
    helperCta: "Crie grátis o seu mapa natal →",
  },
  ru: {
    eyebrow: "Гороскоп на сегодня",
    titleAccent: "Прочтите",
    titleRest: "своё небо сегодня.",
    description:
      "Выберите свой солнечный знак. Прогноз охватывает период от вчерашнего дня до следующего месяца и опирается на реальные текущие транзиты.",
    helperPrefix: "Не знаете свой знак?",
    helperCta: "Постройте натальную карту бесплатно →",
  },
  it: {
    eyebrow: "Oroscopo del giorno",
    titleAccent: "Leggi",
    titleRest: "il tuo cielo di oggi.",
    description:
      "Scegli il tuo segno solare per iniziare. La lettura va da ieri al mese prossimo ed è fondata sui transiti che si muovono davvero nel cielo.",
    helperPrefix: "Non conosci il tuo segno?",
    helperCta: "Crea gratis il tuo tema natale →",
  },
  de: {
    eyebrow: "Tageshoroskop",
    titleAccent: "Lies",
    titleRest: "heute deinen Himmel.",
    description:
      "Wähle dein Sonnenzeichen. Deine Deutung reicht von gestern bis in den kommenden Monat und folgt den Transiten, die sich tatsächlich am Himmel bewegen.",
    helperPrefix: "Du kennst dein Zeichen nicht?",
    helperCta: "Erstelle kostenlos dein Geburtshoroskop →",
  },
};

export const getDailyHoroscopeChooseSignCopy = (
  locale: SupportedLocale,
): DailyHoroscopeChooseSignCopy => {
  const localized = localizedSigns[locale] ?? localizedSigns.en;
  const section = sectionCopy[locale] ?? sectionCopy.en;

  return {
    ...section,
    signs: signDefinitions.map((sign, index) => ({
      ...sign,
      name: localized.names[index],
      dates: localized.dates[index],
      element: localized.elements[index],
    })),
  };
};
