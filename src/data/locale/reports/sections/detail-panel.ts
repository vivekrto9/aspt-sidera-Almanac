import type { SupportedLocale } from "../../../localization-contract.ts";

export type ReportsDetailChapter = {
  title: string;
  description: string;
};

export type ReportsDetailReportCopy = {
  longDescription: string;
  chapters: [
    ReportsDetailChapter,
    ReportsDetailChapter,
    ReportsDetailChapter,
    ReportsDetailChapter,
    ReportsDetailChapter,
  ];
  sample: string;
};

export type ReportsDetailPanelCopy = {
  pdfLabel: string;
  deliveryLabel: string;
  buyLabel: string;
  purchaseNote: string;
  insideLabel: string;
  sampleLabel: string;
  reports: [
    ReportsDetailReportCopy,
    ReportsDetailReportCopy,
    ReportsDetailReportCopy,
    ReportsDetailReportCopy,
    ReportsDetailReportCopy,
    ReportsDetailReportCopy,
  ];
};

const english: ReportsDetailPanelCopy = {
  pdfLabel: "PDF",
  deliveryLabel: "delivered instantly",
  buyLabel: "Buy & generate",
  purchaseNote:
    "Uses your saved birth data. You can regenerate any time your data changes, free.",
  insideLabel: "What's inside",
  sampleLabel: "Sample passage",
  reports: [
    {
      longDescription:
        "The Natal Blueprint reads your chart the way an astrologer would across a long first sitting — starting with the three pillars of Sun, Moon and rising, then working outward through every planet, house and major aspect.",
      chapters: [
        {
          title: "The three pillars",
          description:
            "Sun, Moon and Ascendant — your core, your needs, your approach.",
        },
        {
          title: "The personal planets",
          description: "Mercury, Venus and Mars: how you think, love and act.",
        },
        {
          title: "The houses",
          description: "Which areas of life each planet lights up.",
        },
        {
          title: "Major aspects",
          description: "The conversations between your planets.",
        },
        {
          title: "Chart signature",
          description:
            "The overall shape, element and modality balance.",
        },
      ],
      sample:
        "With the Moon in Libra in your fourth house, home is where you go to restore balance — and you feel unsettled when the people around you are at odds. Peace at home is not a luxury for you; it is the ground everything else is built on.",
    },
    {
      longDescription:
        "The Year Ahead walks month by month through the transits that actually matter for you — not a generic calendar, but the specific contacts the moving sky makes to your own planets, with dates and guidance.",
      chapters: [
        {
          title: "The year at a glance",
          description:
            "The two or three storylines that define your twelve months.",
        },
        {
          title: "Month by month",
          description: "Key dates, aspects and what to do with them.",
        },
        {
          title: "Slow transits",
          description:
            "Saturn, Jupiter and the outer planets shaping the year.",
        },
        {
          title: "Best windows",
          description: "When to launch, when to rest, when to decide.",
        },
        {
          title: "Eclipses",
          description: "Where this year's eclipses land in your chart.",
        },
      ],
      sample:
        "From late March, Jupiter begins a long trine to your natal Sun — the most generous transit of your year. Doors that felt stuck ease open. This is the window to ask for more: the role, the raise, the bigger horizon.",
    },
    {
      longDescription:
        "A full synastry read of two charts side by side: the easy contacts that create instant familiarity, the frictions that keep the spark alive, and the long-term shape the two of you tend to build together.",
      chapters: [
        {
          title: "First impressions",
          description: "The contacts you each feel on day one.",
        },
        {
          title: "Love and desire",
          description: "Venus and Mars between the two charts.",
        },
        {
          title: "Communication",
          description: "Mercury links: how you talk and hear.",
        },
        {
          title: "The friction",
          description: "Squares and oppositions, and how to hold them.",
        },
        {
          title: "The long arc",
          description: "Saturn and outer-planet ties over time.",
        },
      ],
      sample:
        "Your Venus sits exactly on their Descendant — a classic signature of “knowing” someone the moment you meet. It lends the connection an easy, partnered feeling early on, though it can also make you idealise them before you truly know them.",
    },
    {
      longDescription:
        "Cast for the exact moment the Sun returns to its birth degree, the solar return chart sets the tone for your year. This report reads its rising sign, its angular planets, and how it overlays your natal chart.",
      chapters: [
        {
          title: "Rising sign of the year",
          description: "The lens you view the whole year through.",
        },
        {
          title: "Where the Sun falls",
          description: "The house that takes centre stage.",
        },
        {
          title: "Angular planets",
          description: "What gets emphasised and activated.",
        },
        {
          title: "Return vs natal",
          description: "How this year overlays who you are.",
        },
        {
          title: "Timing the peaks",
          description: "When the year's themes come due.",
        },
      ],
      sample:
        "Scorpio rises on your return this year, pulling the whole twelve months toward depth, honesty and reinvention. Expect at least one situation that asks you to stop managing the surface and deal with what is actually underneath.",
    },
    {
      longDescription:
        "A focused read on the part of the chart that speaks to work, calling and reputation: the Midheaven and its ruler, the tenth house, the second and sixth, and the aspects that shape your relationship to ambition.",
      chapters: [
        {
          title: "The Midheaven",
          description: "Your public direction and how you are seen.",
        },
        {
          title: "The tenth house",
          description: "Career field and the shape of success.",
        },
        {
          title: "Work and service",
          description: "The sixth house: how you like to work day to day.",
        },
        {
          title: "Earning",
          description: "The second house and your relationship to money.",
        },
        {
          title: "Timing",
          description: "Career-activating transits ahead.",
        },
      ],
      sample:
        "With Capricorn on the Midheaven and its ruler Saturn in the eleventh, your career tends to build slowly and then compound — and it advances most through networks and long alliances rather than sudden leaps.",
    },
    {
      longDescription:
        "Roughly every 29 years Saturn returns to its birth position, marking a threshold into a more authored adulthood. This report locates your Saturn, reads the house and sign it returns to, and times the passage.",
      chapters: [
        {
          title: "Where your Saturn sits",
          description: "The house and sign under review.",
        },
        {
          title: "What is maturing",
          description: "The area of life being rebuilt.",
        },
        {
          title: "The three passes",
          description: "How the return unfolds in stages.",
        },
        {
          title: "What tends to end",
          description: "Structures that no longer hold.",
        },
        {
          title: "On the other side",
          description: "Who you are meant to become.",
        },
      ],
      sample:
        "Your Saturn returns in the seventh house — the passage centres on partnership and commitment. Relationships that were built on convenience tend to be tested; the ones built on something real come out of it more defined.",
    },
  ],
};

