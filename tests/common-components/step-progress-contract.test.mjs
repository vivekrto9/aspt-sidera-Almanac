import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/StepProgress.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/step-progress.css",
  import.meta.url,
);

test("StepProgress renders prepared step copy without duplicating the localized total", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /current: number/);
  assert.match(source, /total: number/);
  assert.match(source, /stepLabel: string/);
  assert.match(source, /ofLabel: string/);
  assert.match(source, /ariaLabel = `\$\{stepLabel\} \$\{current\} \$\{ofLabel\}`/);
  assert.doesNotMatch(source, /\{total\}<\/span>|step-progress__dots|step-progress__dot/);
  assert.match(source, /current > total/);
});

test("StepProgress exposes accessible and exactly editable prepared labels", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /role="group"/);
  assert.match(source, /aria-label=\{ariaLabel\}/);
  assert.match(source, /stepLabelEditAttributes/);
  assert.match(source, /ofLabelEditAttributes/);
  assert.match(source, /aria-hidden="true"/);
});

test("StepProgress retains a compact responsive-safe chip treatment", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: fit-content/);
  assert.match(source, /max-inline-size: 100%/);
  assert.match(source, /border-radius: 999px/);
  assert.match(
    source,
    /background: rgba\(var\(--color-primary-rgb\), 0\.07\)/,
  );
  assert.match(source, /white-space: nowrap/);
  assert.doesNotMatch(source, /step-progress__dot/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
