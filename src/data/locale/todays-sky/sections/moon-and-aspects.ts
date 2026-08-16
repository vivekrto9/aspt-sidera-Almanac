import type { SkyAspectKind } from "../../../astronomy/sky-aspects.ts";
import type { SkyMoonPhase } from "../../../astronomy/sky-moon.ts";
import type { SupportedLocale } from "../../../localization-contract.ts";

export const skyMoonPhases: SkyMoonPhase[] = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent",
];

export const skyAspectKinds: SkyAspectKind[] = [
  "conjunction",
  "sextile",
  "square",
  "trine",
  "opposition",
];

type PhaseCopy = { name: string; meaning: string };
type AspectCopy = { label: string; note: string };

export type TodaysSkyMoonAspectsCopy = {
  sectionLabel: string;
  moonEyebrow: string;
  illuminatedTemplate: string;
  nextFullLabel: string;
  nextNewLabel: string;
  aspectsTitle: string;
  aspectsCountTemplate: string;
  aspectsDescription: string;
  applyingLabel: string;
  separatingLabel: string;
  orbTemplate: string;
  emptyTitle: string;
  emptyDescription: string;
  legendConjunction: string;
  legendHarmonious: string;
  legendChallenging: string;
  phases: Record<SkyMoonPhase, PhaseCopy>;
  aspects: Record<SkyAspectKind, AspectCopy>;
};

