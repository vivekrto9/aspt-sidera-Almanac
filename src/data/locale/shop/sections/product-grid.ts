import type { SupportedLocale } from "../../../localization-contract.ts";
import type { ShopProductId } from "../../../shop/catalog.ts";

type ProductCopy = {
  title: string;
  unit: string;
  fallbackLabel: string;
};

type PerkCopy = {
  title: string;
  description: string;
};

export type ShopProductGridCopy = {
  ariaLabel: string;
  personalizedLabel: string;
  viewLabel: string;
  addLabel: string;
  products: Record<ShopProductId, ProductCopy>;
  perks: [PerkCopy, PerkCopy, PerkCopy];
};

const en: ShopProductGridCopy = {
  ariaLabel: "Shop products",
  personalizedLabel: "Made from your chart",
  viewLabel: "View",
  addLabel: "Add to cart",
  products: {
    "natal-print": { title: "Natal Chart Print", unit: "Framed giclée", fallbackLabel: "natal chart print" },
    tapestry: { title: "Constellation Tapestry", unit: "Woven cotton · 130×90cm", fallbackLabel: "constellation tapestry" },
    almanac: { title: "The Almanac 2026", unit: "Softcover · 288 pages", fallbackLabel: "the almanac 2026" },
    tarot: { title: "Celestial Tarot Deck", unit: "78 cards · keepsake box", fallbackLabel: "celestial tarot deck" },
    notebook: { title: "Ephemeris Notebook", unit: "Lay-flat · 160 pages", fallbackLabel: "ephemeris notebook" },
    candle: { title: "Lunar Phase Candle", unit: "Soy wax · 40hr burn", fallbackLabel: "lunar phase candle" },
    scarf: { title: "Star Map Silk Scarf", unit: "Mulberry silk · 90cm", fallbackLabel: "star map silk scarf" },
    pins: { title: "Zodiac Enamel Pins", unit: "Set of 4 · hard enamel", fallbackLabel: "zodiac enamel pins" },
    pendant: { title: "Birth Chart Pendant", unit: "Engraved · 45cm chain", fallbackLabel: "birth chart pendant" },
  },
  perks: [
    { title: "Made to be lived with", description: "Small-batch, archival materials — nothing throwaway." },
    { title: "Free shipping over $75", description: "Tracked worldwide. Flat $6.50 under that." },
    { title: "30-day returns", description: "Changed your mind? Send it back, no questions." },
  ],
};

