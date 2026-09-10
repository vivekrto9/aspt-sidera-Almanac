# Payment Currency Preference

Sidera Almanac owns its payment preference in D1 at `ap_business_settings.payment_preference`. The stored value is `{ value: "USD" | "INR" | "AUTO", schemaVersion: 1, revision }`; migration `0158_payment_currency_preference.sql` creates `AUTO` only when the key is absent. Updates use an authenticated, body-bound, project/environment-bound and revision-checked `payment-settings.v1` GET/PATCH endpoint.

`AUTO` resolves trusted Cloudflare country `IN` to INR/Razorpay and every other or unknown country to USD/Stripe. Production trusts only `request.cf.country`. Astro DEV accepts `CF-IPCountry` only on a `*.trycloudflare.com` request that also has `CF-Ray`; direct localhost remains unknown/USD. The resolver is request-scoped.

## Independent fixed pricing

No exchange rate, conversion multiplier, FX lookup, or cross-currency fallback is used. USD and INR are separate fixed integer-minor-unit fields/configuration. A missing selected-currency price fails closed. Updating one denomination does not alter the other; the legacy `price_cents`/`rate_cents` columns remain synchronized only with the USD field for existing editor compatibility.

| Family | USD | INR |
| --- | ---: | ---: |
| Natal Blueprint report | $29 | ₹2,499 |
| Year Ahead report | $34 | ₹2,999 |
| Relationship Synastry report | $39 | ₹3,499 |
| Solar Return report | $27 | ₹2,299 |
| Career & Vocation report | $32 | ₹2,799 |
| Saturn Return report | $30 | ₹2,599 |
| Natal print | $48 | ₹3,999 |
| Tapestry | $64 | ₹5,499 |
| Almanac | $28 | ₹2,299 |
| Tarot | $34 | ₹2,799 |
| Notebook | $18 | ₹1,499 |
| Candle | $22 | ₹1,799 |
| Scarf | $58 | ₹4,999 |
| Pins | $16 | ₹1,299 |
| Pendant | $52 | ₹4,499 |
| Orion chat / question | $10 | ₹150 |
| Selene chat / question | $5 | ₹100 |
| Written question | $19 | ₹1,499 |
| Voice add-on / minute | $0.60 | ₹49 |
| Video add-on / minute | $1.20 | ₹99 |

Shop shipping is independently set to $6.50 below $75, or ₹499 below ₹4,999. Wallet custom limits are $20–$5,000 or ₹199–₹50,000. USD wallet packs retain $100/$250/$500/$1,000 with the existing bonuses. INR wallet packs are independently ₹999/₹2,499/₹4,999/₹9,999 with ₹0/₹250/₹1,000/₹2,500 bonuses.

## Payment and accounting behavior

- New report, shop, session and unlocked-wallet quotes persist the resolved currency and exact amount before checkout. Retry/idempotency restores that snapshot even if the owner preference later changes.
- Shop checkout idempotency is scoped to an exact cart, currency and shipping-contact fingerprint. Re-submitting the same intent restores its saved order, while changing the cart or address creates a new authoritative order instead of reopening an older Razorpay Payment Link.
- USD attempts route to Stripe Checkout; INR attempts route to Razorpay Payment Links. Both use server-side credentials and provider idempotency/reference IDs.
- Stripe and Razorpay webhooks verify the untouched raw body, provider signature, event identity, payable/account/attempt metadata, stored amount, stored currency and stored provider reference before a paid transition. Razorpay accepts both Payment Link lifecycle events (`payment_link.paid`, `payment_link.cancelled`, `payment_link.expired`) and the shared payment events used by the other AstroPages templates (`payment.captured`, `payment.failed`).
- Browser returns are non-authoritative. They may poll the stored attempt status, but only a verified webhook can mark a payable paid, credit a wallet, create fulfillment, or send the one-time receipt.
- A pending first wallet recharge reserves its currency. The first successful funding locks the wallet permanently; balances, bonuses, chat debits, refunds and ledger rows remain in that denomination. Existing money is never relabelled.
- Migration `0159_wallet_chat_dual_currency.sql` preserves existing chat sessions and messages while allowing new wallet-funded chat sessions to store either the locked USD or INR denomination.
- Historical orders, confirmations, account purchases, wallet balances and ledger rows format their saved currency.
- Secrets: Stripe uses `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`; Razorpay uses `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET`. Real values remain in Cloudflare secrets.

## Verification record

Verified on 2026-09-10 on the template's local `feature/payment-preference` branch. Local D1 migrations applied cleanly and a second migration-list pass reported nothing pending. Read-back confirmed `AUTO` and fixed chat rates of `$10`/`₹150` for Orion and `$5`/`₹100` for Selene. `pnpm run verify` passed 877/877 tests plus project-assets, sales, users-data, secrets, safety, D1 schema and Cloudflare runtime contracts; Astro typecheck reported 0 errors (12 existing hints), and the production build passed. `git diff --check` passed.

The adapted Playwright CLI scripts passed independently against both local runtimes:

- Actual Astro DEV: 4/4 scenarios — forced INR, forced USD, AUTO direct-localhost unknown → USD, and AUTO through the real India Cloudflare quick Tunnel `environmental-measures-decrease-holds.trycloudflare.com` (BOM) → INR.
- Built Worker: 3/3 scenarios — forced INR, forced USD, and AUTO using Wrangler's India `request.cf` fixture → INR.
- Numeric browser assertions covered report detail, shop catalog/detail and astrologer surfaces (`$29`/`₹2,499`, `$48`/`₹3,999`, and independent `$10`/`$5` versus `₹150`/`₹100`) and rejected mixed-currency symbols.

The payment lifecycle is covered locally by backend tests: exact provider minor units/currency; Stripe and Razorpay raw-body signature verification; successful paid reconciliation; duplicate-event idempotency; status transitions; verified-webhook-only wallet credit; saved currency on success, pending, failed and cancelled UI states; and saved amount/currency in confirmation, receipt email payload, order history and My Account. Receipt delivery uses a stubbed SES transport with a one-time notification claim. This template has no separate invoice-document feature, so invoice generation is not applicable.

Generated browser results and screenshots were reviewed and moved to the macOS Trash as requested; `output/`, `playwright-report/`, and `test-results/` are ignored by Git. No exchange multiplier exists in source or migrations.

Not performed: deployment, live Stripe/Razorpay settlement, real receipt delivery, or control-plane UI/AI integration. Those remain external follow-up work and are not implied by local completion.
