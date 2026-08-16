import type { SupportedLocale } from "../localization-contract.ts";

export type SkyBodyId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type SkyBodyPosition = {
  id: SkyBodyId;
  planetName: string;
  planetGlyph: string;
  signName: string;
  signGlyph: string;
  degreeText: string;
  longitude: number;
  element: string;
  elementId: "fire" | "earth" | "air" | "water";
  speedText: string;
  motionText?: string;
};

export type SkyStripPosition = SkyBodyPosition;

type OrbitalElements = {
  ascendingNode: number;
  inclination: number;
  perihelion: number;
  semiMajorAxis: number;
  eccentricity: number;
  meanAnomaly: number;
};

const radians = Math.PI / 180;
const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;
const signedAngleDifference = (later: number, earlier: number) =>
  ((later - earlier + 540) % 360) - 180;

const solveEccentricAnomaly = (meanAnomaly: number, eccentricity: number) => {
  const meanRadians = normalizeDegrees(meanAnomaly) * radians;
  let eccentricAnomaly =
    meanRadians + eccentricity * Math.sin(meanRadians) * (1 + eccentricity * Math.cos(meanRadians));

  for (let iteration = 0; iteration < 8; iteration += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly -
        eccentricity * Math.sin(eccentricAnomaly) -
        meanRadians) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }

  return eccentricAnomaly;
};

const heliocentricVector = (elements: OrbitalElements) => {
  const eccentricAnomaly = solveEccentricAnomaly(
    elements.meanAnomaly,
    elements.eccentricity,
  );
  const orbitalX =
    elements.semiMajorAxis *
    (Math.cos(eccentricAnomaly) - elements.eccentricity);
  const orbitalY =
    elements.semiMajorAxis *
    Math.sqrt(1 - elements.eccentricity ** 2) *
    Math.sin(eccentricAnomaly);
  const trueAnomaly = Math.atan2(orbitalY, orbitalX);
  const radius = Math.hypot(orbitalX, orbitalY);
  const node = elements.ascendingNode * radians;
  const inclination = elements.inclination * radians;
  const longitude = trueAnomaly + elements.perihelion * radians;

  return {
    x:
      radius *
      (Math.cos(node) * Math.cos(longitude) -
        Math.sin(node) * Math.sin(longitude) * Math.cos(inclination)),
    y:
      radius *
      (Math.sin(node) * Math.cos(longitude) +
        Math.cos(node) * Math.sin(longitude) * Math.cos(inclination)),
    z: radius * Math.sin(longitude) * Math.sin(inclination),
  };
};

const daysSinceEpoch = (date: Date) =>
  date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_543.5;

const sunElements = (day: number): OrbitalElements => ({
  ascendingNode: 0,
  inclination: 0,
  perihelion: 282.9404 + 4.70935e-5 * day,
  semiMajorAxis: 1,
  eccentricity: 0.016709 - 1.151e-9 * day,
  meanAnomaly: 356.047 + 0.9856002585 * day,
});

