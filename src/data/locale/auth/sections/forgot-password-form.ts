import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthForgotPasswordFormCopy = {
  heading: string;
  subheading: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  loadingLabel: string;
  successLabel: string;
  resentSuccessLabel: string;
  invalidEmailLabel: string;
  resendPrompt: string;
  resendLabel: string;
  resendCountdownLabel: string;
  resendReadyLabel: string;
  loginPrompt: string;
  loginLabel: string;
};

const copyByLocale = {
  en: {
    heading: "Reset your password",
    subheading: "Enter your email and we will send secure reset instructions.",
    emailLabel: "Email address",
    emailPlaceholder: "you@email.com",
    submitLabel: "Send reset link",
    loadingLabel: "Preparing reset instructions…",
    successLabel:
      "If an account exists for this email, reset instructions are on their way.",
    resentSuccessLabel: "A fresh reset link is on its way.",
    invalidEmailLabel: "Enter a valid email address.",
    resendPrompt: "Didn't receive the email? Check your spam folder or",
    resendLabel: "Resend link",
    resendCountdownLabel: "Available in {time}",
    resendReadyLabel: "You can resend now.",
    loginPrompt: "Remembered your password?",
    loginLabel: "Sign in",
  },
  es: {
    heading: "Restablece tu contraseña",
    subheading:
      "Ingresa tu correo y te enviaremos instrucciones seguras para restablecerla.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    submitLabel: "Enviar enlace de restablecimiento",
    loadingLabel: "Preparando instrucciones de restablecimiento…",
    successLabel:
      "Si existe una cuenta con este correo, las instrucciones serán enviadas.",
    resentSuccessLabel: "Un nuevo enlace de restablecimiento está en camino.",
    invalidEmailLabel: "Ingresa una dirección de correo válida.",
    resendPrompt: "¿No recibiste el correo? Revisa la carpeta de spam o",
    resendLabel: "Reenviar enlace",
    resendCountdownLabel: "Disponible en {time}",
    resendReadyLabel: "Ya puedes reenviarlo.",
    loginPrompt: "¿Recordaste tu contraseña?",
    loginLabel: "Iniciar sesión",
  },
  fr: {
    heading: "Réinitialisez votre mot de passe",
    subheading:
      "Saisissez votre adresse e-mail et nous enverrons des instructions de réinitialisation sécurisées.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    submitLabel: "Envoyer le lien de réinitialisation",
    loadingLabel: "Préparation des instructions…",
    successLabel:
      "Si un compte existe pour cet e-mail, les instructions seront envoyées.",
    resentSuccessLabel: "Un nouveau lien de réinitialisation est en route.",
    invalidEmailLabel: "Saisissez une adresse e-mail valide.",
    resendPrompt:
      "Vous n'avez pas reçu l'e-mail ? Vérifiez vos indésirables ou",
    resendLabel: "Renvoyer le lien",
    resendCountdownLabel: "Disponible dans {time}",
    resendReadyLabel: "Vous pouvez maintenant le renvoyer.",
    loginPrompt: "Vous avez retrouvé votre mot de passe ?",
    loginLabel: "Se connecter",
  },
  pt: {
    heading: "Redefina sua senha",
    subheading:
      "Digite seu e-mail e enviaremos instruções seguras de redefinição.",
    emailLabel: "Endereço de e-mail",
    emailPlaceholder: "voce@email.com",
    submitLabel: "Enviar link de redefinição",
    loadingLabel: "Preparando instruções de redefinição…",
    successLabel:
      "Se houver uma conta para este e-mail, as instruções serão enviadas.",
    resentSuccessLabel: "Um novo link de redefinição está a caminho.",
    invalidEmailLabel: "Digite um endereço de e-mail válido.",
    resendPrompt: "Não recebeu o e-mail? Verifique o spam ou",
    resendLabel: "Reenviar link",
    resendCountdownLabel: "Disponível em {time}",
    resendReadyLabel: "Você já pode reenviar.",
    loginPrompt: "Lembrou sua senha?",
    loginLabel: "Entrar",
  },
  ru: {
    heading: "Восстановите пароль",
    subheading: "Введите email, и мы пришлем безопасные инструкции для сброса.",
    emailLabel: "Электронная почта",
    emailPlaceholder: "you@example.com",
    submitLabel: "Отправить ссылку",
    loadingLabel: "Подготавливаем инструкции по сбросу…",
    successLabel:
      "Если аккаунт с этим email существует, инструкции будут отправлены.",
    resentSuccessLabel: "Новая ссылка для сброса уже отправлена.",
    invalidEmailLabel: "Введите действительный адрес email.",
    resendPrompt: "Не получили письмо? Проверьте папку «Спам» или",
    resendLabel: "Отправить ссылку снова",
    resendCountdownLabel: "Доступно через {time}",
    resendReadyLabel: "Ссылку можно отправить снова.",
    loginPrompt: "Вспомнили пароль?",
    loginLabel: "Войти",
  },
  it: {
    heading: "Reimposta la password",
    subheading:
      "Inserisci la tua email e ti invieremo istruzioni di reset sicure.",
    emailLabel: "Indirizzo email",
    emailPlaceholder: "tu@email.it",
    submitLabel: "Invia link di reset",
    loadingLabel: "Preparazione delle istruzioni di reset…",
    successLabel:
      "Se esiste un account con questa email, le istruzioni verranno inviate.",
    resentSuccessLabel: "Un nuovo link di reimpostazione è in arrivo.",
    invalidEmailLabel: "Inserisci un indirizzo email valido.",
    resendPrompt: "Non hai ricevuto l'email? Controlla lo spam oppure",
    resendLabel: "Invia di nuovo il link",
    resendCountdownLabel: "Disponibile tra {time}",
    resendReadyLabel: "Ora puoi inviarlo di nuovo.",
    loginPrompt: "Hai ricordato la password?",
    loginLabel: "Accedi",
  },
  de: {
    heading: "Passwort zurücksetzen",
    subheading:
      "Gib deine E-Mail-Adresse ein und wir senden sichere Anweisungen zum Zurücksetzen.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    submitLabel: "Reset-Link senden",
    loadingLabel: "Passwortanweisungen werden vorbereitet…",
    successLabel:
      "Falls ein Konto mit dieser E-Mail existiert, werden die Anweisungen zugesandt.",
    resentSuccessLabel: "Ein neuer Reset-Link ist unterwegs.",
    invalidEmailLabel: "Gib eine gültige E-Mail-Adresse ein.",
    resendPrompt: "Keine E-Mail erhalten? Prüfe den Spam-Ordner oder",
    resendLabel: "Link erneut senden",
    resendCountdownLabel: "Verfügbar in {time}",
    resendReadyLabel: "Du kannst den Link jetzt erneut senden.",
    loginPrompt: "Passwort wiedererinnern?",
    loginLabel: "Anmelden",
  },
} satisfies Record<SupportedLocale, AuthForgotPasswordFormCopy>;

export const getAuthForgotPasswordFormCopy = (
  locale: SupportedLocale,
): AuthForgotPasswordFormCopy => copyByLocale[locale] ?? copyByLocale.en;
