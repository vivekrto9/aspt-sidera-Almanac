-- Give Blog and Shop independent, locale-aware Site Chrome fields so their
-- shared Header labels can be edited without changing footer navigation copy.
ALTER TABLE ec_site_chrome ADD COLUMN nav_blog TEXT;
ALTER TABLE ec_site_chrome ADD COLUMN nav_shop TEXT;

UPDATE ec_site_chrome
SET nav_blog = COALESCE(
  nav_blog,
  nav_learn,
  CASE locale
    WHEN 'ru' THEN 'Блог'
    ELSE 'Blog'
  END
);

UPDATE ec_site_chrome
SET nav_shop = COALESCE(
  nav_shop,
  CASE locale
    WHEN 'es' THEN 'Tienda'
    WHEN 'fr' THEN 'Boutique'
    WHEN 'pt' THEN 'Loja'
    WHEN 'ru' THEN 'Магазин'
    WHEN 'it' THEN 'Negozio'
    ELSE 'Shop'
  END
);
