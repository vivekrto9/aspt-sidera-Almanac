import {
  activeLocales,
  type SupportedLocale,
} from "../data/localization-contract.ts";
import {
  getAccountDefaults,
  getAboutDefaults,
  getAstrologerChatHistoryDefaults,
  getAstrologerProfileDefaults,
  getAstrologerSessionSetupDefaults,
  getAstrologerSessionSummaryDefaults,
  getAstrologersPrimaryDefaults,
  getBirthChartDefaults,
  getBlogArticleBodyDefaults,
  getBlogArticleHeaderDefaults,
  getBlogDefaults,
  getChromeDefaults,
  getDailyHoroscopeDefaults,
  getDailyHoroscopePersonalizedCtaDefaults,
  getFaqDefaults,
  getGlossaryDefaults,
  getHomeDefaults,
  getLoginDefaults,
  getForgotPasswordDefaults,
  getResetPasswordDefaults,
  getMoonCalendarDefaults,
  getPrivacyDefaults,
  getReportsDetailDefaults,
  getReportsDefaults,
  getRetrogradesDefaults,
  getShopCatalogDefaults,
  getShopCheckoutFlowDefaults,
  getShopDefaults,
  getShopProductDescriptionDefaults,
  getShopProductDetailDefaults,
  getSignupDefaults,
  getSynastryDefaults,
  getTermsDefaults,
  getTodaysSkyDefaults,
  getTransitDefaults,
  getWalletDefaults,
  type HomePageContent,
} from "../data/public-copy.ts";
import { getBirthChartResultsCopy } from "../data/locale/birth-chart/sections/results.ts";
import { getTransitResultsCopy } from "../data/locale/transit/sections/results.ts";

export type BuilderFieldType = "string" | "text";

export type BuilderSchemaField = {
  slug: string;
  type: BuilderFieldType;
  label: string;
  required?: boolean;
};

export type PageContent = Record<string, string>;

export type BuilderCollectionConfig = {
  slug: string;
  label: string;
  labelSingular: string;
  supports: Array<"drafts" | "revisions" | "preview">;
  fields: BuilderSchemaField[];
};

export type BuilderEntryConfig = {
  collectionConfig: BuilderCollectionConfig;
  editableFields: BuilderSchemaField[];
  defaultsByLocale: Record<SupportedLocale, HomePageContent>;
};

export type BuilderContentTarget = {
  collection: string;
  entry: string;
};

export type BuilderReleaseTarget = BuilderContentTarget & {
  fields: string[];
};

const seoFields = [
  "seo_title",
  "seo_description",
  "seo_canonical_path",
  "seo_robots",
  "og_title",
  "og_description",
  "og_image",
  "og_image_alt",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
];

const longTextPatterns = [
  "_body",
  "_about",
  "_description",
  "_answer",
  "footer_note",
  "seo_description",
  "og_description",
  "twitter_description",
];

const labelFor = (field: string) =>
  field
    .replace(/^seo_/, "SEO ")
    .replace(/^og_/, "Open Graph ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("Cta", "CTA");

const fieldType = (field: string): BuilderFieldType =>
  longTextPatterns.some((pattern) => field.includes(pattern))
    ? "text"
    : "string";

const schemaFieldsFor = (defaults: PageContent): BuilderSchemaField[] =>
  Object.keys(defaults).map((field) => ({
    slug: field,
    type: fieldType(field),
    label: labelFor(field),
    required: ["hero_title", "brand_name", "seo_title"].includes(field),
  }));

const withLocaleDefaults = (
  defaultsFactory: (locale: SupportedLocale) => HomePageContent,
) =>
  Object.fromEntries(
    activeLocales.map((locale) => [locale.code, defaultsFactory(locale.code)]),
  ) as Record<SupportedLocale, HomePageContent>;

const selectDefaults = (
  defaults: HomePageContent,
  predicate: (field: string) => boolean,
): HomePageContent =>
  Object.fromEntries(
    Object.entries(defaults).filter(([field]) => predicate(field)),
  );
const getHomeCoreDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(
    getHomeDefaults(locale),
    (field) => !field.startsWith("home_"),
  );
const isHomeHoroscopeField = (field: string) =>
  field.startsWith("home_horoscope_");
const isHomeAstrologersField = (field: string) =>
  field.startsWith("home_astrologers_");
const isHomeReportsField = (field: string) => field.startsWith("home_reports_");
const isHomeShopField = (field: string) => field.startsWith("home_shop_");
const isHomeBlogField = (field: string) => field.startsWith("home_blog_");
const isHomeFinalCtaField = (field: string) =>
  field.startsWith("home_final_cta_");
const getHomeSectionDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(
    getHomeDefaults(locale),
    (field) =>
      field.startsWith("home_") &&
      !isHomeHoroscopeField(field) &&
      !isHomeAstrologersField(field) &&
      !isHomeReportsField(field) &&
      !isHomeShopField(field) &&
      !isHomeBlogField(field) &&
      !isHomeFinalCtaField(field),
  );
const getHomeHoroscopeDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeHoroscopeField);
const getHomeAstrologersDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeAstrologersField);
const getHomeReportsDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeReportsField);
const getHomeShopDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeShopField);
const getHomeBlogDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeBlogField);
const getHomeFinalCtaDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getHomeDefaults(locale), isHomeFinalCtaField);
const isTransitResultsField = (field: string) => field.startsWith("results_");
const isTransitYearAheadField = (field: string) =>
  field.startsWith("year_ahead_");
const getTransitPrimaryDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(
    getTransitDefaults(locale),
    (field) => !isTransitResultsField(field) && !isTransitYearAheadField(field),
  );
const isAccountEmptyStateField = (field: string) =>
  /^account_(saved_charts|people|orders|sessions|overview_(sky|session))_empty_/.test(
    field,
  );
const isAccountWalletField = (field: string) =>
  field === "account_nav_wallet_label" || field.startsWith("account_wallet_");
const getAccountPrimaryDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(
    getAccountDefaults(locale),
    (field) => !isAccountEmptyStateField(field) && !isAccountWalletField(field),
  );
const getAccountEmptyStateDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getAccountDefaults(locale), isAccountEmptyStateField);
const getAccountWalletDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(getAccountDefaults(locale), isAccountWalletField);
const isDailyHoroscopePersonalizedCtaField = (field: string) =>
  field.startsWith("personalized_cta_");
const getDailyHoroscopePrimaryDefaults = (locale: SupportedLocale = "en") =>
  selectDefaults(
    getDailyHoroscopeDefaults(locale),
    (field) => !isDailyHoroscopePersonalizedCtaField(field),
  );

const collectionFor = (
  slug: string,
  label: string,
  defaults: PageContent,
): BuilderCollectionConfig => ({
  slug,
  label,
  labelSingular: label.replace(/s$/, ""),
  supports: ["drafts", "revisions", "preview"],
  fields: schemaFieldsFor(defaults),
});

