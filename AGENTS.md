<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## GleeCars web

Public marketplace. Read `docs/architecture.md` before adding features.

- Routes live under `src/app/[locale]`. Catalog I/O goes through `src/server`.
- Do not import `src/domain/catalog/fleet.ts` into a Client Component.
- `API_BASE_URL` switches the repository from the fixture catalog to NestJS.
- UI copy is in `messages/`. A new locale has to land in `LOCALES`, every `LocalizedName`, and a message file together.

