import "server-only";

import { cookies } from "next/headers";

import { isCurrencyCode, type CurrencyCode } from "@/domain/currency/currencies";
import { site } from "@/lib/config/site";

export async function getDisplayCurrency(fallback: CurrencyCode): Promise<CurrencyCode> {
  const store = await cookies();
  const selected = store.get(site.currencyCookie)?.value;

  if (selected && isCurrencyCode(selected)) {
    return selected;
  }

  return fallback;
}
