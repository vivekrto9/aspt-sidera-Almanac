# Sidera Theme Clone: Non-UI Checklist

Use this checklist whenever a new Sidera theme is created from an existing theme repository. A source-code copy does **not** copy ignored secrets, local Cloudflare state, deployed resources, or database schema state. Finish these checks before starting visual QA.

This document records the non-UI issues encountered while creating Sidera Meridian from Sidera Warm and the rules that should prevent them in the next theme.

## 1. Clone hygiene

- Copy the source repository without copying its `.git` directory.
- Initialize the new repository and set the intended remote only after confirming the copied files.
- Update repository identity in `README.md`, `AGENTS.md`, package metadata, Worker names, and deployment configuration.
- Do not assume that copying `wrangler.jsonc` should keep the source theme's D1, KV, R2, or Worker resource names. Decide explicitly whether the new theme must share or own each resource.
- Never copy `.wrangler/state` as a substitute for migrations. It is machine-local runtime state, not a portable database contract.

## 2. Environment and secrets

Files such as `.dev.vars` and `.env` are normally ignored and may be absent after a clone even when the source project works.

### Required groups to verify

- Core AstroPages/EmDash: `EMDASH_ENCRYPTION_KEY`, `BUILDER_MCP_TOKEN`, `BUILDER_MCP_PROVISION_SECRET`, `ASTROPAGES_PROJECT_ID`, `ASTROPAGES_SITE_ENVIRONMENT`, SSO/callback values.
- Cloudflare/deployment: account/token values and preview/production D1, KV, and URL values.
- Stripe wallet/payment: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- Astrology provider: `ASTROLOGY_API_BASE_URL`, `ASTROLOGYAPI_USER_ID`, `ASTROLOGYAPI_PASSWORD`, optional legacy `X_ASTROLOGYAPI_KEY`, `ASTROLOGYAPI_CHAT_BASE_URL`, and `TRANSIT_CALC_BASE_URL`.
- Calendly values only if scheduling remains enabled.

Rules:

- Copy real local values through a secure local process; never commit them.
- Keep `.env.example` and `.dev.vars.example` synchronized with the variables the runtime actually reads.
- Compare variable **names**, not secret values, when auditing source and cloned repositories.
- Restart the dev Worker after changing `.dev.vars`.
- A present key is not automatically the correct authentication method. The current birth-chart and horoscope provider should prefer Basic authentication from `ASTROLOGYAPI_USER_ID` and `ASTROLOGYAPI_PASSWORD`, with `X_ASTROLOGYAPI_KEY` only as the supported fallback.

## 3. Cloudflare bindings and resources

Confirm every binding in `wrangler.jsonc` before running the cloned theme:

- `DB` — D1 database
- `SESSION` — KV namespace
- `MEDIA` — R2 bucket
- `ASSETS`, `IMAGES`, and `LOADER`

Check local, preview, and production environments separately. A working local binding does not prove that preview or production points to the correct resource.

The first Meridian copy retained Warm resource names in `wrangler.jsonc`. For every future theme this must be an explicit decision, not an accidental inheritance.

## 4. D1 is not cloned with the source tree

Migration files describe the schema, but the new local/preview/production database must still materialize it.

Before testing a route:

```sh
./node_modules/.bin/wrangler d1 migrations list DB --local
./node_modules/.bin/wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;"
```

Do not trust only the `d1_migrations` ledger. In Meridian, migrations `0000` through `0014` were recorded as applied while expected physical tables were missing. This produced a database whose ledger and schema disagreed.

## 5. Content Studio bootstrap versus numbered migrations

Generated-site Content Studio tables are explicitly materialized through the EmDash bootstrap flow; public `GET` requests must remain read-only and must not create schema.

The full local migration chain in Meridian stopped at migration `0015` because `ec_site_todays_sky` did not exist:

```text
D1_ERROR: no such table: ec_site_todays_sky
```

Relevant implementation:

- Bootstrap endpoint: `src/pages/api/astropages/generated-site/emdash/bootstrap.ts`
- Schema materialization: `src/server/generated-site/emdash-bootstrap.ts`
- Existing troubleshooting history: `CONTENT_STUDIO_ERROR_LOG.md`

Important: a fresh bootstrap may create a table with all current registry fields while the migration ledger still says later column migrations are pending. Blindly applying every historical migration afterward can then fail with duplicate-column errors. Reconcile schema and ledger only after verifying equivalence; do not invent or mark migration rows as applied merely to silence errors.

## 6. Runtime tables required by birth-chart flows

The following missing tables caused real Meridian failures:

