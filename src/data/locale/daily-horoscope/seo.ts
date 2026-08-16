import type { SupportedLocale } from "../../localization-contract.ts";

export type DailyHoroscopeSeoCopy = {
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
    seoTitle: "Daily Horoscope by Zodiac Sign | Sidera",
    seoDescription:
      "Choose your Sun sign for a grounded daily, weekly, and monthly horoscope shaped by the current sky.",
    ogTitle: "Read Your Daily Horoscope | Sidera",
    ogDescription:
      "Choose your zodiac sign and read the celestial weather moving through your day.",
    ogImageAlt: "Sidera daily horoscope zodiac sign picker",
    twitterTitle: "Read Your Daily Horoscope | Sidera",
    twitterDescription:
      "Choose your zodiac sign and read the celestial weather moving through your day.",
  },
  es: {
    seoTitle: "Horóscopo diario por signo zodiacal | Sidera",
    seoDescription:
      "Elige tu signo solar para leer un horóscopo diario, semanal y mensual basado en el cielo actual.",
    ogTitle: "Lee tu horóscopo diario | Sidera",
    ogDescription:
      "Elige tu signo zodiacal y descubre el clima celeste que acompaña tu día.",
    ogImageAlt: "Selector de signos del horóscopo diario de Sidera",
    twitterTitle: "Lee tu horóscopo diario | Sidera",
    twitterDescription:
      "Elige tu signo zodiacal y descubre el clima celeste que acompaña tu día.",
  },
  fr: {
    seoTitle: "Horoscope quotidien par signe | Sidera",
    seoDescription:
      "Choisissez votre signe solaire pour lire un horoscope quotidien, hebdomadaire et mensuel guidé par le ciel actuel.",
    ogTitle: "Lisez votre horoscope du jour | Sidera",
    ogDescription:
      "Choisissez votre signe et découvrez la météo céleste qui accompagne votre journée.",
    ogImageAlt: "Sélecteur des signes de l’horoscope quotidien Sidera",
    twitterTitle: "Lisez votre horoscope du jour | Sidera",
    twitterDescription:
      "Choisissez votre signe et découvrez la météo céleste qui accompagne votre journée.",
  },
  pt: {
    seoTitle: "Horóscopo diário por signo | Sidera",
    seoDescription:
      "Escolha o seu signo solar para ler um horóscopo diário, semanal e mensal guiado pelo céu atual.",
    ogTitle: "Leia o seu horóscopo diário | Sidera",
    ogDescription:
      "Escolha o seu signo e descubra o clima celeste que acompanha o seu dia.",
    ogImageAlt: "Seletor de signos do horóscopo diário da Sidera",
    twitterTitle: "Leia o seu horóscopo diário | Sidera",
    twitterDescription:
      "Escolha o seu signo e descubra o clima celeste que acompanha o seu dia.",
  },
  ru: {
    seoTitle: "Гороскоп на сегодня по знакам | Sidera",
    seoDescription:
      "Выберите солнечный знак и прочтите прогноз на день, неделю и месяц с учётом текущего неба.",
    ogTitle: "Прочтите свой гороскоп на сегодня | Sidera",
    ogDescription:
      "Выберите знак зодиака и узнайте, какая небесная погода сопровождает ваш день.",
    ogImageAlt: "Выбор знака для ежедневного гороскопа Sidera",
    twitterTitle: "Прочтите свой гороскоп на сегодня | Sidera",
    twitterDescription:
      "Выберите знак зодиака и узнайте, какая небесная погода сопровождает ваш день.",
  },
  it: {
    seoTitle: "Oroscopo quotidiano per segno | Sidera",
    seoDescription:
      "Scegli il tuo segno solare per leggere un oroscopo quotidiano, settimanale e mensile guidato dal cielo attuale.",
    ogTitle: "Leggi il tuo oroscopo del giorno | Sidera",
    ogDescription:
      "Scegli il tuo segno e scopri il clima celeste che accompagna la giornata.",
    ogImageAlt: "Selettore dei segni per l’oroscopo quotidiano Sidera",
    twitterTitle: "Leggi il tuo oroscopo del giorno | Sidera",
    twitterDescription:
      "Scegli il tuo segno e scopri il clima celeste che accompagna la giornata.",
  },
  de: {
    seoTitle: "Tageshoroskop nach Sternzeichen | Sidera",
    seoDescription:
      "Wähle dein Sonnenzeichen für ein Tages-, Wochen- und Monatshoroskop, das dem aktuellen Himmel folgt.",
    ogTitle: "Lies dein Tageshoroskop | Sidera",
    ogDescription:
      "Wähle dein Sternzeichen und entdecke die Himmelsstimmung, die deinen Tag begleitet.",
    ogImageAlt: "Sidera Sternzeichenauswahl für das Tageshoroskop",
    twitterTitle: "Lies dein Tageshoroskop | Sidera",
    twitterDescription:
      "Wähle dein Sternzeichen und entdecke die Himmelsstimmung, die deinen Tag begleitet.",
  },
} satisfies Record<SupportedLocale, DailyHoroscopeSeoCopy>;

export const getDailyHoroscopeSeoCopy = (
  locale: SupportedLocale,
): DailyHoroscopeSeoCopy => copyByLocale[locale] ?? copyByLocale.en;