const homeCollection = collectionFor("site_pages", "Site Pages", {
  ...getHomeCoreDefaults("en"),
  ...getTermsDefaults("en"),
});
const homeSectionsCollection = collectionFor(
  "site_home_sections",
  "Home Sections",
  getHomeSectionDefaults("en"),
);
const homeHoroscopeCollection = collectionFor(
  "site_home_horoscope",
  "Home Horoscope",
  getHomeHoroscopeDefaults("en"),
);
const homeAstrologersCollection = collectionFor(
  "site_home_astrologers",
  "Home Astrologers",
  getHomeAstrologersDefaults("en"),
);
const homeReportsCollection = collectionFor(
  "site_home_reports",
  "Home Reports",
  getHomeReportsDefaults("en"),
);
const homeShopCollection = collectionFor(
  "site_home_shop",
  "Home Shop",
  getHomeShopDefaults("en"),
);
const homeBlogCollection = collectionFor(
  "site_home_blog",
  "Home Blog",
  getHomeBlogDefaults("en"),
);
const homeFinalCtaCollection = collectionFor(
  "site_home_final_cta",
  "Home Final CTA",
  getHomeFinalCtaDefaults("en"),
);
const chromeCollection = collectionFor(
  "site_chrome",
  "Site Chrome",
  getChromeDefaults("en"),
);
const todaysSkyCollection = collectionFor(
  "site_todays_sky",
  "Today Sky Content",
  getTodaysSkyDefaults("en"),
);
const faqCollection = collectionFor(
  "site_faq",
  "FAQ Content",
  getFaqDefaults("en"),
);
const glossaryCollection = collectionFor(
  "site_glossary",
  "Glossary Content",
  getGlossaryDefaults("en"),
);
const walletCollection = collectionFor(
  "site_wallet",
  "Wallet Content",
  getWalletDefaults("en"),
);
const accountCollection = collectionFor(
  "site_account",
  "Account Content",
  getAccountPrimaryDefaults("en"),
);
const accountEmptyStatesCollection = collectionFor(
  "site_account_empty_states",
  "Account Empty States Content",
  getAccountEmptyStateDefaults("en"),
);
const accountWalletCollection = collectionFor(
  "site_account_wallet",
  "Account Wallet Content",
  getAccountWalletDefaults("en"),
);
const forgotPasswordCollection = collectionFor(
  "site_forgot_password",
  "Forgot Password Content",
  getForgotPasswordDefaults("en"),
);
const loginCollection = collectionFor(
  "site_login",
  "Sign In Content",
  getLoginDefaults("en"),
);
const signupCollection = collectionFor(
  "site_signup",
  "Sign Up Content",
  getSignupDefaults("en"),
);
const resetPasswordCollection = collectionFor(
  "site_reset_password",
  "Reset Password Content",
  getResetPasswordDefaults("en"),
);
const aboutCollection = collectionFor(
  "site_about",
  "About Content",
  getAboutDefaults("en"),
);
const blogCollection = collectionFor(
  "site_blog",
  "Blog Content",
  getBlogDefaults("en"),
);
const blogArticleCollection = collectionFor(
  "site_blog_articles",
  "Blog Article Content",
  getBlogArticleHeaderDefaults("en"),
);
const blogArticleBodyCollection = collectionFor(
  "site_blog_article_bodies",
  "Blog Article Bodies",
  getBlogArticleBodyDefaults("en"),
);
const birthChartCollection = collectionFor(
  "site_birth_chart",
  "Birth Chart Content",
  getBirthChartDefaults("en"),
);
const birthChartResultsCollection = collectionFor(
  "site_birth_chart_results",
  "Birth Chart Results",
  getBirthChartResultsCopy("en"),
);
const privacyCollection = collectionFor(
  "site_privacy",
  "Privacy Content",
  getPrivacyDefaults("en"),
);
const transitCollection = collectionFor(
  "site_transit",
  "Transit Content",
  getTransitPrimaryDefaults("en"),
);
const transitResultsCollection = collectionFor(
  "site_transit_results",
  "Transit Results",
  getTransitResultsCopy("en"),
);
const synastryCollection = collectionFor(
  "site_synastry",
  "Synastry Content",
  getSynastryDefaults("en"),
);
const moonCalendarCollection = collectionFor(
  "site_moon_calendar",
  "Moon Calendar Content",
  getMoonCalendarDefaults("en"),
);
const dailyHoroscopeCollection = collectionFor(
  "site_daily_horoscope",
  "Daily Horoscope Content",
  getDailyHoroscopePrimaryDefaults("en"),
);
const dailyHoroscopeCtaCollection = collectionFor(
  "site_daily_horoscope_cta",
  "Daily Horoscope CTA",
  getDailyHoroscopePersonalizedCtaDefaults("en"),
);
const retrogradesCollection = collectionFor(
  "site_retrogrades",
  "Retrogrades Content",
  getRetrogradesDefaults("en"),
);
const astrologersCollection = collectionFor(
  "site_astrologers",
  "Astrologers Content",
  getAstrologersPrimaryDefaults("en"),
);
const astrologerProfileCollection = collectionFor(
  "site_astrologer_profiles",
  "Astrologer Profiles Content",
  getAstrologerProfileDefaults("en"),
);
const astrologerSessionSetupCollection = collectionFor(
  "site_astrologers_session_setup",
  "Astrologer Session Setup Content",
  getAstrologerSessionSetupDefaults("en"),
);
const astrologerChatHistoryCollection = collectionFor(
  "site_astrologers_chat_history",
  "Astrologer Chat History Content",
  getAstrologerChatHistoryDefaults("en"),
);
const astrologerSessionSummaryCollection = collectionFor(
  "site_astrologers_session_summary",
  "Astrologer Session Summary Content",
  getAstrologerSessionSummaryDefaults("en"),
);
const reportsCollection = collectionFor(
  "site_reports",
  "Reports Content",
  getReportsDefaults("en"),
);
const reportDetailsCollection = collectionFor(
  "site_report_details",
  "Report Details Content",
  getReportsDetailDefaults("en"),
);
const shopCollection = collectionFor(
  "site_shop",
  "Shop Content",
  getShopDefaults("en"),
);
const shopCatalogCollection = collectionFor(
  "site_shop_catalog",
  "Shop Catalog Content",
  getShopCatalogDefaults("en"),
);
const shopProductDetailCollection = collectionFor(
  "site_shop_product_detail",
  "Shop Product Detail Content",
  getShopProductDetailDefaults("en"),
);
const shopProductDescriptionCollection = collectionFor(
  "site_shop_product_descriptions",
  "Shop Product Descriptions",
  getShopProductDescriptionDefaults("en"),
);
const shopCheckoutFlowCollection = collectionFor(
  "site_shop_checkout_flow",
  "Shop Checkout Flow Content",
  getShopCheckoutFlowDefaults("en"),
);

