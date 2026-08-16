import type { SupportedLocale } from "../../../localization-contract.ts";
import {
  getBirthChartNatalReportHandoffCopy,
  type BirthChartNatalReportHandoffCopy,
} from "./natal-report-handoff.ts";

export type BirthChartResultsCopy = BirthChartNatalReportHandoffCopy & {
  results_eyebrow: string;
  results_unknown_time_notice: string;
  results_sun_role: string;
  results_sun_blurb: string;
  results_moon_role: string;
  results_moon_blurb: string;
  results_rising_role: string;
  results_rising_blurb: string;
  results_reading_kicker: string;
  results_sign_label: string;
  results_house_label: string;
  results_element_label: string;
  results_positions_title: string;
  results_zodiac_label: string;
  results_body_header: string;
  results_sign_header: string;
  results_degree_header: string;
  results_house_header: string;
  results_aspects_title: string;
  results_found_label: string;
  results_conjunction_label: string;
  results_harmonious_label: string;
  results_challenging_label: string;
};

const en: BirthChartResultsCopy = {
  ...getBirthChartNatalReportHandoffCopy("en"),
  results_eyebrow: "Your Natal Chart",
  results_unknown_time_notice:
    "Birth time unknown — rising sign and houses are approximate",
  results_sun_role: "Sun",
  results_sun_blurb: "How you shine — your core identity and will.",
  results_moon_role: "Moon",
  results_moon_blurb: "How you feel — your inner, private world.",
  results_rising_role: "Rising",
  results_rising_blurb: "How you meet the world — your first impression.",
  results_reading_kicker: "Reading · select a planet",
  results_sign_label: "Sign",
  results_house_label: "House",
  results_element_label: "Element",
  results_positions_title: "Planet positions",
  results_zodiac_label: "Tropical zodiac",
  results_body_header: "Body",
  results_sign_header: "Sign",
  results_degree_header: "Degree",
  results_house_header: "House",
  results_aspects_title: "Major aspects",
  results_found_label: "found",
  results_conjunction_label: "conjunction",
  results_harmonious_label: "harmonious",
  results_challenging_label: "challenging",
};

