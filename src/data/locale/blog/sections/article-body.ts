import type { SupportedLocale } from "../../../localization-contract.ts";

type ArticleBodyCopy = {
  authorBio: string;
  relatedTitle: string;
  articles: Record<string, string[]>;
};

const en: ArticleBodyCopy = {
  authorBio:
    "Staff astrologer at Sidera, writing on technique and chart craft.",
  relatedTitle: "Keep reading",
  articles: {
    "lot-fortune": [
      "If you have spent any time with your birth chart, you know the planets and the twelve signs. Fewer people meet the Lots — and the Lot of Fortune is the one worth knowing first.",
      "Fortune is not a planet at all. It is a calculated point: the same distance from your Ascendant as the Moon is from the Sun. In effect, it carries the Moon’s relationship to the Sun down to the horizon, marking a spot that the ancient astrologers tied to the body, livelihood and the flow of circumstance.",
      "Where fortune falls",
      "The house your Lot of Fortune occupies tends to describe where life’s tangible goods flow most easily to you — where things simply seem to work out. In the second house, through earning and resources; in the seventh, through partnership; in the tenth, through reputation and public life.",
      "Fortune shows not what you chase, but where the current already runs in your favour.",
      "This is why traditional astrologers watched Fortune closely for questions of health and prosperity. It is a barometer of ease — the part of the chart where you are, quietly, lucky.",
      "Finding it yourself",
      "Sidera calculates the Lot of Fortune automatically on every chart; you will see it marked on the wheel as a small circled cross. Note its sign, its house, and any planet sitting close to it. That planet colours how your fortune tends to arrive.",
    ],
    "aries-rising": [
      "Your rising sign is the edge of the chart that was climbing over the horizon at the moment you were born. It sets the whole chart in motion and colours how you meet the world. When that sign is Aries, you lead with fire.",
      "First through the door",
      "Aries rising tends to read as direct, quick and a little restless. You start things. You would rather move and correct course than wait for perfect conditions. People often describe a first meeting with you as energising — and occasionally as a lot, all at once.",
      "The Ascendant is not a mask. It is the doorway the rest of the chart walks through.",
      "Because Mars rules Aries, the placement of Mars in your chart matters enormously — it is the ruler of your entire ascendant, and its condition describes how your pioneering energy actually plays out.",
      "The growth edge",
      "The lesson of Aries rising is patience without losing nerve: keeping the initiative that makes you effective while leaving room for other people to catch up and contribute.",
    ],
    "morning-star": [
      "Venus and Mercury are never far from the Sun in the sky, and whether they rise just before it or set just after it turns out to matter. Traditional astrologers split each into a morning and an evening version — and the two feel genuinely different.",
      "The morning star",
      "As a morning star, Venus rises ahead of the Sun into a dark sky. This is the bolder, more forward Venus — quicker to want, quicker to act on affection, less inclined to wait to be chosen.",
      "The evening star",
      "As an evening star, Venus lingers after sunset. This Venus is more reflective and relational, drawn to harmony and to being met halfway. Neither is better; they simply court life in different tempos.",
      "Same planet, two temperaments — set by nothing more than which side of the Sun it sits on.",
      "You can find yours in seconds: check whether your Venus is at an earlier or later degree of the zodiac than your Sun. Earlier means morning star; later means evening star.",
    ],
    "saturn-return": [
      "Roughly every 29 and a half years, Saturn completes a full orbit and returns to the exact spot it held when you were born. The first return, in your late twenties, has a reputation — and mostly it is earned.",
      "What is actually happening",
      "Saturn is the planet of structure, time and consequence. When it comes home, it audits whatever it touches. The house it returns to tells you where the audit lands: partnership, career, home, belief.",
      "Saturn does not take away what is real. It removes what was only ever borrowed.",
      "It often feels like pressure because things built on convenience rather than conviction tend to give way. What survives comes out more defined, more yours.",
      "How to work with it",
      "Stop performing the version of your life that no longer fits, and commit to the parts that are actually true. Saturn rewards that honesty with something durable — a more authored, adult footing.",
    ],
    "twelve-houses": [
      "A birth chart has three moving parts: planets, signs and houses. Beginners meet the planets and signs first, and then stall on the houses. They need not be mysterious. Think of the houses as twelve rooms of a life.",
      "Angles first",
      "Four houses are load-bearing: the first (self), fourth (home), seventh (partnership) and tenth (career and public role). Planets here tend to be loud — they shape the visible architecture of a life.",
      "Signs describe how a planet behaves. Houses describe where it shows up.",
      "The remaining eight rooms fill in the texture: resources and values, communication, creativity, work and health, other people’s resources, philosophy, community, and the private inner world.",
      "Reading a placement",
      "Put it together in one sentence: planet, in sign, in house. “Mars in Gemini in the third” — drive, expressed through words, aimed at learning and local connection. That is the whole grammar of the chart.",
    ],
    "mercury-retrograde": [
      "Few phrases in astrology have escaped into everyday life like “Mercury retrograde.” Most of what is said about it is exaggerated. What remains, when you strip the panic away, is genuinely useful.",
      "The apparent backward step",
      "Mercury never truly reverses. Three or four times a year it appears to move backward from our vantage on Earth, an optical effect of two orbits passing. Astrologically, that apparent step inward turns Mercury’s themes — thinking, messages, travel, agreements — reflective.",
      "Retrograde is not a warning. It is a rhythm: the built-in pause between drafts.",
      "This is why the classic advice is to re-do rather than start fresh: revise the plan, revisit the conversation, reconnect with the person. The prefix re- is the whole instruction.",
      "Using it well",
      "Back up your devices, read the contract twice, and expect old threads to resurface. Treat the three weeks as an editing window, not a curse, and it quietly becomes one of the more productive parts of the cycle.",
    ],
  },
};

