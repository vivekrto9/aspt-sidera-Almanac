import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const referenceFile = path.resolve(
  projectRoot,
  "../sidera-references/images/Sidera Blog - PNG Embedded.html",
);
const outputDirectory = path.join(projectRoot, "astropages/assets/blog");
const outputNames = [
  "the-lot-of-fortune-explained.png",
  "aries-rising-the-pioneer-ascendant.png",
  "morning-star-evening-star.png",
  "reading-your-saturn-return.png",
  "the-twelve-houses-room-by-room.png",
  "what-mercury-retrograde-actually-does.png",
];

const source = readFileSync(referenceFile, "utf8");
const images = [...source.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g)].map(
  (match) => Buffer.from(match[1], "base64"),
);

if (images.length !== outputNames.length) {
  throw new Error(
    `Expected ${outputNames.length} embedded Blog images, found ${images.length}.`,
  );
}

mkdirSync(outputDirectory, { recursive: true });
for (const [index, outputName] of outputNames.entries()) {
  writeFileSync(path.join(outputDirectory, outputName), images[index]);
}

console.log(`Extracted ${images.length} Blog images into astropages/assets/blog.`);
