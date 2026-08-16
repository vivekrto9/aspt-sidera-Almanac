ALTER TABLE ap_astrologers
  ADD COLUMN chat_profile_type TEXT
  CHECK (chat_profile_type IN ('KUNDLI', 'MATCHING'));

UPDATE ap_astrologers
SET active = 0,
    updated_at = CURRENT_TIMESTAMP
WHERE slug NOT IN ('orion-hale', 'selene-marlowe');

INSERT INTO ap_astrologers (
  id, slug, name, tradition, rating, reviews_count, rate_cents, currency,
  availability, categories_json, specialties_json, description, years_reading,
  sessions_count, languages_count, biography, image_url, active, sort_order,
  created_at, updated_at, chat_profile_type
) VALUES
  (
    'astrologer_orion_hale', 'orion-hale', 'Orion Hale',
    'Western · Natal charts', 4.9, 2480, 1000, 'USD', 'online',
    '["career","timing","life-path"]',
    '["Birth-chart analysis","Transit and progression timing","Career and relationship questions"]',
    'Traditional Western astrologer focused on the natal chart, transits, progressions, and grounded, actionable guidance.',
    18, 38200, 1,
    'Guides you through your natal chart, current transits, and practical direction for career, relationships, and timing.',
    '/_assets/aliases/astrologers-orion-hale/orion-hale.png',
    1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'KUNDLI'
  ),
  (
    'astrologer_selene_marlowe', 'selene-marlowe', 'Selene Marlowe',
    'Western · Synastry', 4.8, 982, 500, 'USD', 'online',
    '["love","timing"]',
    '["Synastry chart reading","Composite chart themes","Relationship timing"]',
    'Western astrologer reading synastry, composite charts, and relationship timing with warmth and clear, practical guidance.',
    15, 3200, 1,
    'I read two natal charts together — Sun, Moon, Venus, Mars, and the houses — to explain emotional rhythm, attraction, communication, and the growth edge between two people.',
    '/_assets/aliases/astrologers-selene-marlowe/selene-marlowe.png',
    1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'MATCHING'
  )
ON CONFLICT(slug) DO UPDATE SET
  name = excluded.name,
  tradition = excluded.tradition,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  rate_cents = excluded.rate_cents,
  currency = excluded.currency,
  availability = excluded.availability,
  categories_json = excluded.categories_json,
  specialties_json = excluded.specialties_json,
  description = excluded.description,
  years_reading = excluded.years_reading,
  sessions_count = excluded.sessions_count,
  languages_count = excluded.languages_count,
  biography = excluded.biography,
  image_url = excluded.image_url,
  active = excluded.active,
  sort_order = excluded.sort_order,
  chat_profile_type = excluded.chat_profile_type,
  updated_at = CURRENT_TIMESTAMP;
