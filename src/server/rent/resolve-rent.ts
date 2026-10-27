import { makeFromKeyword } from "@/domain/catalog/directory";
import { parseVehicleSearch, type RawSearchParams, type VehicleSearchQuery } from "@/domain/catalog/params";
import type { AppLocale } from "@/domain/geo/locales";
import { catalogPath, parseRentPath, queryFromView, type RentView } from "@/domain/routing/rent-paths";

export function rentView(slug: string[]): RentView | undefined {
  return parseRentPath(slug);
}

export function searchQueryFor(view: RentView, raw: RawSearchParams, locale: AppLocale): VehicleSearchQuery {
  const base = queryFromView(view);
  const query = parseVehicleSearch(raw, view.market, locale, {
    limit: view.kind === "country" ? 6 : 12,
  });

  return {
    ...query,
    make: base.make ?? query.make,
    model: base.model ?? query.model,
    bodyType: base.bodyType ?? query.bodyType,
    deposit: base.deposit ?? query.deposit,
    term: base.term ?? query.term,
    pickup: base.pickup ?? query.pickup,
    seats: base.seats ?? query.seats,
  };
}

export function pathCanonical(slug: string[], raw: RawSearchParams, locale: AppLocale): string | undefined {
  const view = rentView(slug);
  if (!view || view.kind === "listing") return undefined;

  if (view.kind === "country") {
    const query = searchQueryFor(view, raw, locale);
    if (!query.q && query.page === 1 && query.sort === "recommended" && !hasExtraFilter(view, query)) {
      return undefined;
    }

    const keywordMake = query.q ? makeFromKeyword(query.q) : undefined;
    return catalogPath(view.market.city, {
      ...query,
      make: keywordMake?.slug ?? query.make,
      q: keywordMake ? undefined : query.q,
    });
  }

  const query = searchQueryFor(view, raw, locale);
  const keywordMake = view.kind === "city" && query.q ? makeFromKeyword(query.q) : undefined;
  const target = catalogPath(view.market.city, {
    ...query,
    make: keywordMake?.slug ?? query.make,
    q: keywordMake ? undefined : query.q,
  });
  const targetPath = target.split("?")[0];
  const current = `/${slug.join("/")}`;

  return targetPath && targetPath !== current ? target : undefined;
}

export function isIndexable(view: RentView, query: VehicleSearchQuery): boolean {
  if (view.kind === "listing") return true;
  return !query.q && query.page === 1 && query.sort === "recommended" && !hasExtraFilter(view, query);
}

function hasExtraFilter(view: RentView, query: VehicleSearchQuery): boolean {
  const base = queryFromView(view);
  if (query.bodyType && query.bodyType !== base.bodyType) return true;
  if (query.deposit && query.deposit !== base.deposit) return true;
  if (query.term && query.term !== base.term) return true;
  if (query.pickup && query.pickup !== base.pickup) return true;
  if (query.seats && query.seats !== base.seats) return true;
  if (query.make && query.make !== base.make) return true;
  if (query.model && query.model !== base.model) return true;
  return false;
}
