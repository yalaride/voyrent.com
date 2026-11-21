import "server-only";

import { cookies } from "next/headers";

import { getMarket, type Market } from "@/domain/geo/markets";
import { site } from "@/lib/config/site";

/** The region the visitor saved. Undefined until they choose one in Display Settings. */
export async function readStoredMarket(): Promise<Market | undefined> {
  const store = await cookies();
  const selected = store.get(site.marketCookie)?.value;
  const separator = selected?.indexOf(":") ?? -1;

  if (selected && separator > 0) {
    return getMarket(selected.slice(0, separator), selected.slice(separator + 1));
  }

  return undefined;
}

export async function getPreferredMarket(): Promise<Market | undefined> {
  return (await readStoredMarket()) ?? getMarket(site.defaultCountry, site.defaultCity);
}
