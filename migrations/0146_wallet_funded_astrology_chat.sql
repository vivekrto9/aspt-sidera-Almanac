-- Wallet-funded, per-question astrology chat. The legacy entitlement-backed
-- session tables are intentionally retained so historical paid-session data is
-- not destroyed while the customer flow moves to wallet chat.
CREATE TABLE IF NOT EXISTS ap_wallet_chat_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  astrologer_slug TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'astrologyapi',
  session_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  client_request_key TEXT,
  completed_at TEXT,
  send_lock_token TEXT,
  send_lock_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES ap_customer_accounts(id),
  FOREIGN KEY (profile_id) REFERENCES ap_customer_user_profiles(id),
  FOREIGN KEY (astrologer_slug) REFERENCES ap_astrologers(slug),
  CHECK (status IN ('active', 'completed', 'cancelled')),
  CHECK (price_cents > 0),
  CHECK (currency = 'USD')
);

CREATE INDEX IF NOT EXISTS idx_ap_wallet_chat_sessions_account
  ON ap_wallet_chat_sessions(account_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ap_wallet_chat_sessions_status
  ON ap_wallet_chat_sessions(status, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_wallet_chat_sessions_request
  ON ap_wallet_chat_sessions(account_id, client_request_key)
  WHERE client_request_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS ap_wallet_chat_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  provider_message_json TEXT,
  reply_to_message_id TEXT,
  client_request_key TEXT,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES ap_wallet_chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_to_message_id) REFERENCES ap_wallet_chat_messages(id),
  CHECK (role IN ('user', 'assistant', 'system')),
  CHECK (cost_cents >= 0)
);

