import { parseVehicleSearch, type RawSearchParams } from "@/domain/catalog/params";
import { DEFAULT_LOCALE, isLocale } from "@/domain/geo/locales";
import { searchCatalog } from "@/server/catalog/catalog";
import { jsonError, jsonOk, runRoute } from "@/server/http/envelope";
import { resolveMarket } from "@/server/reference/repository";

export async function GET(request: Request) {
  return runRoute(async () => {
    const url = new URL(request.url);
    const raw = Object.fromEntries(url.searchParams.entries()) as RawSearchParams;
    const country = typeof raw.country === "string" ? raw.country : "";
    const city = typeof raw.city === "string" ? raw.city : "";
    const market = await resolveMarket(country, city);

    if (!market) {
      return jsonError(400, "MARKET_REQUIRED", "A known country and city are required.");
    }

    const localeValue = typeof raw.locale === "string" ? raw.locale : undefined;
    const locale = localeValue && isLocale(localeValue) ? localeValue : DEFAULT_LOCALE;

    return jsonOk(await searchCatalog(parseVehicleSearch(raw, market, locale)));
  });
}
