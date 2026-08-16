import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const referenceFile = path.resolve(
  projectRoot,
  "../sidera-references/images/Sidera Home - PNG Embedded.html",
);
const outputDirectory = path.join(projectRoot, "src/assets/home");
const outputByAlt = new Map([
  ["Person A", "synastry-person-a.png"],
  ["Person B", "synastry-person-b.png"],
]);

const source = readFileSync(referenceFile, "utf8");
const matches = [
  ...source.matchAll(
    /<img src='data:image\/png;base64,([A-Za-z0-9+/=]+)' alt='(Person A|Person B)'/g,
  ),
];

if (matches.length !== outputByAlt.size) {
  throw new Error(
    `Expected ${outputByAlt.size} Home Synastry portraits, found ${matches.length}.`,
  );
}

mkdirSync(outputDirectory, { recursive: true });
for (const match of matches) {
  const outputName = outputByAlt.get(match[2]);
  if (!outputName)
    throw new Error(`Unexpected Home Synastry portrait: ${match[2]}.`);
  writeFileSync(
    path.join(outputDirectory, outputName),
    Buffer.from(match[1], "base64"),
  );
}

console.log(
  `Extracted ${matches.length} bundled Home Synastry portraits into src/assets/home.`,
);