const locales: Record<SupportedLocale, ShopProductGridCopy> = {
  en,
  es: {
    ...en,
    ariaLabel: "Productos de la tienda",
    personalizedLabel: "Hecho con tu carta",
    viewLabel: "Ver",
    addLabel: "Añadir al carrito",
    products: {
      "natal-print": { title: "Lámina de carta natal", unit: "Giclée enmarcada", fallbackLabel: "lámina de carta natal" },
      tapestry: { title: "Tapiz de constelaciones", unit: "Algodón tejido · 130×90cm", fallbackLabel: "tapiz de constelaciones" },
      almanac: { title: "El Almanaque 2026", unit: "Tapa blanda · 288 páginas", fallbackLabel: "el almanaque 2026" },
      tarot: { title: "Tarot Celestial", unit: "78 cartas · caja recuerdo", fallbackLabel: "tarot celestial" },
      notebook: { title: "Cuaderno de efemérides", unit: "Apertura plana · 160 páginas", fallbackLabel: "cuaderno de efemérides" },
      candle: { title: "Vela de fases lunares", unit: "Cera de soja · 40 h", fallbackLabel: "vela de fases lunares" },
      scarf: { title: "Pañuelo de seda mapa estelar", unit: "Seda de morera · 90cm", fallbackLabel: "pañuelo mapa estelar" },
      pins: { title: "Pines esmaltados del zodiaco", unit: "Set de 4 · esmalte duro", fallbackLabel: "pines del zodiaco" },
      pendant: { title: "Colgante de carta natal", unit: "Grabado · cadena de 45cm", fallbackLabel: "colgante de carta natal" },
    },
    perks: [
      { title: "Hecho para acompañarte", description: "Series pequeñas y materiales de archivo, nada desechable." },
      { title: "Envío gratis desde $75", description: "Seguimiento mundial. Tarifa fija de $6.50 por debajo." },
      { title: "Devoluciones en 30 días", description: "¿Cambiaste de idea? Devuélvelo sin preguntas." },
    ],
  },
  fr: {
    ...en,
    ariaLabel: "Produits de la boutique",
    personalizedLabel: "Créé à partir de votre thème",
    viewLabel: "Voir",
    addLabel: "Ajouter au panier",
    products: {
      "natal-print": { title: "Affiche du thème natal", unit: "Giclée encadrée", fallbackLabel: "affiche du thème natal" },
      tapestry: { title: "Tapisserie des constellations", unit: "Coton tissé · 130×90cm", fallbackLabel: "tapisserie des constellations" },
      almanac: { title: "L’Almanach 2026", unit: "Broché · 288 pages", fallbackLabel: "l’almanach 2026" },
      tarot: { title: "Tarot céleste", unit: "78 cartes · coffret", fallbackLabel: "tarot céleste" },
      notebook: { title: "Carnet d’éphémérides", unit: "Ouverture à plat · 160 pages", fallbackLabel: "carnet d’éphémérides" },
      candle: { title: "Bougie des phases lunaires", unit: "Cire de soja · 40 h", fallbackLabel: "bougie des phases lunaires" },
      scarf: { title: "Foulard en soie carte du ciel", unit: "Soie de mûrier · 90cm", fallbackLabel: "foulard carte du ciel" },
      pins: { title: "Pins émaillés du zodiaque", unit: "Lot de 4 · émail dur", fallbackLabel: "pins du zodiaque" },
      pendant: { title: "Pendentif thème natal", unit: "Gravé · chaîne de 45cm", fallbackLabel: "pendentif thème natal" },
    },
    perks: [
      { title: "Fait pour vivre avec vous", description: "Petites séries et matériaux d’archive, rien de jetable." },
      { title: "Livraison offerte dès $75", description: "Suivi mondial. Forfait de $6.50 en dessous." },
      { title: "Retours sous 30 jours", description: "Vous changez d’avis ? Renvoyez-le sans justification." },
    ],
  },
  pt: {
    ...en,
    ariaLabel: "Produtos da loja",
    personalizedLabel: "Feito a partir do seu mapa",
    viewLabel: "Ver",
    addLabel: "Adicionar ao carrinho",
    products: {
      "natal-print": { title: "Impressão do mapa natal", unit: "Giclée emoldurada", fallbackLabel: "impressão do mapa natal" },
      tapestry: { title: "Tapeçaria de constelações", unit: "Algodão tecido · 130×90cm", fallbackLabel: "tapeçaria de constelações" },
      almanac: { title: "O Almanaque 2026", unit: "Capa mole · 288 páginas", fallbackLabel: "o almanaque 2026" },
      tarot: { title: "Tarô Celestial", unit: "78 cartas · caixa", fallbackLabel: "tarô celestial" },
      notebook: { title: "Caderno de efemérides", unit: "Abertura plana · 160 páginas", fallbackLabel: "caderno de efemérides" },
      candle: { title: "Vela das fases lunares", unit: "Cera de soja · 40 h", fallbackLabel: "vela das fases lunares" },
      scarf: { title: "Lenço de seda mapa estelar", unit: "Seda de amoreira · 90cm", fallbackLabel: "lenço mapa estelar" },
      pins: { title: "Pins esmaltados do zodíaco", unit: "Conjunto de 4 · esmalte duro", fallbackLabel: "pins do zodíaco" },
      pendant: { title: "Pingente do mapa natal", unit: "Gravado · corrente de 45cm", fallbackLabel: "pingente do mapa natal" },
    },
    perks: [
      { title: "Feito para viver com você", description: "Pequenos lotes e materiais duradouros, nada descartável." },
      { title: "Frete grátis acima de $75", description: "Rastreado no mundo todo. Tarifa de $6.50 abaixo disso." },
      { title: "Devoluções em 30 dias", description: "Mudou de ideia? Devolva sem perguntas." },
    ],
  },
  ru: {
    ...en,
    ariaLabel: "Товары магазина",
    personalizedLabel: "Создано по вашей карте",
    viewLabel: "Смотреть",
    addLabel: "Добавить в корзину",
    products: {
      "natal-print": { title: "Постер натальной карты", unit: "Жикле в раме", fallbackLabel: "постер натальной карты" },
      tapestry: { title: "Гобелен с созвездиями", unit: "Тканый хлопок · 130×90 см", fallbackLabel: "гобелен с созвездиями" },
      almanac: { title: "Альманах 2026", unit: "Мягкая обложка · 288 страниц", fallbackLabel: "альманах 2026" },
      tarot: { title: "Небесная колода Таро", unit: "78 карт · подарочная коробка", fallbackLabel: "небесная колода таро" },
      notebook: { title: "Блокнот эфемерид", unit: "Раскрытие на 180° · 160 страниц", fallbackLabel: "блокнот эфемерид" },
      candle: { title: "Свеча лунных фаз", unit: "Соевый воск · 40 часов", fallbackLabel: "свеча лунных фаз" },
      scarf: { title: "Шёлковый платок с картой звёзд", unit: "Шёлк тутового шелкопряда · 90 см", fallbackLabel: "платок с картой звёзд" },
      pins: { title: "Эмалевые значки зодиака", unit: "Набор из 4 · твёрдая эмаль", fallbackLabel: "значки зодиака" },
      pendant: { title: "Кулон с натальной картой", unit: "Гравировка · цепочка 45 см", fallbackLabel: "кулон с натальной картой" },
    },
    perks: [
      { title: "Создано для жизни", description: "Малые серии и архивные материалы — ничего одноразового." },
      { title: "Бесплатная доставка от $75", description: "Отслеживание по всему миру. Ниже — фиксированные $6.50." },
      { title: "Возврат в течение 30 дней", description: "Передумали? Отправьте обратно без лишних вопросов." },
    ],
  },
  it: {
    ...en,
    ariaLabel: "Prodotti del negozio",
    personalizedLabel: "Creato dalla tua carta",
    viewLabel: "Vedi",
    addLabel: "Aggiungi al carrello",
    products: {
      "natal-print": { title: "Stampa del tema natale", unit: "Giclée incorniciata", fallbackLabel: "stampa del tema natale" },
      tapestry: { title: "Arazzo delle costellazioni", unit: "Cotone tessuto · 130×90cm", fallbackLabel: "arazzo delle costellazioni" },
      almanac: { title: "L’Almanacco 2026", unit: "Brossura · 288 pagine", fallbackLabel: "l’almanacco 2026" },
      tarot: { title: "Tarocchi Celesti", unit: "78 carte · cofanetto", fallbackLabel: "tarocchi celesti" },
      notebook: { title: "Quaderno delle effemeridi", unit: "Apertura piatta · 160 pagine", fallbackLabel: "quaderno delle effemeridi" },
      candle: { title: "Candela delle fasi lunari", unit: "Cera di soia · 40 ore", fallbackLabel: "candela delle fasi lunari" },
      scarf: { title: "Foulard in seta mappa stellare", unit: "Seta di gelso · 90cm", fallbackLabel: "foulard mappa stellare" },
      pins: { title: "Spille smaltate dello zodiaco", unit: "Set di 4 · smalto duro", fallbackLabel: "spille dello zodiaco" },
      pendant: { title: "Ciondolo del tema natale", unit: "Inciso · catena da 45cm", fallbackLabel: "ciondolo del tema natale" },
    },
    perks: [
      { title: "Fatto per essere vissuto", description: "Piccole serie e materiali d’archivio, niente usa e getta." },
      { title: "Spedizione gratuita oltre $75", description: "Tracciata in tutto il mondo. Tariffa di $6.50 sotto la soglia." },
      { title: "Resi entro 30 giorni", description: "Hai cambiato idea? Restituiscilo senza domande." },
    ],
  },
  de: {
    ...en,
    ariaLabel: "Shop-Produkte",
    personalizedLabel: "Aus deinem Horoskop gefertigt",
    viewLabel: "Ansehen",
    addLabel: "In den Warenkorb",
    products: {
      "natal-print": { title: "Geburtshoroskop-Druck", unit: "Gerahmter Giclée-Druck", fallbackLabel: "geburtshoroskop-druck" },
      tapestry: { title: "Sternbild-Wandteppich", unit: "Gewebte Baumwolle · 130×90cm", fallbackLabel: "sternbild-wandteppich" },
      almanac: { title: "Der Almanach 2026", unit: "Softcover · 288 Seiten", fallbackLabel: "der almanach 2026" },
      tarot: { title: "Himmlisches Tarot", unit: "78 Karten · Erinnerungsbox", fallbackLabel: "himmlisches tarot" },
      notebook: { title: "Ephemeriden-Notizbuch", unit: "Flachliegend · 160 Seiten", fallbackLabel: "ephemeriden-notizbuch" },
      candle: { title: "Mondphasenkerze", unit: "Sojawachs · 40 Std.", fallbackLabel: "mondphasenkerze" },
      scarf: { title: "Seidenschal mit Sternkarte", unit: "Maulbeerseide · 90cm", fallbackLabel: "seidenschal mit sternkarte" },
      pins: { title: "Tierkreis-Emaille-Pins", unit: "4er-Set · Hartemaille", fallbackLabel: "tierkreis-emaille-pins" },
      pendant: { title: "Geburtshoroskop-Anhänger", unit: "Graviert · 45cm Kette", fallbackLabel: "geburtshoroskop-anhänger" },
    },
    perks: [
      { title: "Fürs echte Leben gemacht", description: "Kleine Serien und Archivmaterialien — nichts für den Wegwerfgebrauch." },
      { title: "Kostenloser Versand ab $75", description: "Weltweit verfolgt. Darunter pauschal $6.50." },
      { title: "30 Tage Rückgaberecht", description: "Anders entschieden? Einfach ohne Fragen zurücksenden." },
    ],
  },
};

export const getShopProductGridCopy = (
  locale: SupportedLocale = "en",
): ShopProductGridCopy => locales[locale] ?? en;
