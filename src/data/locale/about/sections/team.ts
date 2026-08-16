import type { SupportedLocale } from "../../../localization-contract.ts";

export type AboutTeamMember = {
  name: string;
  role: string;
  imageSrc: string;
};

export type AboutTeamCopy = {
  titleAccent: string;
  titleRest: string;
  ariaLabel: string;
  members: AboutTeamMember[];
};

const names = ["Elena Voss", "Marcus Reed", "Yuki Tanaka", "Priya Nair"] as const;
const imageSlugs = [
  "lena-fischer",
  "sol-marino",
  "yuki-tanaka",
  "priya-nair",
] as const;

const resolveImageSrc = (slug: (typeof imageSlugs)[number]) =>
  import.meta.env?.DEV
    ? `/@fs${new URL(
        `../../../../../astropages/assets/astrologers/${slug}.png`,
        import.meta.url,
      ).pathname}`
    : `/_assets/aliases/astrologers-${slug}/${slug}.png`;

const copyByLocale = {
  en: {
    titleAccent: "The",
    titleRest: "people behind it.",
    ariaLabel: "The people behind Sidera",
    roles: [
      "Founder · Astrologer",
      "Engineering",
      "Head of content",
      "Astrologer relations",
    ],
  },
  es: {
    titleAccent: "Las",
    titleRest: "personas detrás de Sidera.",
    ariaLabel: "Las personas detrás de Sidera",
    roles: [
      "Fundadora · Astróloga",
      "Ingeniería",
      "Dirección de contenidos",
      "Relaciones con astrólogos",
    ],
  },
  fr: {
    titleAccent: "Les",
    titleRest: "personnes derrière Sidera.",
    ariaLabel: "Les personnes derrière Sidera",
    roles: [
      "Fondatrice · Astrologue",
      "Ingénierie",
      "Responsable éditoriale",
      "Relations avec les astrologues",
    ],
  },
  pt: {
    titleAccent: "As",
    titleRest: "pessoas por trás da Sidera.",
    ariaLabel: "As pessoas por trás da Sidera",
    roles: [
      "Fundadora · Astróloga",
      "Engenharia",
      "Direção de conteúdo",
      "Relações com astrólogos",
    ],
  },
  ru: {
    titleAccent: "Люди,",
    titleRest: "которые создают Sidera.",
    ariaLabel: "Команда Sidera",
    roles: [
      "Основательница · Астролог",
      "Разработка",
      "Руководитель контента",
      "Работа с астрологами",
    ],
  },
  it: {
    titleAccent: "Le",
    titleRest: "persone dietro Sidera.",
    ariaLabel: "Le persone dietro Sidera",
    roles: [
      "Fondatrice · Astrologa",
      "Ingegneria",
      "Responsabile dei contenuti",
      "Relazioni con gli astrologi",
    ],
  },
  de: {
    titleAccent: "Die",
    titleRest: "Menschen hinter Sidera.",
    ariaLabel: "Die Menschen hinter Sidera",
    roles: [
      "Gründerin · Astrologin",
      "Entwicklung",
      "Redaktionsleitung",
      "Astrologenbetreuung",
    ],
  },
} satisfies Record<
  SupportedLocale,
  {
    titleAccent: string;
    titleRest: string;
    ariaLabel: string;
    roles: [string, string, string, string];
  }
>;

export const getAboutTeamCopy = (
  locale: SupportedLocale,
): AboutTeamCopy => {
  const copy = copyByLocale[locale] ?? copyByLocale.en;

  return {
    titleAccent: copy.titleAccent,
    titleRest: copy.titleRest,
    ariaLabel: copy.ariaLabel,
    members: names.map((name, index) => ({
      name,
      role: copy.roles[index],
      imageSrc: resolveImageSrc(imageSlugs[index]),
    })),
  };
};
