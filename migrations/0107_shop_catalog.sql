CREATE TABLE IF NOT EXISTS ap_shop_products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  personalized INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  tone INTEGER NOT NULL DEFAULT 0,
  variant_key TEXT,
  variant_option_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ap_shop_products_active_sort
  ON ap_shop_products(active, sort_order, slug);

INSERT INTO ap_shop_products (
  id, slug, display_name, description, category, price_cents, currency,
  personalized, rating, reviews_count, tone, variant_key,
  variant_option_count, image_url, active, sort_order, created_at, updated_at
) VALUES
  ('natal-print', 'natal-print', 'Natal Chart Print', 'Personalized framed natal chart print.', 'prints', 4800, 'USD', 1, 4.9, 214, 0, 'frame', 3, '/_assets/aliases/shop-natal-print/natal-print.png', 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('tapestry', 'tapestry', 'Constellation Tapestry', 'Woven cotton constellation wall hanging.', 'prints', 6400, 'USD', 0, 4.8, 96, 1, 'size', 2, '/_assets/aliases/shop-tapestry/tapestry.png', 1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('almanac', 'almanac', 'The Almanac 2026', 'Annual sky and transit almanac.', 'books', 2800, 'USD', 0, 4.9, 340, 2, NULL, 0, '/_assets/aliases/shop-almanac/almanac.png', 1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('tarot', 'tarot', 'Celestial Tarot Deck', 'Seventy-eight card celestial tarot deck.', 'books', 3400, 'USD', 0, 4.7, 158, 3, NULL, 0, '/_assets/aliases/shop-tarot/tarot.png', 1, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('notebook', 'notebook', 'Ephemeris Notebook', 'Lay-flat moon phase notebook.', 'books', 1800, 'USD', 0, 4.8, 203, 2, 'cover', 2, '/_assets/aliases/shop-notebook/notebook.png', 1, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('candle', 'candle', 'Lunar Phase Candle', 'Hand-poured soy lunar phase candle.', 'home', 2200, 'USD', 0, 4.9, 512, 4, 'scent', 3, '/_assets/aliases/shop-candle/candle.png', 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('scarf', 'scarf', 'Star Map Silk Scarf', 'Mulberry silk star map scarf.', 'home', 5800, 'USD', 0, 4.8, 74, 5, NULL, 0, '/_assets/aliases/shop-scarf/scarf.png', 1, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pins', 'pins', 'Zodiac Enamel Pins', 'Set of four hard-enamel zodiac pins.', 'jewelry', 1600, 'USD', 0, 4.7, 189, 6, 'element', 4, '/_assets/aliases/shop-pins/pins.png', 1, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pendant', 'pendant', 'Birth Chart Pendant', 'Personalized engraved birth chart pendant.', 'jewelry', 5200, 'USD', 1, 5.0, 88, 7, 'metal', 2, '/_assets/aliases/shop-pendant/pendant.png', 1, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
  slug = excluded.slug,
  display_name = excluded.display_name,
  description = excluded.description,
  category = excluded.category,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  personalized = excluded.personalized,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  tone = excluded.tone,
  variant_key = excluded.variant_key,
  variant_option_count = excluded.variant_option_count,
  image_url = excluded.image_url,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;
