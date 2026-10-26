# SEO

`.com` opens `https://www.oneclickdrive.com/`. The address stays `/`. It does not redirect to `/rent-a-car-dubai`. Dubai is the default market rendered on that root. Choosing a city changes the path, for example `/rent-a-car-abu-dhabi`.

Language adds only a prefix and keeps the same page: `/es`, `/ar/`, `/fr/location-voiture-dubai` is a French exception. Currency is a cookie (`currency=USD`) and the URL does not change.

GleeCars follows the same default: `/` and `/ar` are the Dubai homepage. City, make, and listing paths stay as documented below.

| Page | URL |
| --- | --- |
| Country hub | `/`, `/morocco/car-rental`, `/saudi-arabia/car-rental`, `/uk/car-rental`, `/spain/car-rental` |
| City catalog | `/rent-a-car-dubai` |
| Arabic city | `/ar/rent-a-car-dubai` |
| Make | `/rent-bmw-car-dubai` |
| Model | `/rent-bmw-4-series-dubai` |
| Body type | `/rent-4x4-suvs-in-dubai`, `/rent-sedan-cars-in-dubai`, `/rent-cheap-economy-cars-dubai` |
| No deposit | `/rent-a-car-dubai-without-deposit` |
| Monthly | `/rent-a-car-monthly-dubai-deals` |
| Listing | `/details/index/search-car-rentals-dubai/Kia/Picanto?id={id}` |

A keyword that is a known make redirects to the make path. Currency stays in the `gc_currency` cookie and is not part of the canonical URL. Supplier currency is what structured data advertises, so the indexed price does not change when a visitor switches display currency.

Every country stays on `NEXT_PUBLIC_SITE_URL`. Canonical, hreflang, sitemap, and Open Graph use that origin. hreflang includes the language and a region variant such as `en-AE` and `ar-MA`.

## Values to replace later

Set these in `.env.local`. No code change is required.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GTM_ID` (`GTM-XXXX`)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_OG_IMAGE`

Tag Manager renders only when the id is set. `sitemap.xml` and `robots.txt` are generated from the market list.

## Dynamic copy from the API

UI chrome comes from `messages/{locale}.json`. Listing titles and descriptions prefer `listing.seo.title[locale]` when NestJS sends that object. Otherwise the template in `src/server/seo/metadata.ts` is used. Slugs stay language-neutral. The catalog request already sends `locale`, so translated names can replace the fixture strings without a route change.
