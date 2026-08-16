DROP VIEW IF EXISTS ap_sales_transactions_v1;
CREATE VIEW ap_sales_transactions_v1 AS
SELECT
  orders.id AS transaction_id,
  orders.order_number AS reference,
  CASE WHEN orders.order_type = 'report' THEN 'report_order' ELSE 'product_order' END AS kind_key,
  CASE WHEN orders.order_type = 'report' THEN 'Report orders' ELSE 'Shop orders' END AS kind_label,
  COALESCE((SELECT line.product_slug FROM ap_commerce_order_lines line WHERE line.order_id = orders.id ORDER BY line.created_at ASC, line.id ASC LIMIT 1), '') AS item_key,
  COALESCE((SELECT line.product_name FROM ap_commerce_order_lines line WHERE line.order_id = orders.id ORDER BY line.created_at ASC, line.id ASC LIMIT 1), '') AS item_label,
  orders.account_id AS owner_key,
  orders.customer_name AS owner_label,
  orders.total_cents AS amount_minor,
  CASE WHEN orders.status = 'refunded' THEN orders.total_cents ELSE 0 END AS refunded_minor,
  orders.currency AS currency,
  orders.status AS payment_status,
  'stripe' AS payment_provider,
  orders.status AS business_status,
  orders.fulfillment_status AS fulfillment_status,
  orders.created_at AS created_at,
  orders.paid_at AS paid_at,
  orders.updated_at AS updated_at
FROM ap_commerce_orders orders;

DROP VIEW IF EXISTS ap_sales_dimensions_v1;
CREATE VIEW ap_sales_dimensions_v1 AS
SELECT
  line.order_id AS transaction_id,
  'product' AS dimension_key,
  'Product' AS dimension_label,
  line.product_slug AS value_key,
  line.product_name AS value_label
FROM ap_commerce_order_lines line;
