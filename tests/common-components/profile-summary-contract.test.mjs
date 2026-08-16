import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentPath = new URL(
  "../../src/components/shared/ProfileSummary.astro",
  import.meta.url,
);
const stylesheetPath = new URL(
  "../../src/styles/shared/profile-summary.css",
  import.meta.url,
);

test("ProfileSummary composes the approved identity atoms", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /import Avatar from "\.\/Avatar\.astro"/);
  assert.match(source, /import Badge from "\.\/Badge\.astro"/);
  assert.match(source, /import RatingStars from "\.\/RatingStars\.astro"/);
  assert.match(source, /import StatusDot from "\.\/StatusDot\.astro"/);
  assert.match(source, /<Avatar/);
  assert.match(source, /<RatingStars/);
  assert.match(source, /<StatusDot/);
  assert.match(source, /<Badge/);
});

test("ProfileSummary keeps structure shared across content variants", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /"horizontal" \| "stacked"/);
  assert.match(source, /"default" \| "inverse"/);
  assert.match(source, /avatarSrc\?: string/);
  assert.match(source, /statusLabel\?: string/);
  assert.match(source, /ratingValue\?: number/);
  assert.match(source, /badgeLabel\?: string/);
  assert.match(source, /Astro\.slots\.has\("meta"\)/);
});

test("ProfileSummary forwards opt-in exact-node Content Studio attributes", async () => {
  const source = await readFile(componentPath, "utf8");

  assert.match(source, /nameEditAttributes\?: EditAttributes/);
  assert.match(source, /subtitleEditAttributes\?: EditAttributes/);
  assert.match(source, /statusLabelEditAttributes\?: EditAttributes/);
  assert.match(
    source,
    /class="sidera-profile-summary__name" \{\.\.\.nameEditAttributes\}/,
  );
  assert.match(
    source,
    /class="sidera-profile-summary__subtitle" \{\.\.\.subtitleEditAttributes\}/,
  );
  assert.match(source, /editAttributes=\{statusLabelEditAttributes\}/);
});

test("ProfileSummary styles preserve responsive localized identity copy", async () => {
  const source = await readFile(stylesheetPath, "utf8");

  assert.match(source, /\.sidera-profile-summary--horizontal/);
  assert.match(source, /\.sidera-profile-summary--stacked/);
  assert.match(source, /\.sidera-profile-summary--inverse/);
  assert.match(source, /min-inline-size: 0/);
  assert.match(source, /overflow-wrap: anywhere/);
  assert.match(source, /@media \(max-width: 40rem\)/);
});