### `ap_chart_readings`

Symptom:

```text
D1_ERROR: no such table: ap_chart_readings
```

Defined by:

```text
migrations/0118_birth_chart_readings.sql
```

### `ap_customer_user_profiles`

Symptom after creating `ap_chart_readings`:

```text
D1_ERROR: no such table: main.ap_customer_user_profiles
```

The second error occurs because `ap_chart_readings.profile_id` references the profile table. It is defined by:

```text
migrations/0110_customer_profiles_and_preferences.sql
```

The profile migration also adds `house_system`, `zodiac_system`, and `daily_horoscope` to `ap_customer_accounts`.

For this damaged local schema, the existing idempotent/verified migrations were applied directly and then checked with `sqlite_master`, `PRAGMA table_info(...)`, and `PRAGMA foreign_key_check`. This was a local repair, not a replacement for fixing the full migration/bootstrap lifecycle.

Also verify `migrations/0119_astrology_provider_cache.sql` before testing provider-backed cached views.

## 7. Runtime table and seed required by the astrologer directory

Symptom:

```text
0 astrologers available
No astrologers match that.
```

In Meridian this was not a search/filter or UI problem. The local D1 database had no `ap_astrologers` table, while `listAstrologers(runtimeEnv)` intentionally queries D1 whenever the `DB` binding exists. Its in-code fallback is used only when there is no D1 binding; a bound but incomplete database therefore returned an empty directory.

Required migrations, in order:

```text
migrations/0108_astrologer_directory.sql
migrations/0151_chani_chat_astrologer_catalog.sql
```

Migration `0108` creates and initially seeds `ap_astrologers`. Migration `0151` applies the intended chat-only catalog: it deactivates the old entries and keeps exactly Orion Hale (`KUNDLI`) and Selene Marlowe (`MATCHING`) active. After applying them, verify both the active count and the expected slugs instead of checking only that the table exists.

## 8. Provider failures are separate from D1 failures

Errors encountered:

- `Birth chart provider request failed.`
- `This data is temporarily unavailable.`
- `Astrology chat provider is not configured.`
- `The astrologer could not reply right now. Please try again.`

Debug in this order:

1. Confirm the route can read its D1 tables.
2. Confirm the relevant environment variables exist in the Worker process.
3. Confirm base URL and authentication mode.
4. Inspect the provider HTTP status and safe response body server-side.
5. Confirm the response parser matches the provider payload.
6. Only then debug the page component.

Never replace a provider failure with static astrology data. UI preview wheels may be decorative, but submitted results, today's sky, transits, moon data, horoscope content, and chat responses must come from the intended calculation/provider flow.

## 9. Generated assets and D1

A stack trace from `handleAssetDeliveryRequest` or `src/server/generated-site/project-assets.ts` can still be a D1/schema/binding issue rather than a broken asset component. Verify the `DB` binding and required generated-site tables before changing asset UI code.

## 10. Local, preview, and production are independent

- `--local` changes only local D1 state.
- Preview and production need their own migrations/bootstrap and secrets.
- Never report a production issue fixed because a local migration succeeded.
- Run remote operations only against an explicitly confirmed environment/database.

## 11. Pre-UI smoke test for every new theme

Before styling review, verify at least:

- Home provider-backed sections render real data or an intentional safe error.
- Birth chart submission creates and opens a result.
- Login, account, and profile creation/load work.
- Wallet balance, recharge, Stripe success/failure, and recent transactions work.
- Astrologer selection, profile picker, chat session creation, eligibility/recharge, message response, and chat history work.
- Today's sky, transit, moon calendar, daily horoscope, synastry, and retrogrades do not rely on copied static values.
- Content Studio loads and saves registered content without schema mutation during public page reads.

## 12. Verification before handoff

Run the repository checks from `AGENTS.md`, including:

```sh
pnpm run test
pnpm run scan:safety
pnpm run d1:schema:check
pnpm run cloudflare:contract
pnpm run typecheck
pnpm run build
git diff --check
```

Additionally compare the actual D1 tables with the runtime routes being reviewed. Build and unit-test success alone cannot detect an empty or schema-drifted local D1 database.

## 13. Handoff reporting

After every change, report:

- Pages/routes affected
- Source files modified
- Migrations or local database state changed
- Environment variable names added/changed (never values)
- Verification performed
- What remains local-only versus what still needs preview/production work

## 14. Content Studio collection-not-found after cloning

Symptom:

```text
site_astrologers/astrologers: Collection 'site_astrologers' not found
```