CREATE INDEX IF NOT EXISTS idx_ap_wallet_chat_messages_session
  ON ap_wallet_chat_messages(session_id, created_at, id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ap_wallet_chat_messages_request
  ON ap_wallet_chat_messages(session_id, client_request_key)
  WHERE client_request_key IS NOT NULL;

-- Content Studio fields for the wallet state shown inside the live chat.
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_low_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_low_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_current_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_required_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_shortfall_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_add_funds_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_wallet_close_label TEXT;

UPDATE ec_site_astrologers_session_setup
SET live_wallet_label = CASE locale
      WHEN 'es' THEN 'Cartera'
      WHEN 'fr' THEN 'Portefeuille'
      WHEN 'pt' THEN 'Carteira'
      WHEN 'ru' THEN 'Кошелёк'
      WHEN 'it' THEN 'Portafoglio'
      WHEN 'de' THEN 'Wallet'
      ELSE 'Wallet'
    END,
    live_meter_label = CASE locale
      WHEN 'es' THEN 'por pregunta'
      WHEN 'fr' THEN 'par question'
      WHEN 'pt' THEN 'por pergunta'
      WHEN 'ru' THEN 'за вопрос'
      WHEN 'it' THEN 'per domanda'
      WHEN 'de' THEN 'pro Frage'
      ELSE 'per question'
    END,
    live_wallet_low_title = CASE locale
      WHEN 'es' THEN 'Añade fondos para seguir chateando'
      WHEN 'fr' THEN 'Ajoutez des fonds pour continuer'
      WHEN 'pt' THEN 'Adicione saldo para continuar'
      WHEN 'ru' THEN 'Пополните кошелёк, чтобы продолжить'
      WHEN 'it' THEN 'Aggiungi fondi per continuare'
      WHEN 'de' THEN 'Guthaben aufladen und weiterchatten'
      ELSE 'Add funds to keep chatting'
    END,
    live_wallet_low_description = CASE locale
      WHEN 'es' THEN 'Tu mensaje sigue aquí. Recarga la cartera y vuelve a enviarlo.'
      WHEN 'fr' THEN 'Votre message est conservé. Rechargez votre portefeuille puis renvoyez-le.'
      WHEN 'pt' THEN 'Sua mensagem continua aqui. Recarregue a carteira e envie novamente.'
      WHEN 'ru' THEN 'Сообщение сохранено. Пополните кошелёк и отправьте его снова.'
      WHEN 'it' THEN 'Il messaggio è ancora qui. Ricarica il portafoglio e invialo di nuovo.'
      WHEN 'de' THEN 'Deine Nachricht bleibt erhalten. Lade das Wallet auf und sende sie erneut.'
      ELSE 'Your message is still here. Recharge your wallet, then send it again.'
    END,
    live_wallet_current_label = CASE locale
      WHEN 'es' THEN 'Saldo actual'
      WHEN 'fr' THEN 'Solde actuel'
      WHEN 'pt' THEN 'Saldo atual'
      WHEN 'ru' THEN 'Текущий баланс'
      WHEN 'it' THEN 'Saldo attuale'
      WHEN 'de' THEN 'Aktuelles Guthaben'
      ELSE 'Current balance'
    END,
    live_wallet_required_label = CASE locale
      WHEN 'es' THEN 'Precio de la pregunta'
      WHEN 'fr' THEN 'Prix de la question'
      WHEN 'pt' THEN 'Preço da pergunta'
      WHEN 'ru' THEN 'Цена вопроса'
      WHEN 'it' THEN 'Prezzo della domanda'
      WHEN 'de' THEN 'Preis pro Frage'
      ELSE 'Question price'
    END,
    live_wallet_shortfall_label = CASE locale
      WHEN 'es' THEN 'Importe necesario'
      WHEN 'fr' THEN 'Montant nécessaire'
      WHEN 'pt' THEN 'Valor necessário'
      WHEN 'ru' THEN 'Необходимая сумма'
      WHEN 'it' THEN 'Importo necessario'
      WHEN 'de' THEN 'Benötigter Betrag'
      ELSE 'Amount needed'
    END,
    live_add_funds_label = CASE locale
      WHEN 'es' THEN 'Añadir fondos'
      WHEN 'fr' THEN 'Ajouter des fonds'
      WHEN 'pt' THEN 'Adicionar saldo'
      WHEN 'ru' THEN 'Пополнить'
      WHEN 'it' THEN 'Aggiungi fondi'
      WHEN 'de' THEN 'Guthaben aufladen'
      ELSE 'Add funds'
    END,
    live_wallet_close_label = CASE locale
      WHEN 'es' THEN 'Ahora no'
      WHEN 'fr' THEN 'Pas maintenant'
      WHEN 'pt' THEN 'Agora não'
      WHEN 'ru' THEN 'Не сейчас'
      WHEN 'it' THEN 'Non ora'
      WHEN 'de' THEN 'Nicht jetzt'
      ELSE 'Not now'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE revisions
SET data = json_set(
  data,
  '$.live_wallet_label', (SELECT live_wallet_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_meter_label', (SELECT live_meter_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_low_title', (SELECT live_wallet_low_title FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_low_description', (SELECT live_wallet_low_description FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_current_label', (SELECT live_wallet_current_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_required_label', (SELECT live_wallet_required_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_shortfall_label', (SELECT live_wallet_shortfall_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_add_funds_label', (SELECT live_add_funds_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id),
  '$.live_wallet_close_label', (SELECT live_wallet_close_label FROM ec_site_astrologers_session_setup WHERE id = revisions.entry_id)
)
WHERE collection = 'site_astrologers_session_setup'
  AND id IN (
    SELECT live_revision_id FROM ec_site_astrologers_session_setup WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id FROM ec_site_astrologers_session_setup WHERE draft_revision_id IS NOT NULL
  );

-- Replace minute-based customer copy with per-question wallet copy.
UPDATE ec_site_astrologers
SET rate_unit = CASE locale
      WHEN 'es' THEN '/pregunta'
      WHEN 'fr' THEN '/question'
      WHEN 'pt' THEN '/pergunta'
      WHEN 'ru' THEN '/вопрос'
      WHEN 'it' THEN '/domanda'
      WHEN 'de' THEN '/Frage'
      ELSE '/question'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE ec_site_astrologer_profiles
SET profile_rate_unit = CASE locale
      WHEN 'es' THEN '/pregunta'
      WHEN 'fr' THEN '/question'
      WHEN 'pt' THEN '/pergunta'
      WHEN 'ru' THEN '/вопрос'
      WHEN 'it' THEN '/domanda'
      WHEN 'de' THEN '/Frage'
      ELSE '/question'
    END,
    profile_free_minutes_note = CASE locale
      WHEN 'es' THEN 'Tu cartera se cobra solo cuando {name} responde.'
      WHEN 'fr' THEN 'Votre portefeuille est débité uniquement après la réponse de {name}.'
      WHEN 'pt' THEN 'Sua carteira só é cobrada quando {name} responde.'
      WHEN 'ru' THEN 'Списание происходит только после ответа от {name}.'
      WHEN 'it' THEN 'Il portafoglio viene addebitato solo dopo la risposta di {name}.'
      WHEN 'de' THEN 'Dein Wallet wird erst nach der Antwort von {name} belastet.'
      ELSE 'Your wallet is charged only after {name} returns an answer.'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE revisions
SET data = json_set(
  data,
  '$.rate_unit', (SELECT rate_unit FROM ec_site_astrologers WHERE id = revisions.entry_id)
)
WHERE collection = 'site_astrologers'
  AND id IN (
    SELECT live_revision_id FROM ec_site_astrologers WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id FROM ec_site_astrologers WHERE draft_revision_id IS NOT NULL
  );

UPDATE revisions
SET data = json_set(
  data,
  '$.profile_rate_unit', (SELECT profile_rate_unit FROM ec_site_astrologer_profiles WHERE id = revisions.entry_id),
  '$.profile_free_minutes_note', (SELECT profile_free_minutes_note FROM ec_site_astrologer_profiles WHERE id = revisions.entry_id)
)
WHERE collection = 'site_astrologer_profiles'
  AND id IN (
    SELECT live_revision_id FROM ec_site_astrologer_profiles WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id FROM ec_site_astrologer_profiles WHERE draft_revision_id IS NOT NULL
  );
