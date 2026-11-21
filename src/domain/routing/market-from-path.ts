import { isLocale } from "@/domain/geo/locales";
import { listMarkets, type Market } from "@/domain/geo/markets";
import { parseRentPath } from "@/domain/routing/rent-paths";

export function marketFromPathname(pathname: string): Market | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const slug =
    segments[0] && isLocale(segments[0]) ? segments.slice(1) : segments;

  if (slug[0] === "company" && slug[1]) {
    const city = slug[1].toLowerCase();
    return listMarkets().find((market) => market.city === city);
  }

  return parseRentPath(slug)?.market;
}
