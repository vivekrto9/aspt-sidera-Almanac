-- Extend the bounded Astrologer session collection for the ordered Live session
-- state. Session summary fields are intentionally not included.
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_connected TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_meter_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_end_session TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_session_started TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_opening_message TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_reply_message TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_quick_year TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_quick_career TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_quick_love TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_quick_transits TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_message_placeholder TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_send_message TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_chart_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_chart_owner TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_chart_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_asked_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_asked_text TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_placements_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_sun_placement TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_moon_placement TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN live_rising_placement TEXT;
