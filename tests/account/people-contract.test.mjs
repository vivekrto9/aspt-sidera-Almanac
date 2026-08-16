import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Account People matches the four-person reference hierarchy", () => {
  const component = read("src/components/account/sections/AccountPeople.astro");
  const grid = read("src/components/account/shared/AccountPeopleGrid.astro");
  const data = read("src/data/account/people.ts");
  const page = read("src/pages/account.astro");

  assert.match(component, /id="people"/);
  assert.match(component, /props\.people\.length \? props\.viewAllLabel : undefined/);
  assert.match(component, /props\.people\.slice\(0, 4\)/);
  assert.match(grid, /props\.people\.map/);
  assert.match(grid, /<Button/);
  assert.match(grid, /import ChartWheel from "\.\.\/\.\.\/shared\/ChartWheel\.astro"/);
  assert.match(grid, /import Badge from "\.\.\/\.\.\/shared\/Badge\.astro"/);
  assert.match(grid, /<ChartWheel/);
  assert.match(grid, /mode="natal"/);
  assert.match(grid, /showAspects=\{false\}/);
  assert.match(grid, /person\.birthChart\.rotation/);
  assert.match(grid, /person\.birthChart\.planets/);
  assert.match(grid, /person\.generateBirthChartHref/);
  assert.match(grid, /class="account-people__chart account-people__chart--empty"/);
  assert.match(grid, /ariaLabel=\{`\$\{props\.generateBirthChartLabel\}: \$\{person\.name\}`\}/);
  assert.doesNotMatch(grid, /decorativeChartPlanetsFor|chartLongitudes/);
  assert.doesNotMatch(grid, /account-people__avatar|person\.glyph/);
  assert.match(grid, /person\.isOwnProfile/);
  assert.match(grid, /account_people_own_profile_label/);
  assert.match(grid, /profileId=\$\{encodeURIComponent\(profileId\)\}/);
  assert.match(grid, /account_people_synastry_label/);
  for (const person of ["Devin R.", "Sam K.", "Noor A.", "Eli M."]) {
    assert.match(data, new RegExp(person.replace(".", "\\.")));
  }
  assert.match(page, /<AccountPeople/);
  assert.match(page, /listCustomerUserProfiles/);
  assert.match(page, /prepareAccountPeopleFromProfiles/);
});

test("Account People is responsive and leaves shared components untouched", () => {
  const styles = read("src/styles/account/sections/account-people.css");

  assert.match(styles, /repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 68rem\)/);
  assert.match(styles, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.account-people__chart \.chart-wheel/);
  assert.match(styles, /--sidera-button-hover-background: #e6dbcd/);
  assert.match(
    styles,
    /\.account-people__chart \{[\s\S]*?margin-block-start: 1\.125rem/,
  );
  assert.doesNotMatch(styles, /\.account-people__profile-badge \+ \.account-people__chart/);
  assert.doesNotMatch(
    styles,
    /\.account-people__card \.account-people__chart--empty[\s\S]*?margin-block-start: 0/,
  );
  assert.doesNotMatch(styles, /\.account-people__chart--linked:hover/);
  assert.doesNotMatch(styles, /account-people__avatar/);
});

test("Account People copy and migration cover seven locales", () => {
  const locale = read("src/data/locale/account/sections/people.ts");
  const defaults = read("src/data/public-copy.ts");
  const page = read("src/pages/account.astro");
  const migration = read("migrations/0100_account_people_content.sql");
  const profileBadgeMigration = read("migrations/0122_account_people_profile_badge.sql");
  const birthChartActionMigration = read("migrations/0124_account_people_birth_chart_action.sql");

  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  }
  for (const field of [
    "account_people_eyebrow",
    "account_people_title",
    "account_people_synastry_label",
    "account_people_own_profile_label",
    "account_people_generate_birth_chart_label",
  ]) {
    assert.match(defaults, new RegExp(field));
    assert.match(`${migration}\n${profileBadgeMigration}\n${birthChartActionMigration}`, new RegExp(`ADD COLUMN ${field} TEXT`));
  }
  assert.match(locale, /synastryLabel: "Check synastry"/);
  assert.match(locale, /ownProfileLabel: "Your profile"/);
  assert.match(locale, /generateBirthChartLabel: "Generate birth chart"/);
  assert.match(page, /runtimeCharts\?\.items/);
});

test("Account People joins ready readings by profile without fabricating chart data", () => {
  const data = read("src/data/account/people.ts");
  const collectionPage = read("src/pages/account/[collection].astro");

  assert.match(data, /item\.profileId === profile\.id/);
  assert.match(data, /profile\.createdAt === profile\.updatedAt/);
  assert.match(data, /Date\.parse\(item\.generatedAt\) >= Date\.parse\(profile\.updatedAt\)/);
  assert.match(data, /reading\.chart\.planets\.map/);
  assert.match(data, /birthChart: reading/);
  assert.match(data, /profileId/);
  assert.match(collectionPage, /collection === "charts" \|\| collection === "people"/);
  assert.match(collectionPage, /runtimeCharts\?\.items/);
});
