import {
  activeLocales,
  type SupportedLocale,
} from "./localization-contract.ts";
import { getAuthShellCopy } from "./locale/auth/common/shell.ts";
import { getForgotPasswordShellCopy } from "./locale/auth/common/forgot-password-shell.ts";
import { getResetPasswordShellCopy } from "./locale/auth/common/reset-password-shell.ts";
import { getAuthSignupShellCopy } from "./locale/auth/common/signup-shell.ts";
import { getAuthForgotPasswordFormCopy } from "./locale/auth/sections/forgot-password-form.ts";
import { getAuthResetPasswordFormCopy } from "./locale/auth/sections/reset-password-form.ts";
import { getAuthLoginFormCopy } from "./locale/auth/sections/login-form.ts";
import { getAuthSignupFormCopy } from "./locale/auth/sections/signup-form.ts";
import { getAuthSeoCopy } from "./locale/auth/seo.ts";
import { getForgotPasswordSeoCopy } from "./locale/auth/forgot-password-seo.ts";
import { getResetPasswordSeoCopy } from "./locale/auth/reset-password-seo.ts";
import { getAuthSignupSeoCopy } from "./locale/auth/signup-seo.ts";
import { getAccountShellNavigationCopy } from "./locale/account/sections/shell-navigation.ts";
import { getAccountOverviewCopy } from "./locale/account/sections/overview.ts";
import { getAccountPeopleCopy } from "./locale/account/sections/people.ts";
import { getAccountOrdersCopy } from "./locale/account/sections/orders.ts";
import { getAccountSessionsCopy } from "./locale/account/sections/sessions.ts";
import { getAccountSettingsCopy } from "./locale/account/sections/settings.ts";
import { getAccountWalletCopy } from "./locale/account/sections/wallet.ts";
import { getAccountCollectionsCopy } from "./locale/account/sections/collections.ts";
import { getAccountSavedChartsCopy } from "./locale/account/sections/saved-charts.ts";
import { getAccountSeoCopy } from "./locale/account/seo.ts";
import { getAboutMetricsCopy } from "./locale/about/sections/metrics.ts";
import { getAboutPageIntroCopy } from "./locale/about/sections/page-intro.ts";
import { getAboutPrinciplesCopy } from "./locale/about/sections/principles.ts";
import { getAboutStoryStatementCopy } from "./locale/about/sections/story-statement.ts";
import { getAboutTeamCopy } from "./locale/about/sections/team.ts";
import { getAboutSeoCopy } from "./locale/about/seo.ts";
import { getBirthChartCastingStateCopy } from "./locale/birth-chart/sections/casting-state.ts";
import { getBirthChartFormWizardCopy } from "./locale/birth-chart/sections/form-wizard.ts";
import { getBirthChartSeoCopy } from "./locale/birth-chart/seo.ts";
import { getBlogArticleHeaderCopy } from "./locale/blog/sections/article-header.ts";
import { getBlogArticleBodyCopy } from "./locale/blog/sections/article-body.ts";
import { getBlogIndexFeaturedCopy } from "./locale/blog/sections/index-featured.ts";
import { getBlogCategoriesGridCopy } from "./locale/blog/sections/categories-grid.ts";
import { getBlogSeoCopy } from "./locale/blog/seo.ts";
import { getAstrologersBrowseCopy } from "./locale/astrologers/sections/browse.ts";
import { getAstrologerProfileCopy } from "./locale/astrologers/sections/profile.ts";
import { getAstrologerLiveSessionCopy } from "./locale/astrologers/sections/live-session.ts";
import { getAstrologerSessionSetupCopy } from "./locale/astrologers/sections/session-setup.ts";
import { getAstrologerSessionSummaryCopy } from "./locale/astrologers/sections/session-summary.ts";
import { getAstrologersSeoCopy } from "./locale/astrologers/seo.ts";
import { getDailyHoroscopeChooseSignCopy } from "./locale/daily-horoscope/sections/choose-sign.ts";
import { getDailyHoroscopePersonalizedCtaCopy } from "./locale/daily-horoscope/sections/personalized-cta.ts";
import { getDailyHoroscopeReadingDefaults } from "./locale/daily-horoscope/sections/reading.ts";
import { getDailyHoroscopeSeoCopy } from "./locale/daily-horoscope/seo.ts";
import { getFaqAccordionListCopy } from "./locale/faq/sections/accordion-list.ts";
import { getFaqContactCtaCopy } from "./locale/faq/sections/contact-cta.ts";
import { getFaqPageIntroCopy } from "./locale/faq/sections/page-intro.ts";
import { getFaqSeoCopy } from "./locale/faq/seo.ts";
import { getGlossaryAlphabetNavigatorCopy } from "./locale/glossary/sections/alphabet-navigator.ts";
import { getGlossaryDefinitionsCopy } from "./locale/glossary/sections/definitions.ts";
import { getGlossaryPageIntroCopy } from "./locale/glossary/sections/page-intro.ts";
import { getGlossarySeoCopy } from "./locale/glossary/seo.ts";
import { getHomeAstrologersCopy } from "./locale/home/sections/astrologers.ts";
import { getHomeBlogCopy } from "./locale/home/sections/blog.ts";
import { getHomeBirthChartCopy } from "./locale/home/sections/birth-chart.ts";
import { getHomeDailyHoroscopeCopy } from "./locale/home/sections/daily-horoscope.ts";
import { getHomeFinalCtaCopy } from "./locale/home/sections/final-cta.ts";
import { getHomeHeroCopy } from "./locale/home/sections/hero.ts";
import { getHomeMoonCalendarCopy } from "./locale/home/sections/moon-calendar.ts";
import { getHomeReportsCopy } from "./locale/home/sections/reports.ts";
import { getHomeShopCopy } from "./locale/home/sections/shop.ts";
import { getHomeSynastryCopy } from "./locale/home/sections/synastry.ts";
import { getHomeTodaySkyCopy } from "./locale/home/sections/todays-sky.ts";
import { getHomeTransitCopy } from "./locale/home/sections/transit.ts";
import { getHomeSeoCopy } from "./locale/home/seo.ts";
import { getMoonCalendarPageHeaderCopy } from "./locale/moon-calendar/sections/page-header.ts";
import { getMoonCalendarCalendarCopy } from "./locale/moon-calendar/sections/calendar-day-detail.ts";
import { getMoonCalendarLunarCycleStripCopy } from "./locale/moon-calendar/sections/lunar-cycle-strip.ts";
import { getMoonCalendarTonightCopy } from "./locale/moon-calendar/sections/tonights-moon.ts";
import { getMoonCalendarPersonalizedCtaCopy } from "./locale/moon-calendar/sections/personalized-cta.ts";
import { getMoonCalendarSeoCopy } from "./locale/moon-calendar/seo.ts";
import { getPrivacyDocumentAndContactCopy } from "./locale/privacy/sections/document-and-contact.ts";
import { getPrivacyLegalIntroCopy } from "./locale/privacy/sections/legal-intro.ts";
import { getPrivacySeoCopy } from "./locale/privacy/seo.ts";
import { getReportsCatalogGridCopy } from "./locale/reports/sections/catalog-grid.ts";
import { getReportsCatalogIntroCopy } from "./locale/reports/sections/catalog-intro.ts";
import { getReportsDetailNavigationCopy } from "./locale/reports/sections/detail-navigation.ts";
import { getReportsDetailPanelCopy } from "./locale/reports/sections/detail-panel.ts";
import { getReportsSeoCopy } from "./locale/reports/seo.ts";
import { getRetrogradesCurrentStatusCopy } from "./locale/retrogrades/sections/current-status.ts";
import { getRetrogradesFinalCtaCopy } from "./locale/retrogrades/sections/final-cta.ts";
import { getRetrogradesIntroCopy } from "./locale/retrogrades/sections/intro.ts";
import { getRetrogradesYearTimelineCopy } from "./locale/retrogrades/sections/year-timeline.ts";
import { getRetrogradesSeoCopy } from "./locale/retrogrades/seo.ts";
import { getSharedFooterCopy } from "./locale/shared/footer.ts";
import { getSharedHeaderCopy } from "./locale/shared/header.ts";
import { getShopCatalogIntroControlsCopy } from "./locale/shop/sections/catalog-intro-controls.ts";
import { getShopCheckoutFlowCopy } from "./locale/shop/sections/checkout-flow.ts";
import { getShopProductDetailCopy } from "./locale/shop/sections/product-detail.ts";
import { getShopProductGridCopy } from "./locale/shop/sections/product-grid.ts";
import { getShopSeoCopy } from "./locale/shop/seo.ts";
import { getSynastryOverlayingStateCopy } from "./locale/synastry/sections/overlaying-state.ts";
import { getSynastryRelationshipReportHandoffCopy } from "./locale/synastry/sections/relationship-report-handoff.ts";
import { getSynastryResultsCopy } from "./locale/synastry/sections/results.ts";
import { getSynastrySetupCopy } from "./locale/synastry/sections/two-profile-setup.ts";
import { getSynastrySeoCopy } from "./locale/synastry/seo.ts";
import { getTermsDocumentAndContactCopy } from "./locale/terms/sections/document-and-contact.ts";
import { getTermsLegalIntroCopy } from "./locale/terms/sections/legal-intro.ts";
import { getTermsSeoCopy } from "./locale/terms/seo.ts";
import { getTransitCastingStateCopy } from "./locale/transit/sections/casting-state.ts";
import { getTransitFormWizardCopy } from "./locale/transit/sections/form-wizard.ts";
import { getTransitResultsCopy } from "./locale/transit/sections/results.ts";
import { getTransitSeoCopy } from "./locale/transit/seo.ts";
import { getTodaysSkyPageHeaderCopy } from "./locale/todays-sky/sections/page-header.ts";
import { getTodaysSkyDateScrubberCopy } from "./locale/todays-sky/sections/date-scrubber.ts";
import { getTodaysSkyMoonAspectsFields } from "./locale/todays-sky/sections/moon-and-aspects.ts";
import { getTodaysSkyPersonalizedHandoffCopy } from "./locale/todays-sky/sections/personalized-handoff.ts";
import { getTodaysSkyWheelCopy } from "./locale/todays-sky/sections/wheel-reading-positions.ts";
import { getTodaysSkySeoCopy } from "./locale/todays-sky/seo.ts";
import { getWalletCopy } from "./locale/wallet.ts";

