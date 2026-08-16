UPDATE ec_site_transit
SET new_chart_label = CASE locale
  WHEN 'en' THEN 'Choose Profile'
  WHEN 'es' THEN 'Elegir perfil'
  WHEN 'fr' THEN 'Choisir un profil'
  WHEN 'pt' THEN 'Escolher perfil'
  WHEN 'ru' THEN 'Выбрать профиль'
  WHEN 'it' THEN 'Scegli profilo'
  WHEN 'de' THEN 'Profil wählen'
  ELSE new_chart_label
END,
updated_at = CURRENT_TIMESTAMP
WHERE new_chart_label IN (
  'Select profile',
  'Seleccionar perfil',
  'Sélectionner un profil',
  'Selecionar perfil',
  'Выбрать профиль',
  'Seleziona profilo',
  'Profil auswählen',
  'Cast a new natal chart'
);
