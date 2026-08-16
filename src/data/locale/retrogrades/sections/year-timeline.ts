import type { SupportedLocale } from "../../../localization-contract.ts";

export type RetrogradesYearTimelineCopy = {
  headingPrefix: string;
  tipOneTitle: string;
  tipOneDescription: string;
  tipTwoTitle: string;
  tipTwoDescription: string;
  tipThreeTitle: string;
  tipThreeDescription: string;
};

const copyByLocale = {
  en: {
    headingPrefix: "Retrogrades across",
    tipOneTitle: "Review, don't launch",
    tipOneDescription:
      "Retrogrades favour re-doing over starting. Edit the draft, revisit the plan, reconnect — rather than signing something brand new.",
    tipTwoTitle: "Mind the shadow",
    tipTwoDescription:
      "The shadow period brackets each retrograde — the same degrees, crossed three times. Themes often surface before the station and settle after.",
    tipThreeTitle: "It's not a curse",
    tipThreeDescription:
      "Retrograde is a rhythm, not a punishment. Used well, it's the built-in pause that keeps you from building forward on shaky ground.",
  },
  es: {
    headingPrefix: "Retrógrados a lo largo de",
    tipOneTitle: "Revisa, no lances",
    tipOneDescription:
      "Los retrógrados favorecen rehacer antes que empezar. Edita el borrador, revisa el plan y retoma el contacto en vez de firmar algo nuevo.",
    tipTwoTitle: "Atiende a la sombra",
    tipTwoDescription:
      "El período de sombra rodea cada retrógrado: los mismos grados se cruzan tres veces. Los temas suelen surgir antes y asentarse después.",
    tipThreeTitle: "No es una maldición",
    tipThreeDescription:
      "El movimiento retrógrado es un ritmo, no un castigo. Bien usado, es la pausa que evita construir sobre terreno inestable.",
  },
  fr: {
    headingPrefix: "Les rétrogrades au fil de",
    tipOneTitle: "Révisez, ne lancez pas",
    tipOneDescription:
      "Les rétrogrades favorisent la reprise plutôt que le départ. Corrigez, revoyez le plan et renouez au lieu de signer du neuf.",
    tipTwoTitle: "Surveillez la zone d’ombre",
    tipTwoDescription:
      "La période d’ombre encadre chaque rétrograde : les mêmes degrés sont franchis trois fois. Les thèmes émergent avant et se posent après.",
    tipThreeTitle: "Ce n’est pas une malédiction",
    tipThreeDescription:
      "La rétrogradation est un rythme, pas une punition. Bien utilisée, cette pause évite d’avancer sur des bases fragiles.",
  },
  pt: {
    headingPrefix: "Retrógrados ao longo de",
    tipOneTitle: "Reveja, não lance",
    tipOneDescription:
      "Os retrógrados favorecem refazer em vez de começar. Edite o rascunho, reveja o plano e retome contactos antes de assinar algo novo.",
    tipTwoTitle: "Atenção à sombra",
    tipTwoDescription:
      "O período de sombra enquadra cada retrógrado: os mesmos graus são cruzados três vezes. Os temas surgem antes e assentam depois.",
    tipThreeTitle: "Não é uma maldição",
    tipThreeDescription:
      "O retrógrado é um ritmo, não um castigo. Bem usado, é a pausa que impede avançar sobre terreno instável.",
  },
  ru: {
    headingPrefix: "Ретроградные периоды в",
    tipOneTitle: "Пересматривайте, а не запускайте",
    tipOneDescription:
      "Ретроградность благоприятствует доработке. Исправьте черновик, вернитесь к плану и восстановите связь вместо нового старта.",
    tipTwoTitle: "Учитывайте период тени",
    tipTwoDescription:
      "Тень обрамляет ретроградность: одни градусы проходятся трижды. Темы возникают до разворота и успокаиваются после.",
    tipThreeTitle: "Это не проклятие",
    tipThreeDescription:
      "Ретроградность — ритм, а не наказание. Это встроенная пауза, которая не даёт двигаться вперёд по шаткой основе.",
  },
  it: {
    headingPrefix: "I retrogradi nel",
    tipOneTitle: "Rivedi, non lanciare",
    tipOneDescription:
      "I retrogradi favoriscono il rifare. Correggi la bozza, rivedi il piano e riallaccia i rapporti invece di firmare qualcosa di nuovo.",
    tipTwoTitle: "Considera l’ombra",
    tipTwoDescription:
      "Il periodo d’ombra racchiude ogni retrogrado: gli stessi gradi vengono attraversati tre volte. I temi emergono prima e si assestano dopo.",
    tipThreeTitle: "Non è una maledizione",
    tipThreeDescription:
      "Il retrogrado è un ritmo, non una punizione. Ben usato, è la pausa che evita di costruire su fondamenta instabili.",
  },
  de: {
    headingPrefix: "Rückläufigkeiten im Jahr",
    tipOneTitle: "Überarbeiten statt starten",
    tipOneDescription:
      "Rückläufigkeiten begünstigen Überarbeitung. Bearbeite den Entwurf, prüfe den Plan und knüpfe neu an, statt etwas Neues zu unterzeichnen.",
    tipTwoTitle: "Beachte die Schattenphase",
    tipTwoDescription:
      "Die Schattenphase umrahmt jede Rückläufigkeit: dieselben Grade werden dreimal durchlaufen. Themen tauchen vorher auf und setzen sich danach.",
    tipThreeTitle: "Es ist kein Fluch",
    tipThreeDescription:
      "Rückläufigkeit ist ein Rhythmus, keine Strafe. Gut genutzt schützt die Pause davor, auf unsicherem Grund weiterzubauen.",
  },
} satisfies Record<SupportedLocale, RetrogradesYearTimelineCopy>;

export const getRetrogradesYearTimelineCopy = (
  locale: SupportedLocale,
): RetrogradesYearTimelineCopy => copyByLocale[locale] ?? copyByLocale.en;
