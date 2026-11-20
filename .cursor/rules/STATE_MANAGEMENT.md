# State management

This app does **not** use a global client store (no Redux, Zustand, or React Query). Prefer server data, URL, and cookies.

## Sources of truth

| Concern | Source |
| --- | --- |
| Catalog / search results | Server repository → RSC or BFF |
| Locale | URL prefix (`/en`, `/ar`, …) via next-intl + `proxy.ts` |
| Market (country/city) | URL path |
| Search filters | URL query string |
| Display currency | `gc_currency` cookie |
| Ephemeral UI (menus, typed query) | Local `useState` in Client Components |

## Rules

- Do not mirror the catalog into client global state.
- Currency override must not change the canonical URL; supplier currency stays in structured data.
- Cookie-dependent price UI must be inside `<Suspense>` so the static shell can stay cacheable.
- Search query–dependent UI must be inside `<Suspense>`.
- Keep client state local to the feature that needs it (`search-panel`, switchers, mobile menu).

## Preferences

Currency preference writes go through `src/features/preferences` / `src/server/preferences`. Do not invent a parallel cookie key.
