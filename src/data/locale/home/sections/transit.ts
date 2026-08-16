import type { SupportedLocale } from "../../../localization-contract.ts";

type HomeTransitAspectId =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export type HomeTransitItem = {
  id: string;
  date: string;
  glyph: string;
  aspect: string;
  note: string;
};

export type HomeTransitCopy = {
  eyebrow: string;
  titleAccent: string;
  titleRest: string;
  description: string;
  ctaLabel: string;
  items: HomeTransitItem[];
};

type HomeTransitPresentation = {
  planetNames: Record<string, string>;
  aspects: Record<HomeTransitAspectId, { label: string; glyph: string; guidance: string }>;
};

const presentationByLocale: Record<SupportedLocale, HomeTransitPresentation> = {
  en: {
    planetNames: {
      sun: "Sun",
      moon: "Moon",
      mercury: "Mercury",
      venus: "Venus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
      uranus: "Uranus",
      neptune: "Neptune",
      pluto: "Pluto",
    },
    aspects: {
      conjunction: {
        label: "conjunct",
        glyph: "☌",
        guidance:
          "Two influences concentrate in one place. Notice what is becoming impossible to ignore.",
      },
      sextile: {
        label: "sextile",
        glyph: "⚹",
        guidance:
          "A supportive opening is forming. Small, intentional action can move things forward.",
      },
      square: {
        label: "square",
        glyph: "□",
        guidance:
          "Friction asks for an adjustment. Work with the pressure instead of forcing an outcome.",
      },
      trine: {
        label: "trine",
        glyph: "△",
        guidance:
          "Energy flows more easily here. Use the momentum while it is available.",
      },
      opposition: {
        label: "opposite",
        glyph: "☍",
        guidance:
          "Two needs pull in different directions. Look for balance before choosing a side.",
      },
    },
  },
  es: {
    planetNames: {
      sun: "Sol",
      moon: "Luna",
      mercury: "Mercurio",
      venus: "Venus",
      mars: "Marte",
      jupiter: "Júpiter",
      saturn: "Saturno",
      uranus: "Urano",
      neptune: "Neptuno",
      pluto: "Plutón",
    },
    aspects: {
      conjunction: {
        label: "en conjunción con",
        glyph: "☌",
        guidance:
          "Dos influencias se concentran. Observa lo que ya no puedes ignorar.",
      },
      sextile: {
        label: "en sextil con",
        glyph: "⚹",
        guidance:
          "Se abre una oportunidad favorable. Una acción pequeña e intencional puede impulsarte.",
      },
      square: {
        label: "en cuadratura con",
        glyph: "□",
        guidance:
          "La fricción pide un ajuste. Trabaja con la presión sin forzar el resultado.",
      },
      trine: {
        label: "en trígono con",
        glyph: "△",
        guidance:
          "La energía fluye con más facilidad. Aprovecha el impulso disponible.",
      },
      opposition: {
        label: "en oposición a",
        glyph: "☍",
        guidance:
          "Dos necesidades tiran en direcciones distintas. Busca equilibrio antes de decidir.",
      },
    },
  },
  fr: {
    planetNames: {
      sun: "Soleil",
      moon: "Lune",
      mercury: "Mercure",
      venus: "Vénus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturne",
      uranus: "Uranus",
      neptune: "Neptune",
      pluto: "Pluton",
    },
    aspects: {
      conjunction: {
        label: "en conjonction avec",
        glyph: "☌",
        guidance:
          "Deux influences se concentrent. Observez ce qu’il devient impossible d’ignorer.",
      },
      sextile: {
        label: "en sextile avec",
        glyph: "⚹",
        guidance:
          "Une ouverture favorable se dessine. Un petit geste intentionnel peut faire avancer les choses.",
      },
      square: {
        label: "en carré avec",
        glyph: "□",
        guidance:
          "La friction demande un ajustement. Composez avec la pression sans forcer le résultat.",
      },
      trine: {
        label: "en trigone avec",
        glyph: "△",
        guidance:
          "L’énergie circule plus facilement. Profitez de cet élan tant qu’il est disponible.",
      },
      opposition: {
        label: "en opposition à",
        glyph: "☍",
        guidance:
          "Deux besoins tirent dans des directions opposées. Cherchez l’équilibre avant de choisir.",
      },
    },
  },
  pt: {
    planetNames: {
      sun: "Sol",
      moon: "Lua",
      mercury: "Mercúrio",
      venus: "Vênus",
      mars: "Marte",
      jupiter: "Júpiter",
      saturn: "Saturno",
      uranus: "Urano",
      neptune: "Netuno",
      pluto: "Plutão",
    },
    aspects: {
      conjunction: {
        label: "em conjunção com",
        glyph: "☌",
        guidance:
          "Duas influências se concentram. Observe o que já não pode ser ignorado.",
      },
      sextile: {
        label: "em sextil com",
        glyph: "⚹",
        guidance:
          "Uma abertura favorável está se formando. Uma pequena ação intencional pode ajudar.",
      },
      square: {
        label: "em quadratura com",
        glyph: "□",
        guidance:
          "A fricção pede um ajuste. Trabalhe com a pressão sem forçar o resultado.",
      },
      trine: {
        label: "em trígono com",
        glyph: "△",
        guidance:
          "A energia flui com mais facilidade. Aproveite o impulso enquanto ele está disponível.",
      },
      opposition: {
        label: "em oposição a",
        glyph: "☍",
        guidance:
          "Duas necessidades puxam em direções diferentes. Busque equilíbrio antes de escolher.",
      },
    },
  },
  ru: {
    planetNames: {
      sun: "Солнце",
      moon: "Луна",
      mercury: "Меркурий",
      venus: "Венера",
      mars: "Марс",
      jupiter: "Юпитер",
      saturn: "Сатурн",
      uranus: "Уран",
      neptune: "Нептун",
      pluto: "Плутон",
    },
    aspects: {
      conjunction: {
        label: "в соединении с",
        glyph: "☌",
        guidance:
          "Два влияния сходятся в одной точке. Заметьте то, что уже невозможно игнорировать.",
      },
      sextile: {
        label: "в секстиле с",
        glyph: "⚹",
        guidance:
          "Открывается благоприятная возможность. Небольшой осознанный шаг поможет продвинуться.",
      },
      square: {
        label: "в квадрате с",
        glyph: "□",
        guidance:
          "Напряжение требует корректировки. Работайте с ним, не форсируя результат.",
      },
      trine: {
        label: "в тригоне с",
        glyph: "△",
        guidance: "Энергия течёт легче. Используйте импульс, пока он доступен.",
      },
      opposition: {
        label: "в оппозиции к",
        glyph: "☍",
        guidance:
          "Две потребности тянут в разные стороны. Сначала найдите равновесие.",
      },
    },
  },
  it: {
    planetNames: {
      sun: "Sole",
      moon: "Luna",
      mercury: "Mercurio",
      venus: "Venere",
      mars: "Marte",
      jupiter: "Giove",
      saturn: "Saturno",
      uranus: "Urano",
      neptune: "Nettuno",
      pluto: "Plutone",
    },
    aspects: {
      conjunction: {
        label: "in congiunzione con",
        glyph: "☌",
        guidance:
          "Due influenze si concentrano. Nota ciò che non può più essere ignorato.",
      },
      sextile: {
        label: "in sestile con",
        glyph: "⚹",
        guidance:
          "Si apre un’opportunità favorevole. Una piccola azione intenzionale può aiutare.",
      },
      square: {
        label: "in quadratura con",
        glyph: "□",
        guidance:
          "L’attrito richiede un aggiustamento. Lavora con la pressione senza forzare il risultato.",
      },
      trine: {
        label: "in trigono con",
        glyph: "△",
        guidance:
          "L’energia scorre più facilmente. Usa lo slancio finché è disponibile.",
      },
      opposition: {
        label: "in opposizione a",
        glyph: "☍",
        guidance:
          "Due bisogni tirano in direzioni diverse. Cerca equilibrio prima di scegliere.",
      },
    },
  },
  de: {
    planetNames: {
      sun: "Sonne",
      moon: "Mond",
      mercury: "Merkur",
      venus: "Venus",
      mars: "Mars",
      jupiter: "Jupiter",
      saturn: "Saturn",
      uranus: "Uranus",
      neptune: "Neptun",
      pluto: "Pluto",
    },
    aspects: {
      conjunction: {
        label: "in Konjunktion mit",
        glyph: "☌",
        guidance:
          "Zwei Einflüsse bündeln sich. Beachte, was sich nicht länger übersehen lässt.",
      },
      sextile: {
        label: "im Sextil mit",
        glyph: "⚹",
        guidance:
          "Eine hilfreiche Öffnung entsteht. Ein kleiner bewusster Schritt kann etwas bewegen.",
      },
      square: {
        label: "im Quadrat mit",
        glyph: "□",
        guidance:
          "Reibung verlangt eine Anpassung. Nutze den Druck, ohne ein Ergebnis zu erzwingen.",
      },
      trine: {
        label: "im Trigon mit",
        glyph: "△",
        guidance:
          "Die Energie fließt leichter. Nutze den Schwung, solange er da ist.",
      },
      opposition: {
        label: "in Opposition zu",
        glyph: "☍",
        guidance:
          "Zwei Bedürfnisse ziehen in verschiedene Richtungen. Suche zuerst nach Balance.",
      },
    },
  },
};

