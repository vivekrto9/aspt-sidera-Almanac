import type { SupportedLocale } from "../../../localization-contract.ts";
import {
  getTransitYearAheadHandoffCopy,
  type TransitYearAheadHandoffCopy,
} from "./year-ahead-handoff.ts";

type TransitResultsCoreCopy = {
  results_eyebrow: string;
  results_title_prefix: string;
  results_natal_label: string;
  results_viewing_label: string;
  results_today_label: string;
  results_moving_now_label: string;
  results_chart_title: string;
  results_chart_description: string;
  results_natal_legend: string;
  results_transiting_legend: string;
  results_active_title: string;
  results_count_suffix: string;
  results_applying_label: string;
  results_separating_label: string;
  results_conjunction_label: string;
  results_harmonious_label: string;
  results_challenging_label: string;
  results_no_aspects_title: string;
  results_no_aspects_body: string;
  results_previous_day_label: string;
  results_next_day_label: string;
  results_range_label: string;
  results_new_transit_label: string;
};

export type TransitResultsCopy = TransitResultsCoreCopy &
  TransitYearAheadHandoffCopy;

const en: TransitResultsCoreCopy = {
  results_eyebrow: "Transit Chart",
  results_title_prefix: "Transits to",
  results_natal_label: "Natal",
  results_viewing_label: "Viewing the sky on",
  results_today_label: "Today",
  results_moving_now_label: "Moving now",
  results_chart_title: "Natal and transiting planets",
  results_chart_description:
    "Natal planets are shown on the inner ring and transiting planets on the outer ring.",
  results_natal_legend: "Natal (inner)",
  results_transiting_legend: "Transiting (outer)",
  results_active_title: "Active transits",
  results_count_suffix: "on this day",
  results_applying_label: "Applying",
  results_separating_label: "Separating",
  results_conjunction_label: "conjunction",
  results_harmonious_label: "harmonious",
  results_challenging_label: "challenging",
  results_no_aspects_title: "A quiet sky",
  results_no_aspects_body:
    "No exact aspects are within orb on this day. Move a few days in either direction to find the next contact.",
  results_previous_day_label: "Previous day",
  results_next_day_label: "Next day",
  results_range_label: "Move through nearby transit dates",
  results_new_transit_label: "New transit",
};

