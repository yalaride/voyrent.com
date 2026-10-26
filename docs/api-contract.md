# API contract

The browser calls this Next.js app. This app calls NestJS only from the server. Paths below are the public BFF. NestJS should expose the same paths without the `/api` prefix (`/v1/...`) and wrap payloads in the envelope.

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

Prices are integers in minor units (fils, cents). Every currency currently supported uses a two-digit exponent.

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/health` | `status`, `service`, `catalog` (`fixture` or `remote`) |
| GET | `/api/v1/reference/languages` | Locales, native names, direction |
| GET | `/api/v1/reference/markets` | Countries, currencies, cities, localized names |
| GET | `/api/v1/reference/currencies` | Codes and fixture units per 1 USD |
| GET | `/api/v1/catalog/makes?country&city` | Makes that have cars in the market |
| GET | `/api/v1/catalog/models?country&city` | Models in the market |
| GET | `/api/v1/catalog/suggestions?country&city&q` | Make, model, body type, and popular-search matches |
| GET | `/api/v1/catalog/search` | Filtered page of listings |
| GET | `/api/v1/catalog/listings/:slug?country&city` | One listing |
| POST | `/api/v1/enquiries` | Booking request. `501` until NestJS is connected |

Search query parameters:

`country`, `city`, `locale`, `make`, `model`, `bodyType`, `q`, `deposit=none`, `term=monthly`, `pickup=airport`, `seats`, `sort` (`recommended`, `price_asc`, `price_desc`), `page`, `limit` (max 48).

`bodyType` is one of `economy`, `sedan`, `suv`, `luxury`, `sports`, `van`, `convertible`.

Unknown filters are ignored. An unknown market is `400` with code `MARKET_REQUIRED`.

## Enquiry body

`listingId`, `name`, `email`, `phone`, optional `message`.

## Connecting NestJS

Set `API_BASE_URL` to the Nest origin, for example `http://localhost:4000`. No frontend URL changes. The repository appends `/v1/...`. A payload that does not match the Zod contract becomes `502` `INVALID_UPSTREAM` instead of rendering bad data.