export const getHomeTransitPresentation = (locale: SupportedLocale) =>
  presentationByLocale[locale] ?? presentationByLocale.en;

const copyByLocale: Record<SupportedLocale, HomeTransitCopy> = {
  en: {
    eyebrow: "Transits",
    titleAccent: "Transits",
    titleRest: "in motion.",
    description:
      "See the major aspects forming over the next few days, with clear timing and plain-language guidance.",
    ctaLabel: "Open transit chart",
    items: [
      {
        id: "moon-jupiter",
        date: "Jul 1",
        glyph: "△",
        aspect: "Moon △ Jupiter",
        note: "A generous, easy-going mood — good for reaching out and asking for what you want.",
      },
      {
        id: "sun-mercury",
        date: "Jul 3",
        glyph: "☌",
        aspect: "Sun ☌ Mercury",
        note: "Clear thinking meets identity. Speak the plan you have quietly been forming.",
      },
      {
        id: "venus-saturn",
        date: "Jul 6",
        glyph: "□",
        aspect: "Venus □ Saturn",
        note: "Affection feels weighed and measured. Patience beats pressure right now.",
      },
      {
        id: "mars-uranus",
        date: "Jul 9",
        glyph: "△",
        aspect: "Mars △ Uranus",
        note: "Sudden energy and useful breakthroughs. Act on the impulse that genuinely helps.",
      },
    ],
  },
  es: {
    eyebrow: "Tránsitos",
    titleAccent: "Tránsitos",
    titleRest: "en movimiento.",
    description:
      "Descubre los aspectos principales de los próximos días, con tiempos claros y una guía sencilla.",
    ctaLabel: "Abrir carta de tránsitos",
    items: [
      {
        id: "moon-jupiter",
        date: "1 jul",
        glyph: "△",
        aspect: "Luna △ Júpiter",
        note: "Un ánimo generoso y relajado: buen momento para acercarte y pedir lo que deseas.",
      },
      {
        id: "sun-mercury",
        date: "3 jul",
        glyph: "☌",
        aspect: "Sol ☌ Mercurio",
        note: "El pensamiento claro se une a la identidad. Expresa el plan que has estado formando.",
      },
      {
        id: "venus-saturn",
        date: "6 jul",
        glyph: "□",
        aspect: "Venus □ Saturno",
        note: "El afecto se siente medido. Ahora la paciencia funciona mejor que la presión.",
      },
      {
        id: "mars-uranus",
        date: "9 jul",
        glyph: "△",
        aspect: "Marte △ Urano",
        note: "Energía repentina y avances útiles. Sigue el impulso que de verdad ayuda.",
      },
    ],
  },
  fr: {
    eyebrow: "Transits",
    titleAccent: "Transits",
    titleRest: "en mouvement.",
    description:
      "Découvrez les aspects majeurs des prochains jours, avec un calendrier clair et des conseils simples.",
    ctaLabel: "Ouvrir la carte des transits",
    items: [
      {
        id: "moon-jupiter",
        date: "1 juil.",
        glyph: "△",
        aspect: "Lune △ Jupiter",
        note: "Une humeur généreuse et détendue, idéale pour tendre la main et exprimer vos souhaits.",
      },
      {
        id: "sun-mercury",
        date: "3 juil.",
        glyph: "☌",
        aspect: "Soleil ☌ Mercure",
        note: "La pensée claire rejoint l'identité. Exprimez le projet que vous mûrissez en silence.",
      },
      {
        id: "venus-saturn",
        date: "6 juil.",
        glyph: "□",
        aspect: "Vénus □ Saturne",
        note: "L'affection semble pesée et mesurée. La patience vaut mieux que la pression.",
      },
      {
        id: "mars-uranus",
        date: "9 juil.",
        glyph: "△",
        aspect: "Mars △ Uranus",
        note: "Énergie soudaine et avancées utiles. Suivez l'élan qui aide vraiment.",
      },
    ],
  },
  pt: {
    eyebrow: "Trânsitos",
    titleAccent: "Trânsitos",
    titleRest: "em movimento.",
    description:
      "Veja os principais aspectos dos próximos dias, com horários claros e orientação em linguagem simples.",
    ctaLabel: "Abrir mapa de trânsitos",
    items: [
      {
        id: "moon-jupiter",
        date: "1 jul",
        glyph: "△",
        aspect: "Lua △ Júpiter",
        note: "Um clima generoso e leve — bom para se aproximar e pedir o que você deseja.",
      },
      {
        id: "sun-mercury",
        date: "3 jul",
        glyph: "☌",
        aspect: "Sol ☌ Mercúrio",
        note: "O pensamento claro encontra a identidade. Expresse o plano que vinha formando.",
      },
      {
        id: "venus-saturn",
        date: "6 jul",
        glyph: "□",
        aspect: "Vênus □ Saturno",
        note: "O afeto parece pesado e medido. Agora, paciência é melhor que pressão.",
      },
      {
        id: "mars-uranus",
        date: "9 jul",
        glyph: "△",
        aspect: "Marte △ Urano",
        note: "Energia súbita e avanços úteis. Siga o impulso que realmente ajuda.",
      },
    ],
  },
  ru: {
    eyebrow: "Транзиты",
    titleAccent: "Транзиты",
    titleRest: "в движении.",
    description:
      "Посмотрите главные аспекты ближайших дней с понятным временем и простыми рекомендациями.",
    ctaLabel: "Открыть карту транзитов",
    items: [
      {
        id: "moon-jupiter",
        date: "1 июл.",
        glyph: "△",
        aspect: "Луна △ Юпитер",
        note: "Щедрое и лёгкое настроение — хорошее время общаться и просить о желаемом.",
      },
      {
        id: "sun-mercury",
        date: "3 июл.",
        glyph: "☌",
        aspect: "Солнце ☌ Меркурий",
        note: "Ясная мысль соединяется с личностью. Озвучьте план, который давно созревал.",
      },
      {
        id: "venus-saturn",
        date: "6 июл.",
        glyph: "□",
        aspect: "Венера □ Сатурн",
        note: "Чувства словно взвешивают. Сейчас терпение полезнее давления.",
      },
      {
        id: "mars-uranus",
        date: "9 июл.",
        glyph: "△",
        aspect: "Марс △ Уран",
        note: "Внезапная энергия и полезные прорывы. Следуйте импульсу, который действительно помогает.",
      },
    ],
  },
  it: {
    eyebrow: "Transiti",
    titleAccent: "Transiti",
    titleRest: "in movimento.",
    description:
      "Scopri gli aspetti principali dei prossimi giorni, con tempi chiari e indicazioni semplici.",
    ctaLabel: "Apri la carta dei transiti",
    items: [
      {
        id: "moon-jupiter",
        date: "1 lug",
        glyph: "△",
        aspect: "Luna △ Giove",
        note: "Un umore generoso e sereno: è un buon momento per avvicinarsi e chiedere ciò che desideri.",
      },
      {
        id: "sun-mercury",
        date: "3 lug",
        glyph: "☌",
        aspect: "Sole ☌ Mercurio",
        note: "Il pensiero chiaro incontra l'identità. Esprimi il piano che stavi formando.",
      },
      {
        id: "venus-saturn",
        date: "6 lug",
        glyph: "□",
        aspect: "Venere □ Saturno",
        note: "L'affetto sembra pesato e misurato. Ora la pazienza supera la pressione.",
      },
      {
        id: "mars-uranus",
        date: "9 lug",
        glyph: "△",
        aspect: "Marte △ Urano",
        note: "Energia improvvisa e svolte utili. Segui l'impulso che aiuta davvero.",
      },
    ],
  },
  de: {
    eyebrow: "Transite",
    titleAccent: "Transite",
    titleRest: "in Bewegung.",
    description:
      "Sieh die wichtigsten Aspekte der nächsten Tage mit klarer Zeitangabe und verständlicher Orientierung.",
    ctaLabel: "Transitkarte öffnen",
    items: [
      {
        id: "moon-jupiter",
        date: "1. Juli",
        glyph: "△",
        aspect: "Mond △ Jupiter",
        note: "Eine großzügige, leichte Stimmung — gut, um Kontakt aufzunehmen und Wünsche auszusprechen.",
      },
      {
        id: "sun-mercury",
        date: "3. Juli",
        glyph: "☌",
        aspect: "Sonne ☌ Merkur",
        note: "Klares Denken trifft Identität. Sprich den Plan aus, der still gereift ist.",
      },
      {
        id: "venus-saturn",
        date: "6. Juli",
        glyph: "□",
        aspect: "Venus □ Saturn",
        note: "Zuneigung wirkt abgewogen. Geduld ist jetzt hilfreicher als Druck.",
      },
      {
        id: "mars-uranus",
        date: "9. Juli",
        glyph: "△",
        aspect: "Mars △ Uranus",
        note: "Plötzliche Energie und nützliche Durchbrüche. Folge dem Impuls, der wirklich hilft.",
      },
    ],
  },
};

export const getHomeTransitCopy = (locale: SupportedLocale): HomeTransitCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
