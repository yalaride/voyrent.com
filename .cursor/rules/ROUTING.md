# Routing

## Locale

- Supported locales: `en`, `es`, `ar`, `fr`, `pt` (`src/domain/geo/locales.ts`).
- Arabic is RTL; layout sets `lang` and `dir`.
- Locale always appears in the URL for a stable address per language.

## Market paths

Primary product shape: `/{locale}/{country}/{city}/…`

- Country: lowercase ISO 3166-1 alpha-2
- City: stable English slug
- Fixture markets: `src/domain/geo/markets.ts`
- Unknown city → not-found

Home search submits to `/{locale}/{country}/{city}/search`.

Dealers: `/{locale}/dealers`.

Implementation uses a catch-all under `src/app/[locale]/[...slug]` plus dedicated routes as needed. Keep pages thin; resolve rent/market logic in `src/server/rent` and domain routing helpers.

## Public rent / SEO URLs

Canonical, hreflang, sitemap, and country-host behavior are defined in `docs/seo.md`. Highlights:

- Currency is never part of the canonical URL.
- Listing SEO copy prefers NestJS `listing.seo.title[locale]` when present; else templates in `src/server/seo/metadata.ts`.
- Slugs stay language-neutral; `locale` is sent on catalog requests for translated names.

## Navigation helpers

Use `src/i18n/navigation.ts` and domain helpers under `src/domain/routing/` instead of hard-coding locale-unaware links.
