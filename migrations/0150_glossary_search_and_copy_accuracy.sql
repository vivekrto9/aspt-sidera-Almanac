ALTER TABLE ec_site_glossary ADD COLUMN glossary_search_label TEXT;
ALTER TABLE ec_site_glossary ADD COLUMN glossary_search_placeholder TEXT;
ALTER TABLE ec_site_glossary ADD COLUMN glossary_search_clear_label TEXT;
ALTER TABLE ec_site_glossary ADD COLUMN glossary_search_results_label TEXT;
ALTER TABLE ec_site_glossary ADD COLUMN glossary_search_empty_title TEXT;

UPDATE ec_site_glossary
SET glossary_term_aspect_name = 'Aspekt'
WHERE locale = 'de' AND TRIM(glossary_term_aspect_name) = 'Aspekt s';

UPDATE ec_site_glossary
SET glossary_term_conjunction_definition = CASE locale
  WHEN 'en' THEN 'Two planets within the accepted orb of 0°, blending their natures into a single, concentrated force.'
  WHEN 'es' THEN 'Dos planetas dentro del orbe aceptado de 0° que combinan sus naturalezas en una fuerza única y concentrada.'
  WHEN 'fr' THEN 'Deux planètes dans l’orbe admis de 0°, mêlant leur nature en une force unique et concentrée.'
  WHEN 'pt' THEN 'Dois planetas dentro do orbe aceite de 0°, unindo as suas naturezas numa força única e concentrada.'
  WHEN 'ru' THEN 'Две планеты в пределах принятого орбиса аспекта 0°, объединяющие свои качества в единую концентрированную силу.'
  WHEN 'it' THEN 'Due pianeti entro l’orbe accettato di 0°, che fondono la loro natura in un’unica forza concentrata.'
  WHEN 'de' THEN 'Zwei Planeten innerhalb des zulässigen Orbis um 0°, deren Wesensarten sich zu einer gebündelten Kraft verbinden.'
  ELSE glossary_term_conjunction_definition
END
WHERE glossary_term_conjunction_definition IN (
  'Two planets at the same degree, blending their natures into a single, concentrated force.',
  'Dos planetas en el mismo grado que combinan sus naturalezas en una fuerza única y concentrada.',
  'Deux planètes au même degré, mêlant leur nature en une force unique et concentrée.',
  'Dois planetas no mesmo grau, unindo suas naturezas em uma força única e concentrada.',
  'Две планеты в одном градусе, объединяющие свои качества в единую концентрированную силу.',
  'Due pianeti allo stesso grado che fondono la loro natura in un’unica forza concentrata.',
  'Zwei Planeten im selben Grad, deren Wesensarten sich zu einer gebündelten Kraft verbinden.'
);

UPDATE ec_site_glossary
SET glossary_term_retrograde_definition = CASE locale
  WHEN 'en' THEN 'Astronomically, a planet’s apparent backward motion as seen from Earth. In astrology, it is interpreted as a period of review and revision.'
  WHEN 'es' THEN 'Astronómicamente, el movimiento retrógrado aparente de un planeta visto desde la Tierra. En astrología, se interpreta como un periodo de revisión.'
  WHEN 'fr' THEN 'Astronomiquement, le mouvement apparent vers l’arrière d’une planète vue de la Terre. En astrologie, il est interprété comme une période de révision.'
  WHEN 'pt' THEN 'Astronomicamente, o movimento aparente para trás de um planeta visto da Terra. Na astrologia, é interpretado como um período de revisão.'
  WHEN 'ru' THEN 'В астрономии — видимое с Земли обратное движение планеты. В астрологии оно трактуется как период пересмотра и исправления.'
  WHEN 'it' THEN 'In astronomia, il moto apparente all’indietro di un pianeta visto dalla Terra. In astrologia, è interpretato come un periodo di revisione.'
  WHEN 'de' THEN 'Astronomisch die von der Erde aus sichtbare scheinbare Rückwärtsbewegung eines Planeten. Astrologisch wird sie als Phase der Prüfung und Revision gedeutet.'
  ELSE glossary_term_retrograde_definition
END
WHERE glossary_term_retrograde_definition IN (
  'When a planet appears to move backward from Earth, turning its themes inward toward review and revision.',
  'Cuando un planeta parece moverse hacia atrás desde la Tierra, llevando sus temas hacia la revisión interior.',
  'Lorsqu’une planète semble reculer vue de la Terre, ramenant ses thèmes vers l’examen intérieur et la révision.',
  'Quando um planeta parece mover-se para trás visto da Terra, voltando seus temas à revisão interior.',
  'Видимое с Земли обратное движение планеты, обращающее её темы внутрь — к пересмотру и исправлению.',
  'Quando un pianeta sembra muoversi all’indietro visto dalla Terra, rivolgendo i suoi temi alla revisione interiore.',
  'Wenn ein Planet von der Erde aus scheinbar rückwärts läuft und seine Themen nach innen zu Prüfung und Revision lenkt.'
);
