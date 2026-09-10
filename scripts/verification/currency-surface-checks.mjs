import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";

export const surfacePrices = {
  USD: {
    report: "$29",
    shop: "$48",
    astrologers: ["$10.00", "$5.00"],
  },
  INR: {
    report: "₹2,499",
    shop: "₹3,999",
    astrologers: ["₹150.00", "₹100.00"],
  },
};

export const createBrowserCli = (session) => {
  const executable = join(homedir(), ".codex/skills/playwright/scripts/playwright_cli.sh");
  const run = (...args) => execFileSync(executable, ["--session", session, ...args], { encoding: "utf8" });
  return { run, open: (url) => run("open", url), close: () => run("close") };
};

export function verifyPublicCurrencySurfaces(cli, baseUrl, currency, screenshot) {
  const expected = surfacePrices[currency];
  assert.ok(expected, `Unsupported verification currency: ${currency}`);
  const results = {};
  for (const [name, path, prices] of [
    ["report", "/reports/natal-blueprint", [expected.report]],
    ["shopCatalog", "/shop", [expected.shop]],
    ["shopDetail", "/shop/natal-print", [expected.shop]],
    ["astrologers", "/astrologers", expected.astrologers],
  ]) {
    cli.run("goto", new URL(path, baseUrl).href);
    const body = cli.run("eval", "() => document.body.innerText");
    for (const price of prices) assert.ok(body.includes(price), `${name} is missing ${price}`);
    const wrongSymbol = currency === "INR" ? "$" : "₹";
    assert.equal(body.includes(wrongSymbol), false, `${name} contains a mixed-currency symbol`);
    results[name] = prices;
  }
  cli.run("screenshot", `--filename=${screenshot}`, "--full-page");
  return results;
}
