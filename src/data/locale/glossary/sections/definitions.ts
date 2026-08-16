import type { SupportedLocale } from "../../../localization-contract.ts";

export type GlossaryTermKey =
  | "ascendant"
  | "aspect"
  | "conjunction"
  | "cusp"
  | "descendant"
  | "dignity"
  | "ephemeris"
  | "element"
  | "house"
  | "lot_of_fortune"
  | "midheaven"
  | "modality"
  | "natal_chart"
  | "opposition"
  | "orb"
  | "retrograde"
  | "sextile"
  | "square"
  | "synastry"
  | "transit"
  | "trine"
  | "zodiac";

export type GlossaryTermCopy = {
  name: string;
  definition: string;
};

export const glossaryDefinitionStructure: ReadonlyArray<{
  letter: string;
  terms: readonly GlossaryTermKey[];
}> = [
  { letter: "A", terms: ["ascendant", "aspect"] },
  { letter: "C", terms: ["conjunction", "cusp"] },
  { letter: "D", terms: ["descendant", "dignity"] },
  { letter: "E", terms: ["ephemeris", "element"] },
  { letter: "H", terms: ["house"] },
  { letter: "L", terms: ["lot_of_fortune"] },
  { letter: "M", terms: ["midheaven", "modality"] },
  { letter: "N", terms: ["natal_chart"] },
  { letter: "O", terms: ["opposition", "orb"] },
  { letter: "R", terms: ["retrograde"] },
  { letter: "S", terms: ["sextile", "square", "synastry"] },
  { letter: "T", terms: ["transit", "trine"] },
  { letter: "Z", terms: ["zodiac"] },
];

export const glossaryTermKeys = glossaryDefinitionStructure.flatMap(
  (group) => group.terms,
);

export const glossaryAnchorForLetter = (letter: string) =>
  `g-${Array.from(letter)
    .map((character) => character.codePointAt(0)?.toString(16) || "0")
    .join("-")}`;

export const groupLocalizedGlossaryTerms = <T extends { name: string }>(
  terms: readonly T[],
  locale: SupportedLocale,
) => {
  const collator = new Intl.Collator(locale, {
    sensitivity: "base",
    usage: "sort",
  });
  const groups = new Map<string, T[]>();

  for (const term of terms) {
    const letter = Array.from(term.name.trim())[0]?.toLocaleUpperCase(locale);
    if (!letter) continue;
    const group = groups.get(letter) ?? [];
    group.push(term);
    groups.set(letter, group);
  }

  return [...groups.entries()]
    .sort(([letterA], [letterB]) => collator.compare(letterA, letterB))
    .map(([letter, groupTerms]) => ({
      id: glossaryAnchorForLetter(letter),
      letter,
      terms: groupTerms.sort((termA, termB) =>
        collator.compare(termA.name, termB.name),
      ),
    }));
};

