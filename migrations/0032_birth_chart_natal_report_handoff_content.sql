-- Add the Birth Chart natal-report handoff copy to the bounded Results collection.
ALTER TABLE ec_site_birth_chart_results ADD COLUMN report_eyebrow TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN report_title TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN report_description TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN report_primary_label TEXT;
ALTER TABLE ec_site_birth_chart_results ADD COLUMN report_secondary_label TEXT;
