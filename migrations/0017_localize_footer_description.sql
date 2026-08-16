-- Replace only the original generic footer sentence so the complete reference
-- footer starts with the correct localized description. Custom copy is preserved.
UPDATE ec_site_chrome
SET footer_about = CASE locale
  WHEN 'es' THEN 'Claro para principiantes. Profundo para quienes quieren saber más. Basado en Swiss Ephemeris, con precisión de minuto de arco.'
  WHEN 'fr' THEN 'Accessible aux débutants. Approfondi pour les curieux. Basé sur Swiss Ephemeris, précis à la minute d’arc.'
  WHEN 'pt' THEN 'Acessível para iniciantes. Profundo para os curiosos. Desenvolvido com Swiss Ephemeris, preciso ao minuto de arco.'
  WHEN 'ru' THEN 'Понятно начинающим. Глубоко для любознательных. На основе Swiss Ephemeris с точностью до угловой минуты.'
  WHEN 'it' THEN 'Chiaro per chi inizia. Profondo per chi è curioso. Basato su Swiss Ephemeris, preciso al minuto d’arco.'
  WHEN 'de' THEN 'Verständlich für Einsteiger. Tiefgehend für Neugierige. Basierend auf Swiss Ephemeris, genau bis auf die Bogenminute.'
  ELSE 'Readable for beginners. Deep for the curious. Built on the Swiss Ephemeris, accurate to the arcminute.'
END,
updated_at = datetime('now'),
version = version + 1
WHERE slug = 'main'
  AND (
    footer_about IS NULL
    OR footer_about = ''
    OR footer_about = 'Modern astrology with a warm, thoughtful point of view.'
  );
