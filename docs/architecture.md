# Architecture

GleeCars web is the public marketplace. It is a Next.js App Router application. The NestJS API is a separate service and is not required to run this app.

## Request path

1. `src/proxy.ts` negotiates the locale and prefixes the URL (`/en`, `/ar`, ...).
2. Server Components render the page from the market in the path: `/{locale}/{country}/{city}`.
3. Catalog reads go through `src/server/catalog/catalog.ts`. Zod contracts live in `src/domain/catalog/contract.ts`. The NestJS HTTP calls live in `src/server/catalog/remote-catalog.ts`. The service file only chooses fixture or remote.

Public rent URLs, canonical tags, hreflang, sitemap, and country-host redirects are documented in `docs/seo.md`.
4. The browser calls only this origin, under `/api/v1`. Those route handlers use the same repository.

## Catalog source

`API_BASE_URL` is the switch.

- Unset: the repository serves the in-process fixture in `src/domain/catalog/fleet.ts`.
- Set: the repository calls NestJS and validates the JSON against the contract in `src/server/catalog/repository.ts` before it reaches the UI.

Do not import the fixture fleet into a Client Component. Prices, search, and suggestions must keep going through the repository so the UI does not grow a second data source.

## Rendering

Cache Components and Partial Prefetching are enabled. Market pages prerender from `generateStaticParams`. Display currency is a cookie, so prices render inside `<Suspense>` and the rest of the page can stay in the static shell. Search query strings are request data and render inside `<Suspense>` on the search page.

## What this app does not own

Authentication, bookings, supplier inventory, and foreign-exchange rates belong to NestJS. The enquiry route returns `501` until `API_BASE_URL` is set, and the car page does not pretend a request was sent.
