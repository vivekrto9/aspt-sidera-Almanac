ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_preview_label TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_eyebrow TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_title TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_description TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_context_title TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_context_description TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_retry_label TEXT;
ALTER TABLE ec_site_shop_checkout_flow ADD COLUMN shop_payment_failure_cart_label TEXT;

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_preview_label = CASE locale
  WHEN 'es' THEN 'Ver fallo de pago'
  WHEN 'fr' THEN 'Voir l''échec du paiement'
  WHEN 'pt' THEN 'Ver falha de pagamento'
  WHEN 'ru' THEN 'Показать ошибку оплаты'
  WHEN 'it' THEN 'Mostra pagamento non riuscito'
  WHEN 'de' THEN 'Fehlgeschlagene Zahlung anzeigen'
  ELSE 'Preview payment failure'
END
WHERE shop_payment_failure_preview_label IS NULL OR trim(shop_payment_failure_preview_label) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_eyebrow = CASE locale
  WHEN 'es' THEN 'Pago no completado'
  WHEN 'fr' THEN 'Paiement non abouti'
  WHEN 'pt' THEN 'Pagamento não concluído'
  WHEN 'ru' THEN 'Оплата не прошла'
  WHEN 'it' THEN 'Pagamento non riuscito'
  WHEN 'de' THEN 'Zahlung fehlgeschlagen'
  ELSE 'Payment unsuccessful'
END
WHERE shop_payment_failure_eyebrow IS NULL OR trim(shop_payment_failure_eyebrow) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_title = CASE locale
  WHEN 'es' THEN 'Los astros aún no se han alineado.'
  WHEN 'fr' THEN 'Les astres ne sont pas encore alignés.'
  WHEN 'pt' THEN 'Os astros ainda não se alinharam.'
  WHEN 'ru' THEN 'Звёзды пока не сошлись.'
  WHEN 'it' THEN 'Le stelle non si sono ancora allineate.'
  WHEN 'de' THEN 'Die Sterne stehen noch nicht ganz richtig.'
  ELSE 'The stars haven''t aligned just yet.'
END
WHERE shop_payment_failure_title IS NULL OR trim(shop_payment_failure_title) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_description = CASE locale
  WHEN 'es' THEN 'El pago no se completó y no se realizó ningún cargo.'
  WHEN 'fr' THEN 'Votre paiement n''a pas abouti et aucun montant n''a été débité.'
  WHEN 'pt' THEN 'O pagamento não foi concluído e nenhum valor foi cobrado.'
  WHEN 'ru' THEN 'Платёж не был завершён, и средства не списаны.'
  WHEN 'it' THEN 'Il pagamento non è stato completato e non è stato effettuato alcun addebito.'
  WHEN 'de' THEN 'Deine Zahlung wurde nicht abgeschlossen und es wurde nichts abgebucht.'
  ELSE 'Your payment wasn''t completed, and no charge was made.'
END
WHERE shop_payment_failure_description IS NULL OR trim(shop_payment_failure_description) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_context_title = CASE locale
  WHEN 'es' THEN 'Tu carrito sigue guardado.'
  WHEN 'fr' THEN 'Votre panier est toujours enregistré.'
  WHEN 'pt' THEN 'O seu carrinho continua guardado.'
  WHEN 'ru' THEN 'Ваша корзина сохранена.'
  WHEN 'it' THEN 'Il tuo carrello è ancora salvato.'
  WHEN 'de' THEN 'Dein Warenkorb bleibt gespeichert.'
  ELSE 'Your cart is still saved.'
END
WHERE shop_payment_failure_context_title IS NULL OR trim(shop_payment_failure_context_title) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_context_description = CASE locale
  WHEN 'es' THEN 'Revisa los datos de tu tarjeta o elige otro método de pago y vuelve a intentarlo.'
  WHEN 'fr' THEN 'Vérifiez les informations de votre carte ou choisissez un autre moyen de paiement, puis réessayez.'
  WHEN 'pt' THEN 'Verifique os dados do cartão ou escolha outro método de pagamento e tente novamente.'
  WHEN 'ru' THEN 'Проверьте данные карты или выберите другой способ оплаты и попробуйте снова.'
  WHEN 'it' THEN 'Controlla i dati della carta o scegli un altro metodo di pagamento, quindi riprova.'
  WHEN 'de' THEN 'Prüfe deine Kartendaten oder wähle eine andere Zahlungsmethode und versuche es erneut.'
  ELSE 'Check your card details or choose another payment method, then try again.'
END
WHERE shop_payment_failure_context_description IS NULL OR trim(shop_payment_failure_context_description) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_retry_label = CASE locale
  WHEN 'es' THEN 'Intentar pagar de nuevo'
  WHEN 'fr' THEN 'Réessayer le paiement'
  WHEN 'pt' THEN 'Tentar pagar novamente'
  WHEN 'ru' THEN 'Попробовать оплатить снова'
  WHEN 'it' THEN 'Riprova il pagamento'
  WHEN 'de' THEN 'Zahlung erneut versuchen'
  ELSE 'Try payment again'
END
WHERE shop_payment_failure_retry_label IS NULL OR trim(shop_payment_failure_retry_label) = '';

UPDATE ec_site_shop_checkout_flow
SET shop_payment_failure_cart_label = CASE locale
  WHEN 'es' THEN 'Volver al carrito'
  WHEN 'fr' THEN 'Retour au panier'
  WHEN 'pt' THEN 'Voltar ao carrinho'
  WHEN 'ru' THEN 'Вернуться в корзину'
  WHEN 'it' THEN 'Torna al carrello'
  WHEN 'de' THEN 'Zurück zum Warenkorb'
  ELSE 'Return to cart'
END
WHERE shop_payment_failure_cart_label IS NULL OR trim(shop_payment_failure_cart_label) = '';
