# Catalog API for NestJS

The browser never calls Nest. It calls this Next.js app. The Next.js server calls Nest at `API_BASE_URL`.

Nest paths have no `/api` prefix. Example: `GET {API_BASE_URL}/v1/catalog/search?...`

## URLs are a frontend job

Do not return a website path, canonical URL, or `href` from Nest.

Nest returns fields (`id`, `city`, `make`, `makeSlug`, `model`, `modelSlug`, and the filters below). The frontend builds every public link from those fields. Language is only a prefix on the frontend (`/ar/...`). English has no prefix. Currency is a cookie and is not part of the URL.

| What the visitor opens | Public URL the frontend builds | Nest call the page then makes |
| --- | --- | --- |
| Dubai home | `/` | `GET /v1/catalog/search?country=ae&city=dubai&locale=en&sort=recommended&page=1&limit=6` |
| Other country home | `/morocco/car-rental` | same search, `limit=6`, that country's primary city |
| View all cars | `/rent-a-car-dubai` | `GET /v1/catalog/search?...&limit=12` |
| One make | `/rent-bmw-car-dubai` | `GET /v1/catalog/search?...&make=bmw&limit=12` |
| One model | `/rent-bmw-4-series-dubai` | `GET /v1/catalog/search?...&make=bmw&model=4-series&limit=12` |
| Body type, monthly, airport, no deposit, 7 seats | see the landing table below | `GET /v1/catalog/search?...` with that one filter |
| One car | `/details/index/search-car-rentals-dubai/Kia/Picanto?id=ae-dubai-kia-picanto` | `GET /v1/catalog/listings/ae-dubai-kia-picanto` |

Arabic example: `/ar/rent-a-car-dubai`. The Nest query gets `locale=ar`. The path segments stay English.

### How the frontend builds a link

```text
city catalog     /rent-a-car-{city}
make page        /rent-{makeSlug}-car-{city}
model page       /rent-{makeSlug}-{modelSlug}-{city}
car detail       /details/index/search-car-rentals-{city}/{Make}/{Model}?id={id}
```

`{city}`, `{makeSlug}`, and `{modelSlug}` are lowercase slugs: `dubai`, `bmw`, `4-series`.

`{Make}` and `{Model}` in the detail path are the display names with spaces turned into hyphens: `Kia`, `4-Series`, `Mercedes-Benz`. The real lookup is the `id` query. Nest does not need to build this string.

`slug` on a listing must be `{makeSlug}-{modelSlug}`, for example `kia-picanto`. That is not the public URL.

Landing paths, also built only on the frontend:

| Filter | Public URL |
| --- | --- |
| `bodyType=economy` | `/rent-cheap-economy-cars-dubai` |
| `bodyType=sedan` | `/rent-sedan-cars-in-dubai` |
| `bodyType=suv` | `/rent-4x4-suvs-in-dubai` |
| `bodyType=luxury` | `/rent-luxury-car-rental-dubai` |
| `bodyType=sports` | `/rent-sports-cars-in-dubai` |
| `bodyType=convertible` | `/rent-convertible-cars-dubai` |
| `bodyType=van` | `/van-rental-dubai` |
| `deposit=none` | `/rent-a-car-dubai-without-deposit` |
| `term=monthly` | `/rent-a-car-monthly-dubai-deals` |
| `seats=7` | `/7-seater-car-rental-dubai` |
| `pickup=airport` | `/rent-a-car-dubai-airport-delivery` |

Replace `dubai` with the city slug.

Brand pages the frontend can open today use these `makeSlug` values: `bmw`, `chevrolet`, `ford`, `hyundai`, `kia`, `mercedes-benz`, `nissan`, `porsche`, `range-rover`, `toyota`. A new brand URL needs that slug added on the frontend before `/rent-{makeSlug}-car-{city}` will resolve. Search results can still include the car.

## Envelope

Success:

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

Prices are integers in minor units. `13500` with `"currency": "AED"` is AED 135.00. Supported currencies, all with two decimal places: `AED`, `USD`, `EUR`, `GBP`, `SAR`, `MAD`.

A missing car is HTTP 200 with `"data": null`. An HTTP 404 is treated as an upstream failure, not as an empty page.

## 1. Search box

The visitor sees one field. Clicking it with an empty field shows a popular list that the frontend already has. Nest is not called until the visitor types at least 2 characters.

