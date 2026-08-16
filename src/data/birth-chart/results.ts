export type BirthChartElement = "fire" | "earth" | "air" | "water";

export type BirthChartBigThreeItem = {
  role: "sun" | "moon" | "rising";
  glyph: string;
  sign: string;
  element: BirthChartElement;
};

export type BirthChartPlanetResult = {
  name: string;
  glyph: string;
  longitude: number;
  label: string;
  color: string;
  signName: string;
  signGlyph: string;
  degreeText: string;
  houseText: string;
  elementName: string;
  positionLabel: string;
  interpretation: string;
  retrograde?: boolean;
};

export type BirthChartAspectResult = {
  firstIndex: number;
  secondIndex: number;
  aspectLabel: string;
  aspectGlyph: string;
  orb: string;
  tone: "conjunction" | "harmonious" | "challenging";
  color: string;
  weight?: number;
  dashed?: boolean;
};

export type PreparedBirthChartResult = {
  chartName: string;
  birthSummary: string;
  birthPlace: string;
  houseSystem: string;
  unknownTime?: boolean;
  chartTitle: string;
  chartDescription: string;
  chartRotation?: number;
  houseCusps?: number[];
  bigThree: BirthChartBigThreeItem[];
  planets: BirthChartPlanetResult[];
  aspects: BirthChartAspectResult[];
};
