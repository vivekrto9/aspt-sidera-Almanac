import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/Toast.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/toast.css",
  import.meta.url,
);

test("Toast keeps visible status and dismissal copy caller-prepared", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /message: string/);
  assert.match(source, /dismissLabel: string/);
  assert.match(source, /titleEditAttributes/);
  assert.match(source, /messageEditAttributes/);
  assert.doesNotMatch(source, /actionLabel|sidera:toast-action/);
  assert.doesNotMatch(source, /Astro\.currentLocale|translations/);
});

test("Toast exposes accessible polite and assertive feedback semantics", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type ToastTone = "neutral" \| "success" \| "error"/);
  assert.match(source, /tone === "error" \? "alert" : "status"/);
  assert.match(source, /tone === "error" \? "assertive" : "polite"/);
  assert.match(source, /aria-atomic="true"/);
  assert.match(source, /aria-describedby=\{messageId\}/);
  assert.match(source, /aria-label=\{dismissLabel\}/);
});

test("Toast supports dismissal and paused auto-hide", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /data-duration=\{durationMs\}/);
  assert.match(source, /durationMs > 0 \? \(/);
  assert.match(source, /class="sidera-toast__progress"/);
  assert.match(source, /sidera:toast-dismiss/);
  assert.match(source, /dismissButton\?\.addEventListener\("click"/);
  assert.match(source, /progress\?\.addEventListener\("animationend"/);
  assert.match(source, /toast\.addEventListener\("pointerenter", pause\)/);
  assert.match(source, /toast\.addEventListener\("focusin", pause\)/);
});

test("Toast preserves Warm Modern placement and responsive safeguards", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /inline-size: min\(24rem, calc\(100vw - 2rem\)\)/);
  assert.match(source, /border-inline-start: 0\.25rem solid var\(--toast-accent\)/);
  assert.match(source, /\.sidera-toast--success/);
  assert.match(source, /\.sidera-toast--error/);
  assert.match(source, /inline-size: 2\.75rem/);
  assert.match(source, /@keyframes sidera-toast-progress/);
  assert.match(source, /animation: sidera-toast-progress var\(--toast-duration\) linear forwards/);
  assert.match(source, /animation-play-state: paused/);
  assert.match(source, /@media \(max-width: 40rem\)/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /@media \(forced-colors: active\)/);
});