const copyByLocale: Record<SupportedLocale, ReportsDetailPanelCopy> = {
  en: english,
  es: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "entrega inmediata",
    buyLabel: "Comprar y generar",
    purchaseNote:
      "Usa tus datos natales guardados. Puedes regenerarlo gratis cuando cambien.",
    insideLabel: "Qué incluye",
    sampleLabel: "Pasaje de muestra",
  },
  fr: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "livré immédiatement",
    buyLabel: "Acheter et générer",
    purchaseNote:
      "Utilise vos données natales enregistrées. Vous pouvez le régénérer gratuitement après toute modification.",
    insideLabel: "Ce qui est inclus",
    sampleLabel: "Extrait",
  },
  pt: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "entrega imediata",
    buyLabel: "Comprar e gerar",
    purchaseNote:
      "Usa seus dados natais salvos. Você pode gerar novamente, sem custo, quando eles mudarem.",
    insideLabel: "O que está incluído",
    sampleLabel: "Trecho de exemplo",
  },
  ru: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "мгновенная доставка",
    buyLabel: "Купить и создать",
    purchaseNote:
      "Использует сохранённые данные рождения. После их изменения отчёт можно создать заново бесплатно.",
    insideLabel: "Что внутри",
    sampleLabel: "Фрагмент отчёта",
  },
  it: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "consegna immediata",
    buyLabel: "Acquista e genera",
    purchaseNote:
      "Usa i dati natali salvati. Puoi rigenerarlo gratuitamente quando cambiano.",
    insideLabel: "Cosa contiene",
    sampleLabel: "Brano di esempio",
  },
  de: {
    ...english,
    pdfLabel: "PDF",
    deliveryLabel: "sofort verfügbar",
    buyLabel: "Kaufen und erstellen",
    purchaseNote:
      "Verwendet deine gespeicherten Geburtsdaten. Nach Änderungen kannst du den Bericht kostenlos neu erstellen.",
    insideLabel: "Das ist enthalten",
    sampleLabel: "Beispielpassage",
  },
};

export const getReportsDetailPanelCopy = (
  locale: SupportedLocale,
): ReportsDetailPanelCopy => copyByLocale[locale] ?? english;
