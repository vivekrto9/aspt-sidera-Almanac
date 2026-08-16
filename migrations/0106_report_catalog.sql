CREATE TABLE IF NOT EXISTS ap_report_products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  report_type TEXT NOT NULL UNIQUE,
  pages_count INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  glyph TEXT NOT NULL,
  cover_tone TEXT NOT NULL,
  image_url TEXT NOT NULL,
  provider_endpoint_key TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ap_report_products_active_order
  ON ap_report_products(active, sort_order, slug);

INSERT INTO ap_report_products (
  id, slug, report_type, pages_count, price_cents, currency, glyph,
  cover_tone, image_url, provider_endpoint_key, active, sort_order,
  created_at, updated_at
) VALUES
  ('report_natal_blueprint', 'natal-blueprint', 'natal_blueprint', 42, 2900, 'USD', '☉', 'terracotta', '/_assets/aliases/reports-natal-blueprint/natal-blueprint.png', NULL, 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('report_year_ahead', 'year-ahead-forecast', 'year_ahead', 38, 3400, 'USD', '♃', 'ochre', '/_assets/aliases/reports-year-ahead-forecast/year-ahead-forecast.png', NULL, 1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('report_relationship_synastry', 'relationship-synastry', 'relationship_synastry', 31, 3900, 'USD', '♀', 'rose', '/_assets/aliases/reports-relationship-synastry/relationship-synastry.png', NULL, 1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('report_solar_return', 'solar-return-report', 'solar_return', 26, 2700, 'USD', '☀', 'terracotta', '/_assets/aliases/reports-solar-return-report/solar-return-report.png', NULL, 1, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('report_career_vocation', 'career-vocation', 'career_vocation', 34, 3200, 'USD', '♐', 'olive', '/_assets/aliases/reports-career-vocation/career-vocation.png', NULL, 1, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('report_saturn_return', 'saturn-return-report', 'saturn_return', 30, 3000, 'USD', '♄', 'slate', '/_assets/aliases/reports-saturn-return-report/saturn-return-report.png', NULL, 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
  slug = excluded.slug,
  report_type = excluded.report_type,
  pages_count = excluded.pages_count,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  glyph = excluded.glyph,
  cover_tone = excluded.cover_tone,
  image_url = excluded.image_url,
  provider_endpoint_key = excluded.provider_endpoint_key,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;
