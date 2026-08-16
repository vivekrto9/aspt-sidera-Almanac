import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountCollectionsCopy = {
  viewAllLabel: string;
  backLabel: string;
  paginationLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  itemsLabel: string;
};

const copy: Record<SupportedLocale, AccountCollectionsCopy> = {
  en: {
    viewAllLabel: "View all",
    backLabel: "Back to account",
    paginationLabel: "Collection pages",
    previousLabel: "Previous",
    nextLabel: "Next",
    pageLabel: "Page {page}",
    itemsLabel: "items",
  },
  es: {
    viewAllLabel: "Ver todo",
    backLabel: "Volver a la cuenta",
    paginationLabel: "Páginas de la colección",
    previousLabel: "Anterior",
    nextLabel: "Siguiente",
    pageLabel: "Página {page}",
    itemsLabel: "elementos",
  },
  fr: {
    viewAllLabel: "Tout voir",
    backLabel: "Retour au compte",
    paginationLabel: "Pages de la collection",
    previousLabel: "Précédent",
    nextLabel: "Suivant",
    pageLabel: "Page {page}",
    itemsLabel: "éléments",
  },
  pt: {
    viewAllLabel: "Ver tudo",
    backLabel: "Voltar à conta",
    paginationLabel: "Páginas da coleção",
    previousLabel: "Anterior",
    nextLabel: "Próxima",
    pageLabel: "Página {page}",
    itemsLabel: "itens",
  },
  ru: {
    viewAllLabel: "Показать все",
    backLabel: "Назад в аккаунт",
    paginationLabel: "Страницы коллекции",
    previousLabel: "Назад",
    nextLabel: "Далее",
    pageLabel: "Страница {page}",
    itemsLabel: "элементов",
  },
  it: {
    viewAllLabel: "Vedi tutto",
    backLabel: "Torna all’account",
    paginationLabel: "Pagine della raccolta",
    previousLabel: "Precedente",
    nextLabel: "Successiva",
    pageLabel: "Pagina {page}",
    itemsLabel: "elementi",
  },
  de: {
    viewAllLabel: "Alle anzeigen",
    backLabel: "Zurück zum Konto",
    paginationLabel: "Sammlungsseiten",
    previousLabel: "Zurück",
    nextLabel: "Weiter",
    pageLabel: "Seite {page}",
    itemsLabel: "Einträge",
  },
};

export const getAccountCollectionsCopy = (locale: SupportedLocale) =>
  copy[locale];
