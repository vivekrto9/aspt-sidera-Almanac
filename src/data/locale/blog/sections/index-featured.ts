import type { SupportedLocale } from "../../../localization-contract.ts";

export type BlogIndexFeaturedCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredExcerpt: string;
  featuredAuthor: string;
  featuredReadTime: string;
};

const copyByLocale = {
  en: {
    eyebrow: "The Sidera Journal",
    titleAccent: "Learn",
    titleRest: "astrology, without the fluff.",
    featuredEyebrow: "Featured · Techniques",
    featuredTitle: "The Lot of Fortune, Explained",
    featuredExcerpt:
      "A hidden key to luck, health and material life in Hellenistic astrology — and how to find it in your own chart.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 min read",
  },
  es: {
    eyebrow: "El diario de Sidera",
    titleAccent: "Aprende",
    titleRest: "astrología, sin rodeos.",
    featuredEyebrow: "Destacado · Técnicas",
    featuredTitle: "La Parte de la Fortuna, explicada",
    featuredExcerpt:
      "Una clave oculta para la suerte, la salud y la vida material en la astrología helenística, y cómo encontrarla en tu carta.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 min de lectura",
  },
  fr: {
    eyebrow: "Le journal Sidera",
    titleAccent: "Apprenez",
    titleRest: "l’astrologie, sans superflu.",
    featuredEyebrow: "À la une · Techniques",
    featuredTitle: "Le Lot de Fortune, expliqué",
    featuredExcerpt:
      "Une clé cachée de la chance, de la santé et de la vie matérielle en astrologie hellénistique — et comment la trouver dans votre thème.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 min de lecture",
  },
  pt: {
    eyebrow: "O diário Sidera",
    titleAccent: "Aprenda",
    titleRest: "astrologia, sem enrolação.",
    featuredEyebrow: "Destaque · Técnicas",
    featuredTitle: "A Parte da Fortuna, explicada",
    featuredExcerpt:
      "Uma chave oculta para sorte, saúde e vida material na astrologia helenística — e como encontrá-la no seu mapa.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 min de leitura",
  },
  ru: {
    eyebrow: "Журнал Sidera",
    titleAccent: "Изучайте",
    titleRest: "астрологию без лишнего.",
    featuredEyebrow: "Избранное · Техники",
    featuredTitle: "Жребий Фортуны: простое объяснение",
    featuredExcerpt:
      "Скрытый ключ к удаче, здоровью и материальной жизни в эллинистической астрологии — и способ найти его в своей карте.",
    featuredAuthor: "Юки Танака",
    featuredReadTime: "7 мин чтения",
  },
  it: {
    eyebrow: "Il diario di Sidera",
    titleAccent: "Impara",
    titleRest: "l’astrologia, senza fronzoli.",
    featuredEyebrow: "In evidenza · Tecniche",
    featuredTitle: "La Parte di Fortuna, spiegata",
    featuredExcerpt:
      "Una chiave nascosta per fortuna, salute e vita materiale nell’astrologia ellenistica — e come trovarla nel tuo tema.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 min di lettura",
  },
  de: {
    eyebrow: "Das Sidera Journal",
    titleAccent: "Lerne",
    titleRest: "Astrologie ohne Schnickschnack.",
    featuredEyebrow: "Empfohlen · Techniken",
    featuredTitle: "Der Glückspunkt, erklärt",
    featuredExcerpt:
      "Ein verborgener Schlüssel zu Glück, Gesundheit und materiellem Leben in der hellenistischen Astrologie — und wie du ihn im eigenen Horoskop findest.",
    featuredAuthor: "Yuki Tanaka",
    featuredReadTime: "7 Min. Lesezeit",
  },
} satisfies Record<SupportedLocale, BlogIndexFeaturedCopy>;

export const getBlogIndexFeaturedCopy = (
  locale: SupportedLocale,
): BlogIndexFeaturedCopy => copyByLocale[locale] ?? copyByLocale.en;
