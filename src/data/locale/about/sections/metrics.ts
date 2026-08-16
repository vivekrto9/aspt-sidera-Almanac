import type { SupportedLocale } from "../../../localization-contract.ts";

export type AboutMetric = {
  value: string;
  label: string;
};

export type AboutMetricsCopy = {
  ariaLabel: string;
  metrics: AboutMetric[];
};

const values = ["1.2M", "40+", "180", "2019"] as const;

const copyByLocale = {
  en: {
    ariaLabel: "Sidera by the numbers",
    labels: ["charts cast", "astrologers", "countries", "founded"],
  },
  es: {
    ariaLabel: "Sidera en cifras",
    labels: ["cartas calculadas", "astrólogos", "países", "fundación"],
  },
  fr: {
    ariaLabel: "Sidera en chiffres",
    labels: ["thèmes calculés", "astrologues", "pays", "année de création"],
  },
  pt: {
    ariaLabel: "Sidera em números",
    labels: ["mapas calculados", "astrólogos", "países", "ano de fundação"],
  },
  ru: {
    ariaLabel: "Sidera в цифрах",
    labels: ["карт рассчитано", "астрологов", "стран", "год основания"],
  },
  it: {
    ariaLabel: "Sidera in numeri",
    labels: ["temi calcolati", "astrologi", "paesi", "anno di fondazione"],
  },
  de: {
    ariaLabel: "Sidera in Zahlen",
    labels: ["Horoskope erstellt", "Astrologen", "Länder", "Gründungsjahr"],
  },
} satisfies Record<
  SupportedLocale,
  { ariaLabel: string; labels: [string, string, string, string] }
>;

export const getAboutMetricsCopy = (
  locale: SupportedLocale,
): AboutMetricsCopy => {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return {
    ariaLabel: copy.ariaLabel,
    metrics: values.map((value, index) => ({
      value,
      label: copy.labels[index],
    })),
  };
};
