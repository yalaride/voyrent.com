# Markets, languages, and currencies

## Languages

Supported locales live in `src/domain/geo/locales.ts`: `en`, `es`, `ar`, `fr`, `pt`. Arabic is right-to-left. The URL always carries the locale (`/ar/ae/dubai`) so each language has a stable address.

Copy lives in `messages/{locale}.json`. City and country names live on the market records, not in the message files, because they are data.

To add a language:

1. Add the code to `LOCALES`.
2. Add `messages/{code}.json` with the same keys as `messages/en.json`.
3. Fill the new locale on every `LocalizedName`. TypeScript fails the build until those names exist.
4. Add a loader branch in `src/i18n/request.ts`.

## Markets

A market is a country plus a city: `/en/ae/dubai`. Country codes are lowercase ISO 3166-1 alpha-2. City slugs are stable English slugs.

The fixture list is `src/domain/geo/markets.ts`. Each country has one default currency. Premium cities also receive the luxury and sports cars that are not offered in every city.

`generateStaticParams` prerenders every known market. An unknown city renders the not-found page.

## Currency

The market currency is the default. A visitor can override it. The choice is stored in the `gc_currency` cookie and applied when prices are rendered. Listing amounts stay in the supplier currency; conversion happens at display time with the fixture rates in `src/domain/currency/currencies.ts`.

Those rates are illustrative. NestJS should replace `GET /v1/reference/currencies` with a real rate source. Do not use the fixture rates for settlement.

## Search

The home search submits to `/{locale}/{country}/{city}/search`. Make, model, and body type are exact. Free text matches make, model, body type, and the popular-search phrases in every supported language. Popular searches are structured presets (for example economy plus lowest price, or no deposit) so the URL stays explicit.