const localized = {
  en,
  es: {
    ...getBirthChartNatalReportHandoffCopy("es"),
    results_eyebrow: "Tu carta natal",
    results_unknown_time_notice:
      "Hora de nacimiento desconocida — el ascendente y las casas son aproximados",
    results_sun_role: "Sol",
    results_sun_blurb: "Cómo brillas — tu identidad esencial y tu voluntad.",
    results_moon_role: "Luna",
    results_moon_blurb: "Cómo sientes — tu mundo interior y privado.",
    results_rising_role: "Ascendente",
    results_rising_blurb: "Cómo te presentas al mundo — tu primera impresión.",
    results_reading_kicker: "Lectura · selecciona un planeta",
    results_sign_label: "Signo",
    results_house_label: "Casa",
    results_element_label: "Elemento",
    results_positions_title: "Posiciones planetarias",
    results_zodiac_label: "Zodíaco tropical",
    results_body_header: "Cuerpo",
    results_sign_header: "Signo",
    results_degree_header: "Grado",
    results_house_header: "Casa",
    results_aspects_title: "Aspectos principales",
    results_found_label: "encontrados",
    results_conjunction_label: "conjunción",
    results_harmonious_label: "armónicos",
    results_challenging_label: "tensos",
  },
  fr: {
    ...getBirthChartNatalReportHandoffCopy("fr"),
    results_eyebrow: "Votre thème natal",
    results_unknown_time_notice:
      "Heure de naissance inconnue — l’ascendant et les maisons sont approximatifs",
    results_sun_role: "Soleil",
    results_sun_blurb: "Votre façon de rayonner — identité profonde et volonté.",
    results_moon_role: "Lune",
    results_moon_blurb: "Votre façon de ressentir — votre monde intérieur.",
    results_rising_role: "Ascendant",
    results_rising_blurb: "Votre façon d’aborder le monde — votre première impression.",
    results_reading_kicker: "Lecture · sélectionnez une planète",
    results_sign_label: "Signe",
    results_house_label: "Maison",
    results_element_label: "Élément",
    results_positions_title: "Positions planétaires",
    results_zodiac_label: "Zodiaque tropical",
    results_body_header: "Corps",
    results_sign_header: "Signe",
    results_degree_header: "Degré",
    results_house_header: "Maison",
    results_aspects_title: "Aspects majeurs",
    results_found_label: "trouvés",
    results_conjunction_label: "conjonction",
    results_harmonious_label: "harmonieux",
    results_challenging_label: "tendus",
  },
  pt: {
    ...getBirthChartNatalReportHandoffCopy("pt"),
    results_eyebrow: "Seu mapa natal",
    results_unknown_time_notice:
      "Hora de nascimento desconhecida — ascendente e casas são aproximados",
    results_sun_role: "Sol",
    results_sun_blurb: "Como você brilha — sua identidade central e vontade.",
    results_moon_role: "Lua",
    results_moon_blurb: "Como você sente — seu mundo interior e privado.",
    results_rising_role: "Ascendente",
    results_rising_blurb: "Como você encontra o mundo — sua primeira impressão.",
    results_reading_kicker: "Leitura · selecione um planeta",
    results_sign_label: "Signo",
    results_house_label: "Casa",
    results_element_label: "Elemento",
    results_positions_title: "Posições planetárias",
    results_zodiac_label: "Zodíaco tropical",
    results_body_header: "Corpo",
    results_sign_header: "Signo",
    results_degree_header: "Grau",
    results_house_header: "Casa",
    results_aspects_title: "Aspectos principais",
    results_found_label: "encontrados",
    results_conjunction_label: "conjunção",
    results_harmonious_label: "harmônicos",
    results_challenging_label: "desafiadores",
  },
  ru: {
    ...getBirthChartNatalReportHandoffCopy("ru"),
    results_eyebrow: "Ваша натальная карта",
    results_unknown_time_notice:
      "Время рождения неизвестно — асцендент и дома указаны приблизительно",
    results_sun_role: "Солнце",
    results_sun_blurb: "Как вы сияете — ваша главная идентичность и воля.",
    results_moon_role: "Луна",
    results_moon_blurb: "Как вы чувствуете — ваш внутренний, личный мир.",
    results_rising_role: "Асцендент",
    results_rising_blurb: "Как вы встречаете мир — ваше первое впечатление.",
    results_reading_kicker: "Толкование · выберите планету",
    results_sign_label: "Знак",
    results_house_label: "Дом",
    results_element_label: "Стихия",
    results_positions_title: "Положения планет",
    results_zodiac_label: "Тропический зодиак",
    results_body_header: "Тело",
    results_sign_header: "Знак",
    results_degree_header: "Градус",
    results_house_header: "Дом",
    results_aspects_title: "Главные аспекты",
    results_found_label: "найдено",
    results_conjunction_label: "соединение",
    results_harmonious_label: "гармоничные",
    results_challenging_label: "напряжённые",
  },
  it: {
    ...getBirthChartNatalReportHandoffCopy("it"),
    results_eyebrow: "Il tuo tema natale",
    results_unknown_time_notice:
      "Ora di nascita sconosciuta — ascendente e case sono approssimativi",
    results_sun_role: "Sole",
    results_sun_blurb: "Come risplendi — la tua identità centrale e la volontà.",
    results_moon_role: "Luna",
    results_moon_blurb: "Come senti — il tuo mondo interiore e privato.",
    results_rising_role: "Ascendente",
    results_rising_blurb: "Come incontri il mondo — la tua prima impressione.",
    results_reading_kicker: "Lettura · seleziona un pianeta",
    results_sign_label: "Segno",
    results_house_label: "Casa",
    results_element_label: "Elemento",
    results_positions_title: "Posizioni planetarie",
    results_zodiac_label: "Zodiaco tropicale",
    results_body_header: "Corpo",
    results_sign_header: "Segno",
    results_degree_header: "Grado",
    results_house_header: "Casa",
    results_aspects_title: "Aspetti principali",
    results_found_label: "trovati",
    results_conjunction_label: "congiunzione",
    results_harmonious_label: "armonici",
    results_challenging_label: "difficili",
  },
  de: {
    ...getBirthChartNatalReportHandoffCopy("de"),
    results_eyebrow: "Dein Geburtshoroskop",
    results_unknown_time_notice:
      "Geburtszeit unbekannt — Aszendent und Häuser sind Näherungswerte",
    results_sun_role: "Sonne",
    results_sun_blurb: "Wie du strahlst — deine Kernidentität und dein Wille.",
    results_moon_role: "Mond",
    results_moon_blurb: "Wie du fühlst — deine innere, private Welt.",
    results_rising_role: "Aszendent",
    results_rising_blurb: "Wie du der Welt begegnest — dein erster Eindruck.",
    results_reading_kicker: "Deutung · Planet auswählen",
    results_sign_label: "Zeichen",
    results_house_label: "Haus",
    results_element_label: "Element",
    results_positions_title: "Planetenpositionen",
    results_zodiac_label: "Tropischer Tierkreis",
    results_body_header: "Körper",
    results_sign_header: "Zeichen",
    results_degree_header: "Grad",
    results_house_header: "Haus",
    results_aspects_title: "Hauptaspekte",
    results_found_label: "gefunden",
    results_conjunction_label: "Konjunktion",
    results_harmonious_label: "harmonisch",
    results_challenging_label: "herausfordernd",
  },
} satisfies Record<SupportedLocale, BirthChartResultsCopy>;

export const getBirthChartResultsCopy = (
  locale: SupportedLocale,
): BirthChartResultsCopy => localized[locale] ?? localized.en;
