# Folder structure

```
docs/                         Product and API notes. Not served by Next.js.
messages/                     UI copy, one JSON file per locale.
public/                       Static files.
src/app/                      Routes only. Pages stay thin.
  [locale]/                   Locale root layout (html lang and dir).
    [...slug]/                Market: home, search, car detail (country/city paths).
    dealers/                  Supplier introduction.
  api/v1/                     BFF. Same handlers the browser can call.
src/components/ui/            shadcn primitives. No product logic.
src/domain/                   Pure types, reference data, search rules. No React, no fetch.
src/features/                 Product UI, grouped by capability.
src/i18n/                     next-intl routing and message loading.
src/lib/                      Environment and site constants.
src/proxy.ts                  Locale negotiation.
src/server/                   The only I/O boundary. Repositories, HTTP, cookies, SEO.
.cursor/rules/                Agent and contributor rules (this folder).
```

## Dependency direction

```
app / features  →  server  →  domain
```

- `domain` must not import `server`, `features`, or `app`.
- Client Components may import `domain` types and search-href helpers.
- Client Components must not import `src/server` or `src/domain/catalog/fleet.ts`.

## Adding a page

1. Add the route under `src/app/[locale]`.
2. Read catalog data via a repository in `src/server`.
3. Put interactive UI in `src/features`.
4. Add copy to every file in `messages/` in the same change.
