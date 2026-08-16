import type { SupportedLocale } from "../../../localization-contract.ts";
import type { SkyBodyPosition } from "../../../astronomy/sky-strip-positions.ts";

export type TodaysSkyWheelCopy = {
  sectionLabel: string;
  wheelTitle: string;
  wheelCaption: string;
  positionsTitle: string;
  positionsCount: string;
  retrogradeLabel: string;
  readingTemplate: string;
  positionActionTemplate: string;
};

const copyByLocale = {
  en: {
    sectionLabel: "Sky wheel, selected reading, and planetary positions",
    wheelTitle: "Interactive wheel of the current sky",
    wheelCaption: "Choose any planet to read where it sits · lines are live aspects",
    positionsTitle: "Where everything sits",
    positionsCount: "10 bodies",
    retrogradeLabel: "Retrograde",
    readingTemplate:
      "{planet} is moving through {sign}, bringing its {element} quality into focus. Notice where this energy asks for attention before choosing your next move.",
    positionActionTemplate: "Read {planet} at {degree} {sign}",
  },
  es: {
    sectionLabel: "Rueda celeste, lectura seleccionada y posiciones planetarias",
    wheelTitle: "Rueda interactiva del cielo actual",
    wheelCaption: "Elige un planeta para leer su posición · las líneas son aspectos activos",
    positionsTitle: "Dónde está cada cuerpo",
    positionsCount: "10 cuerpos",
    retrogradeLabel: "Retrógrado",
    readingTemplate:
      "{planet} se mueve por {sign} y pone en primer plano su cualidad de {element}. Observa dónde pide atención esta energía antes de decidir tu próximo paso.",
    positionActionTemplate: "Leer {planet} a {degree} de {sign}",
  },
  fr: {
    sectionLabel: "Roue du ciel, lecture sélectionnée et positions planétaires",
    wheelTitle: "Roue interactive du ciel actuel",
    wheelCaption: "Choisissez une planète pour lire sa position · les lignes sont les aspects actifs",
    positionsTitle: "La position de chaque corps",
    positionsCount: "10 corps",
    retrogradeLabel: "Rétrograde",
    readingTemplate:
      "{planet} traverse {sign} et met en lumière sa qualité {element}. Observez où cette énergie demande votre attention avant de choisir la suite.",
    positionActionTemplate: "Lire {planet} à {degree} en {sign}",
  },
  pt: {
    sectionLabel: "Roda do céu, leitura selecionada e posições planetárias",
    wheelTitle: "Roda interativa do céu atual",
    wheelCaption: "Escolha um planeta para ler sua posição · as linhas são aspectos ativos",
    positionsTitle: "Onde cada corpo está",
    positionsCount: "10 corpos",
    retrogradeLabel: "Retrógrado",
    readingTemplate:
      "{planet} atravessa {sign} e coloca sua qualidade de {element} em foco. Observe onde essa energia pede atenção antes de escolher o próximo passo.",
    positionActionTemplate: "Ler {planet} a {degree} em {sign}",
  },
  ru: {
    sectionLabel: "Колесо неба, выбранное толкование и положения планет",
    wheelTitle: "Интерактивное колесо текущего неба",
    wheelCaption: "Выберите планету, чтобы прочитать её положение · линии показывают активные аспекты",
    positionsTitle: "Положение всех тел",
    positionsCount: "10 тел",
    retrogradeLabel: "Ретроград",
    readingTemplate:
      "{planet} движется через знак {sign}, выводя на первый план качество стихии {element}. Заметьте, где эта энергия требует внимания перед следующим шагом.",
    positionActionTemplate: "Прочитать о {planet}: {degree} {sign}",
  },
  it: {
    sectionLabel: "Ruota del cielo, lettura selezionata e posizioni planetarie",
    wheelTitle: "Ruota interattiva del cielo attuale",
    wheelCaption: "Scegli un pianeta per leggere la sua posizione · le linee sono aspetti attivi",
    positionsTitle: "Dove si trova ogni corpo",
    positionsCount: "10 corpi",
    retrogradeLabel: "Retrogrado",
    readingTemplate:
      "{planet} attraversa {sign} e porta in primo piano la sua qualità di {element}. Nota dove questa energia richiede attenzione prima della prossima scelta.",
    positionActionTemplate: "Leggi {planet} a {degree} in {sign}",
  },
  de: {
    sectionLabel: "Himmelsrad, ausgewählte Deutung und Planetenpositionen",
    wheelTitle: "Interaktives Rad des aktuellen Himmels",
    wheelCaption: "Wähle einen Planeten, um seine Position zu deuten · Linien zeigen aktive Aspekte",
    positionsTitle: "Wo alle Himmelskörper stehen",
    positionsCount: "10 Himmelskörper",
    retrogradeLabel: "Rückläufig",
    readingTemplate:
      "{planet} bewegt sich durch {sign} und rückt seine {element}-Qualität in den Mittelpunkt. Beobachte, wo diese Energie Aufmerksamkeit verlangt, bevor du weitergehst.",
    positionActionTemplate: "{planet} bei {degree} in {sign} deuten",
  },
} satisfies Record<SupportedLocale, TodaysSkyWheelCopy>;

export const getTodaysSkyWheelCopy = (
  locale: SupportedLocale,
): TodaysSkyWheelCopy => copyByLocale[locale] ?? copyByLocale.en;

export const formatSkyCopy = (
  template: string,
  position: SkyBodyPosition,
) =>
  template
    .replaceAll("{planet}", position.planetName)
    .replaceAll("{sign}", position.signName)
    .replaceAll("{degree}", position.degreeText)
    .replaceAll("{element}", position.element);
