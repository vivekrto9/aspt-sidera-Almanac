# Sidera Backend, API, and Image Wiring Plan

Status: `IMPLEMENTATION AUDIT`
Audit date: `2026-08-13`
Implementation repository: `/Users/ashutoshsingh/Desktop/astro-pages/sidera-warm-modern`
Template audit root: `/Users/ashutoshsingh/Desktop/astro-pages/tempates`
Image reference root: `/Users/ashutoshsingh/Desktop/astro-pages/sidera-references/images`

This is the canonical planning and completion document for replacing Sidera's prepared UI fixtures with authoritative content, media, customer, astrology, commerce, and session data. It does not authorize production deployment, payment activation, or edits to the approved Home chart visuals.

## Executive decision

Do not start with paid astrology calculations or checkout. Start with the shared media and read-model foundation, then wire the low-risk dynamic catalogs before customer mutations and transactions.

Recommended order:

1. Establish the Project Asset extraction/normalization foundation and connect Blog posts with their six featured images through EmDash.
2. Make Shop, Reports, and Astrologer catalogs dynamic through D1 repositories, registering and connecting each domain's approved images in that same page integration slice.
3. Complete customer authentication and profile/birth-profile persistence.
4. Replace prepared chart, sky, horoscope, moon, and synastry results with provider-backed APIs and stored readings.
5. Wire astrologer chat/session behavior.
6. Wire report and shop checkout, verified payments, orders, fulfillment, email, leads, and Account history.
7. Create and connect the Sidera-specific Transit calculation and Retrograde data capabilities last.

The first implementation slice should therefore be `MEDIA-01 + BLOG-01`. It proves the asset lifecycle, dynamic list/detail rendering, locale fallback, image accessibility, and Content Studio behavior without introducing payment, private birth data, or an external astrology-provider dependency.

Two sequencing rules are explicit product decisions:

- `CHART-02` Synastry, `SKY-01` current-sky positions, `CHART-03` Transit calculation, and `RETROGRADE-01` Retrograde data were deliberately completed last, after the `upastrology-worker-website` re-audit exposed structured chart positions, global events, personalized transits, and station changes that could be adapted behind Sidera's existing provider boundary.
- Images are not a disconnected bulk styling task. Blog images ship with Blog integration, Shop images with Shop integration, Report images with Reports integration, and portraits with Astrologer integration. The extraction and Project Asset tooling can be shared, but an image is considered complete only when its authoritative entity record and existing common UI component consume it.

## Live tracker snapshot

The page tracker was re-read before this audit because multiple sessions can change ownership and status.

- Active product pages: `23 DONE`
- Intentionally removed pages: `2 REMOVED` (`Composite Chart`, `Solar Return`)
- Pages currently available to claim: `0 TODO`
- Pages currently owned: `0 IN PROGRESS`
- The existing tracker and Content Studio log edits in the working tree are concurrent/unrelated and are not modified by this plan.

Backend work is a new cross-page track. Before each implementation slice, re-read `PAGE_BUILD_TRACKER.md`, `COMMON_COMPONENTS_TRACKER.md`, `CONTENT_STUDIO_ERROR_LOG.md`, `AGENTS.md`, and `git status --short`.

## Backend implementation tracker

