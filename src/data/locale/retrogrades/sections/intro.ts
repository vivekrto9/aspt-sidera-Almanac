import type { SupportedLocale } from "../../../localization-contract.ts";

export type RetrogradesIntroCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleSuffix: string;
  description: string;
};

const copyByLocale = {
  en: {
    eyebrow: "Tool · Retrogrades",
    titleLead: "What's",
    titleAccent: "retrograde",
    titleSuffix: "right now.",
    description:
      "A planet in retrograde only appears to move backward from Earth — but astrologically it turns that planet's themes inward, asking you to review, revise, and revisit.",
  },
  es: {
    eyebrow: "Herramienta · Retrógrados",
    titleLead: "Qué está",
    titleAccent: "retrógrado",
    titleSuffix: "ahora.",
    description:
      "Un planeta retrógrado solo parece moverse hacia atrás visto desde la Tierra; pero, en astrología, dirige sus temas hacia dentro y te invita a revisar, corregir y retomar.",
  },
  fr: {
    eyebrow: "Outil · Rétrogrades",
    titleLead: "Ce qui est",
    titleAccent: "rétrograde",
    titleSuffix: "en ce moment.",
    description:
      "Une planète rétrograde semble seulement reculer vue de la Terre ; en astrologie, elle ramène pourtant ses thèmes vers l’intérieur et vous invite à revoir, réviser et revisiter.",
  },
  pt: {
    eyebrow: "Ferramenta · Retrógrados",
    titleLead: "O que está",
    titleAccent: "retrógrado",
    titleSuffix: "agora.",
    description:
      "Um planeta retrógrado apenas parece mover-se para trás quando visto da Terra; na astrologia, porém, volta os seus temas para dentro e convida a rever, corrigir e retomar.",
  },
  ru: {
    eyebrow: "Инструмент · Ретроградность",
    titleLead: "Какие планеты",
    titleAccent: "ретроградны",
    titleSuffix: "сейчас.",
    description:
      "Ретроградная планета лишь кажется движущейся назад при наблюдении с Земли, но в астрологии она обращает свои темы внутрь и предлагает пересмотреть, исправить и повторно осмыслить.",
  },
  it: {
    eyebrow: "Strumento · Retrogradazioni",
    titleLead: "Cosa è",
    titleAccent: "retrogrado",
    titleSuffix: "adesso.",
    description:
      "Un pianeta retrogrado sembra soltanto muoversi all’indietro visto dalla Terra; in astrologia, però, rivolge i suoi temi verso l’interno e invita a rivedere, correggere e riprendere.",
  },
  de: {
    eyebrow: "Werkzeug · Rückläufigkeiten",
    titleLead: "Was ist gerade",
    titleAccent: "rückläufig",
    titleSuffix: ".",
    description:
      "Ein rückläufiger Planet scheint sich von der Erde aus nur rückwärts zu bewegen; astrologisch richtet er seine Themen jedoch nach innen und lädt zum Prüfen, Überarbeiten und Wiederaufgreifen ein.",
  },
} satisfies Record<SupportedLocale, RetrogradesIntroCopy>;

export const getRetrogradesIntroCopy = (
  locale: SupportedLocale,
): RetrogradesIntroCopy => copyByLocale[locale] ?? copyByLocale.en;
