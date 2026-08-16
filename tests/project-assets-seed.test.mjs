import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("D1 asset seeding relies on Wrangler's execute batch transaction", () => {
  const seedScript = readFileSync(
    new URL("scripts/seed-template-project-assets.mjs", root),
    "utf8",
  );

  assert.doesNotMatch(seedScript, /BEGIN(?:\s+TRANSACTION)?;|COMMIT;/i);
  assert.match(seedScript, /'d1',\s*'execute'/s);
});

test("asset seeding supports local and remote Wrangler environments safely", () => {
  const source = readFileSync(
    new URL("../scripts/seed-template-project-assets.mjs", import.meta.url),
    "utf8",
  );

  assert.match(source, /maxAttempts\s*=\s*4/);
  assert.match(source, /attempt\s*<=\s*maxAttempts/);
  assert.match(source, /Math\.min\(4_000/);
  assert.match(source, /\['local', 'preview', 'production'\]/);
  assert.match(source, /isLocal\s*\?\s*1\s*:\s*4/);
  assert.match(source, /isLocal\s*\?\s*'--local'\s*:\s*'--remote'/);
  assert.match(source, /releaseEnvironment\s*=\s*isLocal\s*\?\s*'preview'\s*:\s*environment/);
  assert.doesNotMatch(source, /console\.(?:warn|error)\([^\n]*args/);
});
