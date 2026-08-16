import type { SupportedLocale } from "../../../localization-contract.ts";

export type AuthForgotPasswordShellCopy = {
  kicker: string;
  title: string;
  description: string;
  formLabel: string;
};

const copyByLocale = {
  en: {
    kicker: "Forgot password",
    title: "A secure path back to your chart sky.",
    description:
      "We can send a reset link to your email so you can regain access to your account quickly.",
    formLabel: "Forgot password request",
  },
  es: {
    kicker: "Contraseña olvidada",
    title: "Un camino seguro para volver a tu cielo.",
    description:
      "Podemos enviarte un enlace para restablecer a tu correo para que recuperes el acceso a tu cuenta.",
    formLabel: "Solicitud para recuperar contraseña",
  },
  fr: {
    kicker: "Mot de passe oublié",
    title: "Un chemin sécurisé vers votre ciel personnel.",
    description:
      "Nous pouvons envoyer un lien de réinitialisation à votre email pour vous permettre d’accéder à votre compte.",
    formLabel: "Demande de mot de passe oublié",
  },
  pt: {
    kicker: "Senha esquecida",
    title: "Um caminho seguro de volta ao seu céu.",
    description:
      "Podemos enviar um link de redefinição para o seu e-mail e você pode recuperar o acesso à sua conta.",
    formLabel: "Solicitação de senha esquecida",
  },
  ru: {
    kicker: "Забыли пароль",
    title: "Безопасный путь обратно к вашей карте.",
    description:
      "Мы можем отправить ссылку для сброса на вашу почту, чтобы вы быстро вернулись к своей учетной записи.",
    formLabel: "Запрос на восстановление пароля",
  },
  it: {
    kicker: "Password dimenticata",
    title: "Un percorso sicuro per tornare alla tua mappa.",
    description:
      "Possiamo inviare un link per il reset al tuo indirizzo email così puoi recuperare l’accesso rapidamente.",
    formLabel: "Richiesta password dimenticata",
  },
  de: {
    kicker: "Passwort vergessen",
    title: "Ein sicherer Weg zurück zu deinem Horoskop.",
    description:
      "Wir können einen Reset-Link an deine E-Mail-Adresse senden, damit du schnell wieder auf dein Konto zugreifen kannst.",
    formLabel: "Passwort-zurücksetzen-Anfrage",
  },
} satisfies Record<SupportedLocale, AuthForgotPasswordShellCopy>;

export const getForgotPasswordShellCopy = (
  locale: SupportedLocale,
): AuthForgotPasswordShellCopy => copyByLocale[locale] ?? copyByLocale.en;
