import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("Account removes the Sessions menu and Past readings UI", () => {
  const page = read("src/pages/account.astro");
  const shell = read(
    "src/components/account/sections/AccountShellNavigation.astro",
  );
  const styles = read(
    "src/styles/account/sections/account-shell-navigation.css",
  );

  assert.doesNotMatch(
    page,
    /AccountSessions|account_nav_sessions_label|id="sessions"/,
  );
  assert.doesNotMatch(shell, /"sessions"/);
  assert.doesNotMatch(styles, /data-account-section-link="sessions"/);
});

test("Past readings collection URL redirects back to Account", () => {
  const route = read("src/pages/account/[collection].astro");
  assert.match(
    route,
    /collection !== "charts" && collection !== "people" && collection !== "orders"/,
  );
  assert.match(route, /Astro\.redirect\("\/account", 302\)/);
  assert.doesNotMatch(
    route,
    /AccountSessions|account_sessions_|collection === "sessions"/,
  );
});

test("Upcoming scheduled session stays removed from Account Overview", () => {
  const page = read("src/pages/account.astro");
  assert.doesNotMatch(page, /listScheduledSessions/);
  assert.doesNotMatch(page, /prepareUpcomingAccountSession/);
  assert.doesNotMatch(page, /scheduledSessions/);
  assert.doesNotMatch(
    page,
    /listAstrologyChatSessions|prepareAccountSessionsFromRuntime/,
  );
});