const es: ArticleBodyCopy = {
  authorBio:
    "Astrólogo del equipo de Sidera, especializado en técnica e interpretación de cartas.",
  relatedTitle: "Sigue leyendo",
  articles: {
    "lot-fortune": [
      "Si has pasado algún tiempo con tu carta natal, ya conoces los planetas y los doce signos. Menos personas llegan a conocer los Lotes, y el Lote de la Fortuna es el primero que merece la pena descubrir.",
      "La Fortuna no es un planeta. Es un punto calculado: se encuentra a la misma distancia del Ascendente que la Luna del Sol. Así lleva la relación entre la Luna y el Sol hasta el horizonte y señala un lugar que los astrólogos antiguos vinculaban con el cuerpo, el sustento y el curso de las circunstancias.",
      "Dónde cae la fortuna",
      "La casa que ocupa tu Lote de la Fortuna suele describir dónde fluyen con mayor facilidad los bienes tangibles de la vida, dónde las cosas simplemente parecen funcionar. En la segunda casa, mediante ingresos y recursos; en la séptima, mediante las relaciones; en la décima, mediante la reputación y la vida pública.",
      "La Fortuna no muestra lo que persigues, sino dónde la corriente ya fluye a tu favor.",
      "Por eso los astrólogos tradicionales observaban atentamente la Fortuna en cuestiones de salud y prosperidad. Es un barómetro de facilidad, la parte de la carta donde tienes una suerte silenciosa.",
      "Cómo encontrarla",
      "Sidera calcula automáticamente el Lote de la Fortuna en cada carta; lo verás marcado en la rueda con una pequeña cruz dentro de un círculo. Observa su signo, su casa y cualquier planeta cercano. Ese planeta matiza la forma en que suele llegar tu fortuna.",
    ],
    "aries-rising": [
      "Tu signo ascendente es el borde de la carta que subía por el horizonte cuando naciste. Pone toda la carta en movimiento y colorea tu manera de encontrarte con el mundo. Cuando ese signo es Aries, avanzas con fuego.",
      "Primero en cruzar la puerta",
      "El ascendente Aries suele percibirse como directo, rápido y un poco inquieto. Inicias cosas. Prefieres moverte y corregir el rumbo antes que esperar condiciones perfectas. Un primer encuentro contigo suele sentirse estimulante y, a veces, intenso de golpe.",
      "El Ascendente no es una máscara. Es la puerta por la que entra el resto de la carta.",
      "Como Marte rige Aries, su posición en tu carta importa enormemente: gobierna todo tu ascendente y su estado describe cómo se expresa realmente tu energía pionera.",
      "El reto de crecimiento",
      "La lección del ascendente Aries es cultivar paciencia sin perder valentía: conservar la iniciativa que te hace eficaz y dejar espacio para que otras personas puedan alcanzarte y contribuir.",
    ],
    "morning-star": [
      "Venus y Mercurio nunca se alejan mucho del Sol, y resulta importante si salen justo antes que él o se ponen justo después. Los astrólogos tradicionales distinguían una versión matutina y otra vespertina, y ambas se sienten realmente diferentes.",
      "La estrella matutina",
      "Como estrella matutina, Venus aparece antes que el Sol en un cielo oscuro. Es una Venus más audaz y directa: desea antes, actúa antes sobre el afecto y espera menos a ser elegida.",
      "La estrella vespertina",
      "Como estrella vespertina, Venus permanece después del ocaso. Es más reflexiva y relacional, atraída por la armonía y por encontrarse a mitad de camino. Ninguna es mejor; simplemente cortejan la vida con ritmos distintos.",
      "El mismo planeta, dos temperamentos, definidos solo por el lado del Sol en el que se encuentra.",
      "Puedes descubrir el tuyo en segundos: comprueba si Venus ocupa un grado zodiacal anterior o posterior al Sol. Anterior significa estrella matutina; posterior, estrella vespertina.",
    ],
    "saturn-return": [
      "Cada 29 años y medio aproximadamente, Saturno completa una órbita y vuelve al punto exacto que ocupaba cuando naciste. El primer retorno, al final de la veintena, tiene fama, y en gran parte se la ha ganado.",
      "Qué está ocurriendo realmente",
      "Saturno es el planeta de la estructura, el tiempo y las consecuencias. Cuando vuelve a casa, revisa todo lo que toca. La casa a la que regresa muestra dónde cae la revisión: pareja, carrera, hogar o creencias.",
      "Saturno no quita lo que es real. Retira lo que siempre fue prestado.",
      "Suele sentirse como presión porque lo construido por conveniencia y no por convicción tiende a ceder. Lo que sobrevive sale más definido y más tuyo.",
      "Cómo trabajar con ello",
      "Deja de representar una versión de tu vida que ya no encaja y comprométete con lo que sí es verdadero. Saturno recompensa esa honestidad con algo duradero: una base más adulta y elegida.",
    ],
    "twelve-houses": [
      "Una carta natal tiene tres piezas móviles: planetas, signos y casas. Quienes empiezan conocen primero planetas y signos y luego se atascan con las casas. No tienen por qué ser misteriosas. Piensa en ellas como las doce habitaciones de una vida.",
      "Primero los ángulos",
      "Cuatro casas sostienen la estructura: la primera (yo), la cuarta (hogar), la séptima (pareja) y la décima (carrera y papel público). Los planetas aquí suelen hacerse notar y moldean la arquitectura visible de una vida.",
      "Los signos describen cómo actúa un planeta. Las casas describen dónde aparece.",
      "Las ocho habitaciones restantes completan la textura: recursos y valores, comunicación, creatividad, trabajo y salud, recursos compartidos, filosofía, comunidad y mundo interior.",
      "Cómo leer una posición",
      "Únelo en una frase: planeta, en signo, en casa. “Marte en Géminis en la tercera”: impulso expresado mediante palabras y dirigido al aprendizaje y la conexión cercana. Esa es toda la gramática de la carta.",
    ],
    "mercury-retrograde": [
      "Pocas expresiones astrológicas han entrado tanto en la vida cotidiana como “Mercurio retrógrado”. Gran parte de lo que se dice está exagerado. Lo que queda al retirar el pánico es realmente útil.",
      "El aparente paso hacia atrás",
      "Mercurio nunca retrocede de verdad. Tres o cuatro veces al año parece moverse hacia atrás desde la Tierra, un efecto óptico de dos órbitas que se cruzan. Astrológicamente, ese paso interior vuelve reflexivos sus temas: pensamiento, mensajes, viajes y acuerdos.",
      "Retrógrado no es una advertencia. Es un ritmo: la pausa incorporada entre borradores.",
      "Por eso el consejo clásico es rehacer en lugar de empezar desde cero: revisar el plan, retomar la conversación, reconectar con la persona. El prefijo re- contiene toda la instrucción.",
      "Cómo aprovecharlo",
      "Haz copias de seguridad, lee el contrato dos veces y espera que regresen asuntos antiguos. Trata esas tres semanas como una ventana de edición, no como una maldición, y se convertirán en una etapa sorprendentemente productiva.",
    ],
  },
};

