# AstroPages Leads (`leads.v1`)

This file is the implementation reference for agents deriving a theme from `sidera-almanac`. The base provides the generic D1 contract and server helpers, but intentionally does not expose a standalone public lead endpoint or ship vertical forms.

## Source of truth

- `astropages/leads.manifest.json` defines the semantic model, kinds, sources, and the only detail fields that may be persisted.
- `migrations/0005_leads.sql` creates `ap_leads`, its indexes, and the privacy-safe `ap_business_events` timeline.
- `src/server/aggregator/lead-records.ts` validates contact details, records consent, normalizes identifiers, allowlists JSON, deduplicates records, and links conversions.
- `src/server/aggregator/db/tables.ts` owns table names.
- `tests/generated-site/lead-records.test.mjs` protects the reusable behavior.

Do not create a second lead table, put unbounded request bodies into `details_json`, or log contact/birth data.

## Canonical sources

| Source | Kind | When to link |
| --- | --- | --- |
| `consultation_booking` | `consultation` | After the booking row is created |
| `product_order` | `commerce` | After the product order row is created |
| `puja_order` | `puja` | After the puja order row is created |
| `report_order` | `report` | After the report order row is created |
| `newsletter` | `newsletter` | After newsletter validation/subscription |
| `support` | `contact` | After the support/contact request is accepted |

The manifest lists the allowed `details` keys for each source. Add a key to the manifest only when the product flow genuinely needs it and add a test proving unexpected fields are discarded.

## Wiring a business form

Persist the authoritative booking/order/support record first. Then call `linkBusinessLead`; the source record remains successful if the lead migration is temporarily unavailable.

```ts
import { linkBusinessLead } from "./lead-records.ts";

await linkBusinessLead({
  env,
  submission: {
    kind: "consultation",
    source: "consultation_booking",
    formKey: "consultation-checkout",
    pagePath: "/consultations/example",
    locale: "en",
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    sourceReferenceType: "consultation_booking",
    sourceReferenceId: booking.id,
    details: {
      bookingNumber: booking.bookingNumber,
      serviceSlug: booking.serviceSlug,
      amountCents: booking.amountCents,
      currency: booking.currency,
    },
  },
});
```

`linkBusinessLead` uses `<sourceReferenceType>:<sourceReferenceId>` as the deterministic dedupe key. Retries update the same lead instead of creating duplicates.

For a direct contact form without an authoritative source row, call `createLead` and require `consentContact: true`. Send a stable `idempotencyKey` from the validated form submission.

For newsletters, use `linkNewsletterLead`. It deduplicates by normalized email and records both contact and marketing consent.

## Payment conversion

After a verified payment transition succeeds, mark the linked lead converted:

```ts
await markLeadConvertedBySourceReference({
  env,
  sourceReferenceType: "consultation_booking",
  sourceReferenceId: booking.id,
  conversionReference: paymentReference,
});
```

Call this after the authoritative paid-state update. The helper is non-blocking when the leads migration has not reached an older deployment.

## Privacy and validation

- At least one valid email, phone, or WhatsApp number is required.
- Direct lead capture requires explicit contact consent.
- Store marketing consent separately; never infer it from ordinary contact consent.
- `attribution_json` accepts only UTM fields and `referrer`.
- `details_json` accepts only the source fields declared in the manifest plus `tool`.
- Business events contain only `kind`, `source`, and `formKey`; never contact or birth details.
- Do not expose a generic unauthenticated endpoint that accepts arbitrary lead payloads.
- Never print contact fields, birth details, tokens, or payment payloads in logs.

## Agent checklist for a derived template

1. Read the existing form/order implementation before changing it.
2. Keep the `leads.v1` table contract and manifest semantics aligned with this base.
3. Create the authoritative source row before linking the lead.
4. Map the source to one canonical kind and source name.
5. Pass only manifest-allowlisted `details`.
6. Use the source row ID for deterministic dedupe.
7. Make lead linking non-blocking so existing checkout/forms do not regress during rolling migrations.
8. Mark the lead converted only after a verified payment succeeds.
9. Add focused tests for validation, allowlisting, dedupe, missing-table compatibility, and conversion.
10. Apply migrations to a fresh local D1 database, exercise the real form/API, query `ap_leads`, then run the full repository verification gate.

## Local verification

Install dependencies and apply migrations:

```sh
pnpm install
pnpm run d1:migrate:local
pnpm run d1:verify:local
```

Inspect the latest records:

```sh
pnpm wrangler d1 execute sidera-almanac-site --local --command \
"SELECT id, kind, source, full_name, email, phone, details_json, created_at
 FROM ap_leads
 ORDER BY created_at DESC
 LIMIT 5;"
```

Run the focused and full gates:

```sh
node --test tests/generated-site/lead-records.test.mjs
pnpm run verify
git diff --check
```

For isolated testing, pass `--persist-to <temporary-directory>` to both the migration and query commands so existing local D1 data is not modified.
