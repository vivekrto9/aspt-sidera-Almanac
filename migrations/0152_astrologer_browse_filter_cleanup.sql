UPDATE ec_site_astrologers
SET filter_love = 'Love',
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'astrologers'
  AND locale = 'en'
  AND filter_love = 'Love s';
