-- Add the final personalized handoff copy to Today's Sky.
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_eyebrow TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_title_prefix TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_title_accent TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_title_suffix TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_description TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_primary_label TEXT;
ALTER TABLE ec_site_todays_sky ADD COLUMN sky_handoff_secondary_label TEXT;
