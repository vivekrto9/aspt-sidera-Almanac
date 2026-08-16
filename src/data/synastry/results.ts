export type SynastryAspectTone =
  | "conjunction"
  | "harmonious"
  | "challenging";

export type SynastryPersonResult = {
  name: string;
  summary: string;
};

export type SynastryCategoryResult = {
  label: string;
  value: number;
};

export type SynastryPlanetResult = {
  name: string;
  glyph: string;
  longitude: number;
  label: string;
  color: string;
  ring: "inner" | "outer";
};

export type SynastryAspectResult = {
  firstIndex: number;
  secondIndex: number;
  aspectLabel: string;
  aspectGlyph: string;
  orb: string;
  tone: SynastryAspectTone;
  color: string;
  weight?: number;
  dashed?: boolean;
  title: string;
  subtitle: string;
  interpretation: string;
  type: string;
  theme: string;
};

export type SynastryNarrativeResult = {
  tag: string;
  title: string;
  body: string;
  tone: "terracotta" | "forest" | "parchment";
};

export type PreparedSynastryResult = {
  relationshipContext: string;
  personA: SynastryPersonResult;
  personB: SynastryPersonResult;
  score: number;
  verdict: string;
  categories: SynastryCategoryResult[];
  chartRotation?: number;
  planets: SynastryPlanetResult[];
  aspects: SynastryAspectResult[];
  narratives: SynastryNarrativeResult[];
};
