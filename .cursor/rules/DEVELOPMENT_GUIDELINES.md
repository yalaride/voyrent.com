# Development guidelines

## Before coding

1. Read `docs/architecture.md` and the matching rule in this folder.
2. Confirm whether the change is route (`app`), UI (`features`), pure logic (`domain`), or I/O (`server`).
3. Check Next.js docs under `node_modules/next/dist/docs/` — this Next version may differ from training data.

## Workflow

```bash
npm install
cp .env.example .env.local   # leave API_BASE_URL empty for fixtures
npm run dev                  # http://localhost:3010
npm run typecheck
npm run lint
npm run build
```

Use **npm**. Node `>=20`.

## Feature checklist

- [ ] Thin `page.tsx` — data fetch + compose features
- [ ] Repository used for catalog/search/suggestions (no direct fleet import in client)
- [ ] Copy updated in **all** `messages/*.json` files
- [ ] New locale? Update `LOCALES`, every `LocalizedName`, message file, and `src/i18n/request.ts`
- [ ] Currency/prices behind Suspense when cookie-dependent
- [ ] Search params behind Suspense when request-dependent
- [ ] SEO/canonical impact reviewed if URL shape changes (`docs/seo.md`)

## Do not

- Fetch NestJS from the browser
- Put product logic in `src/components/ui`
- Invent a client-side catalog cache that bypasses `src/server`
- Commit secrets or real API keys
