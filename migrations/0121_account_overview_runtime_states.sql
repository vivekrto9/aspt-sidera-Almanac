ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_sky_empty_title TEXT;
ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_sky_empty_description TEXT;
ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_sky_empty_action_label TEXT;
ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_session_empty_title TEXT;
ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_session_empty_description TEXT;
ALTER TABLE ec_site_account_empty_states ADD COLUMN account_overview_session_empty_action_label TEXT;

-- Replace only the original fixture copy. Preserve any independently edited values.
UPDATE ec_site_account
SET account_overview_position_2_label = CASE locale
  WHEN 'es' THEN 'Luna' WHEN 'fr' THEN 'Lune' WHEN 'pt' THEN 'Lua'
  WHEN 'ru' THEN 'Луна' WHEN 'it' THEN 'Luna' WHEN 'de' THEN 'Mond'
  ELSE 'Moon' END
WHERE account_overview_position_2_label IN (
  'Moon · waxing', 'Luna · creciente', 'Lune · croissante',
  'Lua · crescente', 'Луна · растущая', 'Mond · zunehmend'
);

UPDATE ec_site_account
SET account_overview_position_3_label = CASE locale
  WHEN 'es' THEN 'Mercurio' WHEN 'fr' THEN 'Mercure' WHEN 'pt' THEN 'Mercúrio'
  WHEN 'ru' THEN 'Меркурий' WHEN 'it' THEN 'Mercurio' WHEN 'de' THEN 'Merkur'
  ELSE 'Mercury' END
WHERE account_overview_position_3_label IN (
  'Mercury Rx', 'Mercurio Rx', 'Mercure Rx', 'Mercúrio Rx', 'Меркурий Rx', 'Merkur Rx'
);

UPDATE ec_site_account
SET account_overview_sky_insight = CASE locale
  WHEN 'es' THEN 'Posiciones en vivo del Sol, la Luna y Mercurio calculadas para hoy.'
  WHEN 'fr' THEN 'Positions en direct du Soleil, de la Lune et de Mercure calculées pour aujourd’hui.'
  WHEN 'pt' THEN 'Posições ao vivo do Sol, da Lua e de Mercúrio calculadas para hoje.'
  WHEN 'ru' THEN 'Текущие положения Солнца, Луны и Меркурия, рассчитанные на сегодня.'
  WHEN 'it' THEN 'Posizioni in tempo reale di Sole, Luna e Mercurio calcolate per oggi.'
  WHEN 'de' THEN 'Aktuelle Positionen von Sonne, Mond und Merkur, für heute berechnet.'
  ELSE 'Live Sun, Moon, and Mercury positions calculated for today.' END
WHERE account_overview_sky_insight LIKE '%natal Jupiter%'
   OR account_overview_sky_insight LIKE '%Júpiter natal%'
   OR account_overview_sky_insight LIKE '%Jupiter natal%'
   OR account_overview_sky_insight LIKE '%Giove natale%'
   OR account_overview_sky_insight LIKE '%натальному Юпитеру%'
   OR account_overview_sky_insight LIKE '%Geburtshoroskop-Jupiter%';

UPDATE ec_site_account
SET account_overview_session_topic_prefix = CASE locale
  WHEN 'es' THEN 'Duración' WHEN 'fr' THEN 'Durée' WHEN 'pt' THEN 'Duração'
  WHEN 'ru' THEN 'Длительность' WHEN 'it' THEN 'Durata' WHEN 'de' THEN 'Dauer'
  ELSE 'Duration' END
WHERE account_overview_session_topic_prefix IN (
  'Topic', 'Tema', 'Sujet', 'Тема', 'Thema'
);
