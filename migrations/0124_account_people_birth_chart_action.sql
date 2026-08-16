ALTER TABLE ec_site_account ADD COLUMN account_people_generate_birth_chart_label TEXT;

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Generate birth chart'
WHERE locale = 'en' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Generar carta natal'
WHERE locale = 'es' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Générer le thème natal'
WHERE locale = 'fr' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Gerar mapa natal'
WHERE locale = 'pt' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Создать натальную карту'
WHERE locale = 'ru' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Genera tema natale'
WHERE locale = 'it' AND slug = 'account';

UPDATE ec_site_account
SET account_people_generate_birth_chart_label = 'Geburtshoroskop erstellen'
WHERE locale = 'de' AND slug = 'account';