const planetElements = {
  mercury: (day: number): OrbitalElements => ({
    ascendingNode: 48.3313 + 3.24587e-5 * day,
    inclination: 7.0047 + 5e-8 * day,
    perihelion: 29.1241 + 1.01444e-5 * day,
    semiMajorAxis: 0.387098,
    eccentricity: 0.205635 + 5.59e-10 * day,
    meanAnomaly: 168.6562 + 4.0923344368 * day,
  }),
  venus: (day: number): OrbitalElements => ({
    ascendingNode: 76.6799 + 2.4659e-5 * day,
    inclination: 3.3946 + 2.75e-8 * day,
    perihelion: 54.891 + 1.38374e-5 * day,
    semiMajorAxis: 0.72333,
    eccentricity: 0.006773 - 1.302e-9 * day,
    meanAnomaly: 48.0052 + 1.6021302244 * day,
  }),
  mars: (day: number): OrbitalElements => ({
    ascendingNode: 49.5574 + 2.11081e-5 * day,
    inclination: 1.8497 - 1.78e-8 * day,
    perihelion: 286.5016 + 2.92961e-5 * day,
    semiMajorAxis: 1.523688,
    eccentricity: 0.093405 + 2.516e-9 * day,
    meanAnomaly: 18.6021 + 0.5240207766 * day,
  }),
  jupiter: (day: number): OrbitalElements => ({
    ascendingNode: 100.4542 + 2.76854e-5 * day,
    inclination: 1.303 - 1.557e-7 * day,
    perihelion: 273.8777 + 1.64505e-5 * day,
    semiMajorAxis: 5.20256,
    eccentricity: 0.048498 + 4.469e-9 * day,
    meanAnomaly: 19.895 + 0.0830853001 * day,
  }),
  saturn: (day: number): OrbitalElements => ({
    ascendingNode: 113.6634 + 2.3898e-5 * day,
    inclination: 2.4886 - 1.081e-7 * day,
    perihelion: 339.3939 + 2.97661e-5 * day,
    semiMajorAxis: 9.55475,
    eccentricity: 0.055546 - 9.499e-9 * day,
    meanAnomaly: 316.967 + 0.0334442282 * day,
  }),
  uranus: (day: number): OrbitalElements => ({
    ascendingNode: 74.0005 + 1.3978e-5 * day,
    inclination: 0.7733 + 1.9e-8 * day,
    perihelion: 96.6612 + 3.0565e-5 * day,
    semiMajorAxis: 19.18171 - 1.55e-8 * day,
    eccentricity: 0.047318 + 7.45e-9 * day,
    meanAnomaly: 142.5905 + 0.011725806 * day,
  }),
  neptune: (day: number): OrbitalElements => ({
    ascendingNode: 131.7806 + 3.0173e-5 * day,
    inclination: 1.77 - 2.55e-7 * day,
    perihelion: 272.8461 - 6.027e-6 * day,
    semiMajorAxis: 30.05826 + 3.313e-8 * day,
    eccentricity: 0.008606 + 2.15e-9 * day,
    meanAnomaly: 260.2471 + 0.005995147 * day,
  }),
  pluto: (day: number): OrbitalElements => ({
    ascendingNode: 110.30347,
    inclination: 17.14175,
    perihelion: 113.76329,
    semiMajorAxis: 39.48168677,
    eccentricity: 0.24880766,
    meanAnomaly: 14.53 + 0.0039757 * day,
  }),
} as const;

const moonElements = (day: number): OrbitalElements => ({
  ascendingNode: 125.1228 - 0.0529538083 * day,
  inclination: 5.1454,
  perihelion: 318.0634 + 0.1643573223 * day,
  semiMajorAxis: 60.2666,
  eccentricity: 0.0549,
  meanAnomaly: 115.3654 + 13.0649929509 * day,
});

const geocentricLongitudes = (date: Date) => {
  const day = daysSinceEpoch(date);
  const sun = heliocentricVector(sunElements(day));
  const longitudeForPlanet = (
    factory: (dayValue: number) => OrbitalElements,
  ) => {
    const planet = heliocentricVector(factory(day));
    return normalizeDegrees(
      Math.atan2(planet.y + sun.y, planet.x + sun.x) / radians,
    );
  };
  const moon = heliocentricVector(moonElements(day));

  return {
    sun: normalizeDegrees(Math.atan2(sun.y, sun.x) / radians),
    moon: normalizeDegrees(Math.atan2(moon.y, moon.x) / radians),
    mercury: longitudeForPlanet(planetElements.mercury),
    venus: longitudeForPlanet(planetElements.venus),
    mars: longitudeForPlanet(planetElements.mars),
    jupiter: longitudeForPlanet(planetElements.jupiter),
    saturn: longitudeForPlanet(planetElements.saturn),
    uranus: longitudeForPlanet(planetElements.uranus),
    neptune: longitudeForPlanet(planetElements.neptune),
    pluto: longitudeForPlanet(planetElements.pluto),
  };
};

