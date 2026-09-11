// Run against the built Worker (`pnpm run build && pnpm run wrangler:dev`).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createBrowserCli, verifyPublicCurrencySurfaces } from "./currency-surface-checks.mjs";

const baseUrl = process.env.CURRENCY_WORKER_BASE_URL || "http://127.0.0.1:4331";
const autoCurrency = process.env.CURRENCY_WORKER_AUTO_CURRENCY || "INR";
const output = "output/playwright/currency-matrix";
mkdirSync(output, { recursive: true });
let revision = 200;
const setPreference = (value) => execFileSync("pnpm", ["exec", "wrangler", "d1", "execute", "sidera-almanac-site", "--local", "--command", `UPDATE ap_business_settings SET value_json=json_object('value','${value}','schemaVersion',1,'revision',${revision++}) WHERE key='payment_preference'`], { stdio: "ignore" });

const cli = createBrowserCli("sidera-currency-worker");
const results = [];
try {
  cli.open(baseUrl);
  for (const [preference, currency] of [["INR", "INR"], ["USD", "USD"], ["AUTO", autoCurrency]]) {
    console.log(`Checking built Worker ${preference} -> ${currency}`);
    setPreference(preference);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const surfaces = verifyPublicCurrencySurfaces(cli, baseUrl, currency, `${output}/${preference.toLowerCase()}.png`);
    results.push({ preference, country: preference === "AUTO" ? "Wrangler request.cf local fixture" : "override", currency, surfaces, status: "PASS" });
  }
  writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log("PASS: built Worker currency browser (3 scenarios)");
} finally {
  setPreference("AUTO");
  cli.close();
}