const copyByLocale: Record<SupportedLocale, TodaysSkyMoonAspectsCopy> = {
  en: {
    sectionLabel: "Moon phase and current planetary aspects",
    moonEyebrow: "The Moon",
    illuminatedTemplate: "{percent} illuminated · in {sign}",
    nextFullLabel: "Next Full",
    nextNewLabel: "Next New",
    aspectsTitle: "Aspects in play",
    aspectsCountTemplate: "{count} within orb",
    aspectsDescription: "The conversations happening between planets today.",
    applyingLabel: "applying",
    separatingLabel: "separating",
    orbTemplate: "{orb}° orb",
    emptyTitle: "A quiet sky",
    emptyDescription: "No exact aspects are within orb. Scrub a few days to catch the next contact.",
    legendConjunction: "conjunction",
    legendHarmonious: "harmonious",
    legendChallenging: "challenging",
    phases: {
      new: { name: "New Moon", meaning: "A reset. Plant intentions before there is anything to show for them." },
      "waxing-crescent": { name: "Waxing Crescent", meaning: "Momentum is gathering. Protect the small beginning and keep moving." },
      "first-quarter": { name: "First Quarter", meaning: "A decision point. Friction reveals which commitment is real." },
      "waxing-gibbous": { name: "Waxing Gibbous", meaning: "Refine the work. Small adjustments prepare the way for clarity." },
      full: { name: "Full Moon", meaning: "Culmination and clarity. What was hidden comes into view." },
      "waning-gibbous": { name: "Waning Gibbous", meaning: "Share what you learned and release the need to hold every result." },
      "last-quarter": { name: "Last Quarter", meaning: "Reconsider old patterns. Make room before beginning again." },
      "waning-crescent": { name: "Waning Crescent", meaning: "Rest and integrate. The next cycle needs quiet space." },
    },
    aspects: {
      conjunction: { label: "Conjunction", note: "{first} and {second} combine their focus and act as one force." },
      sextile: { label: "Sextile", note: "{first} and {second} open a practical opportunity for cooperation." },
      square: { label: "Square", note: "{first} and {second} create friction that asks for a conscious response." },
      trine: { label: "Trine", note: "{first} and {second} support an easy, constructive flow." },
      opposition: { label: "Opposition", note: "{first} and {second} reveal two needs that must be held in balance." },
    },
  },
  es: {
    sectionLabel: "Fase lunar y aspectos planetarios actuales",
    moonEyebrow: "La Luna",
    illuminatedTemplate: "{percent} iluminada · en {sign}",
    nextFullLabel: "Próxima llena",
    nextNewLabel: "Próxima nueva",
    aspectsTitle: "Aspectos activos",
    aspectsCountTemplate: "{count} en orbe",
    aspectsDescription: "Las conversaciones que mantienen hoy los planetas.",
    applyingLabel: "aplicativo",
    separatingLabel: "separativo",
    orbTemplate: "orbe {orb}°",
    emptyTitle: "Un cielo tranquilo",
    emptyDescription: "No hay aspectos exactos en orbe. Mueve unos días para encontrar el próximo contacto.",
    legendConjunction: "conjunción",
    legendHarmonious: "armónico",
    legendChallenging: "desafiante",
    phases: {
      new: { name: "Luna nueva", meaning: "Un reinicio. Siembra intenciones antes de que haya algo visible." },
      "waxing-crescent": { name: "Creciente", meaning: "El impulso aumenta. Protege el comienzo y sigue avanzando." },
      "first-quarter": { name: "Cuarto creciente", meaning: "Un punto de decisión. La fricción muestra qué compromiso es real." },
      "waxing-gibbous": { name: "Gibosa creciente", meaning: "Refina el trabajo. Los ajustes pequeños preparan la claridad." },
      full: { name: "Luna llena", meaning: "Culminación y claridad. Lo oculto sale a la luz." },
      "waning-gibbous": { name: "Gibosa menguante", meaning: "Comparte lo aprendido y suelta la necesidad de retener el resultado." },
      "last-quarter": { name: "Cuarto menguante", meaning: "Reconsidera viejos patrones y haz espacio para lo nuevo." },
      "waning-crescent": { name: "Menguante", meaning: "Descansa e integra. El próximo ciclo necesita silencio." },
    },
    aspects: {
      conjunction: { label: "Conjunción", note: "{first} y {second} combinan su enfoque en una sola fuerza." },
      sextile: { label: "Sextil", note: "{first} y {second} abren una oportunidad práctica de cooperación." },
      square: { label: "Cuadratura", note: "{first} y {second} crean una tensión que pide respuesta consciente." },
      trine: { label: "Trígono", note: "{first} y {second} favorecen un flujo fácil y constructivo." },
      opposition: { label: "Oposición", note: "{first} y {second} muestran dos necesidades que deben equilibrarse." },
    },
  },
  fr: {
    sectionLabel: "Phase lunaire et aspects planétaires actuels",
    moonEyebrow: "La Lune",
    illuminatedTemplate: "{percent} éclairée · en {sign}",
    nextFullLabel: "Prochaine pleine",
    nextNewLabel: "Prochaine nouvelle",
    aspectsTitle: "Aspects en cours",
    aspectsCountTemplate: "{count} dans l’orbe",
    aspectsDescription: "Les conversations entre les planètes aujourd’hui.",
    applyingLabel: "appliquant",
    separatingLabel: "séparant",
    orbTemplate: "orbe {orb}°",
    emptyTitle: "Un ciel calme",
    emptyDescription: "Aucun aspect exact dans l’orbe. Parcourez quelques jours pour trouver le prochain contact.",
    legendConjunction: "conjonction",
    legendHarmonious: "harmonieux",
    legendChallenging: "tendu",
    phases: {
      new: { name: "Nouvelle Lune", meaning: "Un nouveau départ. Semez une intention avant qu’elle ne soit visible." },
      "waxing-crescent": { name: "Premier croissant", meaning: "L’élan grandit. Protégez ce commencement et avancez." },
      "first-quarter": { name: "Premier quartier", meaning: "Un choix s’impose. La tension révèle l’engagement réel." },
      "waxing-gibbous": { name: "Gibbeuse croissante", meaning: "Affinez votre travail. Les ajustements préparent la clarté." },
      full: { name: "Pleine Lune", meaning: "Aboutissement et clarté. Ce qui était caché apparaît." },
      "waning-gibbous": { name: "Gibbeuse décroissante", meaning: "Partagez ce que vous avez appris et relâchez le résultat." },
      "last-quarter": { name: "Dernier quartier", meaning: "Réévaluez les anciens schémas et libérez de l’espace." },
      "waning-crescent": { name: "Dernier croissant", meaning: "Reposez-vous et intégrez. Le prochain cycle demande du calme." },
    },
    aspects: {
      conjunction: { label: "Conjonction", note: "{first} et {second} unissent leur attention en une seule force." },
      sextile: { label: "Sextile", note: "{first} et {second} ouvrent une occasion concrète de coopérer." },
      square: { label: "Carré", note: "{first} et {second} créent une tension qui demande une réponse consciente." },
      trine: { label: "Trigone", note: "{first} et {second} soutiennent un mouvement fluide et constructif." },
      opposition: { label: "Opposition", note: "{first} et {second} révèlent deux besoins à équilibrer." },
    },
  },
  pt: {
    sectionLabel: "Fase lunar e aspectos planetários atuais",
    moonEyebrow: "A Lua",
    illuminatedTemplate: "{percent} iluminada · em {sign}",
    nextFullLabel: "Próxima cheia",
    nextNewLabel: "Próxima nova",
    aspectsTitle: "Aspectos em jogo",
    aspectsCountTemplate: "{count} no orbe",
    aspectsDescription: "As conversas que acontecem hoje entre os planetas.",
    applyingLabel: "aplicativo",
    separatingLabel: "separativo",
    orbTemplate: "orbe {orb}°",
    emptyTitle: "Um céu tranquilo",
    emptyDescription: "Não há aspectos exatos no orbe. Avance alguns dias para encontrar o próximo contato.",
    legendConjunction: "conjunção",
    legendHarmonious: "harmonioso",
    legendChallenging: "desafiador",
    phases: {
      new: { name: "Lua nova", meaning: "Um recomeço. Plante intenções antes de haver algo para mostrar." },
      "waxing-crescent": { name: "Lua crescente", meaning: "O impulso aumenta. Proteja o começo e continue avançando." },
      "first-quarter": { name: "Quarto crescente", meaning: "Um ponto de decisão. O atrito revela o compromisso real." },
      "waxing-gibbous": { name: "Gibosa crescente", meaning: "Refine o trabalho. Pequenos ajustes preparam a clareza." },
      full: { name: "Lua cheia", meaning: "Culminação e clareza. O que estava oculto vem à luz." },
      "waning-gibbous": { name: "Gibosa minguante", meaning: "Compartilhe o aprendizado e solte a necessidade de reter o resultado." },
      "last-quarter": { name: "Quarto minguante", meaning: "Reavalie padrões antigos e abra espaço para o novo." },
      "waning-crescent": { name: "Lua minguante", meaning: "Descanse e integre. O próximo ciclo precisa de silêncio." },
    },
    aspects: {
      conjunction: { label: "Conjunção", note: "{first} e {second} combinam o foco e agem como uma força." },
      sextile: { label: "Sextil", note: "{first} e {second} abrem uma oportunidade prática de cooperação." },
      square: { label: "Quadratura", note: "{first} e {second} criam atrito que pede uma resposta consciente." },
      trine: { label: "Trígono", note: "{first} e {second} sustentam um fluxo fácil e construtivo." },
      opposition: { label: "Oposição", note: "{first} e {second} mostram duas necessidades que pedem equilíbrio." },
    },
  },
  ru: {
    sectionLabel: "Фаза Луны и текущие планетарные аспекты",
    moonEyebrow: "Луна",
    illuminatedTemplate: "освещено {percent} · в знаке {sign}",
    nextFullLabel: "Следующее полнолуние",
    nextNewLabel: "Следующее новолуние",
    aspectsTitle: "Действующие аспекты",
    aspectsCountTemplate: "{count} в орбисе",
    aspectsDescription: "Диалог, который сегодня ведут планеты.",
    applyingLabel: "сходящийся",
    separatingLabel: "расходящийся",
    orbTemplate: "орбис {orb}°",
    emptyTitle: "Спокойное небо",
    emptyDescription: "Точных аспектов в орбисе нет. Сдвиньте дату, чтобы увидеть следующий контакт.",
    legendConjunction: "соединение",
    legendHarmonious: "гармоничный",
    legendChallenging: "напряжённый",
    phases: {
      new: { name: "Новолуние", meaning: "Перезагрузка. Посейте намерение ещё до появления видимого результата." },
      "waxing-crescent": { name: "Растущий серп", meaning: "Импульс нарастает. Берегите начало и продолжайте движение." },
      "first-quarter": { name: "Первая четверть", meaning: "Момент выбора. Напряжение показывает серьёзность намерения." },
      "waxing-gibbous": { name: "Растущая Луна", meaning: "Уточняйте работу. Небольшие правки готовят ясность." },
      full: { name: "Полнолуние", meaning: "Кульминация и ясность. Скрытое становится видимым." },
      "waning-gibbous": { name: "Убывающая Луна", meaning: "Делитесь опытом и отпускайте привязанность к результату." },
      "last-quarter": { name: "Последняя четверть", meaning: "Пересмотрите старые привычки и освободите место." },
      "waning-crescent": { name: "Убывающий серп", meaning: "Отдыхайте и осмысливайте. Новому циклу нужна тишина." },
    },
    aspects: {
      conjunction: { label: "Соединение", note: "{first} и {second} объединяют внимание в одну силу." },
      sextile: { label: "Секстиль", note: "{first} и {second} открывают практичную возможность сотрудничества." },
      square: { label: "Квадрат", note: "{first} и {second} создают напряжение, требующее осознанного ответа." },
      trine: { label: "Трин", note: "{first} и {second} поддерживают лёгкое и созидательное течение." },
      opposition: { label: "Оппозиция", note: "{first} и {second} показывают две потребности, которым нужен баланс." },
    },
  },
  it: {
    sectionLabel: "Fase lunare e aspetti planetari attuali",
    moonEyebrow: "La Luna",
    illuminatedTemplate: "{percent} illuminata · in {sign}",
    nextFullLabel: "Prossima piena",
    nextNewLabel: "Prossima nuova",
    aspectsTitle: "Aspetti in gioco",
    aspectsCountTemplate: "{count} nell’orbe",
    aspectsDescription: "Le conversazioni in corso oggi tra i pianeti.",
    applyingLabel: "applicativo",
    separatingLabel: "separativo",
    orbTemplate: "orbe {orb}°",
    emptyTitle: "Un cielo quieto",
    emptyDescription: "Nessun aspetto esatto è nell’orbe. Sposta la data per trovare il prossimo contatto.",
    legendConjunction: "congiunzione",
    legendHarmonious: "armonioso",
    legendChallenging: "impegnativo",
    phases: {
      new: { name: "Luna nuova", meaning: "Un nuovo inizio. Pianta intenzioni prima che siano visibili." },
      "waxing-crescent": { name: "Luna crescente", meaning: "Lo slancio aumenta. Proteggi l’inizio e continua." },
      "first-quarter": { name: "Primo quarto", meaning: "Un punto di scelta. L’attrito rivela l’impegno reale." },
      "waxing-gibbous": { name: "Gibbosa crescente", meaning: "Raffina il lavoro. Piccoli aggiustamenti preparano la chiarezza." },
      full: { name: "Luna piena", meaning: "Culmine e chiarezza. Ciò che era nascosto viene alla luce." },
      "waning-gibbous": { name: "Gibbosa calante", meaning: "Condividi ciò che hai imparato e lascia andare il risultato." },
      "last-quarter": { name: "Ultimo quarto", meaning: "Riconsidera i vecchi schemi e crea spazio." },
      "waning-crescent": { name: "Luna calante", meaning: "Riposa e integra. Il prossimo ciclo richiede quiete." },
    },
    aspects: {
      conjunction: { label: "Congiunzione", note: "{first} e {second} uniscono l’attenzione in un’unica forza." },
      sextile: { label: "Sestile", note: "{first} e {second} aprono un’opportunità pratica di collaborazione." },
      square: { label: "Quadratura", note: "{first} e {second} creano attrito che richiede una risposta consapevole." },
      trine: { label: "Trigono", note: "{first} e {second} sostengono un flusso facile e costruttivo." },
      opposition: { label: "Opposizione", note: "{first} e {second} rivelano due esigenze da equilibrare." },
    },
  },
  de: {
    sectionLabel: "Mondphase und aktuelle Planetenaspekte",
    moonEyebrow: "Der Mond",
    illuminatedTemplate: "{percent} beleuchtet · in {sign}",
    nextFullLabel: "Nächster Vollmond",
    nextNewLabel: "Nächster Neumond",
    aspectsTitle: "Aktive Aspekte",
    aspectsCountTemplate: "{count} im Orbis",
    aspectsDescription: "Die Gespräche, die heute zwischen den Planeten stattfinden.",
    applyingLabel: "zulaufend",
    separatingLabel: "ablaufend",
    orbTemplate: "{orb}° Orbis",
    emptyTitle: "Ein ruhiger Himmel",
    emptyDescription: "Keine exakten Aspekte liegen im Orbis. Verschiebe das Datum für den nächsten Kontakt.",
    legendConjunction: "Konjunktion",
    legendHarmonious: "harmonisch",
    legendChallenging: "herausfordernd",
    phases: {
      new: { name: "Neumond", meaning: "Ein Neubeginn. Setze Absichten, bevor etwas sichtbar wird." },
      "waxing-crescent": { name: "Zunehmende Sichel", meaning: "Der Schwung wächst. Schütze den Anfang und bleib in Bewegung." },
      "first-quarter": { name: "Erstes Viertel", meaning: "Ein Entscheidungspunkt. Reibung zeigt, was wirklich trägt." },
      "waxing-gibbous": { name: "Zunehmender Mond", meaning: "Verfeinere die Arbeit. Kleine Anpassungen schaffen Klarheit." },
      full: { name: "Vollmond", meaning: "Höhepunkt und Klarheit. Verborgenes wird sichtbar." },
      "waning-gibbous": { name: "Abnehmender Mond", meaning: "Teile deine Erkenntnisse und lass das Ergebnis los." },
      "last-quarter": { name: "Letztes Viertel", meaning: "Prüfe alte Muster und schaffe Raum für Neues." },
      "waning-crescent": { name: "Abnehmende Sichel", meaning: "Ruhe dich aus und integriere. Der nächste Zyklus braucht Stille." },
    },
    aspects: {
      conjunction: { label: "Konjunktion", note: "{first} und {second} bündeln ihren Fokus zu einer Kraft." },
      sextile: { label: "Sextil", note: "{first} und {second} öffnen eine praktische Chance zur Zusammenarbeit." },
      square: { label: "Quadrat", note: "{first} und {second} erzeugen Reibung, die eine bewusste Antwort verlangt." },
      trine: { label: "Trigon", note: "{first} und {second} unterstützen einen leichten, konstruktiven Fluss." },
      opposition: { label: "Opposition", note: "{first} und {second} zeigen zwei Bedürfnisse, die Balance brauchen." },
    },
  },
};