const localizedNames = {
  en: {
    planets: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"],
    signs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    elements: ["Fire", "Earth", "Air", "Water"],
    speeds: ["fast", "direct", "slow", "retrograde"],
  },
  es: {
    planets: ["Sol", "Luna", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno", "Plutón"],
    signs: ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"],
    elements: ["Fuego", "Tierra", "Aire", "Agua"],
    speeds: ["rápido", "directo", "lento", "retrógrado"],
  },
  fr: {
    planets: ["Soleil", "Lune", "Mercure", "Vénus", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune", "Pluton"],
    signs: ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"],
    elements: ["Feu", "Terre", "Air", "Eau"],
    speeds: ["rapide", "direct", "lent", "rétrograde"],
  },
  pt: {
    planets: ["Sol", "Lua", "Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão"],
    signs: ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"],
    elements: ["Fogo", "Terra", "Ar", "Água"],
    speeds: ["rápido", "direto", "lento", "retrógrado"],
  },
  ru: {
    planets: ["Солнце", "Луна", "Меркурий", "Венера", "Марс", "Юпитер", "Сатурн", "Уран", "Нептун", "Плутон"],
    signs: ["Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"],
    elements: ["Огонь", "Земля", "Воздух", "Вода"],
    speeds: ["быстро", "прямо", "медленно", "ретроградно"],
  },
  it: {
    planets: ["Sole", "Luna", "Mercurio", "Venere", "Marte", "Giove", "Saturno", "Urano", "Nettuno", "Plutone"],
    signs: ["Ariete", "Toro", "Gemelli", "Cancro", "Leone", "Vergine", "Bilancia", "Scorpione", "Sagittario", "Capricorno", "Acquario", "Pesci"],
    elements: ["Fuoco", "Terra", "Aria", "Acqua"],
    speeds: ["veloce", "diretto", "lento", "retrogrado"],
  },
  de: {
    planets: ["Sonne", "Mond", "Merkur", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptun", "Pluto"],
    signs: ["Widder", "Stier", "Zwillinge", "Krebs", "Löwe", "Jungfrau", "Waage", "Skorpion", "Schütze", "Steinbock", "Wassermann", "Fische"],
    elements: ["Feuer", "Erde", "Luft", "Wasser"],
    speeds: ["schnell", "direkt", "langsam", "rückläufig"],
  },
} satisfies Record<
  SupportedLocale,
  { planets: string[]; signs: string[]; elements: string[]; speeds: string[] }
>;

const bodies = [
  { id: "sun", glyph: "☉" },
  { id: "moon", glyph: "☽" },
  { id: "mercury", glyph: "☿" },
  { id: "venus", glyph: "♀" },
  { id: "mars", glyph: "♂" },
  { id: "jupiter", glyph: "♃" },
  { id: "saturn", glyph: "♄" },
  { id: "uranus", glyph: "♅" },
  { id: "neptune", glyph: "♆" },
  { id: "pluto", glyph: "♇" },
] as const;

const signGlyphs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const elementIds = ["fire", "earth", "air", "water"] as const;

export const getSkyBodyPositions = (
  date: Date,
  locale: SupportedLocale,
): SkyBodyPosition[] => {
  const names = localizedNames[locale] ?? localizedNames.en;
  const longitudes = geocentricLongitudes(date);
  const earlier = new Date(date.getTime() - 43_200_000);
  const later = new Date(date.getTime() + 43_200_000);
  const earlierLongitudes = geocentricLongitudes(earlier);
  const laterLongitudes = geocentricLongitudes(later);

  return bodies.map((body, index) => {
    const longitude = longitudes[body.id];
    const signIndex = Math.floor(longitude / 30);
    const degree = Math.floor(longitude % 30);
    const signedSpeed = signedAngleDifference(
      laterLongitudes[body.id],
      earlierLongitudes[body.id],
    );
    const retrograde =
      body.id !== "sun" &&
      body.id !== "moon" &&
      signedSpeed < 0;
    const speed = Math.abs(signedSpeed);
    const speedIndex = retrograde ? 3 : speed > 5 ? 0 : speed > 0.4 ? 1 : 2;
    const elementIndex = signIndex % 4;

    return {
      id: body.id,
      planetName: names.planets[index],
      planetGlyph: body.glyph,
      signName: names.signs[signIndex],
      signGlyph: signGlyphs[signIndex],
      degreeText: `${degree}°`,
      longitude,
      element: names.elements[elementIndex],
      elementId: elementIds[elementIndex],
      speedText: names.speeds[speedIndex],
      motionText: retrograde ? "Rx" : undefined,
    };
  });
};

export const getSkyStripPositions = (
  date: Date,
  locale: SupportedLocale,
): SkyStripPosition[] => getSkyBodyPositions(date, locale).slice(0, 6);
