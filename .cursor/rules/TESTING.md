# Testing

There is no unit/e2e test suite checked in yet. Until one exists, treat the following as the required verification bar for every change.

## Required checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Manual verification (feature work)

1. Fixture mode: `API_BASE_URL` empty → home, search, listing, currency switch, locale switch.
2. Remote mode (when Nest is up): set `API_BASE_URL`, confirm `/api/v1/health` reports `catalog: remote`.
3. RTL: spot-check `/ar/...` layout direction and copy.
4. Unknown market / bad slug → not-found, not a crash.
5. Enquiry without Nest → `501`, UI does not claim success.

## When adding automated tests later

- Prefer testing `domain` search/filter rules and Zod contracts first (pure, fast).
- Keep repository tests at the envelope/contract boundary.
- Avoid coupling UI tests to fixture fleet internals; go through public BFF or repository APIs.
- Do not snapshot entire Nest payloads; assert contract fields that the UI depends on.
