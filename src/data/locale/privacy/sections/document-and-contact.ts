import type { SupportedLocale } from "../../../localization-contract.ts";

export type PrivacyDocumentSectionCopy = {
  title: string;
  body: string;
};

export type PrivacyDocumentAndContactCopy = {
  sections: readonly PrivacyDocumentSectionCopy[];
  contactText: string;
};

const copyByLocale = {
  en: {
    sections: [
      {
        title: "1. Overview",
        body: "This policy explains what we collect, why, and the control you have. We collect as little as possible and never sell your data.",
      },
      {
        title: "2. Information we collect",
        body: "Account details you provide (name, email), the birth data you enter to cast charts, and basic usage information that helps us improve the product.",
      },
      {
        title: "3. Your birth data",
        body: "Birth date, time and place are used solely to calculate your charts and are stored against your account so you can return to them. They are never sold or shared for advertising.",
      },
      {
        title: "4. How we use information",
        body: "To provide and improve Sidera, to deliver the charts and reports you request, to process payments, and to communicate service updates you have opted into.",
      },
      {
        title: "5. Cookies",
        body: "We use essential cookies to keep you signed in and a small amount of privacy-respecting analytics. We do not run third-party advertising trackers.",
      },
      {
        title: "6. Sharing",
        body: "We share data only with the processors needed to run the service (for example, payment and email providers), each bound by contract to protect it.",
      },
      {
        title: "7. Your rights",
        body: "You may access, export or delete your data at any time from your account settings, or by contacting us. Deletion removes your charts and personal details permanently.",
      },
      {
        title: "8. Retention",
        body: "We keep your data while your account is active. If you delete your account, we remove personal data promptly except where the law requires us to retain records.",
      },
      {
        title: "9. Security",
        body: "Data is encrypted in transit and at rest, and access is restricted to the systems and staff that need it.",
      },
      {
        title: "10. Changes",
        body: "We will post any material changes here and, where appropriate, notify you by email before they take effect.",
      },
    ],
    contactText: "Questions? Reach us at hello@sidera.co.",
  },
  es: {
    sections: [
      {
        title: "1. Descripción general",
        body: "Esta política explica qué recopilamos, por qué y qué control tienes. Recopilamos lo mínimo posible y nunca vendemos tus datos.",
      },
      {
        title: "2. Información que recopilamos",
        body: "Los datos de cuenta que proporcionas (nombre y correo electrónico), los datos de nacimiento que introduces para crear cartas y la información básica de uso que nos ayuda a mejorar el producto.",
      },
      {
        title: "3. Tus datos de nacimiento",
        body: "La fecha, hora y lugar de nacimiento se utilizan únicamente para calcular tus cartas y se guardan en tu cuenta para que puedas volver a consultarlas. Nunca se venden ni comparten con fines publicitarios.",
      },
      {
        title: "4. Cómo utilizamos la información",
        body: "Para ofrecer y mejorar Sidera, entregar las cartas e informes que solicitas, procesar pagos y comunicar las novedades del servicio que hayas aceptado recibir.",
      },
      {
        title: "5. Cookies",
        body: "Utilizamos cookies esenciales para mantener tu sesión iniciada y una pequeña cantidad de analítica respetuosa con la privacidad. No usamos rastreadores publicitarios de terceros.",
      },
      {
        title: "6. Intercambio de datos",
        body: "Solo compartimos datos con los proveedores necesarios para operar el servicio (por ejemplo, proveedores de pagos y correo electrónico), todos obligados por contrato a protegerlos.",
      },
      {
        title: "7. Tus derechos",
        body: "Puedes acceder, exportar o eliminar tus datos en cualquier momento desde la configuración de tu cuenta o contactándonos. La eliminación borra permanentemente tus cartas y datos personales.",
      },
      {
        title: "8. Conservación",
        body: "Conservamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta, retiramos los datos personales sin demora, salvo cuando la ley nos obligue a conservar registros.",
      },
      {
        title: "9. Seguridad",
        body: "Los datos se cifran en tránsito y en reposo, y el acceso se limita a los sistemas y al personal que lo necesitan.",
      },
      {
        title: "10. Cambios",
        body: "Publicaremos aquí cualquier cambio importante y, cuando corresponda, te avisaremos por correo electrónico antes de que entre en vigor.",
      },
    ],
    contactText: "¿Tienes preguntas? Escríbenos a hello@sidera.co.",
  },
  fr: {
    sections: [
      {
        title: "1. Présentation",
        body: "Cette politique explique les données que nous recueillons, pourquoi nous le faisons et le contrôle dont vous disposez. Nous recueillons le moins de données possible et ne les vendons jamais.",
      },
      {
        title: "2. Informations recueillies",
        body: "Les informations de compte que vous fournissez (nom, adresse e-mail), les données de naissance saisies pour établir vos thèmes et des informations d’utilisation élémentaires qui nous aident à améliorer le produit.",
      },
      {
        title: "3. Vos données de naissance",
        body: "La date, l’heure et le lieu de naissance servent uniquement à calculer vos thèmes et sont associés à votre compte pour que vous puissiez les retrouver. Ils ne sont jamais vendus ni partagés à des fins publicitaires.",
      },
      {
        title: "4. Utilisation des informations",
        body: "Pour fournir et améliorer Sidera, livrer les thèmes et rapports demandés, traiter les paiements et communiquer les actualités du service auxquelles vous avez choisi de vous abonner.",
      },
      {
        title: "5. Cookies",
        body: "Nous utilisons des cookies essentiels pour maintenir votre connexion ainsi qu’un volume limité de données analytiques respectueuses de la vie privée. Nous n’utilisons aucun traceur publicitaire tiers.",
      },
      {
        title: "6. Partage",
        body: "Nous partageons les données uniquement avec les prestataires nécessaires au fonctionnement du service (par exemple les prestataires de paiement et de messagerie), chacun étant tenu contractuellement de les protéger.",
      },
      {
        title: "7. Vos droits",
        body: "Vous pouvez accéder à vos données, les exporter ou les supprimer à tout moment depuis les paramètres de votre compte ou en nous contactant. La suppression efface définitivement vos thèmes et informations personnelles.",
      },
      {
        title: "8. Conservation",
        body: "Nous conservons vos données tant que votre compte est actif. Si vous supprimez votre compte, nous effaçons rapidement les données personnelles, sauf lorsque la loi nous impose de conserver certains registres.",
      },
      {
        title: "9. Sécurité",
        body: "Les données sont chiffrées en transit et au repos, et leur accès est limité aux systèmes et aux membres du personnel qui en ont besoin.",
      },
      {
        title: "10. Modifications",
        body: "Nous publierons ici toute modification importante et, le cas échéant, vous en informerons par e-mail avant son entrée en vigueur.",
      },
    ],
    contactText: "Des questions ? Écrivez-nous à hello@sidera.co.",
  },
  pt: {
    sections: [
      {
        title: "1. Visão geral",
        body: "Esta política explica o que coletamos, por quê e qual controle você possui. Coletamos o mínimo possível e nunca vendemos seus dados.",
      },
      {
        title: "2. Informações que coletamos",
        body: "Os dados da conta que você fornece (nome e e-mail), os dados de nascimento inseridos para criar mapas e informações básicas de uso que nos ajudam a melhorar o produto.",
      },
      {
        title: "3. Seus dados de nascimento",
        body: "A data, a hora e o local de nascimento são usados somente para calcular seus mapas e ficam armazenados em sua conta para que você possa consultá-los novamente. Eles nunca são vendidos nem compartilhados para publicidade.",
      },
      {
        title: "4. Como usamos as informações",
        body: "Para fornecer e melhorar a Sidera, entregar os mapas e relatórios solicitados, processar pagamentos e comunicar atualizações do serviço que você escolheu receber.",
      },
      {
        title: "5. Cookies",
        body: "Usamos cookies essenciais para manter sua sessão e uma pequena quantidade de análises que respeitam a privacidade. Não usamos rastreadores de publicidade de terceiros.",
      },
      {
        title: "6. Compartilhamento",
        body: "Compartilhamos dados apenas com os operadores necessários para manter o serviço (por exemplo, provedores de pagamento e e-mail), todos contratualmente obrigados a protegê-los.",
      },
      {
        title: "7. Seus direitos",
        body: "Você pode acessar, exportar ou excluir seus dados a qualquer momento nas configurações da conta ou entrando em contato conosco. A exclusão remove permanentemente seus mapas e dados pessoais.",
      },
      {
        title: "8. Retenção",
        body: "Mantemos seus dados enquanto sua conta estiver ativa. Se você excluir a conta, removeremos prontamente os dados pessoais, exceto quando a lei exigir a conservação de registros.",
      },
      {
        title: "9. Segurança",
        body: "Os dados são criptografados em trânsito e em repouso, e o acesso é restrito aos sistemas e funcionários que precisam deles.",
      },
      {
        title: "10. Alterações",
        body: "Publicaremos aqui todas as alterações relevantes e, quando apropriado, enviaremos um aviso por e-mail antes que entrem em vigor.",
      },
    ],
    contactText: "Dúvidas? Fale conosco pelo e-mail hello@sidera.co.",
  },
  ru: {
    sections: [
      {
        title: "1. Общие положения",
        body: "Эта политика объясняет, какие данные мы собираем, зачем и как вы можете ими управлять. Мы собираем минимум необходимых данных и никогда их не продаём.",
      },
      {
        title: "2. Какие данные мы собираем",
        body: "Предоставленные вами данные учётной записи (имя и адрес электронной почты), сведения о рождении для построения карт и базовую информацию об использовании, которая помогает нам улучшать продукт.",
      },
      {
        title: "3. Ваши данные о рождении",
        body: "Дата, время и место рождения используются исключительно для расчёта ваших карт и сохраняются в учётной записи, чтобы вы могли к ним вернуться. Они никогда не продаются и не передаются для рекламы.",
      },
      {
        title: "4. Как мы используем информацию",
        body: "Чтобы предоставлять и улучшать Sidera, создавать запрошенные вами карты и отчёты, обрабатывать платежи и сообщать об обновлениях сервиса, на которые вы подписались.",
      },
      {
        title: "5. Файлы cookie",
        body: "Мы используем необходимые файлы cookie для сохранения входа и небольшой объём аналитики, учитывающей конфиденциальность. Мы не используем сторонние рекламные трекеры.",
      },
      {
        title: "6. Передача данных",
        body: "Мы передаём данные только обработчикам, необходимым для работы сервиса (например, платёжным и почтовым провайдерам), каждый из которых обязан защищать их по договору.",
      },
      {
        title: "7. Ваши права",
        body: "Вы можете в любое время получить, экспортировать или удалить свои данные в настройках учётной записи либо связавшись с нами. При удалении ваши карты и личные данные стираются безвозвратно.",
      },
      {
        title: "8. Срок хранения",
        body: "Мы храним данные, пока ваша учётная запись активна. После её удаления мы оперативно удаляем персональные данные, кроме записей, которые обязаны хранить по закону.",
      },
      {
        title: "9. Безопасность",
        body: "Данные шифруются при передаче и хранении, а доступ к ним имеют только необходимые системы и сотрудники.",
      },
      {
        title: "10. Изменения",
        body: "Мы опубликуем здесь все существенные изменения и, когда это уместно, уведомим вас по электронной почте до их вступления в силу.",
      },
    ],
    contactText: "Есть вопросы? Напишите нам: hello@sidera.co.",
  },
  it: {
    sections: [
      {
        title: "1. Panoramica",
        body: "Questa informativa spiega quali dati raccogliamo, perché e quale controllo hai. Raccogliamo il minimo possibile e non vendiamo mai i tuoi dati.",
      },
      {
        title: "2. Informazioni raccolte",
        body: "I dati dell’account che fornisci (nome ed e-mail), i dati di nascita inseriti per creare i temi e le informazioni di base sull’utilizzo che ci aiutano a migliorare il prodotto.",
      },
      {
        title: "3. I tuoi dati di nascita",
        body: "Data, ora e luogo di nascita vengono utilizzati esclusivamente per calcolare i tuoi temi e sono salvati nel tuo account affinché tu possa consultarli di nuovo. Non vengono mai venduti né condivisi a fini pubblicitari.",
      },
      {
        title: "4. Come utilizziamo le informazioni",
        body: "Per fornire e migliorare Sidera, consegnare i temi e i report richiesti, elaborare i pagamenti e comunicare gli aggiornamenti del servizio che hai scelto di ricevere.",
      },
      {
        title: "5. Cookie",
        body: "Utilizziamo cookie essenziali per mantenere l’accesso e una quantità limitata di dati analitici rispettosi della privacy. Non utilizziamo tracker pubblicitari di terze parti.",
      },
      {
        title: "6. Condivisione",
        body: "Condividiamo i dati solo con i responsabili necessari al funzionamento del servizio (ad esempio fornitori di pagamenti ed e-mail), ciascuno contrattualmente tenuto a proteggerli.",
      },
      {
        title: "7. I tuoi diritti",
        body: "Puoi accedere, esportare o eliminare i tuoi dati in qualsiasi momento dalle impostazioni dell’account o contattandoci. L’eliminazione rimuove definitivamente i tuoi temi e dati personali.",
      },
      {
        title: "8. Conservazione",
        body: "Conserviamo i tuoi dati finché l’account è attivo. Se elimini l’account, rimuoviamo tempestivamente i dati personali, salvo quando la legge ci impone di conservare determinate registrazioni.",
      },
      {
        title: "9. Sicurezza",
        body: "I dati sono crittografati in transito e a riposo e l’accesso è limitato ai sistemi e al personale che ne hanno bisogno.",
      },
      {
        title: "10. Modifiche",
        body: "Pubblicheremo qui ogni modifica sostanziale e, quando opportuno, ti avviseremo via e-mail prima che entri in vigore.",
      },
    ],
    contactText: "Domande? Scrivici a hello@sidera.co.",
  },
  de: {
    sections: [
      {
        title: "1. Überblick",
        body: "Diese Richtlinie erklärt, welche Daten wir erheben, warum wir dies tun und welche Kontrolle Sie haben. Wir erheben so wenig wie möglich und verkaufen Ihre Daten niemals.",
      },
      {
        title: "2. Von uns erhobene Informationen",
        body: "Von Ihnen angegebene Kontodaten (Name und E-Mail-Adresse), die zur Horoskoperstellung eingegebenen Geburtsdaten sowie grundlegende Nutzungsinformationen, die uns helfen, das Produkt zu verbessern.",
      },
      {
        title: "3. Ihre Geburtsdaten",
        body: "Geburtsdatum, -zeit und -ort werden ausschließlich zur Berechnung Ihrer Horoskope verwendet und in Ihrem Konto gespeichert, damit Sie später darauf zugreifen können. Sie werden niemals verkauft oder für Werbung weitergegeben.",
      },
      {
        title: "4. Verwendung von Informationen",
        body: "Um Sidera bereitzustellen und zu verbessern, die angeforderten Horoskope und Berichte zu liefern, Zahlungen abzuwickeln und über von Ihnen abonnierte Serviceaktualisierungen zu informieren.",
      },
      {
        title: "5. Cookies",
        body: "Wir verwenden notwendige Cookies, damit Sie angemeldet bleiben, sowie in geringem Umfang datenschutzfreundliche Analysen. Wir setzen keine Werbetracker von Drittanbietern ein.",
      },
      {
        title: "6. Weitergabe",
        body: "Wir geben Daten nur an die für den Betrieb des Dienstes erforderlichen Auftragsverarbeiter weiter (zum Beispiel Zahlungs- und E-Mail-Anbieter), die jeweils vertraglich zu ihrem Schutz verpflichtet sind.",
      },
      {
        title: "7. Ihre Rechte",
        body: "Sie können Ihre Daten jederzeit über die Kontoeinstellungen oder durch Kontaktaufnahme mit uns abrufen, exportieren oder löschen. Bei der Löschung werden Ihre Horoskope und persönlichen Daten dauerhaft entfernt.",
      },
      {
        title: "8. Aufbewahrung",
        body: "Wir speichern Ihre Daten, solange Ihr Konto aktiv ist. Wenn Sie Ihr Konto löschen, entfernen wir personenbezogene Daten zeitnah, sofern wir nicht gesetzlich zur Aufbewahrung bestimmter Unterlagen verpflichtet sind.",
      },
      {
        title: "9. Sicherheit",
        body: "Daten werden bei der Übertragung und Speicherung verschlüsselt. Der Zugriff ist auf die Systeme und Mitarbeitenden beschränkt, die ihn benötigen.",
      },
      {
        title: "10. Änderungen",
        body: "Wir veröffentlichen wesentliche Änderungen hier und informieren Sie gegebenenfalls per E-Mail, bevor sie in Kraft treten.",
      },
    ],
    contactText: "Fragen? Schreiben Sie uns an hello@sidera.co.",
  },
} satisfies Record<SupportedLocale, PrivacyDocumentAndContactCopy>;

export const getPrivacyDocumentAndContactCopy = (
  locale: SupportedLocale,
): PrivacyDocumentAndContactCopy => copyByLocale[locale] ?? copyByLocale.en;
