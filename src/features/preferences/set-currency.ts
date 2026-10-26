"use server";

import { cookies } from "next/headers";

import { isCurrencyCode } from "@/domain/currency/currencies";
import { site } from "@/lib/config/site";

export async function setDisplayCurrency(code: string) {
  if (!isCurrencyCode(code)) {
    return;
  }

  const store = await cookies();
  store.set(site.currencyCookie, code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
  });
}
