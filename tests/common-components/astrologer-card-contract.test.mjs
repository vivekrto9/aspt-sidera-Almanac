import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/AstrologerCard.astro",
  import.meta.url,
);
const stylesPath = new URL(
  "../../src/styles/shared/astrologer-card.css",
  import.meta.url,
);

test("AstrologerCard composes approved identity, rating, and action components", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.match(source, /import ProfileSummary from "\.\/ProfileSummary\.astro"/);
  assert.match(source, /import RatingSummary from "\.\/RatingSummary\.astro"/);
  assert.match(source, /<ProfileSummary/);
  assert.match(source, /<RatingSummary/);
  assert.match(source, /<Button/);
  assert.match(source, /<article id=\{id\}/);
});

test("AstrologerCard keeps prepared profile and commerce copy localizable", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /name: string/);
  assert.match(source, /tradition: string/);
  assert.match(source, /availabilityLabel: string/);
  assert.match(source, /ratingText: string/);
  assert.match(source, /ratingAriaLabel: string/);
  assert.match(source, /rateText: string/);
  assert.match(source, /reviewText\?: string/);
  assert.match(source, /specialties\?: string\[\]/);
  assert.match(source, /actionLabel\?: string/);
  assert.match(source, /descriptionEditAttributes/);
  assert.match(source, /nameEditAttributes/);
  assert.match(source, /traditionEditAttributes/);
  assert.match(source, /availabilityEditAttributes/);
  assert.match(source, /ratingEditAttributes/);
  assert.match(source, /actionEditAttributes/);
  assert.match(source, /actionButtonAttributes/);
  assert.match(source, /statusLabelEditAttributes=\{availabilityEditAttributes\}/);
  assert.match(source, /editAttributes=\{actionEditAttributes\}/);
  assert.match(source, /\.\.\.actionButtonAttributes/);
});

test("AstrologerCard models availability as one card state", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /type CardVariant = "compact" \| "detailed"/);
  assert.match(source, /type Availability = "online" \| "busy" \| "offline"/);
  assert.match(source, /sidera-astrologer-card--\$\{availability\}/);
  assert.match(source, /statusTone/);
  assert.match(source, /availability === "online" \? "primary" : "secondary"/);
  assert.doesNotMatch(source, /<script/);
});

test("AstrologerCard styles reference layout and accessible responsive states", async () => {
  const styles = await readFile(stylesPath, "utf8");

  assert.match(styles, /var\(--color-panel\)/);
  assert.match(styles, /var\(--color-panel\)/);
  assert.match(styles, /var\(--color-success\)/);
  assert.match(styles, /#c8973f/);
  assert.match(styles, /var\(--color-muted-soft\)/);
  assert.match(styles, /max-inline-size: 24rem/);
  assert.match(styles, /max-inline-size: 18rem/);
  assert.match(styles, /flex-wrap: wrap/);
  assert.match(styles, /flex: 1 0 14rem/);
  assert.match(styles, /flex: none/);
  assert.match(styles, /inline-size: 100%/);
  assert.match(styles, /flex: 1 1 0/);
  assert.match(styles, /\.sidera-astrologer-card--compact/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 40rem\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
