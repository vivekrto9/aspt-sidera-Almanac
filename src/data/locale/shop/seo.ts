import type { SupportedLocale } from "../../localization-contract.ts";

const copyByLocale = {
  en: ["Sidera Shop — Astrological Prints, Books and Objects", "Shop chart prints, sky books, jewelry and quiet astrological objects made to live with."],
  es: ["Tienda Sidera — Láminas, libros y objetos astrológicos", "Compra láminas de cartas, libros del cielo, joyería y objetos astrológicos para el día a día."],
  fr: ["Boutique Sidera — Affiches, livres et objets astrologiques", "Découvrez des thèmes imprimés, livres du ciel, bijoux et objets astrologiques pour le quotidien."],
  pt: ["Loja Sidera — Impressões, livros e objetos astrológicos", "Compre impressões de mapas, livros do céu, joalharia e objetos astrológicos para viver."],
  ru: ["Магазин Sidera — Астрологические принты, книги и вещи", "Принты карт, книги о небе, украшения и астрологические предметы для повседневной жизни."],
  it: ["Negozio Sidera — Stampe, libri e oggetti astrologici", "Scopri stampe del tema, libri sul cielo, gioielli e oggetti astrologici da vivere."],
  de: ["Sidera Shop — Astrologische Drucke, Bücher und Objekte", "Entdecke Horoskopdrucke, Himmelsbücher, Schmuck und astrologische Dinge für den Alltag."],
} satisfies Record<SupportedLocale, [string, string]>;

export const getShopSeoCopy = (locale: SupportedLocale) => {
  const [title, description] = copyByLocale[locale] ?? copyByLocale.en;
  return { title, description, imageAlt: "Sidera Shop" };
};
