import type { SupportedLocale } from "../../../localization-contract.ts";

export type TermsDocumentSectionCopy = {
  title: string;
  body: string;
};

export type TermsDocumentAndContactCopy = {
  sections: readonly TermsDocumentSectionCopy[];
  contactText: string;
};

const copyByLocale = {
  en: {
    sections: [
      {
        title: "1. Acceptance",
        body: "By creating an account or using Sidera, you agree to these terms. If you do not agree, please do not use the service.",
      },
      {
        title: "2. Your account",
        body: "You are responsible for keeping your login secure and for activity under your account. Provide accurate information and keep it current.",
      },
      {
        title: "3. Acceptable use",
        body: "Use Sidera for personal, lawful purposes. Do not attempt to disrupt the service, scrape it at scale, or resell access without permission.",
      },
      {
        title: "4. Payments and wallet credits",
        body: "Wallet credits are purchased through one-time payments and used for eligible Sidera services, including astrologer chats. Charges are non-refundable except where required by law.",
      },
      {
        title: "5. Astrologer sessions",
        body: "Live readings are provided by independent astrologers. They are for reflection and entertainment, are billed by the minute, and are not a substitute for professional advice.",
      },
      {
        title: "6. Intellectual property",
        body: "The Sidera name, software, written interpretations and design are our property. Your charts and personal data remain yours.",
      },
      {
        title: "7. Entertainment disclaimer",
        body: "Astrological content is offered for insight and entertainment. It is not medical, legal, financial or psychological advice, and no outcome is guaranteed.",
      },
      {
        title: "8. Limitation of liability",
        body: "To the extent permitted by law, Sidera is not liable for indirect or consequential losses arising from use of the service.",
      },
      {
        title: "9. Termination",
        body: "You may close your account anytime. We may suspend accounts that breach these terms, with notice where practical.",
      },
      {
        title: "10. Changes and governing law",
        body: "We may update these terms and will post changes here. These terms are governed by the laws of the jurisdiction in which Sidera operates.",
      },
    ],
    contactText: "Questions? Reach us at hello@sidera.co.",
  },
  es: {
    sections: [
      {
        title: "1. Aceptación",
        body: "Al crear una cuenta o utilizar Sidera, aceptas estas condiciones. Si no estás de acuerdo, no utilices el servicio.",
      },
      {
        title: "2. Tu cuenta",
        body: "Eres responsable de mantener seguras tus credenciales y de la actividad realizada con tu cuenta. Proporciona información correcta y mantenla actualizada.",
      },
      {
        title: "3. Uso aceptable",
        body: "Utiliza Sidera con fines personales y legales. No intentes interrumpir el servicio, extraer datos a gran escala ni revender el acceso sin permiso.",
      },
      {
        title: "4. Pagos y créditos de cartera",
        body: "Los créditos de la cartera se compran mediante pagos únicos y se utilizan para servicios elegibles de Sidera, incluidos los chats con astrólogos. Los cargos no son reembolsables salvo cuando la ley lo exija.",
      },
      {
        title: "5. Sesiones con astrólogos",
        body: "Las consultas en directo son ofrecidas por astrólogos independientes. Están destinadas a la reflexión y el entretenimiento, se cobran por minuto y no sustituyen el asesoramiento profesional.",
      },
      {
        title: "6. Propiedad intelectual",
        body: "El nombre Sidera, el software, las interpretaciones escritas y el diseño son de nuestra propiedad. Tus cartas y datos personales siguen siendo tuyos.",
      },
      {
        title: "7. Aviso sobre entretenimiento",
        body: "El contenido astrológico se ofrece con fines informativos y de entretenimiento. No constituye asesoramiento médico, legal, financiero ni psicológico, y no se garantiza ningún resultado.",
      },
      {
        title: "8. Limitación de responsabilidad",
        body: "En la medida permitida por la ley, Sidera no será responsable de pérdidas indirectas o consecuentes derivadas del uso del servicio.",
      },
      {
        title: "9. Terminación",
        body: "Puedes cerrar tu cuenta en cualquier momento. Podemos suspender las cuentas que incumplan estas condiciones, avisando cuando sea posible.",
      },
      {
        title: "10. Cambios y legislación aplicable",
        body: "Podemos actualizar estas condiciones y publicaremos aquí los cambios. Estas condiciones se rigen por las leyes de la jurisdicción en la que opera Sidera.",
      },
    ],
    contactText: "¿Tienes preguntas? Escríbenos a hello@sidera.co.",
  },
  fr: {
    sections: [
      {
        title: "1. Acceptation",
        body: "En créant un compte ou en utilisant Sidera, vous acceptez les présentes conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le service.",
      },
      {
        title: "2. Votre compte",
        body: "Vous êtes responsable de la sécurité de vos identifiants et de l’activité effectuée depuis votre compte. Fournissez des informations exactes et tenez-les à jour.",
      },
      {
        title: "3. Utilisation acceptable",
        body: "Utilisez Sidera à des fins personnelles et licites. N’essayez pas de perturber le service, d’en extraire des données à grande échelle ou d’en revendre l’accès sans autorisation.",
      },
      {
        title: "4. Paiements et crédits du portefeuille",
        body: "Les crédits du portefeuille sont achetés par paiement unique et utilisés pour les services Sidera éligibles, notamment les chats avec des astrologues. Les frais ne sont pas remboursables, sauf obligation légale.",
      },
      {
        title: "5. Consultations astrologiques",
        body: "Les consultations en direct sont proposées par des astrologues indépendants. Elles sont destinées à la réflexion et au divertissement, facturées à la minute et ne remplacent pas un avis professionnel.",
      },
      {
        title: "6. Propriété intellectuelle",
        body: "Le nom Sidera, le logiciel, les interprétations écrites et le design nous appartiennent. Vos thèmes et vos données personnelles restent les vôtres.",
      },
      {
        title: "7. Avertissement relatif au divertissement",
        body: "Le contenu astrologique est proposé à titre informatif et de divertissement. Il ne constitue pas un avis médical, juridique, financier ou psychologique, et aucun résultat n’est garanti.",
      },
      {
        title: "8. Limitation de responsabilité",
        body: "Dans la mesure permise par la loi, Sidera n’est pas responsable des pertes indirectes ou consécutives résultant de l’utilisation du service.",
      },
      {
        title: "9. Résiliation",
        body: "Vous pouvez fermer votre compte à tout moment. Nous pouvons suspendre les comptes qui enfreignent les présentes conditions, avec préavis lorsque cela est possible.",
      },
      {
        title: "10. Modifications et droit applicable",
        body: "Nous pouvons modifier ces conditions et publierons les changements ici. Elles sont régies par les lois de la juridiction dans laquelle Sidera exerce ses activités.",
      },
    ],
    contactText: "Des questions ? Écrivez-nous à hello@sidera.co.",
  },
  pt: {
    sections: [
      {
        title: "1. Aceitação",
        body: "Ao criar uma conta ou usar a Sidera, você concorda com estes termos. Se não concordar, não utilize o serviço.",
      },
      {
        title: "2. Sua conta",
        body: "Você é responsável por manter seus dados de acesso seguros e pelas atividades realizadas em sua conta. Forneça informações corretas e mantenha-as atualizadas.",
      },
      {
        title: "3. Uso aceitável",
        body: "Use a Sidera para fins pessoais e legais. Não tente interromper o serviço, coletar dados em grande escala ou revender o acesso sem permissão.",
      },
      {
        title: "4. Pagamentos e créditos da carteira",
        body: "Os créditos da carteira são comprados por pagamentos únicos e usados em serviços elegíveis da Sidera, incluindo chats com astrólogos. As cobranças não são reembolsáveis, salvo quando exigido por lei.",
      },
      {
        title: "5. Consultas com astrólogos",
        body: "As consultas ao vivo são oferecidas por astrólogos independentes. Elas se destinam à reflexão e ao entretenimento, são cobradas por minuto e não substituem aconselhamento profissional.",
      },
      {
        title: "6. Propriedade intelectual",
        body: "O nome Sidera, o software, as interpretações escritas e o design são de nossa propriedade. Seus mapas e dados pessoais continuam sendo seus.",
      },
      {
        title: "7. Aviso de entretenimento",
        body: "O conteúdo astrológico é oferecido para reflexão e entretenimento. Ele não constitui aconselhamento médico, jurídico, financeiro ou psicológico, e nenhum resultado é garantido.",
      },
      {
        title: "8. Limitação de responsabilidade",
        body: "Na medida permitida por lei, a Sidera não se responsabiliza por perdas indiretas ou consequentes decorrentes do uso do serviço.",
      },
      {
        title: "9. Encerramento",
        body: "Você pode encerrar sua conta a qualquer momento. Podemos suspender contas que violem estes termos, com aviso quando possível.",
      },
      {
        title: "10. Alterações e legislação aplicável",
        body: "Podemos atualizar estes termos e publicaremos as alterações aqui. Estes termos são regidos pelas leis da jurisdição em que a Sidera opera.",
      },
    ],
    contactText: "Dúvidas? Fale conosco pelo e-mail hello@sidera.co.",
  },
  ru: {
    sections: [
      {
        title: "1. Принятие условий",
        body: "Создавая учётную запись или используя Sidera, вы соглашаетесь с настоящими условиями. Если вы с ними не согласны, пожалуйста, не используйте сервис.",
      },
      {
        title: "2. Ваша учётная запись",
        body: "Вы отвечаете за безопасность данных для входа и за действия, совершённые с вашей учётной записью. Указывайте достоверную информацию и своевременно обновляйте её.",
      },
      {
        title: "3. Допустимое использование",
        body: "Используйте Sidera в личных и законных целях. Не пытайтесь нарушить работу сервиса, массово собирать данные или перепродавать доступ без разрешения.",
      },
      {
        title: "4. Платежи и средства кошелька",
        body: "Средства кошелька приобретаются разовыми платежами и используются для доступных услуг Sidera, включая чаты с астрологами. Платежи не возвращаются, кроме случаев, предусмотренных законом.",
      },
      {
        title: "5. Сеансы с астрологами",
        body: "Живые консультации проводят независимые астрологи. Они предназначены для размышления и развлечения, оплачиваются поминутно и не заменяют профессиональную консультацию.",
      },
      {
        title: "6. Интеллектуальная собственность",
        body: "Название Sidera, программное обеспечение, письменные интерпретации и дизайн принадлежат нам. Ваши карты и персональные данные остаются вашими.",
      },
      {
        title: "7. Развлекательный характер",
        body: "Астрологический контент предлагается для осмысления и развлечения. Он не является медицинской, юридической, финансовой или психологической консультацией, и никакой результат не гарантируется.",
      },
      {
        title: "8. Ограничение ответственности",
        body: "В пределах, разрешённых законом, Sidera не несёт ответственности за косвенные или последующие убытки, возникшие при использовании сервиса.",
      },
      {
        title: "9. Прекращение использования",
        body: "Вы можете закрыть учётную запись в любое время. Мы можем приостановить действие учётных записей, нарушающих эти условия, заранее уведомив об этом, когда это возможно.",
      },
      {
        title: "10. Изменения и применимое право",
        body: "Мы можем обновлять эти условия и будем публиковать изменения здесь. Условия регулируются законодательством юрисдикции, в которой работает Sidera.",
      },
    ],
    contactText: "Есть вопросы? Напишите нам: hello@sidera.co.",
  },
  it: {
    sections: [
      {
        title: "1. Accettazione",
        body: "Creando un account o utilizzando Sidera, accetti questi termini. Se non li accetti, ti invitiamo a non utilizzare il servizio.",
      },
      {
        title: "2. Il tuo account",
        body: "Sei responsabile della sicurezza delle tue credenziali e delle attività svolte tramite il tuo account. Fornisci informazioni accurate e mantienile aggiornate.",
      },
      {
        title: "3. Uso consentito",
        body: "Utilizza Sidera per scopi personali e leciti. Non tentare di interrompere il servizio, estrarre dati su larga scala o rivendere l’accesso senza autorizzazione.",
      },
      {
        title: "4. Pagamenti e crediti del portafoglio",
        body: "I crediti del portafoglio vengono acquistati con pagamenti una tantum e utilizzati per i servizi Sidera idonei, comprese le chat con gli astrologi. Gli addebiti non sono rimborsabili, salvo ove previsto dalla legge.",
      },
      {
        title: "5. Consulti con gli astrologi",
        body: "I consulti dal vivo sono forniti da astrologi indipendenti. Sono destinati alla riflessione e all’intrattenimento, vengono fatturati al minuto e non sostituiscono una consulenza professionale.",
      },
      {
        title: "6. Proprietà intellettuale",
        body: "Il nome Sidera, il software, le interpretazioni scritte e il design sono di nostra proprietà. I tuoi temi e i tuoi dati personali restano tuoi.",
      },
      {
        title: "7. Avvertenza sull’intrattenimento",
        body: "I contenuti astrologici sono offerti a scopo informativo e di intrattenimento. Non costituiscono consulenza medica, legale, finanziaria o psicologica e non garantiscono alcun risultato.",
      },
      {
        title: "8. Limitazione di responsabilità",
        body: "Nella misura consentita dalla legge, Sidera non è responsabile per perdite indirette o consequenziali derivanti dall’uso del servizio.",
      },
      {
        title: "9. Cessazione",
        body: "Puoi chiudere il tuo account in qualsiasi momento. Possiamo sospendere gli account che violano questi termini, dandone comunicazione quando possibile.",
      },
      {
        title: "10. Modifiche e legge applicabile",
        body: "Possiamo aggiornare questi termini e pubblicheremo qui le modifiche. I termini sono regolati dalle leggi della giurisdizione in cui opera Sidera.",
      },
    ],
    contactText: "Domande? Scrivici a hello@sidera.co.",
  },
  de: {
    sections: [
      {
        title: "1. Zustimmung",
        body: "Mit der Erstellung eines Kontos oder der Nutzung von Sidera stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie den Dienst bitte nicht.",
      },
      {
        title: "2. Ihr Konto",
        body: "Sie sind dafür verantwortlich, Ihre Anmeldedaten zu schützen und für Aktivitäten unter Ihrem Konto. Geben Sie korrekte Informationen an und halten Sie diese aktuell.",
      },
      {
        title: "3. Zulässige Nutzung",
        body: "Nutzen Sie Sidera für persönliche und rechtmäßige Zwecke. Versuchen Sie nicht, den Dienst zu stören, Daten in großem Umfang auszulesen oder den Zugang ohne Erlaubnis weiterzuverkaufen.",
      },
      {
        title: "4. Zahlungen und Wallet-Guthaben",
        body: "Wallet-Guthaben wird durch einmalige Zahlungen erworben und für berechtigte Sidera-Dienste verwendet, einschließlich Chats mit Astrologen. Gebühren werden nur erstattet, wenn dies gesetzlich vorgeschrieben ist.",
      },
      {
        title: "5. Sitzungen mit Astrologen",
        body: "Live-Beratungen werden von unabhängigen Astrologen angeboten. Sie dienen der Reflexion und Unterhaltung, werden minutengenau abgerechnet und ersetzen keine professionelle Beratung.",
      },
      {
        title: "6. Geistiges Eigentum",
        body: "Der Name Sidera, die Software, schriftliche Deutungen und das Design sind unser Eigentum. Ihre Horoskope und persönlichen Daten bleiben Ihr Eigentum.",
      },
      {
        title: "7. Unterhaltungshinweis",
        body: "Astrologische Inhalte dienen der Einsicht und Unterhaltung. Sie stellen keine medizinische, rechtliche, finanzielle oder psychologische Beratung dar, und es wird kein Ergebnis garantiert.",
      },
      {
        title: "8. Haftungsbeschränkung",
        body: "Soweit gesetzlich zulässig, haftet Sidera nicht für mittelbare Schäden oder Folgeschäden, die aus der Nutzung des Dienstes entstehen.",
      },
      {
        title: "9. Beendigung",
        body: "Sie können Ihr Konto jederzeit schließen. Wir können Konten sperren, die gegen diese Bedingungen verstoßen, und informieren Sie darüber, soweit dies praktikabel ist.",
      },
      {
        title: "10. Änderungen und anwendbares Recht",
        body: "Wir können diese Bedingungen aktualisieren und werden Änderungen hier veröffentlichen. Sie unterliegen dem Recht der Jurisdiktion, in der Sidera tätig ist.",
      },
    ],
    contactText: "Fragen? Schreiben Sie uns an hello@sidera.co.",
  },
} satisfies Record<SupportedLocale, TermsDocumentAndContactCopy>;

export const getTermsDocumentAndContactCopy = (
  locale: SupportedLocale,
): TermsDocumentAndContactCopy => copyByLocale[locale] ?? copyByLocale.en;
