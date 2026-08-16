-- Replace only the original fixed-length placeholder. Custom Content Studio
-- copy is preserved while the Signup form moves to country-aware validation.
UPDATE ec_site_signup
SET signup_phone_placeholder = CASE locale
  WHEN 'es' THEN 'Número nacional'
  WHEN 'fr' THEN 'Numéro national'
  WHEN 'pt' THEN 'Número nacional'
  WHEN 'ru' THEN 'Национальный номер'
  WHEN 'it' THEN 'Numero nazionale'
  WHEN 'de' THEN 'Nationale Rufnummer'
  ELSE 'National number'
END,
updated_at = datetime('now'),
version = version + 1
WHERE slug = 'signup'
  AND (
    signup_phone_placeholder IS NULL
    OR signup_phone_placeholder = ''
    OR signup_phone_placeholder IN (
      '10-digit mobile number',
      'Número móvil de 10 dígitos',
      'Numéro mobile à 10 chiffres',
      'Número de celular de 10 dígitos',
      '10-значный мобильный номер',
      'Numero cellulare di 10 cifre',
      '10-stellige Handynummer'
    )
  );
