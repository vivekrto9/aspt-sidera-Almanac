export type TransitPlanet = {
  name: string;
  glyph: string;
  longitude: number;
  label: string;
  color: string;
  ring: "inner" | "outer";
  position: string;
  retrograde?: boolean;
};

export type TransitAspect = {
  transitIndex: number;
  natalIndex: number;
  aspectLabel: string;
  aspectGlyph: string;
  title: string;
  status: string;
  interpretation: string;
  positionLabel: string;
  orb: string;
  phase: "applying" | "separating";
  phaseLabel: string;
  tone: "conjunction" | "harmonious" | "challenging";
  color: string;
};

export type PreparedTransitResult = {
  slug: string;
  chartName: string;
  birthSummary: string;
  birthPlace: string;
  dateIso: string;
  chartRotation: number;
  houseCusps: number[];
  planets: TransitPlanet[];
  aspects: TransitAspect[];
  totalAspectCount: number;
};
