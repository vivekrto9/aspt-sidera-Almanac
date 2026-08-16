UPDATE ec_site_transit
SET new_chart_label = 'Select profile',
    updated_at = CURRENT_TIMESTAMP
WHERE locale = 'en'
  AND new_chart_label = 'Cast a new natal chart';
