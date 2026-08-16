import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthLoginFormCopy = {
  heading: string;
  subheading: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  submitLabel: string;
  forgotPasswordLabel: string;
  loadingLabel: string;
  invalidEmailLabel: string;
  missingPasswordLabel: string;
  runtimeErrorLabel: string;
  termsPrefix: string;
  termsLabel: string;
  termsGlue: string;
  privacyLabel: string;
  termsSuffix: string;
  signupPrompt: string;
  signupLabel: string;
};

const copyByLocale = {
  en: {
    heading: "Sign in to your account",
    subheading: "Use your email and password to continue.",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",
    submitLabel: "Sign in",
    forgotPasswordLabel: "Forgot password?",
    loadingLabel: "Signing you in…",
    invalidEmailLabel: "Enter a valid email address.",
    missingPasswordLabel: "Enter your password.",
    runtimeErrorLabel: "We couldn’t reach the sign-in service. Try again.",
    termsPrefix: "By signing in, you agree to our",
    termsLabel: "Terms",
    termsGlue: "and",
    privacyLabel: "Privacy Policy",
    termsSuffix: ".",
    signupPrompt: "New to Sidera?",
    signupLabel: "Create an account",
  },
  es: {
    heading: "Inicia sesión en tu cuenta",
    subheading: "Usa tu correo electrónico y contraseña para continuar.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    showPasswordLabel: "Mostrar contraseña",
    hidePasswordLabel: "Ocultar contraseña",
    submitLabel: "Iniciar sesión",
    forgotPasswordLabel: "¿Olvidaste tu contraseña?",
    loadingLabel: "Iniciando sesión…",
    invalidEmailLabel: "Introduce un correo electrónico válido.",
    missingPasswordLabel: "Introduce tu contraseña.",
    runtimeErrorLabel:
      "No pudimos conectar con el servicio de inicio de sesión. Inténtalo de nuevo.",
    termsPrefix: "Al iniciar sesión, aceptas nuestros",
    termsLabel: "Términos",
    termsGlue: "y",
    privacyLabel: "Política de privacidad",
    termsSuffix: ".",
    signupPrompt: "¿Eres nuevo en Sidera?",
    signupLabel: "Crea una cuenta",
  },
  fr: {
    heading: "Connectez-vous à votre compte",
    subheading: "Utilisez votre adresse e-mail et votre mot de passe pour continuer.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Saisissez votre mot de passe",
    showPasswordLabel: "Afficher le mot de passe",
    hidePasswordLabel: "Masquer le mot de passe",
    submitLabel: "Se connecter",
    forgotPasswordLabel: "Mot de passe oublié ?",
    loadingLabel: "Connexion en cours…",
    invalidEmailLabel: "Saisissez une adresse e-mail valide.",
    missingPasswordLabel: "Saisissez votre mot de passe.",
    runtimeErrorLabel:
      "Le service de connexion est inaccessible. Réessayez.",
    termsPrefix: "En vous connectant, vous acceptez nos",
    termsLabel: "Conditions",
    termsGlue: "et notre",
    privacyLabel: "Politique de confidentialité",
    termsSuffix: ".",
    signupPrompt: "Nouveau sur Sidera ?",
    signupLabel: "Créer un compte",
  },
  pt: {
    heading: "Entre na sua conta",
    subheading: "Use seu e-mail e sua senha para continuar.",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "Digite sua senha",
    showPasswordLabel: "Mostrar senha",
    hidePasswordLabel: "Ocultar senha",
    submitLabel: "Entrar",
    forgotPasswordLabel: "Esqueceu a senha?",
    loadingLabel: "Entrando…",
    invalidEmailLabel: "Digite um endereço de e-mail válido.",
    missingPasswordLabel: "Digite sua senha.",
    runtimeErrorLabel:
      "Não foi possível acessar o serviço de login. Tente novamente.",
    termsPrefix: "Ao entrar, você concorda com nossos",
    termsLabel: "Termos",
    termsGlue: "e nossa",
    privacyLabel: "Política de Privacidade",
    termsSuffix: ".",
    signupPrompt: "Novo na Sidera?",
    signupLabel: "Criar uma conta",
  },
  ru: {
    heading: "Войдите в свой аккаунт",
    subheading: "Введите электронную почту и пароль, чтобы продолжить.",
    emailLabel: "Электронная почта",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Введите пароль",
    showPasswordLabel: "Показать пароль",
    hidePasswordLabel: "Скрыть пароль",
    submitLabel: "Войти",
    forgotPasswordLabel: "Забыли пароль?",
    loadingLabel: "Выполняется вход…",
    invalidEmailLabel: "Введите действительный адрес электронной почты.",
    missingPasswordLabel: "Введите пароль.",
    runtimeErrorLabel:
      "Не удалось связаться с сервисом входа. Попробуйте ещё раз.",
    termsPrefix: "Входя в аккаунт, вы соглашаетесь с",
    termsLabel: "Условиями",
    termsGlue: "и",
    privacyLabel: "Политикой конфиденциальности",
    termsSuffix: ".",
    signupPrompt: "Впервые в Sidera?",
    signupLabel: "Создать аккаунт",
  },
  it: {
    heading: "Accedi al tuo account",
    subheading: "Usa la tua e-mail e la password per continuare.",
    emailLabel: "E-mail",
    emailPlaceholder: "tu@email.it",
    passwordLabel: "Password",
    passwordPlaceholder: "Inserisci la password",
    showPasswordLabel: "Mostra password",
    hidePasswordLabel: "Nascondi password",
    submitLabel: "Accedi",
    forgotPasswordLabel: "Password dimenticata?",
    loadingLabel: "Accesso in corso…",
    invalidEmailLabel: "Inserisci un indirizzo e-mail valido.",
    missingPasswordLabel: "Inserisci la password.",
    runtimeErrorLabel:
      "Non è stato possibile raggiungere il servizio di accesso. Riprova.",
    termsPrefix: "Accedendo, accetti i nostri",
    termsLabel: "Termini",
    termsGlue: "e la",
    privacyLabel: "Informativa sulla privacy",
    termsSuffix: ".",
    signupPrompt: "Nuovo su Sidera?",
    signupLabel: "Crea un account",
  },
  de: {
    heading: "Bei deinem Konto anmelden",
    subheading: "Nutze deine E-Mail-Adresse und dein Passwort, um fortzufahren.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "du@beispiel.de",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Passwort eingeben",
    showPasswordLabel: "Passwort anzeigen",
    hidePasswordLabel: "Passwort ausblenden",
    submitLabel: "Anmelden",
    forgotPasswordLabel: "Passwort vergessen?",
    loadingLabel: "Anmeldung läuft…",
    invalidEmailLabel: "Gib eine gültige E-Mail-Adresse ein.",
    missingPasswordLabel: "Gib dein Passwort ein.",
    runtimeErrorLabel:
      "Der Anmeldedienst ist nicht erreichbar. Versuche es erneut.",
    termsPrefix: "Mit der Anmeldung stimmst du unseren",
    termsLabel: "Bedingungen",
    termsGlue: "und der",
    privacyLabel: "Datenschutzerklärung",
    termsSuffix: " zu.",
    signupPrompt: "Neu bei Sidera?",
    signupLabel: "Konto erstellen",
  },
} satisfies Record<SupportedLocale, AuthLoginFormCopy>;

export const getAuthLoginFormCopy = (locale: SupportedLocale): AuthLoginFormCopy =>
  copyByLocale[locale] ?? copyByLocale.en;
