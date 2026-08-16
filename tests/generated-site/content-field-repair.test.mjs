import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const endpointPath = new URL(
  "../../src/pages/api/astropages/generated-site/editor/content-field.ts",
  import.meta.url,
);

test("Content Studio repairs structured EmDash update failures before rejecting a migrated field", async () => {
  const source = await readFile(endpointPath, "utf8");

  const preUpdateRepair = source.indexOf(
    'bootstrapAstroPagesEmDashContent({ env, mode: "auto" })',
  );
  const firstUpdate = source.indexOf("updated = await updateItem(item.id)");
  assert.notEqual(preUpdateRepair, -1);
  assert.ok(
    preUpdateRepair < firstUpdate,
    "changed registry metadata must be repaired before the first EmDash update",
  );
  assert.match(source, /if \(!contentItem\(updated\)\)/);
  assert.match(
    source,
    /bootstrapAstroPagesEmDashContent\(\{ env, mode: "full" \}\)/,
  );
  assert.equal(
    source.match(
      /bootstrapAstroPagesEmDashContent\(\{ env, mode: "full" \}\)/g,
    )?.length,
    2,
    "missing entries and failed updates must both force a complete repair",
  );
  assert.match(source, /updated = await updateItem\(repairedItem\.id\)/);
  assert.match(source, /const updatedItem = contentItem\(updated\)/);
});
