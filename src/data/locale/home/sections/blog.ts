import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeBlogPost = {
  category: string;
  title: string;
  excerpt: string;
  imageAlt: string;
};

export type HomeBlogCopy = {
  titleAccent: string;
  titleRest: string;
  tagline: string;
  browseLabel: string;
  posts: HomeBlogPost[];
};

const copies: Record<SupportedLocale, HomeBlogCopy> = {
  en: {
    titleAccent: "Learn",
    titleRest: "astrology.",
    tagline: "Clarity. No fluff.",
    browseLabel: "Read all articles",
    posts: [
      {
        category: "Techniques",
        title: "The Lot of Fortune, Explained",
        excerpt:
          "A hidden key to luck, health, and material life in Hellenistic astrology — and how to find it in your chart.",
        imageAlt: "Cosmic illustration for the Lot of Fortune",
      },
      {
        category: "Birth Chart",
        title: "Aries Rising: The Pioneer Ascendant",
        excerpt:
          "What it means when Aries sits on your first house — the bold energy that shapes every first impression.",
        imageAlt: "Cosmic illustration for Aries rising",
      },
      {
        category: "The Sky",
        title: "Morning Star, Evening Star",
        excerpt:
          "A planet's relationship to the Sun shapes how it expresses — initiating before it, reflecting after it.",
        imageAlt: "Cosmic illustration of morning and evening stars",
      },
    ],
  },
  es: {
    titleAccent: "Aprende",
    titleRest: "astrología.",
    tagline: "Claridad. Sin relleno.",
    browseLabel: "Leer todos los artículos",
    posts: [
      {
        category: "Técnicas",
        title: "La Parte de la Fortuna, explicada",
        excerpt:
          "Una clave oculta para la suerte, la salud y la vida material en la astrología helenística, y cómo hallarla en tu carta.",
        imageAlt: "Ilustración cósmica de la Parte de la Fortuna",
      },
      {
        category: "Carta natal",
        title: "Ascendente Aries: el pionero",
        excerpt:
          "Qué significa tener a Aries en la primera casa: la energía audaz que marca cada primera impresión.",
        imageAlt: "Ilustración cósmica del ascendente Aries",
      },
      {
        category: "El cielo",
        title: "Estrella matutina, estrella vespertina",
        excerpt:
          "La relación de un planeta con el Sol define su expresión: inicia antes de él y refleja después.",
        imageAlt: "Ilustración cósmica de estrellas matutinas y vespertinas",
      },
    ],
  },
  fr: {
    titleAccent: "Apprenez",
    titleRest: "l'astrologie.",
    tagline: "Clair. Sans détour.",
    browseLabel: "Lire tous les articles",
    posts: [
      {
        category: "Techniques",
        title: "La Part de Fortune, expliquée",
        excerpt:
          "Une clé cachée de la chance, de la santé et de la vie matérielle en astrologie hellénistique, à repérer dans votre thème.",
        imageAlt: "Illustration cosmique de la Part de Fortune",
      },
      {
        category: "Thème natal",
        title: "Ascendant Bélier : le pionnier",
        excerpt:
          "Ce que signifie le Bélier en première maison : une énergie audacieuse qui façonne chaque première impression.",
        imageAlt: "Illustration cosmique de l'ascendant Bélier",
      },
      {
        category: "Le ciel",
        title: "Étoile du matin, étoile du soir",
        excerpt:
          "La relation d'une planète au Soleil modèle son expression : elle initie avant lui et réfléchit après.",
        imageAlt: "Illustration cosmique des étoiles du matin et du soir",
      },
    ],
  },
  pt: {
    titleAccent: "Aprenda",
    titleRest: "astrologia.",
    tagline: "Clareza. Sem rodeios.",
    browseLabel: "Ler todos os artigos",
    posts: [
      {
        category: "Técnicas",
        title: "A Parte da Fortuna, explicada",
        excerpt:
          "Uma chave oculta para sorte, saúde e vida material na astrologia helenística — e como encontrá-la no seu mapa.",
        imageAlt: "Ilustração cósmica da Parte da Fortuna",
      },
      {
        category: "Mapa natal",
        title: "Ascendente em Áries: o pioneiro",
        excerpt:
          "O que significa Áries na primeira casa: a energia ousada que molda cada primeira impressão.",
        imageAlt: "Ilustração cósmica do ascendente em Áries",
      },
      {
        category: "O céu",
        title: "Estrela da manhã, estrela da noite",
        excerpt:
          "A relação de um planeta com o Sol molda sua expressão: inicia antes dele e reflete depois.",
        imageAlt: "Ilustração cósmica das estrelas da manhã e da noite",
      },
    ],
  },
  ru: {
    titleAccent: "Изучайте",
    titleRest: "астрологию.",
    tagline: "Ясно. Без лишнего.",
    browseLabel: "Читать все статьи",
    posts: [
      {
        category: "Техники",
        title: "Жребий Фортуны: простое объяснение",
        excerpt:
          "Скрытый ключ к удаче, здоровью и материальной жизни в эллинистической астрологии — и как найти его в своей карте.",
        imageAlt: "Космическая иллюстрация Жребия Фортуны",
      },
      {
        category: "Натальная карта",
        title: "Асцендент в Овне: первопроходец",
        excerpt:
          "Что означает Овен в первом доме: смелая энергия, формирующая каждое первое впечатление.",
        imageAlt: "Космическая иллюстрация асцендента в Овне",
      },
      {
        category: "Небо",
        title: "Утренняя звезда, вечерняя звезда",
        excerpt:
          "Отношение планеты к Солнцу определяет её проявление: инициирует до него и отражает после.",
        imageAlt: "Космическая иллюстрация утренней и вечерней звезды",
      },
    ],
  },
  it: {
    titleAccent: "Impara",
    titleRest: "l'astrologia.",
    tagline: "Chiarezza. Senza fronzoli.",
    browseLabel: "Leggi tutti gli articoli",
    posts: [
      {
        category: "Tecniche",
        title: "La Parte di Fortuna, spiegata",
        excerpt:
          "Una chiave nascosta per fortuna, salute e vita materiale nell'astrologia ellenistica, e come trovarla nel tuo tema.",
        imageAlt: "Illustrazione cosmica della Parte di Fortuna",
      },
      {
        category: "Tema natale",
        title: "Ascendente Ariete: il pioniere",
        excerpt:
          "Cosa significa avere l'Ariete in prima casa: l'energia audace che plasma ogni prima impressione.",
        imageAlt: "Illustrazione cosmica dell'ascendente Ariete",
      },
      {
        category: "Il cielo",
        title: "Stella del mattino, stella della sera",
        excerpt:
          "Il rapporto di un pianeta con il Sole ne modella l'espressione: inizia prima e riflette dopo.",
        imageAlt: "Illustrazione cosmica delle stelle del mattino e della sera",
      },
    ],
  },
  de: {
    titleAccent: "Lerne",
    titleRest: "Astrologie.",
    tagline: "Klarheit. Ohne Ballast.",
    browseLabel: "Alle Artikel lesen",
    posts: [
      {
        category: "Techniken",
        title: "Der Glückspunkt, erklärt",
        excerpt:
          "Ein verborgener Schlüssel zu Glück, Gesundheit und materiellem Leben in der hellenistischen Astrologie — und wo er im Horoskop liegt.",
        imageAlt: "Kosmische Illustration zum Glückspunkt",
      },
      {
        category: "Geburtshoroskop",
        title: "Aszendent Widder: der Pionier",
        excerpt:
          "Was Widder im ersten Haus bedeutet: die mutige Energie, die jeden ersten Eindruck prägt.",
        imageAlt: "Kosmische Illustration zum Aszendenten Widder",
      },
      {
        category: "Der Himmel",
        title: "Morgenstern, Abendstern",
        excerpt:
          "Die Beziehung eines Planeten zur Sonne prägt seinen Ausdruck: vorher initiierend, danach reflektierend.",
        imageAlt: "Kosmische Illustration von Morgen- und Abendstern",
      },
    ],
  },
};

export const getHomeBlogCopy = (locale: SupportedLocale): HomeBlogCopy =>
  copies[locale] ?? copies.en;
