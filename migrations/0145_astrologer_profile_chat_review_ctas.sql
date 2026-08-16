UPDATE ec_site_astrologer_profiles
SET profile_talk_now = CASE locale
      WHEN 'es' THEN 'Chatear ahora'
      WHEN 'fr' THEN 'Discuter maintenant'
      WHEN 'pt' THEN 'Conversar agora'
      WHEN 'ru' THEN 'Начать чат'
      WHEN 'it' THEN 'Chatta ora'
      WHEN 'de' THEN 'Jetzt chatten'
      ELSE 'Chat now'
    END,
    profile_written_question = CASE locale
      WHEN 'es' THEN 'Ver reseñas'
      WHEN 'fr' THEN 'Voir les avis'
      WHEN 'pt' THEN 'Ver avaliações'
      WHEN 'ru' THEN 'Посмотреть отзывы'
      WHEN 'it' THEN 'Vedi recensioni'
      WHEN 'de' THEN 'Bewertungen ansehen'
      ELSE 'Check reviews'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE revisions
SET data = json_set(
  data,
  '$.profile_talk_now', (
    SELECT profile_talk_now
    FROM ec_site_astrologer_profiles
    WHERE ec_site_astrologer_profiles.id = revisions.entry_id
  ),
  '$.profile_written_question', (
    SELECT profile_written_question
    FROM ec_site_astrologer_profiles
    WHERE ec_site_astrologer_profiles.id = revisions.entry_id
  )
)
WHERE collection = 'site_astrologer_profiles'
  AND id IN (
    SELECT live_revision_id
    FROM ec_site_astrologer_profiles
    WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id
    FROM ec_site_astrologer_profiles
    WHERE draft_revision_id IS NOT NULL
  );
