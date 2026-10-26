import { getListing } from "@/server/catalog/catalog";
import { jsonError, jsonOk, runRoute } from "@/server/http/envelope";
import { resolveMarket } from "@/server/reference/repository";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  return runRoute(async () => {
    const { slug } = await context.params;
    const url = new URL(request.url);
    const country = url.searchParams.get("country") ?? "";
    const city = url.searchParams.get("city") ?? "";

    if (!(await resolveMarket(country, city))) {
      return jsonError(400, "MARKET_REQUIRED", "A known country and city are required.");
    }

    const listing = await getListing(country, city, slug);

    if (!listing) {
      return jsonError(404, "LISTING_NOT_FOUND", "No listing matches that car in this city.");
    }

    return jsonOk(listing);
  });
}
