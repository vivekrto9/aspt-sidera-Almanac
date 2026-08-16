import type { CustomerUserProfile } from "../../server/aggregator/customer-profiles.ts";

export type BirthChartProfilePrefill = {
  name: string;
  birthDate: string;
  birthTime: string;
  locationQuery: string;
  selectedLocation?: {
    placeId: string;
    formattedAddress: string;
    lat: number;
    lon: number;
    timezone: string;
    offset: string;
  };
};

export const prepareBirthChartProfilePrefill = (
  profile: CustomerUserProfile,
): BirthChartProfilePrefill => {
  const hasResolvedLocation = Boolean(
    profile.placeId &&
      profile.placeTimezone &&
      profile.timezoneOffset &&
      Number.isFinite(profile.placeLat) &&
      Number.isFinite(profile.placeLon),
  );

  return {
    name: profile.profileName,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    locationQuery: profile.birthPlace,
    selectedLocation: hasResolvedLocation
      ? {
          placeId: profile.placeId,
          formattedAddress: profile.birthPlace,
          lat: profile.placeLat,
          lon: profile.placeLon,
          timezone: profile.placeTimezone,
          offset: profile.timezoneOffset,
        }
      : undefined,
  };
};