const fr: ArticleBodyCopy = {
  authorBio:
    "Astrologue au sein de Sidera, spécialiste des techniques et de l’art du thème.",
  relatedTitle: "Continuez à lire",
  articles: {
    "lot-fortune": [
      "Si vous avez déjà exploré votre thème natal, vous connaissez les planètes et les douze signes. Moins de personnes rencontrent les Lots, et le Lot de Fortune est le premier à découvrir.",
      "Fortune n’est pas une planète. C’est un point calculé, situé à la même distance de votre Ascendant que la Lune du Soleil. Il ramène ainsi la relation entre la Lune et le Soleil jusqu’à l’horizon et marque un lieu que les astrologues anciens associaient au corps, aux moyens d’existence et au cours des circonstances.",
      "Où tombe la fortune",
      "La maison occupée par votre Lot de Fortune décrit souvent l’endroit où les biens concrets de la vie circulent le plus facilement, là où les choses semblent simplement fonctionner. En maison deux, par les revenus et les ressources ; en maison sept, par les partenariats ; en maison dix, par la réputation et la vie publique.",
      "Fortune ne montre pas ce que vous poursuivez, mais l’endroit où le courant coule déjà en votre faveur.",
      "C’est pourquoi les astrologues traditionnels observaient Fortune avec attention pour les questions de santé et de prospérité. C’est un baromètre d’aisance, la partie du thème où vous êtes discrètement chanceux.",
      "La trouver vous-même",
      "Sidera calcule automatiquement le Lot de Fortune sur chaque thème ; vous le verrez sur la roue sous la forme d’une petite croix cerclée. Notez son signe, sa maison et toute planète proche. Cette planète colore la manière dont votre fortune tend à se présenter.",
    ],
    "aries-rising": [
      "Votre signe ascendant est le bord du thème qui se levait à l’horizon au moment de votre naissance. Il met tout le thème en mouvement et colore votre façon de rencontrer le monde. Quand ce signe est le Bélier, vous avancez avec le feu.",
      "Le premier à franchir la porte",
      "Un ascendant Bélier paraît souvent direct, rapide et un peu impatient. Vous lancez les choses. Vous préférez agir et corriger le cap plutôt qu’attendre des conditions parfaites. Une première rencontre avec vous est souvent énergisante, parfois intense d’un seul coup.",
      "L’Ascendant n’est pas un masque. C’est la porte qu’emprunte tout le reste du thème.",
      "Mars gouvernant le Bélier, sa position dans votre thème compte énormément : il règne sur tout votre ascendant et son état décrit la façon dont votre énergie pionnière se manifeste réellement.",
      "Le chemin de croissance",
      "La leçon de l’ascendant Bélier consiste à apprendre la patience sans perdre son courage : garder l’initiative qui vous rend efficace tout en laissant aux autres le temps de vous rejoindre et de contribuer.",
    ],
    "morning-star": [
      "Vénus et Mercure ne sont jamais loin du Soleil, et le fait qu’ils se lèvent juste avant lui ou se couchent juste après compte réellement. Les astrologues traditionnels distinguaient une version du matin et une version du soir, deux expressions vraiment différentes.",
      "L’étoile du matin",
      "Étoile du matin, Vénus se lève avant le Soleil dans un ciel sombre. C’est une Vénus plus audacieuse et plus directe, plus prompte à désirer, à agir sur ses sentiments et moins disposée à attendre d’être choisie.",
      "L’étoile du soir",
      "Étoile du soir, Vénus demeure après le coucher du Soleil. Elle est plus réfléchie et relationnelle, attirée par l’harmonie et le chemin partagé. Aucune n’est meilleure ; elles courtisent simplement la vie à des rythmes différents.",
      "Une même planète, deux tempéraments, déterminés uniquement par le côté du Soleil où elle se trouve.",
      "Vous pouvez trouver la vôtre en quelques secondes : regardez si Vénus occupe un degré du zodiaque antérieur ou postérieur à celui du Soleil. Antérieur signifie étoile du matin ; postérieur, étoile du soir.",
    ],
    "saturn-return": [
      "Tous les 29 ans et demi environ, Saturne achève son orbite et revient exactement à la position de votre naissance. Le premier retour, à la fin de la vingtaine, a une réputation largement méritée.",
      "Ce qui se passe réellement",
      "Saturne est la planète de la structure, du temps et des conséquences. Lorsqu’elle revient chez elle, elle audite tout ce qu’elle touche. La maison où elle revient indique le lieu de cet examen : couple, carrière, foyer ou croyances.",
      "Saturne ne retire pas ce qui est réel. Elle enlève ce qui n’a jamais été qu’emprunté.",
      "Cela ressemble souvent à une pression, car ce qui a été construit par facilité plutôt que par conviction tend à céder. Ce qui demeure en ressort plus défini, plus authentiquement vôtre.",
      "Comment l’accompagner",
      "Cessez de jouer une version de votre vie qui ne vous correspond plus et engagez-vous envers ce qui est réellement vrai. Saturne récompense cette honnêteté par quelque chose de durable : une assise plus adulte et plus choisie.",
    ],
    "twelve-houses": [
      "Un thème natal comporte trois éléments mobiles : planètes, signes et maisons. Les débutants rencontrent d’abord les planètes et les signes, puis butent sur les maisons. Elles n’ont rien de mystérieux. Imaginez-les comme les douze pièces d’une vie.",
      "Les angles d’abord",
      "Quatre maisons portent la structure : la première (soi), la quatrième (foyer), la septième (partenariat) et la dixième (carrière et rôle public). Les planètes qui s’y trouvent sont souvent très visibles et façonnent l’architecture d’une vie.",
      "Les signes décrivent comment une planète agit. Les maisons décrivent où elle se manifeste.",
      "Les huit autres pièces complètent la texture : ressources et valeurs, communication, créativité, travail et santé, ressources partagées, philosophie, communauté et monde intérieur.",
      "Lire une position",
      "Réunissez le tout en une phrase : planète, en signe, en maison. « Mars en Gémeaux en maison trois » : l’élan exprimé par les mots et tourné vers l’apprentissage et les liens proches. Voilà toute la grammaire du thème.",
    ],
    "mercury-retrograde": [
      "Peu d’expressions astrologiques sont entrées dans la vie courante autant que « Mercure rétrograde ». Une grande partie de ce qu’on en dit est exagérée. Ce qui reste lorsqu’on retire la panique est réellement utile.",
      "L’apparent pas en arrière",
      "Mercure ne recule jamais vraiment. Trois ou quatre fois par an, elle semble repartir en arrière depuis la Terre, effet optique de deux orbites qui se croisent. Astrologiquement, ce mouvement intérieur rend réflexifs ses thèmes : pensée, messages, voyages et accords.",
      "La rétrogradation n’est pas un avertissement. C’est un rythme : la pause intégrée entre deux versions.",
      "Voilà pourquoi le conseil classique consiste à refaire plutôt qu’à repartir de zéro : réviser le plan, reprendre la conversation, renouer avec la personne. Le préfixe re- contient toute l’instruction.",
      "Bien l’utiliser",
      "Sauvegardez vos appareils, relisez le contrat et attendez-vous au retour d’anciens sujets. Considérez ces trois semaines comme une fenêtre de révision plutôt qu’une malédiction ; elles deviennent alors l’une des périodes les plus productives du cycle.",
    ],
  },
};

