-- Materialize editable static copy for the Today's Sky wheel and positions section.
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_wheel_caption TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_positions_title TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_positions_count TEXT;
