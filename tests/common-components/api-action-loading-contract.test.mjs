import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("direct API CTAs use the shared loading action contract", async () => {
  const files = [
    "src/components/account/sections/AccountSettings.astro",
    "src/components/account/sections/AccountShellNavigation.astro",
    "src/components/astrologers/sections/AstrologerLiveSession.astro",
    "src/components/astrologers/sections/AstrologerSessionSetup.astro",
    "src/components/auth/sections/AuthForgotPasswordForm.astro",
    "src/components/auth/sections/AuthLoginForm.astro",
    "src/components/auth/sections/AuthResetPasswordForm.astro",
    "src/components/auth/sections/AuthSignupForm.astro",
    "src/components/reports/sections/ReportsDetailPanel.astro",
    "src/components/shop/sections/ShopCheckout.astro",
    "src/pages/lead-generation-demo.astro",
  ];

  for (const file of files) {
    const source = await readSource(file);
    assert.match(
      source,
      /setActionLoading/,
      `${file} uses the shared client state`,
    );
    assert.match(
      source,
      /(?:actionLoading|loading)=\{false\}/,
      `${file} renders the shared spinner`,
    );
  }
});

test("API-driven page transitions keep their dedicated shared loading UI", async () => {
  const birthChart = await readSource(
    "src/components/birth-chart/BirthChartExperience.astro",
  );
  const dailyHoroscope = await readSource(
    "src/components/daily-horoscope/sections/DailyHoroscopeReading.astro",
  );

  assert.match(birthChart, /data-birth-chart-casting/);
  assert.match(birthChart, /casting\.hidden = false/);
  assert.match(dailyHoroscope, /import LoadingIndicator/);
  assert.match(dailyHoroscope, /data-daily-horoscope-loading/);
  assert.match(dailyHoroscope, /data-loading", "true"/);
});
