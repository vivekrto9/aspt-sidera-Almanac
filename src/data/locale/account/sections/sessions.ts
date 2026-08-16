import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountSessionsCopy = {
  eyebrow: string;
  title: string;
  withLabel: string;
  minutesLabel: string;
  summaryLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel: string;
};
const copy: Record<SupportedLocale, AccountSessionsCopy> = {
  en: {
    eyebrow: "Sessions",
    title: "Past readings",
    withLabel: "with",
    minutesLabel: "min",
    summaryLabel: "Summary",
    emptyTitle: "No readings yet",
    emptyDescription:
      "Book time with an astrologer. Completed readings and summaries will appear here.",
    emptyActionLabel: "+ Book a reading",
  },
  es: {
    eyebrow: "Sesiones",
    title: "Lecturas anteriores",
    withLabel: "con",
    minutesLabel: "min",
    summaryLabel: "Resumen",
    emptyTitle: "Aún no hay lecturas",
    emptyDescription:
      "Reserva tiempo con un astrólogo. Las lecturas y resúmenes completados aparecerán aquí.",
    emptyActionLabel: "+ Reservar una lectura",
  },
  fr: {
    eyebrow: "Séances",
    title: "Consultations passées",
    withLabel: "avec",
    minutesLabel: "min",
    summaryLabel: "Résumé",
    emptyTitle: "Aucune consultation",
    emptyDescription:
      "Réservez un moment avec un astrologue. Les consultations terminées et leurs résumés apparaîtront ici.",
    emptyActionLabel: "+ Réserver une consultation",
  },
  pt: {
    eyebrow: "Sessões",
    title: "Leituras anteriores",
    withLabel: "com",
    minutesLabel: "min",
    summaryLabel: "Resumo",
    emptyTitle: "Ainda não há leituras",
    emptyDescription:
      "Agende um horário com um astrólogo. Leituras concluídas e resumos aparecerão aqui.",
    emptyActionLabel: "+ Agendar uma leitura",
  },
  ru: {
    eyebrow: "Сеансы",
    title: "Прошлые консультации",
    withLabel: "с",
    minutesLabel: "мин",
    summaryLabel: "Итоги",
    emptyTitle: "Консультаций пока нет",
    emptyDescription:
      "Запишитесь к астрологу. Завершённые консультации и их итоги появятся здесь.",
    emptyActionLabel: "+ Записаться на консультацию",
  },
  it: {
    eyebrow: "Sessioni",
    title: "Letture passate",
    withLabel: "con",
    minutesLabel: "min",
    summaryLabel: "Riepilogo",
    emptyTitle: "Nessuna lettura",
    emptyDescription:
      "Prenota del tempo con un astrologo. Le letture completate e i riepiloghi appariranno qui.",
    emptyActionLabel: "+ Prenota una lettura",
  },
  de: {
    eyebrow: "Sitzungen",
    title: "Frühere Beratungen",
    withLabel: "mit",
    minutesLabel: "Min.",
    summaryLabel: "Zusammenfassung",
    emptyTitle: "Noch keine Beratungen",
    emptyDescription:
      "Buchen Sie einen Termin bei einer Astrologin oder einem Astrologen. Abgeschlossene Beratungen erscheinen hier.",
    emptyActionLabel: "+ Beratung buchen",
  },
};
export const getAccountSessionsCopy = (locale: SupportedLocale) => copy[locale];
