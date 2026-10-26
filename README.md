# GleeCars

Public marketplace for comparing rental cars across cities, languages, and currencies.

## Scripts

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
```

The dev server listens on port 3010.

## Configuration

Copy `.env.example` to `.env.local`. Leave `API_BASE_URL` empty to use the fixture catalog. Set it to the NestJS origin when that service is ready. See `docs/architecture.md` and `docs/api-contract.md`.
