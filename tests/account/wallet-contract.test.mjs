import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Account exposes My wallet as a real hash section backed by wallet runtime data", async () => {
  const [page, shell, component] = await Promise.all([
    read("src/pages/account.astro"),
    read("src/components/account/sections/AccountShellNavigation.astro"),
    read("src/components/account/sections/AccountWallet.astro"),
  ]);

  assert.match(page, /\["wallet", "account_nav_wallet_label"\]/);
  assert.match(page, /getCustomerWalletSummary/);
  assert.match(page, /listWalletTransactionsPage/);
  assert.match(page, /const accountWalletRecentTransactionLimit = 4/);
  assert.match(page, /pageSize: accountWalletRecentTransactionLimit/);
  assert.match(page, /<AccountWallet/);
  assert.match(shell, /"overview", "wallet", "charts"/);
  assert.match(component, /<section id="wallet"/);
  assert.match(component, /data-wallet-balance/);
  assert.match(component, /props\.transactions\.totalItems/);
  assert.match(component, /props\.transactions\.items\.slice\(0, 4\)/);
  assert.match(component, /recentTransactions\.map/);
  assert.match(component, /href=\{props\.historyHref\}/);
  assert.match(component, /variant="primary"/);
  assert.match(component, /variant="secondary"/);
});

test("Account wallet copy is localized and physically registered for Content Studio", async () => {
  const [locale, defaults, migration, styles] = await Promise.all([
    read("src/data/locale/account/sections/wallet.ts"),
    read("src/data/public-copy.ts"),
    read("migrations/0141_account_wallet_content.sql"),
    read("src/styles/account/sections/account-wallet.css"),
  ]);

  for (const code of ["en", "es", "fr", "pt", "ru", "it", "de"]) {
    assert.match(locale, new RegExp(`\\b${code}: \\{`));
  }
  for (const field of [
    "nav_wallet_label",
    "wallet_eyebrow",
    "wallet_title",
    "wallet_description",
    "wallet_entries_label",
    "wallet_available_label",
    "wallet_usage",
    "wallet_add_label",
    "wallet_browse_label",
    "wallet_history_label",
    "wallet_balance_after_label",
    "wallet_credit_fallback",
    "wallet_debit_fallback",
    "wallet_empty_title",
    "wallet_empty_description",
  ]) {
    assert.match(defaults, new RegExp(`account_${field}`));
    assert.match(migration, new RegExp(`account_${field} TEXT`));
  }
  assert.match(migration, /CREATE TABLE IF NOT EXISTS ec_site_account_wallet/);
  assert.match(await read("src/builder/registry.ts"), /site_account_wallet/);
  assert.match(styles, /background: var\(--color-panel\)/);
  assert.match(styles, /border: 1px solid rgba\(var\(--color-text-rgb\), 0\.1\)/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
});
