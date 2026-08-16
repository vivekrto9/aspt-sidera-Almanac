import type { SupportedLocale } from "../../../localization-contract.ts";

export type FaqAccordionItemCopy = {
  category: string;
  question: string;
  answer: string;
};

const copyByLocale = {
  en: [
    {
      category: "Getting started",
      question: "Do I need my exact birth time?",
      answer:
        "For the Sun, Moon and planet signs, no — a date is enough. For an accurate rising sign and house placements, yes: even ten minutes can shift the ascendant. If unsure, cast it for noon and refine later.",
    },
    {
      category: "Getting started",
      question: "Is Sidera really free?",
      answer:
        "The core charts — birth chart, today’s sky, the moon calendar and your daily horoscope — are free forever, with no trial. Paid plans add saving, compatibility tools and reports.",
    },
    {
      category: "Accuracy & data",
      question: "How accurate are the calculations?",
      answer:
        "Every position is computed from the Swiss Ephemeris, accurate to the arcminute — the same engine professional astrologers use. Nothing is approximated.",
    },
    {
      category: "Accuracy & data",
      question: "Which house system do you use?",
      answer:
        "Placidus by default, with Whole Sign, Koch, Equal and others one click away. You can set a personal default in your account settings.",
    },
    {
      category: "Accuracy & data",
      question: "Tropical or sidereal zodiac?",
      answer:
        "Tropical by default, which is standard in Western astrology. Sidereal is available as a toggle for those working in the Vedic tradition.",
    },
    {
      category: "Billing",
      question: "Can I cancel any time?",
      answer:
        "Yes. Plans are month to month with no lock-in; cancel in one click and you keep access through the end of your billing period.",
    },
    {
      category: "Billing",
      question: "What happens to my saved charts if I downgrade?",
      answer:
        "Nothing is deleted. If you exceed the free plan’s limit, older charts become read-only until you remove some or upgrade again.",
    },
    {
      category: "Astrologers",
      question: "How do live readings work?",
      answer:
        "Browse astrologers by specialty, book a slot or start a chat if they are online, and pay by the minute. A written summary lands in your account afterwards.",
    },
  ],
  es: [
    {
      category: "Primeros pasos",
      question: "¿Necesito saber mi hora exacta de nacimiento?",
      answer:
        "Para conocer los signos del Sol, la Luna y los planetas, no: basta con la fecha. Para calcular con precisión el ascendente y las casas, sí; incluso diez minutos pueden cambiar el ascendente. Si no estás seguro, usa el mediodía y ajústalo más adelante.",
    },
    {
      category: "Primeros pasos",
      question: "¿Sidera es realmente gratis?",
      answer:
        "Las cartas principales —carta natal, cielo de hoy, calendario lunar y horóscopo diario— son gratuitas para siempre y sin periodo de prueba. Los planes de pago añaden guardado, herramientas de compatibilidad e informes.",
    },
    {
      category: "Precisión y datos",
      question: "¿Qué precisión tienen los cálculos?",
      answer:
        "Cada posición se calcula con Swiss Ephemeris, con precisión de minuto de arco: el mismo motor que utilizan astrólogos profesionales. Nada se aproxima.",
    },
    {
      category: "Precisión y datos",
      question: "¿Qué sistema de casas utilizan?",
      answer:
        "Placidus de forma predeterminada, con Signos Enteros, Koch, Casas Iguales y otros sistemas a un clic. Puedes guardar tu preferencia en los ajustes de la cuenta.",
    },
    {
      category: "Precisión y datos",
      question: "¿Zodiaco tropical o sideral?",
      answer:
        "Tropical de forma predeterminada, como es habitual en la astrología occidental. El sideral está disponible para quienes trabajan con la tradición védica.",
    },
    {
      category: "Facturación",
      question: "¿Puedo cancelar en cualquier momento?",
      answer:
        "Sí. Los planes son mensuales y no tienen permanencia; cancela con un clic y conservarás el acceso hasta el final del periodo facturado.",
    },
    {
      category: "Facturación",
      question: "¿Qué ocurre con mis cartas guardadas si bajo de plan?",
      answer:
        "No se elimina nada. Si superas el límite del plan gratuito, las cartas más antiguas quedan en modo de solo lectura hasta que elimines algunas o vuelvas a mejorar el plan.",
    },
    {
      category: "Astrólogos",
      question: "¿Cómo funcionan las consultas en directo?",
      answer:
        "Explora astrólogos por especialidad, reserva una cita o inicia un chat si están conectados y paga por minuto. Después recibirás un resumen escrito en tu cuenta.",
    },
  ],
  fr: [
    {
      category: "Bien démarrer",
      question: "Ai-je besoin de mon heure de naissance exacte ?",
      answer:
        "Pour les signes du Soleil, de la Lune et des planètes, non : la date suffit. Pour un ascendant et des maisons précis, oui ; dix minutes peuvent déplacer l’ascendant. En cas de doute, utilisez midi puis affinez plus tard.",
    },
    {
      category: "Bien démarrer",
      question: "Sidera est-il vraiment gratuit ?",
      answer:
        "Les outils essentiels — thème natal, ciel du jour, calendrier lunaire et horoscope quotidien — restent gratuits, sans période d’essai. Les offres payantes ajoutent la sauvegarde, la compatibilité et les rapports.",
    },
    {
      category: "Précision et données",
      question: "Quelle est la précision des calculs ?",
      answer:
        "Chaque position est calculée avec les Éphémérides suisses, à la minute d’arc près — le même moteur que celui des astrologues professionnels. Rien n’est approximatif.",
    },
    {
      category: "Précision et données",
      question: "Quel système de maisons utilisez-vous ?",
      answer:
        "Placidus par défaut, avec les Signes entiers, Koch, Maisons égales et d’autres options accessibles en un clic. Vous pouvez enregistrer votre préférence dans votre compte.",
    },
    {
      category: "Précision et données",
      question: "Zodiaque tropical ou sidéral ?",
      answer:
        "Le zodiaque tropical est utilisé par défaut, comme en astrologie occidentale. Le mode sidéral est disponible pour les personnes qui suivent la tradition védique.",
    },
    {
      category: "Facturation",
      question: "Puis-je résilier à tout moment ?",
      answer:
        "Oui. Les offres sont mensuelles et sans engagement ; résiliez en un clic et conservez votre accès jusqu’à la fin de la période facturée.",
    },
    {
      category: "Facturation",
      question: "Que deviennent mes thèmes sauvegardés si je change d’offre ?",
      answer:
        "Rien n’est supprimé. Si vous dépassez la limite gratuite, les thèmes les plus anciens passent en lecture seule jusqu’à ce que vous en retiriez ou choisissiez une offre supérieure.",
    },
    {
      category: "Astrologues",
      question: "Comment fonctionnent les consultations en direct ?",
      answer:
        "Parcourez les astrologues par spécialité, réservez un créneau ou démarrez une discussion s’ils sont en ligne, puis payez à la minute. Un résumé écrit sera ajouté à votre compte.",
    },
  ],
  pt: [
    {
      category: "Primeiros passos",
      question: "Preciso da hora exata do meu nascimento?",
      answer:
        "Para os signos do Sol, da Lua e dos planetas, não: a data é suficiente. Para calcular com precisão o ascendente e as casas, sim; dez minutos podem alterar o ascendente. Se não souber, use meio-dia e ajuste depois.",
    },
    {
      category: "Primeiros passos",
      question: "A Sidera é realmente gratuita?",
      answer:
        "Os recursos principais — mapa natal, céu de hoje, calendário lunar e horóscopo diário — são gratuitos para sempre, sem período de teste. Os planos pagos acrescentam salvamento, compatibilidade e relatórios.",
    },
    {
      category: "Precisão e dados",
      question: "Qual é a precisão dos cálculos?",
      answer:
        "Cada posição é calculada com o Swiss Ephemeris, com precisão de minuto de arco — o mesmo mecanismo usado por astrólogos profissionais. Nada é aproximado.",
    },
    {
      category: "Precisão e dados",
      question: "Qual sistema de casas vocês usam?",
      answer:
        "Placidus por padrão, com Signos Inteiros, Koch, Casas Iguais e outras opções a um clique. Você pode definir a preferência nos ajustes da conta.",
    },
    {
      category: "Precisão e dados",
      question: "Zodíaco tropical ou sideral?",
      answer:
        "Tropical por padrão, como é comum na astrologia ocidental. O sideral está disponível para quem trabalha com a tradição védica.",
    },
    {
      category: "Cobrança",
      question: "Posso cancelar a qualquer momento?",
      answer:
        "Sim. Os planos são mensais e sem fidelidade; cancele com um clique e mantenha o acesso até o fim do período já pago.",
    },
    {
      category: "Cobrança",
      question: "O que acontece com meus mapas salvos se eu reduzir o plano?",
      answer:
        "Nada é apagado. Se você ultrapassar o limite do plano gratuito, os mapas mais antigos ficam somente para leitura até que alguns sejam removidos ou o plano seja ampliado novamente.",
    },
    {
      category: "Astrólogos",
      question: "Como funcionam as consultas ao vivo?",
      answer:
        "Explore astrólogos por especialidade, reserve um horário ou inicie uma conversa se estiverem online e pague por minuto. Depois, um resumo escrito ficará disponível na sua conta.",
    },
  ],
  ru: [
    {
      category: "Начало работы",
      question: "Нужно ли знать точное время рождения?",
      answer:
        "Для определения знаков Солнца, Луны и планет достаточно даты. Для точного асцендента и домов время необходимо: даже десять минут могут изменить асцендент. Если время неизвестно, укажите полдень и уточните его позже.",
    },
    {
      category: "Начало работы",
      question: "Sidera действительно бесплатна?",
      answer:
        "Основные инструменты — натальная карта, небо сегодня, лунный календарь и ежедневный гороскоп — бесплатны без пробного периода. Платные планы добавляют сохранение, совместимость и отчёты.",
    },
    {
      category: "Точность и данные",
      question: "Насколько точны расчёты?",
      answer:
        "Все положения рассчитываются по Swiss Ephemeris с точностью до угловой минуты — тем же инструментом пользуются профессиональные астрологи. Приближённых значений нет.",
    },
    {
      category: "Точность и данные",
      question: "Какую систему домов вы используете?",
      answer:
        "По умолчанию используется Плацидус; также доступны Цельные знаки, Кох, Равные дома и другие системы. Предпочтение можно сохранить в настройках аккаунта.",
    },
    {
      category: "Точность и данные",
      question: "Тропический или сидерический зодиак?",
      answer:
        "По умолчанию используется тропический зодиак, принятый в западной астрологии. Для ведической традиции доступен сидерический режим.",
    },
    {
      category: "Оплата",
      question: "Можно ли отменить подписку в любое время?",
      answer:
        "Да. Планы оплачиваются помесячно и не требуют обязательств; отмените подписку одним нажатием и пользуйтесь доступом до конца оплаченного периода.",
    },
    {
      category: "Оплата",
      question: "Что будет с сохранёнными картами при переходе на более простой план?",
      answer:
        "Ничего не удаляется. Если превышен лимит бесплатного плана, старые карты становятся доступны только для чтения, пока вы не удалите часть из них или снова не улучшите план.",
    },
    {
      category: "Астрологи",
      question: "Как проходят консультации в реальном времени?",
      answer:
        "Выберите астролога по специализации, забронируйте время или начните чат, если он онлайн, и оплачивайте поминутно. После консультации письменное резюме появится в аккаунте.",
    },
  ],
  it: [
    {
      category: "Per iniziare",
      question: "Serve l’ora esatta della mia nascita?",
      answer:
        "Per i segni di Sole, Luna e pianeti no: basta la data. Per un ascendente e case precisi sì; anche dieci minuti possono spostare l’ascendente. Se non la conosci, usa mezzogiorno e perfeziona il dato in seguito.",
    },
    {
      category: "Per iniziare",
      question: "Sidera è davvero gratuita?",
      answer:
        "Gli strumenti principali — tema natale, cielo di oggi, calendario lunare e oroscopo quotidiano — restano gratuiti, senza prova. I piani a pagamento aggiungono salvataggi, compatibilità e report.",
    },
    {
      category: "Precisione e dati",
      question: "Quanto sono precisi i calcoli?",
      answer:
        "Ogni posizione è calcolata con le Effemeridi Svizzere, con precisione al minuto d’arco — lo stesso motore usato dagli astrologi professionisti. Nulla è approssimato.",
    },
    {
      category: "Precisione e dati",
      question: "Quale sistema di case utilizzate?",
      answer:
        "Placidus come impostazione predefinita, con Segni Interi, Koch, Case Uguali e altre opzioni a portata di clic. Puoi salvare la preferenza nelle impostazioni dell’account.",
    },
    {
      category: "Precisione e dati",
      question: "Zodiaco tropicale o siderale?",
      answer:
        "Tropicale per impostazione predefinita, come nella tradizione astrologica occidentale. Il siderale è disponibile per chi segue la tradizione vedica.",
    },
    {
      category: "Fatturazione",
      question: "Posso annullare in qualsiasi momento?",
      answer:
        "Sì. I piani sono mensili e senza vincoli; annulla con un clic e manterrai l’accesso fino alla fine del periodo già pagato.",
    },
    {
      category: "Fatturazione",
      question: "Cosa succede ai temi salvati se passo a un piano inferiore?",
      answer:
        "Non viene eliminato nulla. Se superi il limite del piano gratuito, i temi meno recenti diventano di sola lettura finché non ne rimuovi alcuni o effettui nuovamente l’upgrade.",
    },
    {
      category: "Astrologi",
      question: "Come funzionano i consulti dal vivo?",
      answer:
        "Sfoglia gli astrologi per specialità, prenota un orario o avvia una chat se sono online e paga al minuto. Al termine troverai un riepilogo scritto nel tuo account.",
    },
  ],
  de: [
    {
      category: "Erste Schritte",
      question: "Brauche ich meine genaue Geburtszeit?",
      answer:
        "Für die Zeichen von Sonne, Mond und Planeten genügt das Datum. Für einen genauen Aszendenten und die Häuser ist die Uhrzeit nötig: Schon zehn Minuten können den Aszendenten verschieben. Wenn du unsicher bist, verwende zunächst Mittag und verfeinere die Angabe später.",
    },
    {
      category: "Erste Schritte",
      question: "Ist Sidera wirklich kostenlos?",
      answer:
        "Die wichtigsten Funktionen — Geburtshoroskop, heutiger Himmel, Mondkalender und Tageshoroskop — bleiben ohne Testphase kostenlos. Bezahlte Tarife ergänzen Speichern, Kompatibilitätswerkzeuge und Berichte.",
    },
    {
      category: "Genauigkeit und Daten",
      question: "Wie genau sind die Berechnungen?",
      answer:
        "Jede Position wird mit der Swiss Ephemeris auf die Bogenminute genau berechnet — derselben Grundlage, die professionelle Astrologen verwenden. Nichts wird angenähert.",
    },
    {
      category: "Genauigkeit und Daten",
      question: "Welches Häusersystem verwendet ihr?",
      answer:
        "Standardmäßig Placidus; Ganzzeichenhäuser, Koch, Gleichhäuser und weitere Systeme sind mit einem Klick verfügbar. Deine bevorzugte Einstellung kannst du im Konto speichern.",
    },
    {
      category: "Genauigkeit und Daten",
      question: "Tropischer oder siderischer Tierkreis?",
      answer:
        "Standardmäßig tropisch, wie in der westlichen Astrologie üblich. Für die vedische Tradition ist der siderische Tierkreis als Umschalter verfügbar.",
    },
    {
      category: "Abrechnung",
      question: "Kann ich jederzeit kündigen?",
      answer:
        "Ja. Die Tarife laufen monatlich ohne Bindung; kündige mit einem Klick und behalte den Zugang bis zum Ende des bezahlten Abrechnungszeitraums.",
    },
    {
      category: "Abrechnung",
      question: "Was passiert mit gespeicherten Horoskopen bei einem Downgrade?",
      answer:
        "Nichts wird gelöscht. Wenn du das Limit des kostenlosen Tarifs überschreitest, werden ältere Horoskope schreibgeschützt, bis du einige entfernst oder erneut ein Upgrade durchführst.",
    },
    {
      category: "Astrologen",
      question: "Wie funktionieren Live-Beratungen?",
      answer:
        "Wähle Astrologen nach Fachgebiet, buche einen Termin oder starte einen Chat, wenn sie online sind, und bezahle pro Minute. Anschließend findest du eine schriftliche Zusammenfassung in deinem Konto.",
    },
  ],
} satisfies Record<SupportedLocale, FaqAccordionItemCopy[]>;

export const getFaqAccordionListCopy = (
  locale: SupportedLocale,
): FaqAccordionItemCopy[] => copyByLocale[locale] ?? copyByLocale.en;
