import type { SupportedLocale } from "../../../localization-contract.ts";

export type ShopCatalogIntroControlsCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  filterLabel: string;
  categoryAll: string;
  categoryPrints: string;
  categoryBooks: string;
  categoryHome: string;
  categoryJewelry: string;
  piecesSuffix: string;
  navShopLabel: string;
  cartLabel: string;
};

const copyByLocale = {
  en: { eyebrow: "The Sidera Shop", titleLead: "Objects for the", titleAccent: "star-minded", titleRest: ".", description: "Prints of your own chart, books to read the sky by, and quiet things for the home — each one made to be lived with, not just looked at.", filterLabel: "Filter shop categories", categoryAll: "All", categoryPrints: "Prints", categoryBooks: "Books", categoryHome: "Home", categoryJewelry: "Jewelry", piecesSuffix: "pieces", navShopLabel: "Shop", cartLabel: "Cart" },
  es: { eyebrow: "La tienda Sidera", titleLead: "Objetos para mentes", titleAccent: "estelares", titleRest: ".", description: "Láminas de tu carta, libros para leer el cielo y objetos serenos para el hogar, hechos para convivir con ellos.", filterLabel: "Filtrar categorías", categoryAll: "Todo", categoryPrints: "Láminas", categoryBooks: "Libros", categoryHome: "Hogar", categoryJewelry: "Joyería", piecesSuffix: "piezas", navShopLabel: "Tienda", cartLabel: "Carrito" },
  fr: { eyebrow: "La boutique Sidera", titleLead: "Des objets pour les esprits", titleAccent: "tournés vers les étoiles", titleRest: ".", description: "Des impressions de votre thème, des livres pour lire le ciel et des objets paisibles pour la maison, faits pour accompagner la vie.", filterLabel: "Filtrer les catégories", categoryAll: "Tout", categoryPrints: "Affiches", categoryBooks: "Livres", categoryHome: "Maison", categoryJewelry: "Bijoux", piecesSuffix: "pièces", navShopLabel: "Boutique", cartLabel: "Panier" },
  pt: { eyebrow: "A loja Sidera", titleLead: "Objetos para mentes", titleAccent: "voltadas às estrelas", titleRest: ".", description: "Impressões do seu mapa, livros para ler o céu e objetos tranquilos para a casa, feitos para fazer parte da vida.", filterLabel: "Filtrar categorias", categoryAll: "Tudo", categoryPrints: "Impressões", categoryBooks: "Livros", categoryHome: "Casa", categoryJewelry: "Joalharia", piecesSuffix: "peças", navShopLabel: "Loja", cartLabel: "Carrinho" },
  ru: { eyebrow: "Магазин Sidera", titleLead: "Вещи для тех, кто", titleAccent: "смотрит на звёзды", titleRest: ".", description: "Принты вашей карты, книги о небе и спокойные вещи для дома — созданные для жизни, а не только для взгляда.", filterLabel: "Фильтр категорий", categoryAll: "Все", categoryPrints: "Принты", categoryBooks: "Книги", categoryHome: "Дом", categoryJewelry: "Украшения", piecesSuffix: "товаров", navShopLabel: "Магазин", cartLabel: "Корзина" },
  it: { eyebrow: "Il negozio Sidera", titleLead: "Oggetti per menti", titleAccent: "rivolte alle stelle", titleRest: ".", description: "Stampe del tuo tema, libri per leggere il cielo e oggetti quieti per la casa, fatti per essere vissuti.", filterLabel: "Filtra le categorie", categoryAll: "Tutto", categoryPrints: "Stampe", categoryBooks: "Libri", categoryHome: "Casa", categoryJewelry: "Gioielli", piecesSuffix: "pezzi", navShopLabel: "Negozio", cartLabel: "Carrello" },
  de: { eyebrow: "Der Sidera Shop", titleLead: "Objekte für", titleAccent: "Sternenmenschen", titleRest: ".", description: "Drucke deines Horoskops, Bücher zum Lesen des Himmels und ruhige Dinge fürs Zuhause — zum Leben gemacht.", filterLabel: "Shop-Kategorien filtern", categoryAll: "Alle", categoryPrints: "Drucke", categoryBooks: "Bücher", categoryHome: "Zuhause", categoryJewelry: "Schmuck", piecesSuffix: "Stücke", navShopLabel: "Shop", cartLabel: "Warenkorb" },
} satisfies Record<SupportedLocale, ShopCatalogIntroControlsCopy>;

export const getShopCatalogIntroControlsCopy = (
  locale: SupportedLocale,
): ShopCatalogIntroControlsCopy => copyByLocale[locale] ?? copyByLocale.en;
