import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthSignupFormCopy = {
  heading: string;
  subheading: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phoneCountryLabel: string;
  phonePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHint: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  createAccountLabel: string;
  creatingLabel: string;
  unavailableLabel: string;
  mismatchLabel: string;
  nameRequiredLabel: string;
  missingPasswordLabel: string;
  confirmPasswordRequiredLabel: string;
  termsRequiredLabel: string;
  invalidEmailLabel: string;
  invalidPhoneLabel: string;
  loginPrompt: string;
  loginLabel: string;
  termsPrefix: string;
  termsLabel: string;
  termsGlue: string;
  privacyLabel: string;
  termsSuffix: string;
  marketingOptInLabel: string;
};

const authSignupFormCopyByLocale = {
  en: {
    heading: "Create your account",
    subheading: "Save your charts, readings, people, and all your reports in one place.",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "Email address",
    emailPlaceholder: "you@email.com",
    phoneLabel: "Mobile number (optional)",
    phoneCountryLabel: "Country or region",
    phonePlaceholder: "National number",
    passwordLabel: "Create password",
    passwordPlaceholder: "Create a strong password",
    passwordHint: "Use at least 8 characters.",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    createAccountLabel: "Create account",
    creatingLabel: "Creating your account…",
    unavailableLabel:
      "Account signup is currently unavailable. We’ll enable this shortly.",
    mismatchLabel: "Passwords do not match.",
    nameRequiredLabel: "Enter your full name.",
    missingPasswordLabel: "Enter a password.",
    confirmPasswordRequiredLabel: "Confirm your password.",
    termsRequiredLabel: "You must agree to the Terms and Privacy Policy.",
    invalidEmailLabel: "Enter a valid email address.",
    invalidPhoneLabel: "Enter a valid mobile number.",
    loginPrompt: "Already have an account?",
    loginLabel: "Sign in",
    termsPrefix: "By creating an account, you agree to our",
    termsLabel: "Terms",
    termsGlue: "and",
    privacyLabel: "Privacy Policy",
    termsSuffix: ".",
    marketingOptInLabel: "Send me updates, horoscopes, and offers.",
  },
  es: {
    heading: "Crea tu cuenta",
    subheading: "Guarda tus cartas, lecturas, personas y todos tus informes en un solo lugar.",
    fullNameLabel: "Nombre completo",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    phoneLabel: "Número de móvil (opcional)",
    phoneCountryLabel: "País o región",
    phonePlaceholder: "Número nacional",
    passwordLabel: "Crear contraseña",
    passwordPlaceholder: "Crea una contraseña segura",
    passwordHint: "Usa al menos 8 caracteres.",
    confirmPasswordLabel: "Confirmar contraseña",
    confirmPasswordPlaceholder: "Vuelve a introducir la contraseña",
    createAccountLabel: "Crear cuenta",
    creatingLabel: "Creando tu cuenta…",
    unavailableLabel:
      "El alta de cuenta aún no está disponible. Lo activaremos en breve.",
    mismatchLabel: "Las contraseñas no coinciden.",
    nameRequiredLabel: "Introduce tu nombre completo.",
    missingPasswordLabel: "Introduce una contraseña.",
    confirmPasswordRequiredLabel: "Confirma tu contraseña.",
    termsRequiredLabel: "Debes aceptar Términos y Política de privacidad.",
    invalidEmailLabel: "Introduce una dirección de correo válida.",
    invalidPhoneLabel: "Introduce un número de móvil válido.",
    loginPrompt: "¿Ya tienes una cuenta?",
    loginLabel: "Iniciar sesión",
    termsPrefix: "Al crear una cuenta, aceptas nuestros",
    termsLabel: "Términos",
    termsGlue: "y",
    privacyLabel: "Política de privacidad",
    termsSuffix: ".",
    marketingOptInLabel: "Envíenme actualizaciones, horóscopos y ofertas.",
  },
  fr: {
    heading: "Créer votre compte",
    subheading: "Conservez vos cartes, lectures, contacts et rapports au même endroit.",
    fullNameLabel: "Nom complet",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@email.com",
    phoneLabel: "Numéro de téléphone (optionnel)",
    phoneCountryLabel: "Pays ou région",
    phonePlaceholder: "Numéro national",
    passwordLabel: "Créer un mot de passe",
    passwordPlaceholder: "Créez un mot de passe robuste",
    passwordHint: "Utilisez au moins 8 caractères.",
    confirmPasswordLabel: "Confirmer le mot de passe",
    confirmPasswordPlaceholder: "Entrez de nouveau le mot de passe",
    createAccountLabel: "Créer un compte",
    creatingLabel: "Création de votre compte…",
    unavailableLabel:
      "L’inscription est momentanément indisponible. Elle sera activée sous peu.",
    mismatchLabel: "Les mots de passe ne correspondent pas.",
    nameRequiredLabel: "Saisissez votre nom complet.",
    missingPasswordLabel: "Entrez un mot de passe.",
    confirmPasswordRequiredLabel: "Confirmez votre mot de passe.",
    termsRequiredLabel: "Vous devez accepter les termes et la politique de confidentialité.",
    invalidEmailLabel: "Saisissez une adresse e-mail valide.",
    invalidPhoneLabel: "Saisissez un numéro de téléphone valide.",
    loginPrompt: "Vous avez déjà un compte?",
    loginLabel: "Se connecter",
    termsPrefix: "En créant un compte, vous acceptez nos",
    termsLabel: "Conditions",
    termsGlue: "et",
    privacyLabel: "Politique de confidentialité",
    termsSuffix: ".",
    marketingOptInLabel: "Envoyez-moi des mises à jour, des horoscopes et des offres.",
  },
  pt: {
    heading: "Crie sua conta",
    subheading: "Guarde seus mapas, leituras, pessoas e relatórios em um só lugar.",
    fullNameLabel: "Nome completo",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "Endereço de e-mail",
    emailPlaceholder: "voce@email.com",
    phoneLabel: "Número de celular (opcional)",
    phoneCountryLabel: "País ou região",
    phonePlaceholder: "Número nacional",
    passwordLabel: "Criar senha",
    passwordPlaceholder: "Crie uma senha forte",
    passwordHint: "Use pelo menos 8 caracteres.",
    confirmPasswordLabel: "Confirmar senha",
    confirmPasswordPlaceholder: "Digite novamente a senha",
    createAccountLabel: "Criar conta",
    creatingLabel: "Criando sua conta…",
    unavailableLabel:
      "O cadastro ainda não está disponível. Ativaremos isso em breve.",
    mismatchLabel: "As senhas não coincidem.",
    nameRequiredLabel: "Digite seu nome completo.",
    missingPasswordLabel: "Digite uma senha.",
    confirmPasswordRequiredLabel: "Confirme sua senha.",
    termsRequiredLabel: "Você precisa aceitar os Termos e a Política de Privacidade.",
    invalidEmailLabel: "Digite um endereço de e-mail válido.",
    invalidPhoneLabel: "Digite um número de celular válido.",
    loginPrompt: "Já tem uma conta?",
    loginLabel: "Entrar",
    termsPrefix: "Ao criar uma conta, você concorda com nossos",
    termsLabel: "Termos",
    termsGlue: "e",
    privacyLabel: "Política de Privacidade",
    termsSuffix: ".",
    marketingOptInLabel: "Envie-me atualizações, horóscopos e ofertas.",
  },
  ru: {
    heading: "Создайте аккаунт",
    subheading:
      "Сохраняйте карты, трактовки, людей и все отчёты в одном месте.",
    fullNameLabel: "Полное имя",
    fullNamePlaceholder: "Ариана Белл",
    emailLabel: "Эл. почта",
    emailPlaceholder: "you@email.com",
    phoneLabel: "Номер телефона (необязательно)",
    phoneCountryLabel: "Страна или регион",
    phonePlaceholder: "Национальный номер",
    passwordLabel: "Придумайте пароль",
    passwordPlaceholder: "Создайте надежный пароль",
    passwordHint: "Используйте минимум 8 символов.",
    confirmPasswordLabel: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Повторите пароль",
    createAccountLabel: "Создать аккаунт",
    creatingLabel: "Создаем аккаунт…",
    unavailableLabel:
      "Регистрация сейчас недоступна. Скоро она будет включена.",
    mismatchLabel: "Пароли не совпадают.",
    nameRequiredLabel: "Введите полное имя.",
    missingPasswordLabel: "Введите пароль.",
    confirmPasswordRequiredLabel: "Подтвердите пароль.",
    termsRequiredLabel: "Нужно принять Условия и Политику конфиденциальности.",
    invalidEmailLabel: "Введите корректный адрес электронной почты.",
    invalidPhoneLabel: "Введите корректный номер телефона.",
    loginPrompt: "Уже есть аккаунт?",
    loginLabel: "Войти",
    termsPrefix: "Создавая аккаунт, вы соглашаетесь с нашими",
    termsLabel: "Условиями",
    termsGlue: "и",
    privacyLabel: "Политикой конфиденциальности",
    termsSuffix: ".",
    marketingOptInLabel: "Отправляйте мне обновления, гороскопы и предложения.",
  },
  it: {
    heading: "Crea il tuo account",
    subheading:
      "Salva i tuoi temi, letture, persone e tutti i rapporti in un unico posto.",
    fullNameLabel: "Nome completo",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "Indirizzo email",
    emailPlaceholder: "tu@email.it",
    phoneLabel: "Numero cellulare (opzionale)",
    phoneCountryLabel: "Paese o area geografica",
    phonePlaceholder: "Numero nazionale",
    passwordLabel: "Crea password",
    passwordPlaceholder: "Crea una password sicura",
    passwordHint: "Usa almeno 8 caratteri.",
    confirmPasswordLabel: "Conferma password",
    confirmPasswordPlaceholder: "Reinserisci la password",
    createAccountLabel: "Crea account",
    creatingLabel: "Creazione account in corso…",
    unavailableLabel:
      "L’iscrizione non è ancora disponibile. La attiveremo a breve.",
    mismatchLabel: "Le password non coincidono.",
    nameRequiredLabel: "Inserisci il tuo nome completo.",
    missingPasswordLabel: "Inserisci una password.",
    confirmPasswordRequiredLabel: "Conferma la password.",
    termsRequiredLabel:
      "Accetta i Termini e l’informativa sulla privacy per proseguire.",
    invalidEmailLabel: "Inserisci un indirizzo email valido.",
    invalidPhoneLabel: "Inserisci un numero di cellulare valido.",
    loginPrompt: "Hai già un account?",
    loginLabel: "Accedi",
    termsPrefix: "Creando un account, accetti i nostri",
    termsLabel: "Termini",
    termsGlue: "e",
    privacyLabel: "Privacy Policy",
    termsSuffix: ".",
    marketingOptInLabel: "Inviatemi aggiornamenti, oroscopi e offerte.",
  },
  de: {
    heading: "Konto erstellen",
    subheading:
      "Speichere deine Karten, Lesungen, Personen und alle Berichte an einem Ort.",
    fullNameLabel: "Vollständiger Name",
    fullNamePlaceholder: "Ariana Bell",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "du@email.de",
    phoneLabel: "Handynummer (optional)",
    phoneCountryLabel: "Land oder Region",
    phonePlaceholder: "Nationale Rufnummer",
    passwordLabel: "Passwort erstellen",
    passwordPlaceholder: "Erstelle ein sicheres Passwort",
    passwordHint: "Verwende mindestens 8 Zeichen.",
    confirmPasswordLabel: "Passwort bestätigen",
    confirmPasswordPlaceholder: "Passwort erneut eingeben",
    createAccountLabel: "Konto erstellen",
    creatingLabel: "Konto wird erstellt…",
    unavailableLabel:
      "Die Registrierung ist aktuell nicht verfügbar. Wir aktivieren sie in Kürze.",
    mismatchLabel: "Passwörter stimmen nicht überein.",
    nameRequiredLabel: "Gib deinen vollständigen Namen ein.",
    missingPasswordLabel: "Gib ein Passwort ein.",
    confirmPasswordRequiredLabel: "Bestätige dein Passwort.",
    termsRequiredLabel:
      "Bitte akzeptiere die Nutzungsbedingungen und die Datenschutzrichtlinie.",
    invalidEmailLabel: "Gib eine gültige E-Mail-Adresse ein.",
    invalidPhoneLabel: "Gib eine gültige Handynummer ein.",
    loginPrompt: "Hast du schon ein Konto?",
    loginLabel: "Anmelden",
    termsPrefix: "Mit der Erstellung eines Kontos akzeptierst du unsere",
    termsLabel: "Nutzungsbedingungen",
    termsGlue: "und",
    privacyLabel: "Datenschutzerklärung",
    termsSuffix: ".",
    marketingOptInLabel: "Sende mir Updates, Horoskope und Angebote.",
  },
} satisfies Record<SupportedLocale, AuthSignupFormCopy>;

export const getAuthSignupFormCopy = (
  locale: SupportedLocale,
): AuthSignupFormCopy => authSignupFormCopyByLocale[locale] ?? authSignupFormCopyByLocale.en;
