-- Materialize the editable static copy in the Today's Sky date scrubber.
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_eyebrow TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_today_action TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_today_marker TEXT;