const entries: BuilderEntryConfig[] = [
  {
    collectionConfig: homeCollection,
    editableFields: schemaFieldsFor(getHomeCoreDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeCoreDefaults),
  },
  {
    collectionConfig: chromeCollection,
    editableFields: schemaFieldsFor(getChromeDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getChromeDefaults),
  },
  {
    collectionConfig: todaysSkyCollection,
    editableFields: schemaFieldsFor(getTodaysSkyDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getTodaysSkyDefaults),
  },
  {
    collectionConfig: homeCollection,
    editableFields: schemaFieldsFor(getTermsDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getTermsDefaults),
  },
  {
    collectionConfig: faqCollection,
    editableFields: schemaFieldsFor(getFaqDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getFaqDefaults),
  },
  {
    collectionConfig: birthChartCollection,
    editableFields: schemaFieldsFor(getBirthChartDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getBirthChartDefaults),
  },
  {
    collectionConfig: birthChartResultsCollection,
    editableFields: schemaFieldsFor(getBirthChartResultsCopy("en")),
    defaultsByLocale: withLocaleDefaults(getBirthChartResultsCopy),
  },
  {
    collectionConfig: homeSectionsCollection,
    editableFields: schemaFieldsFor(getHomeSectionDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeSectionDefaults),
  },
  {
    collectionConfig: privacyCollection,
    editableFields: schemaFieldsFor(getPrivacyDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getPrivacyDefaults),
  },
  {
    collectionConfig: transitCollection,
    editableFields: schemaFieldsFor(getTransitPrimaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getTransitPrimaryDefaults),
  },
  {
    collectionConfig: transitResultsCollection,
    editableFields: schemaFieldsFor(getTransitResultsCopy("en")),
    defaultsByLocale: withLocaleDefaults(getTransitResultsCopy),
  },
  {
    collectionConfig: synastryCollection,
    editableFields: schemaFieldsFor(getSynastryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getSynastryDefaults),
  },
  {
    collectionConfig: homeHoroscopeCollection,
    editableFields: schemaFieldsFor(getHomeHoroscopeDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeHoroscopeDefaults),
  },
  {
    collectionConfig: homeAstrologersCollection,
    editableFields: schemaFieldsFor(getHomeAstrologersDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeAstrologersDefaults),
  },
  {
    collectionConfig: homeReportsCollection,
    editableFields: schemaFieldsFor(getHomeReportsDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeReportsDefaults),
  },
  {
    collectionConfig: homeShopCollection,
    editableFields: schemaFieldsFor(getHomeShopDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeShopDefaults),
  },
  {
    collectionConfig: homeBlogCollection,
    editableFields: schemaFieldsFor(getHomeBlogDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeBlogDefaults),
  },
  {
    collectionConfig: homeFinalCtaCollection,
    editableFields: schemaFieldsFor(getHomeFinalCtaDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getHomeFinalCtaDefaults),
  },
  {
    collectionConfig: moonCalendarCollection,
    editableFields: schemaFieldsFor(getMoonCalendarDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getMoonCalendarDefaults),
  },
  {
    collectionConfig: dailyHoroscopeCollection,
    editableFields: schemaFieldsFor(getDailyHoroscopePrimaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getDailyHoroscopePrimaryDefaults),
  },
  {
    collectionConfig: retrogradesCollection,
    editableFields: schemaFieldsFor(getRetrogradesDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getRetrogradesDefaults),
  },
  {
    collectionConfig: astrologersCollection,
    editableFields: schemaFieldsFor(getAstrologersPrimaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAstrologersPrimaryDefaults),
  },
  {
    collectionConfig: reportsCollection,
    editableFields: schemaFieldsFor(getReportsDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getReportsDefaults),
  },
  {
    collectionConfig: reportDetailsCollection,
    editableFields: schemaFieldsFor(getReportsDetailDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getReportsDetailDefaults),
  },
  {
    collectionConfig: shopCollection,
    editableFields: schemaFieldsFor(getShopDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getShopDefaults),
  },
  {
    collectionConfig: glossaryCollection,
    editableFields: schemaFieldsFor(getGlossaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getGlossaryDefaults),
  },
  {
    collectionConfig: aboutCollection,
    editableFields: schemaFieldsFor(getAboutDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAboutDefaults),
  },
  {
    collectionConfig: blogCollection,
    editableFields: schemaFieldsFor(getBlogDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getBlogDefaults),
  },
  {
    collectionConfig: accountCollection,
    editableFields: schemaFieldsFor(getAccountPrimaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAccountPrimaryDefaults),
  },
  {
    collectionConfig: shopCatalogCollection,
    editableFields: schemaFieldsFor(getShopCatalogDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getShopCatalogDefaults),
  },
  {
    collectionConfig: dailyHoroscopeCtaCollection,
    editableFields: schemaFieldsFor(
      getDailyHoroscopePersonalizedCtaDefaults("en"),
    ),
    defaultsByLocale: withLocaleDefaults(
      getDailyHoroscopePersonalizedCtaDefaults,
    ),
  },
  {
    collectionConfig: astrologerSessionSetupCollection,
    editableFields: schemaFieldsFor(getAstrologerSessionSetupDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAstrologerSessionSetupDefaults),
  },
  {
    collectionConfig: astrologerProfileCollection,
    editableFields: schemaFieldsFor(getAstrologerProfileDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAstrologerProfileDefaults),
  },
  {
    collectionConfig: loginCollection,
    editableFields: schemaFieldsFor(getLoginDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getLoginDefaults),
  },
  {
    collectionConfig: blogArticleCollection,
    editableFields: schemaFieldsFor(getBlogArticleHeaderDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getBlogArticleHeaderDefaults),
  },
  {
    collectionConfig: shopProductDetailCollection,
    editableFields: schemaFieldsFor(getShopProductDetailDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getShopProductDetailDefaults),
  },
  {
    collectionConfig: shopProductDescriptionCollection,
    editableFields: schemaFieldsFor(getShopProductDescriptionDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getShopProductDescriptionDefaults),
  },
  {
    collectionConfig: signupCollection,
    editableFields: schemaFieldsFor(getSignupDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getSignupDefaults),
  },
  {
    collectionConfig: blogArticleBodyCollection,
    editableFields: schemaFieldsFor(getBlogArticleBodyDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getBlogArticleBodyDefaults),
  },
  {
    collectionConfig: forgotPasswordCollection,
    editableFields: schemaFieldsFor(getForgotPasswordDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getForgotPasswordDefaults),
  },
  {
    collectionConfig: resetPasswordCollection,
    editableFields: schemaFieldsFor(getResetPasswordDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getResetPasswordDefaults),
  },
  {
    collectionConfig: astrologerSessionSummaryCollection,
    editableFields: schemaFieldsFor(getAstrologerSessionSummaryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAstrologerSessionSummaryDefaults),
  },
  {
    collectionConfig: shopCheckoutFlowCollection,
    editableFields: schemaFieldsFor(getShopCheckoutFlowDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getShopCheckoutFlowDefaults),
  },
  {
    collectionConfig: accountEmptyStatesCollection,
    editableFields: schemaFieldsFor(getAccountEmptyStateDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAccountEmptyStateDefaults),
  },
  {
    collectionConfig: walletCollection,
    editableFields: schemaFieldsFor(getWalletDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getWalletDefaults),
  },
  {
    collectionConfig: accountWalletCollection,
    editableFields: schemaFieldsFor(getAccountWalletDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAccountWalletDefaults),
  },
  {
    collectionConfig: astrologerChatHistoryCollection,
    editableFields: schemaFieldsFor(getAstrologerChatHistoryDefaults("en")),
    defaultsByLocale: withLocaleDefaults(getAstrologerChatHistoryDefaults),
  },
];

