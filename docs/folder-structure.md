# Folder structure

```
docs/                         Product and API notes. Not served by Next.js.
messages/                     UI copy, one JSON file per locale.
public/                       Static files.
src/app/                      Routes only. Pages stay thin.
  [locale]/                   Locale root layout (html lang and dir).
    [country]/[city]/         One market: home, search, car detail.
    dealers/                  Supplier introduction.
  api/v1/                     BFF. Same handlers the browser and, later, other clients can call.
src/components/ui/            shadcn primitives. Do not put product logic here.
src/domain/                   Pure types, reference data, and search rules. No React, no fetch.
src/features/                 Product UI, grouped by capability.
src/i18n/                     next-intl routing and message loading.
src/lib/                      Environment and site constants.
src/proxy.ts                  Locale negotiation.
src/server/                   The only I/O boundary. Repositories, HTTP client, cookies.
```

## Dependency direction

`app` and `features` may call `server`. `server` may call `domain`. `domain` must not import `server`, `features`, or `app`. Client Components may import `domain` types and search-href helpers. They must not import `src/server` or `src/domain/catalog/fleet.ts`.

## Adding a page

Add the route under `src/app/[locale]`. Read catalog data with a repository function. Put interactive UI in `src/features`. Add copy to every file in `messages/` in the same change.
