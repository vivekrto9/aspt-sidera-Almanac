export type SkyMoonPhase =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export type SkyMoonState = {
  phase: SkyMoonPhase;
  illumination: number;
  waxing: boolean;
  nextFull: Date;
  nextNew: Date;
};

const normalize = (angle: number) => ((angle % 360) + 360) % 360;
const synodicMotionPerDay = 12.19075;

const nextContact = (date: Date, elongation: number, target: number) => {
  let remaining = normalize(target - elongation);
  if (remaining < 0.25) remaining = 360;
  return new Date(date.getTime() + (remaining / synodicMotionPerDay) * 86_400_000);
};

export const getSkyMoonState = (
  date: Date,
  sunLongitude: number,
  moonLongitude: number,
): SkyMoonState => {
  const elongation = normalize(moonLongitude - sunLongitude);
  const illumination = (1 - Math.cos((elongation * Math.PI) / 180)) / 2;
  let phase: SkyMoonPhase;

  if (elongation < 22.5 || elongation >= 337.5) phase = "new";
  else if (elongation < 78.75) phase = "waxing-crescent";
  else if (elongation < 101.25) phase = "first-quarter";
  else if (elongation < 157.5) phase = "waxing-gibbous";
  else if (elongation < 202.5) phase = "full";
  else if (elongation < 258.75) phase = "waning-gibbous";
  else if (elongation < 281.25) phase = "last-quarter";
  else phase = "waning-crescent";

  return {
    phase,
    illumination,
    waxing: elongation < 180,
    nextFull: nextContact(date, elongation, 180),
    nextNew: nextContact(date, elongation, 0),
  };
};