const entryMap = new Map<string, BuilderEntryConfig>([
  ["site_pages/home", entries[0]],
  ["site_pages/not_found_page", entries[0]],
  ["site_chrome/main", entries[1]],
  ["site_todays_sky/todays_sky", entries[2]],
  ["site_pages/terms", entries[3]],
  ["site_faq/faq", entries[4]],
  ["site_birth_chart/birth_chart", entries[5]],
  ["site_birth_chart_results/results", entries[6]],
  ["site_home_sections/home", entries[7]],
  ["site_privacy/privacy", entries[8]],
  ["site_transit/transit", entries[9]],
  ["site_transit_results/results", entries[10]],
  ["site_synastry/synastry", entries[11]],
  ["site_home_horoscope/home", entries[12]],
  ["site_home_astrologers/home", entries[13]],
  ["site_home_reports/home", entries[14]],
  ["site_home_shop/home", entries[15]],
  ["site_home_blog/home", entries[16]],
  ["site_home_final_cta/home", entries[17]],
  ["site_moon_calendar/moon_calendar", entries[18]],
  ["site_daily_horoscope/daily_horoscope", entries[19]],
  ["site_retrogrades/retrogrades", entries[20]],
  ["site_astrologers/astrologers", entries[21]],
  ["site_reports/reports", entries[22]],
  ["site_report_details/details", entries[23]],
  ["site_shop/shop", entries[24]],
  ["site_glossary/glossary", entries[25]],
  ["site_about/about", entries[26]],
  ["site_blog/blog", entries[27]],
  ["site_account/account", entries[28]],
  ["site_shop_catalog/catalog", entries[29]],
  ["site_daily_horoscope_cta/cta", entries[30]],
  ["site_astrologers_session_setup/session-setup", entries[31]],
  ["site_astrologer_profiles/profiles", entries[32]],
  ["site_astrologers_session_summary/session-summary", entries[41]],
  ["site_login/login", entries[33]],
  ["site_forgot_password/forgot-password", entries[39]],
  ["site_reset_password/reset-password", entries[40]],
  ["site_blog_articles/articles", entries[34]],
  ["site_shop_product_detail/detail", entries[35]],
  ["site_shop_product_descriptions/descriptions", entries[36]],
  ["site_signup/signup", entries[37]],
  ["site_blog_article_bodies/bodies", entries[38]],
  ["site_shop_checkout_flow/checkout-flow", entries[42]],
  ["site_account_empty_states/empty-states", entries[43]],
  ["site_wallet/wallet", entries[44]],
  ["site_account_wallet/wallet", entries[45]],
  ["site_astrologers_chat_history/chat-history", entries[46]],
]);

