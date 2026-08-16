export type RetrogradePlanetId =
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type RetrogradeShadowKind = "to" | "from" | "none";

export type PreparedRetrogradeStatus = {
  id: RetrogradePlanetId;
  glyph: string;
  position: string;
  period: string;
  shadowKind: RetrogradeShadowKind;
  shadowDate?: string;
};

export type RetrogradeTimelineSegment = {
  left: number;
  width: number;
  label: string;
};

export type PreparedRetrogradeTimelineRow = {
  id: RetrogradePlanetId;
  name: string;
  glyph: string;
  color: string;
  segments: RetrogradeTimelineSegment[];
};
