const hasTable = (sqlite, table) => Boolean(sqlite.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(table));
const columns = (sqlite, table) => new Set(sqlite.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name));
const add = (sqlite, table, definition) => { const name = definition.split(" ")[0]; if (hasTable(sqlite, table) && !columns(sqlite, table).has(name)) sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`); };

export const applyPaymentTestSchema = (sqlite) => {
  if (hasTable(sqlite, "ap_business_settings")) {
    sqlite.prepare("INSERT OR REPLACE INTO ap_business_settings(key,value_json,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)").run("payment_preference", JSON.stringify({ value: "USD", schemaVersion: 1, revision: 1 }));
    sqlite.prepare("INSERT OR REPLACE INTO ap_business_settings(key,value_json,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)").run("session_pricing", JSON.stringify({ USD: { voiceAddonCents: 60, videoAddonCents: 120, writtenCents: 1900 }, INR: { voiceAddonCents: 4900, videoAddonCents: 9900, writtenCents: 149900 } }));
    sqlite.prepare("INSERT OR REPLACE INTO ap_business_settings(key,value_json,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)").run("wallet_pricing", JSON.stringify({ USD: { minimumCents: 2000, maximumCents: 500000, offers: [{ id: "wl_100", amountCents: 10000, creditCents: 10000, bonusCents: 0 }, { id: "wl_250", amountCents: 25000, creditCents: 26500, bonusCents: 1500 }, { id: "wl_500", amountCents: 50000, creditCents: 55000, bonusCents: 5000 }, { id: "wl_1000", amountCents: 100000, creditCents: 115000, bonusCents: 15000 }] }, INR: { minimumCents: 19900, maximumCents: 5000000, offers: [] } }));
  }
  for (const table of ["ap_report_products", "ap_shop_products"]) {
    add(sqlite, table, "price_usd_cents INTEGER"); add(sqlite, table, "price_inr_cents INTEGER");
    if (hasTable(sqlite, table)) sqlite.exec(`UPDATE ${table} SET price_usd_cents=price_cents,price_inr_cents=1`);
  }
  add(sqlite, "ap_astrologers", "rate_usd_cents INTEGER"); add(sqlite, "ap_astrologers", "rate_inr_cents INTEGER");
  if (hasTable(sqlite, "ap_astrologers")) {
    sqlite.exec("UPDATE ap_astrologers SET rate_usd_cents=rate_cents,rate_inr_cents=1");
    sqlite.exec("CREATE TRIGGER IF NOT EXISTS test_astrologer_price_insert AFTER INSERT ON ap_astrologers BEGIN UPDATE ap_astrologers SET rate_usd_cents=NEW.rate_cents,rate_inr_cents=COALESCE(NEW.rate_inr_cents,1) WHERE id=NEW.id; END");
  }
  add(sqlite, "ap_wallets", "currency_locked_at TEXT");
};
