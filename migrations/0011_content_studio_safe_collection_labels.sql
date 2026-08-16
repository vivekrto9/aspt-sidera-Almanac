-- Keep generated EmDash TypeScript interface names free of punctuation.
UPDATE _emdash_collections
SET
  label = 'Today Sky Content',
  label_singular = 'Today Sky Content',
  updated_at = datetime('now')
WHERE slug = 'site_todays_sky';
