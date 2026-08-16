UPDATE ec_site_transit
SET new_chart_label = CASE locale
  WHEN 'en' THEN 'Select profile'
  WHEN 'es' THEN 'Seleccionar perfil'
  WHEN 'fr' THEN 'Sélectionner un profil'
  WHEN 'pt' THEN 'Selecionar perfil'
  WHEN 'ru' THEN 'Выбрать профиль'
  WHEN 'it' THEN 'Seleziona profilo'
  WHEN 'de' THEN 'Profil auswählen'
  ELSE new_chart_label
END
WHERE new_chart_label IN (
  'Add profile',
  'Añadir perfil',
  'Ajouter un profil',
  'Adicionar perfil',
  'Добавить профиль',
  'Aggiungi profilo',
  'Profil hinzufügen'
);
