import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const referenceFile = path.resolve(
  projectRoot,
  "../sidera-references/images/Sidera%20Talk%20to%20an%20Astrologer%20-%20PNG%20Embedded.html",
);
const outputDirectory = path.join(projectRoot, "astropages/assets/astrologers");
const profiles = [
  ["Mara Ellison", "mara-ellison"],
  ["Devin Roy", "devin-roy"],
  ["Yuki Tanaka", "yuki-tanaka"],
  ["Priya Nair", "priya-nair"],
  ["Sol Marino", "sol-marino"],
  ["Amara Okafor", "amara-okafor"],
  ["Bran Kavanagh", "bran-kavanagh"],
  ["Lena Fischer", "lena-fischer"],
  ["Theo Alvarez", "theo-alvarez"],
];

const source = readFileSync(referenceFile, "utf8");
const profilesStart = source.indexOf("const ASTROS=");
const profilesEnd = source.indexOf("];", profilesStart);
if (profilesStart < 0 || profilesEnd < 0) {
  throw new Error(
    "Could not find ordered astrologer data in the embedded reference.",
  );
}

const astrologers = JSON.parse(
  source.slice(profilesStart + "const ASTROS=".length, profilesEnd + 1),
);
if (
  astrologers.length !== profiles.length ||
  astrologers.some((profile, index) => profile.name !== profiles[index][0])
) {
  throw new Error(
    "The embedded astrologer order does not match Sidera's directory.",
  );
}

mkdirSync(outputDirectory, { recursive: true });
for (const [index, profile] of astrologers.entries()) {
  const encoded = String(profile.image ?? "").replace(
    /^data:image\/png;base64,/,
    "",
  );
  if (!encoded)
    throw new Error(`${profile.name} does not contain an embedded PNG.`);
  writeFileSync(
    path.join(outputDirectory, `${profiles[index][1]}.png`),
    Buffer.from(encoded, "base64"),
  );
}

console.log(
  `Extracted ${astrologers.length} astrologer portraits into astropages/assets/astrologers.`,
);
