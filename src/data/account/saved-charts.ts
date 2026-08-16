import type { SupportedLocale } from "../localization-contract.ts";

export type SavedChartPlanet = {
  glyph: string;
  longitude: number;
  label: string;
  color: string;
};

export type SavedChartRecord = {
  id: string;
  title: string;
  detail: string;
  typeIndex: number;
  accent: string;
  rotation: number;
  planets: SavedChartPlanet[];
  href?: string;
};

type RuntimeBirthChartReading = {
  id: string;
  chart: {
    chartName: string;
    birthSummary: string;
    birthPlace: string;
    chartRotation?: number;
    planets: Array<{
      glyph: string;
      longitude: number;
      name: string;
      color: string;
    }>;
  };
};

export const prepareAccountSavedChartsFromRuntime = (
  readings: readonly RuntimeBirthChartReading[],
  locale: SupportedLocale,
): SavedChartRecord[] => readings.map((reading) => ({
  id: reading.id,
  title: reading.chart.chartName,
  detail: [reading.chart.birthSummary, reading.chart.birthPlace].filter(Boolean).join(" · "),
  typeIndex: 0,
  accent: "#9c4f38",
  rotation: reading.chart.chartRotation || 0,
  planets: reading.chart.planets.map((planet) => ({
    glyph: planet.glyph,
    longitude: planet.longitude,
    label: planet.name,
    color: planet.color,
  })),
  href: `/birth-chart/${encodeURIComponent(reading.id)}${locale === "en" ? "" : `?locale=${encodeURIComponent(locale)}`}`,
}));

const formatDate = (locale: SupportedLocale, date: Date) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);

export const prepareAccountSavedCharts = (
  locale: SupportedLocale,
): SavedChartRecord[] => {
  const charts: SavedChartRecord[] = [
    {
      id: "my-natal-chart",
      title: "My Natal Chart",
      detail: `${formatDate(locale, new Date("1994-08-14T00:00:00Z"))} · 4:20 PM · Chicago`,
      typeIndex: 0,
      accent: "#9c4f38",
      rotation: 12,
      planets: [
        { glyph: "☉", longitude: 72, label: "Sun", color: "#9c4f38" },
        { glyph: "☽", longitude: 208, label: "Moon", color: "#6c6254" },
        { glyph: "♀", longitude: 286, label: "Venus", color: "#8c5a6a" },
        { glyph: "♂", longitude: 326, label: "Mars", color: "#9c4f38" },
      ],
    },
    {
      id: "relocated-lisbon",
      title: "Relocated · Lisbon",
      detail: "Current residence · Lisbon, PT",
      typeIndex: 1,
      accent: "#b07a3c",
      rotation: 28,
      planets: [
        { glyph: "☉", longitude: 148, label: "Sun", color: "#b07a3c" },
        { glyph: "☽", longitude: 240, label: "Moon", color: "#2f4a41" },
        { glyph: "♃", longitude: 332, label: "Jupiter", color: "#b07a3c" },
      ],
    },
    {
      id: "moms-natal",
      title: "Mom's Natal",
      detail: `${formatDate(locale, new Date("1963-03-02T00:00:00Z"))} · 9:05 AM · Denver`,
      typeIndex: 2,
      accent: "#2f4a41",
      rotation: 44,
      planets: [
        { glyph: "☉", longitude: 252, label: "Sun", color: "#2f4a41" },
        { glyph: "☽", longitude: 170, label: "Moon", color: "#6c6254" },
        { glyph: "♀", longitude: 288, label: "Venus", color: "#8c5a6a" },
      ],
    },
    {
      id: "solar-return-2026",
      title: "2026 Solar Return",
      detail: `Returns ${formatDate(locale, new Date("2026-08-14T00:00:00Z"))} · Lisbon`,
      typeIndex: 3,
      accent: "#9c4f38",
      rotation: 6,
      planets: [
        { glyph: "☉", longitude: 72, label: "Sun", color: "#9c4f38" },
        { glyph: "♂", longitude: 162, label: "Mars", color: "#9c4f38" },
        { glyph: "♄", longitude: 252, label: "Saturn", color: "#6c6254" },
      ],
    },
  ];
  const additional = [
    [
      "progressed-chart",
      "Progressed Chart",
      "Current secondary progressions",
      0,
      18,
    ],
    ["lunar-return", "Lunar Return", "Current lunar cycle · Lisbon", 3, 34],
    ["partnership-chart", "Partnership Chart", "Composite · Devin R.", 2, 48],
    ["work-launch", "Work Launch", "Electional · Chicago", 1, 22],
    ["travel-chart", "Travel Chart", "Relocation · Kyoto, JP", 1, 40],
  ] as const;
  return charts.concat(
    additional.map(([id, title, detail, typeIndex, rotation]) => ({
      id,
      title,
      detail,
      typeIndex,
      rotation,
      accent:
        typeIndex === 1 ? "#b07a3c" : typeIndex === 2 ? "#2f4a41" : "#9c4f38",
      planets: [
        {
          glyph: "☉",
          longitude: 72 + rotation,
          label: "Sun",
          color: "#9c4f38",
        },
        {
          glyph: "☽",
          longitude: 180 + rotation,
          label: "Moon",
          color: "#6c6254",
        },
        {
          glyph: "♃",
          longitude: 286 + rotation,
          label: "Jupiter",
          color: "#b07a3c",
        },
      ],
    })),
  );
};
