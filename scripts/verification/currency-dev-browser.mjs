// Run against an actual `astro dev` instance. The optional Tunnel URL verifies
// Cloudflare's real DEV forwarding headers without trusting spoofed localhost headers.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createBrowserCli, verifyPublicCurrencySurfaces } from "./currency-surface-checks.mjs";

const baseUrl = process.env.CURRENCY_DEV_BASE_URL || "http://127.0.0.1:4321";
const tunnelUrl = process.env.CURRENCY_DEV_TUNNEL_URL;
const output = "output/playwright/currency-dev-script";
mkdirSync(output, { recursive: true });
const preferenceResult = JSON.parse(execFileSync("pnpm", ["exec", "wrangler", "d1", "execute", "sidera-almanac-site", "--local", "--command", "SELECT value_json FROM ap_business_settings WHERE key='payment_preference'", "--json"], { encoding: "utf8" }));
const originalSetting = JSON.parse(preferenceResult[0]?.results?.[0]?.value_json || "{}");
if (!["USD", "INR", "AUTO"].includes(originalSetting.value) || !Number.isSafeInteger(originalSetting.revision)) throw new Error("Stored payment preference is unavailable.");
let revision = originalSetting.revision + 1;
const setPreference = (value) => execFileSync("pnpm", ["exec", "wrangler", "d1", "execute", "sidera-almanac-site", "--local", "--command", `UPDATE ap_business_settings SET value_json=json_object('value','${value}','schemaVersion',1,'revision',${revision++}) WHERE key='payment_preference'`], { stdio: "ignore" });

const cli = createBrowserCli("sidera-currency-dev");
const results = [];
try {
  cli.open(baseUrl);
  for (const [preference, currency] of [["INR", "INR"], ["USD", "USD"], ["AUTO", "USD"]]) {
    console.log(`Checking Astro DEV ${preference} -> ${currency}`);
    setPreference(preference);
    const surfaces = verifyPublicCurrencySurfaces(cli, baseUrl, currency, `${output}/${preference.toLowerCase()}-localhost.png`);
    results.push({ preference, country: "localhost-unknown", currency, surfaces, status: "PASS" });
  }
  if (tunnelUrl) {
    console.log("Checking Astro DEV AUTO + real India Tunnel -> INR");
    setPreference("AUTO");
    const surfaces = verifyPublicCurrencySurfaces(cli, tunnelUrl, "INR", `${output}/auto-india-tunnel.png`);
    results.push({ preference: "AUTO", country: "IN via Cloudflare Tunnel", currency: "INR", surfaces, status: "PASS" });
  }
  writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(`PASS: Astro DEV currency browser (${results.length} scenarios)`);
} finally {
  setPreference(originalSetting.value);
  cli.close();
}
