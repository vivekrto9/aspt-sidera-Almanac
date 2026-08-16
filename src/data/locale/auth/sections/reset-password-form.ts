import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthResetPasswordFormCopy = {
  heading: string;
  subheading: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  passwordHint: string;
  submitLabel: string;
  loadingLabel: string;
  successLabel: string;
  mismatchLabel: string;
  invalidPasswordLabel: string;
  loginPrompt: string;
  loginLabel: string;
};

const copyByLocale = {
  en: {
    heading: "Set your new password",
    subheading: "Choose a strong password to protect your account.",
    passwordLabel: "New password",
    passwordPlaceholder: "Create a strong password",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    passwordHint: "Use at least 8 characters.",
    submitLabel: "Reset password",
    loadingLabel: "Saving your new password…",
    successLabel: "Your password has been updated. You can sign in now.",
    mismatchLabel: "Passwords do not match.",
    invalidPasswordLabel: "Enter a valid password.",
    loginPrompt: "Need to sign in instead?",
    loginLabel: "Sign in",
  },
  es: {
    heading: "Configura tu nueva contraseña",
    subheading: "Elige una contraseña segura para proteger tu cuenta.",
    passwordLabel: "Nueva contraseña",
    passwordPlaceholder: "Crea una contraseña fuerte",
    confirmPasswordLabel: "Confirmar contraseña",
    confirmPasswordPlaceholder: "Vuelve a introducir tu contraseña",
    passwordHint: "Usa al menos 8 caracteres.",
    submitLabel: "Restablecer contraseña",
    loadingLabel: "Guardando tu contraseña nueva…",
    successLabel: "Tu contraseña se ha actualizado. Ya puedes iniciar sesión.",
    mismatchLabel: "Las contraseñas no coinciden.",
    invalidPasswordLabel: "Introduce una contraseña válida.",
    loginPrompt: "¿Quieres iniciar sesión en su lugar?",
    loginLabel: "Iniciar sesión",
  },
  fr: {
    heading: "Définissez votre nouveau mot de passe",
    subheading: "Choisissez un mot de passe fort pour protéger votre compte.",
    passwordLabel: "Nouveau mot de passe",
    passwordPlaceholder: "Créez un mot de passe solide",
    confirmPasswordLabel: "Confirmer le mot de passe",
    confirmPasswordPlaceholder: "Retapez le mot de passe",
    passwordHint: "Utilisez au moins 8 caractères.",
    submitLabel: "Réinitialiser le mot de passe",
    loadingLabel: "Enregistrement de votre nouveau mot de passe…",
    successLabel:
      "Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.",
    mismatchLabel: "Les mots de passe ne correspondent pas.",
    invalidPasswordLabel: "Entrez un mot de passe valide.",
    loginPrompt: "Voulez-vous plutôt vous connecter ?",
    loginLabel: "Se connecter",
  },
  pt: {
    heading: "Defina sua nova senha",
    subheading: "Escolha uma senha forte para proteger sua conta.",
    passwordLabel: "Nova senha",
    passwordPlaceholder: "Crie uma senha forte",
    confirmPasswordLabel: "Confirmar senha",
    confirmPasswordPlaceholder: "Repita sua senha",
    passwordHint: "Use pelo menos 8 caracteres.",
    submitLabel: "Redefinir senha",
    loadingLabel: "Salvando sua nova senha…",
    successLabel: "Sua senha foi atualizada. Você pode entrar agora.",
    mismatchLabel: "As senhas não coincidem.",
    invalidPasswordLabel: "Digite uma senha válida.",
    loginPrompt: "Prefere entrar em vez disso?",
    loginLabel: "Entrar",
  },
  ru: {
    heading: "Задайте новый пароль",
    subheading: "Выберите надежный пароль для защиты аккаунта.",
    passwordLabel: "Новый пароль",
    passwordPlaceholder: "Придумайте надежный пароль",
    confirmPasswordLabel: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Введите пароль еще раз",
    passwordHint: "Используйте не менее 8 символов.",
    submitLabel: "Сбросить пароль",
    loadingLabel: "Сохраняем новый пароль…",
    successLabel: "Пароль обновлен. Теперь вы можете войти.",
    mismatchLabel: "Пароли не совпадают.",
    invalidPasswordLabel: "Введите корректный пароль.",
    loginPrompt: "Хотите войти вместо этого?",
    loginLabel: "Войти",
  },
  it: {
    heading: "Imposta la nuova password",
    subheading: "Scegli una password sicura per proteggere il tuo account.",
    passwordLabel: "Nuova password",
    passwordPlaceholder: "Crea una password forte",
    confirmPasswordLabel: "Conferma password",
    confirmPasswordPlaceholder: "Reinserisci la tua password",
    passwordHint: "Usa almeno 8 caratteri.",
    submitLabel: "Reimposta password",
    loadingLabel: "Salvataggio della nuova password in corso…",
    successLabel: "La tua password è stata aggiornata. Ora puoi accedere.",
    mismatchLabel: "Le password non coincidono.",
    invalidPasswordLabel: "Inserisci una password valida.",
    loginPrompt: "Preferisci accedere?",
    loginLabel: "Accedi",
  },
  de: {
    heading: "Lege dein neues Passwort fest",
    subheading: "Wähle ein sicheres Passwort zum Schutz deines Accounts.",
    passwordLabel: "Neues Passwort",
    passwordPlaceholder: "Erstelle ein starkes Passwort",
    confirmPasswordLabel: "Passwort bestätigen",
    confirmPasswordPlaceholder: "Gib das Passwort erneut ein",
    passwordHint: "Mindestens 8 Zeichen verwenden.",
    submitLabel: "Passwort zurücksetzen",
    loadingLabel: "Neues Passwort wird gespeichert…",
    successLabel:
      "Dein Passwort wurde aktualisiert. Du kannst dich jetzt anmelden.",
    mismatchLabel: "Die Passwörter stimmen nicht überein.",
    invalidPasswordLabel: "Gib ein gültiges Passwort ein.",
    loginPrompt: "Möchtest du dich stattdessen anmelden?",
    loginLabel: "Anmelden",
  },
} satisfies Record<SupportedLocale, AuthResetPasswordFormCopy>;

export const getAuthResetPasswordFormCopy = (
  locale: SupportedLocale,
): AuthResetPasswordFormCopy => copyByLocale[locale] ?? copyByLocale.en;
