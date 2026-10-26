import "server-only";

import { serverEnv } from "@/lib/config/env";

export function siteOrigin(): string {
  return serverEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

export function moroccoOrigin(): string {
  return (serverEnv.NEXT_PUBLIC_MA_SITE_URL ?? "https://www.gleecars.ma").replace(/\/$/, "");
}

export function originForCountry(country: string): string {
  return country === "ma" ? moroccoOrigin() : siteOrigin();
}

export function hostOf(origin: string): string {
  return new URL(origin).host;
}

export function managedHosts(): string[] {
  return [...new Set([hostOf(siteOrigin()), hostOf(moroccoOrigin())])];
}

export function absoluteUrl(country: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${originForCountry(country)}${normalized}`;
}
