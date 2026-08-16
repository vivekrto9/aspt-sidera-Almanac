import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeShopItem = {
  title: string;
  category: string;
  price: string;
  imageAlt: string;
  imageSrc?: string;
  href?: string;
};

export type HomeShopCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleRest: string;
  browseLabel: string;
  items: HomeShopItem[];
};

const prices = ["$48", "$16", "$28", "$22"] as const;

const itemSet = (items: Array<Omit<HomeShopItem, "price">>): HomeShopItem[] =>
  items.map((item, index) => ({ ...item, price: prices[index] }));

const copies: Record<SupportedLocale, HomeShopCopy> = {
  en: {
    eyebrow: "Shop",
    titleLead: "The",
    titleAccent: "Sidera",
    titleRest: "shop.",
    browseLabel: "View everything",
    items: itemSet([
      {
        title: "Natal Chart Print",
        category: "Framed giclée",
        imageAlt: "Natal chart print",
      },
      {
        title: "Zodiac Enamel Pins",
        category: "Set of 4",
        imageAlt: "Zodiac enamel pins",
      },
      {
        title: "The Almanac 2026",
        category: "Softcover",
        imageAlt: "The Almanac 2026",
      },
      {
        title: "Lunar Phase Candle",
        category: "Soy · 40hr",
        imageAlt: "Lunar phase candle",
      },
    ]),
  },
  es: {
    eyebrow: "Tienda",
    titleLead: "La tienda",
    titleAccent: "Sidera",
    titleRest: ".",
    browseLabel: "Ver todo",
    items: itemSet([
      {
        title: "Lámina de carta natal",
        category: "Giclée enmarcado",
        imageAlt: "Lámina de carta natal",
      },
      {
        title: "Pines esmaltados del zodiaco",
        category: "Set de 4",
        imageAlt: "Pines esmaltados del zodiaco",
      },
      {
        title: "El Almanaque 2026",
        category: "Tapa blanda",
        imageAlt: "El Almanaque 2026",
      },
      {
        title: "Vela de fases lunares",
        category: "Soja · 40 h",
        imageAlt: "Vela de fases lunares",
      },
    ]),
  },
  fr: {
    eyebrow: "Boutique",
    titleLead: "La boutique",
    titleAccent: "Sidera",
    titleRest: ".",
    browseLabel: "Tout voir",
    items: itemSet([
      {
        title: "Affiche du thème natal",
        category: "Giclée encadrée",
        imageAlt: "Affiche du thème natal",
      },
      {
        title: "Pins émaillés du zodiaque",
        category: "Lot de 4",
        imageAlt: "Pins émaillés du zodiaque",
      },
      {
        title: "L'Almanach 2026",
        category: "Broché",
        imageAlt: "L'Almanach 2026",
      },
      {
        title: "Bougie des phases lunaires",
        category: "Soja · 40 h",
        imageAlt: "Bougie des phases lunaires",
      },
    ]),
  },
  pt: {
    eyebrow: "Loja",
    titleLead: "A loja",
    titleAccent: "Sidera",
    titleRest: ".",
    browseLabel: "Ver tudo",
    items: itemSet([
      {
        title: "Quadro do mapa natal",
        category: "Giclée emoldurada",
        imageAlt: "Quadro do mapa natal",
      },
      {
        title: "Pins esmaltados do zodíaco",
        category: "Conjunto de 4",
        imageAlt: "Pins esmaltados do zodíaco",
      },
      {
        title: "O Almanaque 2026",
        category: "Capa mole",
        imageAlt: "O Almanaque 2026",
      },
      {
        title: "Vela das fases lunares",
        category: "Soja · 40 h",
        imageAlt: "Vela das fases lunares",
      },
    ]),
  },
  ru: {
    eyebrow: "Магазин",
    titleLead: "Магазин",
    titleAccent: "Sidera",
    titleRest: ".",
    browseLabel: "Смотреть всё",
    items: itemSet([
      {
        title: "Постер натальной карты",
        category: "Жикле в раме",
        imageAlt: "Постер натальной карты",
      },
      {
        title: "Эмалевые значки зодиака",
        category: "Набор из 4",
        imageAlt: "Эмалевые значки зодиака",
      },
      {
        title: "Альманах 2026",
        category: "Мягкая обложка",
        imageAlt: "Альманах 2026",
      },
      {
        title: "Свеча лунных фаз",
        category: "Соя · 40 ч",
        imageAlt: "Свеча лунных фаз",
      },
    ]),
  },
  it: {
    eyebrow: "Negozio",
    titleLead: "Il negozio",
    titleAccent: "Sidera",
    titleRest: ".",
    browseLabel: "Vedi tutto",
    items: itemSet([
      {
        title: "Stampa del tema natale",
        category: "Giclée incorniciata",
        imageAlt: "Stampa del tema natale",
      },
      {
        title: "Spille smaltate zodiacali",
        category: "Set da 4",
        imageAlt: "Spille smaltate zodiacali",
      },
      {
        title: "L'Almanacco 2026",
        category: "Brossura",
        imageAlt: "L'Almanacco 2026",
      },
      {
        title: "Candela delle fasi lunari",
        category: "Soia · 40 ore",
        imageAlt: "Candela delle fasi lunari",
      },
    ]),
  },
  de: {
    eyebrow: "Shop",
    titleLead: "Der",
    titleAccent: "Sidera",
    titleRest: "Shop.",
    browseLabel: "Alles ansehen",
    items: itemSet([
      {
        title: "Geburtshoroskop-Druck",
        category: "Gerahmter Giclée-Druck",
        imageAlt: "Geburtshoroskop-Druck",
      },
      {
        title: "Sternzeichen-Emaille-Pins",
        category: "4er-Set",
        imageAlt: "Sternzeichen-Emaille-Pins",
      },
      {
        title: "Der Almanach 2026",
        category: "Softcover",
        imageAlt: "Der Almanach 2026",
      },
      {
        title: "Mondphasenkerze",
        category: "Soja · 40 Std.",
        imageAlt: "Mondphasenkerze",
      },
    ]),
  },
};

export const getHomeShopCopy = (locale: SupportedLocale): HomeShopCopy =>
  copies[locale] ?? copies.en;
