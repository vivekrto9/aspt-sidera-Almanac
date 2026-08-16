import type { SkyBodyPosition } from "./sky-strip-positions.ts";

export type SkyWheelAspect = {
  from: number;
  to: number;
  color: string;
  weight: number;
  dashed?: boolean;
  active: boolean;
};

export type SkyAspectKind =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export type SkyAspectDetail = {
  from: number;
  to: number;
  kind: SkyAspectKind;
  glyph: string;
  tone: "conjunction" | "harmonious" | "challenging";
  orb: number;
  applying: boolean;
};

const aspectDefinitions = [
  { id: "conjunction", angle: 0, color: "#b07a3c", dashed: false, glyph: "☌", tone: "conjunction" },
  { id: "sextile", angle: 60, color: "#2f4a41", dashed: true, glyph: "⚹", tone: "harmonious" },
  { id: "square", angle: 90, color: "#9c4f38", dashed: false, glyph: "□", tone: "challenging" },
  { id: "trine", angle: 120, color: "#2f4a41", dashed: false, glyph: "△", tone: "harmonious" },
  { id: "opposition", angle: 180, color: "#9c4f38", dashed: false, glyph: "☍", tone: "challenging" },
] as const;

const separation = (left: number, right: number) => {
  const distance = Math.abs(left - right);
  return Math.min(distance, 360 - distance);
};

const findAspect = (left: number, right: number) => {
  const distance = separation(left, right);
  return aspectDefinitions
    .map((definition) => ({
      definition,
      orb: Math.abs(distance - definition.angle),
    }))
    .filter(({ definition, orb }) =>
      orb <= (definition.angle === 60 ? 3.5 : 5),
    )
    .sort((leftMatch, rightMatch) => leftMatch.orb - rightMatch.orb)[0];
};

export const getSkyWheelAspects = (
  positions: SkyBodyPosition[],
  selectedIndex = 0,
): SkyWheelAspect[] => {
  const matches: Array<SkyWheelAspect & { orb: number }> = [];

  positions.forEach((from, fromIndex) => {
    positions.slice(fromIndex + 1).forEach((to, offset) => {
      const toIndex = fromIndex + offset + 1;
      const match = findAspect(from.longitude, to.longitude);
      if (!match) return;

      const active = fromIndex === selectedIndex || toIndex === selectedIndex;
      matches.push({
        from: fromIndex,
        to: toIndex,
        color: match.definition.color,
        weight: active ? 2.2 : 1.2,
        dashed: match.definition.dashed,
        active,
        orb: match.orb,
      });
    });
  });

  const visible = matches
    .sort((left, right) => left.orb - right.orb)
    .slice(0, 7)
    .map(({ orb: _orb, ...aspect }) => aspect);

  while (visible.length < 7) {
    visible.push({
      from: 0,
      to: 0,
      color: "transparent",
      weight: 0,
      active: false,
    });
  }

  return visible;
};

export const getSkyAspectDetails = (
  positions: SkyBodyPosition[],
  nextPositions: SkyBodyPosition[],
): SkyAspectDetail[] => {
  const matches: SkyAspectDetail[] = [];

  positions.forEach((from, fromIndex) => {
    positions.slice(fromIndex + 1).forEach((to, offset) => {
      const toIndex = fromIndex + offset + 1;
      const match = findAspect(from.longitude, to.longitude);
      if (!match) return;
      const nextFrom = nextPositions[fromIndex];
      const nextTo = nextPositions[toIndex];
      const nextMatch =
        nextFrom && nextTo
          ? Math.abs(
              separation(nextFrom.longitude, nextTo.longitude) -
                match.definition.angle,
            )
          : match.orb;

      matches.push({
        from: fromIndex,
        to: toIndex,
        kind: match.definition.id,
        glyph: match.definition.glyph,
        tone: match.definition.tone,
        orb: match.orb,
        applying: nextMatch < match.orb,
      });
    });
  });

  return matches.sort((left, right) => left.orb - right.orb).slice(0, 7);
};