This is a Content Studio bootstrap/schema problem, not an astrologer-card UI problem. In Meridian, `site_astrologers` and its `site_astrologers/astrologers` target were already present in `src/builder/registry.ts`, but the cloned local D1 contained only a partial set of EmDash collections and had no completed bootstrap state.

Recovery sequence:

1. Confirm the collection and target are declared in the current registry.
2. Compare existing `ec_*` table columns with the current registry fields. A cloned database can contain older tables that are missing newer registered columns.
3. Apply explicit migrations for known schema changes. If an older partial table still lacks current registry fields, add only those validated missing columns before retrying bootstrap; public page reads must never mutate schema.
4. Call the authenticated generated-site bootstrap endpoint explicitly. Do not expose the bootstrap secret and do not turn a public GET into an implicit bootstrap.
5. Verify the collection metadata, registered field count, all required localized published entries, and the edit-readiness endpoint.

For this local Meridian repair:

- The old FAQ content table first required `migrations/0019_faq_contact_cta_content.sql`.
- Existing cloned content tables were missing 66 current registry columns, primarily in `ec_site_birth_chart`, plus the newer `ec_site_chrome` navigation/wallet labels.
- A targeted bootstrap registered `site_astrologers`, 53 fields, and the `astrologers` entry for `en`, `es`, `fr`, `pt`, `ru`, `it`, and `de`.
- A subsequent full bootstrap processed all 48 targets and registered 336 entries.
- The deep edit-readiness check returned `ready: true` with no missing tables, collections, fields, or entries.

These operations repaired local D1 only. Preview and production require their own explicit migration/bootstrap verification.

## 15. Auth Content Studio collections after cloning

Symptoms can appear independently on each auth route, for example:

```text
site_login/login: Collection 'site_login' not found
```

The same failure can affect `site_signup/signup`, `site_forgot_password/forgot-password`, and `site_reset_password/reset-password`. First check `src/builder/registry.ts`: in Meridian all four collections, targets, and field mappings were already declared, so the source registry did not need to be recreated. The missing piece was the cloned local D1 runtime registration.

Recovery and verification:

1. Run the authenticated full generated-site bootstrap against the actual Meridian process and port.
2. Confirm `_emdash_collections` contains the four `site_*` collection IDs.
3. Confirm the physical tables exist: `ec_site_login`, `ec_site_signup`, `ec_site_forgot_password`, and `ec_site_reset_password`.
4. Verify each table has one published entry for every supported locale: `en`, `es`, `fr`, `pt`, `ru`, `it`, and `de`.
5. Run deep edit-readiness and require empty missing-table, missing-collection, missing-field, and missing-entry lists.

Localized page entries live in their individual `ec_site_*` tables; there is no generic `_emdash_entries` table in this schema. Querying a guessed shared entries table can produce a misleading secondary error while the actual registrations are healthy.

For this local Meridian repair, the full bootstrap registered all four auth collections and each now has seven localized entries. Deep edit-readiness returned `ready: true`. This is local-only state; preview and production need their own authenticated bootstrap and verification.

## 16. Signup failure from a partially migrated customer table

Symptom:

```text
D1_ERROR: table ap_customer_accounts has no column named consent_marketing: SQLITE_ERROR
```

`src/server/aggregator/customer-auth.ts` writes `consent_marketing` during signup. The canonical schema change already exists in `migrations/0109_customer_auth_mutations.sql`, but a cloned D1 database can contain newer account-preference columns while still missing this one column when its migration ledger and physical schema are out of sync.

Before changing signup code:

1. Inspect `PRAGMA table_info(ap_customer_accounts)`.
2. Confirm `consent_marketing` is the only required missing column.
3. Inspect the migration ledger instead of blindly applying every migration marked pending; a partially cloned database can already contain tables/columns from those migrations and a bulk replay may fail on duplicates.
4. Repair the local schema with the canonical definition: `consent_marketing INTEGER NOT NULL DEFAULT 0`.
5. Re-run the schema check and signup flow.

For this local Meridian database, only `consent_marketing` was missing; `house_system`, `zodiac_system`, and `daily_horoscope` were already present. The minimal local schema repair restored the signup insert contract. Preview and production must be inspected and migrated separately.

## 17. Runtime feature tables missing from a partially cloned D1

A clone can have working authentication, profiles, and chart-reading tables while still missing whole groups of runtime tables. This may remain hidden until the corresponding page performs its first database query.

For the current local Meridian D1 audit, these core tables are present and have the expected runtime columns:

- `ap_customer_accounts`
- `ap_customer_sessions`
- `ap_customer_password_resets`
- `ap_customer_user_profiles`
- `ap_chart_readings`

