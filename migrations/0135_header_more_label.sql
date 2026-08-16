-- Register the shared Header's Blog/Shop overflow label in Site Chrome.
ALTER TABLE ec_site_chrome ADD COLUMN nav_more TEXT;

UPDATE ec_site_chrome
SET nav_more = COALESCE(
  nav_more,
  CASE locale
    WHEN 'es' THEN 'Más'
    WHEN 'fr' THEN 'Plus'
    WHEN 'pt' THEN 'Mais'
    WHEN 'ru' THEN 'Ещё'
    WHEN 'it' THEN 'Altro'
    WHEN 'de' THEN 'Mehr'
    ELSE 'More'
  END
);
