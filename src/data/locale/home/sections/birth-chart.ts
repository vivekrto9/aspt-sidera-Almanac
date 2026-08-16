import type { SupportedLocale } from "../../../localization-contract.ts";

export type HomeBirthChartFeature = {
  title: string;
  body: string;
};

export type HomeBirthChartCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  formTitle: string;
  dateLabel: string;
  monthLabel: string;
  dayLabel: string;
  yearLabel: string;
  timeLabel: string;
  hourLabel: string;
  minuteLabel: string;
  periodLabel: string;
  unknownTimeLabel: string;
  locationLabel: string;
  locationPlaceholder: string;
  extendedSettingsLabel: string;
  houseSystemLabel: string;
  housePlacidus: string;
  houseWholeSign: string;
  houseKoch: string;
  houseEqual: string;
  showAspectsLabel: string;
  ctaLabel: string;
  wheelTitle: string;
  wheelDescription: string;
  locationStart: string;
  locationSearching: string;
  locationEmpty: string;
  locationUnavailable: string;
  locationSelected: string;
  features: readonly [HomeBirthChartFeature, HomeBirthChartFeature, HomeBirthChartFeature];
};

const en: HomeBirthChartCopy = {
  eyebrow: "Free Birth Chart",
  titleAccent: "Cast",
  titleRest: "your natal chart.",
  description:
    "Placidus, Whole Sign, Koch, Equal House and more. Click any planet to read its sign, house, dignities and aspects — without leaving the wheel.",
  formTitle: "Birth details",
  dateLabel: "Birth date",
  monthLabel: "Month",
  dayLabel: "Day",
  yearLabel: "Year",
  timeLabel: "Birth time",
  hourLabel: "Hour",
  minuteLabel: "Minute",
  periodLabel: "AM or PM",
  unknownTimeLabel: "I don’t know my birth time",
  locationLabel: "Birth location",
  locationPlaceholder: "Start typing a city name…",
  extendedSettingsLabel: "Show extended settings",
  houseSystemLabel: "House system",
  housePlacidus: "Placidus",
  houseWholeSign: "Whole Sign",
  houseKoch: "Koch",
  houseEqual: "Equal House",
  showAspectsLabel: "Show aspects on the chart",
  ctaLabel: "Create birth chart",
  wheelTitle: "Natal chart preview",
  wheelDescription:
    "A sample natal wheel showing zodiac signs, houses, planets, and aspect lines.",
  locationStart: "Start typing and choose a location from the suggestions.",
  locationSearching: "Searching locations…",
  locationEmpty: "No matching locations found. Try a nearby city.",
  locationUnavailable: "Location suggestions are temporarily unavailable.",
  locationSelected: "Coordinates and time zone located",
  features: [
    {
      title: "Made for all levels",
      body: "The wheel reads cleanly without any background. Aspect grids sit one click deeper.",
    },
    {
      title: "Swiss Ephemeris",
      body: "The same astronomical engine professional software relies on. Accurate to the arcminute.",
    },
    {
      title: "House systems & orbs",
      body: "Switch systems, tighten orbs, add asteroids. Defaults work; the controls are there.",
    },
  ],
};

