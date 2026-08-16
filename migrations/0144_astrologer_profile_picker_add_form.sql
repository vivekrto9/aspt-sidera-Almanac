ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_add_title TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_back_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_save_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_saving_label TEXT;
ALTER TABLE ec_site_astrologers ADD COLUMN browse_profile_picker_error TEXT;

UPDATE ec_site_astrologers
SET browse_profile_picker_create_label = CASE locale
      WHEN 'es' THEN 'Añadir perfil'
      WHEN 'fr' THEN 'Ajouter un profil'
      WHEN 'pt' THEN 'Adicionar perfil'
      WHEN 'ru' THEN 'Добавить профиль'
      WHEN 'it' THEN 'Aggiungi profilo'
      WHEN 'de' THEN 'Profil hinzufügen'
      ELSE 'Add profile'
    END,
    browse_profile_picker_add_title = CASE locale
      WHEN 'es' THEN 'Añadir un perfil natal'
      WHEN 'fr' THEN 'Ajouter un profil natal'
      WHEN 'pt' THEN 'Adicionar um perfil natal'
      WHEN 'ru' THEN 'Добавить профиль рождения'
      WHEN 'it' THEN 'Aggiungi un profilo natale'
      WHEN 'de' THEN 'Geburtsprofil hinzufügen'
      ELSE 'Add a birth profile'
    END,
    browse_profile_picker_back_label = CASE locale
      WHEN 'es' THEN 'Volver a perfiles'
      WHEN 'fr' THEN 'Retour aux profils'
      WHEN 'pt' THEN 'Voltar aos perfis'
      WHEN 'ru' THEN 'Назад к профилям'
      WHEN 'it' THEN 'Torna ai profili'
      WHEN 'de' THEN 'Zurück zu Profilen'
      ELSE 'Back to profiles'
    END,
    browse_profile_picker_save_label = CASE locale
      WHEN 'es' THEN 'Guardar y seleccionar perfil'
      WHEN 'fr' THEN 'Enregistrer et choisir'
      WHEN 'pt' THEN 'Salvar e selecionar perfil'
      WHEN 'ru' THEN 'Сохранить и выбрать'
      WHEN 'it' THEN 'Salva e seleziona profilo'
      WHEN 'de' THEN 'Speichern und Profil auswählen'
      ELSE 'Save and select profile'
    END,
    browse_profile_picker_saving_label = CASE locale
      WHEN 'es' THEN 'Guardando perfil'
      WHEN 'fr' THEN 'Enregistrement du profil'
      WHEN 'pt' THEN 'Salvando perfil'
      WHEN 'ru' THEN 'Сохранение профиля'
      WHEN 'it' THEN 'Salvataggio profilo'
      WHEN 'de' THEN 'Profil wird gespeichert'
      ELSE 'Saving profile'
    END,
    browse_profile_picker_error = CASE locale
      WHEN 'es' THEN 'No se pudo guardar el perfil. Inténtalo de nuevo.'
      WHEN 'fr' THEN 'Impossible d’enregistrer le profil. Réessayez.'
      WHEN 'pt' THEN 'Não foi possível salvar o perfil. Tente novamente.'
      WHEN 'ru' THEN 'Не удалось сохранить профиль. Попробуйте снова.'
      WHEN 'it' THEN 'Impossibile salvare il profilo. Riprova.'
      WHEN 'de' THEN 'Das Profil konnte nicht gespeichert werden. Versuchen Sie es erneut.'
      ELSE 'Profile could not be saved. Please try again.'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE revisions
SET data = json_set(
  data,
  '$.browse_profile_picker_create_label', (
    SELECT browse_profile_picker_create_label
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  ),
  '$.browse_profile_picker_add_title', (
    SELECT browse_profile_picker_add_title
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  ),
  '$.browse_profile_picker_back_label', (
    SELECT browse_profile_picker_back_label
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  ),
  '$.browse_profile_picker_save_label', (
    SELECT browse_profile_picker_save_label
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  ),
  '$.browse_profile_picker_saving_label', (
    SELECT browse_profile_picker_saving_label
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  ),
  '$.browse_profile_picker_error', (
    SELECT browse_profile_picker_error
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  )
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
  );