export type HomePageContent = Record<string, string>;

export const getWalletDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => ({
  ...getWalletCopy(locale),
  seo_canonical_path: "/wallet",
  seo_robots: "noindex,follow",
  og_title: getWalletCopy(locale).seo_title,
  og_description: getWalletCopy(locale).seo_description,
  og_image: "/_assets/aliases/logo/logo.svg",
  og_image_alt: "Sidera wallet",
  twitter_card: "summary",
  twitter_title: getWalletCopy(locale).seo_title,
  twitter_description: getWalletCopy(locale).seo_description,
  twitter_image: "/_assets/aliases/logo/logo.svg",
});

const homeSharedDefaults: HomePageContent = {
  title: "Sidera",
  feature_1_title: "Your birth chart",
  feature_1_body:
    "See the planetary pattern at the moment you were born and understand the story it tells.",
  feature_2_title: "Today's sky",
  feature_2_body:
    "Follow current transits and discover how the celestial weather may shape the day ahead.",
  feature_3_title: "Expert astrologers",
  feature_3_body:
    "Go deeper with a thoughtful astrologer who can help turn chart patterns into useful perspective.",
  footer_note:
    "Sidera offers modern astrological guidance for thoughtful decisions and meaningful change.",
  not_found_title: "Page not found",
  not_found_body: "The path you followed is not in the stars right now.",
  not_found_cta: "Go home",
  seo_canonical_path: "/",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

export const getAccountDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const shell = getAccountShellNavigationCopy(locale);
  const overview = getAccountOverviewCopy(locale);
  const people = getAccountPeopleCopy(locale);
  const orders = getAccountOrdersCopy(locale);
  const sessions = getAccountSessionsCopy(locale);
  const settings = getAccountSettingsCopy(locale);
  const wallet = getAccountWalletCopy(locale);
  const collections = getAccountCollectionsCopy(locale);
  const savedCharts = getAccountSavedChartsCopy(locale);
  const seo = getAccountSeoCopy(locale);

  return {
    account_navigation_label: shell.navigationLabel,
    account_nav_overview_label: shell.overviewLabel,
    account_nav_charts_label: shell.chartsLabel,
    account_nav_people_label: shell.peopleLabel,
    account_nav_orders_label: shell.ordersLabel,
    account_nav_sessions_label: shell.sessionsLabel,
    account_nav_wallet_label: wallet.navigationLabel,
    account_nav_settings_label: shell.settingsLabel,
    account_sign_out_label: shell.signOutLabel,
    account_overview_greeting_morning: overview.greetingMorning,
    account_overview_greeting_afternoon: overview.greetingAfternoon,
    account_overview_greeting_evening: overview.greetingEvening,
    account_overview_new_chart_label: overview.newChartLabel,
    ...Object.fromEntries(
      overview.stats.map((label, index) => [
        `account_overview_stat_${index + 1}_label`,
        label,
      ]),
    ),
    account_overview_sky_eyebrow: overview.skyEyebrow,
    account_overview_position_1_label: overview.sunLabel,
    account_overview_position_2_label: overview.moonLabel,
    account_overview_position_3_label: overview.mercuryLabel,
    account_overview_sky_insight: overview.skyInsight,
    account_overview_sky_action_label: overview.skyActionLabel,
    account_overview_sky_empty_title: overview.skyEmptyTitle,
    account_overview_sky_empty_description: overview.skyEmptyDescription,
    account_overview_sky_empty_action_label: overview.skyEmptyActionLabel,
    account_overview_session_eyebrow: overview.sessionEyebrow,
    account_overview_session_timing: overview.sessionTiming,
    account_overview_session_topic_prefix: overview.sessionTopicPrefix,
    account_overview_session_action_label: overview.sessionActionLabel,
    account_overview_session_empty_title: overview.sessionEmptyTitle,
    account_overview_session_empty_description:
      overview.sessionEmptyDescription,
    account_overview_session_empty_action_label:
      overview.sessionEmptyActionLabel,
    account_saved_charts_eyebrow: savedCharts.eyebrow,
    account_saved_charts_title: savedCharts.title,
    ...Object.fromEntries(
      savedCharts.chartTypes.map((label, index) => [
        `account_saved_charts_type_${index + 1}`,
        label,
      ]),
    ),
    account_saved_charts_open_label: savedCharts.openLabel,
    account_saved_charts_report_label: savedCharts.reportLabel,
    account_saved_charts_empty_title: savedCharts.emptyTitle,
    account_saved_charts_empty_description: savedCharts.emptyDescription,
    account_saved_charts_empty_action_label: savedCharts.emptyActionLabel,
    account_people_eyebrow: people.eyebrow,
    account_people_title: people.title,
    account_people_synastry_label: people.synastryLabel,
    account_people_own_profile_label: people.ownProfileLabel,
    account_people_generate_birth_chart_label: people.generateBirthChartLabel,
    account_people_empty_title: people.emptyTitle,
    account_people_empty_description: people.emptyDescription,
    account_people_empty_action_label: people.emptyActionLabel,
    account_orders_eyebrow: orders.eyebrow,
    account_orders_title: orders.title,
    account_orders_delivered_label: orders.deliveredLabel,
    account_orders_shipped_label: orders.shippedLabel,
    account_orders_empty_title: orders.emptyTitle,
    account_orders_empty_description: orders.emptyDescription,
    account_orders_empty_action_label: orders.emptyActionLabel,
    account_sessions_eyebrow: sessions.eyebrow,
    account_sessions_title: sessions.title,
    account_sessions_with_label: sessions.withLabel,
    account_sessions_minutes_label: sessions.minutesLabel,
    account_sessions_summary_label: sessions.summaryLabel,
    account_sessions_empty_title: sessions.emptyTitle,
    account_sessions_empty_description: sessions.emptyDescription,
    account_sessions_empty_action_label: sessions.emptyActionLabel,
    account_wallet_eyebrow: wallet.eyebrow,
    account_wallet_title: wallet.title,
    account_wallet_description: wallet.description,
    account_wallet_entries_label: wallet.entriesLabel,
    account_wallet_available_label: wallet.availableLabel,
    account_wallet_usage: wallet.usage,
    account_wallet_add_label: wallet.addLabel,
    account_wallet_browse_label: wallet.browseLabel,
    account_wallet_history_label: wallet.historyLabel,
    account_wallet_balance_after_label: wallet.balanceAfterLabel,
    account_wallet_credit_fallback: wallet.creditFallback,
    account_wallet_debit_fallback: wallet.debitFallback,
    account_wallet_empty_title: wallet.emptyTitle,
    account_wallet_empty_description: wallet.emptyDescription,
    account_settings_eyebrow: settings.eyebrow,
    account_settings_title: settings.title,
    account_settings_full_name_label: settings.fullNameLabel,
    account_settings_email_label: settings.emailLabel,
    account_settings_house_system_label: settings.houseSystemLabel,
    account_settings_placidus_label: settings.placidusLabel,
    account_settings_whole_sign_label: settings.wholeSignLabel,
    account_settings_zodiac_label: settings.zodiacLabel,
    account_settings_tropical_label: settings.tropicalLabel,
    account_settings_sidereal_label: settings.siderealLabel,
    account_settings_horoscope_label: settings.horoscopeLabel,
    account_settings_horoscope_description: settings.horoscopeDescription,
    account_settings_save_label: settings.saveLabel,
    account_settings_saved_message: settings.savedMessage,
    account_collection_view_all_label: collections.viewAllLabel,
    account_collection_back_label: collections.backLabel,
    account_collection_pagination_label: collections.paginationLabel,
    account_collection_previous_label: collections.previousLabel,
    account_collection_next_label: collections.nextLabel,
    account_collection_page_label: collections.pageLabel,
    account_collection_items_label: collections.itemsLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/account",
    seo_robots: "noindex,nofollow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getLoginDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const shell = getAuthShellCopy(locale);
  const form = getAuthLoginFormCopy(locale);
  const seo = getAuthSeoCopy(locale);

  return {
    login_brand_label: shell.brandLabel,
    login_brand_aria_label: shell.brandAriaLabel,
    login_back_label: shell.backLabel,
    login_panel_kicker: shell.kicker,
    login_panel_title: shell.title,
    login_panel_description: shell.description,
    login_proof_1_label: shell.perks[0]?.label ?? "",
    login_proof_2_label: shell.perks[1]?.label ?? "",
    login_form_heading: form.heading,
    login_form_subheading: form.subheading,
    login_email_label: form.emailLabel,
    login_email_placeholder: form.emailPlaceholder,
    login_password_label: form.passwordLabel,
    login_password_placeholder: form.passwordPlaceholder,
    login_submit_label: form.submitLabel,
    login_forgot_password_label: form.forgotPasswordLabel,
    login_terms_prefix: form.termsPrefix,
    login_terms_label: form.termsLabel,
    login_terms_glue: form.termsGlue,
    login_privacy_label: form.privacyLabel,
    login_terms_suffix: form.termsSuffix,
    login_signup_prompt: form.signupPrompt,
    login_signup_label: form.signupLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/login",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getSignupDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const commonShell = getAuthShellCopy(locale);
  const signupShell = getAuthSignupShellCopy(locale);
  const form = getAuthSignupFormCopy(locale);
  const seo = getAuthSignupSeoCopy(locale);

  return {
    signup_brand_label: commonShell.brandLabel,
    signup_brand_aria_label: commonShell.brandAriaLabel,
    signup_back_label: commonShell.backLabel,
    signup_panel_kicker: signupShell.kicker,
    signup_panel_title: signupShell.title,
    signup_panel_description: signupShell.description,
    signup_proof_1_label: commonShell.perks[0]?.label ?? "",
    signup_proof_2_label: commonShell.perks[1]?.label ?? "",
    signup_form_heading: form.heading,
    signup_form_subheading: form.subheading,
    signup_full_name_label: form.fullNameLabel,
    signup_full_name_placeholder: form.fullNamePlaceholder,
    signup_email_label: form.emailLabel,
    signup_email_placeholder: form.emailPlaceholder,
    signup_phone_label: form.phoneLabel,
    signup_phone_placeholder: form.phonePlaceholder,
    signup_password_label: form.passwordLabel,
    signup_password_placeholder: form.passwordPlaceholder,
    signup_confirm_password_label: form.confirmPasswordLabel,
    signup_confirm_password_placeholder: form.confirmPasswordPlaceholder,
    signup_password_hint: form.passwordHint,
    signup_create_account_label: form.createAccountLabel,
    signup_creating_label: form.creatingLabel,
    signup_unavailable_label: form.unavailableLabel,
    signup_mismatch_label: form.mismatchLabel,
    signup_missing_password_label: form.missingPasswordLabel,
    signup_terms_required_label: form.termsRequiredLabel,
    signup_invalid_email_label: form.invalidEmailLabel,
    signup_invalid_phone_label: form.invalidPhoneLabel,
    signup_terms_prefix: form.termsPrefix,
    signup_terms_label: form.termsLabel,
    signup_terms_glue: form.termsGlue,
    signup_privacy_label: form.privacyLabel,
    signup_terms_suffix: form.termsSuffix,
    signup_login_prompt: form.loginPrompt,
    signup_login_label: form.loginLabel,
    signup_marketing_opt_in_label: form.marketingOptInLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/signup",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getForgotPasswordDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const shell = getAuthShellCopy(locale);
  const forgotPasswordShell = getForgotPasswordShellCopy(locale);
  const form = getAuthForgotPasswordFormCopy(locale);
  const seo = getForgotPasswordSeoCopy(locale);

  return {
    forgot_password_brand_label: shell.brandLabel,
    forgot_password_brand_aria_label: shell.brandAriaLabel,
    forgot_password_back_label: shell.backLabel,
    forgot_password_panel_kicker: forgotPasswordShell.kicker,
    forgot_password_panel_title: forgotPasswordShell.title,
    forgot_password_panel_description: forgotPasswordShell.description,
    forgot_password_proof_1_label: shell.perks[0]?.label ?? "",
    forgot_password_proof_2_label: shell.perks[1]?.label ?? "",
    forgot_password_form_heading: form.heading,
    forgot_password_form_subheading: form.subheading,
    forgot_password_email_label: form.emailLabel,
    forgot_password_email_placeholder: form.emailPlaceholder,
    forgot_password_submit_label: form.submitLabel,
    forgot_password_loading_label: form.loadingLabel,
    forgot_password_success_label: form.successLabel,
    forgot_password_resent_success_label: form.resentSuccessLabel,
    forgot_password_invalid_email_label: form.invalidEmailLabel,
    forgot_password_resend_prompt: form.resendPrompt,
    forgot_password_resend_label: form.resendLabel,
    forgot_password_resend_countdown_label: form.resendCountdownLabel,
    forgot_password_resend_ready_label: form.resendReadyLabel,
    forgot_password_login_prompt: form.loginPrompt,
    forgot_password_login_label: form.loginLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/forgot-password",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getResetPasswordDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const shell = getAuthShellCopy(locale);
  const resetPasswordShell = getResetPasswordShellCopy(locale);
  const form = getAuthResetPasswordFormCopy(locale);
  const seo = getResetPasswordSeoCopy(locale);

  return {
    reset_password_brand_label: shell.brandLabel,
    reset_password_brand_aria_label: shell.brandAriaLabel,
    reset_password_back_label: shell.backLabel,
    reset_password_panel_kicker: resetPasswordShell.kicker,
    reset_password_panel_title: resetPasswordShell.title,
    reset_password_panel_description: resetPasswordShell.description,
    reset_password_proof_1_label: shell.perks[0]?.label ?? "",
    reset_password_proof_2_label: shell.perks[1]?.label ?? "",
    reset_password_form_heading: form.heading,
    reset_password_form_subheading: form.subheading,
    reset_password_password_label: form.passwordLabel,
    reset_password_password_placeholder: form.passwordPlaceholder,
    reset_password_confirm_label: form.confirmPasswordLabel,
    reset_password_confirm_placeholder: form.confirmPasswordPlaceholder,
    reset_password_password_hint: form.passwordHint,
    reset_password_submit_label: form.submitLabel,
    reset_password_loading_label: form.loadingLabel,
    reset_password_success_label: form.successLabel,
    reset_password_mismatch_label: form.mismatchLabel,
    reset_password_invalid_password_label: form.invalidPasswordLabel,
    reset_password_login_prompt: form.loginPrompt,
    reset_password_login_label: form.loginLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/reset-password",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

const chromeSharedDefaults: HomePageContent = {
  title: "Site Chrome",
  nav_home: "Home",
  footer_brand_name: "Sidera",
};

const termsSharedDefaults: HomePageContent = {
  seo_canonical_path: "/terms",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

const privacySharedDefaults: HomePageContent = {
  seo_canonical_path: "/privacy",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

const retrogradesSharedDefaults: HomePageContent = {
  seo_canonical_path: "/retrogrades",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

const reportsSharedDefaults: HomePageContent = {
  seo_canonical_path: "/reports",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

const astrologersSharedDefaults: HomePageContent = {
  seo_canonical_path: "/astrologers",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

const birthChartSharedDefaults: HomePageContent = {
  seo_canonical_path: "/birth-chart",
  seo_robots: "index,follow",
  og_image: "/_assets/aliases/logo/logo.svg",
  twitter_card: "summary_large_image",
  twitter_image: "/_assets/aliases/logo/logo.svg",
};

export const getHomeDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const astrologers = getHomeAstrologersCopy(locale);
  const blog = getHomeBlogCopy(locale);
  const birthChart = getHomeBirthChartCopy(locale);
  const dailyHoroscope = getHomeDailyHoroscopeCopy(locale);
  const finalCta = getHomeFinalCtaCopy(locale);
  const hero = getHomeHeroCopy(locale);
  const moonCalendar = getHomeMoonCalendarCopy(locale);
  const reports = getHomeReportsCopy(locale);
  const shop = getHomeShopCopy(locale);
  const synastry = getHomeSynastryCopy(locale);
  const todaySky = getHomeTodaySkyCopy(locale);
  const transit = getHomeTransitCopy(locale);
  const seo = getHomeSeoCopy(locale);

  return {
    ...homeSharedDefaults,
    hero_kicker: hero.kicker,
    hero_title: hero.title,
    hero_body: hero.body,
    hero_primary_cta: hero.primaryCta,
    hero_secondary_cta: hero.secondaryCta,
    hero_proof_1: hero.proofCharts,
    hero_proof_2: hero.proofEphemeris,
    hero_proof_3: hero.proofBeginner,
    hero_chart_title: hero.chartTitle,
    hero_chart_description: hero.chartDescription,
    today_sky_eyebrow: todaySky.eyebrow,
    today_sky_title_accent: todaySky.titleAccent,
    today_sky_title_rest: todaySky.titleRest,
    today_sky_metadata: todaySky.metadata,
    today_sky_cta: todaySky.ctaLabel,
    home_birth_chart_eyebrow: birthChart.eyebrow,
    home_birth_chart_title_accent: birthChart.titleAccent,
    home_birth_chart_title_rest: birthChart.titleRest,
    home_birth_chart_description: birthChart.description,
    home_birth_chart_form_title: birthChart.formTitle,
    home_birth_chart_date_label: birthChart.dateLabel,
    home_birth_chart_time_label: birthChart.timeLabel,
    home_birth_chart_unknown_time_label: birthChart.unknownTimeLabel,
    home_birth_chart_location_label: birthChart.locationLabel,
    home_birth_chart_location_placeholder: birthChart.locationPlaceholder,
    home_birth_chart_location_start: birthChart.locationStart,
    home_birth_chart_location_searching: birthChart.locationSearching,
    home_birth_chart_location_empty: birthChart.locationEmpty,
    home_birth_chart_location_unavailable: birthChart.locationUnavailable,
    home_birth_chart_location_selected: birthChart.locationSelected,
    home_birth_chart_extended_settings_label: birthChart.extendedSettingsLabel,
    home_birth_chart_house_system_label: birthChart.houseSystemLabel,
    home_birth_chart_house_placidus: birthChart.housePlacidus,
    home_birth_chart_house_whole_sign: birthChart.houseWholeSign,
    home_birth_chart_house_koch: birthChart.houseKoch,
    home_birth_chart_house_equal: birthChart.houseEqual,
    home_birth_chart_show_aspects_label: birthChart.showAspectsLabel,
    home_birth_chart_cta: birthChart.ctaLabel,
    home_birth_chart_wheel_title: birthChart.wheelTitle,
    home_birth_chart_wheel_description: birthChart.wheelDescription,
    ...Object.fromEntries(
      birthChart.features.flatMap((feature, index) => {
        const featureNumber = index + 1;
        return [
          [`home_birth_chart_feature_${featureNumber}_title`, feature.title],
          [`home_birth_chart_feature_${featureNumber}_body`, feature.body],
        ];
      }),
    ),
    home_transit_eyebrow: transit.eyebrow,
    home_transit_title_accent: transit.titleAccent,
    home_transit_title_rest: transit.titleRest,
    home_transit_description: transit.description,
    home_transit_cta: transit.ctaLabel,
    ...Object.fromEntries(
      transit.items.flatMap((item, index) => {
        const itemNumber = index + 1;
        return [
          [`home_transit_item_${itemNumber}_date`, item.date],
          [`home_transit_item_${itemNumber}_aspect`, item.aspect],
          [`home_transit_item_${itemNumber}_note`, item.note],
        ];
      }),
    ),
    home_synastry_eyebrow: synastry.eyebrow,
    home_synastry_title_accent: synastry.titleAccent,
    home_synastry_title_rest: synastry.titleRest,
    home_synastry_description: synastry.description,
    home_synastry_primary_cta: synastry.primaryCta,
    home_synastry_secondary_cta: synastry.secondaryCta,
    home_synastry_person_a_name: synastry.personAName,
    home_synastry_person_a_detail: synastry.personADetail,
    home_synastry_person_b_name: synastry.personBName,
    home_synastry_person_b_detail: synastry.personBDetail,
    home_synastry_resonance: synastry.resonance,
    home_moon_calendar_eyebrow: moonCalendar.eyebrow,
    home_moon_calendar_title_accent: moonCalendar.titleAccent,
    home_moon_calendar_title_rest: moonCalendar.titleRest,
    home_moon_calendar_current_phase_name: moonCalendar.currentPhaseName,
    home_moon_calendar_current_phase_meta: moonCalendar.currentPhaseMeta,
    home_moon_calendar_current_phase_description:
      moonCalendar.currentPhaseDescription,
    home_moon_calendar_cta: moonCalendar.ctaLabel,
    ...Object.fromEntries(
      moonCalendar.phases.flatMap((phase, index) => {
        const phaseNumber = index + 1;
        return [
          [`home_moon_calendar_phase_${phaseNumber}_name`, phase.name],
          [`home_moon_calendar_phase_${phaseNumber}_date`, phase.date],
        ];
      }),
    ),
    home_moon_calendar_next_full_label: moonCalendar.nextFullLabel,
    home_moon_calendar_next_full_value: moonCalendar.nextFullValue,
    home_moon_calendar_next_new_label: moonCalendar.nextNewLabel,
    home_moon_calendar_next_new_value: moonCalendar.nextNewValue,
    home_horoscope_eyebrow: dailyHoroscope.eyebrow,
    home_horoscope_title_accent: dailyHoroscope.titleAccent,
    home_horoscope_title_rest: dailyHoroscope.titleRest,
    home_horoscope_prompt: dailyHoroscope.prompt,
    ...Object.fromEntries(
      dailyHoroscope.signs.flatMap((sign, index) => {
        const signNumber = index + 1;
        return [
          [`home_horoscope_sign_${signNumber}_name`, sign.name],
          [`home_horoscope_sign_${signNumber}_dates`, sign.dates],
          [`home_horoscope_sign_${signNumber}_element`, sign.element],
          [`home_horoscope_sign_${signNumber}_reading`, sign.reading],
          [`home_horoscope_sign_${signNumber}_cta`, sign.cta],
        ];
      }),
    ),
    home_astrologers_eyebrow: astrologers.eyebrow,
    home_astrologers_title_accent: astrologers.titleAccent,
    home_astrologers_title_rest: astrologers.titleRest,
    home_astrologers_browse_label: astrologers.browseLabel,
    ...Object.fromEntries(
      astrologers.profiles.flatMap((profile, index) => {
        const profileNumber = index + 1;
        return [
          [`home_astrologers_profile_${profileNumber}_name`, profile.name],
          [
            `home_astrologers_profile_${profileNumber}_tradition`,
            profile.tradition,
          ],
          [
            `home_astrologers_profile_${profileNumber}_availability_label`,
            profile.availabilityLabel,
          ],
          [
            `home_astrologers_profile_${profileNumber}_rating`,
            profile.ratingText,
          ],
          [`home_astrologers_profile_${profileNumber}_rate`, profile.rateText],
          [
            `home_astrologers_profile_${profileNumber}_rate_unit`,
            profile.rateUnit,
          ],
          [
            `home_astrologers_profile_${profileNumber}_action`,
            profile.actionLabel,
          ],
        ];
      }),
    ),
    home_reports_eyebrow: reports.eyebrow,
    home_reports_title_accent: reports.titleAccent,
    home_reports_title_rest: reports.titleRest,
    home_reports_browse_label: reports.browseLabel,
    ...Object.fromEntries(
      reports.reports.flatMap((report, index) => {
        const reportNumber = index + 1;
        return [
          [`home_reports_report_${reportNumber}_title`, report.title],
          [
            `home_reports_report_${reportNumber}_description`,
            report.description,
          ],
          [`home_reports_report_${reportNumber}_pages`, report.pagesLabel],
          [`home_reports_report_${reportNumber}_price`, report.price],
          [`home_reports_report_${reportNumber}_action`, report.actionLabel],
        ];
      }),
    ),
    home_shop_eyebrow: shop.eyebrow,
    home_shop_title_lead: shop.titleLead,
    home_shop_title_accent: shop.titleAccent,
    home_shop_title_rest: shop.titleRest,
    home_shop_browse_label: shop.browseLabel,
    ...Object.fromEntries(
      shop.items.flatMap((item, index) => {
        const itemNumber = index + 1;
        return [
          [`home_shop_item_${itemNumber}_title`, item.title],
          [`home_shop_item_${itemNumber}_category`, item.category],
          [`home_shop_item_${itemNumber}_price`, item.price],
          [`home_shop_item_${itemNumber}_image_alt`, item.imageAlt],
        ];
      }),
    ),
    home_blog_title_accent: blog.titleAccent,
    home_blog_title_rest: blog.titleRest,
    home_blog_tagline: blog.tagline,
    home_blog_browse_label: blog.browseLabel,
    ...Object.fromEntries(
      blog.posts.flatMap((post, index) => {
        const postNumber = index + 1;
        return [
          [`home_blog_post_${postNumber}_category`, post.category],
          [`home_blog_post_${postNumber}_title`, post.title],
          [`home_blog_post_${postNumber}_excerpt`, post.excerpt],
          [`home_blog_post_${postNumber}_image_alt`, post.imageAlt],
        ];
      }),
    ),
    home_final_cta_title_accent: finalCta.titleAccent,
    home_final_cta_title_rest: finalCta.titleRest,
    home_final_cta_action_label: finalCta.actionLabel,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getChromeDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const header = getSharedHeaderCopy(locale);
  const footer = getSharedFooterCopy(locale);

  return {
    ...chromeSharedDefaults,
    brand_name: header.brandLabel,
    brand_aria_label: header.brandAriaLabel,
    primary_navigation_label: header.navigationLabel,
    nav_todays_sky: header.todaysSkyLabel,
    nav_charts: header.chartsLabel,
    nav_compatibility: header.compatibilityLabel,
    nav_moon: header.moonLabel,
    nav_horoscope: header.horoscopeLabel,
    nav_astrologers: header.astrologersLabel,
    nav_more: header.moreLabel,
    nav_blog: header.blogLabel,
    nav_shop: header.shopLabel,
    header_wallet_label: header.walletLabel,
    action_sign_in: header.signInLabel,
    action_get_chart: header.getChartLabel,
    language_trigger_label: header.languageTriggerLabel,
    language_menu_label: header.languageMenuLabel,
    ...Object.fromEntries(
      activeLocales.map((language) => [
        `language_option_${language.code}_label`,
        language.nativeName,
      ]),
    ),
    menu_open_label: header.openMenuLabel,
    menu_close_label: header.closeMenuLabel,
    footer_brand_name: footer.brandLabel,
    footer_about: footer.description,
    footer_navigation_label: footer.navigationLabel,
    footer_legal_navigation_label: footer.legalNavigationLabel,
    footer_group_charts: footer.chartsLabel,
    footer_link_birth_chart: footer.birthChartLabel,
    footer_link_transit: footer.transitLabel,
    footer_link_synastry: footer.synastryLabel,
    footer_group_tools: footer.toolsLabel,
    footer_link_todays_sky: footer.todaysSkyLabel,
    footer_link_moon_calendar: footer.moonCalendarLabel,
    footer_link_retrogrades: footer.retrogradesLabel,
    footer_link_reports: footer.reportsLabel,
    footer_group_learn: footer.learnLabel,
    footer_link_blog: footer.blogLabel,
    footer_link_daily_horoscope: footer.horoscopeLabel,
    footer_link_glossary: footer.glossaryLabel,
    footer_link_faq: footer.faqLabel,
    footer_group_company: footer.companyLabel,
    footer_link_about: footer.aboutLabel,
    footer_link_account: footer.accountLabel,
    footer_link_shop: footer.shopLabel,
    footer_copyright: footer.copyrightText,
    footer_link_privacy: footer.privacyLabel,
    footer_link_terms: footer.termsLabel,
  };
};

export const getFaqDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const intro = getFaqPageIntroCopy(locale);
  const accordionItems = getFaqAccordionListCopy(locale);
  const contactCta = getFaqContactCtaCopy(locale);
  const seo = getFaqSeoCopy(locale);

  return {
    faq_intro_eyebrow: intro.eyebrow,
    faq_intro_title_lead: intro.titleLead,
    faq_intro_title_emphasis: intro.titleEmphasis,
    faq_intro_description: intro.description,
    faq_contact_title: contactCta.title,
    faq_contact_description: contactCta.description,
    faq_contact_action: contactCta.actionLabel,
    ...Object.fromEntries(
      accordionItems.flatMap((item, index) => {
        const itemNumber = index + 1;
        return [
          [`faq_item_${itemNumber}_category`, item.category],
          [`faq_item_${itemNumber}_question`, item.question],
          [`faq_item_${itemNumber}_answer`, item.answer],
        ];
      }),
    ),
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    seo_canonical_path: "/faq",
    seo_robots: "index,follow",
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.ogImageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getGlossaryDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const alphabetNavigator = getGlossaryAlphabetNavigatorCopy(locale);
  const definitions = getGlossaryDefinitionsCopy(locale);
  const intro = getGlossaryPageIntroCopy(locale);
  const seo = getGlossarySeoCopy(locale);
  const definitionFields = Object.fromEntries(
    Object.entries(definitions).flatMap(([key, term]) => [
      [`glossary_term_${key}_name`, term.name],
      [`glossary_term_${key}_definition`, term.definition],
    ]),
  );

  return {
    glossary_intro_eyebrow: intro.eyebrow,
    glossary_intro_title_lead: intro.titleLead,
    glossary_intro_title_emphasis: intro.titleEmphasis,
    glossary_intro_description: intro.description,
    glossary_alphabet_navigation_label: alphabetNavigator.navigationLabel,
    glossary_search_label: alphabetNavigator.searchLabel,
    glossary_search_placeholder: alphabetNavigator.searchPlaceholder,
    glossary_search_clear_label: alphabetNavigator.clearSearchLabel,
    glossary_search_results_label: alphabetNavigator.resultsLabel,
    glossary_search_empty_title: alphabetNavigator.emptyTitle,
    ...definitionFields,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/glossary",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getBlogDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const index = getBlogIndexFeaturedCopy(locale);
  const categoriesGrid = getBlogCategoriesGridCopy(locale);
  const seo = getBlogSeoCopy(locale);

  return {
    blog_intro_eyebrow: index.eyebrow,
    blog_intro_title_accent: index.titleAccent,
    blog_intro_title_rest: index.titleRest,
    blog_featured_eyebrow: index.featuredEyebrow,
    blog_featured_title: index.featuredTitle,
    blog_featured_excerpt: index.featuredExcerpt,
    blog_featured_author: index.featuredAuthor,
    blog_featured_read_time: index.featuredReadTime,
    ...categoriesGrid,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/blog",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getBlogArticleHeaderDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => getBlogArticleHeaderCopy(locale);

export const getBlogArticleBodyDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => getBlogArticleBodyCopy(locale);

export const getAboutDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const intro = getAboutPageIntroCopy(locale);
  const metrics = getAboutMetricsCopy(locale);
  const principles = getAboutPrinciplesCopy(locale);
  const story = getAboutStoryStatementCopy(locale);
  const team = getAboutTeamCopy(locale);
  const seo = getAboutSeoCopy(locale);

  return {
    about_intro_eyebrow: intro.eyebrow,
    about_intro_title_lead: intro.titleLead,
    about_intro_title_emphasis: intro.titleEmphasis,
    about_intro_description: intro.description,
    about_story_statement: story.statement,
    about_metrics_aria_label: metrics.ariaLabel,
    about_team_title_accent: team.titleAccent,
    about_team_title_rest: team.titleRest,
    about_team_aria_label: team.ariaLabel,
    ...Object.fromEntries(
      team.members.flatMap((member, index) => {
        const itemNumber = index + 1;
        return [
          [`about_team_member_${itemNumber}_name`, member.name],
          [`about_team_member_${itemNumber}_role`, member.role],
        ];
      }),
    ),
    ...Object.fromEntries(
      metrics.metrics.flatMap((metric, index) => {
        const itemNumber = index + 1;
        return [
          [`about_metric_${itemNumber}_value`, metric.value],
          [`about_metric_${itemNumber}_label`, metric.label],
        ];
      }),
    ),
    ...Object.fromEntries(
      principles.flatMap((principle, index) => {
        const itemNumber = index + 1;
        return [
          [`about_principle_${itemNumber}_title`, principle.title],
          [`about_principle_${itemNumber}_body`, principle.body],
        ];
      }),
    ),
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/about",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getTermsDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const intro = getTermsLegalIntroCopy(locale);
  const document = getTermsDocumentAndContactCopy(locale);
  const seo = getTermsSeoCopy(locale);

  return {
    ...termsSharedDefaults,
    terms_legal_eyebrow: intro.eyebrow,
    terms_title: intro.title,
    terms_updated_label: intro.updatedLabel,
    ...Object.fromEntries(
      document.sections.flatMap((section, index) => {
        const itemNumber = index + 1;
        return [
          [`terms_section_${itemNumber}_title`, section.title],
          [`terms_section_${itemNumber}_body`, section.body],
        ];
      }),
    ),
    terms_contact_text: document.contactText,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getPrivacyDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const intro = getPrivacyLegalIntroCopy(locale);
  const document = getPrivacyDocumentAndContactCopy(locale);
  const seo = getPrivacySeoCopy(locale);

  return {
    ...privacySharedDefaults,
    privacy_legal_eyebrow: intro.eyebrow,
    privacy_title: intro.title,
    privacy_updated_label: intro.updatedLabel,
    ...Object.fromEntries(
      document.sections.flatMap((section, index) => {
        const itemNumber = index + 1;
        return [
          [`privacy_section_${itemNumber}_title`, section.title],
          [`privacy_section_${itemNumber}_body`, section.body],
        ];
      }),
    ),
    privacy_contact_text: document.contactText,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getTodaysSkyDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const header = getTodaysSkyPageHeaderCopy(locale);
  const dateScrubber = getTodaysSkyDateScrubberCopy(locale);
  const handoff = getTodaysSkyPersonalizedHandoffCopy(locale);
  const wheel = getTodaysSkyWheelCopy(locale);
  const seo = getTodaysSkySeoCopy(locale);

  return {
    page_header_eyebrow: header.eyebrow,
    page_header_title_accent: header.titleAccent,
    page_header_title_suffix: header.titleSuffix,
    page_header_meta_primary: header.metaPrimary,
    page_header_meta_secondary: header.metaSecondary,
    header_action_transits: header.transitsAction,
    date_scrubber_eyebrow: dateScrubber.eyebrow,
    date_scrubber_today_action: dateScrubber.todayAction,
    date_scrubber_today_marker: dateScrubber.todayMarker,
    date_scrubber_moving_now_label: dateScrubber.movingNowLabel,
    sky_wheel_caption: wheel.wheelCaption,
    sky_positions_title: wheel.positionsTitle,
    sky_positions_count: wheel.positionsCount,
    ...getTodaysSkyMoonAspectsFields(locale),
    ...handoff,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    seo_canonical_path: "/todays-sky",
    seo_robots: "index,follow",
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.ogImageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getMoonCalendarDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const header = getMoonCalendarPageHeaderCopy(locale);
  const tonight = getMoonCalendarTonightCopy(locale);
  const calendar = getMoonCalendarCalendarCopy(locale);
  const cycle = getMoonCalendarLunarCycleStripCopy(locale);
  const personalizedCta = getMoonCalendarPersonalizedCtaCopy(locale);
  const seo = getMoonCalendarSeoCopy(locale);

  return {
    page_header_eyebrow: header.eyebrow,
    page_header_title_accent: header.titleAccent,
    page_header_title_suffix: header.titleSuffix,
    page_header_meta_primary: header.metaPrimary,
    page_header_meta_secondary: header.metaSecondary,
    tonight_eyebrow: tonight.eyebrow,
    tonight_phase_name: tonight.phaseName,
    tonight_phase_detail: tonight.phaseDetail,
    tonight_meaning: tonight.meaning,
    tonight_next_full_label: tonight.nextFullLabel,
    tonight_next_full_date: tonight.nextFullDate,
    tonight_next_full_countdown: tonight.nextFullCountdown,
    tonight_next_new_label: tonight.nextNewLabel,
    tonight_next_new_date: tonight.nextNewDate,
    tonight_next_new_countdown: tonight.nextNewCountdown,
    ...calendar.editable,
    cycle_title: cycle.title,
    cycle_description: cycle.description,
    ...Object.fromEntries(
      cycle.phases.map((item) => [
        `cycle_phase_${item.phase.replaceAll("-", "_")}`,
        item.name,
      ]),
    ),
    personalized_cta_eyebrow: personalizedCta.eyebrow,
    personalized_cta_title_prefix: personalizedCta.titlePrefix,
    personalized_cta_title_accent: personalizedCta.titleAccent,
    personalized_cta_title_suffix: personalizedCta.titleSuffix,
    personalized_cta_description: personalizedCta.description,
    personalized_cta_primary_label: personalizedCta.primaryLabel,
    personalized_cta_secondary_label: personalizedCta.secondaryLabel,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    seo_canonical_path: "/moon-calendar",
    seo_robots: "index,follow",
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.ogImageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getRetrogradesDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const currentStatus = getRetrogradesCurrentStatusCopy(locale);
  const finalCta = getRetrogradesFinalCtaCopy(locale);
  const intro = getRetrogradesIntroCopy(locale);
  const timeline = getRetrogradesYearTimelineCopy(locale);
  const seo = getRetrogradesSeoCopy(locale);

  return {
    ...retrogradesSharedDefaults,
    intro_eyebrow: intro.eyebrow,
    intro_title_lead: intro.titleLead,
    intro_title_accent: intro.titleAccent,
    intro_title_suffix: intro.titleSuffix,
    intro_description: intro.description,
    status_section_label: currentStatus.sectionLabel,
    status_badge_label: currentStatus.retrogradeNowLabel,
    status_shadow_to_label: currentStatus.shadowToLabel,
    status_shadow_from_label: currentStatus.shadowFromLabel,
    status_mercury_title: currentStatus.mercuryTitle,
    status_mercury_description: currentStatus.mercuryDescription,
    status_venus_title: currentStatus.venusTitle,
    status_venus_description: currentStatus.venusDescription,
    status_mars_title: currentStatus.marsTitle,
    status_mars_description: currentStatus.marsDescription,
    status_jupiter_title: currentStatus.jupiterTitle,
    status_jupiter_description: currentStatus.jupiterDescription,
    status_saturn_title: currentStatus.saturnTitle,
    status_saturn_description: currentStatus.saturnDescription,
    status_uranus_title: currentStatus.uranusTitle,
    status_uranus_description: currentStatus.uranusDescription,
    status_neptune_title: currentStatus.neptuneTitle,
    status_neptune_description: currentStatus.neptuneDescription,
    status_pluto_title: currentStatus.plutoTitle,
    status_pluto_description: currentStatus.plutoDescription,
    timeline_heading_prefix: timeline.headingPrefix,
    timeline_tip_1_title: timeline.tipOneTitle,
    timeline_tip_1_description: timeline.tipOneDescription,
    timeline_tip_2_title: timeline.tipTwoTitle,
    timeline_tip_2_description: timeline.tipTwoDescription,
    timeline_tip_3_title: timeline.tipThreeTitle,
    timeline_tip_3_description: timeline.tipThreeDescription,
    final_cta_title_accent: finalCta.titleAccent,
    final_cta_title_rest: finalCta.titleRest,
    final_cta_action_label: finalCta.actionLabel,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getShopDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const catalog = getShopCatalogIntroControlsCopy(locale);
  const seo = getShopSeoCopy(locale);

  return {
    catalog_eyebrow: catalog.eyebrow,
    catalog_title_lead: catalog.titleLead,
    catalog_title_accent: catalog.titleAccent,
    catalog_title_rest: catalog.titleRest,
    catalog_description: catalog.description,
    catalog_filter_label: catalog.filterLabel,
    catalog_category_all: catalog.categoryAll,
    catalog_category_prints: catalog.categoryPrints,
    catalog_category_books: catalog.categoryBooks,
    catalog_category_home: catalog.categoryHome,
    catalog_category_jewelry: catalog.categoryJewelry,
    catalog_pieces_suffix: catalog.piecesSuffix,
    catalog_nav_shop_label: catalog.navShopLabel,
    catalog_cart_label: catalog.cartLabel,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/shop",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.imageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getShopCatalogDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const grid = getShopProductGridCopy(locale);

  return {
    shop_catalog_aria_label: grid.ariaLabel,
    shop_personalized_label: grid.personalizedLabel,
    shop_view_label: grid.viewLabel,
    shop_add_label: grid.addLabel,
    ...Object.fromEntries(
      Object.entries(grid.products).flatMap(([id, product]) => {
        const key = id.replaceAll("-", "_");
        return [
          [`shop_product_${key}_title`, product.title],
          [`shop_product_${key}_unit`, product.unit],
          [`shop_product_${key}_fallback_label`, product.fallbackLabel],
        ];
      }),
    ),
    ...Object.fromEntries(
      grid.perks.flatMap((perk, index) => [
        [`shop_perk_${index + 1}_title`, perk.title],
        [`shop_perk_${index + 1}_description`, perk.description],
      ]),
    ),
  };
};

export const getShopProductDetailDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const detail = getShopProductDetailCopy(locale);

  return {
    shop_detail_breadcrumb_label: detail.breadcrumbLabel,
    shop_detail_reviews_label: detail.reviewsLabel,
    shop_detail_personalized_eyebrow: detail.personalizedEyebrow,
    shop_detail_personalized_chart_label: detail.personalizedChartLabel,
    shop_detail_add_label: detail.addLabel,
    shop_detail_shipping_status_label: detail.shippingStatusLabel,
    shop_detail_in_box_label: detail.inBoxLabel,
    shop_detail_related_label: detail.relatedLabel,
    shop_detail_quantity_label: detail.quantityLabel,
    shop_detail_quantity_value_label: detail.quantityValueLabel,
    shop_detail_decrement_label: detail.decrementLabel,
    shop_detail_increment_label: detail.incrementLabel,
    ...Object.fromEntries(
      Object.entries(detail.products).flatMap(([id, product]) => {
        if (!product.variantLabel || !product.variantOptions) return [];
        const key = id.replaceAll("-", "_");
        return [
          [`shop_detail_${key}_variant_label`, product.variantLabel],
          ...product.variantOptions.map((option, index) => [
            `shop_detail_${key}_variant_option_${index + 1}`,
            option,
          ]),
        ];
      }),
    ),
  };
};

export const getShopProductDescriptionDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const detail = getShopProductDetailCopy(locale);

  return Object.fromEntries(
    Object.entries(detail.products).flatMap(([id, product]) => {
      const key = id.replaceAll("-", "_");
      return [
        [`shop_detail_${key}_description`, product.description],
        [`shop_detail_${key}_ship_note`, product.shipNote],
        ...product.includes.map((item, index) => [
          `shop_detail_${key}_include_${index + 1}`,
          item,
        ]),
      ];
    }),
  );
};

export const getShopCheckoutFlowDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const flow = getShopCheckoutFlowCopy(locale);
  return {
    shop_cart_continue_label: flow.cartContinueLabel,
    shop_cart_title: flow.cartTitle,
    shop_cart_empty_title: flow.cartEmptyTitle,
    shop_cart_empty_description: flow.cartEmptyDescription,
    shop_cart_browse_label: flow.cartBrowseLabel,
    shop_order_summary_title: flow.orderSummaryTitle,
    shop_order_subtotal_label: flow.subtotalLabel,
    shop_order_shipping_label: flow.shippingLabel,
    shop_order_shipping_free_label: flow.shippingFreeLabel,
    shop_order_free_shipping_prefix: flow.freeShippingPrefix,
    shop_order_free_shipping_suffix: flow.freeShippingSuffix,
    shop_order_total_label: flow.totalLabel,
    shop_cart_checkout_label: flow.checkoutLabel,
    shop_cart_secure_note: flow.secureCheckoutNote,
    shop_cart_quantity_label: flow.quantityLabel,
    shop_cart_remove_label: flow.removeLabel,
    shop_cart_decrement_label: flow.decrementLabel,
    shop_cart_increment_label: flow.incrementLabel,
    shop_checkout_back_label: flow.checkoutBackLabel,
    shop_checkout_title: flow.checkoutTitle,
    shop_checkout_contact_title: flow.contactTitle,
    shop_checkout_email_placeholder: flow.emailPlaceholder,
    shop_checkout_shipping_title: flow.shippingAddressTitle,
    shop_checkout_first_name_placeholder: flow.firstNamePlaceholder,
    shop_checkout_last_name_placeholder: flow.lastNamePlaceholder,
    shop_checkout_street_placeholder: flow.streetPlaceholder,
    shop_checkout_city_placeholder: flow.cityPlaceholder,
    shop_checkout_state_placeholder: flow.statePlaceholder,
    shop_checkout_postal_placeholder: flow.postalPlaceholder,
    shop_checkout_country_placeholder: flow.countryPlaceholder,
    shop_checkout_payment_title: flow.paymentTitle,
    shop_checkout_encrypted_label: flow.encryptedLabel,
    shop_checkout_card_number_placeholder: flow.cardNumberPlaceholder,
    shop_checkout_card_name_placeholder: flow.cardNamePlaceholder,
    shop_checkout_expiry_placeholder: flow.expiryPlaceholder,
    shop_checkout_cvc_placeholder: flow.cvcPlaceholder,
    shop_checkout_order_title: flow.yourOrderTitle,
    shop_checkout_tax_label: flow.taxLabel,
    shop_checkout_place_order_label: flow.placeOrderLabel,
    shop_checkout_place_order_note: flow.placeOrderNote,
    shop_confirmation_eyebrow: flow.confirmationEyebrow,
    shop_confirmation_title: flow.confirmationTitle,
    shop_confirmation_thanks_prefix: flow.confirmationThanksPrefix,
    shop_confirmation_thanks_suffix: flow.confirmationThanksSuffix,
    shop_confirmation_order_number_label: flow.orderNumberLabel,
    shop_confirmation_arrives_label: flow.arrivesLabel,
    shop_confirmation_total_paid_label: flow.totalPaidLabel,
    shop_confirmation_continue_label: flow.continueShoppingLabel,
    shop_confirmation_home_label: flow.returnHomeLabel,
    shop_confirmation_default_first_name: flow.defaultFirstName,
    shop_confirmation_arrival_label: flow.arrivalLabel,
    shop_payment_failure_eyebrow: flow.paymentFailureEyebrow,
    shop_payment_failure_title: flow.paymentFailureTitle,
    shop_payment_failure_description: flow.paymentFailureDescription,
    shop_payment_failure_context_title: flow.paymentFailureContextTitle,
    shop_payment_failure_context_description:
      flow.paymentFailureContextDescription,
    shop_payment_failure_retry_label: flow.paymentFailureRetryLabel,
    shop_payment_failure_cart_label: flow.paymentFailureCartLabel,
  };
};

export const getReportsDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const grid = getReportsCatalogGridCopy(locale);
  const intro = getReportsCatalogIntroCopy(locale);
  const detailNavigation = getReportsDetailNavigationCopy(locale);
  const detailPanel = getReportsDetailPanelCopy(locale);
  const seo = getReportsSeoCopy(locale);

  return {
    ...reportsSharedDefaults,
    catalog_intro_eyebrow: intro.eyebrow,
    catalog_intro_title_accent: intro.titleAccent,
    catalog_intro_title_suffix: intro.titleSuffix,
    catalog_intro_description: intro.description,
    detail_back_label: detailNavigation.backLabel,
    detail_pdf_label: detailPanel.pdfLabel,
    detail_delivery_label: detailPanel.deliveryLabel,
    detail_buy_label: detailPanel.buyLabel,
    detail_purchase_note: detailPanel.purchaseNote,
    detail_inside_label: detailPanel.insideLabel,
    detail_sample_label: detailPanel.sampleLabel,
    catalog_grid_aria_label: grid.ariaLabel,
    ...Object.fromEntries(
      grid.reports.flatMap((report, index) => {
        const reportNumber = index + 1;
        return [
          [`catalog_report_${reportNumber}_title`, report.title],
          [`catalog_report_${reportNumber}_description`, report.description],
          [`catalog_report_${reportNumber}_action_label`, grid.actionLabel],
        ];
      }),
    ),
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getReportsDetailDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const detailPanel = getReportsDetailPanelCopy(locale);

  return Object.fromEntries(
    detailPanel.reports.flatMap((report, reportIndex) => {
      const reportNumber = reportIndex + 1;
      return [
        [
          `detail_report_${reportNumber}_long_description`,
          report.longDescription,
        ],
        ...report.chapters.flatMap((chapter, chapterIndex) => {
          const chapterNumber = chapterIndex + 1;
          return [
            [
              `detail_report_${reportNumber}_chapter_${chapterNumber}_title`,
              chapter.title,
            ],
            [
              `detail_report_${reportNumber}_chapter_${chapterNumber}_description`,
              chapter.description,
            ],
          ];
        }),
        [`detail_report_${reportNumber}_sample`, report.sample],
      ];
    }),
  );
};

export const getAstrologersPrimaryDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const browse = getAstrologersBrowseCopy(locale);
  const seo = getAstrologersSeoCopy(locale);

  return {
    ...astrologersSharedDefaults,
    browse_eyebrow: browse.eyebrow,
    browse_title_accent: browse.titleAccent,
    browse_title_suffix: browse.titleSuffix,
    browse_description: browse.description,
    search_aria: browse.searchAria,
    search_placeholder: browse.searchPlaceholder,
    search_submit: browse.searchSubmit,
    search_clear: browse.searchClear,
    filter_label: browse.filterLabel,
    filter_all: browse.filterAll,
    filter_love: browse.filterLove,
    filter_career: browse.filterCareer,
    filter_life_path: browse.filterLifePath,
    filter_timing: browse.filterTiming,
    filter_spiritual: browse.filterSpiritual,
    online_now: browse.onlineNow,
    busy_label: browse.busyLabel,
    offline_label: browse.offlineLabel,
    results_suffix: browse.resultsSuffix,
    no_results_title: browse.noResultsTitle,
    no_results_body: browse.noResultsBody,
    profile_action: browse.profileAction,
    talk_now: browse.talkNow,
    book_next_slot: browse.bookNextSlot,
    schedule: browse.schedule,
    rate_unit: browse.rateUnit,
    reviews_suffix: browse.reviewsSuffix,
    browse_profile_picker_eyebrow: browse.profilePickerEyebrow,
    browse_profile_picker_title: browse.profilePickerTitle,
    browse_profile_picker_description: browse.profilePickerDescription,
    browse_profile_picker_close_label: browse.profilePickerCloseLabel,
    browse_profile_picker_empty_title: browse.profilePickerEmptyTitle,
    browse_profile_picker_empty_description:
      browse.profilePickerEmptyDescription,
    browse_profile_picker_create_label: browse.profilePickerCreateLabel,
    browse_profile_picker_select_label: browse.profilePickerSelectLabel,
    browse_profile_picker_default_label: browse.profilePickerDefaultLabel,
    browse_profile_picker_add_title: browse.profilePickerAddTitle,
    browse_profile_picker_back_label: browse.profilePickerBackLabel,
    browse_profile_picker_save_label: browse.profilePickerSaveLabel,
    browse_profile_picker_saving_label: browse.profilePickerSavingLabel,
    browse_profile_picker_error: browse.profilePickerError,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getAstrologerProfileDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const profile = getAstrologerProfileCopy(locale);

  return {
    profile_back_label: profile.backLabel,
    profile_years_reading: profile.yearsReading,
    profile_sessions: profile.sessions,
    profile_languages: profile.languages,
    profile_about: profile.about,
    profile_specialties: profile.specialties,
    profile_what_to_expect: profile.whatToExpect,
    profile_expectation_one: profile.expectationOne,
    profile_expectation_two: profile.expectationTwo,
    profile_expectation_three: profile.expectationThree,
    profile_expectation_four: profile.expectationFour,
    profile_recent_reviews: profile.recentReviews,
    profile_average: profile.average,
    profile_reviews_suffix: profile.reviewsSuffix,
    profile_rate_unit: profile.rateUnit,
    profile_talk_now: profile.talkNow,
    profile_book_next_slot: profile.bookNextSlot,
    profile_schedule: profile.schedule,
    profile_written_question: profile.checkReviews,
    profile_free_minutes_note: profile.freeMinutesNote,
    profile_chart_ready: profile.chartReady,
    profile_chart_owner: profile.chartOwner,
    profile_chart_label: profile.chartLabel,
    profile_review_one_date: profile.reviewOneDate,
    profile_review_one_text: profile.reviewOneText,
    profile_review_two_date: profile.reviewTwoDate,
    profile_review_two_text: profile.reviewTwoText,
    profile_review_three_date: profile.reviewThreeDate,
    profile_review_three_text: profile.reviewThreeText,
  };
};

export const getAstrologersDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => ({
  ...getAstrologersPrimaryDefaults(locale),
  ...getAstrologerProfileDefaults(locale),
});

export const getAstrologerSessionSetupDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const setup = getAstrologerSessionSetupCopy(locale);
  const live = getAstrologerLiveSessionCopy(locale);

  return {
    setup_back_label: setup.backLabel,
    setup_title: setup.title,
    setup_description: setup.description,
    setup_connect_title: setup.connectTitle,
    setup_chat_label: setup.liveChat,
    setup_chat_description: setup.liveChatDescription,
    setup_voice_label: setup.voiceCall,
    setup_voice_description: setup.voiceCallDescription,
    setup_video_label: setup.videoCall,
    setup_video_description: setup.videoCallDescription,
    setup_written_label: setup.writtenQuestion,
    setup_written_description: setup.writtenQuestionDescription,
    setup_when_title: setup.whenTitle,
    setup_talk_now: setup.talkNow,
    setup_talk_now_description: setup.talkNowDescription,
    setup_schedule_later: setup.scheduleLater,
    setup_schedule_later_description: setup.scheduleLaterDescription,
    setup_choose_slot: setup.chooseSlot,
    setup_slot_one: setup.slotOne,
    setup_slot_two: setup.slotTwo,
    setup_slot_three: setup.slotThree,
    setup_slot_four: setup.slotFour,
    setup_slot_five: setup.slotFive,
    setup_slot_six: setup.slotSix,
    setup_session_length: setup.sessionLength,
    setup_duration_fifteen: setup.durationFifteen,
    setup_duration_thirty: setup.durationThirty,
    setup_duration_forty_five: setup.durationFortyFive,
    setup_duration_sixty: setup.durationSixty,
    setup_question_title: setup.questionTitle,
    setup_question_description: setup.questionDescription,
    setup_topic_love: setup.topicLove,
    setup_topic_career: setup.topicCareer,
    setup_topic_timing: setup.topicTiming,
    setup_topic_life_path: setup.topicLifePath,
    setup_question_placeholder: setup.questionPlaceholder,
    setup_chart_shared: setup.chartShared,
    setup_chart_owner: setup.chartOwner,
    setup_chart_label: setup.chartLabel,
    setup_edit_chart: setup.editChart,
    setup_summary_label: setup.summaryLabel,
    setup_session_label: setup.sessionLabel,
    setup_when_label: setup.whenLabel,
    setup_within_day_label: setup.withinDayLabel,
    setup_rate_label: setup.rateLabel,
    setup_per_minute_label: setup.perMinuteLabel,
    setup_flat_rate_label: setup.flatRateLabel,
    setup_estimated_label: setup.estimatedLabel,
    setup_total_label: setup.totalLabel,
    setup_free_minutes: setup.freeMinutes,
    setup_start_now: setup.startNow,
    setup_confirm_booking: setup.confirmBooking,
    setup_send_question: setup.sendQuestion,
    setup_secure_note: setup.secureNote,
    live_connected: live.connected,
    live_wallet_label: live.walletLabel,
    live_meter_label: live.meterLabel,
    live_end_session: live.endSession,
    live_session_started: live.sessionStarted,
    live_opening_message: live.openingMessage,
    live_reply_message: live.replyMessage,
    live_quick_year: live.quickYear,
    live_quick_career: live.quickCareer,
    live_quick_love: live.quickLove,
    live_quick_transits: live.quickTransits,
    live_message_placeholder: live.messagePlaceholder,
    live_send_message: live.sendMessage,
    live_chart_title: live.chartTitle,
    live_chart_owner: live.chartOwner,
    live_chart_label: live.chartLabel,
    live_asked_title: live.askedTitle,
    live_asked_text: live.askedText,
    live_placements_title: live.placementsTitle,
    live_sun_placement: live.sunPlacement,
    live_moon_placement: live.moonPlacement,
    live_rising_placement: live.risingPlacement,
    live_wallet_low_title: live.walletLowTitle,
    live_wallet_low_description: live.walletLowDescription,
    live_wallet_current_label: live.walletCurrentLabel,
    live_wallet_required_label: live.walletRequiredLabel,
    live_wallet_shortfall_label: live.walletShortfallLabel,
    live_add_funds_label: live.addFundsLabel,
    live_wallet_close_label: live.walletCloseLabel,
  };
};

export const getAstrologerChatHistoryDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const live = getAstrologerLiveSessionCopy(locale);
  return {
    live_history_title: live.historyTitle,
    live_new_chat: live.newChat,
    live_open_history: live.openHistory,
    live_close_history: live.closeHistory,
    live_no_history: live.noHistory,
    live_session_ended: live.sessionEnded,
    live_chats_label: live.chatsLabel,
    live_transactions_label: live.transactionsLabel,
    live_no_transactions: live.noTransactions,
    live_chatting_as: live.chattingAs,
    live_secure_private: live.securePrivate,
    live_back_to_astrologers: live.backToAstrologers,
    live_load_more: live.loadMore,
  };
};

export const getAstrologerSessionSummaryDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const summary = getAstrologerSessionSummaryCopy(locale);

  return {
    summary_live_overline: summary.liveOverline,
    summary_live_title: summary.liveTitle,
    summary_live_body: summary.liveBody,
    summary_booked_overline: summary.bookedOverline,
    summary_booked_title: summary.bookedTitle,
    summary_booked_body: summary.bookedBody,
    summary_sent_overline: summary.sentOverline,
    summary_sent_title: summary.sentTitle,
    summary_sent_body: summary.sentBody,
    summary_session_type_label: summary.sessionTypeLabel,
    summary_duration_label: summary.durationLabel,
    summary_free_intro_label: summary.freeIntroLabel,
    summary_free_intro_value: summary.freeIntroValue,
    summary_billed_at_label: summary.billedAtLabel,
    summary_when_label: summary.whenLabel,
    summary_length_label: summary.lengthLabel,
    summary_type_label: summary.typeLabel,
    summary_reply_by_label: summary.replyByLabel,
    summary_chart_label: summary.chartLabel,
    summary_shared_value: summary.sharedValue,
    summary_total_charged_label: summary.totalChargedLabel,
    summary_estimated_total_label: summary.estimatedTotalLabel,
    summary_rating_title: summary.ratingTitle,
    summary_rating_aria_label: summary.ratingAriaLabel,
    summary_note_placeholder: summary.notePlaceholder,
    summary_live_primary_action: summary.livePrimaryAction,
    summary_booked_primary_action: summary.bookedPrimaryAction,
    summary_sent_primary_action: summary.sentPrimaryAction,
    summary_back_action: summary.backAction,
    summary_return_home: summary.returnHome,
  };
};

export const getDailyHoroscopePersonalizedCtaDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const copy = getDailyHoroscopePersonalizedCtaCopy(locale);

  return {
    personalized_cta_eyebrow: copy.eyebrow,
    personalized_cta_title_lead: copy.titleLead,
    personalized_cta_title_accent: copy.titleAccent,
    personalized_cta_title_rest: copy.titleRest,
    personalized_cta_description: copy.description,
    personalized_cta_primary_label: copy.primaryLabel,
    personalized_cta_secondary_label: copy.secondaryLabel,
  };
};

export const getDailyHoroscopeDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const picker = getDailyHoroscopeChooseSignCopy(locale);
  const personalizedCta = getDailyHoroscopePersonalizedCtaDefaults(locale);
  const reading = getDailyHoroscopeReadingDefaults(locale);
  const seo = getDailyHoroscopeSeoCopy(locale);
  const signs = Object.fromEntries(
    picker.signs.flatMap((sign, index) => {
      const signNumber = index + 1;
      return [
        [`picker_sign_${signNumber}_name`, sign.name],
        [`picker_sign_${signNumber}_dates`, sign.dates],
        [`picker_sign_${signNumber}_element`, sign.element],
      ];
    }),
  );

  return {
    picker_eyebrow: picker.eyebrow,
    picker_title_accent: picker.titleAccent,
    picker_title_rest: picker.titleRest,
    picker_description: picker.description,
    picker_helper_prefix: picker.helperPrefix,
    picker_helper_cta: picker.helperCta,
    ...signs,
    ...reading,
    ...personalizedCta,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    seo_canonical_path: "/daily-horoscope",
    seo_robots: "index,follow",
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.ogImageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getBirthChartDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const wizard = getBirthChartFormWizardCopy(locale);
  const casting = getBirthChartCastingStateCopy(locale);
  const seo = getBirthChartSeoCopy(locale);

  return {
    ...birthChartSharedDefaults,
    ...wizard,
    ...casting,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image_alt: seo.ogImageAlt,
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
  };
};

export const getTransitDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const casting = getTransitCastingStateCopy(locale);
  const form = getTransitFormWizardCopy(locale);
  const results = getTransitResultsCopy(locale);
  const seo = getTransitSeoCopy(locale);
  return {
    ...form,
    ...casting,
    ...results,
    seo_title: seo.seoTitle,
    seo_description: seo.seoDescription,
    seo_canonical_path: "/transit",
    seo_robots: "index,follow",
    og_title: seo.ogTitle,
    og_description: seo.ogDescription,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.ogImageAlt,
    twitter_card: "summary_large_image",
    twitter_title: seo.twitterTitle,
    twitter_description: seo.twitterDescription,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};

export const getSynastryDefaults = (
  locale: SupportedLocale = "en",
): HomePageContent => {
  const overlaying = getSynastryOverlayingStateCopy(locale);
  const reportHandoff = getSynastryRelationshipReportHandoffCopy(locale);
  const results = getSynastryResultsCopy(locale);
  const setup = getSynastrySetupCopy(locale);
  const seo = getSynastrySeoCopy(locale);
  return {
    ...setup,
    ...overlaying,
    ...results,
    ...reportHandoff,
    seo_title: seo.title,
    seo_description: seo.description,
    seo_canonical_path: "/synastry",
    seo_robots: "index,follow",
    og_title: seo.title,
    og_description: seo.description,
    og_image: "/_assets/aliases/logo/logo.svg",
    og_image_alt: seo.title,
    twitter_card: "summary_large_image",
    twitter_title: seo.title,
    twitter_description: seo.description,
    twitter_image: "/_assets/aliases/logo/logo.svg",
  };
};