const pt: ArticleBodyCopy = {
  authorBio:
    "Astrólogo da equipe Sidera, escrevendo sobre técnica e interpretação de mapas.",
  relatedTitle: "Continue lendo",
  articles: {
    "lot-fortune": [
      "Se você já passou algum tempo com seu mapa natal, conhece os planetas e os doze signos. Menos pessoas encontram os Lotes — e o Lote da Fortuna é o primeiro que vale a pena conhecer.",
      "A Fortuna não é um planeta. É um ponto calculado: fica à mesma distância do Ascendente que a Lua está do Sol. Assim, leva a relação da Lua com o Sol até o horizonte e marca um lugar que os astrólogos antigos ligavam ao corpo, ao sustento e ao fluxo das circunstâncias.",
      "Onde a fortuna cai",
      "A casa ocupada pelo seu Lote da Fortuna costuma mostrar onde os bens concretos da vida fluem com mais facilidade, onde as coisas simplesmente parecem dar certo. Na segunda casa, por ganhos e recursos; na sétima, por parcerias; na décima, por reputação e vida pública.",
      "A Fortuna não mostra o que você persegue, mas onde a corrente já corre a seu favor.",
      "Por isso os astrólogos tradicionais observavam a Fortuna de perto em questões de saúde e prosperidade. Ela é um barômetro de facilidade, a parte do mapa em que você tem uma sorte silenciosa.",
      "Como encontrá-la",
      "A Sidera calcula automaticamente o Lote da Fortuna em cada mapa; você o verá na roda como uma pequena cruz dentro de um círculo. Observe o signo, a casa e qualquer planeta próximo. Esse planeta colore a forma como sua fortuna costuma chegar.",
    ],
    "aries-rising": [
      "Seu signo ascendente é a borda do mapa que surgia no horizonte quando você nasceu. Ele põe todo o mapa em movimento e colore sua maneira de encontrar o mundo. Quando esse signo é Áries, você lidera com fogo.",
      "Primeiro pela porta",
      "O ascendente em Áries costuma parecer direto, rápido e um pouco inquieto. Você inicia as coisas. Prefere agir e corrigir o rumo a esperar condições perfeitas. Um primeiro encontro com você costuma ser energizante e, às vezes, intenso de uma só vez.",
      "O Ascendente não é uma máscara. É a porta pela qual o restante do mapa passa.",
      "Como Marte rege Áries, sua posição no mapa importa enormemente: ele governa todo o ascendente, e sua condição descreve como sua energia pioneira realmente se manifesta.",
      "O ponto de crescimento",
      "A lição do ascendente em Áries é ter paciência sem perder a coragem: manter a iniciativa que torna você eficaz e abrir espaço para que outras pessoas alcancem você e contribuam.",
    ],
    "morning-star": [
      "Vênus e Mercúrio nunca ficam longe do Sol, e faz diferença se nascem pouco antes dele ou se põem logo depois. Astrólogos tradicionais dividiam cada um em uma versão matutina e outra vespertina, e as duas realmente têm sensações distintas.",
      "A estrela da manhã",
      "Como estrela da manhã, Vênus nasce antes do Sol em um céu escuro. É uma Vênus mais ousada e direta, mais rápida para desejar, agir sobre o afeto e menos inclinada a esperar ser escolhida.",
      "A estrela da tarde",
      "Como estrela da tarde, Vênus permanece após o pôr do sol. É mais reflexiva e relacional, atraída pela harmonia e pelo encontro no meio do caminho. Nenhuma é melhor; elas apenas cortejam a vida em ritmos diferentes.",
      "O mesmo planeta, dois temperamentos, definidos apenas pelo lado do Sol em que ele se encontra.",
      "Você pode descobrir o seu em segundos: veja se Vênus está em um grau do zodíaco anterior ou posterior ao Sol. Anterior significa estrela da manhã; posterior, estrela da tarde.",
    ],
    "saturn-return": [
      "A cada cerca de 29 anos e meio, Saturno completa uma órbita e retorna ao ponto exato que ocupava quando você nasceu. O primeiro retorno, no fim dos vinte anos, tem fama — e em grande parte ela é merecida.",
      "O que realmente está acontecendo",
      "Saturno é o planeta da estrutura, do tempo e das consequências. Quando volta para casa, ele revisa tudo o que toca. A casa à qual retorna mostra onde a revisão acontece: parceria, carreira, lar ou crenças.",
      "Saturno não tira o que é real. Ele remove o que sempre foi apenas emprestado.",
      "Isso costuma parecer pressão porque o que foi construído por conveniência, e não por convicção, tende a ceder. O que sobrevive fica mais definido e mais seu.",
      "Como trabalhar com isso",
      "Pare de representar uma versão da vida que já não serve e comprometa-se com o que é verdadeiro. Saturno recompensa essa honestidade com algo durável: uma base mais adulta e mais escolhida.",
    ],
    "twelve-houses": [
      "Um mapa natal tem três partes móveis: planetas, signos e casas. Iniciantes encontram primeiro planetas e signos e depois travam nas casas. Elas não precisam ser misteriosas. Pense nelas como os doze cômodos de uma vida.",
      "Ângulos primeiro",
      "Quatro casas sustentam a estrutura: a primeira (eu), a quarta (lar), a sétima (parcerias) e a décima (carreira e papel público). Planetas aqui costumam ser marcantes e moldam a arquitetura visível de uma vida.",
      "Os signos descrevem como um planeta age. As casas descrevem onde ele aparece.",
      "Os oito cômodos restantes completam a textura: recursos e valores, comunicação, criatividade, trabalho e saúde, recursos compartilhados, filosofia, comunidade e mundo interior.",
      "Lendo uma posição",
      "Junte tudo em uma frase: planeta, em signo, em casa. “Marte em Gêmeos na terceira” — impulso expresso por palavras e voltado ao aprendizado e à conexão próxima. Essa é toda a gramática do mapa.",
    ],
    "mercury-retrograde": [
      "Poucas expressões astrológicas entraram tanto na vida cotidiana quanto “Mercúrio retrógrado”. Grande parte do que se diz é exagerada. O que resta quando retiramos o pânico é realmente útil.",
      "O aparente passo para trás",
      "Mercúrio nunca reverte de verdade. Três ou quatro vezes por ano, parece andar para trás visto da Terra, um efeito óptico de duas órbitas que se cruzam. Astrologicamente, esse movimento interior torna reflexivos seus temas: pensamento, mensagens, viagens e acordos.",
      "Retrógrado não é um aviso. É um ritmo: a pausa incorporada entre versões.",
      "Por isso o conselho clássico é refazer em vez de começar do zero: revisar o plano, retomar a conversa, reconectar-se com a pessoa. O prefixo re- contém toda a instrução.",
      "Como usá-lo bem",
      "Faça backup dos dispositivos, leia o contrato duas vezes e espere que assuntos antigos reapareçam. Trate as três semanas como uma janela de edição, não como uma maldição, e elas se tornam uma das fases mais produtivas do ciclo.",
    ],
  },
};