const fieldTargets = new Map<string, BuilderContentTarget>();
for (const field of Object.keys(getHomeCoreDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_pages", entry: "home" });
}
for (const field of Object.keys(getHomeSectionDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_sections", entry: "home" });
}
for (const field of Object.keys(getHomeHoroscopeDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_horoscope", entry: "home" });
}
for (const field of Object.keys(getHomeAstrologersDefaults("en"))) {
  fieldTargets.set(field, {
    collection: "site_home_astrologers",
    entry: "home",
  });
}
for (const field of Object.keys(getHomeReportsDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_reports", entry: "home" });
}
for (const field of Object.keys(getHomeShopDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_shop", entry: "home" });
}
for (const field of Object.keys(getHomeBlogDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_blog", entry: "home" });
}
for (const field of Object.keys(getHomeFinalCtaDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_home_final_cta", entry: "home" });
}
for (const field of Object.keys(getReportsDetailDefaults("en"))) {
  fieldTargets.set(field, {
    collection: "site_report_details",
    entry: "details",
  });
}
for (const field of Object.keys(getAstrologerSessionSummaryDefaults("en"))) {
  fieldTargets.set(field, {
    collection: "site_astrologers_session_summary",
    entry: "session-summary",
  });
}
for (const field of Object.keys(getBlogArticleHeaderDefaults("en"))) {
  fieldTargets.set(field, {
    collection: "site_blog_articles",
    entry: "articles",
  });
}
for (const field of Object.keys(getBlogArticleBodyDefaults("en"))) {
  fieldTargets.set(field, {
    collection: "site_blog_article_bodies",
    entry: "bodies",
  });
}
for (const field of Object.keys(getChromeDefaults("en"))) {
  fieldTargets.set(field, { collection: "site_chrome", entry: "main" });
}
const pageTargets = new Map<string, BuilderContentTarget>([
  ["home", { collection: "site_pages", entry: "home" }],
  ["not_found_page", { collection: "site_pages", entry: "not_found_page" }],
  ["todays_sky", { collection: "site_todays_sky", entry: "todays_sky" }],
  ["terms", { collection: "site_pages", entry: "terms" }],
  ["faq", { collection: "site_faq", entry: "faq" }],
  ["birth_chart", { collection: "site_birth_chart", entry: "birth_chart" }],
  ["privacy", { collection: "site_privacy", entry: "privacy" }],
  ["transit", { collection: "site_transit", entry: "transit" }],
  ["synastry", { collection: "site_synastry", entry: "synastry" }],
  [
    "moon_calendar",
    { collection: "site_moon_calendar", entry: "moon_calendar" },
  ],
  [
    "daily_horoscope",
    { collection: "site_daily_horoscope", entry: "daily_horoscope" },
  ],
  ["retrogrades", { collection: "site_retrogrades", entry: "retrogrades" }],
  ["astrologers", { collection: "site_astrologers", entry: "astrologers" }],
  ["reports", { collection: "site_reports", entry: "reports" }],
  ["shop", { collection: "site_shop", entry: "shop" }],
  ["glossary", { collection: "site_glossary", entry: "glossary" }],
  ["wallet", { collection: "site_wallet", entry: "wallet" }],
  ["about", { collection: "site_about", entry: "about" }],
  ["blog", { collection: "site_blog", entry: "blog" }],
  ["account", { collection: "site_account", entry: "account" }],
  [
    "forgot-password",
    { collection: "site_forgot_password", entry: "forgot-password" },
  ],
  ["login", { collection: "site_login", entry: "login" }],
  ["signup", { collection: "site_signup", entry: "signup" }],
  [
    "reset-password",
    { collection: "site_reset_password", entry: "reset-password" },
  ],
]);
const supplementalPageTargets = new Map<string, BuilderContentTarget[]>([
  [
    "home",
    [
      { collection: "site_home_sections", entry: "home" },
      { collection: "site_home_horoscope", entry: "home" },
      { collection: "site_home_astrologers", entry: "home" },
      { collection: "site_home_reports", entry: "home" },
      { collection: "site_home_shop", entry: "home" },
      { collection: "site_home_blog", entry: "home" },
      { collection: "site_home_final_cta", entry: "home" },
    ],
  ],
  [
    "birth_chart",
    [{ collection: "site_birth_chart_results", entry: "results" }],
  ],
  ["transit", [{ collection: "site_transit_results", entry: "results" }]],
  [
    "account",
    [
      { collection: "site_account_empty_states", entry: "empty-states" },
      { collection: "site_account_wallet", entry: "wallet" },
    ],
  ],
  [
    "astrologers",
    [
      {
        collection: "site_astrologer_profiles",
        entry: "profiles",
      },
      {
        collection: "site_astrologers_session_setup",
        entry: "session-setup",
      },
      {
        collection: "site_astrologers_session_summary",
        entry: "session-summary",
      },
      {
        collection: "site_astrologers_chat_history",
        entry: "chat-history",
      },
    ],
  ],
  ["reports", [{ collection: "site_report_details", entry: "details" }]],
  [
    "shop",
    [
      { collection: "site_shop_catalog", entry: "catalog" },
      { collection: "site_shop_product_detail", entry: "detail" },
      { collection: "site_shop_product_descriptions", entry: "descriptions" },
      { collection: "site_shop_checkout_flow", entry: "checkout-flow" },
    ],
  ],
  [
    "daily_horoscope",
    [{ collection: "site_daily_horoscope_cta", entry: "cta" }],
  ],
  [
    "blog",
    [
      { collection: "site_blog_articles", entry: "articles" },
      { collection: "site_blog_article_bodies", entry: "bodies" },
    ],
  ],
]);

export const builderSeoFields = seoFields;
export const builderSeoFieldSet = new Set(seoFields);
export const chromeTarget = {
  collection: "site_chrome",
  entry: "main",
} as const;

const releaseTargets: BuilderReleaseTarget[] = [
  {
    collection: "site_pages",
    entry: "home",
    fields: Object.keys(getHomeCoreDefaults("en")),
  },
  {
    collection: "site_pages",
    entry: "not_found_page",
    fields: Object.keys(getHomeCoreDefaults("en")),
  },
  {
    collection: "site_home_sections",
    entry: "home",
    fields: Object.keys(getHomeSectionDefaults("en")),
  },
  {
    collection: "site_home_horoscope",
    entry: "home",
    fields: Object.keys(getHomeHoroscopeDefaults("en")),
  },
  {
    collection: "site_home_astrologers",
    entry: "home",
    fields: Object.keys(getHomeAstrologersDefaults("en")),
  },
  {
    collection: "site_home_reports",
    entry: "home",
    fields: Object.keys(getHomeReportsDefaults("en")),
  },
  {
    collection: "site_home_shop",
    entry: "home",
    fields: Object.keys(getHomeShopDefaults("en")),
  },
  {
    collection: "site_home_blog",
    entry: "home",
    fields: Object.keys(getHomeBlogDefaults("en")),
  },
  {
    collection: "site_home_final_cta",
    entry: "home",
    fields: Object.keys(getHomeFinalCtaDefaults("en")),
  },
  {
    collection: "site_todays_sky",
    entry: "todays_sky",
    fields: Object.keys(getTodaysSkyDefaults("en")),
  },
  {
    collection: "site_pages",
    entry: "terms",
    fields: Object.keys(getTermsDefaults("en")),
  },
  {
    collection: "site_faq",
    entry: "faq",
    fields: Object.keys(getFaqDefaults("en")),
  },
  {
    collection: "site_birth_chart",
    entry: "birth_chart",
    fields: Object.keys(getBirthChartDefaults("en")),
  },
  {
    collection: "site_birth_chart_results",
    entry: "results",
    fields: Object.keys(getBirthChartResultsCopy("en")),
  },
  {
    collection: "site_privacy",
    entry: "privacy",
    fields: Object.keys(getPrivacyDefaults("en")),
  },
  {
    collection: "site_transit",
    entry: "transit",
    fields: Object.keys(getTransitPrimaryDefaults("en")),
  },
  {
    collection: "site_transit_results",
    entry: "results",
    fields: Object.keys(getTransitResultsCopy("en")),
  },
  {
    collection: "site_synastry",
    entry: "synastry",
    fields: Object.keys(getSynastryDefaults("en")),
  },
  {
    collection: "site_moon_calendar",
    entry: "moon_calendar",
    fields: Object.keys(getMoonCalendarDefaults("en")),
  },
  {
    collection: "site_daily_horoscope",
    entry: "daily_horoscope",
    fields: Object.keys(getDailyHoroscopePrimaryDefaults("en")),
  },
  {
    collection: "site_daily_horoscope_cta",
    entry: "cta",
    fields: Object.keys(getDailyHoroscopePersonalizedCtaDefaults("en")),
  },
  {
    collection: "site_retrogrades",
    entry: "retrogrades",
    fields: Object.keys(getRetrogradesDefaults("en")),
  },
  {
    collection: "site_astrologers",
    entry: "astrologers",
    fields: Object.keys(getAstrologersPrimaryDefaults("en")),
  },
  {
    collection: "site_astrologer_profiles",
    entry: "profiles",
    fields: Object.keys(getAstrologerProfileDefaults("en")),
  },
  {
    collection: "site_astrologers_session_setup",
    entry: "session-setup",
    fields: Object.keys(getAstrologerSessionSetupDefaults("en")),
  },
  {
    collection: "site_astrologers_session_summary",
    entry: "session-summary",
    fields: Object.keys(getAstrologerSessionSummaryDefaults("en")),
  },
  {
    collection: "site_astrologers_chat_history",
    entry: "chat-history",
    fields: Object.keys(getAstrologerChatHistoryDefaults("en")),
  },
  {
    collection: "site_reports",
    entry: "reports",
    fields: Object.keys(getReportsDefaults("en")),
  },
  {
    collection: "site_report_details",
    entry: "details",
    fields: Object.keys(getReportsDetailDefaults("en")),
  },
  {
    collection: "site_shop",
    entry: "shop",
    fields: Object.keys(getShopDefaults("en")),
  },
  {
    collection: "site_shop_catalog",
    entry: "catalog",
    fields: Object.keys(getShopCatalogDefaults("en")),
  },
  {
    collection: "site_shop_product_detail",
    entry: "detail",
    fields: Object.keys(getShopProductDetailDefaults("en")),
  },
  {
    collection: "site_shop_product_descriptions",
    entry: "descriptions",
    fields: Object.keys(getShopProductDescriptionDefaults("en")),
  },
  {
    collection: "site_shop_checkout_flow",
    entry: "checkout-flow",
    fields: Object.keys(getShopCheckoutFlowDefaults("en")),
  },
  {
    collection: "site_glossary",
    entry: "glossary",
    fields: Object.keys(getGlossaryDefaults("en")),
  },
  {
    collection: "site_about",
    entry: "about",
    fields: Object.keys(getAboutDefaults("en")),
  },
  {
    collection: "site_blog",
    entry: "blog",
    fields: Object.keys(getBlogDefaults("en")),
  },
  {
    collection: "site_blog_articles",
    entry: "articles",
    fields: Object.keys(getBlogArticleHeaderDefaults("en")),
  },
  {
    collection: "site_blog_article_bodies",
    entry: "bodies",
    fields: Object.keys(getBlogArticleBodyDefaults("en")),
  },
  {
    collection: "site_account",
    entry: "account",
    fields: Object.keys(getAccountPrimaryDefaults("en")),
  },
  {
    collection: "site_account_empty_states",
    entry: "empty-states",
    fields: Object.keys(getAccountEmptyStateDefaults("en")),
  },
  {
    collection: "site_account_wallet",
    entry: "wallet",
    fields: Object.keys(getAccountWalletDefaults("en")),
  },
  {
    collection: "site_login",
    entry: "login",
    fields: Object.keys(getLoginDefaults("en")),
  },
  {
    collection: "site_forgot_password",
    entry: "forgot-password",
    fields: Object.keys(getForgotPasswordDefaults("en")),
  },
  {
    collection: "site_reset_password",
    entry: "reset-password",
    fields: Object.keys(getResetPasswordDefaults("en")),
  },
  {
    collection: "site_signup",
    entry: "signup",
    fields: Object.keys(getSignupDefaults("en")),
  },
  {
    collection: "site_chrome",
    entry: "main",
    fields: Object.keys(getChromeDefaults("en")),
  },
  {
    collection: "site_wallet",
    entry: "wallet",
    fields: Object.keys(getWalletDefaults("en")),
  },
];

export const getBuilderEntryConfig = (collection: string, entry: string) =>
  entryMap.get(`${collection}/${entry}`);

export const getBuilderPageTargets = (page: string): BuilderContentTarget[] => {
  const resolvedPage = pageTargets.has(page) ? page : "home";
  return [
    pageTargets.get(resolvedPage)!,
    ...(supplementalPageTargets.get(resolvedPage) ?? []),
  ];
};

export const getBuilderReleaseTargets = (): BuilderReleaseTarget[] =>
  releaseTargets.map((target) => ({
    collection: target.collection,
    entry: target.entry,
    fields: [...target.fields],
  }));

export const getBuilderFieldTarget = (field: string, page = "home") => {
  const primaryTarget = pageTargets.get(page);
  const candidateTargets = primaryTarget
    ? [primaryTarget, ...(supplementalPageTargets.get(page) ?? [])]
    : [];
  for (const pageTarget of candidateTargets) {
    const pageConfig = getBuilderEntryConfig(
      pageTarget.collection,
      pageTarget.entry,
    );
    if (pageConfig?.editableFields.some((item) => item.slug === field)) {
      return pageTarget;
    }
  }
  const target = fieldTargets.get(field);
  return target;
};

export const isBuilderEditableField = (field: string, page = "home") =>
  Boolean(getBuilderFieldTarget(field, page));

export const getBuilderFieldLabel = (field: string) => labelFor(field);