const localized = {
  en,
  es: {
    results_eyebrow: "Carta de tránsitos",
    results_title_prefix: "Tránsitos para",
    results_natal_label: "Natal",
    results_viewing_label: "Viendo el cielo del",
    results_today_label: "Hoy",
    results_moving_now_label: "En movimiento",
    results_chart_title: "Planetas natales y en tránsito",
    results_chart_description:
      "Los planetas natales aparecen en el anillo interior y los planetas en tránsito en el exterior.",
    results_natal_legend: "Natal (interior)",
    results_transiting_legend: "Tránsito (exterior)",
    results_active_title: "Tránsitos activos",
    results_count_suffix: "en este día",
    results_applying_label: "Aplicativo",
    results_separating_label: "Separativo",
    results_conjunction_label: "conjunción",
    results_harmonious_label: "armónico",
    results_challenging_label: "desafiante",
    results_no_aspects_title: "Un cielo tranquilo",
    results_no_aspects_body:
      "No hay aspectos exactos dentro del orbe este día. Muévete unos días para encontrar el próximo contacto.",
    results_previous_day_label: "Día anterior",
    results_next_day_label: "Día siguiente",
    results_range_label: "Recorrer fechas de tránsito cercanas",
    results_new_transit_label: "Nuevo tránsito",
  },
  fr: {
    results_eyebrow: "Thème de transits",
    results_title_prefix: "Transits pour",
    results_natal_label: "Natal",
    results_viewing_label: "Ciel observé le",
    results_today_label: "Aujourd’hui",
    results_moving_now_label: "En mouvement",
    results_chart_title: "Planètes natales et en transit",
    results_chart_description:
      "Les planètes natales figurent sur l’anneau intérieur et les transits sur l’anneau extérieur.",
    results_natal_legend: "Natal (intérieur)",
    results_transiting_legend: "Transit (extérieur)",
    results_active_title: "Transits actifs",
    results_count_suffix: "ce jour",
    results_applying_label: "Appliquant",
    results_separating_label: "Séparant",
    results_conjunction_label: "conjonction",
    results_harmonious_label: "harmonieux",
    results_challenging_label: "stimulant",
    results_no_aspects_title: "Un ciel calme",
    results_no_aspects_body:
      "Aucun aspect exact n’est dans l’orbe ce jour-là. Déplacez-vous de quelques jours pour trouver le prochain contact.",
    results_previous_day_label: "Jour précédent",
    results_next_day_label: "Jour suivant",
    results_range_label: "Parcourir les dates de transit proches",
    results_new_transit_label: "Nouveau transit",
  },
  pt: {
    results_eyebrow: "Mapa de trânsitos",
    results_title_prefix: "Trânsitos para",
    results_natal_label: "Natal",
    results_viewing_label: "Vendo o céu em",
    results_today_label: "Hoje",
    results_moving_now_label: "Em movimento",
    results_chart_title: "Planetas natais e em trânsito",
    results_chart_description:
      "Os planetas natais aparecem no anel interno e os planetas em trânsito no anel externo.",
    results_natal_legend: "Natal (interno)",
    results_transiting_legend: "Trânsito (externo)",
    results_active_title: "Trânsitos ativos",
    results_count_suffix: "neste dia",
    results_applying_label: "Aplicativo",
    results_separating_label: "Separativo",
    results_conjunction_label: "conjunção",
    results_harmonious_label: "harmônico",
    results_challenging_label: "desafiador",
    results_no_aspects_title: "Um céu tranquilo",
    results_no_aspects_body:
      "Nenhum aspecto exato está dentro da orbe neste dia. Avance ou volte alguns dias para encontrar o próximo contato.",
    results_previous_day_label: "Dia anterior",
    results_next_day_label: "Dia seguinte",
    results_range_label: "Percorrer datas de trânsito próximas",
    results_new_transit_label: "Novo trânsito",
  },
  ru: {
    results_eyebrow: "Карта транзитов",
    results_title_prefix: "Транзиты для",
    results_natal_label: "Натал",
    results_viewing_label: "Небо на дату",
    results_today_label: "Сегодня",
    results_moving_now_label: "Сейчас в движении",
    results_chart_title: "Натальные и транзитные планеты",
    results_chart_description:
      "Натальные планеты показаны на внутреннем кольце, а транзитные — на внешнем.",
    results_natal_legend: "Натал (внутри)",
    results_transiting_legend: "Транзиты (снаружи)",
    results_active_title: "Активные транзиты",
    results_count_suffix: "в этот день",
    results_applying_label: "Сходящийся",
    results_separating_label: "Расходящийся",
    results_conjunction_label: "соединение",
    results_harmonious_label: "гармоничный",
    results_challenging_label: "напряжённый",
    results_no_aspects_title: "Спокойное небо",
    results_no_aspects_body:
      "В этот день нет точных аспектов в пределах орбиса. Сдвиньте дату на несколько дней, чтобы найти следующий контакт.",
    results_previous_day_label: "Предыдущий день",
    results_next_day_label: "Следующий день",
    results_range_label: "Перемещение по ближайшим датам транзитов",
    results_new_transit_label: "Новый транзит",
  },
  it: {
    results_eyebrow: "Carta dei transiti",
    results_title_prefix: "Transiti per",
    results_natal_label: "Natale",
    results_viewing_label: "Osservando il cielo del",
    results_today_label: "Oggi",
    results_moving_now_label: "In movimento",
    results_chart_title: "Pianeti natali e in transito",
    results_chart_description:
      "I pianeti natali sono nell’anello interno e quelli in transito nell’anello esterno.",
    results_natal_legend: "Natale (interno)",
    results_transiting_legend: "Transito (esterno)",
    results_active_title: "Transiti attivi",
    results_count_suffix: "in questo giorno",
    results_applying_label: "Applicativo",
    results_separating_label: "Separativo",
    results_conjunction_label: "congiunzione",
    results_harmonious_label: "armonico",
    results_challenging_label: "impegnativo",
    results_no_aspects_title: "Un cielo tranquillo",
    results_no_aspects_body:
      "Nessun aspetto esatto rientra nell’orbe in questo giorno. Spostati di alcuni giorni per trovare il prossimo contatto.",
    results_previous_day_label: "Giorno precedente",
    results_next_day_label: "Giorno successivo",
    results_range_label: "Scorri le date di transito vicine",
    results_new_transit_label: "Nuovo transito",
  },
  de: {
    results_eyebrow: "Transit-Horoskop",
    results_title_prefix: "Transite für",
    results_natal_label: "Radix",
    results_viewing_label: "Himmel am",
    results_today_label: "Heute",
    results_moving_now_label: "Jetzt in Bewegung",
    results_chart_title: "Radix- und Transitplaneten",
    results_chart_description:
      "Radixplaneten stehen im inneren Ring, laufende Planeten im äußeren Ring.",
    results_natal_legend: "Radix (innen)",
    results_transiting_legend: "Transit (außen)",
    results_active_title: "Aktive Transite",
    results_count_suffix: "an diesem Tag",
    results_applying_label: "Zunehmend",
    results_separating_label: "Abnehmend",
    results_conjunction_label: "Konjunktion",
    results_harmonious_label: "harmonisch",
    results_challenging_label: "herausfordernd",
    results_no_aspects_title: "Ein ruhiger Himmel",
    results_no_aspects_body:
      "An diesem Tag liegt kein exakter Aspekt im Orbis. Verschiebe das Datum, um den nächsten Kontakt zu finden.",
    results_previous_day_label: "Vorheriger Tag",
    results_next_day_label: "Nächster Tag",
    results_range_label: "Nahe Transitdaten durchlaufen",
    results_new_transit_label: "Neuer Transit",
  },
} satisfies Record<SupportedLocale, TransitResultsCoreCopy>;

export const getTransitResultsCopy = (
  locale: SupportedLocale,
): TransitResultsCopy => ({
  ...(localized[locale] ?? localized.en),
  ...getTransitYearAheadHandoffCopy(locale),
});