const ru: ArticleBodyCopy = {
  authorBio:
    "Штатный астролог Sidera, автор материалов о техниках и чтении карты.",
  relatedTitle: "Читайте дальше",
  articles: {
    "lot-fortune": [
      "Если вы уже изучали свою натальную карту, то знаете планеты и двенадцать знаков. С Лотами знакомы немногие, и Лот Фортуны — тот, с которого стоит начать.",
      "Фортуна — не планета, а вычисляемая точка: она находится на таком же расстоянии от Асцендента, как Луна от Солнца. Она переносит связь Луны и Солнца к горизонту и отмечает место, которое древние астрологи связывали с телом, средствами к существованию и ходом обстоятельств.",
      "Где находится фортуна",
      "Дом, в котором расположен ваш Лот Фортуны, часто показывает, где материальные блага текут легче всего и где всё словно складывается само собой. Во втором доме — через заработок и ресурсы; в седьмом — через партнёрство; в десятом — через репутацию и общественную жизнь.",
      "Фортуна показывает не то, за чем вы гонитесь, а место, где течение уже идёт в вашу пользу.",
      "Поэтому традиционные астрологи внимательно следили за Фортуной в вопросах здоровья и благополучия. Это барометр лёгкости, часть карты, где вам тихо сопутствует удача.",
      "Как найти её самостоятельно",
      "Sidera автоматически вычисляет Лот Фортуны для каждой карты; на колесе он отмечен маленьким крестом в круге. Посмотрите на его знак, дом и ближайшие планеты. Такая планета окрашивает способ, которым к вам приходит удача.",
    ],
    "aries-rising": [
      "Ваш восходящий знак — это край карты, поднимавшийся над горизонтом в момент рождения. Он приводит всю карту в движение и окрашивает вашу встречу с миром. Если это Овен, вы идёте вперёд с огнём.",
      "Первым в дверь",
      "Асцендент в Овне обычно воспринимается как прямой, быстрый и немного беспокойный. Вы начинаете дела. Вам легче двинуться и скорректировать курс, чем ждать идеальных условий. Первая встреча с вами часто бодрит, а иногда сразу кажется очень насыщенной.",
      "Асцендент — не маска. Это дверь, через которую проходит вся остальная карта.",
      "Поскольку Овном управляет Марс, его положение в карте чрезвычайно важно: он управляет всем Асцендентом, а его состояние показывает, как именно проявляется ваша первопроходческая энергия.",
      "Зона роста",
      "Урок Асцендента в Овне — терпение без потери смелости: сохранять инициативу, которая делает вас эффективным, и оставлять другим пространство, чтобы догнать вас и внести свой вклад.",
    ],
    "morning-star": [
      "Венера и Меркурий никогда не отходят далеко от Солнца, и важно, восходят ли они прямо перед ним или заходят сразу после. Традиционные астрологи различали утреннюю и вечернюю версии, и они действительно ощущаются по-разному.",
      "Утренняя звезда",
      "Будучи утренней звездой, Венера восходит перед Солнцем в тёмном небе. Это более смелая и прямая Венера: она быстрее желает, быстрее проявляет чувства и меньше склонна ждать, пока её выберут.",
      "Вечерняя звезда",
      "Будучи вечерней звездой, Венера остаётся после заката. Она более вдумчива и ориентирована на отношения, тянется к гармонии и встрече на полпути. Ни одна версия не лучше; они просто движутся по жизни в разном темпе.",
      "Одна планета, два темперамента, определяемые лишь тем, по какую сторону Солнца она находится.",
      "Свою версию можно узнать за секунды: проверьте, стоит ли Венера в более раннем или более позднем градусе зодиака, чем Солнце. Раньше — утренняя звезда, позже — вечерняя.",
    ],
    "saturn-return": [
      "Примерно каждые 29 с половиной лет Сатурн завершает орбиту и возвращается точно в ту точку, где находился при вашем рождении. Первое возвращение в конце двадцатых имеет свою репутацию, и в основном заслуженно.",
      "Что происходит на самом деле",
      "Сатурн — планета структуры, времени и последствий. Возвращаясь домой, он проверяет всё, чего касается. Дом возвращения показывает область проверки: отношения, карьера, дом или убеждения.",
      "Сатурн не забирает настоящее. Он убирает то, что всегда было лишь взято взаймы.",
      "Это часто ощущается как давление, потому что построенное из удобства, а не из убеждения, начинает рушиться. То, что остаётся, становится более определённым и по-настоящему вашим.",
      "Как с этим работать",
      "Перестаньте изображать версию жизни, которая вам больше не подходит, и посвятите себя тому, что действительно правдиво. Сатурн вознаграждает такую честность прочной, более взрослой и авторской опорой.",
    ],
    "twelve-houses": [
      "В натальной карте есть три движущиеся части: планеты, знаки и дома. Новички сначала знакомятся с планетами и знаками, а затем застревают на домах. Они не обязаны быть загадочными. Представьте их как двенадцать комнат жизни.",
      "Сначала углы",
      "Четыре дома несут основную нагрузку: первый (я), четвёртый (дом), седьмой (партнёрство) и десятый (карьера и общественная роль). Планеты здесь обычно звучат громко и формируют видимую архитектуру жизни.",
      "Знаки описывают, как действует планета. Дома описывают, где она проявляется.",
      "Оставшиеся восемь комнат создают фактуру: ресурсы и ценности, общение, творчество, работа и здоровье, общие ресурсы, философия, сообщество и внутренний мир.",
      "Как читать положение",
      "Соберите всё в одном предложении: планета, в знаке, в доме. «Марс в Близнецах в третьем доме» — импульс, выраженный словами и направленный на обучение и близкие связи. Это вся грамматика карты.",
    ],
    "mercury-retrograde": [
      "Немногие астрологические выражения так прочно вошли в повседневную речь, как «ретроградный Меркурий». Большая часть сказанного о нём преувеличена. Но то, что остаётся без паники, действительно полезно.",
      "Кажущийся шаг назад",
      "Меркурий никогда не движется назад в действительности. Три-четыре раза в год с Земли кажется, что он разворачивается, — это оптический эффект пересечения двух орбит. В астрологии такой внутренний шаг делает его темы — мышление, сообщения, поездки и договорённости — более рефлексивными.",
      "Ретроградность — не предупреждение. Это ритм, встроенная пауза между черновиками.",
      "Поэтому классический совет — переделывать, а не начинать с нуля: пересмотреть план, вернуться к разговору, восстановить связь. Приставка «пере-» содержит всю инструкцию.",
      "Как использовать это время",
      "Создайте резервные копии, дважды прочитайте договор и будьте готовы к возвращению старых тем. Считайте эти три недели окном для редактирования, а не проклятием, и они станут одной из самых продуктивных частей цикла.",
    ],
  },
};

