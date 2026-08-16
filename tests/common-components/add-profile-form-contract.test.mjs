import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("AddProfileForm is a reusable authenticated customer-profile form", async () => {
  const [component, css] = await Promise.all([
    read("src/components/shared/AddProfileForm.astro"),
    read("src/styles/shared/add-profile-form.css"),
  ]);

  assert.match(component, /import AstrologyProfileForm/);
  assert.match(component, /import Button/);
  assert.match(component, /endpoint = "\/api\/astropages\/generated-site\/customer\/user-profiles"/);
  assert.match(component, /form\.checkValidity\(\)/);
  assert.match(component, /\$\{locationName\}Latitude/);
  assert.match(component, /\$\{locationName\}Timezone/);
  assert.match(component, /birthDate:/);
  assert.match(component, /birthTime/);
  assert.match(component, /placeTimezone/);
  assert.match(component, /isDefault: false/);
  assert.match(component, /form\.toggleAttribute\("inert", loading\)/);
  assert.match(component, /data-add-profile-submit/);
  assert.match(component, /aria-live="polite"/);
  assert.match(css, /\.sidera-add-profile-form__status/);
  assert.match(css, /@media \(max-width: 40rem\)/);
});
