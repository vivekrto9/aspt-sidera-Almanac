# Sidera Theme Clone: UI Checklist

Use this checklist when creating the next Sidera theme. A new theme may change its homepage structure, palette, typography, radii, and visual treatments, but copied routes must retain complete content and functional media wiring.

## Images and fallbacks

- Audit every visible image slot after cloning, including About team portraits, astrologer portraits, Shop products, Blog cards, report covers, auth artwork, and empty/fallback states.
- Do not leave decorative placeholder patterns where the section is intended to show real people or products.
- Use stable project assets or generated-site asset aliases. Do not depend on random-image services or temporary external URLs.
- When a bundled Project Asset alias is not materialized in local D1, follow the existing asset resolver pattern: serve the bundled file through `/@fs` in development and keep the stable `/_assets/aliases/...` URL for deployed environments. Verify both the rendered URL and an HTTP `200`; seeing an `<img>` tag is not sufficient.
- Keep image data outside translatable copy. Localized names and roles may come from Content Studio while their stable image source remains part of the page/entity data contract.
- Reuse shared media components (`Avatar`, `ProfileSummary`, `MediaThumbnail`) and pass the theme-specific image through their existing media props instead of rebuilding image markup per page.
- Give meaningful people and product images useful alt text, preserve circular or card crops with `object-fit: cover`, and verify desktop and mobile layouts.
- Ensure each theme's fallback background, border, and pattern use that theme's shared tokens even when the real asset cannot load.

## Required visual smoke test

- Check Home, About, Astrologers, Shop, Blog, Reports, Login, Signup, Forgot Password, Reset Password, and Account at desktop and mobile widths.
- Confirm no empty image rings, broken-image icons, copied-theme fallback colors, or layout shifts remain.
- Confirm all Content Studio edit overlays stay above page overlays and do not hide or replace media.
