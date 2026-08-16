import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Account Saved charts matches the four-card reference hierarchy", () => {
  const component = read(
    "src/components/account/sections/AccountSavedCharts.astro",
  );
  const grid = read(
    "src/components/account/shared/AccountSavedChartGrid.astro",
  );
  const data = read("src/data/account/saved-charts.ts");
  const page = read("src/pages/account.astro");

  assert.match(component, /id="charts"/);
  assert.match(component, /props\.charts\.length \? props\.viewAllLabel : undefined/);
  assert.match(component, /props\.charts\.slice\(0, 4\)/);
  assert.match(grid, /<ChartWheel/);
  assert.match(grid, /props\.charts\.map/);
  assert.match(grid, /variant="link"/);
  assert.match(data, /My Natal Chart/);
  assert.match(data, /Relocated · Lisbon/);
  assert.match(data, /Mom's Natal/);
  assert.match(data, /2026 Solar Return/);
  assert.match(page, /<AccountSavedCharts/);
});

test("Account Saved charts is responsive and leaves shared components untouched", () => {
  const styles = read("src/styles/account/sections/account-saved-charts.css");
  const component = read(
    "src/components/account/sections/AccountSavedCharts.astro",
  );
  const grid = read(
    "src/components/account/shared/AccountSavedChartGrid.astro",
  );

  assert.match(styles, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 68rem\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(grid, /class="account-saved-charts__wheel"/);
  assert.match(grid, /account_saved_charts_open_label/);
  assert.match(grid, /account_saved_charts_report_label/);
  assert.match(grid, /class="account-saved-charts__open"/);
  assert.match(grid, /class="account-saved-charts__report"/);
  assert.match(grid, /class="account-saved-charts__card-link"/);
  assert.match(grid, /href=\{chart\.href \|\| props\.openHref\}/);
  assert.match(grid, /aria-label=\{`\$\{props\.openLabel\}: \$\{chart\.title\}`\}/);
  assert.match(styles, /\.account-saved-charts__card-link\s*\{/);
  assert.match(styles, /inset: 0/);
  assert.match(styles, /transform: scale\(1\.015\)/);
  assert.match(styles, /\.account-saved-charts__actions\s*\{[\s\S]*z-index: 2/);
  assert.doesNotMatch(styles, /\.account-saved-charts__open::after/);
});

test("Account Saved charts copy and migration cover seven locales", () => {
  const locale = read("src/data/locale/account/sections/saved-charts.ts");
  const migration = read("migrations/0083_account_saved_charts_content.sql");

  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  }

  for (const field of [
    "account_saved_charts_eyebrow",
    "account_saved_charts_title",
    "account_saved_charts_type_1",
    "account_saved_charts_type_2",
    "account_saved_charts_type_3",
    "account_saved_charts_type_4",
    "account_saved_charts_open_label",
    "account_saved_charts_report_label",
  ]) {
    assert.match(migration, new RegExp(`ADD COLUMN ${field} TEXT`));
  }
});
