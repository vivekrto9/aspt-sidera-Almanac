-- Replace only the original confirmation copy. Custom Content Studio copy is
-- preserved while the label is shortened for the corrected form hierarchy.
UPDATE ec_site_reset_password
SET reset_password_confirm_label = CASE locale
  WHEN 'es' THEN 'Confirmar contraseña'
  WHEN 'fr' THEN 'Confirmer le mot de passe'
  WHEN 'pt' THEN 'Confirmar senha'
  WHEN 'ru' THEN 'Подтвердите пароль'
  WHEN 'it' THEN 'Conferma password'
  WHEN 'de' THEN 'Passwort bestätigen'
  ELSE 'Confirm password'
END,
reset_password_confirm_placeholder = CASE locale
  WHEN 'en' THEN 'Re-enter your password'
  WHEN 'pt' THEN 'Repita sua senha'
  WHEN 'de' THEN 'Gib das Passwort erneut ein'
  ELSE reset_password_confirm_placeholder
END,
updated_at = datetime('now'),
version = version + 1
WHERE slug = 'reset-password'
  AND reset_password_confirm_label IN (
    'Confirm new password',
    'Confirmar nueva contraseña',
    'Confirmer le nouveau mot de passe',
    'Confirmar nova senha',
    'Подтвердите новый пароль',
    'Conferma nuova password',
    'Neues Passwort bestätigen'
  );
