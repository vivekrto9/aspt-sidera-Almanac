import type { SupportedLocale } from "./localization-contract.ts";

const copy = {
  en: { title: "This data is temporarily unavailable.", description: "The astrology service could not return a complete result. Please try again in a moment.", retry: "Try again" },
  es: { title: "Estos datos no están disponibles temporalmente.", description: "El servicio de astrología no pudo devolver un resultado completo. Inténtalo de nuevo en unos instantes.", retry: "Intentar de nuevo" },
  fr: { title: "Ces données sont temporairement indisponibles.", description: "Le service d’astrologie n’a pas pu fournir un résultat complet. Veuillez réessayer dans un instant.", retry: "Réessayer" },
  pt: { title: "Estes dados estão temporariamente indisponíveis.", description: "O serviço de astrologia não conseguiu devolver um resultado completo. Tente novamente dentro de instantes.", retry: "Tentar novamente" },
  ru: { title: "Эти данные временно недоступны.", description: "Астрологический сервис не смог вернуть полный результат. Повторите попытку через некоторое время.", retry: "Попробовать снова" },
  it: { title: "Questi dati non sono temporaneamente disponibili.", description: "Il servizio di astrologia non ha restituito un risultato completo. Riprova tra poco.", retry: "Riprova" },
  de: { title: "Diese Daten sind vorübergehend nicht verfügbar.", description: "Der Astrologiedienst konnte kein vollständiges Ergebnis liefern. Bitte versuchen Sie es gleich noch einmal.", retry: "Erneut versuchen" },
} satisfies Record<SupportedLocale, { title: string; description: string; retry: string }>;

export const getProviderUnavailableCopy = (locale: SupportedLocale) =>
  copy[locale] ?? copy.en;
