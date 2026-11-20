# Architecture

GleeCars web is the public marketplace frontend. NestJS is a separate service and is not required to run locally.

## Stack

- Next.js App Router (Cache Components / Partial Prefetching)
- React Server Components by default
- next-intl for locale routing and messages
- Zod contracts at the I/O boundary
- shadcn primitives under `src/components/ui`

## Request path

1. `src/proxy.ts` negotiates locale and prefixes the URL (`/en`, `/ar`, …).
2. Server Components render from the market in the path: `/{locale}/{country}/{city}` (catch-all under `[...slug]`).
3. Catalog reads go through `src/server/catalog`. Zod contracts live in `src/domain/catalog/contract.ts`. Remote HTTP lives in `src/server/catalog/remote-catalog.ts`.
4. The browser calls only this origin under `/api/v1`. Route handlers use the same repositories.

## Catalog source

`API_BASE_URL` is the switch:

- Unset → in-process fixture (`src/domain/catalog/fleet.ts`)
- Set → NestJS, validated before it reaches the UI

Do not import the fixture fleet into a Client Component. Prices, search, and suggestions must go through the repository so the UI never grows a second data source.

## Rendering

- Market pages prerender from `generateStaticParams`.
- Display currency is a cookie → prices render inside `<Suspense>`; the rest can stay static.
- Search query strings are request data → render inside `<Suspense>` on the search page.

## Out of scope for this app

Authentication, bookings, supplier inventory, and FX settlement belong to NestJS. Enquiry returns `501` until `API_BASE_URL` is set.
