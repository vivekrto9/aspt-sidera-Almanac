import assert from "node:assert/strict";
import test from "node:test";
import { prepareAccountPeopleFromProfiles } from "../../src/data/account/people.ts";

const profile = {
  id: "profile-1",
  accountId: "account-1",
  profileName: "Natal profile",
  relation: "",
  gender: "",
  birthDate: "1999-08-21",
  birthTime: "18:02",
  birthPlace: "Mumbai, India",
  placeId: "place-1",
  placeLat: 19.07,
  placeLon: 72.87,
  placeTimezone: "Asia/Kolkata",
  timezoneOffset: "UTC+05:30",
  notes: "",
  isDefault: true,
  createdAt: "2026-08-13T10:00:00.100Z",
  updatedAt: "2026-08-13T10:00:00.100Z",
};

const reading = {
  id: "chart-1",
  profileId: "profile-1",
  generatedAt: "2026-08-13T10:00:00.000Z",
  chart: {
    chartRotation: 42,
    planets: [
      { glyph: "☉", longitude: 148, name: "Sun", color: "#9c4f38" },
    ],
  },
};

test("a profile created by the natal flow keeps its real chart despite timestamp ordering", () => {
  const [person] = prepareAccountPeopleFromProfiles([profile], "en", [reading]);

  assert.equal(person.birthChart?.href, "/birth-chart/chart-1");
  assert.equal(person.birthChart?.rotation, 42);
  assert.equal(person.birthChart?.planets[0].longitude, 148);
});

test("an edited profile does not display an older chart", () => {
  const [person] = prepareAccountPeopleFromProfiles(
    [{ ...profile, updatedAt: "2026-08-13T11:00:00.000Z" }],
    "en",
    [reading],
  );

  assert.equal(person.birthChart, null);
  assert.equal(person.generateBirthChartHref, "/birth-chart?profileId=profile-1");
});