The initial audit found these runtime table groups absent:

- Astrology provider cache: `ap_astrology_provider_cache`
- Stripe/payment state: `ap_payment_attempts`, `ap_payment_events`
- Wallet and chat: `ap_wallets`, `ap_wallet_recharges`, `ap_wallet_transactions`, `ap_wallet_chat_sessions`, `ap_wallet_chat_messages`
- Paid/scheduled sessions: `ap_session_entitlements`, `ap_astrologer_calendly_event_types`, `ap_scheduled_sessions`, `ap_calendly_events`, `ap_session_entitlement_notifications`
- Commerce and purchase history: `ap_commerce_orders`, `ap_commerce_order_lines`, `ap_commerce_order_notifications`

Likely symptoms include wallet/chat/history/account overview, checkout/purchase history, report purchase, scheduling, or cached horoscope/astrology requests failing with `no such table` errors. Do not work around this in UI or API code. Compare the physical D1 schema with `src/server/aggregator/db/tables.ts`, inspect the migration ledger, and apply the canonical migrations in a controlled environment-specific sequence. Verify local, preview, and production independently.

For this local Meridian repair, the canonical schemas from migrations `0111`, `0113` through `0117`, `0119`, `0136`, and the table-only portion of `0146` plus the `0153` partner-profile column were restored. A follow-up inventory found no missing runtime table from `src/server/aggregator/db/tables.ts`, and direct commerce-order, session-entitlement, and wallet-transaction queries succeeded. This is still local-only D1 state; preview and production require their own migration audit and controlled application.

## 18. Generated asset data requires both R2 and D1

Creating `ap_asset_aliases`, `ap_asset_records`, and `ap_asset_revisions` fixes only the schema. The generated asset route also needs the binary objects in the configured R2 bucket and matching D1 metadata rows. A table-only repair can therefore remove `no such table` while every image still fails.

For a local clone:

1. Use the repository's project-asset seed command in explicit local mode.
2. Point it at the root `wrangler.jsonc`, pass `--local`, and upload serially because parallel Miniflare writes can contend on the local SQLite lock.
3. Store the local release row with an environment allowed by the schema (`preview` in the current contract).
4. Verify equal alias/record/revision counts and request at least one alias over HTTP; require the expected image content type and non-empty bytes.

Do not confuse `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/metadata.sqlite` with the project D1 database. Resolve the database file by its actual schema/tables instead of selecting the first `.sqlite` path.

## 19. Runtime identity must be changed beyond package metadata

A clone may build while still identifying itself as the source theme. Audit all runtime-facing identifiers, including:

- `data-site-source` and other source markers in the base layout
- locale/local-storage namespaces
- Content Studio feature IDs and release/asset keys
- API callbacks and example URLs
- test fixtures, operational scripts, manifests, workflows, and docs

Search the whole repository for the previous theme slug after the rename. Keep intentional historical references only inside troubleshooting documentation.

## 20. Build success is not typecheck success

The Cloudflare Astro integration may need a local inspector port during `astro check`; a restricted sandbox can make the command appear to hang or fail before diagnostics. Run the checker in an environment where its local inspector port is permitted. Do not use a successful production build as a substitute for typechecking.

Shared component contracts should use supported props and DOM attribute types. In Nocturne this caught invalid loading-indicator syntax, stringified `aria-busy` values, an incomplete transit locale type, a moon-event union narrowing issue, form-element typing, and an ambiguous provider-header return type.

## 21. Theme-aware fallbacks and tests

Static image fallbacks must use shared theme tokens rather than a literal fallback copied from another theme. Contract tests should assert the shared theme-token contract, not one theme's exact gradient or color values. Distinguish a bundled visual fallback from a static astrology-data fallback: decorative media is allowed, but calculated readings and provider responses must remain dynamic.

## 22. Nocturne local clone completion record

The Nocturne local drill required the same explicit repair sequence as Meridian:

- materialize all runtime D1 tables and validate them against `src/server/aggregator/db/tables.ts`
- complete the authenticated Content Studio bootstrap for all 48 targets / 46 collections and seven locales
- seed 33 generated assets into local R2 plus their D1 alias/record/revision metadata
- seed the intended two-astrologer chat catalog
- copy ignored local secrets securely and compare variable names with the source without exposing values
- verify public routes, authenticated redirects, deep edit readiness, schema/Cloudflare/asset/sales/user/secrets contracts, safety scan, typecheck, tests, and build

These steps repair local development only. Preview and production still require their own secrets, controlled migrations/bootstrap, asset seeding, and route verification.
