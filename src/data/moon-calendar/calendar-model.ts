export type MoonCalendarPhase =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export type MoonCalendarRuntimeCopy = {
  locale: string;
  phaseNames: Record<MoonCalendarPhase, string>;
  zodiacNames: string[];
  zodiacGlyphs: string[];
  waxingLabel: string;
  waningLabel: string;
  monthSummaryTemplate: string;
  illuminationTemplate: string;
  lunarDayTemplate: string;
  moonInTemplate: string;
  ingressTemplate: string;
  rituals: string[];
  rests: string[];
};

export type MoonCalendarDay = {
  iso: string;
  day: number;
  weekday: string;
  dateLong: string;
  phase: MoonCalendarPhase;
  phaseName: string;
  illumination: number;
  direction: string;
  lunarDay: string;
  moonPath: string;
  zodiacName: string;
  zodiacGlyph: string;
  zodiacDegree: string;
  ingress: string;
  ritual: string;
  rest: string;
  isToday: boolean;
  exact?: boolean;
  events?: Array<{
    kind:
      | "new"
      | "first-quarter"
      | "full"
      | "last-quarter"
      | "sign-ingress"
      | "void-of-course"
      | "eclipse";
    moment: string;
    signIndex?: number;
  }>;
};

export type MoonCalendarProviderDay = {
  iso: string;
  phase: MoonCalendarPhase;
  illumination: number;
  waxing: boolean;
  ageDays: number;
  events?: MoonCalendarDay["events"];
};

const lunarCycleDays = 29.530588;
const lunarEpoch = Date.UTC(2000, 0, 6, 18, 14);
const dayMs = 86_400_000;
const phaseKeys: MoonCalendarPhase[] = [
  "new",
  "waxing-crescent",
  "first-quarter",
  "waxing-gibbous",
  "full",
  "waning-gibbous",
  "last-quarter",
  "waning-crescent",
];

const positiveModulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

export const toMoonCalendarIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const fillTemplate = (
  template: string,
  values: Record<string, string | number>,
) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );

export const moonCalendarPath = (
  illumination: number,
  waxing: boolean,
  center = 17,
  radius = 15,
) => {
  if (illumination <= 0.01) return "";
  if (illumination >= 0.99) {
    return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${
      center + radius
    } A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`;
  }

  const terminatorRadius = radius * Math.abs(2 * illumination - 1);
  const gibbous = illumination > 0.5;
  const limbSweep = waxing ? 1 : 0;
  const terminatorSweep = waxing ? (gibbous ? 1 : 0) : gibbous ? 0 : 1;

  return `M ${center} ${center - radius} A ${radius} ${radius} 0 0 ${limbSweep} ${center} ${
    center + radius
  } A ${terminatorRadius.toFixed(2)} ${radius} 0 0 ${terminatorSweep} ${center} ${
    center - radius
  } Z`;
};

export const getMoonCalendarDay = (
  date: Date,
  copy: MoonCalendarRuntimeCopy,
): MoonCalendarDay => {
  const utcNoon = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  const daysSinceEpoch = (utcNoon - lunarEpoch) / dayMs;
  const lunarAge = positiveModulo(daysSinceEpoch, lunarCycleDays);
  const illumination =
    (1 - Math.cos((2 * Math.PI * lunarAge) / lunarCycleDays)) / 2;
  const waxing = lunarAge < lunarCycleDays / 2;
  const phaseIndex =
    Math.floor((lunarAge / lunarCycleDays) * phaseKeys.length + 0.5) %
    phaseKeys.length;
  const phase = phaseKeys[phaseIndex];
  const zodiacProgress = positiveModulo(daysSinceEpoch / 2.35, 12);
  const zodiacIndex = Math.floor(zodiacProgress);
  const zodiacDegree = Math.floor((zodiacProgress - zodiacIndex) * 30);
  const locale = copy.locale;
  const isToday = toMoonCalendarIso(date) === toMoonCalendarIso(new Date());

  return {
    iso: toMoonCalendarIso(date),
    day: date.getDate(),
    weekday: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date),
    dateLong: new Intl.DateTimeFormat(locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date),
    phase,
    phaseName: copy.phaseNames[phase],
    illumination: Math.round(illumination * 100),
    direction: waxing ? copy.waxingLabel : copy.waningLabel,
    lunarDay: fillTemplate(copy.lunarDayTemplate, {
      day: (lunarAge + 1).toFixed(1),
    }),
    moonPath: moonCalendarPath(illumination, waxing),
    zodiacName: copy.zodiacNames[zodiacIndex],
    zodiacGlyph: copy.zodiacGlyphs[zodiacIndex],
    zodiacDegree: `${zodiacDegree}°`,
    ingress: fillTemplate(copy.ingressTemplate, {
      sign: copy.zodiacNames[(zodiacIndex + 1) % 12],
    }),
    ritual: copy.rituals[phaseIndex],
    rest: copy.rests[phaseIndex],
    isToday,
  };
};

export const mergeMoonCalendarProviderDay = (
  day: MoonCalendarDay,
  provider: MoonCalendarProviderDay,
  copy: MoonCalendarRuntimeCopy,
): MoonCalendarDay => {
  const phaseIndex = phaseKeys.indexOf(provider.phase);
  return {
    ...day,
    phase: provider.phase,
    phaseName: copy.phaseNames[provider.phase],
    illumination: Math.max(0, Math.min(100, Math.round(provider.illumination))),
    direction: provider.waxing ? copy.waxingLabel : copy.waningLabel,
    lunarDay: fillTemplate(copy.lunarDayTemplate, {
      day: provider.ageDays.toFixed(1),
    }),
    moonPath: moonCalendarPath(provider.illumination / 100, provider.waxing),
    ritual: copy.rituals[phaseIndex],
    rest: copy.rests[phaseIndex],
    exact: true,
    events: provider.events || [],
  };
};

export const getMoonCalendarMonth = (
  year: number,
  month: number,
  copy: MoonCalendarRuntimeCopy,
) => {
  const first = new Date(year, month, 1, 12);
  const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
  const leading = first.getDay();
  const cells: Array<MoonCalendarDay | null> = Array.from(
    { length: 42 },
    (_, index) => {
      const day = index - leading + 1;
      return day > 0 && day <= daysInMonth
        ? getMoonCalendarDay(new Date(year, month, day, 12), copy)
        : null;
    },
  );

  return {
    label: new Intl.DateTimeFormat(copy.locale, {
      month: "long",
      year: "numeric",
    }).format(first),
    summary: fillTemplate(copy.monthSummaryTemplate, { days: daysInMonth }),
    cells,
  };
};
