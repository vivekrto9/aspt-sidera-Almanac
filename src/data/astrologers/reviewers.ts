export type AstrologerReviewerProfile = {
  name: string;
  imageUrl: string;
};

export const astrologerReviewerProfiles: Record<
  string,
  readonly AstrologerReviewerProfile[]
> = {
  "orion-hale": [
    {
      name: "Koray Ayaydın",
      imageUrl: "https://randomuser.me/api/portraits/med/men/22.jpg",
    },
    {
      name: "Theo Slawa",
      imageUrl: "https://randomuser.me/api/portraits/med/men/70.jpg",
    },
    {
      name: "Maxence Boyer",
      imageUrl: "https://randomuser.me/api/portraits/med/men/43.jpg",
    },
  ],
  "selene-marlowe": [
    {
      name: "Bessie Wood",
      imageUrl: "https://randomuser.me/api/portraits/med/women/40.jpg",
    },
    {
      name: "Freija Rodriguez",
      imageUrl: "https://randomuser.me/api/portraits/med/women/74.jpg",
    },
    {
      name: "Debbie Boyd",
      imageUrl: "https://randomuser.me/api/portraits/med/women/71.jpg",
    },
  ],
};

const fallbackReviewerProfiles = astrologerReviewerProfiles["orion-hale"]!;

export const getAstrologerReviewerProfiles = (
  slug: string,
): readonly AstrologerReviewerProfile[] =>
  astrologerReviewerProfiles[slug] ?? fallbackReviewerProfiles;