export const getTodaysSkyMoonAspectsCopy = (
  locale: SupportedLocale,
): TodaysSkyMoonAspectsCopy => copyByLocale[locale] ?? copyByLocale.en;

export const getTodaysSkyMoonAspectsFields = (
  locale: SupportedLocale,
): Record<string, string> => {
  const copy = getTodaysSkyMoonAspectsCopy(locale);
  return {
    sky_moon_eyebrow: copy.moonEyebrow,
    sky_moon_illuminated_template: copy.illuminatedTemplate,
    sky_moon_next_full_label: copy.nextFullLabel,
    sky_moon_next_new_label: copy.nextNewLabel,
    sky_aspects_title: copy.aspectsTitle,
    sky_aspects_count_template: copy.aspectsCountTemplate,
    sky_aspects_description: copy.aspectsDescription,
    sky_aspect_applying_label: copy.applyingLabel,
    sky_aspect_separating_label: copy.separatingLabel,
    sky_aspect_orb_template: copy.orbTemplate,
    sky_aspects_empty_title: copy.emptyTitle,
    sky_aspects_empty_description: copy.emptyDescription,
    sky_aspects_legend_conjunction: copy.legendConjunction,
    sky_aspects_legend_harmonious: copy.legendHarmonious,
    sky_aspects_legend_challenging: copy.legendChallenging,
    ...Object.fromEntries(
      skyMoonPhases.flatMap((phase) => [
        [`sky_moon_phase_${phase.replaceAll("-", "_")}_name`, copy.phases[phase].name],
        [`sky_moon_phase_${phase.replaceAll("-", "_")}_meaning`, copy.phases[phase].meaning],
      ]),
    ),
    ...Object.fromEntries(
      skyAspectKinds.flatMap((kind) => [
        [`sky_aspect_${kind}_label`, copy.aspects[kind].label],
        [`sky_aspect_${kind}_note`, copy.aspects[kind].note],
      ]),
    ),
  };
};
