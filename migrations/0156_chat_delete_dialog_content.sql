ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_label TEXT;
ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_title TEXT;
ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_description TEXT;
ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_confirm TEXT;
ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_deleting TEXT;
ALTER TABLE ec_site_astrologers_chat_history ADD COLUMN live_delete_session_cancel TEXT;

UPDATE ec_site_astrologers_chat_history
SET live_delete_session_label = CASE locale
      WHEN 'es' THEN 'Eliminar sesión de chat'
      WHEN 'fr' THEN 'Supprimer la session de chat'
      WHEN 'pt' THEN 'Excluir sessão de chat'
      WHEN 'ru' THEN 'Удалить сеанс чата'
      WHEN 'it' THEN 'Elimina sessione di chat'
      WHEN 'de' THEN 'Chatsitzung löschen'
      ELSE 'Delete chat session'
    END,
    live_delete_session_title = CASE locale
      WHEN 'es' THEN '¿Eliminar este chat?'
      WHEN 'fr' THEN 'Supprimer ce chat ?'
      WHEN 'pt' THEN 'Excluir este chat?'
      WHEN 'ru' THEN 'Удалить этот чат?'
      WHEN 'it' THEN 'Eliminare questa chat?'
      WHEN 'de' THEN 'Diesen Chat löschen?'
      ELSE 'Delete this chat?'
    END,
    live_delete_session_description = CASE locale
      WHEN 'es' THEN 'Esto elimina permanentemente la sesión y su historial de mensajes. Esta acción no se puede deshacer.'
      WHEN 'fr' THEN 'Cette action supprime définitivement la session et son historique de messages. Elle est irréversible.'
      WHEN 'pt' THEN 'Isso exclui permanentemente a sessão e o histórico de mensagens. Esta ação não pode ser desfeita.'
      WHEN 'ru' THEN 'Сеанс и история сообщений будут удалены навсегда. Это действие нельзя отменить.'
      WHEN 'it' THEN 'La sessione e la cronologia dei messaggi verranno eliminate definitivamente. Questa azione non può essere annullata.'
      WHEN 'de' THEN 'Die Sitzung und ihr Nachrichtenverlauf werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'
      ELSE 'This permanently deletes the session and its message history. This action cannot be undone.'
    END,
    live_delete_session_confirm = CASE locale
      WHEN 'es' THEN 'Eliminar sesión'
      WHEN 'fr' THEN 'Supprimer la session'
      WHEN 'pt' THEN 'Excluir sessão'
      WHEN 'ru' THEN 'Удалить сеанс'
      WHEN 'it' THEN 'Elimina sessione'
      WHEN 'de' THEN 'Sitzung löschen'
      ELSE 'Delete session'
    END,
    live_delete_session_deleting = CASE locale
      WHEN 'es' THEN 'Eliminando sesión'
      WHEN 'fr' THEN 'Suppression de la session'
      WHEN 'pt' THEN 'Excluindo sessão'
      WHEN 'ru' THEN 'Удаление сеанса'
      WHEN 'it' THEN 'Eliminazione sessione'
      WHEN 'de' THEN 'Sitzung wird gelöscht'
      ELSE 'Deleting session'
    END,
    live_delete_session_cancel = CASE locale
      WHEN 'es' THEN 'Conservar sesión'
      WHEN 'fr' THEN 'Conserver la session'
      WHEN 'pt' THEN 'Manter sessão'
      WHEN 'ru' THEN 'Сохранить сеанс'
      WHEN 'it' THEN 'Mantieni sessione'
      WHEN 'de' THEN 'Sitzung behalten'
      ELSE 'Keep session'
    END;

