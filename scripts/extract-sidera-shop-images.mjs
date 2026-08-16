import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const referenceFile = path.resolve(
  projectRoot,
  "../sidera-references/images/Sidera%20Shop%20-%20Fixed%20PNG%20Embedded.html",
);
const outputDirectory = path.join(projectRoot, "astropages/assets/shop");
const productIds = [
  "natal-print",
  "tapestry",
  "almanac",
  "tarot",
  "notebook",
  "candle",
  "scarf",
  "pins",
  "pendant",
];

const source = readFileSync(referenceFile, "utf8");
const productsStart = source.indexOf("const PRODUCTS=");
const productsEnd = source.indexOf("];", productsStart);
if (productsStart < 0 || productsEnd < 0) {
  throw new Error(
    "Could not find the ordered Shop data in the embedded reference.",
  );
}

const products = JSON.parse(
  source.slice(productsStart + "const PRODUCTS=".length, productsEnd + 1),
);
if (
  products.length !== productIds.length ||
  products.some((product, index) => product.id !== productIds[index])
) {
  throw new Error(
    "The embedded Shop product order does not match Sidera's catalog.",
  );
}

mkdirSync(outputDirectory, { recursive: true });
for (const product of products) {
  const encoded = String(product.img ?? "").replace(
    /^data:image\/png;base64,/,
    "",
  );
  if (!encoded)
    throw new Error(`${product.id} does not contain an embedded PNG.`);
  writeFileSync(
    path.join(outputDirectory, `${product.id}.png`),
    Buffer.from(encoded, "base64"),
  );
}

console.log(
  `Extracted ${products.length} Shop images into astropages/assets/shop.`,
);
