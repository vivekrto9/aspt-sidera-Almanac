-- Replace only the original generated Blog defaults. Any custom Content Studio
-- value (for example, "Stories") remains untouched.
UPDATE ec_site_chrome
SET nav_blog = CASE locale
  WHEN 'es' THEN 'Artículos'
  WHEN 'fr' THEN 'Articles'
  WHEN 'pt' THEN 'Artigos'
  WHEN 'ru' THEN 'Статьи'
  WHEN 'it' THEN 'Articoli'
  WHEN 'de' THEN 'Artikel'
  ELSE COALESCE(nav_blog, 'Blog')
END
WHERE nav_blog IS NULL
   OR (locale IN ('es', 'fr', 'pt', 'it', 'de') AND nav_blog = 'Blog')
   OR (locale = 'ru' AND nav_blog = 'Блог');