const copyByLocale = {
  en: {
    ascendant: {
      name: "Ascendant",
      definition:
        "The zodiac sign rising on the eastern horizon at your birth. It sets the chart’s houses and colours how you meet the world. Also called the rising sign.",
    },
    aspect: {
      name: "Aspect",
      definition:
        "An angular relationship between two planets — conjunction, sextile, square, trine, opposition — describing how their energies interact.",
    },
    conjunction: {
      name: "Conjunction",
      definition:
        "Two planets within the accepted orb of 0°, blending their natures into a single, concentrated force.",
    },
    cusp: {
      name: "Cusp",
      definition:
        "The boundary line where one house or sign begins and another ends.",
    },
    descendant: {
      name: "Descendant",
      definition:
        "The point opposite the Ascendant, tied to partnership and what we seek in others.",
    },
    dignity: {
      name: "Dignity",
      definition:
        "A measure of how comfortably a planet operates in a given sign — rulership, exaltation, detriment or fall.",
    },
    ephemeris: {
      name: "Ephemeris",
      definition:
        "A table of planetary positions over time. Sidera uses the Swiss Ephemeris, accurate to the arcminute.",
    },
    element: {
      name: "Element",
      definition:
        "The four groupings of the zodiac — fire, earth, air and water — each shared by three signs.",
    },
    house: {
      name: "House",
      definition:
        "One of twelve divisions of the chart, each governing an area of life such as home, career or partnership.",
    },
    lot_of_fortune: {
      name: "Lot of Fortune",
      definition:
        "A calculated point tied to the body, fortune and material life, derived from the Sun, Moon and Ascendant.",
    },
    midheaven: {
      name: "Midheaven",
      definition:
        "The highest point of the chart (the MC), associated with career, reputation and public role.",
    },
    modality: {
      name: "Modality",
      definition:
        "The three modes — cardinal, fixed and mutable — describing how each sign initiates, sustains or adapts.",
    },
    natal_chart: {
      name: "Natal chart",
      definition:
        "The map of the sky at the exact moment and place of your birth. Also called a birth chart.",
    },
    opposition: {
      name: "Opposition",
      definition:
        "Two planets 180° apart, creating tension that seeks balance and awareness through the other.",
    },
    orb: {
      name: "Orb",
      definition:
        "The allowable margin of degrees within which an aspect is considered active.",
    },
    retrograde: {
      name: "Retrograde",
      definition:
        "Astronomically, a planet’s apparent backward motion as seen from Earth. In astrology, it is interpreted as a period of review and revision.",
    },
    sextile: {
      name: "Sextile",
      definition:
        "A harmonious 60° aspect offering opportunity and easy cooperation between two planets.",
    },
    square: {
      name: "Square",
      definition:
        "A 90° aspect of friction and challenge that drives growth through effort.",
    },
    synastry: {
      name: "Synastry",
      definition:
        "The comparison of two charts to understand a relationship’s dynamics.",
    },
    transit: {
      name: "Transit",
      definition:
        "The movement of present-day planets and the aspects they make to your natal chart.",
    },
    trine: {
      name: "Trine",
      definition:
        "A flowing 120° aspect of natural ease and talent between two planets.",
    },
    zodiac: {
      name: "Zodiac",
      definition:
        "The band of twelve signs the Sun, Moon and planets appear to travel through across the year.",
    },
  },
  es: {
    ascendant: {
      name: "Ascendente",
      definition:
        "El signo zodiacal que ascendía por el horizonte oriental al nacer. Establece las casas y describe cómo te presentas ante el mundo. También se llama signo ascendente.",
    },
    aspect: {
      name: "Aspecto",
      definition:
        "Relación angular entre dos planetas — conjunción, sextil, cuadratura, trígono u oposición — que describe cómo interactúan sus energías.",
    },
    conjunction: {
      name: "Conjunción",
      definition:
        "Dos planetas dentro del orbe aceptado de 0° que combinan sus naturalezas en una fuerza única y concentrada.",
    },
    cusp: {
      name: "Cúspide",
      definition:
        "La línea límite donde comienza una casa o un signo y termina otro.",
    },
    descendant: {
      name: "Descendente",
      definition:
        "El punto opuesto al Ascendente, relacionado con la pareja y con lo que buscamos en los demás.",
    },
    dignity: {
      name: "Dignidad",
      definition:
        "Medida de la comodidad con la que actúa un planeta en un signo: regencia, exaltación, detrimento o caída.",
    },
    ephemeris: {
      name: "Efemérides",
      definition:
        "Tabla de posiciones planetarias a lo largo del tiempo. Sidera usa Swiss Ephemeris, con precisión de minuto de arco.",
    },
    element: {
      name: "Elemento",
      definition:
        "Los cuatro grupos del zodiaco — fuego, tierra, aire y agua — compartidos por tres signos cada uno.",
    },
    house: {
      name: "Casa",
      definition:
        "Una de las doce divisiones de la carta; cada una rige un ámbito vital como el hogar, la carrera o las relaciones.",
    },
    lot_of_fortune: {
      name: "Parte de la Fortuna",
      definition:
        "Punto calculado vinculado con el cuerpo, la fortuna y la vida material, derivado del Sol, la Luna y el Ascendente.",
    },
    midheaven: {
      name: "Medio Cielo",
      definition:
        "El punto más alto de la carta (MC), asociado con la carrera, la reputación y el papel público.",
    },
    modality: {
      name: "Modalidad",
      definition:
        "Los tres modos — cardinal, fijo y mutable — que describen cómo cada signo inicia, sostiene o se adapta.",
    },
    natal_chart: {
      name: "Carta natal",
      definition:
        "Mapa del cielo en el momento y lugar exactos del nacimiento. También se llama carta astral.",
    },
    opposition: {
      name: "Oposición",
      definition:
        "Dos planetas separados por 180°, creando una tensión que busca equilibrio y conciencia a través del otro.",
    },
    orb: {
      name: "Orbe",
      definition:
        "Margen de grados permitido para considerar que un aspecto está activo.",
    },
    retrograde: {
      name: "Retrógrado",
      definition:
        "Astronómicamente, el movimiento retrógrado aparente de un planeta visto desde la Tierra. En astrología, se interpreta como un periodo de revisión.",
    },
    sextile: {
      name: "Sextil",
      definition:
        "Aspecto armónico de 60° que ofrece oportunidades y cooperación fluida entre dos planetas.",
    },
    square: {
      name: "Cuadratura",
      definition:
        "Aspecto de 90° de fricción y desafío que impulsa el crecimiento mediante el esfuerzo.",
    },
    synastry: {
      name: "Sinastría",
      definition:
        "Comparación de dos cartas para comprender la dinámica de una relación.",
    },
    transit: {
      name: "Tránsito",
      definition:
        "Movimiento de los planetas actuales y los aspectos que forman con tu carta natal.",
    },
    trine: {
      name: "Trígono",
      definition:
        "Aspecto fluido de 120° de facilidad y talento naturales entre dos planetas.",
    },
    zodiac: {
      name: "Zodiaco",
      definition:
        "La franja de doce signos por la que parecen desplazarse el Sol, la Luna y los planetas durante el año.",
    },
  },
  fr: {
    ascendant: {
      name: "Ascendant",
      definition:
        "Le signe zodiacal qui se levait à l’est à votre naissance. Il fixe les maisons et colore votre manière d’aborder le monde. Aussi appelé signe ascendant.",
    },
    aspect: {
      name: "Aspect",
      definition:
        "Relation angulaire entre deux planètes — conjonction, sextile, carré, trigone ou opposition — décrivant l’interaction de leurs énergies.",
    },
    conjunction: {
      name: "Conjonction",
      definition:
        "Deux planètes dans l’orbe admis de 0°, mêlant leur nature en une force unique et concentrée.",
    },
    cusp: {
      name: "Cuspide",
      definition:
        "La ligne de séparation où une maison ou un signe commence et où l’autre se termine.",
    },
    descendant: {
      name: "Descendant",
      definition:
        "Le point opposé à l’Ascendant, lié au partenariat et à ce que nous recherchons chez l’autre.",
    },
    dignity: {
      name: "Dignité",
      definition:
        "Mesure de l’aisance d’une planète dans un signe : domicile, exaltation, exil ou chute.",
    },
    ephemeris: {
      name: "Éphémérides",
      definition:
        "Table des positions planétaires au fil du temps. Sidera utilise Swiss Ephemeris, précis à la minute d’arc.",
    },
    element: {
      name: "Élément",
      definition:
        "Les quatre familles du zodiaque — feu, terre, air et eau — chacune partagée par trois signes.",
    },
    house: {
      name: "Maison",
      definition:
        "L’une des douze divisions du thème, chacune gouvernant un domaine de vie comme le foyer, la carrière ou le couple.",
    },
    lot_of_fortune: {
      name: "Part de Fortune",
      definition:
        "Point calculé lié au corps, à la fortune et à la vie matérielle, dérivé du Soleil, de la Lune et de l’Ascendant.",
    },
    midheaven: {
      name: "Milieu du Ciel",
      definition:
        "Le point culminant du thème (MC), associé à la carrière, à la réputation et au rôle public.",
    },
    modality: {
      name: "Modalité",
      definition:
        "Les trois modes — cardinal, fixe et mutable — décrivant comment chaque signe initie, maintient ou s’adapte.",
    },
    natal_chart: {
      name: "Thème natal",
      definition:
        "La carte du ciel au lieu et à l’instant exacts de votre naissance. Aussi appelée carte du ciel.",
    },
    opposition: {
      name: "Opposition",
      definition:
        "Deux planètes séparées de 180°, créant une tension qui cherche l’équilibre et la conscience par l’autre.",
    },
    orb: {
      name: "Orbe",
      definition:
        "La marge de degrés admise pour qu’un aspect soit considéré comme actif.",
    },
    retrograde: {
      name: "Rétrograde",
      definition:
        "Astronomiquement, le mouvement apparent vers l’arrière d’une planète vue de la Terre. En astrologie, il est interprété comme une période de révision.",
    },
    sextile: {
      name: "Sextile",
      definition:
        "Aspect harmonieux de 60° offrant possibilités et coopération fluide entre deux planètes.",
    },
    square: {
      name: "Carré",
      definition:
        "Aspect de 90° marqué par la friction et le défi, qui favorise la croissance par l’effort.",
    },
    synastry: {
      name: "Synastrie",
      definition:
        "Comparaison de deux thèmes pour comprendre la dynamique d’une relation.",
    },
    transit: {
      name: "Transit",
      definition:
        "Le mouvement actuel des planètes et les aspects qu’elles forment avec votre thème natal.",
    },
    trine: {
      name: "Trigone",
      definition:
        "Aspect fluide de 120° exprimant aisance et talent naturels entre deux planètes.",
    },
    zodiac: {
      name: "Zodiaque",
      definition:
        "La bande des douze signes dans laquelle le Soleil, la Lune et les planètes semblent voyager au fil de l’année.",
    },
  },
  pt: {
    ascendant: {
      name: "Ascendente",
      definition:
        "O signo que surgia no horizonte leste no nascimento. Define as casas e colore a forma como você encontra o mundo. Também chamado signo ascendente.",
    },
    aspect: {
      name: "Aspecto",
      definition:
        "Relação angular entre dois planetas — conjunção, sextil, quadratura, trígono ou oposição — que descreve a interação de suas energias.",
    },
    conjunction: {
      name: "Conjunção",
      definition:
        "Dois planetas dentro do orbe aceite de 0°, unindo as suas naturezas numa força única e concentrada.",
    },
    cusp: {
      name: "Cúspide",
      definition:
        "A linha de limite onde uma casa ou signo começa e outro termina.",
    },
    descendant: {
      name: "Descendente",
      definition:
        "O ponto oposto ao Ascendente, ligado às parcerias e ao que buscamos nos outros.",
    },
    dignity: {
      name: "Dignidade",
      definition:
        "Medida de quão à vontade um planeta atua em um signo: domicílio, exaltação, detrimento ou queda.",
    },
    ephemeris: {
      name: "Efemérides",
      definition:
        "Tabela das posições planetárias ao longo do tempo. A Sidera usa o Swiss Ephemeris, preciso ao minuto de arco.",
    },
    element: {
      name: "Elemento",
      definition:
        "Os quatro grupos do zodíaco — fogo, terra, ar e água — cada um compartilhado por três signos.",
    },
    house: {
      name: "Casa",
      definition:
        "Uma das doze divisões do mapa, cada qual regendo uma área da vida, como lar, carreira ou relacionamentos.",
    },
    lot_of_fortune: {
      name: "Parte da Fortuna",
      definition:
        "Ponto calculado ligado ao corpo, à sorte e à vida material, derivado do Sol, da Lua e do Ascendente.",
    },
    midheaven: {
      name: "Meio do Céu",
      definition:
        "O ponto mais alto do mapa (MC), associado à carreira, à reputação e ao papel público.",
    },
    modality: {
      name: "Modalidade",
      definition:
        "Os três modos — cardinal, fixo e mutável — que descrevem como cada signo inicia, sustenta ou se adapta.",
    },
    natal_chart: {
      name: "Mapa natal",
      definition:
        "O mapa do céu no momento e local exatos do nascimento. Também chamado mapa astral.",
    },
    opposition: {
      name: "Oposição",
      definition:
        "Dois planetas separados por 180°, criando uma tensão que busca equilíbrio e consciência por meio do outro.",
    },
    orb: {
      name: "Orbe",
      definition:
        "A margem de graus permitida para que um aspecto seja considerado ativo.",
    },
    retrograde: {
      name: "Retrógrado",
      definition:
        "Astronomicamente, o movimento aparente para trás de um planeta visto da Terra. Na astrologia, é interpretado como um período de revisão.",
    },
    sextile: {
      name: "Sextil",
      definition:
        "Aspecto harmonioso de 60° que oferece oportunidade e cooperação fácil entre dois planetas.",
    },
    square: {
      name: "Quadratura",
      definition:
        "Aspecto de 90° de atrito e desafio que impulsiona o crescimento pelo esforço.",
    },
    synastry: {
      name: "Sinastria",
      definition:
        "A comparação de dois mapas para compreender a dinâmica de um relacionamento.",
    },
    transit: {
      name: "Trânsito",
      definition:
        "O movimento dos planetas atuais e os aspectos que formam com seu mapa natal.",
    },
    trine: {
      name: "Trígono",
      definition:
        "Aspecto fluido de 120° de facilidade e talento naturais entre dois planetas.",
    },
    zodiac: {
      name: "Zodíaco",
      definition:
        "A faixa de doze signos pela qual o Sol, a Lua e os planetas parecem viajar ao longo do ano.",
    },
  },
  ru: {
    ascendant: {
      name: "Асцендент",
      definition:
        "Знак зодиака, восходивший на восточном горизонте в момент рождения. Он задаёт дома карты и описывает, как вы проявляетесь в мире. Также называется восходящим знаком.",
    },
    aspect: {
      name: "Аспект",
      definition:
        "Угловое отношение двух планет — соединение, секстиль, квадратура, тригон или оппозиция — описывающее взаимодействие их энергий.",
    },
    conjunction: {
      name: "Соединение",
      definition:
        "Две планеты в пределах принятого орбиса аспекта 0°, объединяющие свои качества в единую концентрированную силу.",
    },
    cusp: {
      name: "Куспид",
      definition:
        "Граница, на которой начинается один дом или знак и заканчивается другой.",
    },
    descendant: {
      name: "Десцендент",
      definition:
        "Точка напротив Асцендента, связанная с партнёрством и тем, что мы ищем в других.",
    },
    dignity: {
      name: "Достоинство",
      definition:
        "Мера того, насколько свободно планета проявляется в знаке: управление, экзальтация, изгнание или падение.",
    },
    ephemeris: {
      name: "Эфемериды",
      definition:
        "Таблица положений планет во времени. Sidera использует Swiss Ephemeris с точностью до угловой минуты.",
    },
    element: {
      name: "Стихия",
      definition:
        "Четыре группы зодиака — огонь, земля, воздух и вода; к каждой относятся три знака.",
    },
    house: {
      name: "Дом",
      definition:
        "Один из двенадцати секторов карты, управляющий сферой жизни, например домом, карьерой или партнёрством.",
    },
    lot_of_fortune: {
      name: "Парс Фортуны",
      definition:
        "Расчётная точка, связанная с телом, удачей и материальной жизнью и выведенная из Солнца, Луны и Асцендента.",
    },
    midheaven: {
      name: "Середина неба",
      definition:
        "Высшая точка карты (MC), связанная с карьерой, репутацией и общественной ролью.",
    },
    modality: {
      name: "Модальность",
      definition:
        "Три качества — кардинальное, фиксированное и мутабельное — описывают, как знак начинает, поддерживает или адаптируется.",
    },
    natal_chart: {
      name: "Натальная карта",
      definition:
        "Карта неба для точного времени и места рождения. Также называется картой рождения.",
    },
    opposition: {
      name: "Оппозиция",
      definition:
        "Две планеты на расстоянии 180°, создающие напряжение, которое ищет равновесия и осознания через другого.",
    },
    orb: {
      name: "Орбис",
      definition:
        "Допустимый диапазон градусов, в котором аспект считается действующим.",
    },
    retrograde: {
      name: "Ретроградность",
      definition:
        "В астрономии — видимое с Земли обратное движение планеты. В астрологии оно трактуется как период пересмотра и исправления.",
    },
    sextile: {
      name: "Секстиль",
      definition:
        "Гармоничный аспект 60°, дающий возможности и лёгкое сотрудничество двух планет.",
    },
    square: {
      name: "Квадратура",
      definition:
        "Аспект 90° трения и испытаний, побуждающий расти через усилие.",
    },
    synastry: {
      name: "Синастрия",
      definition: "Сопоставление двух карт для понимания динамики отношений.",
    },
    transit: {
      name: "Транзит",
      definition:
        "Движение планет в настоящем и аспекты, которые они образуют с вашей натальной картой.",
    },
    trine: {
      name: "Тригон",
      definition:
        "Плавный аспект 120°, указывающий на естественную лёгкость и талант между двумя планетами.",
    },
    zodiac: {
      name: "Зодиак",
      definition:
        "Пояс из двенадцати знаков, по которому в течение года видимо движутся Солнце, Луна и планеты.",
    },
  },
  it: {
    ascendant: {
      name: "Ascendente",
      definition:
        "Il segno zodiacale che sorgeva a est alla nascita. Imposta le case e colora il modo in cui incontri il mondo. È detto anche segno ascendente.",
    },
    aspect: {
      name: "Aspetto",
      definition:
        "Relazione angolare fra due pianeti — congiunzione, sestile, quadratura, trigono od opposizione — che descrive come interagiscono le loro energie.",
    },
    conjunction: {
      name: "Congiunzione",
      definition:
        "Due pianeti entro l’orbe accettato di 0°, che fondono la loro natura in un’unica forza concentrata.",
    },
    cusp: {
      name: "Cuspide",
      definition:
        "La linea di confine dove una casa o un segno inizia e un altro termina.",
    },
    descendant: {
      name: "Discendente",
      definition:
        "Il punto opposto all’Ascendente, legato alle relazioni e a ciò che cerchiamo negli altri.",
    },
    dignity: {
      name: "Dignità",
      definition:
        "Misura di quanto un pianeta opera agevolmente in un segno: domicilio, esaltazione, esilio o caduta.",
    },
    ephemeris: {
      name: "Effemeridi",
      definition:
        "Tabella delle posizioni planetarie nel tempo. Sidera usa Swiss Ephemeris, preciso al minuto d’arco.",
    },
    element: {
      name: "Elemento",
      definition:
        "I quattro gruppi dello zodiaco — fuoco, terra, aria e acqua — ciascuno condiviso da tre segni.",
    },
    house: {
      name: "Casa",
      definition:
        "Una delle dodici divisioni del tema, ciascuna collegata a un ambito della vita come casa, carriera o relazioni.",
    },
    lot_of_fortune: {
      name: "Parte di Fortuna",
      definition:
        "Punto calcolato legato al corpo, alla fortuna e alla vita materiale, derivato da Sole, Luna e Ascendente.",
    },
    midheaven: {
      name: "Medio Cielo",
      definition:
        "Il punto più alto del tema (MC), associato a carriera, reputazione e ruolo pubblico.",
    },
    modality: {
      name: "Modalità",
      definition:
        "I tre modi — cardinale, fisso e mutevole — descrivono come ogni segno avvia, sostiene o si adatta.",
    },
    natal_chart: {
      name: "Tema natale",
      definition:
        "La mappa del cielo nel momento e nel luogo esatti della nascita. È detta anche carta natale.",
    },
    opposition: {
      name: "Opposizione",
      definition:
        "Due pianeti distanti 180°, creando una tensione che cerca equilibrio e consapevolezza attraverso l’altro.",
    },
    orb: {
      name: "Orbita di tolleranza",
      definition:
        "Il margine di gradi entro cui un aspetto è considerato attivo.",
    },
    retrograde: {
      name: "Retrogrado",
      definition:
        "In astronomia, il moto apparente all’indietro di un pianeta visto dalla Terra. In astrologia, è interpretato come un periodo di revisione.",
    },
    sextile: {
      name: "Sestile",
      definition:
        "Aspetto armonico di 60° che offre opportunità e facile cooperazione tra due pianeti.",
    },
    square: {
      name: "Quadratura",
      definition:
        "Aspetto di 90° di attrito e sfida che stimola la crescita attraverso l’impegno.",
    },
    synastry: {
      name: "Sinastria",
      definition:
        "Il confronto fra due temi per comprendere le dinamiche di una relazione.",
    },
    transit: {
      name: "Transito",
      definition:
        "Il movimento dei pianeti attuali e gli aspetti che formano con il tuo tema natale.",
    },
    trine: {
      name: "Trigono",
      definition:
        "Aspetto fluido di 120° di naturale facilità e talento tra due pianeti.",
    },
    zodiac: {
      name: "Zodiaco",
      definition:
        "La fascia di dodici segni attraverso cui Sole, Luna e pianeti sembrano muoversi durante l’anno.",
    },
  },
  de: {
    ascendant: {
      name: "Aszendent",
      definition:
        "Das Tierkreiszeichen, das bei deiner Geburt am östlichen Horizont aufstieg. Es legt die Häuser fest und prägt, wie du der Welt begegnest. Auch Aufgangszeichen genannt.",
    },
    aspect: {
      name: "Aspekt",
      definition:
        "Eine Winkelbeziehung zwischen zwei Planeten — Konjunktion, Sextil, Quadrat, Trigon oder Opposition — die ihr Zusammenspiel beschreibt.",
    },
    conjunction: {
      name: "Konjunktion",
      definition:
        "Zwei Planeten innerhalb des zulässigen Orbis um 0°, deren Wesensarten sich zu einer gebündelten Kraft verbinden.",
    },
    cusp: {
      name: "Häuserspitze",
      definition:
        "Die Grenzlinie, an der ein Haus oder Zeichen beginnt und ein anderes endet.",
    },
    descendant: {
      name: "Deszendent",
      definition:
        "Der dem Aszendenten gegenüberliegende Punkt, verbunden mit Partnerschaft und dem, was wir in anderen suchen.",
    },
    dignity: {
      name: "Würde",
      definition:
        "Ein Maß dafür, wie stimmig ein Planet in einem Zeichen wirkt: Domizil, Erhöhung, Exil oder Fall.",
    },
    ephemeris: {
      name: "Ephemeriden",
      definition:
        "Eine Tabelle planetarer Positionen im Zeitverlauf. Sidera nutzt Swiss Ephemeris mit Genauigkeit bis zur Bogenminute.",
    },
    element: {
      name: "Element",
      definition:
        "Die vier Gruppen des Tierkreises — Feuer, Erde, Luft und Wasser — denen jeweils drei Zeichen angehören.",
    },
    house: {
      name: "Haus",
      definition:
        "Einer von zwölf Bereichen des Horoskops, die Lebensgebiete wie Zuhause, Beruf oder Partnerschaft beschreiben.",
    },
    lot_of_fortune: {
      name: "Glückspunkt",
      definition:
        "Ein aus Sonne, Mond und Aszendent berechneter Punkt mit Bezug zu Körper, Glück und materiellem Leben.",
    },
    midheaven: {
      name: "Medium Coeli",
      definition:
        "Der höchste Punkt des Horoskops (MC), verbunden mit Beruf, Ansehen und öffentlicher Rolle.",
    },
    modality: {
      name: "Modalität",
      definition:
        "Die drei Qualitäten — kardinal, fix und veränderlich — beschreiben, wie ein Zeichen beginnt, erhält oder sich anpasst.",
    },
    natal_chart: {
      name: "Geburtshoroskop",
      definition:
        "Die Himmelskarte für den genauen Zeitpunkt und Ort deiner Geburt. Auch Radix genannt.",
    },
    opposition: {
      name: "Opposition",
      definition:
        "Zwei Planeten im Abstand von 180°, deren Spannung durch das Gegenüber Ausgleich und Bewusstheit sucht.",
    },
    orb: {
      name: "Orbis",
      definition:
        "Der zulässige Gradbereich, innerhalb dessen ein Aspekt als wirksam gilt.",
    },
    retrograde: {
      name: "Rückläufigkeit",
      definition:
        "Astronomisch die von der Erde aus sichtbare scheinbare Rückwärtsbewegung eines Planeten. Astrologisch wird sie als Phase der Prüfung und Revision gedeutet.",
    },
    sextile: {
      name: "Sextil",
      definition:
        "Ein harmonischer 60°-Aspekt, der Chancen und leichte Zusammenarbeit zwischen zwei Planeten bietet.",
    },
    square: {
      name: "Quadrat",
      definition:
        "Ein spannungsreicher 90°-Aspekt, der durch Anstrengung Wachstum antreibt.",
    },
    synastry: {
      name: "Synastrie",
      definition:
        "Der Vergleich zweier Horoskope, um die Dynamik einer Beziehung zu verstehen.",
    },
    transit: {
      name: "Transit",
      definition:
        "Die Bewegung der gegenwärtigen Planeten und ihre Aspekte zu deinem Geburtshoroskop.",
    },
    trine: {
      name: "Trigon",
      definition:
        "Ein fließender 120°-Aspekt natürlicher Leichtigkeit und Begabung zwischen zwei Planeten.",
    },
    zodiac: {
      name: "Tierkreis",
      definition:
        "Das Band aus zwölf Zeichen, durch das sich Sonne, Mond und Planeten im Jahreslauf scheinbar bewegen.",
    },
  },
} satisfies Record<SupportedLocale, Record<GlossaryTermKey, GlossaryTermCopy>>;

export const getGlossaryDefinitionsCopy = (
  locale: SupportedLocale,
): Record<GlossaryTermKey, GlossaryTermCopy> =>
  copyByLocale[locale] ?? copyByLocale.en;
