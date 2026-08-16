import type { SupportedLocale } from "../../../localization-contract.ts";
import type { ShopProductId } from "../../../shop/catalog.ts";
import { getShopProductGridCopy } from "./product-grid.ts";

type ProductDetailCopy = {
  description: string;
  shipNote: string;
  includes: [string, string, string, string];
  variantLabel?: string;
  variantOptions?: string[];
};

export type ShopProductDetailCopy = {
  breadcrumbLabel: string;
  reviewsLabel: string;
  personalizedEyebrow: string;
  personalizedChartLabel: string;
  addLabel: string;
  shippingStatusLabel: string;
  inBoxLabel: string;
  relatedLabel: string;
  quantityLabel: string;
  quantityValueLabel: string;
  decrementLabel: string;
  incrementLabel: string;
  products: Record<ShopProductId, ProductDetailCopy>;
};

const enProducts: Record<ShopProductId, ProductDetailCopy> = {
  "natal-print": {
    description: "Your birth chart rendered as a museum-grade giclée and framed in solid wood. Every planet, house cusp and aspect line is drawn from your exact moment of birth.",
    shipNote: "Made to order · ships in 5–7 days",
    includes: ["Archival giclée print", "Solid wood frame, ready to hang", "Rendered from your saved chart", "A6 card explaining your placements"],
    variantLabel: "Frame",
    variantOptions: ["Oak", "Walnut", "Black"],
  },
  tapestry: {
    description: "A soft woven wall hanging of the northern night sky, with its brightest constellations picked out in gold thread.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["100% brushed cotton", "Hidden rod pocket for hanging", "Colourfast gold thread", "Care card included"],
    variantLabel: "Size",
    variantOptions: ["Small", "Large"],
  },
  almanac: {
    description: "The whole year of sky in one book — every lunation, ingress and retrograde, month by month, with plain-language notes.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["288 pages, softcover", "Every 2026 transit dated", "Monthly Moon planner", "Ribbon marker"],
  },
  tarot: {
    description: "A full 78-card deck illustrated in the Sidera palette, with each major arcana tied to a planet or sign.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["78 gold-edged cards", "Rigid keepsake box", "56-page guidebook", "Linen carry pouch"],
  },
  notebook: {
    description: "A dot-grid notebook for keeping your own sky journal, with dated moon phases in the margin of every spread.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["160 dot-grid pages", "Moon phase margins", "Lay-flat binding", "Elastic closure"],
    variantLabel: "Cover",
    variantOptions: ["Cream", "Terracotta"],
  },
  candle: {
    description: "A hand-poured soy candle in a reusable amber vessel, made for quiet evenings and new-moon intentions.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["100% soy wax", "Reusable amber glass", "40-hour burn time", "Cotton wick, clean burn"],
    variantLabel: "Scent",
    variantOptions: ["Cedar", "Amber", "Sage"],
  },
  scarf: {
    description: "A large square of mulberry silk printed with a soft star map and hand-rolled at the edges.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["100% mulberry silk", "Hand-rolled edges", "90 × 90cm", "Gift boxed"],
  },
  pins: {
    description: "Four hard-enamel pins in brushed gold — choose the element that runs through your chart.",
    shipNote: "In stock · ships in 1–2 days",
    includes: ["4 hard-enamel pins", "Brushed gold plating", "Secure rubber backs", "Printed backing card"],
    variantLabel: "Element",
    variantOptions: ["Fire", "Earth", "Air", "Water"],
  },
  pendant: {
    description: "A slim disc engraved with the wheel of your natal chart and strung on a fine chain. No two are alike.",
    shipNote: "Made to order · ships in 7–10 days",
    includes: ["Engraved from your chart", "45cm fine chain", "Gold or silver plate", "Velvet jewelry pouch"],
    variantLabel: "Metal",
    variantOptions: ["Gold", "Silver"],
  },
};

