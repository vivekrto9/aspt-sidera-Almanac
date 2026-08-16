import type { SupportedLocale } from "../../../localization-contract.ts";

export type AccountPeopleCopy = {
  eyebrow: string;
  title: string;
  synastryLabel: string;
  ownProfileLabel: string;
  generateBirthChartLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel: string;
};

const copy: Record<SupportedLocale, AccountPeopleCopy> = {
  en: {
    eyebrow: "People",
    title: "People you track",
    synastryLabel: "Check synastry",
    ownProfileLabel: "Your profile",
    generateBirthChartLabel: "Generate birth chart",
    emptyTitle: "No people added yet",
    emptyDescription:
      "Create a birth profile for someone you care about to track their chart here.",
    emptyActionLabel: "+ Add a person",
  },
  es: {
    eyebrow: "Personas",
    title: "Personas que sigues",
    synastryLabel: "Comprobar sinastría",
    ownProfileLabel: "Tu perfil",
    generateBirthChartLabel: "Generar carta natal",
    emptyTitle: "Aún no has añadido personas",
    emptyDescription:
      "Crea un perfil natal de alguien importante para seguir su carta aquí.",
    emptyActionLabel: "+ Añadir una persona",
  },
  fr: {
    eyebrow: "Personnes",
    title: "Personnes que vous suivez",
    synastryLabel: "Vérifier la synastrie",
    ownProfileLabel: "Votre profil",
    generateBirthChartLabel: "Générer le thème natal",
    emptyTitle: "Aucune personne ajoutée",
    emptyDescription:
      "Créez le profil natal d’un proche pour suivre son thème ici.",
    emptyActionLabel: "+ Ajouter une personne",
  },
  pt: {
    eyebrow: "Pessoas",
    title: "Pessoas que você acompanha",
    synastryLabel: "Verificar sinastria",
    ownProfileLabel: "Seu perfil",
    generateBirthChartLabel: "Gerar mapa natal",
    emptyTitle: "Nenhuma pessoa adicionada",
    emptyDescription:
      "Crie o perfil natal de alguém importante para acompanhar o mapa aqui.",
    emptyActionLabel: "+ Adicionar uma pessoa",
  },
  ru: {
    eyebrow: "Люди",
    title: "Люди, за которыми вы следите",
    synastryLabel: "Проверить синастрию",
    ownProfileLabel: "Ваш профиль",
    generateBirthChartLabel: "Создать натальную карту",
    emptyTitle: "Людей пока нет",
    emptyDescription:
      "Создайте профиль рождения близкого человека, чтобы отслеживать его карту здесь.",
    emptyActionLabel: "+ Добавить человека",
  },
  it: {
    eyebrow: "Persone",
    title: "Persone che segui",
    synastryLabel: "Verifica sinastria",
    ownProfileLabel: "Il tuo profilo",
    generateBirthChartLabel: "Genera tema natale",
    emptyTitle: "Nessuna persona aggiunta",
    emptyDescription:
      "Crea il profilo natale di una persona cara per seguire qui il suo tema.",
    emptyActionLabel: "+ Aggiungi una persona",
  },
  de: {
    eyebrow: "Personen",
    title: "Personen, denen Sie folgen",
    synastryLabel: "Synastrie prüfen",
    ownProfileLabel: "Ihr Profil",
    generateBirthChartLabel: "Geburtshoroskop erstellen",
    emptyTitle: "Noch keine Personen hinzugefügt",
    emptyDescription:
      "Erstellen Sie ein Geburtsprofil für einen wichtigen Menschen, um sein Horoskop hier zu verfolgen.",
    emptyActionLabel: "+ Person hinzufügen",
  },
};

export const getAccountPeopleCopy = (locale: SupportedLocale) => copy[locale];
