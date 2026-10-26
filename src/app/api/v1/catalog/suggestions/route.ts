import { listSuggestions } from "@/server/catalog/catalog";
import { jsonError, jsonOk, runRoute } from "@/server/http/envelope";
import { resolveMarket } from "@/server/reference/repository";

export async function GET(request: Request) {
  return runRoute(async () => {
    const url = new URL(request.url);
    const country = url.searchParams.get("country") ?? "";
    const city = url.searchParams.get("city") ?? "";
    const q = url.searchParams.get("q") ?? "";

    if (!(await resolveMarket(country, city))) {
      return jsonError(400, "MARKET_REQUIRED", "A known country and city are required.");
    }

    return jsonOk(await listSuggestions(country, city, q));
  });
}
