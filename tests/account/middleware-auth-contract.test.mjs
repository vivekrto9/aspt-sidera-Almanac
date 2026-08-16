import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  getAccountLoginRedirect,
  isProtectedAccountPath,
} from "../../src/server/aggregator/account-access.ts";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Account access recognizes only the Account route family", () => {
  assert.equal(isProtectedAccountPath("/account"), true);
  assert.equal(isProtectedAccountPath("/account/"), true);
  assert.equal(isProtectedAccountPath("/account/charts"), true);
  assert.equal(isProtectedAccountPath("/account/orders"), true);
  assert.equal(isProtectedAccountPath("/accounting"), false);
  assert.equal(isProtectedAccountPath("/login"), false);
});

test("Account login redirects preserve locale and a same-origin next path", () => {
  assert.equal(
    getAccountLoginRedirect(
      new URL("https://sidera.test/account/charts?page=2"),
    ),
    "/login?next=%2Faccount%2Fcharts%3Fpage%3D2",
  );
  assert.equal(
    getAccountLoginRedirect(
      new URL("https://sidera.test/account/orders?locale=de&page=2"),
    ),
    "/login?locale=de&next=%2Faccount%2Forders%3Flocale%3Dde%26page%3D2",
  );
});

test("middleware rejects unauthenticated Account requests before rendering", async () => {
  const source = await read("src/middleware.ts");

  assert.match(source, /accountAuthMiddleware = defineMiddleware/);
  assert.match(source, /isProtectedAccountPath\(context\.url\.pathname\)/);
  assert.match(source, /getCustomerSession\(/);
  assert.match(
    source,
    /context\.redirect\(getAccountLoginRedirect\(context\.url\), 302\)/,
  );
  assert.match(
    source,
    /sequence\(\s*accountAuthMiddleware,\s*emdashMiddleware,\s*astropagesContentReleaseMiddleware,\s*publicSeoMiddleware/s,
  );
  assert.match(source, /isBuilderPreviewRequest\(context\)/);
  assert.match(source, /requireBuilderAccess\(/);
});
