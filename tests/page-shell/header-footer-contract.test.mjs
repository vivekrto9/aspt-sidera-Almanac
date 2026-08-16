import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");

const collectAstroPages = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectAstroPages(path);
    }
    return entry.name.endsWith(".astro") ? [path] : [];
  });

test("every Header-based visitor page renders the shared Footer", () => {
  const headerPages = collectAstroPages("src/pages").filter((path) =>
    read(path).includes("shared/Header.astro"),
  );

  assert.ok(headerPages.length > 0);
  for (const path of headerPages) {
    const source = read(path);
    assert.match(source, /import Footer from .*shared\/Footer\.astro/);
    assert.match(source, /<Footer\b/);
    assert.ok(
      source.lastIndexOf("<Footer") > source.lastIndexOf("<Header"),
      `${path} must render Footer after Header`,
    );
  }
});

test("new Footer integrations preserve localized links and chrome edit identities", () => {
  const helper = read("src/data/shared-footer-navigation.ts");

  for (const field of [
    "footer_group_charts",
    "footer_group_tools",
    "footer_group_learn",
    "footer_group_company",
    "footer_link_privacy",
    "footer_link_terms",
  ]) {
    assert.match(helper, new RegExp(`"${field}"`));
  }

  assert.match(helper, /localizePath\(path, locale\)/);
  assert.match(helper, /editAttributes\(field\)/);
  assert.match(
    helper,
    /brandEditAttributes: editAttributes\("footer_brand_name"\)/,
  );
  assert.match(
    helper,
    /descriptionEditAttributes: editAttributes\("footer_about"\)/,
  );
  assert.match(
    helper,
    /copyrightEditAttributes: editAttributes\("footer_copyright"\)/,
  );
});

test("shared Header groups Blog and Shop in the localized More menu", () => {
  const header = read("src/components/shared/Header.astro");
  const headerCopy = read("src/data/locale/shared/header.ts");
  const defaults = read("src/data/public-copy.ts");
  const migration = read("migrations/0135_header_more_label.sql");

  assert.match(headerCopy, /moreLabel: "More"/);
  assert.match(headerCopy, /blogLabel: "Blog"/);
  assert.match(headerCopy, /shopLabel: "Shop"/);
  assert.match(header, /chromeNavigationEditAttributes\("nav_more"\)/);
  assert.match(header, /chromeNavigationEditAttributes\("nav_blog"\)/);
  assert.match(header, /chromeNavigationEditAttributes\("nav_shop"\)/);
  assert.match(header, /resolvedNavigation\.splice\(blogIndex \+ 1, 0/);
  assert.match(header, /href: localizePath\("\/shop", locale\)/);
  assert.equal(
    header.match(/primaryNavigationItems\.map\(\(item\) =>/g)?.length,
    2,
    "desktop and mobile navigation must use the same primary items",
  );
  assert.equal(
    header.match(/moreNavigationItems\.map\(\(item\) =>/g)?.length,
    2,
  );
  assert.match(header, /data-header-more-trigger/);
  assert.match(header, /root\.addEventListener\("mouseenter"/);
  assert.match(header, /class="sidera-header__mobile-more"/);
  assert.match(defaults, /nav_more: header\.moreLabel/);
  assert.match(
    migration,
    /ALTER TABLE ec_site_chrome ADD COLUMN nav_more TEXT/,
  );
});

test("shared Header uses the approved 1400px desktop container", () => {
  const styles = read("src/styles/shared/header.css");

  assert.match(
    styles,
    /\.sidera-header__inner\s*\{[^}]*inline-size:\s*min\(100%, 87\.5rem\)/s,
  );
});

test("shared Header keeps the authenticated wallet utility before language on every viewport", () => {
  const header = read("src/components/shared/Header.astro");
  const styles = read("src/styles/shared/header.css");
  const copy = read("src/data/locale/shared/header.ts");
  const defaults = read("src/data/public-copy.ts");
  const migration = read("migrations/0134_header_wallet_label.sql");

  assert.equal(
    header.match(/customerSession \? \(/g)?.length,
    2,
    "desktop and mobile wallet controls must remain authenticated utilities",
  );
  assert.equal(header.match(/data-header-wallet/g)?.length, 2);
  assert.equal(header.match(/data-wallet-balance/g)?.length, 2);
  assert.match(header, /getCustomerWalletSummary/);
  assert.match(
    header,
    /const walletBalanceLabel = customerWallet\?\.balance \?\? "\$0"/,
  );
  assert.equal(
    header.match(
      /<strong data-wallet-balance aria-live="polite">\{walletBalanceLabel\}<\/strong>/g,
    )?.length,
    2,
    "desktop and mobile wallet utilities must render the empty-wallet balance",
  );

  const desktop = header.indexOf('class="sidera-header__desktop-utilities"');
  const mobile = header.indexOf(
    'class="sidera-header__mobile-quick-utilities"',
  );
  assert.ok(
    header.indexOf("data-header-wallet", desktop) <
      header.indexOf("<LanguageDropdown", desktop),
  );
  assert.ok(
    header.indexOf("data-header-wallet", mobile) <
      header.indexOf("<LanguageDropdown", mobile),
  );

  assert.match(styles, /\.sidera-header__wallet--mobile/);
  assert.match(styles, /@media \(max-width: 30rem\)/);
  assert.match(
    styles,
    /\.sidera-header__wallet--mobile \.sidera-header__wallet-label/,
  );
  assert.match(copy, /walletLabel: "Wallet"/);
  assert.match(defaults, /header_wallet_label: header\.walletLabel/);
  assert.match(
    migration,
    /ALTER TABLE ec_site_chrome ADD COLUMN header_wallet_label TEXT/,
  );
});
