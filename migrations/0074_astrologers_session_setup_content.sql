-- Keep Session setup copy in a bounded supplemental collection. The primary
-- Astrologers collection already contains Browse, Profile, and SEO content.
CREATE TABLE IF NOT EXISTS ec_site_astrologers_session_setup (
  id TEXT PRIMARY KEY,
  slug TEXT,
  status TEXT DEFAULT 'draft',
  author_id TEXT,
  primary_byline_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  published_at TEXT,
  scheduled_at TEXT,
  deleted_at TEXT,
  version INTEGER DEFAULT 1,
  live_revision_id TEXT,
  draft_revision_id TEXT,
  locale TEXT DEFAULT 'en' NOT NULL,
  translation_group TEXT,
  UNIQUE(slug, locale)
);

ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_back_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_connect_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_chat_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_chat_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_voice_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_voice_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_video_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_video_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_written_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_written_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_when_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_talk_now TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_talk_now_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_schedule_later TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_schedule_later_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_choose_slot TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_one TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_two TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_three TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_four TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_five TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_slot_six TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_session_length TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_duration_fifteen TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_duration_thirty TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_duration_forty_five TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_duration_sixty TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_question_title TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_question_description TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_topic_love TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_topic_career TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_topic_timing TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_topic_life_path TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_question_placeholder TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_chart_shared TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_chart_owner TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_chart_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_edit_chart TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_summary_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_session_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_when_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_within_day_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_rate_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_per_minute_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_flat_rate_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_estimated_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_total_label TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_free_minutes TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_start_now TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_confirm_booking TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_send_question TEXT;
ALTER TABLE ec_site_astrologers_session_setup ADD COLUMN setup_secure_note TEXT;