const it: ArticleBodyCopy = {
  authorBio:
    "Astrologo dello staff di Sidera, scrive di tecnica e lettura del tema.",
  relatedTitle: "Continua a leggere",
  articles: {
    "lot-fortune": [
      "Se hai trascorso un po’ di tempo con il tuo tema natale, conosci i pianeti e i dodici segni. Meno persone incontrano le Parti, e la Parte di Fortuna è la prima che vale la pena conoscere.",
      "Fortuna non è un pianeta. È un punto calcolato: si trova alla stessa distanza dall’Ascendente a cui la Luna si trova dal Sole. Porta così la relazione tra Luna e Sole fino all’orizzonte e segna un luogo che gli astrologi antichi collegavano al corpo, al sostentamento e al fluire delle circostanze.",
      "Dove cade la fortuna",
      "La casa occupata dalla Parte di Fortuna tende a descrivere dove i beni concreti della vita scorrono più facilmente, dove le cose sembrano semplicemente funzionare. In seconda casa, attraverso guadagni e risorse; in settima, attraverso le relazioni; in decima, attraverso reputazione e vita pubblica.",
      "Fortuna mostra non ciò che insegui, ma il punto in cui la corrente scorre già a tuo favore.",
      "Per questo gli astrologi tradizionali osservavano attentamente Fortuna nelle questioni di salute e prosperità. È un barometro di facilità, la parte del tema in cui sei silenziosamente fortunato.",
      "Trovarla da soli",
      "Sidera calcola automaticamente la Parte di Fortuna in ogni tema; la vedrai sulla ruota come una piccola croce cerchiata. Nota il segno, la casa e gli eventuali pianeti vicini. Quel pianeta colora il modo in cui la fortuna tende ad arrivare.",
    ],
    "aries-rising": [
      "Il segno ascendente è il bordo del tema che saliva sull’orizzonte al momento della nascita. Mette in moto l’intera carta e colora il modo in cui incontri il mondo. Quando quel segno è l’Ariete, guidi con il fuoco.",
      "Il primo ad attraversare la porta",
      "Un ascendente Ariete appare spesso diretto, rapido e un po’ irrequieto. Inizi le cose. Preferisci muoverti e correggere la rotta invece di aspettare condizioni perfette. Un primo incontro con te è spesso energizzante e talvolta intenso tutto insieme.",
      "L’Ascendente non è una maschera. È la porta attraverso cui passa il resto del tema.",
      "Poiché Marte governa l’Ariete, la sua posizione nel tema conta enormemente: regge tutto l’Ascendente e la sua condizione descrive come si manifesta davvero la tua energia pionieristica.",
      "Il margine di crescita",
      "La lezione dell’ascendente Ariete è la pazienza senza perdere il coraggio: mantenere l’iniziativa che ti rende efficace lasciando agli altri lo spazio per raggiungerti e contribuire.",
    ],
    "morning-star": [
      "Venere e Mercurio non sono mai lontani dal Sole, e conta se sorgono poco prima o tramontano subito dopo. Gli astrologi tradizionali distinguevano una versione mattutina e una serale, e le due si percepiscono davvero in modo diverso.",
      "La stella del mattino",
      "Come stella del mattino, Venere sorge prima del Sole in un cielo buio. È una Venere più audace e diretta, più rapida nel desiderare e nell’agire sull’affetto, meno incline ad aspettare di essere scelta.",
      "La stella della sera",
      "Come stella della sera, Venere rimane dopo il tramonto. È più riflessiva e relazionale, attratta dall’armonia e dall’incontro a metà strada. Nessuna è migliore; corteggiano semplicemente la vita con ritmi diversi.",
      "Lo stesso pianeta, due temperamenti, determinati soltanto dal lato del Sole in cui si trova.",
      "Puoi trovare il tuo in pochi secondi: verifica se Venere occupa un grado zodiacale precedente o successivo al Sole. Prima significa stella del mattino; dopo, stella della sera.",
    ],
    "saturn-return": [
      "Circa ogni 29 anni e mezzo, Saturno completa un’orbita e torna nel punto esatto che occupava alla nascita. Il primo ritorno, alla fine dei vent’anni, ha una reputazione in gran parte meritata.",
      "Che cosa sta accadendo davvero",
      "Saturno è il pianeta della struttura, del tempo e delle conseguenze. Quando torna a casa, verifica tutto ciò che tocca. La casa del ritorno indica dove cade la verifica: relazione, carriera, casa o convinzioni.",
      "Saturno non porta via ciò che è reale. Rimuove ciò che è sempre stato soltanto preso in prestito.",
      "Spesso sembra pressione perché ciò che è costruito per comodità anziché per convinzione tende a cedere. Ciò che sopravvive ne esce più definito e più tuo.",
      "Come lavorarci",
      "Smetti di interpretare una versione della vita che non ti corrisponde più e impegnati con ciò che è davvero autentico. Saturno premia questa onestà con qualcosa di duraturo: una base più adulta e consapevole.",
    ],
    "twelve-houses": [
      "Un tema natale ha tre parti mobili: pianeti, segni e case. Chi inizia incontra prima pianeti e segni e poi si blocca sulle case. Non devono essere misteriose. Pensale come le dodici stanze di una vita.",
      "Prima gli angoli",
      "Quattro case sostengono la struttura: la prima (sé), la quarta (casa), la settima (relazioni) e la decima (carriera e ruolo pubblico). I pianeti qui tendono a farsi sentire e modellano l’architettura visibile di una vita.",
      "I segni descrivono come agisce un pianeta. Le case descrivono dove si manifesta.",
      "Le altre otto stanze completano la trama: risorse e valori, comunicazione, creatività, lavoro e salute, risorse condivise, filosofia, comunità e mondo interiore.",
      "Leggere una posizione",
      "Metti tutto in una frase: pianeta, nel segno, nella casa. “Marte in Gemelli in terza” — impulso espresso attraverso le parole e diretto verso apprendimento e connessioni vicine. Questa è tutta la grammatica del tema.",
    ],
    "mercury-retrograde": [
      "Poche espressioni astrologiche sono entrate nella vita quotidiana quanto “Mercurio retrogrado”. Molto di ciò che si dice è esagerato. Quello che resta, tolto il panico, è davvero utile.",
      "L’apparente passo indietro",
      "Mercurio non inverte mai davvero il moto. Tre o quattro volte l’anno sembra muoversi all’indietro visto dalla Terra, un effetto ottico di due orbite che si incrociano. Astrologicamente, quel passo interiore rende riflessivi i suoi temi: pensiero, messaggi, viaggi e accordi.",
      "Retrogrado non è un avvertimento. È un ritmo: la pausa incorporata tra una bozza e l’altra.",
      "Ecco perché il consiglio classico è rifare invece di ricominciare: rivedere il piano, riprendere la conversazione, riallacciare il rapporto. Il prefisso ri- contiene tutta l’istruzione.",
      "Usarlo bene",
      "Fai il backup dei dispositivi, leggi il contratto due volte e aspettati il ritorno di vecchi temi. Considera le tre settimane una finestra di revisione, non una maledizione, e diventeranno una delle parti più produttive del ciclo.",
    ],
  },
};

