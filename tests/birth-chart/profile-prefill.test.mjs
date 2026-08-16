import assert from "node:assert/strict";
import test from "node:test";
import { prepareBirthChartProfilePrefill } from "../../src/data/birth-chart/profile-prefill.ts";

test("saved birth profiles prefill only resolved owned profile data", () => {
  const prefill = prepareBirthChartProfilePrefill({
    id: "profile-1",
    accountId: "account-1",
    profileName: "Aman",
    relation: "friend",
    gender: "",
    birthDate: "1998-09-04",
    birthTime: "18:02",
    birthPlace: "Dharampur, India",
    placeId: "place-1",
    placeLat: 30.9,
    placeLon: 77.1,
    placeTimezone: "Asia/Kolkata",
    timezoneOffset: "UTC+05:30",
    notes: "",
    isDefault: false,
    createdAt: "2026-08-13T00:00:00Z",
    updatedAt: "2026-08-13T00:00:00Z",
  });

  assert.equal(prefill.name, "Aman");
  assert.equal(prefill.birthDate, "1998-09-04");
  assert.equal(prefill.birthTime, "18:02");
  assert.equal(prefill.selectedLocation?.placeId, "place-1");
  assert.equal(prefill.selectedLocation?.offset, "UTC+05:30");
  assert.equal("houseSystem" in prefill, false);
});
