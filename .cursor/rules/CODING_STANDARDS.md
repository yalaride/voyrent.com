# Coding standards

## TypeScript

- Prefer explicit domain types from `src/domain` over ad-hoc inline shapes at boundaries.
- Validate external JSON with Zod (`src/domain/**/contract.ts`, env in `src/lib/config/env.ts`).
- Fail closed on invalid upstream: map to `502` / `INVALID_UPSTREAM` rather than rendering bad data.
- Avoid `any`. Narrow with Zod or typed guards.

## Imports

| From | May import |
| --- | --- |
| `app`, `features` | `server`, `domain`, `components`, `i18n`, `lib` |
| `server` | `domain`, `lib` |
| `domain` | other `domain` only (no React, no fetch) |
| Client Components | `domain` types/helpers, not `server` or `fleet.ts` |

Mark server-only modules with `import "server-only"` when they must not leak to the client.

## Style

- Match existing file naming: kebab-case for files (`listing-card.tsx`).
- Prefer Server Components; add `"use client"` only for interactivity, browser APIs, or local UI state.
- Keep pages thin; put UI in `src/features/<capability>/`.
- Do not add `useMemo` / `useCallback` by default unless the codebase already needs them for that pattern.

## Errors and empty states

- Prefer machine error codes from the BFF envelope for API failures.
- Do not fake success for enquiries when NestJS is disconnected (`501`).
- Unknown markets → not-found / `MARKET_REQUIRED` as existing handlers define.
