# API integration

The browser talks only to this Next.js origin. NestJS is called from the server.

## Envelope

Success:

```json
{
  "success": true,
  "data": {},
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601" }
}
```

Failure:

```json
{
  "success": false,
  "error": "MACHINE_CODE",
  "message": "Human readable message.",
  "meta": { "requestId": "uuid", "timestamp": "ISO-8601" },
  "errors": [{ "field": "email", "constraints": ["Invalid email"] }]
}
```

Prices are integers in minor units. Current currencies use a two-digit exponent.

## Public BFF (`/api/v1`)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | `catalog`: `fixture` or `remote` |
| GET | `/reference/languages` | Locales, native names, direction |
| GET | `/reference/markets` | Countries, cities, currencies |
| GET | `/reference/currencies` | Codes and units per 1 USD |
| GET | `/catalog/suggestions` | Make/model/body/popular matches |
| GET | `/catalog/search` | Filtered listings page |
| GET | `/catalog/listings/:slug` | One listing |
| POST | `/enquiries` | `501` until NestJS connected |

NestJS should expose the same paths **without** the `/api` prefix (`/v1/...`) and use the same envelope. The repository appends `/v1/...` to `API_BASE_URL`.

## Rules

- All catalog I/O through `src/server/catalog` (and related server modules).
- Validate upstream with Zod before UI use.
- Invalid upstream → `502` `INVALID_UPSTREAM`.
- Unknown filters ignored; unknown market → `400` `MARKET_REQUIRED`.
- Search params: `country`, `city`, `locale`, `make`, `model`, `bodyType`, `q`, `deposit`, `term`, `pickup`, `seats`, `sort`, `page`, `limit` (max 48).

See `docs/api-contract.md` and `docs/catalog-responses.md` for full contracts.
