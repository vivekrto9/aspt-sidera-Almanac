UPDATE ec_site_astrologers
SET browse_description = CASE locale
      WHEN 'es' THEN 'Astrólogos reales leyendo tu carta. Paga desde tu cartera, una pregunta respondida cada vez.'
      WHEN 'fr' THEN 'De vrais astrologues lisent votre thème. Payez avec votre portefeuille, une réponse à la fois.'
      WHEN 'pt' THEN 'Astrólogos reais lendo o seu mapa. Pague pela carteira, uma pergunta respondida de cada vez.'
      WHEN 'ru' THEN 'Настоящие астрологи читают вашу карту. Оплата из кошелька за каждый полученный ответ.'
      WHEN 'it' THEN 'Astrologi reali leggono il tuo tema. Paga dal portafoglio, una domanda con risposta alla volta.'
      WHEN 'de' THEN 'Echte Astrologen lesen dein persönliches Horoskop. Bezahle pro beantworteter Frage aus deinem Wallet.'
      ELSE 'Real astrologers reading your actual chart. Pay securely from your wallet, one answered question at a time.'
    END,
    updated_at = CURRENT_TIMESTAMP;

UPDATE revisions
SET data = json_set(
  data,
  '$.browse_description', (
    SELECT browse_description
    FROM ec_site_astrologers
    WHERE ec_site_astrologers.id = revisions.entry_id
  )
)
WHERE collection = 'site_astrologers'
  AND id IN (
    SELECT live_revision_id FROM ec_site_astrologers WHERE live_revision_id IS NOT NULL
    UNION
    SELECT draft_revision_id FROM ec_site_astrologers WHERE draft_revision_id IS NOT NULL
  );
