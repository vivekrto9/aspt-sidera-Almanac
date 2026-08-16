export type ShopCategoryId = "all" | "prints" | "books" | "home" | "jewelry";

export type ShopProductId =
  | "natal-print"
  | "tapestry"
  | "almanac"
  | "tarot"
  | "notebook"
  | "candle"
  | "scarf"
  | "pins"
  | "pendant";

export type ShopCatalogProduct = {
  id: ShopProductId;
  category: Exclude<ShopCategoryId, "all">;
  price: number;
  personalized?: boolean;
  rating: number;
  reviews: number;
  tone: number;
  variant?: {
    key: "frame" | "size" | "cover" | "scent" | "element" | "metal";
    optionCount: number;
  };
};

export const shopCatalogProducts: ShopCatalogProduct[] = [
  { id: "natal-print", category: "prints", price: 48, personalized: true, rating: 4.9, reviews: 214, tone: 0, variant: { key: "frame", optionCount: 3 } },
  { id: "tapestry", category: "prints", price: 64, rating: 4.8, reviews: 96, tone: 1, variant: { key: "size", optionCount: 2 } },
  { id: "almanac", category: "books", price: 28, rating: 4.9, reviews: 340, tone: 2 },
  { id: "tarot", category: "books", price: 34, rating: 4.7, reviews: 158, tone: 3 },
  { id: "notebook", category: "books", price: 18, rating: 4.8, reviews: 203, tone: 2, variant: { key: "cover", optionCount: 2 } },
  { id: "candle", category: "home", price: 22, rating: 4.9, reviews: 512, tone: 4, variant: { key: "scent", optionCount: 3 } },
  { id: "scarf", category: "home", price: 58, rating: 4.8, reviews: 74, tone: 5 },
  { id: "pins", category: "jewelry", price: 16, rating: 4.7, reviews: 189, tone: 6, variant: { key: "element", optionCount: 4 } },
  { id: "pendant", category: "jewelry", price: 52, personalized: true, rating: 5, reviews: 88, tone: 7, variant: { key: "metal", optionCount: 2 } },
];

export const shopCategoryIds: ShopCategoryId[] = [
  "all",
  "prints",
  "books",
  "home",
  "jewelry",
];

export const isShopCategoryId = (value: string): value is ShopCategoryId =>
  shopCategoryIds.includes(value as ShopCategoryId);

export const getShopResultCount = (category: ShopCategoryId) =>
  category === "all"
    ? shopCatalogProducts.length
    : shopCatalogProducts.filter((item) => item.category === category).length;

export const getShopProducts = (category: ShopCategoryId) =>
  category === "all"
    ? shopCatalogProducts
    : shopCatalogProducts.filter((item) => item.category === category);