| Slice                      | Flow                                                                                | Status        | Owner                           | Current scope                               | Notes                                                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------- | ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MEDIA-01 + BLOG-01`       | Blog index → article detail → related articles → Home Blog preview                  | `DONE`        | Codex · backend/API wiring task | —                                           | Approved and committed in `7fd950a`; six Blog covers are registered and consumed, and 42 localized EmDash post seeds wire index/detail/related/Home preview.                                                 |
| `REPORT-READ-01`           | Reports catalog → detail → Home preview                                             | `DONE`        | Codex · backend/API wiring task | —                                           | Approved; six ordered D1 products, six Report covers, localized catalog/detail rendering, matching Home links, and the shared report-order checkout now flow through authoritative records.                    |
| `SHOP-READ-01`             | Shop catalog → detail → cart → checkout → confirmation → Home preview               | `DONE`        | Codex · backend/API wiring task | —                                           | Approved; nine ordered D1 products and images flow through catalog, detail, cart, authoritative order creation, Stripe Checkout, confirmation, Account Orders, and Home.                                     |
| `ASTROLOGER-READ-01`       | Directory → profile → session setup/live/summary portrait continuity → Home preview | `DONE`        | Codex · Astrologer backend task | —                                           | Approved on 2026-08-12; nine D1-backed profiles and reference portraits flow through Directory, Profile, prepared session states, and Home. Calendly, chat APIs, and persistence remain deferred.            |
| `AUTH-04/05/06`            | Signup → reset request → single-use password reset → login                          | `DONE`        | Codex · Auth backend task       | —                                           | Approved on 2026-08-12; real signup/session, generic reset request, one-hour hashed token, single-use reset, session revocation, and SES delivery replace simulated UI states. OTP remains deferred.           |
| `ACCOUNT-01/02/03`         | Account settings + owned people/birth-profile CRUD                                  | `DONE`        | Codex · Account backend task    | —                                           | Verified on 2026-08-12; Account settings and owned birth profiles now use authenticated D1 persistence with CSRF, ownership, idempotent creation, Account loaders, focused CRUD tests, and a passing build.    |
| `CHART-01 + ACCOUNT-04/05` | Birth Chart → persisted result → Account overview/Saved charts                       | `DONE`        | Codex · backend/API wiring task | —                                           | Reused the audited AstrologyAPI interpretation contract without provider wheel imagery; normalized results persist in owned D1 readings and now feed real Saved Charts plus overview counts.                  |
| `HOROSCOPE-01`             | Daily Horoscope sign reading + period navigation                                     | `DONE`        | Codex · backend/API wiring task | —                                           | Provider-backed daily/weekly/monthly readings use a bounded D1 cache; yesterday/tomorrow remain explicit editorial periods because the audited provider contract does not support those dates.                 |
| `MOON-01`                  | Current Moon guide → Moon Calendar tonight/cycle state                                | `DONE`        | Codex · backend/API wiring task | —                                           | AstrologyAPI lunar metrics/phase report now own the current phase, illumination, sign, meaning, and active cycle state; the 42-cell browser remains deterministic client-side calendar projection.              |
| `SESSION-PAY-01`           | Stripe checkout + verified prepaid session entitlement                             | `DONE`        | Codex · Session payment task    | —                                           | Verified on 2026-08-12; D1 Astrologer rates own pricing, Checkout uses provider idempotency, signed webhook/browser verification reconcile immutable attempts and paid entitlements, and voice/video remain excluded. |
| `SESSION-01/02/03/04/05`   | Entitlement-backed chat/session lifecycle                                           | `DONE`        | Codex · Chat backend task       | —                                           | Verified on 2026-08-12; prepaid chat/written entitlements now create owned durable sessions, provider-backed messages are idempotent and concurrency-safe, transcripts paginate, failures never fabricate replies, and the real payment return opens the session UI. |
| `SESSION-07`               | Calendly scheduled-session lifecycle                                                 | `DONE`        | Codex · Calendly backend task   | —                                           | Verified on 2026-08-12; server-validated duration mappings, live availability, exact-slot revalidation, paid entitlement reservation, invitee creation, owned bookings, signed idempotent webhooks, and setup UI are integrated. Cancellation does not invent a refund policy. |
| `ACCOUNT-SESSIONS-01`      | Chat/written/Calendly records → Account Sessions + Past readings                     | `REMOVED`     | —                                | —                                           | Account Sessions/Past readings UI was explicitly retired on 2026-08-14. The underlying chat/payment and Calendly session lifecycles remain active; Account Overview still projects genuine future scheduled sessions. |
| `COMMERCE-01`              | Shop/Reports → Stripe → status/confirmation → Account Orders + Sales MCP             | `DONE`        | Codex · commerce backend task   | —                                           | Verified on 2026-08-12; server-priced idempotent Shop and profile-bound Report orders share normalized D1 storage, Stripe reconciliation, owned status/history, localized UI handoffs, and live Sales MCP views. Report generation remains honestly queued until a provider API exists. |
| `CHART-02 + SKY-01 + CHART-03 + RETROGRADE-01` | Synastry, Today’s Sky provider positions, Transit, and Retrogrades                    | `DONE`        | Codex · provider-auth correction | —                                            | Corrected and live-verified 2026-08-13: these four flows now use the Transit Engine host, Basic credentials, and its canonical birth-details/event schemas. Existing Birth Chart, Horoscope, and Moon authentication remains unchanged. |

### Reusable-integration completion audit

Re-audited on `2026-08-13` after completing the final four-API slice:

- No directly reusable backend/API integration remains unimplemented for Sidera's current pages.
- The Co-Star Synastry wheel route still returns only a provider image URL. Sidera therefore retains its native `ChartWheel`, loads both structured birth-chart position sets server-side, derives cross-chart aspects and the stable Sidera scoring/narrative contract, and persists only the normalized result exposed to the UI.
- The available `/v1/zodiac_compatibility/{sign}/{sign}` route is Sun-sign compatibility only. It cannot replace two full birth-profile Synastry.
- The catalog's `/v1/synastry_couple_report/tropical` endpoint belongs to paid PDF report fulfillment and does not expose the instant structured Synastry result contract.
- Today’s Sky now combines the provider's exact geocentric positions, next-day motion, and global event feed; Transit separately uses the personalized natal-transit endpoint for an owned saved profile and requested date.
- Production Synastry, Transit, and Retrograde result fixtures were removed. Today’s Sky and Retrogrades render the shared localized unavailable state when the provider cannot return a complete result, rather than presenting prepared data as live output.
- Birth Chart, Horoscope, Moon, Blog, Shop, Reports catalog/checkout, Astrologers, Auth, Account, chat, Calendly, commerce, order/session history, leads, images, and transactional receipts are integrated and committed.

### Final four-API evidence (`2026-08-13`)

- `GET /api/astropages/generated-site/todays-sky` returns normalized exact positions, aspects, Moon state, events, and cache/provider source for a bounded date.
- `GET /api/astropages/generated-site/retrogrades` returns normalized current retrograde cards and a selected-year station timeline with bounded year/locale handling.
- `GET/POST /api/astropages/generated-site/synastry` validates two complete profiles, keeps provider credentials and responses server-side, persists a capability-addressed or account-owned reading, and protects authenticated persistence with the customer CSRF contract.
- `GET/POST /api/astropages/generated-site/transit` requires an authenticated owned profile plus CSRF, derives target-date timezone offsets including DST, normalizes personalized/fallback exact aspects, and persists an owner-private reading.
- The four routes share the canonical AstrologyAPI contract used by Birth Chart, Horoscope, and Moon: `ASTROLOGY_API_BASE_URL` plus the server-only `X_ASTROLOGYAPI_KEY` request header.
- Transit Engine birth details use `date`, `minute`, `latitude`, `longitude`, and `timezone_offset`. Retrograde stations come from the bounded yearly `direction_change` event feed so each retrograde/direct pair is represented instead of only the next change per planet.
- The shared 20-second timeout/safe-provider-error boundary and best-effort D1 provider cache remain in place. Live browser verification rendered exact Today’s Sky positions and complete 2026 Retrograde spans with no fixture fallback.
- The route/page contract is declared in `template.manifest.json`. Focused tests cover normalization, server-only auth, cache degradation, unauthenticated rejection, CSRF wiring, DST, and removal of real-route fixtures. All 808 tests, safety, secrets, D1 schema, Cloudflare contract, production build, and diff gates pass. The corrected API files have no type diagnostics; the repository-wide typecheck remains red on nine pre-existing diagnostics in unrelated shared/loading, locale, account, and lead-demo files.

## Scope and non-goals

### In scope

- Classify and prepare the supplied Sidera images.
- Reuse the existing Project Assets/R2 delivery contract.
- Replace UI fixture arrays with server-owned EmDash, D1, customer-session, and provider data.
- Define which UI needs an HTTP endpoint and which should load through server-side repositories.
- Reuse proven code and tests from the audited template repositories.
- Preserve current localized copy and Content Studio ownership.
- Define forward-only migrations, security rules, verification gates, and phased delivery.

### Explicitly out of scope

- Keep reference people/profile images out of Home's birth-chart, transit, and other celestial chart graphics. The Home Synastry preview is the explicit exception: its two bundled static reference portraits belong in the existing shared profile summaries while the native interlocking-chart visual remains unchanged.
- Do not copy the separate image set embedded in `Sidera Home - PNG Embedded.html` during the first media import.
- Do not recreate the removed Composite Chart or Solar Return pages.
- Do not create a second CMS or a D1 blog-post system; Blog belongs to EmDash.
- Do not put customer media in `public/`, raw R2 keys in content, or base64/data-URI images in runtime records.
- Do not trust browser prices, totals, ownership IDs, payment states, chart results, or astrologer availability.
- Do not claim that voice/video calls work by reusing chat presentation. Those modes need a real provider and a separately approved contract.
- Do not mark an order paid from a browser return URL. A verified provider confirmation/webhook owns paid state.

## Current Sidera baseline

Sidera already contains the platform foundation:

- Astro 6 on Cloudflare Workers.
- D1 through `DB`, Project Asset bytes through R2 `MEDIA`, session KV through `SESSION`, and Cloudflare Images through `IMAGES`.
- EmDash content bootstrap, editing, draft/release tracking, and snapshot export/import.
- Project Asset register, replace, restore, import/export, status, alias, and delivery behavior.
- Customer login/logout/session lookup.
- Google Places autocomplete/details/timezone endpoints.
- Generic lead storage/linking helpers and one product-interest demo flow.
- Email-template storage/render/publish/test infrastructure.
- `177` existing test files covering UI, platform, Content Studio, assets, auth foundation, and contracts.

The missing layer is product behavior:

- Current API routes: `30`, primarily platform operations, login/logout/me, places, and the lead demo.
- Current server modules: `29`, primarily platform/runtime behavior.
- Current migrations: `110`; most recent files register localized Content Studio fields for completed UI sections, not the missing shop/report/chart/session business tables.
- Blog, Shop, Reports, Astrologers, Account collections, chart results, sky data, horoscope data, and session data are still largely prepared TypeScript fixtures.
- `astropages/assets.manifest.json` currently seeds only the logo.
- `astropages/secrets.manifest.json` currently declares no product integration.

Important current fixture owners that must be retired only after their replacements work:

| Area                                  | Current prepared owner                                                       |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| Blog index/detail                     | `src/data/blog/articles.ts` plus localized article fields                    |
| Shop catalog/detail                   | `src/data/shop/catalog.ts` plus localized product fields                     |
| Reports catalog/detail                | `src/data/reports/catalog.ts` plus localized report fields                   |
| Astrologer browse/profile             | `src/data/astrologers/browse.ts`                                             |
| Account overview                      | `src/data/account/overview.ts`                                               |
| Account charts/people/orders/sessions | `src/data/account/*.ts`                                                      |
| Birth, transit, synastry results      | `src/data/*/dummy-results.ts` and prepared result modules                    |
| Sky, Moon, retrogrades                | `src/data/astronomy/*`, `src/data/moon-calendar/*`, `src/data/retrogrades/*` |

Fixture removal rule: first make the authoritative loader and its error/empty behavior pass; then remove the corresponding fixture from the real route. Never remove all display data first and leave a broken page.

## Architecture rule: not every dynamic page needs a JSON API

Sidera is server-rendered. Use three boundaries:

1. **Server repository/loader** for data needed while rendering a route. Examples: Blog list/detail, Shop catalog/detail, Reports catalog/detail, Account overview, and initial Astrologer directory data.
2. **Same-origin HTTP API** for browser mutations, polling, live search/status, pagination without a full route render, or interaction after hydration. Examples: login, saving a profile, generating a chart, sending a chat message, placing an order, and checking report/payment status.
3. **Provider adapter** only behind the Worker. Browser code never receives provider credentials and never calls astrology/payment/email providers directly.

This prevents duplicate sources of truth. A server-rendered Shop page should call the same `shop-catalog` repository used by order validation; it does not need an extra public `GET /shop-products` endpoint merely to render HTML.

## Image audit

### Source inventory

The reference folder contains five embedded-HTML image sources plus `.DS_Store`:

| Reference file                                                   | Embedded PNG occurrences | Intended domain                                              | Dimensions  |
| ---------------------------------------------------------------- | -----------------------: | ------------------------------------------------------------ | ----------- |
| `Sidera Blog - PNG Embedded.html`                                |                        6 | Blog covers                                                  | `1200x760`  |
| `Sidera Reports - PNG Embedded.html`                             |                        6 | Report covers                                                | `1200x760`  |
| `Sidera%20Shop%20-%20Fixed%20PNG%20Embedded.html`                |                        9 | Shop product media                                           | `1122x1402` |
| `Sidera%20Talk%20to%20an%20Astrologer%20-%20PNG%20Embedded.html` | 10 occurrences, 9 unique | Astrologer portraits; first image repeats the first portrait | `720x720`   |
| `Sidera Home - PNG Embedded.html`                                |                       13 | Home-only reference repeats and chart/profile imagery        | mixed       |

Across all five files there are `44` PNG occurrences and `37` unique byte hashes. Excluding the Home file leaves `30` occurrences and `26` unique byte hashes because four Blog/Report images are shared.

### Domain-by-domain import decision

The approved non-Home source pool contains:

- 6 Blog cover associations.
- 6 Report cover associations.
- 9 Shop product associations.
- 9 Astrologer portrait associations.
- Deduplicate identical bytes by content hash, while allowing multiple semantic aliases to point at one Project Asset when Blog and Reports intentionally reuse the same image.

Register and connect them in their respective integration slices:

1. `MEDIA-01 + BLOG-01`: six Blog covers.
2. `REPORT-READ-01`: six Report covers.
3. `SHOP-READ-01`: nine Shop product images.
4. `ASTROLOGER-READ-01`: nine unique Astrologer portraits.

Do not mark a page's media complete merely because its bytes exist in the asset folder. Completion requires the canonical EmDash/D1 entity association, the existing common component integration, alt text, dimensions, fallback, responsive review, and focused tests.

Do not import the 13 Home-file images as a bulk set. Home's Astrologer, Shop, Blog, and Reports preview sections query the same canonical records as their destination pages and reuse those entities' image URLs. Bundle only the two explicitly approved static Home Synastry portraits so they do not depend on D1/R2 seed state; all chart/tool visuals remain unchanged.

### Static versus dynamic images

“Static” and “dynamic” describe record ownership, not whether bytes are stored in R2.

| Class                  | Examples                                  | Byte owner                                        | Association owner                             | Runtime URL                                         |
| ---------------------- | ----------------------------------------- | ------------------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| Static template asset  | Logo and any future non-record decoration | Project Assets seed manifest                      | Source manifest alias                         | `/_assets/aliases/...`                              |
| Dynamic CMS media      | Blog featured image                       | Project Assets                                    | EmDash `posts.featured_image`/media reference | normalized Project Asset or EmDash media URL        |
| Dynamic catalog media  | Shop and Report covers                    | Project Assets                                    | D1 catalog row                                | stable `/_assets/aliases/...` URL stored in catalog |
| Dynamic profile media  | Astrologer portrait                       | Project Assets                                    | D1 astrologer row                             | stable `/_assets/aliases/...` URL stored in profile |
| Private generated file | Purchased report PDF                      | private purpose-built storage/authorized download | Report order                                  | never a public seed alias                           |
| Generated chart visual | Current SVG/CSS `ChartWheel`              | existing UI/provider result model                 | no raster replacement                         | preserve current component                          |

### Planned asset layout

```text
astropages/assets/
  blog/<article-slug>.png
  reports/<report-slug>.png
  shop/<product-slug>.png
  astrologers/<astrologer-slug>.png
```

Alias convention:

```text
blog-<article-slug>
report-<report-slug>
shop-<product-slug>
astrologer-<astrologer-slug>
```

Every manifest item must include MIME type, generated content hash, replaceable seed policy, display name, and dimensions. Entity data must include meaningful localized alt text; filenames are not alt text.

### Media implementation rules

- Extract embedded PNG bytes once with a deterministic script; never load the multi-megabyte embedded HTML at runtime.
- Use `scripts/validate-project-assets-contract.mjs --write` to calculate manifest hashes; do not hand-write content hashes.
- Use Project Asset `sitePath`/alias URLs verbatim. Never persist preview hostnames, raw bucket names, storage keys, signed URLs, or data URIs.
- Keep one canonical image field per entity plus optional gallery fields only when the approved UI consumes them.
- Provide the shared `MediaThumbnail`, `Avatar`, `ProductCard`, `ReportCard`, `ArticleCard`, and `AstrologerCard` image props; do not create page-specific image components.
- Always reserve dimensions/aspect ratio to prevent layout shift.
- Fallback behavior must be semantic and accessible: existing tone/glyph/initial placeholder, not a broken image icon.
- Image replacement must be possible through Project Assets without changing the entity ID or route slug.
- The browser must lazy-load below-fold images; the first meaningful/featured image may be eager when it is the route's LCP candidate.

## Page and data ownership audit

| UI area                                       | Authoritative copy         | Authoritative runtime data                                                | Image source                                | Required backend work                                           |
| --------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Home                                          | EmDash page/chrome entries | Aggregated previews from sky, astrologer, reports, shop, and blog loaders | Reuse entity media only; preserve chart UI  | Add shared query helpers after destination domains are wired    |
| Today's Sky                                   | EmDash                     | Astrology provider plus bounded cache                                     | No new raster chart image                   | Provider adapter and current-sky loader/API                     |
| Birth Chart                                   | EmDash                     | Customer birth profile, provider calculation, stored reading              | Keep `ChartWheel`                           | Profile persistence and birth-chart API                         |
| Transit                                       | EmDash                     | Saved profile, selected date, provider calculation, stored reading        | Keep `ChartWheel`                           | Transit calculation API and reading persistence                 |
| Synastry                                      | EmDash                     | Two owned profiles, provider calculation, stored reading                  | Keep `ChartWheel`                           | Synastry API and ownership validation                           |
| Moon Calendar                                 | EmDash                     | Provider/current astronomy data plus cache                                | Current UI, no reference raster required    | Moon-guide/calendar loader                                      |
| Daily Horoscope                               | EmDash                     | Provider result keyed by sign/date/locale plus cache                      | Current glyph UI                            | Horoscope API/loader                                            |
| Retrogrades                                   | EmDash                     | Provider/ephemeris status plus cache                                      | Current UI                                  | Retrograde/current-transit loader                               |
| Astrologers                                   | EmDash interface copy      | D1 astrologers, services, availability, sessions                          | D1 portrait URL to Project Asset            | Directory/profile repository and chat/booking contract          |
| Reports                                       | EmDash interface copy      | D1 report catalog, price, orders, generation                              | D1 cover URL to Project Asset               | Catalog repository, orders, provider generation, payment/status |
| Shop                                          | EmDash interface copy      | D1 product catalog, variants, stock, orders                               | D1 product image URL to Project Asset       | Catalog repository, order/payment/fulfillment APIs              |
| Blog                                          | EmDash posts and page copy | Published EmDash `posts` list/detail                                      | Post media/Project Asset                    | Dynamic post loader and seed/import workflow                    |
| Account                                       | EmDash interface copy      | Authenticated D1 account, profiles, readings, orders, sessions            | Entity/profile media                        | Authenticated repositories and mutations                        |
| Auth                                          | EmDash interface copy      | D1 customer accounts, sessions, reset/OTP challenges                      | None required                               | Finish signup/reset/profile parity                              |
| FAQ, Glossary, About, Pricing, Terms, Privacy | EmDash                     | No new business API unless a future CTA mutates state                     | No supplied reference images for this slice | Keep content-only                                               |

## Backend capability and API shortlist

Statuses:

- `EXISTS`: already present in Sidera.
- `PORT`: proven in an audited template and should be adapted to Sidera.
- `NEW`: no exact reusable route; define only when its slice begins.
- `NO HTTP`: server-side loader/repository is the correct boundary.
- `DECISION`: product/provider choice is required before implementation.

### Platform and media

| ID       | Boundary                                                                 | Status   | Purpose                                                                                       |
| -------- | ------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------- |
| MEDIA-01 | Existing Project Asset register/import/replace/status/export/import APIs | `EXISTS` | Store, version, alias, release, and deliver media                                             |
| MEDIA-02 | Project Asset seed manifest and extraction script                        | `NEW`    | Deterministically extract/register the 26 unique non-Home PNG bytes                           |
| MEDIA-03 | Entity image normalization helper                                        | `PORT`   | Accept only safe Project Asset/EmDash media references and return `{src, alt, width, height}` |

No new public upload endpoint is needed. Customer/admin media changes must use Project Assets or EmDash's approved media workflow.

### Blog

| ID      | Boundary                                     | Status    | Purpose                                                            |
| ------- | -------------------------------------------- | --------- | ------------------------------------------------------------------ |
| BLOG-01 | `listBlogPosts(locale, filters, pagination)` | `NO HTTP` | Load published EmDash posts for the index                          |
| BLOG-02 | `getBlogPost(slug, locale)`                  | `NO HTTP` | Load one published article, related posts, SEO, and featured image |
| BLOG-03 | EmDash `posts` collection                    | `PORT`    | Canonical article create/edit/publish workflow                     |

Use the audited Chani `src/data/articles.ts` pattern. Do not create `ap_blog_posts` in Sidera and do not expose a duplicate public Blog CRUD API.

### Public catalogs

| ID                 | Boundary                                        | Status            | Purpose                                                       |
| ------------------ | ----------------------------------------------- | ----------------- | ------------------------------------------------------------- |
| SHOP-READ-01       | `listShopProducts` / `getShopProductBySlug`     | `PORT`, `NO HTTP` | D1-backed catalog, price, variants, stock, image metadata     |
| REPORT-READ-01     | `listReportProducts` / `getReportProductBySlug` | `PORT`, `NO HTTP` | D1-backed report catalog, price, provider key, cover metadata |
| ASTROLOGER-READ-01 | `listAstrologers` / `getAstrologerBySlug`       | `PORT`            | Initial server render of active profiles/services             |
| ASTROLOGER-READ-02 | `GET /api/astrologers`                          | `PORT`            | Optional hydrated search/filter/live availability refresh     |

Catalog prices and availability must be resolved again on every order/session mutation. Display data from the browser is never authoritative.

### Customer authentication and account

| ID         | Endpoint/boundary                                         | Status                     | Purpose                                                               |
| ---------- | --------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| AUTH-01    | `POST /api/astropages/generated-site/customer-auth/login` | `EXISTS`                   | Password login and secure customer session                            |
| AUTH-02    | `POST .../customer-auth/logout`                           | `EXISTS`                   | Revoke session                                                        |
| AUTH-03    | `GET .../customer-auth/me`                                | `EXISTS`                   | Current account/session data                                          |
| AUTH-04    | `POST .../customer-auth/signup`                           | `PORT`                     | Create verified/verification-pending account with normalized inputs   |
| AUTH-05    | `POST .../customer-auth/request-password-reset`           | `PORT`                     | Generic reset request response and expiring challenge                 |
| AUTH-06    | `POST .../customer-auth/reset-password`                   | `PORT`                     | Single-use reset completion                                           |
| AUTH-07    | OTP request/verify                                        | `DECISION`                 | Add only if Sidera wants passwordless login or email verification now |
| ACCOUNT-01 | `PATCH .../customer/profile`                              | `PORT`                     | Display name, phone, locale, and consent settings with CSRF           |
| ACCOUNT-02 | `GET/POST .../customer/user-profiles`                     | `PORT`                     | List/create owned people/birth profiles                               |
| ACCOUNT-03 | `PATCH/DELETE .../customer/user-profiles/[profileId]`     | `PORT`                     | Update/delete owned profiles and default selection                    |
| ACCOUNT-04 | Account overview server loader                            | `DONE`                     | Aggregate real chart/person/report/session-credit counts              |
| ACCOUNT-05 | Saved charts/readings paginated server loader             | `DONE`                     | Replace fixture cards with owned persisted Birth Chart readings       |
| ACCOUNT-06 | `GET .../customer-orders`                                 | `PORT`                     | Normalize Shop and Report order history for Account                   |
| ACCOUNT-07 | Session history through chat/booking repository           | `PORT`                     | Populate Past sessions and detail handoffs                            |

All private reads must resolve account ownership from the signed session, never from an `accountId` supplied by the browser.

### Astrology and celestial data

| ID            | Endpoint/boundary                  | Status                                | Purpose                                                                                    |
| ------------- | ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| CHART-01      | `POST .../birth-chart`             | `DONE`                                | Validate birth input/profile ownership, call Western provider, normalize and store reading |
| CHART-02      | `GET/POST .../synastry`            | `DONE`                                | Structured two-profile positions, native wheel, aspects, scores, narratives, and persisted reading |
| CHART-03      | `GET/POST .../transit`             | `DONE`                                | Owned profile/date calculation, personalized transits, DST-safe payload, and private persisted result |
| SKY-01        | `GET .../todays-sky`               | `DONE`                                | Exact provider longitudes, motion, aspects, Moon state, global events, and bounded cache    |
| HOROSCOPE-01  | Horoscope route/loader             | `DONE`                                | Sign/period/locale reading with cache and explicit provider failure                        |
| MOON-01       | Moon guide/calendar route/loader   | `DONE`                                | Provider phase, illumination, sign, meaning, and current cycle state with cache             |
| RETROGRADE-01 | `GET .../retrogrades`              | `DONE`                                | Current retrograde status plus provider station-based selected-year timeline                |
| PROVIDER-01   | Western astrology provider adapter | `DONE`                                | Existing secret resolution plus shared timeout, cache, validation, normalization, and safe errors |

Provider response JSON must stay server-side. UI receives Sidera's stable prepared result model, so provider changes do not force a component rewrite.

### Astrologer sessions

Approved product decision (`2026-08-12`): Sidera's first release uses direct prepaid sessions, not a wallet. Live text chat is sold in the existing `15/30/45/60` minute durations and a written question is sold at a fixed price. Stripe owns session payment; a verified paid-session entitlement replaces Chani's wallet balance check. Calendly owns scheduled appointment availability/events. Voice/video remains unavailable until a real call provider is selected.

| ID             | Endpoint/boundary                                                 | Status             | Purpose                                                                                                                                   |
| -------------- | ----------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| SESSION-PAY-01 | Session checkout-intent plus Stripe confirmation/webhook          | `PORT`, adapted    | Server-resolve session type/duration/price and issue a paid entitlement idempotently after verified payment                               |
| SESSION-01     | `POST /api/astro-chat/check-eligibility`                          | `PORT`, adapted    | Confirm login, active astrologer/service, selected owned profile, and an unused compatible paid-session entitlement                       |
| SESSION-02     | `POST /api/astro-chat/create-session`                             | `PORT`, adapted    | Atomically consume/reserve the entitlement and create the owned time-bounded chat or fixed-price written-question session                 |
| SESSION-03     | `POST /api/astro-chat/send-message`                               | `PORT`, adapted    | Call the provider and persist safe messages within the prepaid entitlement; never charge per message and never fabricate a provider reply |
| SESSION-04     | `GET /api/astro-chat/sessions`                                    | `PORT`             | Paginated owned session history                                                                                                           |
| SESSION-05     | `GET/PATCH/DELETE /api/astro-chat/session/[sessionId]`            | `PORT`             | Owned transcript, rename, and deletion behavior                                                                                           |
| SESSION-06     | Voice/video/live-call contract                                    | `DECISION`         | Requires a real call provider; do not simulate with the chat API                                                                          |
| SESSION-07     | Calendly availability, booking linkage, cancellation, and webhook | `APPROVED`, `PORT` | Use the Western single-astrologer Calendly pattern for scheduled appointments and project verified events into Account Sessions           |

No wallet balance, recharge, wallet transaction, or per-message billing API is part of the first release. Free introductory minutes, if retained, are represented by an explicit promotion/entitlement adjustment rather than an implicit wallet credit. Keep voice/video CTAs disabled or hidden until a provider contract is approved.

### Shop, reports, orders, and payments

| ID               | Endpoint/boundary                              | Status                         | Purpose                                                                                      |
| ---------------- | ---------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| COMMERCE-01      | `POST .../checkout-intents`                    | `DONE`                         | Server-resolve catalog rows, variants, quantities, currency, shipping, tax policy, and total |
| SHOP-ORDER-01    | `POST .../product-orders`                      | `DONE`                         | Create authoritative pending product order before payment                                    |
| REPORT-ORDER-01  | `POST .../report-orders`                       | `DONE`                         | Create authoritative pending report order with owned profile inputs                          |
| PAYMENT-01       | Stripe confirmation/status endpoints           | `DONE`                         | Confirm provider state idempotently; browser return remains informational                    |
| PAYMENT-02       | `POST .../webhooks/payment/stripe`             | `DONE`                         | Verify signature and own paid/failed transitions                                             |
| REPORT-STATUS-01 | `GET .../report-orders/[orderId]/status`       | `DONE`                         | Owned polling for generation and authorized download state                                   |
| REPORT-SAMPLE-01 | `GET .../reports/[slug]/sample`                | `NOT NEEDED`                   | Current samples are approved public Content Studio copy; no private file is exposed           |
| ORDER-EMAIL-01   | Transactional email helpers/templates          | `DONE / PROVIDER DEFERRED`     | Claimed-once Shop, Report-purchase, and session receipts use managed SES templates; generated-report delivery waits for the report provider, while reset email already exists and OTP remains a product decision |
| LEAD-LINK-01     | Existing `linkBusinessLead`/conversion helpers | `DONE`                         | Product, Report, and session source records link deterministically at creation and convert only after verified payment |

Stripe-only is approved and implemented for prepaid Astrologer sessions, Shop orders, and Report orders. No Razorpay compatibility is retained.

## Shared response and pagination contract

List loaders/endpoints that need pagination should return one stable envelope:

```ts
type PageResult<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};
```

Rules:

- Page numbers are one-based to match the existing shared Pagination UI.
- Reject or clamp invalid page/page-size values server-side.
- Use a deterministic secondary sort key such as `id` after date/sort order.
- Do not return all records and paginate only in the browser.
- Preserve the active locale and filter query in links.
- Return an empty `items` array with valid pagination metadata for a valid empty page; do not invent fixtures.
- If a dataset later requires cursor pagination at scale, adapt the server repository while keeping a page-number view model for the current UI.

## Entity media view model

All page/card consumers should receive a normalized object instead of raw database/media shapes:

```ts
type EntityImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
```

Domain examples:

- `BlogPost.image?: EntityImage`
- `ShopProduct.image?: EntityImage`
- `ReportProduct.image?: EntityImage`
- `Astrologer.portrait?: EntityImage`

The shared card/component decides rendering and fallback. Routes and components must not parse EmDash media objects or database JSON independently.

## Data ownership and migration plan

Use new forward-only migrations after current migration `0104`. Do not edit any applied migration.

### EmDash-owned data

- Public interface copy and SEO stay in the existing page/chrome entries.
- Blog articles become dynamic records in the EmDash `posts` collection.
- Blog title, excerpt, body, author, category, tags, published date, related posts, SEO, and featured image live with the post.
- Content Studio edits go through EmDash APIs/MCP and the existing mutation/release tracking. Public GET remains read-only.

### D1-owned data

Planned business tables/fields, adapted from the Chani/Co-Star reference:

- `ap_birth_profiles`
- `ap_chart_readings`
- `ap_astrologers`
- `ap_astrologer_services`
- chat/session/message or booking tables for only the approved modes
- `ap_shop_products` including image metadata, variant/inventory attributes, active flag, and sort order
- `ap_product_orders` plus normalized order-line rows if the final cart supports multiple products
- `ap_report_products` including cover metadata and provider endpoint key
- `ap_report_orders`
- payment attempts/events with idempotent transitions
- customer profile/reset/OTP/support/privacy additions only when their flow is implemented

Do not store long localized editorial descriptions twice. Decide per field:

- Operational value (price, stock, provider key, status, sort order): D1.
- Public editable prose/SEO: EmDash.
- Entity identity and association (slug, image URL, active state): D1 for business catalogs/profiles.
- Blog identity and prose: EmDash.

### Account aggregation

Account must not get separate duplicate “account order/session/chart” tables. It reads the authoritative domain tables by the signed-in account ID:

- Saved charts → birth profiles/chart readings.
- People → customer user/birth profiles.
- Orders → product and report orders normalized into one view model.
- Sessions → chat/bookings normalized into one view model.
- Settings → customer account/profile fields.

## Template repository audit

All `28` direct repository folders under `/Users/ashutoshsingh/Desktop/astro-pages/tempates` were inventoried. Every repository contains Astro API/server infrastructure, but many are visual variants with the same route inventory. Reuse the nearest behavioral source rather than mixing variant code.

| Family                        | Repositories audited                                                                                                                                                             | Finding and use                                                                                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform foundation (1)       | Core platform repository                                                                                                                                                         | Current platform ancestry: auth foundation, assets, Content Studio, leads, places, runtime, email. Preserve rather than replace.                                                                                                                                                                 |
| Western Chani (5)             | `aspt-western-chani-astro`, `aspt-western-chani-astro-paper`, `aspt-western-chani-astro-purple`, `aspt-western-chani-astro-soft-premium`, `aspt-western-chani-astro-warm-modern` | Best primary behavioral match. All expose the same 68-route API inventory. Use the warm-modern variant for articles, customer parity, Western provider adapters, astrologer chat, wallet, shop/report catalogs, orders, payments, and tests.                                                     |
| Co-Star (4)                   | `aspt-costar`, `aspt-costar-meridian`, `aspt-costar-nocturne`, `aspt-costar-verdant`                                                                                             | Best secondary Western chart source. Same 47-route inventory across variants. Use birth chart, daily transits, horoscope, synastry chart, reports, shop, checkout, and account journal patterns.                                                                                                 |
| Jyotish Live (4)              | `aspt-jyotish-live`, `aspt-jyotish-live-dark`, `aspt-jyotish-live-green`, `aspt-jyotish-live-riso`                                                                               | Broadest operational system (104–108 API routes): advisor/customer bookings, availability, admin, provider status, report status/sample, Blog admin, wallet/chat, events, retry/outbox. Reuse operational safeguards only; do not copy Vedic payload selectors or product semantics into Sidera. |
| Divyastra (4)                 | `aspt-divyastra`, `aspt-divyastra-Celestial-Indigo`, `aspt-divyastra-Sacred-Grove`, `aspt-divyastra-electric-Bloom`                                                              | Rich customer commerce source. Sacred Grove includes cart, wishlist, addresses, customer orders, tracking, invoice, promotions, inquiries, and payment intents. Use later if Sidera explicitly needs these advanced commerce features.                                                           |
| Jyoti Connect (4)             | `aspt-jyoti-connect`, `aspt-jyoti-connect-purple`, `aspt-jyoti-connect-rich-spiritual`, `aspt-jyoti-connect-soft-premium`                                                        | Consultation slot/booking/status, free-service/calculator, product-order, places, Calendly, and payment patterns. Secondary source for appointments, not for Western calculations.                                                                                                               |
| Astra Guru (2)                | `aspt-astra-guru-dark`, `aspt-astra-guru-verdant`                                                                                                                                | Consultation, report order/status/sample, shop/product order, support, Calendly, and payment patterns. Useful for service-booking edge cases.                                                                                                                                                    |
| Single-reader portfolio (2)   | `aspt-astrologer-portfolio-cosmic`, `aspt-tarot-reading-purple`                                                                                                                  | Same compact eight business routes: consultation slots/bookings, checkout, PayPal/Stripe, and Calendly. Useful only if Sidera adopts a simple scheduled-reader flow.                                                                                                                             |
| Multi-service hub (1)         | `aspt-pandit-style-multiservice-hub`                                                                                                                                             | Consultation, reports, product/puja orders, asset usage, payments, and support. Use for multi-service lead/order linking checks, not Sidera UI semantics.                                                                                                                                        |
| Western single astrologer (1) | `aspt-western-single-astrologer`                                                                                                                                                 | Best scheduled Western appointment source: availability, Calendly, bookings, intake, account portal/files/messages, operations catalog, reports, waitlist, and workshop registration. Use if voice/video or booked sessions are approved.                                                        |

### Primary reusable source files

Use these as patterns, not blind copies:

#### Platform/media

- Current `src/server/generated-site/project-assets.ts`
- Current `src/pages/api/astropages/generated-site/assets/*`
- Current `scripts/validate-project-assets-contract.mjs`
- Chani Warm Modern `astropages/assets.manifest.json`
- Chani Warm Modern `tests/project-assets-*.test.mjs`

#### Blog

- Chani Warm Modern `src/data/articles.ts`
- Chani Warm Modern `tests/articles-backend.test.mjs`
- Chani Warm Modern `tests/generated-site/markdown-to-portable-text.test.mjs`

#### Auth/account

- Chani Warm Modern `src/server/aggregator/customer-auth.ts`
- Chani Warm Modern `src/server/aggregator/customer-account.ts`
- Chani Warm Modern `src/server/aggregator/customer-profiles.ts`
- Chani Warm Modern `src/pages/api/astropages/generated-site/customer-*`
- Chani Warm Modern `tests/customer-parity.test.mjs`
- Chani Warm Modern `tests/customer-profile-idempotency.test.mjs`

#### Western astrology

- Chani Warm Modern `src/server/aggregator/astrology-api-config.ts`
- Chani Warm Modern `src/server/aggregator/birth-chart-api.ts`
- Chani Warm Modern `src/server/aggregator/horoscope-api.ts`
- Chani Warm Modern `src/server/aggregator/moon-guide-api.ts`
- Co-Star `src/pages/api/astropages/generated-site/daily-transits.ts`
- Co-Star `src/pages/api/astropages/generated-site/synastry-chart.ts`
- Corresponding `birth-chart-api`, `horoscope-api`, `moon-guide-api`, and zodiac/compatibility tests

#### Astrologers/sessions

- Chani Warm Modern `src/server/aggregator/astro-chat.ts`
- Chani Warm Modern `src/pages/api/astro-chat/*`
- Chani Warm Modern `src/pages/api/astrologers/index.ts`
- Chani Warm Modern `tests/astro-chat-flow.test.mjs`
- Western Single Astrologer `src/pages/api/astropages/generated-site/western/*` only if scheduled sessions are approved

#### Shop/reports/payments

- Chani Warm Modern `src/server/aggregator/shop-catalog.ts`
- Chani Warm Modern `src/server/aggregator/report-catalog.ts`
- Chani Warm Modern `src/server/aggregator/product-orders.ts`
- Chani Warm Modern `src/server/aggregator/reports-api.ts`
- Chani Warm Modern `src/server/aggregator/payments/*`
- Chani Warm Modern `src/pages/api/astropages/generated-site/{checkout-intents,product-orders,report-orders,payments,webhooks}*`
- Chani Warm Modern `tests/{shop-api,reports-api,shop-checkout-contract,payments-security,payment-webhook-integration,stripe-only-checkout}.test.mjs`
- Divyastra Sacred Grove customer cart/order/tracking/invoice routes only for explicitly approved later features

### What not to copy

- Brand/layout/components from template variants.
- Vedic provider payloads, `KUNDLI`/`MATCHING` selectors, INR defaults, puja flows, or Pandit product semantics.
- Hard-coded fallback success when DB, secret, provider, SES, or payment configuration is absent.
- Old `/assets/...` or external CDN image URLs where Project Asset aliases exist.
- Duplicate `ap_blog_posts` when EmDash `posts` is available.
- Admin consoles unrelated to the Sidera release.
- PayPal/Razorpay code unless a product decision explicitly selects those providers.

## Phased implementation plan

### Phase 0 — Preflight and ownership

- Re-read live trackers and `git status --short`.
- Create a backend slice tracker entry/section before code changes so other sessions can see ownership.
- Freeze the exact page/component consumers for the slice.
- Confirm the Content Studio error log has no applicable unresolved rule being repeated.
- Create an isolated branch/commit scope only when the user requests implementation/commit.

Exit gate: scope, owner, source template, tables, routes, and tests are named without overlapping another active session.

### Phase 1 — Project Asset seed and media normalization

- Add a deterministic embedded-PNG extraction script.
- Extract only the non-Home sets; deduplicate byte-identical images.
- Register the six Blog covers first; keep the verified Report, Shop, and Astrologer mappings ready for their own domain slices rather than connecting them prematurely.
- Extend the asset manifest with generated hashes and dimensions for the assets included in the active domain slice.
- Add `EntityImage` normalization and safe fallback tests.
- Do not connect components yet if the asset contract fails.

Exit gate: manifest/seed/asset lifecycle tests pass; no data URI, external preview hostname, raw R2 key, or duplicate byte payload enters runtime data.

### Phase 2 — Blog vertical slice

- Register/confirm dynamic EmDash `posts` schema including featured image and SEO.
- Seed the six approved articles without overwriting edited records.
- Port the list/detail normalization pattern.
- Wire `/blog` and `/blog/[slug]` to published posts with locale fallback.
- Reuse existing Article cards/sections; pass image props through existing common components.
- Make Home Blog preview query the same loader only after Blog is approved; preserve all Home chart sections.

Exit gate: list/detail/related/SEO/image/locale/empty behavior works; public GET creates no EmDash mutations; save–reload–restore passes for one article field/image association.

### Phase 3 — Read-only business catalogs

- Add D1 tables/forward migrations for Shop products, Report products, Astrologers, and services.
- Deliver the catalogs as bounded sub-slices: Reports with six covers, Shop with nine product images, and Astrologers with nine unique portraits.
- In each sub-slice, seed current Sidera IDs/slugs and associate that domain's approved Project Asset URLs before presenting the page for review.
- Port repository/list/detail functions and view-model normalizers.
- Wire Shop, Reports, and Astrologer routes to repositories.
- Keep business values D1-owned and interface copy EmDash-owned.
- Update Home preview sections to read canonical entities only after each destination domain passes review.

Exit gate: filtering, details, missing slugs, empty DB, inactive records, stable ordering, localized price display, and image fallbacks pass without payment/provider calls.

### Phase 4 — Auth, profiles, and Account foundation

- Complete signup and reset endpoints behind current Auth UI.
- Add customer settings mutation with CSRF.
- Add owned birth/person profile CRUD and idempotency.
- Replace Account People and Settings fixtures first.
- Build authenticated Account aggregate loaders while leaving unavailable domains as honest empty states, not fixtures.

Exit gate: cross-account reads/mutations fail; CSRF/session expiry and validation are visible; no password/token/birth/contact data appears in logs.

### Phase 5 — Astrology calculations

- Add provider configuration and secret contracts.
- Port Western birth chart, horoscope, Moon, current sky, and synastry adapters.
- Persist customer-owned readings with safe normalized results.
- Replace dummy result routes one flow at a time, retaining current approved casting/loading presentation.
- Populate Account Saved Charts from authoritative readings.

Exit gate: success, invalid input, missing configuration, provider timeout/failure, usage limit, cache, ownership, locale, and no-charge/no-fake-success paths pass.

### Phase 6 — Astrologer sessions

- Implement the approved first-release modes: prepaid live text chat and a fixed-price written question; do not add a wallet.
- Port directory/service/session/message behavior, adapting wallet checks into server-authoritative Stripe-paid entitlements.
- Server-resolve the existing `15/30/45/60` minute duration and price before checkout; never accept a browser total.
- Reserve/consume each entitlement idempotently so duplicate requests cannot start multiple paid sessions.
- Port the Western single-astrologer Calendly availability, booking linkage, cancellation, and signed webhook patterns for scheduled appointments.
- Use owned birth profiles when a session requires chart context.
- Populate Account Sessions from the authoritative session store.
- Keep voice/video unavailable until a selected provider passes its own contract and end-to-end test.

Exit gate: eligibility, unavailable astrologer, unpaid/used/mismatched entitlement, duplicate checkout/webhook/session creation, provider error, concurrent sends, duration enforcement, Calendly event reconciliation, ownership, transcript safety, and history pagination pass.

### Phase 7 — Commerce and reports

- Confirm Stripe-only decision and fulfillment/tax/shipping requirements.
- Create checkout intent from server-resolved catalog data.
- Create the authoritative source order before payment.
- Verify Stripe webhook/confirmation idempotently.
- Link the canonical lead after order creation; mark converted only after verified payment.
- Generate reports only for paid owned orders; authorize download/status by account/order token contract.
- Send transactional email through the existing template system.
- Populate Account Orders from product/report sources.

Exit gate: price tampering, duplicate submission/webhook, failed payment, missing secrets, email failure, report failure/retry, order ownership, fulfillment, and lead conversion tests pass.

### Phase 8 — Sidera-specific Transit and Retrograde capabilities (`DONE 2026-08-13`)

- Re-read the live trackers and all completed provider contracts before claiming either flow.
- `CHART-03` Transit calculation now uses the proven Western provider, session-derived profile ownership, CSRF, reading persistence, cache, DST-aware timezone calculation, and safe error boundary.
- `RETROGRADE-01` now supplies current/year Retrograde data through the shared provider/cache boundary.
- Preserve the existing Transit and Retrogrades UI and common components; these flows do not need the supplied raster image sets.
- Prepared real-route fixtures were removed after authoritative success, validation, failure, missing-configuration, locale, cache, CSRF, and ownership tests passed.

Exit gate: both Sidera-specific capabilities are real, normalized, and explicitly fail when unavailable; no fixture fallback or invented success remains on their real routes.

### Phase 9 — Cleanup and release readiness

- Remove only fixture imports no longer consumed by real routes.
- Keep deterministic test fixtures inside tests, not production loaders.
- Update analytics manifest for new tables and approved non-sensitive metrics.
- Update capability/runtime/secret contracts together.
- Run all focused and full gates.
- Perform authenticated browser review on desktop and mobile.

Exit gate: no real route can silently fall back to demo business data, and no approved Home chart presentation changed.

## Security, privacy, and operational requirements

- Public and `?preview=1` GET rendering stays read-only.
- Require customer session and CSRF for protected mutations.
- Resolve ownership from session identity.
- Use idempotency keys/deterministic dedupe for orders, payments, profiles, messages, and leads where retries are possible.
- Validate and normalize at the server boundary. Browser validation is only UX.
- Re-resolve catalog price/currency/active status/variants/stock server-side.
- Verify provider signatures before payment state changes.
- Use timeouts and bounded retries for external providers; do not retry chargeable requests blindly.
- Cache public astrology/sky results with an explicit key including date/timezone/locale/provider version as applicable.
- Never log raw tokens, passwords, cookies, provider secrets, payment payloads, contact details, birth data, private messages, or full result payloads.
- Never expose private report URLs as permanent public media aliases.
- Return explicit safe errors when DB/provider/SES/payment configuration is absent. Never show fake success.
- Keep all migrations forward-only and apply them to a fresh isolated local D1 database in tests.

## Verification matrix

Every slice gets focused tests plus the repository gates appropriate to its risk.

### Media

- Embedded image occurrence/unique-hash audit is deterministic.
- Home file is excluded by test/config.
- Asset manifest hashes, MIME, dimensions, aliases, and seed files match.
- Alias delivery, replacement, release export/import, alt/fallback, and no-layout-shift contract pass.

### Dynamic content/catalogs

- Published/draft/locale fallback behavior.
- Stable slug, ordering, filtering, pagination, missing record, inactive record, and empty-store behavior.
- Page list/detail/home-preview consistency.
- One entity image is reused across all consumers without duplicate hard-coded URL ownership.

### Auth/private data

- Session and CSRF enforcement.
- Cross-account record denial.
- Password reset/OTP expiry, attempt bounds, one-time use, and generic response behavior.
- Sensitive fields absent from logs and public responses.

### Providers/calculations

- Normalized request/response fixtures.
- Invalid date/time/place/timezone/profile combinations.
- Timeout, upstream error, malformed response, missing secret, and usage-limit behavior.
- No fabricated result and no charge on failure.

### Orders/payments

- Server-authoritative pricing.
- Multi-line quantities/variants, empty cart, inactive/changed product, currency, tax/shipping policy.
- Idempotent order/payment/webhook transitions.
- Failed/cancelled/retried payment.
- Authorized order/report status and download.
- Lead source link and conversion timing.
- Email template render and explicit delivery failure behavior.

### Standard command gate

```sh
pnpm run project-assets:contract
pnpm run sales:contract
pnpm run users-data:contract
pnpm run secrets:contract
pnpm run test
pnpm run scan:safety
pnpm run d1:schema:check
pnpm run cloudflare:contract
pnpm run typecheck
pnpm run build
git diff --check
```

Also apply all migrations to a fresh isolated local D1 store and exercise the real endpoint/route for the implemented slice. Content schema/media changes require the authenticated Content Studio save–reload–restore workflow and review against `CONTENT_STUDIO_ERROR_LOG.md`.

## Decisions required before the related phase

These do not block the recommended media/Blog first slice.

Resolved for Astrologer sessions on `2026-08-12`: prepaid `15/30/45/60` minute chat via Stripe, fixed-price written questions, no first-release wallet, Calendly for scheduled appointments, and no voice/video until a call provider is selected.

Resolved on `2026-08-12`: Shop and Report orders use the existing Stripe-only payment contract.
2. **Voice/video provider:** select a real call provider before enabling either mode; Calendly schedules an appointment but does not supply the call technology.
3. **Session cancellation/refund:** confirm the cutoff and refund/credit policy for unused or partially used prepaid sessions and cancelled Calendly bookings.
4. **Astrology provider:** confirm use of the locally proven Western AstrologyAPI adapter and the production quota/usage-limit policy.
5. **Report fulfillment:** confirm provider endpoints, generation SLA, retry ownership, and download expiry.
6. **Shop fulfillment:** confirm inventory, variants, shipping regions/rates, tax, address, cancellation, tracking, and refund scope.
7. **OTP:** decide whether signup/login needs email OTP now or password plus reset is sufficient.
8. **Reference media approval:** confirm that the 26 unique non-Home PNG bytes are approved production seed assets and have the required usage rights.

## Definition of done

Backend/API/image wiring is complete only when:

- Every active route reads copy, business data, customer data, provider data, and images from its declared canonical owner.
- No real route depends on production fixture arrays for an implemented domain.
- Shop, Reports, Blog, and Astrologer images are Project Assets associated through authoritative entity records.
- Home reuses canonical destination data without changing its approved chart imagery.
- All customer records are ownership-scoped and all mutations have the required session/CSRF/idempotency controls.
- All prices, totals, provider results, payment states, order states, and entitlements are server-authoritative.
- Account collections are projections of real profiles/readings/orders/sessions, not duplicate stores.
- Empty, failure, unavailable, and missing-configuration states are honest and localized.
- Content Studio, Project Asset, migration, focused, full test, typecheck, build, security, and browser gates pass.
- Each approved slice is isolated and committed only after explicit user approval, following the existing page/component workflow.
