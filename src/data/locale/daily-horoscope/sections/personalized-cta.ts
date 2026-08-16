import type { SupportedLocale } from "../../../localization-contract.ts";

export type DailyHoroscopePersonalizedCtaCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Beyond your Sun sign",
    titleLead: "A Sun-sign reading is the headline.",
    titleAccent: "Your",
    titleRest: "chart is the whole story.",
    description:
      "Cast your birth chart to see how today’s transits touch your Moon, rising, and every planet — the reading meant only for you.",
    primaryLabel: "Cast your free chart",
    secondaryLabel: "Explore today’s sky",
  },
  es: {
    eyebrow: "Más allá de tu signo solar",
    titleLead: "La lectura de tu signo solar es el titular.",
    titleAccent: "Tu",
    titleRest: "carta cuenta la historia completa.",
    description:
      "Crea tu carta natal para descubrir cómo los tránsitos de hoy tocan tu Luna, tu ascendente y cada planeta: una lectura hecha solo para ti.",
    primaryLabel: "Crea tu carta gratis",
    secondaryLabel: "Explora el cielo de hoy",
  },
  fr: {
    eyebrow: "Au-delà de votre signe solaire",
    titleLead: "La lecture de votre signe solaire en donne le titre.",
    titleAccent: "Votre",
    titleRest: "thème raconte toute l’histoire.",
    description:
      "Créez votre thème natal pour voir comment les transits du jour touchent votre Lune, votre ascendant et chacune de vos planètes — une lecture rien que pour vous.",
    primaryLabel: "Créez votre thème gratuit",
    secondaryLabel: "Explorez le ciel du jour",
  },
  pt: {
    eyebrow: "Além do seu signo solar",
    titleLead: "A leitura do signo solar é a manchete.",
    titleAccent: "O seu",
    titleRest: "mapa conta a história inteira.",
    description:
      "Crie o seu mapa natal para ver como os trânsitos de hoje tocam a Lua, o ascendente e cada planeta — a leitura feita só para si.",
    primaryLabel: "Crie o seu mapa grátis",
    secondaryLabel: "Explore o céu de hoje",
  },
  ru: {
    eyebrow: "Больше, чем знак Солнца",
    titleLead: "Прогноз по знаку Солнца — лишь заголовок.",
    titleAccent: "Ваша",
    titleRest: "натальная карта рассказывает всю историю.",
    description:
      "Постройте натальную карту и узнайте, как сегодняшние транзиты затрагивают Луну, асцендент и каждую планету — это прогноз именно для вас.",
    primaryLabel: "Построить карту бесплатно",
    secondaryLabel: "Исследовать небо сегодня",
  },
  it: {
    eyebrow: "Oltre il tuo segno solare",
    titleLead: "La lettura del segno solare è il titolo.",
    titleAccent: "Il tuo",
    titleRest: "tema racconta tutta la storia.",
    description:
      "Crea il tuo tema natale per vedere come i transiti di oggi toccano la Luna, l’ascendente e ogni pianeta — la lettura pensata solo per te.",
    primaryLabel: "Crea il tuo tema gratuito",
    secondaryLabel: "Esplora il cielo di oggi",
  },
  de: {
    eyebrow: "Mehr als dein Sonnenzeichen",
    titleLead: "Die Sonnenzeichen-Deutung ist die Überschrift.",
    titleAccent: "Dein",
    titleRest: "Horoskop erzählt die ganze Geschichte.",
    description:
      "Erstelle dein Geburtshoroskop und sieh, wie die heutigen Transite deinen Mond, Aszendenten und jeden Planeten berühren — eine Deutung nur für dich.",
    primaryLabel: "Kostenloses Horoskop erstellen",
    secondaryLabel: "Heutigen Himmel erkunden",
  },
} satisfies Record<SupportedLocale, DailyHoroscopePersonalizedCtaCopy>;

export const getDailyHoroscopePersonalizedCtaCopy = (
  locale: SupportedLocale,
): DailyHoroscopePersonalizedCtaCopy => copyByLocale[locale] ?? copyByLocale.en;
