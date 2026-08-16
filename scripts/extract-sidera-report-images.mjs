import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const referenceFile = path.resolve(
  projectRoot,
  "../sidera-references/images/Sidera Reports - PNG Embedded.html",
);
const outputDirectory = path.join(projectRoot, "astropages/assets/reports");
const outputNames = [
  "natal-blueprint.png",
  "year-ahead-forecast.png",
  "relationship-synastry.png",
  "solar-return-report.png",
  "career-vocation.png",
  "saturn-return-report.png",
];

const source = readFileSync(referenceFile, "utf8");
const reportsStart = source.indexOf("const REPORTS = ");
const reportsEnd = source.indexOf(";\n\nfunction coverStyle", reportsStart);
if (reportsStart < 0 || reportsEnd < 0) {
  throw new Error(
    "Could not find the ordered Reports data in the embedded reference.",
  );
}

const reportsBlock = source.slice(reportsStart, reportsEnd);
const images = [
  ...reportsBlock.matchAll(
    /"image":\s*"data:image\/png;base64,([A-Za-z0-9+/=]+)"/g,
  ),
].map((match) => match[1]);
if (images.length !== outputNames.length) {
  throw new Error(
    `Expected ${outputNames.length} embedded Report images, found ${images.length}.`,
  );
}

mkdirSync(outputDirectory, { recursive: true });
for (const [index, outputName] of outputNames.entries()) {
  const encoded = images[index];
  if (!encoded) {
    throw new Error(`Report ${index + 1} does not contain an embedded PNG.`);
  }
  writeFileSync(
    path.join(outputDirectory, outputName),
    Buffer.from(encoded, "base64"),
  );
}

console.log(
  `Extracted ${images.length} Report images into astropages/assets/reports.`,
);