const deProducts: Record<ShopProductId, ProductDetailCopy> = {
  "natal-print": {
    description: "Dein Geburtshoroskop als Giclée in Museumsqualität, gerahmt in Massivholz. Jeder Planet, jede Häuserspitze und jeder Aspekt folgt deinem exakten Geburtsmoment.",
    shipNote: "Auf Bestellung gefertigt · Versand in 5–7 Tagen",
    includes: ["Archivfester Giclée-Druck", "Massivholzrahmen, fertig zum Aufhängen", "Aus deinem gespeicherten Horoskop", "A6-Karte mit deinen Platzierungen"],
    variantLabel: "Rahmen",
    variantOptions: ["Eiche", "Walnuss", "Schwarz"],
  },
  tapestry: {
    description: "Ein weicher Wandteppich des nördlichen Nachthimmels, dessen hellste Sternbilder mit Goldfaden hervorgehoben sind.",
    shipNote: "Auf Lager · Versand in 1–2 Tagen",
    includes: ["100 % gebürstete Baumwolle", "Verdeckter Stabtunnel", "Farbechter Goldfaden", "Pflegekarte inklusive"],
    variantLabel: "Größe",
    variantOptions: ["Klein", "Groß"],
  },
  almanac: { ...enProducts.almanac, description: "Das ganze Himmelsjahr in einem Buch — jede Lunation, jeder Zeichenwechsel und jede Rückläufigkeit Monat für Monat.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["288 Seiten, Softcover", "Alle Transite 2026 datiert", "Monatlicher Mondplaner", "Leseband"] },
  tarot: { ...enProducts.tarot, description: "Ein vollständiges Tarot mit 78 Karten in der Sidera-Palette, jede große Arkana einem Planeten oder Zeichen zugeordnet.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["78 Karten mit Goldschnitt", "Stabile Erinnerungsbox", "56-seitiges Begleitheft", "Leinenbeutel"] },
  notebook: { ...enProducts.notebook, description: "Ein Punktraster-Notizbuch für dein Himmelsjournal, mit datierten Mondphasen am Rand jeder Doppelseite.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["160 Punktraster-Seiten", "Mondphasen am Seitenrand", "Flachliegende Bindung", "Elastischer Verschluss"], variantLabel: "Einband", variantOptions: ["Creme", "Terrakotta"] },
  candle: { ...enProducts.candle, description: "Handgegossene Sojakerze im wiederverwendbaren Braunglas für ruhige Abende und Neumond-Intentionen.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["100 % Sojawachs", "Wiederverwendbares Braunglas", "40 Stunden Brenndauer", "Baumwolldocht"], variantLabel: "Duft", variantOptions: ["Zeder", "Amber", "Salbei"] },
  scarf: { ...enProducts.scarf, description: "Ein großes Tuch aus Maulbeerseide mit sanfter Sternkarte und handrollierten Kanten.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["100 % Maulbeerseide", "Handrollierte Kanten", "90 × 90 cm", "Geschenkbox"] },
  pins: { ...enProducts.pins, description: "Vier Hartemaille-Pins in gebürstetem Gold — wähle das Element, das dein Horoskop prägt.", shipNote: "Auf Lager · Versand in 1–2 Tagen", includes: ["4 Hartemaille-Pins", "Gebürstete Goldauflage", "Sichere Gummiverschlüsse", "Bedruckte Trägerkarte"], variantLabel: "Element", variantOptions: ["Feuer", "Erde", "Luft", "Wasser"] },
  pendant: { ...enProducts.pendant, description: "Eine feine Scheibe mit dem Rad deines Geburtshoroskops an einer zarten Kette. Kein Stück gleicht dem anderen.", shipNote: "Auf Bestellung gefertigt · Versand in 7–10 Tagen", includes: ["Nach deinem Horoskop graviert", "Feine 45-cm-Kette", "Gold- oder Silberauflage", "Samtbeutel"], variantLabel: "Metall", variantOptions: ["Gold", "Silber"] },
};

const en: ShopProductDetailCopy = {
  breadcrumbLabel: "Product breadcrumb",
  reviewsLabel: "reviews",
  personalizedEyebrow: "Printed from your chart",
  personalizedChartLabel: "Natal chart",
  addLabel: "Add to cart",
  shippingStatusLabel: "Shipping status",
  inBoxLabel: "In the box",
  relatedLabel: "You may also like",
  quantityLabel: "Quantity",
  quantityValueLabel: "Current quantity",
  decrementLabel: "Decrease quantity",
  incrementLabel: "Increase quantity",
  products: enProducts,
};

const localizedProductSet = (
  locale: Exclude<SupportedLocale, "en" | "de">,
  copy: {
    descriptionSuffix: string;
    shipNote: string;
    includes: [string, string, string, string];
    variants: Record<string, { label: string; options: string[] }>;
  },
): Record<ShopProductId, ProductDetailCopy> => {
  const titles = getShopProductGridCopy(locale).products;
  return Object.fromEntries(
    Object.entries(enProducts).map(([id, product]) => {
      const localizedVariant = product.variantLabel
        ? copy.variants[product.variantLabel.toLowerCase()]
        : undefined;
      return [
        id,
        {
          ...product,
          description: `${titles[id as ShopProductId].title}. ${copy.descriptionSuffix}`,
          shipNote: copy.shipNote,
          includes: copy.includes,
          variantLabel: localizedVariant?.label,
          variantOptions: localizedVariant?.options,
        },
      ];
    }),
  ) as Record<ShopProductId, ProductDetailCopy>;
};

const esProducts = localizedProductSet("es", {
  descriptionSuffix: "Diseñado con materiales duraderos y los detalles celestes característicos de Sidera.",
  shipNote: "En stock · envío en 1–2 días",
  includes: ["Materiales de alta calidad", "Acabado artesanal", "Listo para regalar", "Guía de cuidado incluida"],
  variants: {
    frame: { label: "Marco", options: ["Roble", "Nogal", "Negro"] },
    size: { label: "Tamaño", options: ["Pequeño", "Grande"] },
    cover: { label: "Cubierta", options: ["Crema", "Terracota"] },
    scent: { label: "Aroma", options: ["Cedro", "Ámbar", "Salvia"] },
    element: { label: "Elemento", options: ["Fuego", "Tierra", "Aire", "Agua"] },
    metal: { label: "Metal", options: ["Oro", "Plata"] },
  },
});
const frProducts = localizedProductSet("fr", {
  descriptionSuffix: "Conçu avec des matériaux durables et les détails célestes propres à Sidera.",
  shipNote: "En stock · expédition sous 1–2 jours",
  includes: ["Matériaux de qualité", "Finition artisanale", "Prêt à offrir", "Guide d’entretien inclus"],
  variants: {
    frame: { label: "Cadre", options: ["Chêne", "Noyer", "Noir"] },
    size: { label: "Taille", options: ["Petit", "Grand"] },
    cover: { label: "Couverture", options: ["Crème", "Terracotta"] },
    scent: { label: "Parfum", options: ["Cèdre", "Ambre", "Sauge"] },
    element: { label: "Élément", options: ["Feu", "Terre", "Air", "Eau"] },
    metal: { label: "Métal", options: ["Or", "Argent"] },
  },
});
const ptProducts = localizedProductSet("pt", {
  descriptionSuffix: "Criado com materiais duráveis e os detalhes celestes característicos da Sidera.",
  shipNote: "Em estoque · envio em 1–2 dias",
  includes: ["Materiais de qualidade", "Acabamento artesanal", "Pronto para presentear", "Guia de cuidados incluído"],
  variants: {
    frame: { label: "Moldura", options: ["Carvalho", "Nogueira", "Preto"] },
    size: { label: "Tamanho", options: ["Pequeno", "Grande"] },
    cover: { label: "Capa", options: ["Creme", "Terracota"] },
    scent: { label: "Aroma", options: ["Cedro", "Âmbar", "Sálvia"] },
    element: { label: "Elemento", options: ["Fogo", "Terra", "Ar", "Água"] },
    metal: { label: "Metal", options: ["Ouro", "Prata"] },
  },
});
const ruProducts = localizedProductSet("ru", {
  descriptionSuffix: "Создано из долговечных материалов с фирменными небесными деталями Sidera.",
  shipNote: "В наличии · отправка через 1–2 дня",
  includes: ["Качественные материалы", "Ручная отделка", "Готово для подарка", "Памятка по уходу"],
  variants: {
    frame: { label: "Рама", options: ["Дуб", "Орех", "Чёрная"] },
    size: { label: "Размер", options: ["Маленький", "Большой"] },
    cover: { label: "Обложка", options: ["Кремовая", "Терракотовая"] },
    scent: { label: "Аромат", options: ["Кедр", "Амбра", "Шалфей"] },
    element: { label: "Стихия", options: ["Огонь", "Земля", "Воздух", "Вода"] },
    metal: { label: "Металл", options: ["Золото", "Серебро"] },
  },
});
const itProducts = localizedProductSet("it", {
  descriptionSuffix: "Realizzato con materiali durevoli e i dettagli celesti caratteristici di Sidera.",
  shipNote: "Disponibile · spedizione in 1–2 giorni",
  includes: ["Materiali di qualità", "Finitura artigianale", "Pronto da regalare", "Guida alla cura inclusa"],
  variants: {
    frame: { label: "Cornice", options: ["Rovere", "Noce", "Nero"] },
    size: { label: "Misura", options: ["Piccolo", "Grande"] },
    cover: { label: "Copertina", options: ["Crema", "Terracotta"] },
    scent: { label: "Profumo", options: ["Cedro", "Ambra", "Salvia"] },
    element: { label: "Elemento", options: ["Fuoco", "Terra", "Aria", "Acqua"] },
    metal: { label: "Metallo", options: ["Oro", "Argento"] },
  },
});

const locales: Record<SupportedLocale, ShopProductDetailCopy> = {
  en,
  es: { ...en, breadcrumbLabel: "Ruta del producto", reviewsLabel: "reseñas", personalizedEyebrow: "Impreso con tu carta", personalizedChartLabel: "Carta natal", addLabel: "Añadir al carrito", shippingStatusLabel: "Estado del envío", inBoxLabel: "En la caja", relatedLabel: "También te puede gustar", quantityLabel: "Cantidad", quantityValueLabel: "Cantidad actual", decrementLabel: "Reducir cantidad", incrementLabel: "Aumentar cantidad", products: esProducts },
  fr: { ...en, breadcrumbLabel: "Fil d’Ariane du produit", reviewsLabel: "avis", personalizedEyebrow: "Imprimé depuis votre thème", personalizedChartLabel: "Thème natal", addLabel: "Ajouter au panier", shippingStatusLabel: "Statut de livraison", inBoxLabel: "Dans la boîte", relatedLabel: "Vous aimerez aussi", quantityLabel: "Quantité", quantityValueLabel: "Quantité actuelle", decrementLabel: "Réduire la quantité", incrementLabel: "Augmenter la quantité", products: frProducts },
  pt: { ...en, breadcrumbLabel: "Caminho do produto", reviewsLabel: "avaliações", personalizedEyebrow: "Impresso do seu mapa", personalizedChartLabel: "Mapa natal", addLabel: "Adicionar ao carrinho", shippingStatusLabel: "Estado do envio", inBoxLabel: "Na caixa", relatedLabel: "Você também pode gostar", quantityLabel: "Quantidade", quantityValueLabel: "Quantidade atual", decrementLabel: "Diminuir quantidade", incrementLabel: "Aumentar quantidade", products: ptProducts },
  ru: { ...en, breadcrumbLabel: "Навигация по товару", reviewsLabel: "отзывов", personalizedEyebrow: "Напечатано по вашей карте", personalizedChartLabel: "Натальная карта", addLabel: "Добавить в корзину", shippingStatusLabel: "Статус доставки", inBoxLabel: "В коробке", relatedLabel: "Вам также понравится", quantityLabel: "Количество", quantityValueLabel: "Текущее количество", decrementLabel: "Уменьшить количество", incrementLabel: "Увеличить количество", products: ruProducts },
  it: { ...en, breadcrumbLabel: "Percorso del prodotto", reviewsLabel: "recensioni", personalizedEyebrow: "Stampato dal tuo tema", personalizedChartLabel: "Tema natale", addLabel: "Aggiungi al carrello", shippingStatusLabel: "Stato della spedizione", inBoxLabel: "Nella confezione", relatedLabel: "Potrebbe piacerti anche", quantityLabel: "Quantità", quantityValueLabel: "Quantità attuale", decrementLabel: "Riduci quantità", incrementLabel: "Aumenta quantità", products: itProducts },
  de: { ...en, breadcrumbLabel: "Produktnavigation", reviewsLabel: "Bewertungen", personalizedEyebrow: "Aus deinem Horoskop gedruckt", personalizedChartLabel: "Geburtshoroskop", addLabel: "In den Warenkorb", shippingStatusLabel: "Versandstatus", inBoxLabel: "In der Box", relatedLabel: "Das könnte dir auch gefallen", quantityLabel: "Menge", quantityValueLabel: "Aktuelle Menge", decrementLabel: "Menge verringern", incrementLabel: "Menge erhöhen", products: deProducts },
};

export const getShopProductDetailCopy = (
  locale: SupportedLocale = "en",
): ShopProductDetailCopy => locales[locale] ?? en;
