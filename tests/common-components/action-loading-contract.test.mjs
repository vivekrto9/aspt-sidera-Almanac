import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const helperPath = new URL(
  "../../src/scripts/action-loading.ts",
  import.meta.url,
);

test("API action loading uses one reversible accessible client contract", async () => {
  const source = await readFile(helperPath, "utf8");

  assert.match(source, /export const setActionLoading/);
  assert.match(source, /action\.dataset\.loading = "true"/);
  assert.match(source, /action\.setAttribute\("aria-busy", "true"\)/);
  assert.match(source, /action\.disabled = true/);
  assert.match(source, /action\.setAttribute\("aria-disabled", "true"\)/);
  assert.match(source, /action\.tabIndex = -1/);
  assert.match(source, /action\.dataset\.loading = "false"/);
  assert.match(source, /delete action\.dataset\[IDLE_LABEL_KEY\]/);
});
