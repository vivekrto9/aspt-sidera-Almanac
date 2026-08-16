import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const componentUrl = new URL(
  "../../src/components/shared/AstrologyProfileForm.astro",
  import.meta.url,
);
const stylesUrl = new URL(
  "../../src/styles/shared/astrology-profile-form.css",
  import.meta.url,
);

test("AstrologyProfileForm composes the approved profile-field primitives", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /import DateSelector from "\.\/DateSelector\.astro"/);
  assert.match(source, /import TimeSelector from "\.\/TimeSelector\.astro"/);
  assert.match(source, /import LocationAutocomplete/);
  assert.match(source, /import FormField from "\.\/FormField\.astro"/);
  assert.match(source, /import TextField from "\.\/TextField\.astro"/);
  assert.match(source, /import Button from "\.\/Button\.astro"/);
  assert.equal(source.match(/selectPresentation="popover"/g)?.length, 2);
});

test("AstrologyProfileForm supports one or two profiles without owning runtime data", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /profiles\.length === 0 \|\| profiles\.length > 2/);
  assert.match(source, /data-layout=\{safeLayout\}/);
  assert.match(source, /name=\{`\$\{prefix\}\[name\]`\}/);
  assert.match(source, /monthName=\{`\$\{prefix\}\[month\]`\}/);
  assert.match(source, /unknownName=\{`\$\{prefix\}\[timeUnknown\]`\}/);
  assert.match(source, /name=\{`\$\{prefix\}\[location\]`\}/);
  assert.doesNotMatch(source, /fetch\(|localStorage|sessionStorage/);
});

test("AstrologyProfileForm exposes prepared summary and tool extension surfaces", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /AstrologyProfileSummaryItem/);
  assert.match(source, /<slot name="intro" \/>/);
  assert.match(source, /<slot name="before-profiles" \/>/);
  assert.match(source, /<slot name="profile-one-extra" \/>/);
  assert.match(source, /<slot name="profile-two-extra" \/>/);
  assert.match(source, /<slot name="profile-one-heading-action" \/>/);
  assert.match(source, /<slot name="profile-two-heading-action" \/>/);
  assert.match(source, /<slot name="after-profiles" \/>/);
  assert.match(source, /<slot name="actions" \/>/);
});

test("AstrologyProfileForm forwards opt-in Content Studio attributes without changing defaults", async () => {
  const source = await readFile(componentUrl, "utf8");

  assert.match(source, /labelEditAttributes=\{profile\.date\.labelEditAttributes\}/);
  assert.match(source, /labelEditAttributes=\{profile\.time\.labelEditAttributes\}/);
  assert.match(source, /unknownLabelEditAttributes=\{profile\.time\.unknownLabelEditAttributes\}/);
  assert.match(source, /labelEditAttributes=\{profile\.location\.labelEditAttributes\}/);
  assert.match(source, /inputEditAttributes=\{profile\.location\.inputEditAttributes\}/);
  assert.match(source, /editAttributes=\{submitEditAttributes\}/);
  assert.match(source, /nameLabelEditAttributes/);
  assert.match(source, /namePlaceholderEditAttributes/);
});

test("AstrologyProfileForm retains paired identity and responsive safeguards", async () => {
  const styles = await readFile(stylesUrl, "utf8");

  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\) 3\.25rem minmax\(0, 1fr\)/);
  assert.match(styles, /\.astrology-profile-form__connector/);
  assert.match(styles, /\.astrology-profile-form__profile--forest/);
  assert.match(styles, /@media \(max-width: 54rem\)/);
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /\.astrology-profile-form__profile-heading-action\s*\{[^}]*margin-inline-start: auto/s);
  assert.match(styles, /@media \(forced-colors: active\)/);
});
