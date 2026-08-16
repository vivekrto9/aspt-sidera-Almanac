# Sidera Almanac Agent Notes

This repository is the Sidera Almanac astrology theme. Preserve its Almanac identity and keep the existing AstroPages runtime, Content Studio, authentication, lead, asset, and deployment contracts intact.

Before cloning this repository into another Sidera theme, or debugging a freshly cloned theme, read `THEME_CLONE_NON_UI_CHECKLIST.md` and `THEME_CLONE_UI_CHECKLIST.md`. Complete the environment, Cloudflare binding, D1 schema, provider, asset, fallback, and visual smoke checks before treating a runtime error as a UI problem or considering the clone complete.

Core rules:

- Inspect current code before editing; old AstroConnect or Pandit assumptions may be stale.
- Keep new public copy and visual work aligned with Sidera Almanac's editorial astrology direction and the supplied `Theme 2 (Almanac).dc.html` reference.
- Public render must be read-only. Do not create EmDash schema, entries, drafts, or content release rows from `GET /` or `GET /?preview=1`.
- Content edits should go through EmDash tools/APIs: Content Studio, MCP, EmDash REST/admin, or approved content import. Do not raw-write EmDash content tables for user/agent edits.
- Use migrations for deployed schema and runtime table changes.
- AstroPages Admin owns template semantic versions, release notes, and changelog entries. Do not add template release versions or registry release IDs to source manifests, bootstrap state, or capability locks. Capability versions remain source-controlled contracts.
- Generated-site Worker deploys must not require `BUILDER_MCP_TOKEN` or `BUILDER_MCP_PROVISION_SECRET`.
- Generated-site Worker runtime secrets are `EMDASH_ENCRYPTION_KEY` and `ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN`.
- Generated-site GitHub variables must stay generic: `PREVIEW_SITE_URL`, `PREVIEW_SITE_D1_DATABASE_ID`, `PREVIEW_SITE_SESSION_KV_NAMESPACE_ID`, `PRODUCTION_SITE_URL`, `PRODUCTION_SITE_D1_DATABASE_ID`, and `PRODUCTION_SITE_SESSION_KV_NAMESPACE_ID`.
- Never log raw tokens, secrets, customer passwords, session cookies, or content snapshot payloads.

Important reusable areas:

- `src/builder/registry.ts`: Sidera editable content collections, entries, fields, and release targets.
- `src/server/generated-site/emdash-bootstrap.ts`: explicit generated-site content materialization and fast edit readiness.
- `src/server/generated-site/content-release.ts`: deterministic public-content snapshot export/import.
- `src/server/generated-site/content-release-middleware.ts`: EmDash mutation tracking for Content Studio, MCP, REST/admin, and import paths.
- `src/server/aggregator/admin-sso.ts`: generated-site SSO/session exchange.
- `LEADS.md`: canonical lead contract, source mapping, wiring checklist, and local D1 verification commands.
- `src/server/aggregator/lead-records.ts`: generic lead creation, source-record linking, dedupe, and conversion helpers.
- `.astropages/generated-site-workflows`: seed workflows installed into generated repos.
- `scripts/cloudflare-runtime-contract.mjs`: Cloudflare resource, binding, and secret contract.

Before adding or changing any visitor form, booking, order, newsletter, support, or payment flow, read `LEADS.md` and keep its lead-linking checks in the derived template.

Verification before handoff:

```sh
pnpm run test
pnpm run scan:safety
pnpm run d1:schema:check
pnpm run cloudflare:contract
pnpm run typecheck
pnpm run build
git diff --check
```

## Email Template System

- The transactional email contract must be declared in `astropages/email-templates.manifest.json`. Runtime state belongs in D1: `ap_email_templates` stores the active template per environment, `ap_email_events` stores event definitions, and `ap_email_variable_mappings` is the allowlist of safe variable sources.
- `ap_email_events` is not SES delivery history and is not order history. Do not add recipients, provider message IDs, delivery statuses, order records, or webhook logs to that table. Keep operational delivery/audit data in its own purpose-built store only when a separate requirement explicitly calls for it.
- Before saving a template, create or confirm its event definition and approve every required variable mapping. Variable mappings may use only the supported non-sensitive sources (`event_payload`, `business_setting`, and `generated_url`); never expose secrets, credentials, auth tokens, private provider payloads, or arbitrary database fields.
- Use the generated-site email MCP tools for preview work: inspect with `email_template_list`, `email_template_get`, `email_event_list`, and `email_variable_catalog`; add definitions with `email_event_save` and `email_variable_add_mapping`; save with `email_template_save_preview`; and validate with `email_template_render_sample`. `email_template_save_draft` is only a deprecated alias for the active preview save.
- MCP email-template operations are preview-only and intentionally provide no publish tool. Production publication must go through the service-authenticated generated-site email-template publish API invoked by the AstroPages control plane, using the reviewed preview template, event, and variable mappings. Keep preview and production D1 state separate; never promote by raw SQL, manual row copying, or direct database mutation.
- Every enabled template must have a stable key, event type, audience, locale, subject, HTML body, text body, declared required variables, and a representative sample payload. Every declared variable must be approved and actually used, every referenced variable must be declared, and marketing events must include `unsubscribeUrl`.
- Preserve service authentication on generated-site email-template APIs, MCP token authentication at `/_emdash/api/mcp`, runtime variable validation, HTML/text rendering, SES sender configuration checks, and safe error responses. Never return fake success when D1 or SES configuration is unavailable, and never make template editing depend on SES delivery-history tracking.
- For schema or seeded-contract changes, add a new numbered migration and update the manifest, table constants, store/API/MCP behavior, notification call sites, and focused tests together. Do not edit an already-applied migration. Run the repository email-template contract/store tests plus the applicable D1 schema, safety, typecheck, and build checks before handoff.
