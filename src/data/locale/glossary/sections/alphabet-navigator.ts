import type { SupportedLocale } from "../../../localization-contract.ts";

export type GlossaryAlphabetNavigatorCopy = {
  navigationLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearchLabel: string;
  resultsLabel: string;
  emptyTitle: string;
};

const copyByLocale = {
  en: {
    navigationLabel: "Glossary index",
    searchLabel: "Search the glossary",
    searchPlaceholder: "Type a term or definition",
    clearSearchLabel: "Clear search",
    resultsLabel: "{count} terms",
    emptyTitle: "No matching terms.",
  },
  es: {
    navigationLabel: "Índice del glosario",
    searchLabel: "Buscar en el glosario",
    searchPlaceholder: "Escribe un término o definición",
    clearSearchLabel: "Borrar búsqueda",
    resultsLabel: "{count} términos",
    emptyTitle: "No hay términos coincidentes.",
  },
  fr: {
    navigationLabel: "Index du glossaire",
    searchLabel: "Rechercher dans le glossaire",
    searchPlaceholder: "Saisissez un terme ou une définition",
    clearSearchLabel: "Effacer la recherche",
    resultsLabel: "{count} termes",
    emptyTitle: "Aucun terme correspondant.",
  },
  pt: {
    navigationLabel: "Índice do glossário",
    searchLabel: "Pesquisar no glossário",
    searchPlaceholder: "Digite um termo ou definição",
    clearSearchLabel: "Limpar pesquisa",
    resultsLabel: "{count} termos",
    emptyTitle: "Nenhum termo correspondente.",
  },
  ru: {
    navigationLabel: "Алфавитный указатель глоссария",
    searchLabel: "Поиск по глоссарию",
    searchPlaceholder: "Введите термин или определение",
    clearSearchLabel: "Очистить поиск",
    resultsLabel: "Терминов: {count}",
    emptyTitle: "Совпадающих терминов нет.",
  },
  it: {
    navigationLabel: "Indice del glossario",
    searchLabel: "Cerca nel glossario",
    searchPlaceholder: "Digita un termine o una definizione",
    clearSearchLabel: "Cancella ricerca",
    resultsLabel: "{count} termini",
    emptyTitle: "Nessun termine corrispondente.",
  },
  de: {
    navigationLabel: "Glossarverzeichnis",
    searchLabel: "Glossar durchsuchen",
    searchPlaceholder: "Begriff oder Definition eingeben",
    clearSearchLabel: "Suche löschen",
    resultsLabel: "{count} Begriffe",
    emptyTitle: "Keine passenden Begriffe.",
  },
} satisfies Record<SupportedLocale, GlossaryAlphabetNavigatorCopy>;

export const getGlossaryAlphabetNavigatorCopy = (
  locale: SupportedLocale,
): GlossaryAlphabetNavigatorCopy => copyByLocale[locale] ?? copyByLocale.en;
