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
  'Cast a new natal chart',
  'Crear una nueva carta natal',
  'Créer un nouveau thème natal',
  'Criar um novo mapa natal',
  'Создать новую натальную карту',
  'Crea un nuovo tema natale',
  'Neues Geburtshoroskop erstellen',
  'Select profile',
  'Seleccionar perfil',
  'Sélectionner un profil',
  'Selecionar perfil',
  'Выбрать профиль',
  'Seleziona profilo',
  'Profil auswählen'
);

UPDATE revisions
SET data = json_set(
  data,
  '$.new_chart_label',
  CASE (
    SELECT locale
    FROM ec_site_transit
    WHERE ec_site_transit.id = revisions.entry_id
  )
    WHEN 'en' THEN 'Choose Profile'
    WHEN 'es' THEN 'Elegir perfil'
    WHEN 'fr' THEN 'Choisir un profil'
    WHEN 'pt' THEN 'Escolher perfil'
    WHEN 'ru' THEN 'Выбрать профиль'
    WHEN 'it' THEN 'Scegli profilo'
    WHEN 'de' THEN 'Profil wählen'
    ELSE json_extract(data, '$.new_chart_label')
  END
)
WHERE collection = 'site_transit'
  AND id IN (
    SELECT live_revision_id
    FROM ec_site_transit
    WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id
    FROM ec_site_transit
    WHERE draft_revision_id IS NOT NULL
  )
  AND json_extract(data, '$.new_chart_label') IN (
    'Cast a new natal chart',
    'Crear una nueva carta natal',
    'Créer un nouveau thème natal',
    'Criar um novo mapa natal',
    'Создать новую натальную карту',
    'Crea un nuovo tema natale',
    'Neues Geburtshoroskop erstellen',
    'Select profile',
    'Seleccionar perfil',
    'Sélectionner un profil',
    'Selecionar perfil',
    'Выбрать профиль',
    'Seleziona profilo',
    'Profil auswählen'
  );
