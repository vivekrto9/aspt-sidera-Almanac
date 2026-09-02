import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("shared layout installs consent-gated active-provider analytics", () => {
  const layout = read("src/layouts/BaseLayout.astro");
  const client = read("src/scripts/visitor-analytics.ts");
  const consentSources = [layout, ...readdirSync(new URL("../src/styles/", import.meta.url)).filter((name) => name.endsWith(".css")).map((name) => read(`src/styles/${name}`))].join("\n");
  assert.match(layout, /getPublicAnalyticsConfig/);
  assert.match(layout, /data-analytics-config/);
  assert.match(layout, /visitor-analytics\.ts/);
  assert.match(consentSources, /position:\s*fixed/);
  assert.match(client, /consent\(\)/);
  assert.match(client, /config\.provider === "posthog"/);
  assert.match(client, /ga4_measurement_protocol|ga4/);
  assert.doesNotMatch(client, /ASTROPAGES_TEST_ANALYTICS_ENABLED|phc_[a-z0-9]+/i);
});
