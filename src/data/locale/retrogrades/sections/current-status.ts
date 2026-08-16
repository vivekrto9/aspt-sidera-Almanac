import type { SupportedLocale } from "../../../localization-contract.ts";

export type RetrogradesCurrentStatusCopy = {
  sectionLabel: string;
  retrogradeNowLabel: string;
  shadowToLabel: string;
  shadowFromLabel: string;
  mercuryTitle: string;
  mercuryDescription: string;
  venusTitle: string;
  venusDescription: string;
  marsTitle: string;
  marsDescription: string;
  jupiterTitle: string;
  jupiterDescription: string;
  saturnTitle: string;
  saturnDescription: string;
  uranusTitle: string;
  uranusDescription: string;
  neptuneTitle: string;
  neptuneDescription: string;
  plutoTitle: string;
  plutoDescription: string;
};

const copyByLocale = {
  en: {
    sectionLabel: "Planets currently retrograde",
    retrogradeNowLabel: "Retrograde now",
    shadowToLabel: "Shadow to",
    shadowFromLabel: "Shadow from",
    mercuryTitle: "Mercury Rx",
    mercuryDescription:
      "Double-check plans, contracts and messages. Back up devices; confirm before you commit. Old conversations resurface.",
    venusTitle: "Venus Rx",
    venusDescription:
      "Review relationships, values and spending. Old attachments may return so you can see what still fits.",
    marsTitle: "Mars Rx",
    marsDescription:
      "Rework how you use drive, anger and initiative. Pausing now can reveal a more effective direction.",
    jupiterTitle: "Jupiter Rx",
    jupiterDescription:
      "Reconsider beliefs, growth and long-range plans. Inner development matters more than expansion for its own sake.",
    saturnTitle: "Saturn Rx",
    saturnDescription:
      "Long-term structures ask for review. Where have you built on sand? A slow, honest audit of commitments.",
    uranusTitle: "Uranus Rx",
    uranusDescription:
      "Change turns inward. Reassess freedom, disruption and the habits that keep genuine independence out of reach.",
    neptuneTitle: "Neptune Rx",
    neptuneDescription:
      "Ideals and illusions clarify. Creative and spiritual life turns reflective; discernment returns to a foggy area.",
    plutoTitle: "Pluto Rx",
    plutoDescription:
      "Power, control and deep change move under review. Notice what is ready to be released rather than forced.",
  },
  es: {
    sectionLabel: "Planetas actualmente retrógrados",
    retrogradeNowLabel: "Retrógrado ahora",
    shadowToLabel: "Sombra hasta",
    shadowFromLabel: "Sombra desde",
    mercuryTitle: "Mercurio Rx",
    mercuryDescription:
      "Revisa dos veces planes, contratos y mensajes. Haz copias de seguridad y confirma antes de comprometerte. Conversaciones antiguas reaparecen.",
    venusTitle: "Venus Rx",
    venusDescription:
      "Revisa relaciones, valores y gastos. Viejos vínculos pueden volver para mostrarte qué sigue encajando.",
    marsTitle: "Marte Rx",
    marsDescription:
      "Replantea cómo usas el impulso, la ira y la iniciativa. Una pausa puede revelar una dirección más eficaz.",
    jupiterTitle: "Júpiter Rx",
    jupiterDescription:
      "Reconsidera creencias, crecimiento y planes a largo plazo. El desarrollo interior importa más que expandirse sin propósito.",
    saturnTitle: "Saturno Rx",
    saturnDescription:
      "Las estructuras a largo plazo piden revisión. ¿Qué has construido sobre arena? Haz una auditoría lenta y honesta de tus compromisos.",
    uranusTitle: "Urano Rx",
    uranusDescription:
      "El cambio se vuelve interior. Revisa la libertad, la ruptura y los hábitos que limitan una independencia auténtica.",
    neptuneTitle: "Neptuno Rx",
    neptuneDescription:
      "Los ideales y las ilusiones se aclaran. La vida creativa y espiritual se vuelve reflexiva y regresa el discernimiento.",
    plutoTitle: "Plutón Rx",
    plutoDescription:
      "Poder, control y transformación profunda entran en revisión. Observa qué está listo para soltarse en vez de forzarlo.",
  },
  fr: {
    sectionLabel: "Planètes actuellement rétrogrades",
    retrogradeNowLabel: "Rétrograde maintenant",
    shadowToLabel: "Ombre jusqu’au",
    shadowFromLabel: "Ombre depuis",
    mercuryTitle: "Mercure Rx",
    mercuryDescription:
      "Revérifiez plans, contrats et messages. Sauvegardez vos appareils et confirmez avant de vous engager. D’anciennes conversations refont surface.",
    venusTitle: "Vénus Rx",
    venusDescription:
      "Réexaminez relations, valeurs et dépenses. D’anciens liens peuvent revenir pour révéler ce qui vous convient encore.",
    marsTitle: "Mars Rx",
    marsDescription:
      "Repensez votre usage de l’élan, de la colère et de l’initiative. Une pause peut révéler une direction plus efficace.",
    jupiterTitle: "Jupiter Rx",
    jupiterDescription:
      "Réévaluez croyances, croissance et projets à long terme. Le développement intérieur compte plus que l’expansion sans but.",
    saturnTitle: "Saturne Rx",
    saturnDescription:
      "Les structures à long terme demandent une révision. Où avez-vous bâti sur du sable ? Faites un audit lent et honnête de vos engagements.",
    uranusTitle: "Uranus Rx",
    uranusDescription:
      "Le changement se tourne vers l’intérieur. Réévaluez liberté, rupture et habitudes qui freinent une vraie indépendance.",
    neptuneTitle: "Neptune Rx",
    neptuneDescription:
      "Idéaux et illusions s’éclaircissent. La vie créative et spirituelle devient introspective, et le discernement revient.",
    plutoTitle: "Pluton Rx",
    plutoDescription:
      "Pouvoir, contrôle et transformation profonde sont à revoir. Voyez ce qui peut être libéré plutôt que forcé.",
  },
  pt: {
    sectionLabel: "Planetas atualmente retrógrados",
    retrogradeNowLabel: "Retrógrado agora",
    shadowToLabel: "Sombra até",
    shadowFromLabel: "Sombra desde",
    mercuryTitle: "Mercúrio Rx",
    mercuryDescription:
      "Reveja planos, contratos e mensagens. Faça cópias de segurança e confirme antes de se comprometer. Conversas antigas regressam.",
    venusTitle: "Vénus Rx",
    venusDescription:
      "Reveja relações, valores e gastos. Laços antigos podem regressar para mostrar o que ainda faz sentido.",
    marsTitle: "Marte Rx",
    marsDescription:
      "Repense como usa impulso, raiva e iniciativa. Uma pausa pode revelar uma direção mais eficaz.",
    jupiterTitle: "Júpiter Rx",
    jupiterDescription:
      "Reavalie crenças, crescimento e planos de longo prazo. O desenvolvimento interior importa mais do que expandir sem propósito.",
    saturnTitle: "Saturno Rx",
    saturnDescription:
      "Estruturas de longo prazo pedem revisão. Onde construiu sobre areia? Faça uma auditoria lenta e honesta dos seus compromissos.",
    uranusTitle: "Urano Rx",
    uranusDescription:
      "A mudança volta-se para dentro. Reavalie liberdade, rutura e hábitos que limitam uma independência genuína.",
    neptuneTitle: "Neptuno Rx",
    neptuneDescription:
      "Ideais e ilusões tornam-se mais claros. A vida criativa e espiritual fica reflexiva e o discernimento regressa.",
    plutoTitle: "Plutão Rx",
    plutoDescription:
      "Poder, controlo e transformação profunda entram em revisão. Observe o que pode ser libertado em vez de forçado.",
  },
  ru: {
    sectionLabel: "Планеты, находящиеся в ретроградном движении",
    retrogradeNowLabel: "Сейчас ретроградна",
    shadowToLabel: "Посттень до",
    shadowFromLabel: "Предтень с",
    mercuryTitle: "Меркурий Rx",
    mercuryDescription:
      "Перепроверьте планы, договоры и сообщения. Сделайте резервные копии и всё подтвердите до принятия решения. Старые разговоры возвращаются.",
    venusTitle: "Венера Rx",
    venusDescription:
      "Пересмотрите отношения, ценности и расходы. Старые привязанности могут вернуться, чтобы показать, что всё ещё вам подходит.",
    marsTitle: "Марс Rx",
    marsDescription:
      "Пересмотрите, как вы используете напор, гнев и инициативу. Пауза может открыть более эффективное направление.",
    jupiterTitle: "Юпитер Rx",
    jupiterDescription:
      "Переоцените убеждения, рост и долгосрочные планы. Внутреннее развитие сейчас важнее расширения ради расширения.",
    saturnTitle: "Сатурн Rx",
    saturnDescription:
      "Долгосрочные структуры требуют пересмотра. Что было построено на песке? Нужна медленная и честная проверка обязательств.",
    uranusTitle: "Уран Rx",
    uranusDescription:
      "Перемены обращаются внутрь. Переосмыслите свободу, потрясения и привычки, мешающие настоящей независимости.",
    neptuneTitle: "Нептун Rx",
    neptuneDescription:
      "Идеалы и иллюзии проясняются. Творческая и духовная жизнь становится созерцательной, возвращая различение.",
    plutoTitle: "Плутон Rx",
    plutoDescription:
      "Власть, контроль и глубокие перемены требуют пересмотра. Заметьте, что пора отпустить, а не принуждать.",
  },
  it: {
    sectionLabel: "Pianeti attualmente retrogradi",
    retrogradeNowLabel: "Retrogrado ora",
    shadowToLabel: "Ombra fino al",
    shadowFromLabel: "Ombra da",
    mercuryTitle: "Mercurio Rx",
    mercuryDescription:
      "Ricontrolla piani, contratti e messaggi. Esegui i backup e conferma prima di impegnarti. Vecchie conversazioni riemergono.",
    venusTitle: "Venere Rx",
    venusDescription:
      "Rivedi relazioni, valori e spese. Vecchi legami possono tornare per mostrarti cosa è ancora adatto a te.",
    marsTitle: "Marte Rx",
    marsDescription:
      "Ripensa a come usi slancio, rabbia e iniziativa. Una pausa può rivelare una direzione più efficace.",
    jupiterTitle: "Giove Rx",
    jupiterDescription:
      "Rivaluta convinzioni, crescita e piani a lungo termine. Lo sviluppo interiore conta più dell’espansione fine a se stessa.",
    saturnTitle: "Saturno Rx",
    saturnDescription:
      "Le strutture a lungo termine chiedono una revisione. Dove hai costruito sulla sabbia? Serve un controllo lento e onesto degli impegni.",
    uranusTitle: "Urano Rx",
    uranusDescription:
      "Il cambiamento si rivolge all’interno. Rivaluta libertà, rotture e abitudini che limitano un’indipendenza autentica.",
    neptuneTitle: "Nettuno Rx",
    neptuneDescription:
      "Ideali e illusioni si chiariscono. La vita creativa e spirituale diventa riflessiva e torna il discernimento.",
    plutoTitle: "Plutone Rx",
    plutoDescription:
      "Potere, controllo e trasformazione profonda vanno rivisti. Nota ciò che è pronto a essere lasciato andare.",
  },
  de: {
    sectionLabel: "Derzeit rückläufige Planeten",
    retrogradeNowLabel: "Jetzt rückläufig",
    shadowToLabel: "Nachschatten bis",
    shadowFromLabel: "Vorschatten seit",
    mercuryTitle: "Merkur Rx",
    mercuryDescription:
      "Prüfe Pläne, Verträge und Nachrichten doppelt. Sichere Geräte und bestätige alles vor einer Zusage. Alte Gespräche tauchen wieder auf.",
    venusTitle: "Venus Rx",
    venusDescription:
      "Überprüfe Beziehungen, Werte und Ausgaben. Alte Bindungen können zeigen, was noch zu dir passt.",
    marsTitle: "Mars Rx",
    marsDescription:
      "Überdenke den Umgang mit Antrieb, Ärger und Initiative. Eine Pause kann eine wirksamere Richtung zeigen.",
    jupiterTitle: "Jupiter Rx",
    jupiterDescription:
      "Überprüfe Überzeugungen, Wachstum und langfristige Pläne. Innere Entwicklung zählt mehr als Expansion um ihrer selbst willen.",
    saturnTitle: "Saturn Rx",
    saturnDescription:
      "Langfristige Strukturen wollen überprüft werden. Wo wurde auf Sand gebaut? Eine langsame, ehrliche Prüfung der Verpflichtungen hilft.",
    uranusTitle: "Uranus Rx",
    uranusDescription:
      "Veränderung richtet sich nach innen. Prüfe Freiheit, Umbruch und Gewohnheiten, die echte Unabhängigkeit verhindern.",
    neptuneTitle: "Neptun Rx",
    neptuneDescription:
      "Ideale und Illusionen klären sich. Das kreative und spirituelle Leben wird nachdenklicher und Urteilsvermögen kehrt zurück.",
    plutoTitle: "Pluto Rx",
    plutoDescription:
      "Macht, Kontrolle und tiefer Wandel werden überprüft. Erkenne, was losgelassen statt erzwungen werden kann.",
  },
} satisfies Record<SupportedLocale, RetrogradesCurrentStatusCopy>;

export const getRetrogradesCurrentStatusCopy = (
  locale: SupportedLocale,
): RetrogradesCurrentStatusCopy => copyByLocale[locale] ?? copyByLocale.en;
