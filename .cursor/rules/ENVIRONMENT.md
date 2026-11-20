# Environment

Copy `.env.example` to `.env.local`. Values are validated in `src/lib/config/env.ts`.

| Variable | Role |
| --- | --- |
| `APP_ENV` | `development` \| `staging` \| `production` |
| `NEXT_PUBLIC_APP_URL` | Local/app origin (default `http://localhost:3010`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical host for SEO, sitemap, Open Graph |
| `NEXT_PUBLIC_GTM_ID` | Optional `GTM-XXXX`; empty = no tag |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional meta verification |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Optional meta verification |
| `NEXT_PUBLIC_OG_IMAGE` | Optional absolute OG image URL |
| `API_BASE_URL` | NestJS origin; empty = fixture catalog |

## Fixture vs remote

- Empty `API_BASE_URL` → `isRemoteCatalog` false; serve `fleet.ts` fixtures.
- Set e.g. `API_BASE_URL=http://localhost:4000` → server calls Nest `/v1/...`.

Fixture FX rates in `src/domain/currency/currencies.ts` are illustrative only. Do not use them for settlement.

## Rules

- Never commit `.env.local` or secrets.
- Prefer changing env over hard-coding site URL / GTM / verification ids.
- `NEXT_PUBLIC_*` values are browser-visible; keep secrets server-only (`API_BASE_URL` is server-side).
