# Catalog responses for NestJS

The Next.js server calls Nest at `API_BASE_URL`. Paths below have no `/api` prefix. Every JSON body uses this envelope. The frontend reads `data` and rejects a payload that does not match.

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

Failure:

```json
{
  "success": false,
  "error": "MARKET_REQUIRED",
  "message": "A known country and city are required.",
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

Prices are integers in minor units. `13500` with `"currency": "AED"` is AED 135.00. Every supported currency uses two decimal places: `AED`, `USD`, `EUR`, `GBP`, `SAR`, `MAD`.

A car that does not exist is HTTP 200 with `"data": null`. An HTTP 404 is treated as an upstream failure, not as an empty page.

## 1. Search box

`GET /v1/catalog/suggestions?country=ae&city=dubai&q=bmw`

`data` is an array, at most 8 items. `q` shorter than 2 characters returns an empty array. `kind` decides the object shape.

```json
{
  "success": true,
  "data": [
    {
      "kind": "make",
      "slug": "bmw",
      "label": "BMW"
    },
    {
      "kind": "model",
      "slug": "4-series",
      "makeSlug": "bmw",
      "label": "BMW 4 Series"
    },
    {
      "kind": "bodyType",
      "slug": "suv",
      "messageKey": "suv"
    },
    {
      "kind": "famous",
      "slug": "no-deposit",
      "messageKey": "noDeposit"
    }
  ],
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

`bodyType.slug` and `bodyType.messageKey` are the same value: `economy`, `sedan`, `suv`, `luxury`, `sports`, `van`, `convertible`.

`famous.messageKey` is one of: `cheapDaily`, `suv`, `luxury`, `sports`, `monthly`, `noDeposit`, `airport`, `sevenSeater`. `famous.slug` is `cheap-daily`, `suv`, `luxury`, `sports`, `monthly`, `no-deposit`, `airport`, `seven-seater`.

## 2. Search page

`GET /v1/catalog/search?country=ae&city=dubai&locale=en&sort=recommended&page=1&limit=12`

The city and country homepages send `limit=6`. Other catalog pages send `limit=12`. Never send a page larger than 48.

Optional filters, sent only when the page uses them:

| Query | Values |
| --- | --- |
| `make` | `bmw` |
| `model` | `4-series` |
| `bodyType` | `economy`, `sedan`, `suv`, `luxury`, `sports`, `van`, `convertible` |
| `q` | free text, max 80 characters |
| `deposit` | `none` |
| `term` | `monthly` |
| `pickup` | `airport` |
| `seats` | `7` means seven seats or more |
| `sort` | `recommended`, `price_asc`, `price_desc` |
| `locale` | `en`, `es`, `ar`, `fr`, `pt` |

`country` and `city` are slugs (`ae`, `dubai`), not display names. Nest filters the rows. The frontend renders `items` as received.

`recommended` puts `featured: true` first, then the lower daily price. `price_asc` and `price_desc` sort on `dailyPriceMinor`.

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ae-dubai-kia-picanto",
        "slug": "kia-picanto",
        "country": "ae",
        "city": "dubai",
        "currency": "AED",
        "make": "Kia",
        "makeSlug": "kia",
        "model": "Picanto",
        "modelSlug": "picanto",
        "bodyType": "economy",
        "seats": 4,
        "transmission": "automatic",
        "dailyPriceMinor": 13500,
        "monthlyPriceMinor": 297000,
        "depositRequired": false,
        "airportDelivery": true,
        "supplier": "Sable Drive",
        "featured": true,
        "searchText": "kia picanto economy",
        "seo": {
          "title": {
            "en": "Kia Picanto rental in Dubai",
            "ar": "تأجير كيا بيكانتو في دبي"
          },
          "description": {
            "en": "Compare the Kia Picanto in Dubai from local suppliers."
          }
        }
      }
    ],
    "total": 16,
    "page": 1,
    "limit": 12
  },
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

No matches is still HTTP 200:

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "limit": 12
  },
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

`total` is the full match count, not the length of `items`. `monthlyPriceMinor` is `null` when the car has no monthly rate. `seo` may be omitted. `searchText` is required; use a lowercase string of make, model, and body type.

`transmission` is `automatic` or `manual`. `id` is stable and unique. `slug` is `{makeSlug}-{modelSlug}`.

## 3. Detail page

The public URL is:

`/details/index/search-car-rentals-dubai/Kia/Picanto?id=ae-dubai-kia-picanto`

When `id` is present the server calls:

`GET /v1/catalog/listings/ae-dubai-kia-picanto`

`data` is one listing, the same object as an item in search. The car is shown only when `data.city` equals the city in the URL.

```json
{
  "success": true,
  "data": {
    "id": "ae-dubai-kia-picanto",
    "slug": "kia-picanto",
    "country": "ae",
    "city": "dubai",
    "currency": "AED",
    "make": "Kia",
    "makeSlug": "kia",
    "model": "Picanto",
    "modelSlug": "picanto",
    "bodyType": "economy",
    "seats": 4,
    "transmission": "automatic",
    "dailyPriceMinor": 13500,
    "monthlyPriceMinor": 297000,
    "depositRequired": false,
    "airportDelivery": true,
    "supplier": "Sable Drive",
    "featured": true,
    "searchText": "kia picanto economy",
    "seo": {
      "title": {
        "en": "Kia Picanto rental in Dubai",
        "ar": "تأجير كيا بيكانتو في دبي"
      },
      "description": {
        "en": "Compare the Kia Picanto in Dubai from local suppliers."
      }
    }
  },
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

Unknown id:

```json
{
  "success": true,
  "data": null,
  "meta": {
    "requestId": "6f1c0b3e-1c2a-4d5e-9f10-0a1b2c3d4e5f",
    "timestamp": "2026-10-26T14:00:00.000Z"
  }
}
```

If the URL has no `id`, the fallback call is:

`GET /v1/catalog/listings/kia-picanto?country=ae&city=dubai`

Same listing object. Same `data: null` when that slug is not in that city.
