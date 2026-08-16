ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_eyebrow TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_title TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_description TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_close_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_empty_title TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_empty_description TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_create_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_select_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_default_label TEXT;

UPDATE ec_site_astrologers
SET talk_now = CASE locale
  WHEN 'en' THEN 'Chat now'
  WHEN 'es' THEN 'Chatear ahora'
  WHEN 'fr' THEN 'Discuter maintenant'
  WHEN 'pt' THEN 'Conversar agora'
  WHEN 'ru' THEN 'Начать чат'
  WHEN 'it' THEN 'Chatta ora'
  WHEN 'de' THEN 'Jetzt chatten'
  ELSE talk_now
END,
updated_at = CURRENT_TIMESTAMP
WHERE talk_now IN (
  'Talk now',
  'Hablar ahora',
  'Parler maintenant',
  'Falar agora',
  'Поговорить',
  'Parla ora',
  'Jetzt sprechen'
);

UPDATE revisions
SET data = json_set(
  data,
  '$.talk_now',
  CASE (
    SELECT locale
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  )
    WHEN 'en' THEN 'Chat now'
    WHEN 'es' THEN 'Chatear ahora'
    WHEN 'fr' THEN 'Discuter maintenant'
    WHEN 'pt' THEN 'Conversar agora'
    WHEN 'ru' THEN 'Начать чат'
    WHEN 'it' THEN 'Chatta ora'
    WHEN 'de' THEN 'Jetzt chatten'
    ELSE json_extract(data, '$.talk_now')
  END
)
WHERE collection = 'site_astrologers'
  AND id IN (
    SELECT live_revision_id
    FROM ec_site_astrologers
    WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id
    FROM ec_site_astrologers
    WHERE draft_revision_id IS NOT NULL
  )
  AND json_extract(data, '$.talk_now') IN (
    'Talk now',
    'Hablar ahora',
    'Parler maintenant',
    'Falar agora',
    'Поговорить',
    'Parla ora',
    'Jetzt sprechen'
  );
