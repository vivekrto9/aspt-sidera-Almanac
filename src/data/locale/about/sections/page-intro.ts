import type { SupportedLocale } from "../../../localization-contract.ts";

export type AboutPageIntroCopy = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  description: string;
};

const copyByLocale = {
  en: {
    eyebrow: "About Sidera",
    titleLead: "Astrology that",
    titleEmphasis: "respects your intelligence.",
    description:
      "We built Sidera because the tools we wanted did not exist: astronomically exact, genuinely readable, and free of the mysticism-as-marketing that clutters the rest of the field.",
  },
  es: {
    eyebrow: "Sobre Sidera",
    titleLead: "Astrología que",
    titleEmphasis: "respeta tu inteligencia.",
    description:
      "Creamos Sidera porque las herramientas que queríamos no existían: exactas en lo astronómico, realmente comprensibles y libres del misticismo usado como marketing que abunda en este campo.",
  },
  fr: {
    eyebrow: "À propos de Sidera",
    titleLead: "Une astrologie qui",
    titleEmphasis: "respecte votre intelligence.",
    description:
      "Nous avons créé Sidera parce que les outils que nous cherchions n’existaient pas : exacts sur le plan astronomique, vraiment lisibles et libérés du mysticisme utilisé comme argument marketing.",
  },
  pt: {
    eyebrow: "Sobre a Sidera",
    titleLead: "Astrologia que",
    titleEmphasis: "respeita a sua inteligência.",
    description:
      "Criamos a Sidera porque as ferramentas que queríamos não existiam: astronomicamente exatas, realmente claras e livres do misticismo usado como marketing que domina grande parte desse universo.",
  },
  ru: {
    eyebrow: "О Sidera",
    titleLead: "Астрология, которая",
    titleEmphasis: "уважает ваш интеллект.",
    description:
      "Мы создали Sidera, потому что нужных нам инструментов не существовало: астрономически точных, действительно понятных и свободных от мистики, превращённой в маркетинг.",
  },
  it: {
    eyebrow: "Chi è Sidera",
    titleLead: "Un’astrologia che",
    titleEmphasis: "rispetta la tua intelligenza.",
    description:
      "Abbiamo creato Sidera perché gli strumenti che cercavamo non esistevano: astronomicamente esatti, davvero comprensibili e liberi dal misticismo usato come leva di marketing.",
  },
  de: {
    eyebrow: "Über Sidera",
    titleLead: "Astrologie, die",
    titleEmphasis: "Ihre Intelligenz respektiert.",
    description:
      "Wir haben Sidera entwickelt, weil es die Werkzeuge, die wir wollten, nicht gab: astronomisch exakt, wirklich verständlich und frei von Mystik als Marketingmittel.",
  },
} satisfies Record<SupportedLocale, AboutPageIntroCopy>;

export const getAboutPageIntroCopy = (
  locale: SupportedLocale,
): AboutPageIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
