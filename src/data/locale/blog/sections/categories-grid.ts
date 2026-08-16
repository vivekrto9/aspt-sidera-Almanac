import type { SupportedLocale } from "../../../localization-contract.ts";

type BlogCategoriesGridCopy = Record<string, string>;

const en = {
  blog_categories_label: "Article categories",
  blog_category_all: "All",
  blog_category_techniques: "Techniques",
  blog_category_birth_chart: "Birth Chart",
  blog_category_the_sky: "The Sky",
  blog_category_transits: "Transits",
  blog_category_beginner: "Beginner",
  blog_article_aries_rising_category: "Birth Chart",
  blog_article_aries_rising_title: "Aries Rising: The Pioneer Ascendant",
  blog_article_aries_rising_excerpt:
    "What it means when Aries sits on your first house — the bold, direct energy that shapes every first impression.",
  blog_article_aries_rising_read_time: "6 min read",
  blog_article_morning_star_category: "The Sky",
  blog_article_morning_star_title: "Morning Star, Evening Star",
  blog_article_morning_star_excerpt:
    "A planet’s relationship to the Sun shapes how it expresses — initiating before it, reflecting after it.",
  blog_article_morning_star_read_time: "5 min read",
  blog_article_saturn_return_category: "Transits",
  blog_article_saturn_return_title: "Reading Your Saturn Return",
  blog_article_saturn_return_excerpt:
    "The defining passage of your late twenties: what Saturn asks you to build, end and finally own.",
  blog_article_saturn_return_read_time: "8 min read",
  blog_article_twelve_houses_category: "Beginner",
  blog_article_twelve_houses_title: "The Twelve Houses, Room by Room",
  blog_article_twelve_houses_excerpt:
    "If the signs are how planets behave, the houses are where they do it. A plain-language tour of all twelve.",
  blog_article_twelve_houses_read_time: "6 min read",
  blog_article_mercury_retrograde_category: "Techniques",
  blog_article_mercury_retrograde_title: "What Mercury Retrograde Actually Does",
  blog_article_mercury_retrograde_excerpt:
    "Stripped of the panic, the three-week Mercury retrograde is a useful, recurring invitation to review.",
  blog_article_mercury_retrograde_read_time: "5 min read",
} satisfies BlogCategoriesGridCopy;

