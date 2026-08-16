import type { SupportedLocale } from "../../../localization-contract.ts";

const copyByLocale = {
  en: {
    statement:
      "Sidera runs on the Swiss Ephemeris — the same astronomical engine professional software relies on — and pairs it with writing you can actually understand. Precision underneath, clarity on top.",
  },
  es: {
    statement:
      "Sidera funciona con Swiss Ephemeris —el mismo motor astronómico en el que confía el software profesional— y lo combina con textos que realmente se entienden. Precisión por dentro, claridad por fuera.",
  },
  fr: {
    statement:
      "Sidera s’appuie sur Swiss Ephemeris — le moteur astronomique utilisé par les logiciels professionnels — et l’associe à des textes réellement compréhensibles. La précision en profondeur, la clarté en surface.",
  },
  pt: {
    statement:
      "A Sidera usa o Swiss Ephemeris — o mesmo motor astronômico em que softwares profissionais confiam — e o combina com textos que você realmente entende. Precisão por baixo, clareza por cima.",
  },
  ru: {
    statement:
      "Sidera работает на Swiss Ephemeris — том же астрономическом движке, которому доверяют профессиональные программы, — и дополняет его понятными текстами. Точность в основе, ясность на поверхности.",
  },
  it: {
    statement:
      "Sidera utilizza Swiss Ephemeris — lo stesso motore astronomico scelto dai software professionali — e lo abbina a testi che puoi capire davvero. Precisione alla base, chiarezza in primo piano.",
  },
  de: {
    statement:
      "Sidera basiert auf Swiss Ephemeris — derselben astronomischen Rechenengine, auf die professionelle Software vertraut — und verbindet sie mit Texten, die wirklich verständlich sind. Präzision im Kern, Klarheit an der Oberfläche.",
  },
} satisfies Record<SupportedLocale, { statement: string }>;

export const getAboutStoryStatementCopy = (locale: SupportedLocale) =>
  copyByLocale[locale] ?? copyByLocale.en;
