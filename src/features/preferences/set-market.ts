"use server";

import { cookies } from "next/headers";

import { getMarket } from "@/domain/geo/markets";
import { site } from "@/lib/config/site";

export async function setPreferredMarket(country: string, city: string) {
  const market = getMarket(country, city);
  if (!market) {
    return;
  }

  const store = await cookies();
  store.set(site.marketCookie, `${market.country}:${market.city}`, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
  });
}
