import type { SupportedLocale } from "../../../localization-contract.ts";

export type TodaysSkyPersonalizedHandoffCopy = {
  sky_handoff_eyebrow: string;
  sky_handoff_title_prefix: string;
  sky_handoff_title_accent: string;
  sky_handoff_title_suffix: string;
  sky_handoff_description: string;
  sky_handoff_primary_label: string;
  sky_handoff_secondary_label: string;
};

const copyByLocale = {
  en: {
    sky_handoff_eyebrow: "Make it personal",
    sky_handoff_title_prefix:
      "This is the sky for everyone. See how it touches",
    sky_handoff_title_accent: "your",
    sky_handoff_title_suffix: "chart.",
    sky_handoff_description:
      "Lay today’s moving planets over your birth chart to read the transits meant for you — timed, named, and translated.",
    sky_handoff_primary_label: "See your transits",
    sky_handoff_secondary_label: "Cast your free chart",
  },
  es: {
    sky_handoff_eyebrow: "Hazlo personal",
    sky_handoff_title_prefix:
      "Este es el cielo de todos. Mira cómo toca",
    sky_handoff_title_accent: "tu",
    sky_handoff_title_suffix: "carta.",
    sky_handoff_description:
      "Superpón los planetas en movimiento de hoy a tu carta natal para leer los tránsitos destinados a ti: con tiempo, nombre y significado.",
    sky_handoff_primary_label: "Ver tus tránsitos",
    sky_handoff_secondary_label: "Crear tu carta gratis",
  },
  fr: {
    sky_handoff_eyebrow: "Rendez-le personnel",
    sky_handoff_title_prefix:
      "C’est le ciel de tout le monde. Voyez comment il touche",
    sky_handoff_title_accent: "votre",
    sky_handoff_title_suffix: "thème.",
    sky_handoff_description:
      "Superposez les planètes en mouvement aujourd’hui à votre thème natal pour lire les transits qui vous concernent — datés, nommés et interprétés.",
    sky_handoff_primary_label: "Voir vos transits",
    sky_handoff_secondary_label: "Créer votre thème gratuit",
  },
  pt: {
    sky_handoff_eyebrow: "Torne pessoal",
    sky_handoff_title_prefix:
      "Este é o céu de todos. Veja como ele toca",
    sky_handoff_title_accent: "o seu",
    sky_handoff_title_suffix: "mapa.",
    sky_handoff_description:
      "Sobreponha os planetas em movimento de hoje ao seu mapa natal para ler os trânsitos feitos para você — com tempo, nome e interpretação.",
    sky_handoff_primary_label: "Ver seus trânsitos",
    sky_handoff_secondary_label: "Criar seu mapa grátis",
  },
  ru: {
    sky_handoff_eyebrow: "Сделайте это личным",
    sky_handoff_title_prefix:
      "Это небо для всех. Посмотрите, как оно касается",
    sky_handoff_title_accent: "вашей",
    sky_handoff_title_suffix: "карты.",
    sky_handoff_description:
      "Наложите сегодняшние движущиеся планеты на натальную карту, чтобы прочитать предназначенные вам транзиты — с точным временем, названием и толкованием.",
    sky_handoff_primary_label: "Посмотреть свои транзиты",
    sky_handoff_secondary_label: "Построить бесплатную карту",
  },
  it: {
    sky_handoff_eyebrow: "Rendilo personale",
    sky_handoff_title_prefix:
      "Questo è il cielo di tutti. Scopri come tocca",
    sky_handoff_title_accent: "il tuo",
    sky_handoff_title_suffix: "tema.",
    sky_handoff_description:
      "Sovrapponi i pianeti in movimento di oggi al tuo tema natale per leggere i transiti pensati per te — con tempi, nomi e interpretazioni.",
    sky_handoff_primary_label: "Vedi i tuoi transiti",
    sky_handoff_secondary_label: "Crea il tuo tema gratuito",
  },
  de: {
    sky_handoff_eyebrow: "Mach es persönlich",
    sky_handoff_title_prefix:
      "Das ist der Himmel für alle. Sieh, wie er",
    sky_handoff_title_accent: "dein",
    sky_handoff_title_suffix: "Horoskop berührt.",
    sky_handoff_description:
      "Lege die heutigen Planetenbewegungen über dein Geburtshoroskop und lies die Transite, die für dich bestimmt sind — zeitlich eingeordnet, benannt und gedeutet.",
    sky_handoff_primary_label: "Deine Transite ansehen",
    sky_handoff_secondary_label: "Kostenloses Horoskop erstellen",
  },
} satisfies Record<SupportedLocale, TodaysSkyPersonalizedHandoffCopy>;

export const getTodaysSkyPersonalizedHandoffCopy = (
  locale: SupportedLocale,
): TodaysSkyPersonalizedHandoffCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