`GET /v1/catalog/suggestions?country=ae&city=dubai&q=bmw`

`data` is an array, at most 8 items. `q` shorter than 2 characters returns `[]`.

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

When the visitor picks a row, the frontend builds the public URL. Nest does not send that URL.

| `kind` | Fields you return | Page the frontend opens |
| --- | --- | --- |
| `make` | `slug`, `label` | `/rent-bmw-car-dubai` |
| `model` | `slug`, `makeSlug`, `label` | `/rent-bmw-4-series-dubai` |
| `bodyType` | `slug` and `messageKey` are the same body type | the landing path for that type |
| `famous` | `slug`, `messageKey` | the landing path for that shortcut |

`bodyType` values: `economy`, `sedan`, `suv`, `luxury`, `sports`, `van`, `convertible`.

`famous.slug` / `famous.messageKey`:

| `slug` | `messageKey` | Becomes |
| --- | --- | --- |
| `cheap-daily` | `cheapDaily` | economy, cheapest first |
| `suv` | `suv` | SUV landing |
| `luxury` | `luxury` | luxury landing |
| `sports` | `sports` | sports landing |
| `monthly` | `monthly` | monthly landing |
| `no-deposit` | `noDeposit` | no-deposit landing |
| `airport` | `airport` | airport landing |
| `seven-seater` | `sevenSeater` | 7-seat landing |

**View all cars** with an empty field opens `/rent-a-car-{city}`. No suggestion call. The search call is the one in section 2 with no extra filters.

**View all cars** with text: if the text is a known make (`bmw`, `BMW`), the frontend opens `/rent-bmw-car-dubai`. Any other text opens `/rent-a-car-dubai?keyword=picanto`, and the search call includes `q=picanto`.

## 2. Search page

This is the car list: city catalog, make, model, and landing pages.

`GET /v1/catalog/search?country=ae&city=dubai&locale=en&sort=recommended&page=1&limit=12`

The Dubai home and a country home send `limit=6`. Every other catalog page sends `limit=12`. Do not return more than 48 items in one page.

`country` and `city` are slugs (`ae`, `dubai`), not display names. Filter the rows in Nest. The frontend renders `items` as received and builds each car link itself.

Optional filters, sent only when that page uses them:

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
| `page` | `1` and up |

`recommended`: `featured: true` first, then the lower `dailyPriceMinor`. `price_asc` and `price_desc` sort only on `dailyPriceMinor`.

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

From that item the frontend card link is:

`/details/index/search-car-rentals-dubai/Kia/Picanto?id=ae-dubai-kia-picanto`

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

`transmission` is `automatic` or `manual`. `id` is stable and unique across cities. `slug` is `{makeSlug}-{modelSlug}` and can repeat in another city. The pair `country` + `city` + `slug` is unique.

Examples of which public page sends which query:

| Public page | Extra query on `/v1/catalog/search` |
| --- | --- |
| `/rent-a-car-dubai` | none |
| `/rent-bmw-car-dubai` | `make=bmw` |
| `/rent-bmw-4-series-dubai` | `make=bmw&model=4-series` |
| `/rent-4x4-suvs-in-dubai` | `bodyType=suv` |
| `/rent-a-car-dubai-without-deposit` | `deposit=none` |
| `/rent-a-car-monthly-dubai-deals` | `term=monthly` |
| `/7-seater-car-rental-dubai` | `seats=7` |
| `/rent-a-car-dubai-airport-delivery` | `pickup=airport` |

## 3. Detail page

The frontend builds this public URL from the listing fields:

`/details/index/search-car-rentals-dubai/Kia/Picanto?id=ae-dubai-kia-picanto`

It then loads the car with the id, not by parsing a URL you invented:

`GET /v1/catalog/listings/ae-dubai-kia-picanto`

`data` is one listing, the same object as an item in search. The page is shown only when `data.city` equals the city in the public URL (`dubai`).

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

If the public URL has no `id`, the fallback call is:

`GET /v1/catalog/listings/kia-picanto?country=ae&city=dubai`

The path segment `kia-picanto` is `slug`, which is `{makeSlug}-{modelSlug}`. Same listing object. Same `data: null` when that slug is not in that city.

`seo.title` and `seo.description` are optional maps keyed by locale (`en`, `es`, `ar`, `fr`, `pt`). When a locale is missing, the frontend writes the title from the car name and the city.
