import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("shared Pagination is the single paged-navigation implementation", () => {
  const component = read("src/components/shared/Pagination.astro");
  const tracker = read("COMMON_COMPONENTS_TRACKER.md");
  assert.match(component, /aria-current="page"/);
  assert.match(component, /props\.totalPages > 1/);
  assert.match(component, /hrefForPage/);
  assert.match(component, /ellipsis-start/);
  assert.match(component, /<svg viewBox="0 0 20 20"/);
  assert.doesNotMatch(component, />\{props\.previousLabel\}</);
  assert.doesNotMatch(component, />\{props\.nextLabel\}</);
  assert.match(tracker, /M-19 \| `Pagination`[\s\S]*`IN PROGRESS`/);
});

test("Pagination stays compact, keeps active hover inert, and smooths page changes", () => {
  const styles = read("src/styles/shared/pagination.css");
  const collectionStyles = read(
    "src/styles/account/account-collection-page.css",
  );
  assert.match(styles, /inline-size: max-content/);
  assert.match(
    styles,
    /\.sidera-pagination__direction \.sidera-button__label[\s\S]*place-items: center/,
  );
  assert.match(
    styles,
    /\.sidera-pagination__direction svg[\s\S]*display: block/,
  );
  assert.match(styles, /:not\(\.sidera-pagination__page--current\):hover/);
  assert.match(styles, /@view-transition/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(collectionStyles, /view-transition-name: account-collection/);
  assert.match(
    collectionStyles,
    /account-collection-page__back \.sidera-button__label \{[^}]*gap: 3px/,
  );
});

test("charts and people share collection heading, grids, routes, and pagination", () => {
  const page = read("src/pages/account.astro");
  const route = read("src/pages/account/[collection].astro");
  const charts = read(
    "src/components/account/sections/AccountSavedCharts.astro",
  );
  const people = read("src/components/account/sections/AccountPeople.astro");
  assert.match(charts, /SectionHeading/);
  assert.match(people, /SectionHeading/);
  assert.match(charts, /slice\(0, 4\)/);
  assert.match(people, /slice\(0, 4\)/);
  assert.match(page, /\/account\/charts/);
  assert.match(page, /\/account\/people/);
  assert.match(route, /collection === "orders" \? 10 : 8/);
  assert.match(route, /<Pagination|AccountCollectionPage/);
  assert.match(route, /titleField=\{titleField\}/);
  assert.match(route, /eyebrowField=\{eyebrowField\}/);
  const collectionPage = read(
    "src/components/account/shared/AccountCollectionPage.astro",
  );
  assert.match(
    collectionPage,
    /titleEditAttributes=\{props\.edit\(props\.titleField\)\}/,
  );
  assert.match(
    collectionPage,
    /eyebrowEditAttributes=\{props\.edit\(props\.eyebrowField\)\}/,
  );
});