const de: ArticleBodyCopy = {
  authorBio:
    "Astrologe im Sidera-Team, schreibt über Techniken und die Kunst der Horoskopdeutung.",
  relatedTitle: "Weiterlesen",
  articles: {
    "lot-fortune": [
      "Wenn du dich schon mit deinem Geburtshoroskop beschäftigt hast, kennst du die Planeten und die zwölf Zeichen. Weniger Menschen begegnen den Losen – und das Glückslos ist das erste, das man kennenlernen sollte.",
      "Fortuna ist kein Planet. Sie ist ein berechneter Punkt: vom Aszendenten genauso weit entfernt wie der Mond von der Sonne. So trägt sie die Beziehung von Mond und Sonne bis an den Horizont und markiert einen Ort, den antike Astrologen mit Körper, Lebensunterhalt und dem Lauf der Umstände verbanden.",
      "Wo das Glück liegt",
      "Das Haus deines Glücksloses beschreibt oft, wo die greifbaren Güter des Lebens am leichtesten fließen und Dinge einfach zu funktionieren scheinen. Im zweiten Haus durch Einkommen und Ressourcen, im siebten durch Partnerschaften, im zehnten durch Ansehen und öffentliches Leben.",
      "Fortuna zeigt nicht, wonach du jagst, sondern wo die Strömung bereits zu deinen Gunsten läuft.",
      "Darum beobachteten traditionelle Astrologen Fortuna bei Fragen zu Gesundheit und Wohlstand besonders genau. Sie ist ein Barometer der Leichtigkeit, jener Teil des Horoskops, in dem du stilles Glück hast.",
      "So findest du sie selbst",
      "Sidera berechnet das Glückslos automatisch in jedem Horoskop; auf dem Rad erscheint es als kleines eingekreistes Kreuz. Achte auf Zeichen, Haus und nahe Planeten. Ein solcher Planet färbt die Art, wie dein Glück zu dir kommt.",
    ],
    "aries-rising": [
      "Dein Aszendent ist der Rand des Horoskops, der bei deiner Geburt über den Horizont stieg. Er setzt das ganze Horoskop in Bewegung und prägt, wie du der Welt begegnest. Ist dieses Zeichen Widder, gehst du mit Feuer voran.",
      "Als Erste durch die Tür",
      "Ein Widder-Aszendent wirkt meist direkt, schnell und etwas ruhelos. Du bringst Dinge ins Rollen. Lieber bewegst du dich und korrigierst den Kurs, als auf perfekte Bedingungen zu warten. Eine erste Begegnung mit dir wird oft als belebend und manchmal als sofort sehr intensiv erlebt.",
      "Der Aszendent ist keine Maske. Er ist die Tür, durch die der Rest des Horoskops tritt.",
      "Da Mars den Widder regiert, ist seine Stellung im Horoskop enorm wichtig: Er herrscht über deinen gesamten Aszendenten, und sein Zustand zeigt, wie deine Pionierenergie tatsächlich zum Ausdruck kommt.",
      "Die Wachstumsaufgabe",
      "Die Lektion des Widder-Aszendenten ist Geduld, ohne den Mut zu verlieren: die Initiative zu bewahren, die dich wirksam macht, und anderen Raum zu geben, aufzuschließen und beizutragen.",
    ],
    "morning-star": [
      "Venus und Merkur entfernen sich am Himmel nie weit von der Sonne, und es macht einen Unterschied, ob sie kurz vor ihr aufgehen oder kurz nach ihr untergehen. Traditionelle Astrologen unterschieden eine Morgen- und eine Abendversion – und beide fühlen sich wirklich verschieden an.",
      "Der Morgenstern",
      "Als Morgenstern steigt Venus vor der Sonne in einen dunklen Himmel. Das ist die mutigere, offensivere Venus: schneller im Wünschen, schneller im Ausdruck von Zuneigung und weniger geneigt, darauf zu warten, gewählt zu werden.",
      "Der Abendstern",
      "Als Abendstern bleibt Venus nach Sonnenuntergang sichtbar. Diese Venus ist nachdenklicher und beziehungsorientierter, sucht Harmonie und Begegnung auf halbem Weg. Keine ist besser; sie umwerben das Leben nur in unterschiedlichem Tempo.",
      "Derselbe Planet, zwei Temperamente – allein dadurch bestimmt, auf welcher Seite der Sonne er steht.",
      "Du findest deine Version in Sekunden: Prüfe, ob Venus in einem früheren oder späteren Tierkreisgrad als die Sonne steht. Früher bedeutet Morgenstern, später Abendstern.",
    ],
    "saturn-return": [
      "Etwa alle 29,5 Jahre vollendet Saturn eine Umlaufbahn und kehrt an genau die Stelle zurück, an der er bei deiner Geburt stand. Die erste Wiederkehr Ende zwanzig hat ihren Ruf – und meist zu Recht.",
      "Was wirklich geschieht",
      "Saturn ist der Planet von Struktur, Zeit und Konsequenz. Wenn er heimkehrt, prüft er alles, was er berührt. Das Haus seiner Rückkehr zeigt, wo die Prüfung stattfindet: Partnerschaft, Karriere, Zuhause oder Überzeugungen.",
      "Saturn nimmt nicht weg, was echt ist. Er entfernt, was immer nur geliehen war.",
      "Es fühlt sich oft wie Druck an, weil Dinge, die aus Bequemlichkeit statt aus Überzeugung gebaut wurden, nachgeben. Was bleibt, wird klarer und gehört stärker dir.",
      "So arbeitest du damit",
      "Hör auf, eine Version deines Lebens zu spielen, die nicht mehr passt, und verpflichte dich dem, was wirklich wahr ist. Saturn belohnt diese Ehrlichkeit mit etwas Dauerhaftem: einem erwachseneren, selbst gestalteten Fundament.",
    ],
    "twelve-houses": [
      "Ein Geburtshoroskop hat drei bewegliche Teile: Planeten, Zeichen und Häuser. Anfänger lernen zuerst Planeten und Zeichen kennen und bleiben dann bei den Häusern hängen. Sie müssen nicht geheimnisvoll sein. Stell sie dir als zwölf Räume eines Lebens vor.",
      "Zuerst die Achsen",
      "Vier Häuser tragen die Struktur: das erste (Selbst), vierte (Zuhause), siebte (Partnerschaft) und zehnte (Karriere und öffentliche Rolle). Planeten hier sind meist deutlich und prägen die sichtbare Architektur eines Lebens.",
      "Zeichen beschreiben, wie ein Planet handelt. Häuser beschreiben, wo er erscheint.",
      "Die übrigen acht Räume geben dem Leben Struktur und Farbe: Ressourcen und Werte, Kommunikation, Kreativität, Arbeit und Gesundheit, geteilte Ressourcen, Philosophie, Gemeinschaft und innere Welt.",
      "Eine Stellung lesen",
      "Fasse alles in einem Satz zusammen: Planet, im Zeichen, im Haus. „Mars in Zwillinge im dritten Haus“ – Antrieb, durch Worte ausgedrückt und auf Lernen und nahe Verbindungen gerichtet. Das ist die ganze Grammatik des Horoskops.",
    ],
    "mercury-retrograde": [
      "Kaum ein astrologischer Ausdruck ist so sehr in den Alltag eingegangen wie „Merkur rückläufig“. Vieles, was darüber gesagt wird, ist übertrieben. Was ohne Panik übrig bleibt, ist wirklich nützlich.",
      "Der scheinbare Schritt zurück",
      "Merkur kehrt seine Bewegung nie wirklich um. Drei- oder viermal im Jahr scheint er sich von der Erde aus rückwärts zu bewegen, ein optischer Effekt zweier vorbeiziehender Umlaufbahnen. Astrologisch macht dieser innere Schritt seine Themen – Denken, Nachrichten, Reisen und Vereinbarungen – nachdenklicher.",
      "Rückläufigkeit ist keine Warnung. Sie ist ein Rhythmus: die eingebaute Pause zwischen Entwürfen.",
      "Darum lautet der klassische Rat, zu überarbeiten statt neu zu beginnen: den Plan prüfen, das Gespräch wieder aufnehmen, die Verbindung erneuern. Das Präfix „wieder-“ enthält die ganze Anweisung.",
      "Die Zeit gut nutzen",
      "Sichere deine Geräte, lies den Vertrag zweimal und rechne damit, dass alte Themen zurückkehren. Betrachte die drei Wochen als Zeitfenster zum Überarbeiten statt als Fluch, und sie werden zu einem der produktivsten Teile des Zyklus.",
    ],
  },
};

const copyByLocale = { en, es, fr, pt, ru, it, de } satisfies Record<
  SupportedLocale,
  ArticleBodyCopy
>;

const articleKeys = [
  "lot-fortune",
  "aries-rising",
  "morning-star",
  "saturn-return",
  "twelve-houses",
  "mercury-retrograde",
] as const;

export const getBlogArticleBodyCopy = (
  locale: SupportedLocale,
): Record<string, string> => {
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const fields: Record<string, string> = {
    blog_article_author_bio: copy.authorBio,
    blog_related_title: copy.relatedTitle,
  };

  for (const key of articleKeys) {
    copy.articles[key].forEach((text, index) => {
      fields[`blog_article_${key.replaceAll("-", "_")}_body_${index + 1}`] =
        text;
    });
  }

  return fields;
};