const localized = {
  en,
  es: {
    ...en,
    eyebrow: "Carta natal gratuita",
    titleAccent: "Crea",
    titleRest: "tu carta natal.",
    description:
      "Placidus, Signo Entero, Koch, Casas Iguales y más. Selecciona cualquier planeta para leer su signo, casa, dignidades y aspectos sin salir de la rueda.",
    formTitle: "Datos de nacimiento",
    dateLabel: "Fecha de nacimiento",
    monthLabel: "Mes",
    dayLabel: "Día",
    yearLabel: "Año",
    timeLabel: "Hora de nacimiento",
    hourLabel: "Hora",
    minuteLabel: "Minuto",
    periodLabel: "a. m. o p. m.",
    unknownTimeLabel: "No conozco mi hora de nacimiento",
    locationLabel: "Lugar de nacimiento",
    locationPlaceholder: "Empieza a escribir una ciudad…",
    extendedSettingsLabel: "Mostrar ajustes avanzados",
    houseSystemLabel: "Sistema de casas",
    houseWholeSign: "Signo Entero",
    houseEqual: "Casas Iguales",
    showAspectsLabel: "Mostrar aspectos en la carta",
    ctaLabel: "Crear carta natal",
    wheelTitle: "Vista previa de la carta natal",
    wheelDescription:
      "Una carta natal de ejemplo con signos, casas, planetas y líneas de aspectos.",
    locationStart: "Empieza a escribir y elige una ubicación de las sugerencias.",
    locationSearching: "Buscando ubicaciones…",
    locationEmpty: "No se encontraron ubicaciones. Prueba con una ciudad cercana.",
    locationUnavailable: "Las sugerencias de ubicación no están disponibles temporalmente.",
    locationSelected: "Coordenadas y zona horaria encontradas",
    features: [
      {
        title: "Para todos los niveles",
        body: "La rueda se lee con claridad desde el inicio. Las cuadrículas de aspectos están a un clic.",
      },
      {
        title: "Swiss Ephemeris",
        body: "El mismo motor astronómico que usa el software profesional, preciso al minuto de arco.",
      },
      {
        title: "Casas y orbes",
        body: "Cambia sistemas, ajusta orbes o añade asteroides. Los valores iniciales funcionan.",
      },
    ],
  },
  fr: {
    ...en,
    eyebrow: "Thème natal gratuit",
    titleAccent: "Créez",
    titleRest: "votre thème natal.",
    description:
      "Placidus, Maisons entières, Koch, Maisons égales et plus. Sélectionnez une planète pour lire son signe, sa maison, ses dignités et ses aspects sans quitter la roue.",
    formTitle: "Informations de naissance",
    dateLabel: "Date de naissance",
    monthLabel: "Mois",
    dayLabel: "Jour",
    yearLabel: "Année",
    timeLabel: "Heure de naissance",
    hourLabel: "Heure",
    minuteLabel: "Minute",
    periodLabel: "AM ou PM",
    unknownTimeLabel: "Je ne connais pas mon heure de naissance",
    locationLabel: "Lieu de naissance",
    locationPlaceholder: "Commencez à saisir une ville…",
    extendedSettingsLabel: "Afficher les réglages avancés",
    houseSystemLabel: "Système de maisons",
    houseWholeSign: "Maisons entières",
    houseEqual: "Maisons égales",
    showAspectsLabel: "Afficher les aspects sur le thème",
    ctaLabel: "Créer le thème natal",
    wheelTitle: "Aperçu du thème natal",
    wheelDescription:
      "Un exemple de roue natale avec signes, maisons, planètes et lignes d’aspects.",
    locationStart: "Commencez à saisir puis choisissez un lieu dans les suggestions.",
    locationSearching: "Recherche de lieux…",
    locationEmpty: "Aucun lieu correspondant. Essayez une ville voisine.",
    locationUnavailable: "Les suggestions de lieux sont temporairement indisponibles.",
    locationSelected: "Coordonnées et fuseau horaire trouvés",
    features: [
      {
        title: "Pour tous les niveaux",
        body: "La roue reste claire dès l’ouverture. Les grilles d’aspects sont accessibles en un clic.",
      },
      {
        title: "Swiss Ephemeris",
        body: "Le même moteur astronomique que les logiciels professionnels, précis à la minute d’arc.",
      },
      {
        title: "Maisons et orbes",
        body: "Changez de système, resserrez les orbes ou ajoutez des astéroïdes. Les réglages par défaut suffisent.",
      },
    ],
  },
  pt: {
    ...en,
    eyebrow: "Mapa natal gratuito",
    titleAccent: "Crie",
    titleRest: "seu mapa natal.",
    description:
      "Placidus, Signos Inteiros, Koch, Casas Iguais e mais. Selecione qualquer planeta para ler signo, casa, dignidades e aspectos sem sair da roda.",
    formTitle: "Dados de nascimento",
    dateLabel: "Data de nascimento",
    monthLabel: "Mês",
    dayLabel: "Dia",
    yearLabel: "Ano",
    timeLabel: "Hora de nascimento",
    hourLabel: "Hora",
    minuteLabel: "Minuto",
    periodLabel: "AM ou PM",
    unknownTimeLabel: "Não sei minha hora de nascimento",
    locationLabel: "Local de nascimento",
    locationPlaceholder: "Comece a digitar uma cidade…",
    extendedSettingsLabel: "Mostrar configurações avançadas",
    houseSystemLabel: "Sistema de casas",
    houseWholeSign: "Signos Inteiros",
    houseEqual: "Casas Iguais",
    showAspectsLabel: "Mostrar aspectos no mapa",
    ctaLabel: "Criar mapa natal",
    wheelTitle: "Prévia do mapa natal",
    wheelDescription:
      "Um mapa natal de exemplo com signos, casas, planetas e linhas de aspectos.",
    locationStart: "Comece a digitar e escolha um local nas sugestões.",
    locationSearching: "Buscando locais…",
    locationEmpty: "Nenhum local encontrado. Tente uma cidade próxima.",
    locationUnavailable: "As sugestões de local estão temporariamente indisponíveis.",
    locationSelected: "Coordenadas e fuso horário encontrados",
    features: [
      {
        title: "Para todos os níveis",
        body: "A roda é clara desde o início. As grades de aspectos ficam a um clique.",
      },
      {
        title: "Swiss Ephemeris",
        body: "O mesmo motor astronômico usado por softwares profissionais, preciso ao minuto de arco.",
      },
      {
        title: "Casas e orbes",
        body: "Troque sistemas, ajuste orbes ou adicione asteroides. As configurações iniciais funcionam.",
      },
    ],
  },
  ru: {
    ...en,
    eyebrow: "Бесплатная натальная карта",
    titleAccent: "Постройте",
    titleRest: "свою натальную карту.",
    description:
      "Плацидус, Цельные знаки, Кох, Равные дома и другие системы. Выберите планету, чтобы увидеть её знак, дом, достоинства и аспекты, не покидая круга.",
    formTitle: "Данные рождения",
    dateLabel: "Дата рождения",
    monthLabel: "Месяц",
    dayLabel: "День",
    yearLabel: "Год",
    timeLabel: "Время рождения",
    hourLabel: "Час",
    minuteLabel: "Минута",
    periodLabel: "AM или PM",
    unknownTimeLabel: "Я не знаю время рождения",
    locationLabel: "Место рождения",
    locationPlaceholder: "Начните вводить название города…",
    extendedSettingsLabel: "Показать расширенные настройки",
    houseSystemLabel: "Система домов",
    houseWholeSign: "Цельные знаки",
    houseEqual: "Равные дома",
    showAspectsLabel: "Показывать аспекты на карте",
    ctaLabel: "Создать натальную карту",
    wheelTitle: "Предпросмотр натальной карты",
    wheelDescription:
      "Пример натального круга со знаками, домами, планетами и линиями аспектов.",
    locationStart: "Начните ввод и выберите место из предложенного списка.",
    locationSearching: "Поиск мест…",
    locationEmpty: "Подходящих мест не найдено. Попробуйте ближайший город.",
    locationUnavailable: "Подсказки местоположения временно недоступны.",
    locationSelected: "Координаты и часовой пояс найдены",
    features: [
      {
        title: "Для любого уровня",
        body: "Круг легко читать без подготовки. Таблица аспектов открывается одним нажатием.",
      },
      {
        title: "Swiss Ephemeris",
        body: "Тот же астрономический движок, что используют профессиональные программы, с точностью до угловой минуты.",
      },
      {
        title: "Дома и орбисы",
        body: "Меняйте системы, сужайте орбисы или добавляйте астероиды. Настройки по умолчанию уже готовы.",
      },
    ],
  },
  it: {
    ...en,
    eyebrow: "Tema natale gratuito",
    titleAccent: "Crea",
    titleRest: "il tuo tema natale.",
    description:
      "Placido, Segno Intero, Koch, Case Uguali e altro. Seleziona un pianeta per leggerne segno, casa, dignità e aspetti senza lasciare la ruota.",
    formTitle: "Dati di nascita",
    dateLabel: "Data di nascita",
    monthLabel: "Mese",
    dayLabel: "Giorno",
    yearLabel: "Anno",
    timeLabel: "Ora di nascita",
    hourLabel: "Ora",
    minuteLabel: "Minuto",
    periodLabel: "AM o PM",
    unknownTimeLabel: "Non conosco la mia ora di nascita",
    locationLabel: "Luogo di nascita",
    locationPlaceholder: "Inizia a digitare una città…",
    extendedSettingsLabel: "Mostra impostazioni avanzate",
    houseSystemLabel: "Sistema di case",
    houseWholeSign: "Segno Intero",
    houseEqual: "Case Uguali",
    showAspectsLabel: "Mostra gli aspetti nel tema",
    ctaLabel: "Crea il tema natale",
    wheelTitle: "Anteprima del tema natale",
    wheelDescription:
      "Un esempio di ruota natale con segni, case, pianeti e linee degli aspetti.",
    locationStart: "Inizia a digitare e scegli un luogo dai suggerimenti.",
    locationSearching: "Ricerca dei luoghi…",
    locationEmpty: "Nessun luogo trovato. Prova con una città vicina.",
    locationUnavailable: "I suggerimenti sui luoghi non sono temporaneamente disponibili.",
    locationSelected: "Coordinate e fuso orario trovati",
    features: [
      {
        title: "Per ogni livello",
        body: "La ruota è subito leggibile. Le griglie degli aspetti sono a un solo clic.",
      },
      {
        title: "Swiss Ephemeris",
        body: "Lo stesso motore astronomico usato dai software professionali, preciso al minuto d’arco.",
      },
      {
        title: "Case e orbite",
        body: "Cambia sistema, restringi le orbite o aggiungi asteroidi. Le impostazioni predefinite funzionano.",
      },
    ],
  },
  de: {
    ...en,
    eyebrow: "Kostenloses Geburtshoroskop",
    titleAccent: "Erstelle",
    titleRest: "dein Geburtshoroskop.",
    description:
      "Placidus, Ganzzeichen, Koch, Gleiche Häuser und mehr. Wähle einen Planeten, um Zeichen, Haus, Würden und Aspekte direkt im Rad zu lesen.",
    formTitle: "Geburtsdaten",
    dateLabel: "Geburtsdatum",
    monthLabel: "Monat",
    dayLabel: "Tag",
    yearLabel: "Jahr",
    timeLabel: "Geburtszeit",
    hourLabel: "Stunde",
    minuteLabel: "Minute",
    periodLabel: "AM oder PM",
    unknownTimeLabel: "Ich kenne meine Geburtszeit nicht",
    locationLabel: "Geburtsort",
    locationPlaceholder: "Beginne mit der Eingabe einer Stadt…",
    extendedSettingsLabel: "Erweiterte Einstellungen anzeigen",
    houseSystemLabel: "Häusersystem",
    houseWholeSign: "Ganzzeichen",
    houseEqual: "Gleiche Häuser",
    showAspectsLabel: "Aspekte im Horoskop anzeigen",
    ctaLabel: "Geburtshoroskop erstellen",
    wheelTitle: "Vorschau des Geburtshoroskops",
    wheelDescription:
      "Ein Beispielrad mit Zeichen, Häusern, Planeten und Aspektlinien.",
    locationStart: "Beginne zu tippen und wähle einen Ort aus den Vorschlägen.",
    locationSearching: "Orte werden gesucht…",
    locationEmpty: "Keine passenden Orte gefunden. Versuche eine nahe gelegene Stadt.",
    locationUnavailable: "Ortsvorschläge sind vorübergehend nicht verfügbar.",
    locationSelected: "Koordinaten und Zeitzone gefunden",
    features: [
      {
        title: "Für jedes Niveau",
        body: "Das Rad ist ohne Vorwissen lesbar. Aspektgitter liegen nur einen Klick tiefer.",
      },
      {
        title: "Swiss Ephemeris",
        body: "Dieselbe astronomische Grundlage wie in professioneller Software, genau auf die Bogenminute.",
      },
      {
        title: "Häuser und Orben",
        body: "Wechsle Systeme, verenge Orben oder ergänze Asteroiden. Die Voreinstellungen funktionieren sofort.",
      },
    ],
  },
} satisfies Record<SupportedLocale, HomeBirthChartCopy>;

export const getHomeBirthChartCopy = (
  locale: SupportedLocale,
): HomeBirthChartCopy => localized[locale] ?? localized.en;