const copyByLocale = {
  en,
  es: {
    ...en,
    blog_categories_label: "Categorías de artículos",
    blog_category_all: "Todos",
    blog_category_techniques: "Técnicas",
    blog_category_birth_chart: "Carta natal",
    blog_category_the_sky: "El cielo",
    blog_category_transits: "Tránsitos",
    blog_category_beginner: "Principiantes",
    blog_article_aries_rising_category: "Carta natal",
    blog_article_aries_rising_title: "Ascendente Aries: el ascendente pionero",
    blog_article_aries_rising_excerpt:
      "Qué significa que Aries ocupe tu primera casa: la energía audaz y directa que marca cada primera impresión.",
    blog_article_aries_rising_read_time: "6 min de lectura",
    blog_article_morning_star_category: "El cielo",
    blog_article_morning_star_title: "Estrella matutina, estrella vespertina",
    blog_article_morning_star_excerpt:
      "La relación de un planeta con el Sol moldea su expresión: inicia antes y reflexiona después.",
    blog_article_morning_star_read_time: "5 min de lectura",
    blog_article_saturn_return_category: "Tránsitos",
    blog_article_saturn_return_title: "Cómo leer tu retorno de Saturno",
    blog_article_saturn_return_excerpt:
      "El pasaje decisivo de los últimos veinte: lo que Saturno te pide construir, cerrar y asumir.",
    blog_article_saturn_return_read_time: "8 min de lectura",
    blog_article_twelve_houses_category: "Principiantes",
    blog_article_twelve_houses_title: "Las doce casas, habitación por habitación",
    blog_article_twelve_houses_excerpt:
      "Si los signos dicen cómo actúan los planetas, las casas muestran dónde. Un recorrido claro por las doce.",
    blog_article_twelve_houses_read_time: "6 min de lectura",
    blog_article_mercury_retrograde_category: "Técnicas",
    blog_article_mercury_retrograde_title: "Lo que realmente hace Mercurio retrógrado",
    blog_article_mercury_retrograde_excerpt:
      "Sin alarmismo, estas tres semanas son una invitación útil y recurrente a revisar.",
    blog_article_mercury_retrograde_read_time: "5 min de lectura",
  },
  fr: {
    ...en,
    blog_categories_label: "Catégories d’articles",
    blog_category_all: "Tous",
    blog_category_techniques: "Techniques",
    blog_category_birth_chart: "Thème natal",
    blog_category_the_sky: "Le ciel",
    blog_category_transits: "Transits",
    blog_category_beginner: "Débutants",
    blog_article_aries_rising_category: "Thème natal",
    blog_article_aries_rising_title: "Ascendant Bélier : l’ascendant pionnier",
    blog_article_aries_rising_excerpt:
      "Ce que signifie un Bélier en première maison — l’énergie franche qui façonne chaque première impression.",
    blog_article_aries_rising_read_time: "6 min de lecture",
    blog_article_morning_star_category: "Le ciel",
    blog_article_morning_star_title: "Étoile du matin, étoile du soir",
    blog_article_morning_star_excerpt:
      "La relation d’une planète au Soleil façonne son expression — elle initie avant lui et réfléchit après.",
    blog_article_morning_star_read_time: "5 min de lecture",
    blog_article_saturn_return_category: "Transits",
    blog_article_saturn_return_title: "Lire votre retour de Saturne",
    blog_article_saturn_return_excerpt:
      "Le passage décisif de la fin de la vingtaine : ce que Saturne demande de bâtir, clore et assumer.",
    blog_article_saturn_return_read_time: "8 min de lecture",
    blog_article_twelve_houses_category: "Débutants",
    blog_article_twelve_houses_title: "Les douze maisons, pièce par pièce",
    blog_article_twelve_houses_excerpt:
      "Les signes disent comment les planètes agissent, les maisons où elles le font. Un guide clair des douze.",
    blog_article_twelve_houses_read_time: "6 min de lecture",
    blog_article_mercury_retrograde_category: "Techniques",
    blog_article_mercury_retrograde_title: "Ce que fait vraiment Mercure rétrograde",
    blog_article_mercury_retrograde_excerpt:
      "Sans panique, ces trois semaines deviennent une invitation utile et régulière à revoir.",
    blog_article_mercury_retrograde_read_time: "5 min de lecture",
  },
  pt: {
    ...en,
    blog_categories_label: "Categorias de artigos",
    blog_category_all: "Todos",
    blog_category_techniques: "Técnicas",
    blog_category_birth_chart: "Mapa natal",
    blog_category_the_sky: "O céu",
    blog_category_transits: "Trânsitos",
    blog_category_beginner: "Iniciantes",
    blog_article_aries_rising_category: "Mapa natal",
    blog_article_aries_rising_title: "Ascendente em Áries: o pioneiro",
    blog_article_aries_rising_excerpt:
      "O que significa ter Áries na primeira casa — a energia direta e ousada que molda cada primeira impressão.",
    blog_article_aries_rising_read_time: "6 min de leitura",
    blog_article_morning_star_category: "O céu",
    blog_article_morning_star_title: "Estrela da manhã, estrela da tarde",
    blog_article_morning_star_excerpt:
      "A relação de um planeta com o Sol molda sua expressão — inicia antes dele e reflete depois.",
    blog_article_morning_star_read_time: "5 min de leitura",
    blog_article_saturn_return_category: "Trânsitos",
    blog_article_saturn_return_title: "Como ler seu retorno de Saturno",
    blog_article_saturn_return_excerpt:
      "A passagem decisiva do fim dos vinte anos: o que Saturno pede para construir, encerrar e assumir.",
    blog_article_saturn_return_read_time: "8 min de leitura",
    blog_article_twelve_houses_category: "Iniciantes",
    blog_article_twelve_houses_title: "As doze casas, cômodo por cômodo",
    blog_article_twelve_houses_excerpt:
      "Se os signos mostram como os planetas agem, as casas mostram onde. Um guia claro pelas doze.",
    blog_article_twelve_houses_read_time: "6 min de leitura",
    blog_article_mercury_retrograde_category: "Técnicas",
    blog_article_mercury_retrograde_title: "O que Mercúrio retrógrado realmente faz",
    blog_article_mercury_retrograde_excerpt:
      "Sem pânico, essas três semanas são um convite útil e recorrente para revisar.",
    blog_article_mercury_retrograde_read_time: "5 min de leitura",
  },
  ru: {
    ...en,
    blog_categories_label: "Категории статей",
    blog_category_all: "Все",
    blog_category_techniques: "Техники",
    blog_category_birth_chart: "Натальная карта",
    blog_category_the_sky: "Небо",
    blog_category_transits: "Транзиты",
    blog_category_beginner: "Начинающим",
    blog_article_aries_rising_category: "Натальная карта",
    blog_article_aries_rising_title: "Асцендент в Овне: первопроходец",
    blog_article_aries_rising_excerpt:
      "Что означает Овен в первом доме — смелая прямая энергия, формирующая первое впечатление.",
    blog_article_aries_rising_read_time: "6 мин чтения",
    blog_article_morning_star_category: "Небо",
    blog_article_morning_star_title: "Утренняя звезда, вечерняя звезда",
    blog_article_morning_star_excerpt:
      "Отношение планеты к Солнцу определяет её проявление: до него она начинает, после — осмысляет.",
    blog_article_morning_star_read_time: "5 мин чтения",
    blog_article_saturn_return_category: "Транзиты",
    blog_article_saturn_return_title: "Как читать возвращение Сатурна",
    blog_article_saturn_return_excerpt:
      "Определяющий рубеж конца двадцатых: что Сатурн просит построить, завершить и признать своим.",
    blog_article_saturn_return_read_time: "8 мин чтения",
    blog_article_twelve_houses_category: "Начинающим",
    blog_article_twelve_houses_title: "Двенадцать домов, комната за комнатой",
    blog_article_twelve_houses_excerpt:
      "Знаки показывают, как действуют планеты, а дома — где. Понятный обзор всех двенадцати.",
    blog_article_twelve_houses_read_time: "6 мин чтения",
    blog_article_mercury_retrograde_category: "Техники",
    blog_article_mercury_retrograde_title: "Что на самом деле делает ретроградный Меркурий",
    blog_article_mercury_retrograde_excerpt:
      "Без паники эти три недели становятся полезным повторяющимся приглашением к пересмотру.",
    blog_article_mercury_retrograde_read_time: "5 мин чтения",
  },
  it: {
    ...en,
    blog_categories_label: "Categorie degli articoli",
    blog_category_all: "Tutti",
    blog_category_techniques: "Tecniche",
    blog_category_birth_chart: "Tema natale",
    blog_category_the_sky: "Il cielo",
    blog_category_transits: "Transiti",
    blog_category_beginner: "Principianti",
    blog_article_aries_rising_category: "Tema natale",
    blog_article_aries_rising_title: "Ascendente Ariete: il pioniere",
    blog_article_aries_rising_excerpt:
      "Cosa significa avere l’Ariete in prima casa — l’energia audace e diretta che plasma ogni prima impressione.",
    blog_article_aries_rising_read_time: "6 min di lettura",
    blog_article_morning_star_category: "Il cielo",
    blog_article_morning_star_title: "Stella del mattino, stella della sera",
    blog_article_morning_star_excerpt:
      "Il rapporto di un pianeta con il Sole ne modella l’espressione — avvia prima e riflette dopo.",
    blog_article_morning_star_read_time: "5 min di lettura",
    blog_article_saturn_return_category: "Transiti",
    blog_article_saturn_return_title: "Leggere il ritorno di Saturno",
    blog_article_saturn_return_excerpt:
      "Il passaggio decisivo della fine dei vent’anni: ciò che Saturno chiede di costruire, chiudere e assumere.",
    blog_article_saturn_return_read_time: "8 min di lettura",
    blog_article_twelve_houses_category: "Principianti",
    blog_article_twelve_houses_title: "Le dodici case, stanza per stanza",
    blog_article_twelve_houses_excerpt:
      "Se i segni dicono come agiscono i pianeti, le case dicono dove. Una guida chiara a tutte e dodici.",
    blog_article_twelve_houses_read_time: "6 min di lettura",
    blog_article_mercury_retrograde_category: "Tecniche",
    blog_article_mercury_retrograde_title: "Cosa fa davvero Mercurio retrogrado",
    blog_article_mercury_retrograde_excerpt:
      "Senza panico, le tre settimane diventano un invito utile e ricorrente a rivedere.",
    blog_article_mercury_retrograde_read_time: "5 min di lettura",
  },
  de: {
    ...en,
    blog_categories_label: "Artikelkategorien",
    blog_category_all: "Alle",
    blog_category_techniques: "Techniken",
    blog_category_birth_chart: "Geburtshoroskop",
    blog_category_the_sky: "Der Himmel",
    blog_category_transits: "Transite",
    blog_category_beginner: "Einsteiger",
    blog_article_aries_rising_category: "Geburtshoroskop",
    blog_article_aries_rising_title: "Aszendent Widder: der Pionier",
    blog_article_aries_rising_excerpt:
      "Was Widder im ersten Haus bedeutet — die direkte, mutige Energie hinter jedem ersten Eindruck.",
    blog_article_aries_rising_read_time: "6 Min. Lesezeit",
    blog_article_morning_star_category: "Der Himmel",
    blog_article_morning_star_title: "Morgenstern, Abendstern",
    blog_article_morning_star_excerpt:
      "Die Beziehung eines Planeten zur Sonne prägt seinen Ausdruck — vorher initiierend, danach reflektierend.",
    blog_article_morning_star_read_time: "5 Min. Lesezeit",
    blog_article_saturn_return_category: "Transite",
    blog_article_saturn_return_title: "Die Saturn-Wiederkehr lesen",
    blog_article_saturn_return_excerpt:
      "Der prägende Übergang Ende zwanzig: was Saturn dich aufbauen, beenden und übernehmen lässt.",
    blog_article_saturn_return_read_time: "8 Min. Lesezeit",
    blog_article_twelve_houses_category: "Einsteiger",
    blog_article_twelve_houses_title: "Die zwölf Häuser, Raum für Raum",
    blog_article_twelve_houses_excerpt:
      "Zeichen zeigen, wie Planeten handeln; Häuser zeigen, wo. Eine klare Tour durch alle zwölf.",
    blog_article_twelve_houses_read_time: "6 Min. Lesezeit",
    blog_article_mercury_retrograde_category: "Techniken",
    blog_article_mercury_retrograde_title: "Was Merkur rückläufig wirklich bewirkt",
    blog_article_mercury_retrograde_excerpt:
      "Ohne Panik sind die drei Wochen eine nützliche, wiederkehrende Einladung zum Überarbeiten.",
    blog_article_mercury_retrograde_read_time: "5 Min. Lesezeit",
  },
} satisfies Record<SupportedLocale, BlogCategoriesGridCopy>;

export const getBlogCategoriesGridCopy = (
  locale: SupportedLocale,
): BlogCategoriesGridCopy => copyByLocale[locale] ?? copyByLocale.en;
