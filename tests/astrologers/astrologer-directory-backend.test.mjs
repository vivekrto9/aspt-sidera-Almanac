import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Astrologer catalog migration activates the two Chani chat profiles", async () => {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(await read("migrations/0108_astrologer_directory.sql"));
  sqlite.exec(await read("migrations/0151_chani_chat_astrologer_catalog.sql"));
  const profiles = sqlite
    .prepare(
      `
    SELECT slug, image_url, rate_cents, availability, chat_profile_type
    FROM ap_astrologers WHERE active = 1 ORDER BY sort_order ASC
  `,
    )
    .all();

  assert.equal(profiles.length, 2);
  assert.deepEqual(
    profiles.map((profile) => [
      profile.slug,
      profile.rate_cents,
      profile.chat_profile_type,
    ]),
    [
      ["orion-hale", 1000, "KUNDLI"],
      ["selene-marlowe", 500, "MATCHING"],
    ],
  );
  for (const profile of profiles) {
    assert.match(profile.image_url, /^\/_assets\/aliases\/astrologers-/);
    assert.ok(profile.rate_cents > 0);
    assert.ok(["online", "busy", "offline"].includes(profile.availability));
  }
  sqlite.close();
});

test("Astrologer routes use the D1 repository and retain portrait continuity", async () => {
  const [
    repository,
    browsePage,
    profilePage,
    browse,
    profile,
    setup,
    live,
    summary,
    home,
  ] = await Promise.all([
    read("src/server/aggregator/astrologer-directory.ts"),
    read("src/pages/astrologers.astro"),
    read("src/pages/astrologers/[slug].astro"),
    read("src/components/astrologers/sections/AstrologersBrowse.astro"),
    read("src/components/astrologers/sections/AstrologerProfile.astro"),
    read("src/components/astrologers/sections/AstrologerSessionSetup.astro"),
    read("src/components/astrologers/sections/AstrologerLiveSession.astro"),
    read("src/components/astrologers/sections/AstrologerSessionSummary.astro"),
    read("src/pages/index.astro"),
  ]);

  assert.match(repository, /FROM ap_astrologers/);
  assert.match(repository, /WHERE active = 1 ORDER BY sort_order ASC/);
  assert.match(repository, /getAstrologerBySlug/);
  assert.match(browsePage, /listAstrologers\(runtimeEnv\)/);
  assert.match(
    profilePage,
    /getAstrologerBySlug\(runtimeEnv, Astro\.params\.slug/,
  );
  assert.match(browse, /avatarSrc=\{astrologer\.imageUrl\}/);
  assert.match(profile, /avatarSrc=\{astrologer\.imageUrl\}/);
  assert.match(setup, /avatarSrc=\{astrologer\.imageUrl\}/);
  assert.match(live, /src=\{astrologer\.imageUrl\}/);
  assert.match(summary, /avatarSrc=\{astrologer\.imageUrl\}/);
  assert.match(
    home,
    /const homeAstrologers = \(await listAstrologers\(runtimeEnv\)\)\.slice\(0, 2\)/,
  );
});

test("Reference extraction keeps the original catalog asset tooling available", async () => {
  const script = await read("scripts/extract-sidera-astrologer-images.mjs");
  assert.match(script, /const ASTROS=/);
  assert.match(script, /profile\.name !== profiles\[index\]\[0\]/);
  assert.match(script, /astropages\/assets\/astrologers/);
});
