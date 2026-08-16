-- Materialize the visible label for the prepared current-position strip.
ALTER TABLE ec_site_todays_sky ADD COLUMN date_scrubber_moving_now_label TEXT;
