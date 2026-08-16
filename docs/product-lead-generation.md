# Product lead-generation demo

The `/lead-generation-demo` page implements Sidera's birth-chart guidance enquiry. It shows how the theme turns a chart CTA into a privacy-safe lead stored in the canonical `leads.v1` table.

## Visitor flow

1. The visitor selects **Request product details**, **Check availability**, or **Send my request**.
2. The browser opens an accessible native `<dialog>` containing the enquiry form.
3. The visitor provides a name, an email or phone number, optional context, and explicit contact consent.
4. The browser sends a small JSON payload to:

   ```text
   POST /api/astropages/generated-site/leads/product-interest
   ```

5. The endpoint rejects oversized or invalid requests, ignores a honeypot submission, and maps only known fields into `createLead`.
6. `createLead` normalizes contact details, allowlists attribution and detail fields, deduplicates retries, writes `ap_leads`, and records a privacy-safe `lead.created` event.
7. The dialog switches to a confirmation state and shows the returned lead reference.
8. The shareable-route section exposes the current environment URL and provides a one-click copy action.

## Data mapping

| Form value | Lead field |
| --- | --- |
| Name | `full_name` |
| Email | `email`, `normalized_email` |
| Phone | `phone`, `normalized_phone` |
| Consent checkbox | `consent_contact`, `consent_at` |
| Generated request key | `idempotency_key`, deterministic `dedupe_key` |
| UTM query parameters and referrer | allowlisted `attribution_json` |
| Optional visitor message | allowlisted `details_json.message` |
| Chart context | `kind=contact`, `source=support`, `form_key=sidera-chart-guidance` |

The endpoint never persists the honeypot field or an arbitrary request-body property. It does not log contact data.

## Files involved

- `src/pages/lead-generation-demo.astro` — product presentation, modal form, submission and success states.
- `src/styles/product-lead-demo.css` — route-specific responsive product and dialog styling.
- `src/data/product-lead-demo.ts` — isolated product, CTA, form, and SEO copy.
- `src/pages/api/astropages/generated-site/leads/product-interest.ts` — product-specific public endpoint.
- `src/server/aggregator/lead-records.ts` — canonical validation, normalization, allowlisting, deduplication, and persistence.
- `astropages/leads.manifest.json` — supported lead kinds, sources, and persisted detail fields.
- `migrations/0005_leads.sql` — `ap_leads` and `ap_business_events`.
- `tests/generated-site/product-interest-lead.test.mjs` — endpoint behavior.

## Run locally with real D1 persistence

Install dependencies, apply the local migrations, and start the Cloudflare Worker:

```sh
pnpm install
pnpm run d1:migrate:local
pnpm run build
pnpm wrangler dev --local --port 4321
```

Open `http://localhost:4321/lead-generation-demo` and submit the form.

### Check the latest five leads

Run this from the `sidera-almanac` directory:

```sh
pnpm wrangler d1 execute sidera-almanac-site --local --command \
"SELECT id, status, full_name, email, phone, source, form_key, page_path, created_at
 FROM ap_leads
 ORDER BY created_at DESC
 LIMIT 5;"
```

Use `pnpm run dev` only for visual work. The standard Astro development server does not provide the Cloudflare D1 binding, so form persistence requires `wrangler dev`.

## Adapt the chart enquiry

1. Replace the reference image in `public/images/` and update the chart defaults in `src/data/product-lead-demo.ts`.
2. Change the chart offering and form key in the endpoint.
3. Keep the endpoint product-specific; do not expose a generic route accepting arbitrary lead fields.
4. If the visitor is making an actual order, create the authoritative order first and use `linkBusinessLead` with `source=product_order` instead of this direct contact flow.
5. If more detail fields are genuinely required, add only those keys to `astropages/leads.manifest.json` and cover their allowlisting in a focused test.
6. Run the full verification gate:

   ```sh
   pnpm run verify
   git diff --check
   ```

For the reusable lead contract and payment conversion guidance, read [`../LEADS.md`](../LEADS.md).
