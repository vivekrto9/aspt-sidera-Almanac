import type { SupportedLocale } from "../../../localization-contract.ts";

export type SynastryResultsCopy = {
  results_resonance_label: string;
  results_score_note: string;
  results_verdict_label: string;
  results_chart_title: string;
  results_chart_description: string;
  results_inner_label: string;
  results_outer_label: string;
  results_aspect_kicker: string;
  results_aspect_label: string;
  results_theme_label: string;
  results_orb_label: string;
  results_contacts_title: string;
  results_conjunction_label: string;
  results_harmonious_label: string;
  results_challenging_label: string;
};

const en: SynastryResultsCopy = {
  results_resonance_label: "Resonance",
  results_score_note: "Aspect-based guide, not a scientific measure.",
  results_verdict_label: "The verdict",
  results_chart_title: "Synastry bi-wheel",
  results_chart_description:
    "Two birth charts overlaid with the key aspects between them.",
  results_inner_label: "inner",
  results_outer_label: "outer",
  results_aspect_kicker: "Inter-aspect · select a key contact",
  results_aspect_label: "Aspect",
  results_theme_label: "Theme",
  results_orb_label: "Orb",
  results_contacts_title: "Key contacts between you",
  results_conjunction_label: "conjunction",
  results_harmonious_label: "harmonious",
  results_challenging_label: "challenging",
};

const copyByLocale = {
  en,
  es: {
    results_resonance_label: "Resonancia",
    results_score_note: "Guía basada en aspectos; no es una medida científica.",
    results_verdict_label: "El veredicto",
    results_chart_title: "Bicarta de sinastría",
    results_chart_description:
      "Dos cartas natales superpuestas con los aspectos clave entre ellas.",
    results_inner_label: "interior",
    results_outer_label: "exterior",
    results_aspect_kicker: "Interaspecto · elige un contacto clave",
    results_aspect_label: "Aspecto",
    results_theme_label: "Tema",
    results_orb_label: "Orbe",
    results_contacts_title: "Contactos clave entre ustedes",
    results_conjunction_label: "conjunción",
    results_harmonious_label: "armonioso",
    results_challenging_label: "desafiante",
  },
  fr: {
    results_resonance_label: "Résonance",
    results_score_note: "Repère fondé sur les aspects, pas une mesure scientifique.",
    results_verdict_label: "Le verdict",
    results_chart_title: "Bi-roue de synastrie",
    results_chart_description:
      "Deux thèmes superposés avec leurs principaux aspects mutuels.",
    results_inner_label: "intérieur",
    results_outer_label: "extérieur",
    results_aspect_kicker: "Inter-aspect · choisissez un contact clé",
    results_aspect_label: "Aspect",
    results_theme_label: "Thème",
    results_orb_label: "Orbe",
    results_contacts_title: "Contacts clés entre vous",
    results_conjunction_label: "conjonction",
    results_harmonious_label: "harmonieux",
    results_challenging_label: "stimulant",
  },
  pt: {
    results_resonance_label: "Ressonância",
    results_score_note: "Guia baseado em aspectos, não uma medida científica.",
    results_verdict_label: "O veredito",
    results_chart_title: "Biroda de sinastria",
    results_chart_description:
      "Dois mapas natais sobrepostos com os principais aspectos entre eles.",
    results_inner_label: "interno",
    results_outer_label: "externo",
    results_aspect_kicker: "Interaspecto · escolha um contato principal",
    results_aspect_label: "Aspecto",
    results_theme_label: "Tema",
    results_orb_label: "Orbe",
    results_contacts_title: "Contatos principais entre vocês",
    results_conjunction_label: "conjunção",
    results_harmonious_label: "harmonioso",
    results_challenging_label: "desafiador",
  },
  ru: {
    results_resonance_label: "Резонанс",
    results_score_note: "Ориентир по аспектам, а не научная оценка.",
    results_verdict_label: "Итог",
    results_chart_title: "Двойное колесо синастрии",
    results_chart_description:
      "Две наложенные натальные карты с ключевыми аспектами между ними.",
    results_inner_label: "внутри",
    results_outer_label: "снаружи",
    results_aspect_kicker: "Межкартный аспект · выберите ключевую связь",
    results_aspect_label: "Аспект",
    results_theme_label: "Тема",
    results_orb_label: "Орбис",
    results_contacts_title: "Ключевые связи между вами",
    results_conjunction_label: "соединение",
    results_harmonious_label: "гармоничный",
    results_challenging_label: "напряжённый",
  },
  it: {
    results_resonance_label: "Risonanza",
    results_score_note: "Guida basata sugli aspetti, non una misura scientifica.",
    results_verdict_label: "Il verdetto",
    results_chart_title: "Biruota di sinastria",
    results_chart_description:
      "Due temi natali sovrapposti con i principali aspetti reciproci.",
    results_inner_label: "interno",
    results_outer_label: "esterno",
    results_aspect_kicker: "Interaspetto · scegli un contatto chiave",
    results_aspect_label: "Aspetto",
    results_theme_label: "Tema",
    results_orb_label: "Orbita",
    results_contacts_title: "Contatti chiave tra voi",
    results_conjunction_label: "congiunzione",
    results_harmonious_label: "armonioso",
    results_challenging_label: "impegnativo",
  },
  de: {
    results_resonance_label: "Resonanz",
    results_score_note: "Aspektbasierte Orientierung, keine wissenschaftliche Messung.",
    results_verdict_label: "Das Urteil",
    results_chart_title: "Synastrie-Doppelrad",
    results_chart_description:
      "Zwei überlagerte Geburtshoroskope mit ihren wichtigsten Aspekten.",
    results_inner_label: "innen",
    results_outer_label: "außen",
    results_aspect_kicker: "Interaspekt · wählen Sie einen Hauptkontakt",
    results_aspect_label: "Aspekt",
    results_theme_label: "Thema",
    results_orb_label: "Orbis",
    results_contacts_title: "Schlüsselkontakte zwischen Ihnen",
    results_conjunction_label: "Konjunktion",
    results_harmonious_label: "harmonisch",
    results_challenging_label: "herausfordernd",
  },
} satisfies Record<SupportedLocale, SynastryResultsCopy>;

export const getSynastryResultsCopy = (
  locale: SupportedLocale,
): SynastryResultsCopy => copyByLocale[locale] ?? copyByLocale.en;
