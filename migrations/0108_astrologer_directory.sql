CREATE TABLE IF NOT EXISTS ap_astrologers (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tradition TEXT NOT NULL,
  rating REAL NOT NULL,
  reviews_count INTEGER NOT NULL,
  rate_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  availability TEXT NOT NULL,
  categories_json TEXT NOT NULL,
  specialties_json TEXT NOT NULL,
  description TEXT NOT NULL,
  years_reading INTEGER NOT NULL,
  sessions_count INTEGER NOT NULL,
  languages_count INTEGER NOT NULL,
  biography TEXT NOT NULL,
  image_url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ap_astrologers_active_order
  ON ap_astrologers(active, sort_order, slug);

INSERT INTO ap_astrologers (
  id, slug, name, tradition, rating, reviews_count, rate_cents, currency,
  availability, categories_json, specialties_json, description, years_reading,
  sessions_count, languages_count, biography, image_url, active, sort_order,
  created_at, updated_at
) VALUES
  ('astrologer_mara_ellison', 'mara-ellison', 'Mara Ellison', 'Vedic · Relationships', 4.9, 1240, 320, 'USD', 'online', '["love","life-path"]', '["Love & Relationships","Marriage timing","Karmic patterns"]', 'Warm, direct, and remarkably specific about timing. Mara reads the Vedic dashas to tell you not just what, but when.', 8, 6200, 2, 'Mara has practised Vedic astrology for eight years, training in Jyotish in Pune before reading full-time. She specialises in relationships and life-path questions, blending the precision of the dasha system with a grounded, compassionate style. Clients come to her when they want a clear read on timing — and leave with something they can actually act on.', '/_assets/aliases/astrologers-mara-ellison/mara-ellison.png', 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_devin_roy', 'devin-roy', 'Devin Roy', 'Hellenistic · Career', 4.8, 980, 280, 'USD', 'online', '["career","timing"]', '["Career & vocation","Annual profections","Decision timing"]', 'Traditional techniques, modern clarity. Devin is the person to see before a big career move — he times it beautifully.', 6, 4100, 1, 'Devin works in the Hellenistic tradition, using time-lord techniques and annual profections to map the arc of a career. Practical and calm, he’s known for turning intimidating chart language into a plan you can follow. He reads for founders, career-changers, and anyone standing at a fork in the road.', '/_assets/aliases/astrologers-devin-roy/devin-roy.png', 1, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_yuki_tanaka', 'yuki-tanaka', 'Yuki Tanaka', 'Psychological · Transits', 5.0, 2100, 410, 'USD', 'offline', '["life-path","spiritual"]', '["Inner work","Transits","Saturn returns"]', 'Depth over prediction. Yuki reads the chart as a map of your inner world — gentle, precise, unforgettable.', 11, 9400, 2, 'With eleven years of practice, Yuki brings a psychological, Jungian lens to the birth chart. Rather than forecasting events, they illuminate the patterns beneath them — especially through big transits like the Saturn return. Sessions with Yuki are reflective and deep; regulars book them for the turning points.', '/_assets/aliases/astrologers-yuki-tanaka/yuki-tanaka.png', 1, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_priya_nair', 'priya-nair', 'Priya Nair', 'Horary · Timing', 4.9, 760, 300, 'USD', 'online', '["timing","life-path"]', '["Horary questions","Lost & found","Yes / no timing"]', 'Ask a real question, get a real answer. Priya’s horary work is uncannily on point for concrete decisions.', 5, 3300, 3, 'Priya specialises in horary astrology — the art of answering a specific question from the chart of the moment it’s asked. If you have a clear, pressing question, she’s the one to bring it to. Fast, warm, and refreshingly straight, she reads in three languages.', '/_assets/aliases/astrologers-priya-nair/priya-nair.png', 1, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_sol_marino', 'sol-marino', 'Sol Marino', 'Evolutionary · Life Path', 4.7, 540, 260, 'USD', 'online', '["life-path","spiritual"]', '["Soul purpose","Nodes","Life direction"]', 'For the bigger questions. Sol works with the lunar nodes to help you feel where your life is genuinely pointing.', 4, 2100, 2, 'Sol reads in the evolutionary tradition, centring the lunar nodes and the story of the soul’s direction. Their sessions suit anyone wrestling with meaning and purpose rather than a single event. Thoughtful and encouraging, Sol leaves you with a sense of direction, not a to-do list.', '/_assets/aliases/astrologers-sol-marino/sol-marino.png', 1, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_amara_okafor', 'amara-okafor', 'Amara Okafor', 'Traditional · Love', 4.9, 1580, 360, 'USD', 'busy', '["love","timing"]', '["Relationships","Synastry","Reconciliation"]', 'The one people come back to. Amara’s synastry work is famous — honest about the friction, generous about the love.', 9, 7100, 2, 'Amara has spent nine years reading relationships through traditional synastry and composite techniques. She’s candid about where two charts rub and equally clear about where the real bond lives. Clients trust her because she never sugar-coats — and never leaves you without hope.', '/_assets/aliases/astrologers-amara-okafor/amara-okafor.png', 1, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_bran_kavanagh', 'bran-kavanagh', 'Bran Kavanagh', 'Mundane · Timing', 4.6, 410, 240, 'USD', 'offline', '["timing","career"]', '["Electional","Best dates","Launch timing"]', 'Need the right day to launch, sign, or start? Bran does electional work — picking the moment the sky is on your side.', 7, 2800, 1, 'Bran practises electional and mundane astrology — choosing auspicious moments and reading the wider cycles. He’s the astrologer to see when timing is everything: a launch, a signing, a move. Methodical and dry-humoured, he backs every date with clear reasoning.', '/_assets/aliases/astrologers-bran-kavanagh/bran-kavanagh.png', 1, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_lena_fischer', 'lena-fischer', 'Lena Fischer', 'Psychological · Spiritual', 4.8, 890, 340, 'USD', 'online', '["spiritual","life-path"]', '["Shadow work","Dreams","Chiron"]', 'Tender and deep. Lena works with Chiron and the shadow — the parts of the chart most readers skip past.', 10, 5600, 3, 'Lena blends psychological astrology with a spiritual sensibility, drawn especially to Chiron, the shadow, and the material of dreams. Her readings go where others don’t, held in a calm and safe space. She reads for those doing real inner work and ready to meet it.', '/_assets/aliases/astrologers-lena-fischer/lena-fischer.png', 1, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('astrologer_theo_alvarez', 'theo-alvarez', 'Theo Alvarez', 'Hellenistic · Career', 4.7, 620, 290, 'USD', 'online', '["career","timing"]', '["Vocation","Money & work","Zodiacal releasing"]', 'Sharp on money and vocation. Theo uses zodiacal releasing to find the chapters when your work really takes off.', 5, 2400, 2, 'Theo reads in the Hellenistic tradition with a focus on vocation and money, using zodiacal releasing to spot the peak chapters of a working life. Energetic and practical, he’s a favourite among freelancers and career-builders who want to know where to place their bets.', '/_assets/aliases/astrologers-theo-alvarez/theo-alvarez.png', 1, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO UPDATE SET
  slug = excluded.slug,
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
  updated_at = CURRENT_TIMESTAMP;
