-- Migration 0131 initially copied nav_learn into nav_blog. Replace only known
-- generated Learn labels so the header describes the Blog destination. Custom
-- Content Studio labels remain untouched.
UPDATE ec_site_chrome
SET nav_blog = CASE locale
  WHEN 'en' THEN 'Blog'
  WHEN 'es' THEN 'Artículos'
  WHEN 'fr' THEN 'Articles'
  WHEN 'pt' THEN 'Artigos'
  WHEN 'ru' THEN 'Статьи'
  WHEN 'it' THEN 'Articoli'
  WHEN 'de' THEN 'Artikel'
  ELSE nav_blog
END
WHERE (locale = 'en' AND nav_blog = 'Learn')
   OR (locale = 'es' AND nav_blog = 'Aprender')
   OR (locale = 'fr' AND nav_blog = 'Découvrir')
   OR (locale = 'pt' AND nav_blog = 'Aprender')
   OR (locale = 'ru' AND nav_blog IN ('Материалы', 'Узнать больше'))
   OR (locale = 'it' AND nav_blog = 'Scopri')
   OR (locale = 'de' AND nav_blog = 'Entdecken');
